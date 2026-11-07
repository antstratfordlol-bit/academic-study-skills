# Academic Study Skills for Claude & Antigravity

A complete quadripartite scholarship toolkit for Claude and Antigravity, combining:
1. **`source-converter`**: Geometry-aware conversion of academic PDFs and EPUBs with automated audit scripts and a forensic Reviewer Subagent.
2. **`theological-translator`**: High-fidelity translation of academic theology, liturgy, and patristics with deterministic apparatus verification and a bilingual Reviewer Subagent.
3. **`study`**: Fr. Oskari Juurikkala's analytical reading engine from [AC HUB Starter](https://github.com/oskarijuurikkala/ac-hub-starter).
4. **`socratic-mentor`**: Closed-book oral sparring and supervisory viva examination.

```text
academic-study-skills/
├── README.md
├── source-converter/             # Academic PDF & EPUB conversion with layout recovery
│   ├── SKILL.md
│   ├── academic_convert.py       # Geometry-aware extraction engine
│   ├── audit_markdown.py         # Deterministic structural quality auditor
│   └── references/
│       └── academic_traps.md     # Why naive converters corrupt academic literature
├── theological-translator/       # Dual-agent scholarly translation pipeline
│   ├── SKILL.md
│   ├── scripts/
│   │   └── verify_translation.py # Apparatus, footnote parity, and formatting verifier
│   └── references/
│       └── theological_glossary.md # PUSC liturgical, dogmatic, and Latin vocabulary
├── socratic-mentor/              # Socratic supervisor & oral examination partner
│   ├── SKILL.md
│   └── references/
│       └── questions.md
└── study/                       # Fr. Oskari Juurikkala's AC HUB reading partner
    ├── SKILL.md
    ├── README.md
    └── references/
        ├── batch.md
        ├── check-maps.js
        ├── check-pocket.js
        ├── maps.md
        ├── questioning.md
        ├── scholastic.md
        ├── store-template.md
        ├── terms-and-names.md
        └── toolkit.md
```

---

## 1. Overview of the Skills

### `source-converter`
* **Role**: Ingestion and layout-preserving conversion of academic monographs, journal articles, and patristic editions.
* **Core Capabilities**:
  * **Multi-Column Recovery**: Calculates bounding-box gutters to reassemble two-column journals (*Recherches de science religieuse*, *Patrologia Graeca*) column-by-column rather than reading horizontally.
  * **Header & Folio Stripping**: Eliminates recurring running headers from the body prose while turning page folios into citable milestones (`[p. 142]{#p.142}`).
  * **De-hyphenation & Paragraph Unwrapping**: Measures vertical line leading to distinguish true paragraph breaks from soft wraps, stitching hyphenated words back together.
  * **Calibre/EPUB Sanitisation**: Recursively unwraps nested span tags and strips dead spine targets (`#part0001.html`).
  * **Automated Audit & Reviewer Subagent**: Executes `audit_markdown.py` to verify footnote parity and page continuity, followed by a Reviewer Subagent pass to repair structural anomalies before the reader views the text.

### `theological-translator`
* **Role**: Unabridged, publication-grade translation of academic theology, liturgy, and patristics (principally Italian, Spanish, and Latin into classical British English).
* **Dual-Agent Architecture**:
  * **Agent 1 (Primary Translator)**: Renders the entire source text without condensing or omitting arguments, applying canonical equivalents from `references/theological_glossary.md`.
  * **Automated Verification**: `scripts/verify_translation.py` verifies footnote count parity, table geometry, scriptural apparatus retention, and the complete absence of em dashes.
  * **Agent 2 (Reviewer Subagent)**: Runs in a clean context window to perform line-by-line adversarial critique, eliminating Romance calques, elevating English prose style, and verifying Latin italics.

### `study` (by Fr. Oskari Juurikkala / AC HUB)
* **Upstream**: [oskarijuurikkala/ac-hub-starter](https://github.com/oskarijuurikkala/ac-hub-starter)
* **Role**: Two colleagues working through a source or literature by units (passage, section, chapter, book, or corpus).
* **Core Method**:
  * **Three Levels of Work**: **L1** (what is this as a whole), **L2** (its parts and how they serve the whole), **L3** (what is actually happening inside it).
  * **The Instruments**:
    * **The Sweep**: Brisk L1 navigation across all parts.
    * **Visual Maps (`maps.md`)**: Spatial HTML maps generated for complex arguments.
    * **Questioning (`questioning.md`)**: The withholding step where the reader commits to an interpretation before receiving Claude's reading.
    * **Terms and Names (`terms-and-names.md`)**: Sense-tracking technical terms and shifts in vocabulary.
    * **The Toolkit (`toolkit.md`)**: 10 analytical ways of seeing an argument.
    * **Batch (`batch.md`)**: Multi-source and literature-scale study.
    * **Scholastic Loop (`scholastic.md`)**: Reading primary texts via the medieval *articulus* disputation structure (*utrum*, *videtur quod non*, *sed contra*, *respondeo*, *responsiones*).

### `socratic-mentor`
* **Role**: An exacting Socratic supervisor and closed-book sparring partner.
* **Core Rule**: *Questions, not drafts*. The assistant never writes the thesis or outline for you; it tests your grasp through oral dialogue.
* **Key Features**:
  * Asks exactly one piercing question at a time.
  * Challenges vague terms and demands formal distinctions.
  * Formulates the strongest counter-argument (*videtur quod non*).
  * 8 developmental stages from topic selection to viva voce defence.
  * Discipline-specific questions in `references/questions.md`.

---

## 2. The 40/40/20 Study Protocol

A structured 100-minute session combining both skills:

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│     BLOCK 1 (40 min)    │     BLOCK 2 (40 min)    │     BLOCK 3 (20 min)    │
│   Analytical Reading    │    Socratic Sparring    │    Anki Synthesis &     │
│       (`study`)         │  (`socratic-mentor`)    │    Spaced Repetition    │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

1. **Block 1: Analytical Reading (40 min)**
   * Open the text. Say to Claude: *"study this"*.
   * Work through the units with Claude using the `study` skill instruments (Sweep, Questioning, or Scholastic loop).
   * Formulate the whole (L1), the parts (L2), and extract the load-bearing arguments (L3).

2. **Block 2: Closed-Book Socratic Sparring (40 min)**
   * Close the book and all notes (*a libro chiuso*).
   * Activate `socratic-mentor` in Claude (*"Play my supervisor and examine me on what I just read"*).
   * **Use Voice Dictation**: Press `Win + H` (Windows) or double-press `Fn` (macOS Dictation). Speaking answers aloud forces neural retrieval and sharpens verbal precision.
   * Defend your thesis against the examiner's counter-objections and expose any hidden gaps (*lacunae*).

3. **Block 3: Synthesis & Anki Flashcards (20 min)**
   * Formulate 3 to 5 atomic Anki flashcards addressing the specific distinctions or loci where you hesitated during Block 2.
   * Record a brief two-sentence resolution in your study log.

---

## 3. Installation Guide for Claude

### Method A: Claude Code (Plugin Setup via AC HUB Starter)
If you use Claude Code in VS Code or Terminal, you can install Fr. Oskari Juurikkala's official plugin directly, then add `socratic-mentor`:

1. Open Claude Code in your workspace folder.
2. Say to Claude:
   > *"Read the README at github.com/oskarijuurikkala/ac-hub-starter and set me up, step by step."*
   Claude will guide you through installing the required tools (`poppler` and `node`) and register the official `study` plugin:
   ```bash
   /plugin marketplace add oskarijuurikkala/ac-hub-starter
   /plugin install study@ac-hub-starter
   ```
3. Copy the `socratic-mentor` folder from this repository into your `~/.claude/skills/` directory so you have both skills available.

---

### Method B: Claude Code (Direct Skills Clone)
Alternatively, clone both skills directly into your global skills folder:

* **macOS / Linux**:
  ```bash
  mkdir -p ~/.claude/skills
  git clone https://github.com/antstratfordlol-bit/academic-study-skills.git /tmp/skills
  cp -r /tmp/skills/socratic-mentor /tmp/skills/study ~/.claude/skills/
  rm -rf /tmp/skills
  ```

* **Windows (PowerShell)**:
  ```powershell
  New-Item -ItemType Directory -Force -Path "$HOME\.claude\skills"
  git clone https://github.com/antstratfordlol-bit/academic-study-skills.git "$HOME\AppData\Local\Temp\skills"
  Copy-Item -Recurse "$HOME\AppData\Local\Temp\skills\socratic-mentor", "$HOME\AppData\Local\Temp\skills\study" "$HOME\.claude\skills\"
  Remove-Item -Recurse -Force "$HOME\AppData\Local\Temp\skills"
  ```

---

### Method C: Claude.ai Web (Claude Projects)
If you use Claude through the browser (Claude Pro / Team):

1. Create a **Project** in [Claude.ai](https://claude.ai) (e.g. *"Academic Research"*).
2. Under **Project Knowledge**, upload:
   * `socratic-mentor/SKILL.md` and `socratic-mentor/references/questions.md`
   * `study/SKILL.md` and all files in `study/references/`
3. Under **Project Instructions**, paste:
   ```markdown
   You have access to the `socratic-mentor` and `study` skill files in Project Knowledge.
   When I say "study this" or ask to work through a source, adopt the `study` protocol by units.
   When I ask to be examined, questioned, or prepared for a defence, strictly follow `socratic-mentor`:
   - Ask exactly one piercing question at a time.
   - Never write drafts or essays for me; make me articulate the argument.
   - Challenge vague language and demand formal distinctions.
   - Present the strongest counter-arguments (videtur quod non).
   ```

---

## 4. Credits & Origins
* **`study` skill**: Developed by Fr. Oskari Juurikkala ([AC HUB Starter](https://github.com/oskarijuurikkala/ac-hub-starter)).
* **Scholastic extension & Socratic sparring partner**: Curated and adapted for oral theological and philosophical disputation.
