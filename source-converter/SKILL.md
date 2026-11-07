---
name: source-converter
description: >-
  Convert academic PDFs, books, articles, and EPUBs into citable, publication-grade Markdown.
  Geometry-aware layout parsing resolves two-column journals, strips running headers/footers,
  repairs hyphenated word breaks, unwraps nested Calibre spans in EPUBs, and preserves
  printed page milestone anchors ([p. 142]{#p.142}) for scholarly citation.
  Trigger on "convert this pdf", "convert this epub", "turn this book into markdown",
  "prepare this source", "process this pdf", "convert to markdown".
---

# `source-converter` — Academic Source Conversion

This skill converts scholarly monographs, theological treatises, patristic texts, and journal articles in PDF and EPUB format into clean, citable, machine-readable Markdown.

It addresses the five classic failure modes that corrupt academic texts in naive conversion scripts:
1. **Multi-column layouts**: Reassembles text column-by-column rather than reading horizontally across gutters.
2. **Embedded running headers**: Strips recurring author/title headers from the middle of prose.
3. **Hyphenation and artificial hard wraps**: Re-joins broken words and unwraps lines into true paragraphs.
4. **Calibre and InDesign span pollution**: Recursively strips nested CSS spans and dead spine targets from EPUBs.
5. **Printed folio anchoring**: Injects invariant page anchors (`[p. 142]{#p.142}`) so citations can be verified against physical printed copies.

Detailed case studies and failure diagnostics are in [references/academic_traps.md](references/academic_traps.md).

---

## 1. Quick Invocation

When asked to convert a PDF or EPUB in your workspace:

```bash
python source-converter/academic_convert.py "<path-to-file>" "[output-path.md]" \
  --title "<Book Title>" \
  --author "<Author Name>" \
  --year <Year> \
  --lang <Language-Code>
```

*(If language is not specified, default to `en`. For Latin use `la`, Greek `grc`, Spanish `es`, Italian `it`)*.

---

## 2. Requirements

* **Pandoc**: Required for EPUB conversion.
  * macOS: `brew install pandoc`
  * Windows: `winget install JohnMacFarlane.Pandoc`
* **Python libraries**: Required for geometry-aware PDF extraction.
  * `pip install pdfminer.six`

---

## 3. The Two Ingestion Pipelines

### A. EPUB Pipeline
1. **Custom Pandoc Flavour**: Uses `markdown-raw_html-native_divs-native_spans-simple_tables-multiline_tables-grid_tables` with `--wrap=none --markdown-headings=atx`.
2. **Sanitisation**:
   * Raw HTML fences and inline HTML tags are stripped.
   * Images and raw SVG decorations are dropped.
   * Anchor-only spans (`[]{#...}`) and empty link tags are removed.
3. **Recursive Span Unwrapping**: A `while prev != md` loop unpeels nested classes (`[**[Title]{lang="ES-TRAD"}**]{#id .class}`) down to pure Markdown emphasis.
4. **Heading Hierarchy**: Normalises shallowest headings to `#` (Title) and `##` (Chapters), folding parenthetical date/subtitle orphans into their parent headings.

### B. PDF Geometry Pipeline
1. **Bounding-Box Extraction**: `pdfminer.layout.LTTextLine` extracts exact coordinates `[x0, x1, ytop, ybot]`.
2. **Column & Gutter Detection**:
   * Lines wider than 60% of the block are flagged as spanning headings.
   * Interior gutters (`MIN_GUTTER_PT = 10.0pt`) define column boundaries.
   * Marginal references (< 15% text share) are filtered so they do not split the page.
3. **Folio & Running Header Isolation**:
   * Recurring headers in the top 50pt of the page are stripped.
   * Decorated folios (`- 3 -`, `p. 14`, `[12]`) are extracted as integer values and rendered as permanent milestones: `[p. 14]{#p.14}`.
4. **Paragraph Assembly**:
   * Measures vertical leading (median line gap). Breaks are only recognised when `gap > lead * 1.55` or on explicit list/numbered markers (`1.`, `a)`, `V/.`).
   * End-of-line hyphens (`\w[-‐­]$`) followed by a lowercase character are cleanly merged.

---

## 4. Automated Quality Audit & Subagent Review

To guarantee zero corruption or formatting defects, every conversion passes through a two-tier review loop: a deterministic Python auditor followed by an adversarial Reviewer Subagent.

### Tier 1: Deterministic Script Audit
Run `audit_markdown.py` against the converted Markdown file:
```bash
python source-converter/audit_markdown.py "[output-path.md]"
```
This inspects:
- **Footnote Parity**: Verifies every inline call `[^N]` possesses a corresponding `[^N]:` definition block, and flags orphaned definitions.
- **Pagination Monotonicity**: Verifies that page anchors `[p. N]{#p.N}` ascend sequentially without duplicate folios or unannounced gaps.
- **HTML / CSS Residue**: Detects raw `<span>`, `<div>`, Calibre tags, and InDesign spine remnants.
- **Orphaned Hyphens**: Flags unmerged word fragments split across line breaks (e.g. `hypo- static`).

### Tier 2: Reviewer Subagent Audit & Repair
When anomalies are flagged, or when converting complex multi-column/scholarly texts, launch a Reviewer Subagent using a fresh context window.

**Reviewer Subagent Prompt Pattern:**
```markdown
Role: Markdown Quality Reviewer & Forensic Auditor
Task: Review candidate Markdown file against source anomalies.
Input:
  - Source file path: <source_path>
  - Candidate Markdown: <candidate_path>
  - Audit output: <audit_output>

Instructions:
1. Re-align any mismatched footnote markers with their source paragraphs.
2. Resolve any broken sentence boundaries across page breaks: ensure no sentence is cut in half by an unclosed paragraph break.
3. Remove any lingering running header or footer fragments.
4. Verify all Greek, Hebrew, and Latin terms preserve their diacritics and italics.
5. Ensure no em dashes exist in the output text (use colons, semicolons, or commas instead).
6. Save the audited and repaired file.
```

---

## 5. Verification Checklist

After converting any academic source, verify the following:
* [ ] **Reading order**: For two-column sources, verify that column 1 finishes completely before column 2 begins.
* [ ] **Deterministic audit**: Run `audit_markdown.py` and confirm zero critical errors.
* [ ] **Subagent review**: Completed for complex academic or multi-column works.
* [ ] **No embedded running headers**: Check that chapter titles do not recur every few paragraphs.
* [ ] **De-hyphenation**: Confirm that words across line wraps (e.g. `trans-substantiation`) are re-joined as a single word.
* [ ] **Printed page anchors**: Ensure `[p. N]{#p.N}` milestones occur throughout the text for precise citation.
* [ ] **Stylistic standards**: British English spelling throughout, and strictly no em dashes.
