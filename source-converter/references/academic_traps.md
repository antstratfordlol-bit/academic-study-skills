# Why Naive PDF & EPUB Converters Corrupt Academic Texts

When preparing scholarly literature for LLM-assisted study, citation, or digital library storage, naive conversion scripts (such as a basic `extract_pages` loop from `pdfminer` or a bare Pandoc pass) produce severely degraded Markdown.

This document details the 5 critical failure modes of naive converters and how `source-converter` resolves each.

---

## 1. Multi-Column Layouts (Academic Journals & Patristics)

* **The Naive Failure**: A standard line loop extracts text across the full horizontal geometry of the page. In two-column academic journals (*Recherches de science religieuse*, *Theologische Quartalschrift*, *Patrologia Graeca*), it reads line 1 of Column A, followed immediately by line 1 of Column B, creating interleaved nonsense:
  > *"The mystery of the hypostatic union in St Cyril is that the divine nature and human nature remain unconfused, whereas Nestorius argued that Christ's person was divided into two subjects."*  
  > (Turns into: *"The mystery of the hypostatic whereas Nestorius argued that Christ's union in St Cyril is that the divine person was divided into two subjects nature and human nature remain unconfused"*).
* **The Academic Fix**: `detect_columns` calculates bounding-box line extents (`el.x0`, `el.x1`), measures interior gutters (`MIN_GUTTER_PT = 10.0pt`), and assigns lines into discrete column buckets (`assign_lines_to_columns`). Lines wider than 60% of the page (`SPAN_FRAC = 0.60`) are recognised as spanning section titles and preserved without splitting column order.

---

## 2. Running Headers & Footers Embedded in Prose

* **The Naive Failure**: Only checking if a line is pure digits (`text.isdigit()`) drops the page number, but leaves the running header embedded inside the text on every page:
  > *"Therefore we must conclude that grace elevates nature. R. Girard — Je vois Satan tomber comme l'éclair. But this elevation does not destroy nature's intrinsic teleology."*
* **The Academic Fix**: Running headers are detected by page-top geometry thresholds (`l[2] > height - 50`) and stripped before paragraph assembly. Folios are extracted using a multi-pattern regex (`_PAGENO`) that catches decorated formats (`- 3 -`, `p. 42`, `[12]`) and converts them into explicit citation milestones (`[p. 42]{#p.42}`).

---

## 3. The Broken Word-Wrap and Paragraph Leading Problem

* **The Naive Failure**: Naively joining lines with spaces leaves hyphenated words broken across sentences (`hypo- static` -> `hypo- static`), while joining with newlines turns single paragraphs into dozens of broken 80-character lines.
* **The Academic Fix**: `assemble_paragraphs` measures vertical leading (the median line-to-line gap). A true paragraph break is only recognised when the vertical gap exceeds `lead * 1.55` or when a numbered/bullet marker begins the line (`1.`, `a)`, `V/.`). End-of-line hyphens (`\w[-‐­]$`) followed by a lowercase character are automatically stitched back into complete words.

---

## 4. EPUB Presentational Clutter & Phantom Anchors

* **The Naive Failure**: Converting an EPUB through standard GitHub-Flavoured Markdown (`gfm`) silently discards essential anchor attributes while retaining useless Calibre CSS classes (`[**[TITLE]{lang="ES-TRAD"}**]{#Capitulo_split_001.htm .pcalibre}`) and dead internal spine targets (`#part0001.html__idParaDest-2`).
* **The Academic Fix**: 
  1. We specify the custom Pandoc dialect `markdown-raw_html-native_divs-native_spans-simple_tables-multiline_tables-grid_tables`.
  2. A recursive unwrapping loop (`while prev != md`) strips nested span tags down to pure prose whilst keeping intended bold/italics.
  3. Internal spine links to temporary files are stripped so citations never target arbitrary ebook partition files.

---

## 5. The Anchoring Deficit (Missing Citable Milestones)

* **The Naive Failure**: Raw conversion yields unanchored blocks of text. Without anchor IDs, an LLM cannot cite a specific paragraph, and parallel translations in other languages cannot align.
* **The Academic Fix**: Every page and significant section is minted with an invariant anchor:
  * Printed folios: `[p. 142]{#p.142}`
  * Numbered points: `### 42 {#work.42}`
  This allows seamless cross-language alignment and exact pinpoint citations in scholarly theses.
