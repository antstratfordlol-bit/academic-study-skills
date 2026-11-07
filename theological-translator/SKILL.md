---
name: theological-translator
description: >-
  Translate academic theology, liturgy, and patristics from Italian, Spanish, and Latin into
  publication-grade classical British English. Uses a dual-agent architecture where a primary
  translator renders an unabridged draft, an automated script verifies apparatus and formatting,
  and an adversarial Reviewer Subagent audits fidelity, elevates prose style, and enforces zero em dashes.
  Trigger on "translate this theological text", "translate this handout", "translate lezioni",
  "translate dispense", "theological translation", "translate from Italian/Spanish/Latin".
---

# `theological-translator`: Scholarly Theological Translation

This skill provides an unabridged, high-fidelity translation pipeline for academic theology, liturgy, and philosophical texts (principally Italian, Spanish, and Latin into classical British English).

It is specifically engineered to eliminate the classic failure modes of machine and single-pass translation:
1. **Awkward Literalisms ("Rubbish" Prose)**: Romance syntax and calques left intact (e.g. "it comes to be", "in order to deepen", "it treats of").
2. **Dropped Apparatus & Citations**: Missing footnotes, lost scriptural references, truncated Patristic citations, or stripped Greek/Hebrew text.
3. **Broken Table Structures**: Collapsed or misaligned synoptic tables comparing liturgical rites or theological schemas.
4. **Unauthorised Condensation**: Truncating or simplifying complex academic arguments.
5. **Stylistic Corruption**: Leakage of American English orthography, unitalicised Latin formulas, or prohibited em dashes.

---

## 1. The Dual-Agent Pipeline

To ensure flawless fidelity and literary dignity, translation proceeds through three stages:

```
[ Source Text (IT / ES / LA) ]
             │
             ▼
   [ Agent 1: Scholarly Translator ]
   • Unabridged draft
   • Technical theological glossary applied
   • Preserves all footnotes and apparatus
             │
             ▼
   [ Automated Quality Audit: verify_translation.py ]
   • Footnote parity checks
   • Table integrity checks
   • Greek/Hebrew apparatus retention
   • Zero em dash enforcement
             │
             ▼
   [ Agent 2: Reviewer Subagent (Fresh Context) ]
   • Adversarial sentence-by-sentence fidelity check
   • Refines prose to dignified classical British English
   • Italicises all Latin dogmatic terms
   • Cleans formatting and confirms zero em dashes
             │
             ▼
[ Publication-Grade English Markdown ]
```

---

## 2. Invocation & Workflow

### Step 1: Draft Translation (Agent 1)
When given a source file or chunk (such as a chapter of a handout by Prof. Juan Rego or a Spanish spiritual treatise), translate exhaustively into Markdown:
- **Unabridged Fidelity**: Never summarise, condense, or omit any paragraph, premise, footnote, or table.
- **Consult Glossary**: Follow [references/theological_glossary.md](references/theological_glossary.md) for canonical English dogmatic equivalents.
- **Latin Terms**: Retain all Latin formulas and expressions in italics (e.g. *ex opere operato*, *in persona Christi capitis*, *res et sacramentum*).
- **British English**: Apply British spelling throughout (*honour*, *savour*, *programme*, *realise*).
- **No Em Dashes**: Never use em dashes. Use colons, semicolons, brackets, or commas.

### Step 2: Deterministic Verification
Execute the verification engine against the candidate translation:
```bash
python theological-translator/scripts/verify_translation.py "[target_translation.md]" "[source_file.md]"
```
The script audits:
- Footnote parity between source and target.
- Retention of all Greek and Hebrew strings.
- Synoptic table row and column counts.
- Italicisation of technical Latin formulas.
- Word count ratio to flag accidental omissions.
- Absolute absence of em dashes.

### Step 3: Reviewer Subagent Audit & Polishing (Agent 2)
Invoke a Reviewer Subagent in a fresh context window to audit the draft translation against the source text and the script report.

**Subagent Launch Template:**
```markdown
Role: Academic Theological Translation Reviewer & Stylistic Arbiter
Task: Conduct an adversarial review of candidate English translation against the source text.
Input:
  - Source Text: <source_path or source_content>
  - Candidate Translation: <candidate_path or candidate_content>
  - Audit Report: <verify_translation output>

Checklist:
1. Fidelity: Did Agent 1 omit any sentence, footnote, qualification, or bibliographic citation?
2. Prose Dignity: Are there awkward Romance idioms or clumsy literalisms? Elevate the prose into classical, elegant British English.
3. Terminology: Are liturgical and dogmatic concepts translated accurately according to theological_glossary.md?
4. Latin Formulas: Confirm every Latin phrase is italicised.
5. Em Dash Elimination: Verify that zero em dashes exist anywhere in the text.
6. Output: Provide the final, polished publication-grade Markdown text.
```

---

## 3. Academic Standards & Rules

- **Prof. Juan Rego / PUSC Course Handouts**: Never make translations brief or summarised. Translate as faithfully and exhaustively as possible without reducing, condensing, or omitting content.
- **Apparatus Preservation**: Retain every paragraph, argument, footnote, scholarly citation, scriptural locus, Patristic extract, Greek and Hebrew terminology, Latin dogmatic formula, and comparative synoptic table.
- **British English**: *savour*, *honour*, *programme*, *recognise*, *neighbour*.
- **No Em Dashes**: Always structure sentences using colons, semicolons, commas, brackets, or natural full stops.
- **Clickable Links**: When linking to files in responses, use markdown links with forward slashes (`file:///C:/Users/antst/...`).
