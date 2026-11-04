#!/usr/bin/env python3
"""
academic_convert.py — Geometry-Aware Academic PDF & EPUB to Markdown Converter.

Built for scholarly literature, theological monographs, and patristic editions.
Solves the 5 classical failures of naive PDF/EPUB extraction:
1. Two-column layouts (Recherches de science religieuse, Patrologia Graeca)
2. Running headers and footers embedded in sentences
3. Hyphenated word breaks and artificial hard line-wraps
4. Calibre presentational tag pollution and phantom spine links in EPUBs
5. Preservation of printed folios ([p. 142]{#p.142}) for exact thesis citation.
"""

import os
import sys
import re
import argparse
import statistics
import subprocess

# ─────────────────────────────────────────────────────────────────────────────
# 1. EPUB Conversion Engine
# ─────────────────────────────────────────────────────────────────────────────

PANDOC_TO = (
    "markdown-raw_html-native_divs-native_spans"
    "-simple_tables-multiline_tables-grid_tables"
)
ORPHAN_HEADING = re.compile(r"^\(?[^A-Za-zÀ-ÿ]*\(([^)]*)\)[^A-Za-zÀ-ÿ]*$")


def run_pandoc_epub(epub_path):
    """Convert EPUB to raw Markdown using Pandoc with custom dialect."""
    cmd = ["pandoc", "-t", PANDOC_TO, "--wrap=none", "--markdown-headings=atx", epub_path]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    except FileNotFoundError:
        sys.exit("Error: Pandoc is not installed or not on PATH. Please install Pandoc first.")
    if res.returncode != 0:
        raise RuntimeError(f"Pandoc conversion failed: {res.stderr}")
    return res.stdout


def clean_epub_markdown(md):
    """Strip Calibre scaffolding, unwrap nested classes, and clean spine targets."""
    # 1. Raw HTML blocks and spans
    md = re.sub(r"```\{=html\}.*?```", "", md, flags=re.S)
    md = re.sub(r"`[^`]*`\{=html\}", "", md)

    # 2. Cover images and raw SVG
    md = re.sub(r'!\[[^\]]*\]\((?:[^()]|\([^()]*\))*\)(\{[^}]*\})?', "", md)

    # 3. Anchor-only spans and empty links from ebook spine
    md = re.sub(r"\[\]\{#[^}]*\}", "", md)
    md = re.sub(r"\[\]\((?:[^()]|\([^()]*\))*\)", "", md)

    # 4. Recursively unwrap nested presentational spans: [text]{.calibre}, [text]{lang="ES-TRAD"}
    prev = None
    while prev != md:
        prev = md
        md = re.sub(r"\[([^\[\]]*)\]\{[^{}]*\}", r"\1", md)

    # 5. Drop internal spine targets (e.g., [Chapter 1](#part0001.html__id2) -> Chapter 1)
    md = re.sub(r"\[([^\[\]]+)\]\(#[^)]*\)", r"\1", md)

    # 6. Remove stray attribute blocks
    md = re.sub(r'\{(?:[.#][^{}\s]+|[\w-]+="[^"]*")(?:\s[^{}]*)?\}', "", md)

    # 7. Normalise headings left holding only emphasis markers
    md = re.sub(r"^(#{1,6})\s+\*{0,3}(.*?)\*{0,3}\s*$", r"\1 \2", md, flags=re.M)
    md = re.sub(r"^(#{1,6}) +", r"\1 ", md, flags=re.M)

    # 8. Merge orphan parenthetical headings (e.g. date subtitles) into the heading above
    lines, out = md.split("\n"), []
    for line in lines:
        m = re.match(r"^(#{1,6}) (.+?)\s*$", line)
        if m and ORPHAN_HEADING.match(m.group(2)):
            if out and out[-1].startswith("#"):
                out[-1] = out[-1] + f" ({m.group(2).strip('()')})"
                continue
        out.append(line)
    md = "\n".join(out)

    return md


# ─────────────────────────────────────────────────────────────────────────────
# 2. PDF Geometry-Aware Layout Engine
# ─────────────────────────────────────────────────────────────────────────────

MIN_GUTTER_PT = 10.0
SPAN_FRAC = 0.60  # lines wider than 60% of text block span across columns

_PAGENO = re.compile(
    r"^(?:\[\s*(\d{1,4})\s*\]|\(\s*(\d{1,4})\s*\)|"
    r"(?:p\.|pag\.|page|pág\.)\s*(\d{1,4})|"
    r"[-–—]\s*(\d{1,4})\s*[-–—]|(\d{1,4}))$",
    re.I,
)

_HYPHEN_END = re.compile(r"(\w)[-‐­]$")
_MARKER = re.compile(
    r"^\s*("
    r"\d{1,3}[.)]|"
    r"[IVXLC]{1,5}[.)]|"
    r"[a-z][.)]\s|"
    r"[-–—•*]\s|"
    r"[VR]/\.?"
    r")"
)


def _folio_value(text):
    """Extract integer page number from a decorated folio string."""
    m = _PAGENO.fullmatch(text.strip())
    if not m:
        return None
    for g in m.groups():
        if g:
            return int(g)
    return None


def extract_page_lines(pg):
    """Extract all text lines with bounding-box geometry: [x0, x1, ytop, ybot, text]."""
    from pdfminer.layout import LTTextLine

    out, stack = [], [pg]
    while stack:
        for el in stack.pop():
            if isinstance(el, LTTextLine):
                t = el.get_text().strip()
                if t:
                    out.append([el.x0, el.x1, el.y1, el.y0, t])
            elif hasattr(el, "__iter__"):
                stack.append(el)
    # Sort primarily top-to-bottom, secondarily left-to-right
    out.sort(key=lambda l: (-l[2], l[0]))
    return out


def detect_columns(lines):
    """Identify column x-extents from interior gutters, ignoring folios and spanning headers."""
    if not lines:
        return []
    x0 = min(l[0] for l in lines)
    x1 = max(l[1] for l in lines)
    block_width = x1 - x0

    # Filter out folios and short lines for geometry calculation
    geo = [l for l in lines if (l[1] - l[0]) >= 20.0 and not _PAGENO.fullmatch(l[4])]
    if not geo:
        return [(x0, x1)]

    # Discard spanning headings for column boundary determination
    body = [l for l in geo if (l[1] - l[0]) <= block_width * SPAN_FRAC] or geo
    spans = sorted((l[0], l[1]) for l in body)
    merged = [list(spans[0])]
    for a, b in spans[1:]:
        if a <= merged[-1][1] + 0.5:
            merged[-1][1] = max(merged[-1][1], b)
        else:
            merged.append([a, b])

    cols, cur = [], list(merged[0])
    for a, b in merged[1:]:
        if a - cur[1] >= MIN_GUTTER_PT:
            cols.append(tuple(cur))
            cur = [a, b]
        else:
            cur[1] = max(cur[1], b)
    cols.append(tuple(cur))

    # Validate that columns hold real text share (discard margin notes < 15%)
    share = [0] * len(cols)
    for l in geo:
        best, bi = 0.0, None
        for i, (a, b) in enumerate(cols):
            ov = min(l[1], b) - max(l[0], a)
            if ov > best:
                best, bi = ov, i
        if bi is not None:
            share[bi] += len(l[4])
    total = sum(share) or 1
    keep = [c for c, sh in zip(cols, share) if sh / total >= 0.15]
    return keep if len(keep) >= 2 else [(x0, x1)]


def assign_lines_to_columns(lines, cols):
    """Distribute lines into columns; lines spanning >60% of the block stay in column 0."""
    buckets = [[] for _ in cols]
    block_width = cols[-1][1] - cols[0][0] if len(cols) > 1 else cols[0][1] - cols[0][0]

    for l in lines:
        best, bi = 0.0, 0
        for i, (a, b) in enumerate(cols):
            ov = min(l[1], b) - max(l[0], a)
            if ov > best:
                best, bi = ov, i
        width = l[1] - l[0]
        if len(cols) > 1 and width > block_width * SPAN_FRAC:
            bi = 0
        buckets[bi].append(l)
    return buckets


def assemble_paragraphs(lines):
    """Assemble individual lines into unwrapped, de-hyphenated paragraphs."""
    if not lines:
        return []
    lines = sorted(lines, key=lambda l: -l[2])
    gaps = [lines[i][2] - lines[i + 1][2] for i in range(len(lines) - 1)]
    positive_gaps = [g for g in gaps if g > 0]
    lead = statistics.median(positive_gaps) if positive_gaps else 12.0

    paras, cur = [], []
    for i, l in enumerate(lines):
        text = re.sub(r"\s+", " ", l[4]).strip()
        if not text:
            continue
        new_para = False
        if cur:
            gap = lines[i - 1][2] - l[2]
            if gap > lead * 1.55:
                new_para = True
            elif _MARKER.match(text) and not _HYPHEN_END.search(cur[-1]):
                new_para = True
        if new_para:
            paras.append(cur)
            cur = [text]
        else:
            cur.append(text)
    if cur:
        paras.append(cur)

    assembled = []
    for p in paras:
        buf = ""
        for seg in p:
            if not buf:
                buf = seg
                continue
            m = _HYPHEN_END.search(buf)
            if m and seg[:1].islower():
                buf = buf[:-1] + seg  # stitch word across line break
            else:
                buf = buf + " " + seg
        assembled.append(re.sub(r"\s+", " ", buf).strip())
    return [p for p in assembled if p]


def process_pdf(pdf_path):
    """Full geometric parse of an academic PDF."""
    try:
        from pdfminer.high_level import extract_pages
        from pdfminer.layout import LAParams
    except ImportError:
        sys.exit("Error: pdfminer.six is required for PDF conversion. Run: pip install pdfminer.six")

    laparams = LAParams(boxes_flow=None, detect_vertical=False)
    doc_sections = []

    for page_idx, pg in enumerate(extract_pages(pdf_path, laparams=laparams)):
        lines = extract_page_lines(pg)
        if not lines:
            continue

        # Detect and extract printed folio if present
        page_folio = page_idx + 1
        raw_folios = [
            (l[3], _folio_value(l[4]))
            for l in lines
            if _folio_value(l[4]) is not None and (l[3] < 80 or l[2] > pg.height - 80)
        ]
        if raw_folios:
            page_folio = raw_folios[0][1]

        # Strip running folios and recurring header lines from body text
        body_lines = [
            l
            for l in lines
            if not _PAGENO.fullmatch(l[4])
            and not (l[2] > pg.height - 50 and len(l[4]) < 60)  # top header strip
        ]

        cols = detect_columns(body_lines)
        col_buckets = assign_lines_to_columns(body_lines, cols)

        page_blocks = []
        for bucket in col_buckets:
            col_paras = assemble_paragraphs(bucket)
            if col_paras:
                page_blocks.extend(col_paras)

        if page_blocks:
            anchor_banner = f"\n\n[p. {page_folio}]{{#p.{page_folio}}}\n\n"
            doc_sections.append(anchor_banner + "\n\n".join(page_blocks))

    return "\n\n".join(doc_sections)


# ─────────────────────────────────────────────────────────────────────────────
# 3. Main CLI & Frontmatter Assembly
# ─────────────────────────────────────────────────────────────────────────────

def build_frontmatter(title=None, author=None, year=None, lang="en", source_file=""):
    slug = re.sub(r"[^\w]+", "-", (title or os.path.basename(source_file)).lower()).strip("-")
    fm = [
        "---",
        f"title: \"{title or os.path.basename(source_file)}\"",
        f"creator: \"{author or 'Unknown'}\"",
        f"sigla: \"{slug}\"",
        f"year: {year or 'Unknown'}",
        f"language: {lang}",
        "anchors: true",
        "---",
        ""
    ]
    return "\n".join(fm)


def main():
    parser = argparse.ArgumentParser(
        description="Convert academic PDFs and EPUBs into citable, clean Markdown."
    )
    parser.add_argument("input_file", help="Path to input PDF or EPUB file")
    parser.add_argument("output_file", nargs="?", help="Path for converted output Markdown file")
    parser.add_argument("--title", help="Document title for frontmatter")
    parser.add_argument("--author", help="Author/creator for frontmatter")
    parser.add_argument("--year", help="Year of publication")
    parser.add_argument("--lang", default="en", help="Primary language code (e.g. en, la, grc, es, it)")
    args = parser.parse_args()

    in_file = args.input_file
    if not os.path.isfile(in_file):
        sys.exit(f"File not found: {in_file}")

    ext = os.path.splitext(in_file)[1].lower()
    out_file = args.output_file or os.path.splitext(in_file)[0] + ".md"

    print(f"Reading {in_file} ({ext})...")

    if ext == ".epub":
        raw_md = run_pandoc_epub(in_file)
        body = clean_epub_markdown(raw_md)
    elif ext == ".pdf":
        body = process_pdf(in_file)
    else:
        sys.exit(f"Unsupported extension: {ext}. Only .pdf and .epub are supported.")

    frontmatter = build_frontmatter(
        title=args.title,
        author=args.author,
        year=args.year,
        lang=args.lang,
        source_file=in_file,
    )

    full_output = frontmatter + "\n" + body + "\n"

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(full_output)

    print(f"Successfully converted to: {out_file}")


if __name__ == "__main__":
    main()
