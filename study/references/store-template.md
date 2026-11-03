# The three written artifacts

Three files, three different kinds of thing. **They never mix.**

In the templates below, `<name>` is the user's name from the workbench profile (`name`).

| File | Kind | Behaviour |
|---|---|---|
| **the store** — `<Author>, <Short Title> — study-store.md` | **governing** | Says what is currently held about each unit. **Revised in place** as understanding deepens; a node that has to change is rewritten, and the old wording is not preserved there |
| **the response record** — `<Author>, <Short Title> — response-record.md` | **log** | Says what was asked and answered, in order. **Append-only.** Errors are kept at full prominence and never overwritten — that the user read a move one way in August and differently in November is the point |
| **the thinking note** — `<Author>, <Short Title> — study-thinking.md` | **the user's** | The user's own ideas, provoked by the source, aimed at their projects. They govern it; you may challenge, never overwrite |

Two html views are **derived** from the store, regenerated wholesale and never hand-edited — **maps** (`— study-maps.html`, spatial, one per question) and **the companion** (`— study-companion.html`, the whole store as a working surface). Corrections land in the store. Spec: `maps.md`.

---

## 1 · The store

**One node per unit worked.** The store is the session's state, not a record of it — which is what makes it the resume state as well: a node that exists says what was worked at that unit, and **an absent node says the unit is untouched.**

Nesting mirrors the units: a book's node is `##`, its parts `###`, their parts `####`. Every node carries a **path** on its identity line so it stays greppable and self-explaining when found out of context.

### File header

```markdown
---
source: <path to the converted markdown or PDF>
work: <Author, Full Title (year)>
opened: YYYY-MM-DD
sessions: YYYY-MM-DD, YYYY-MM-DD
ocr_quality: <copied from the source frontmatter, or: n/a>
pagination: <copied from the source frontmatter; pages from a pdf or none file are provisional; n/a if the source has none, and then every page is provisional>
---

# <Author>, <Short Title> — study store

**Layer 1.** Everything below is AI-extracted or AI-interpreted and is **not citable until
verified against the source** — for patristic and medieval primary texts, against the critical
edition. Lines marked `[ME]` are <name>'s own words and are theirs, not the source's.

**Governing file.** It says what is currently held, not what was said when. The exchange itself
lives in `— response-record.md`.
```

### The node

```markdown
## <Unit name>

**path:** book · **anchors:** pp. 1–312 · **worked:** L1, L2 (2026-08-16)

**The whole.**
One sentence, or a short paragraph at most. *Unity test: if it takes too many words, a
multiplicity has been seen, not a unity.*

**Basis and thin points.**
How the reading was arrived at — an explicit programmatic statement in the introduction · the
conclusion · the shape of the contents · inference assembled across chapters · the way one
chapter turns. And where it is thin. *Thin basis is a fact about the source, not only about
the reading.*

**Second reading** *(where the unit genuinely bears more than one)* `[INT]`
The alternative, stated as a claim that could be wrong, with where the two conflict and what
would settle it.

**Parts** *(when L2 has run — ordered to the whole, not enumerated)*
- **<part>** — pp. x–y — what it does for the whole.
- **<part>** — pp. x–y — …

**Findings** *(what L3 established, and by which instrument)*
- <finding> — pp. x — *(argument construction)* — supplied steps marked `[IMPLICIT]`.
- <finding> — pp. x — *(term-tracking)*.

**[ME]** *(the user's judgments about this unit, verbatim)*
> "The induction fails at Part III."
```

**Fields appear only when they have content.** A node worked at L1 only has identity, the whole, and basis. Nothing is padded to look complete.

**What goes in:** everything that makes a claim about a unit. The opening L1 is the root node; L2's parts are nodes; what the questioning established lands here, distilled.

**Provenance and location are different axes.** The user's judgment *about the source* belongs here, at the node it bears on, marked `[ME]` and verbatim — it is theirs by provenance and about this unit by location. The thinking note takes what is about **their project**, not about the source.

**Marking instrumental structure.** Where the organisation is ours rather than the author's — the user's question imposed on the source's material — say so at the node: *`[INT]` structure is ours; the author does not divide it this way.* Imposed structure is harder to spot later than invented content, because every sentence is defensible.

---

## 2 · The response record

**Append-only.** New exchanges go at the bottom under a dated heading; nothing above is edited.

```markdown
---
source: <path>
work: <Author, Full Title (year)>
---

# <Author>, <Short Title> — response record

**A notebook, not a gradebook.** No scores, no percentages, no tallies. <name>'s answers are verbatim
and are never tidied into something more coherent than they said. The assessments are the AI's
reading of the source — fallible, sometimes simply wrong — and stay structurally separate from
<name>'s words.

---

## 2026-08-16 · <unit> · <L1 | L2 | L3>

**<name>'s context, verbatim**
> *(what they said when asked what they see, what they know, what they want — typos tidied, never
> rephrased)*

### Verdict table

| | Question | <name>'s answer | The source | |
|---|---|---|---|---|
| Q1 | … | … | … | right |
| Q2 | … | … | … | **wrong, and they were sure** |
| Q3 | … | … | … | uncertain-and-right |
| Q4 | … | … | … | open disagreement |

### Q1 · <the question as asked>

- **form:** free · multiple-choice · anchored · prediction · term · false-statement
- **status:** `[in-text]` | `[open]`

**<name>'s answer** *(verbatim)*
>

**<name>'s reasoning / comment** *(verbatim)*
>

**Assessment** — *the AI's reading of the source, and it may be wrong:*

**Verdict:** right · wrong · wrong-and-they-were-sure · uncertain-and-right · open disagreement

*(repeat per question)*

### The boundary

Where escalation stopped, what the edge was, and **whose it was** — <name>'s gap, or the point at
which the source stops arguing.
```

### ⚠ Recording a subtly false statement

An altered quotation **never** appears in the record without its correction beside it. Otherwise a doctored quote sits in a study artifact and is later read as the source's own words.

```markdown
### Q5 · "Something in this is wrong — what?"

- **form:** false-statement
- **status:** `[in-text]`

⚠ **ALTERED — not the source's words.**

**As put to <name>** *(altered)*:
> "…analogical predication…"

**The true text** — p. 114:
> "…participation according to capacity…"

**What was altered, and why it is load-bearing:** …
```

---

## 3 · The thinking note

**The user's.** Provoked by the source, aimed at their projects. Lazy-created — it exists once there is something in it, and there are no empty thinking notes.

```markdown
---
source: <path>
work: <Author, Full Title (year)>
feeds: <the project or piece of writing it serves, or: unassigned>
---

# <Author>, <Short Title> — thinking

**<name>'s document.** Direct quotation and `[ME]` are <name> verbatim or <name>'s judgment; unmarked prose
is the AI's elaboration within their frame, and it may be challenged but never overwritten.
Speculation is welcome here and nowhere else. **Layer 1** for anything drawn from the source.

## <the idea>

`[ME]` >

*(elaboration)*

**What this gives:** <project or piece of writing> — the routing hook a later sweep recovers.
```

**What belongs here:** the user's own idea sharpened by the reading; the **native/instrumental gap** (a historian who traces a development without asking whether the position is true has left a question standing); an `[open]` question they answered against the author — a disagreement, not an error, and candidate material.

**What does not:** the user's judgment *about the source*. That is a node field.

**It migrates.** If a project or paper folder crystallises around it, move the file there and log the move; link both ways rather than copying (SKILL § Storage and naming, *Placement*).

---

## Standing requirements on anything taken (L4)

- **Accuracy with recoverable context** — page, surrounding argument, enough to tell later whether it means what the user thought. Strong form: **every interpretation of an author's position carries an actual quotation beside it.**
- **Two independent checks, and they are orthogonal** — **verification** (did the text say this) and **comprehension** (did the user understand it). A perfectly verified quotation can be misunderstood, especially where a term is technical.
- **Stated status** — settled · tentative · open question. Flattening everything to one confidence makes an artifact read as uniformly important, which is the same as uniformly unimportant.
- **Provenance legible at a glance** — the author's voice, the AI's, the user's.
