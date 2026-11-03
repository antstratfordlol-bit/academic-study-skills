# The study skill — the whole, top-down

*The map to open first. What the skill is, what its pieces are, and how they fit. The detail lives in `SKILL.md` and the `references/`; this names the structure so a cold session — or a later reviser — can see the shape before the parts.*

---

## What it is

**Two colleagues discussing a text the user already has.** They are not asking what a source says; they are working out how much of it they need, getting that, and taking what serves the work. The skill navigates a source **by units**, and its concept is embodied in its structure, not held as a theory the session must remember: the moves *are* the scheme.

Invoked on any study request (`/study`, or "study this / work through / open this source"). One relationship throughout — colleague, not tutor — calibrated honestly to who holds what (the user is senior in some fields and junior in others; and field and genre can split, so they can be senior on the subject and junior on how the book argues).

## The frame — `SKILL.md`

The governing file. Read it in full at every invocation. It carries:

- **The unit, and three questions askable of any unit** — L1 *what is this as a whole* · L2 *what are its parts, and how do they serve it* · L3 *what is actually happening inside it*. Not stages; all three available at every scale, from passage to corpus.
- **The four moves** — descend · return · take · stop. Navigation only.
- **The two-turn opening** — turn one reads only the front matter and asks what the user wants; turn two reads and works. The skim is theirs, and it comes first.
- **Given-first or asked-first** — the user's call, per unit; asked-first is given-first plus a withholding step.
- **The turn** — work the question → **write the node** → speak from it → offer the moves → wait. Write-then-speak is what makes *worked-but-not-written* impossible.
- **The invariant** — whatever is produced declares its basis and its thin points.
- **Register and stance** — describe the source and its problems, never the user's obligations; challenge before agreement; be contestable.

## The instruments — chosen per source, by the user

None is a default; the skill offers two or three that fit *this* source and lets the user choose.

| Instrument | File | What it is |
|---|---|---|
| **The sweep** | (in `SKILL.md`) | L1 across every part, brisk, given-first — the default opening where there's no formation target |
| **The visual outline** | `references/maps.md` | the shape made spatial — one map, one question |
| **The conversation** | (in `SKILL.md`) | pursue a question the reading opened, no text to work through — often the highest-yield move |
| **Questioning** | `references/questioning.md` | the user commits to an answer before receiving the interpretation — where being wrong would tell them something |
| **Terms and names** | `references/terms-and-names.md` | the inventory: what a unit carries, what each is, which bear weight |
| **The toolkit** | `references/toolkit.md` | the ten analytic ways-of-seeing — how the argument works. **L2 and L3, whole or part, single source or batch.** Proposed then chosen together, never fired invisibly |

**Batch** — `references/batch.md` — is the corpus-scale mode: a literature is a unit like any other. Its central act is **choosing the organizing axis** (propose, then wait). The seam with the toolkit: the **axis** is the big-picture "what is this whole literature"; the **toolkit** is the analytic descent into its parts.

## What gets written

| Artifact | Format | Kind |
|---|---|---|
| **the store** | md | governing — one node per unit worked; the session's state, not a record of it |
| **the response record** | md | log — questions, the user's answers verbatim, verdicts; append-only |
| **the thinking note** | md | the user's — ideas provoked by the source, aimed at their projects |
| **maps** | html, plural | derived — spatial, one per question |
| **the companion** | html, one | derived — the whole store as a read-through surface |
| **the pocket** | html, conditional | derived — the phone surface, for a source met away from the desk |

The md and the html are not one artifact in two formats: the store is self-contained and greppable; the maps are graspable at a glance; the companion is the working surface. Derived views regenerate from the store — **corrections land in the store, never in a view.** Formats in `references/store-template.md` and `maps.md`.

## The three homes — where each kind of finding goes

The each-fact-one-home rule, applied to what a session produces:

- **A source studied** → a session entry in the study log (the profile's `study_log`; its `feeds:` field says what project or piece of writing the study serves, if any).
- **A discovered motive** (instrument X connected on material Y because Z) → one line in the toolkit's own *"where instruments have connected"* list, details in the study-log entry.
- **Design feedback on the skill** (this grated · the skill made me do the wrong thing · this worked, keep it) → a `#learn` line in the study log, component-tagged, in the user's words. Claude attaches the tag and surfaces it for a beat.

## The learning design

The skill is **flexible and learning**, not a pipeline. The instruments and the frame are stable; **where instruments connect to material, and why** is what grows, from real cases. The toolkit's motive-map is orientation, never a routing table: the connection is made at read-time against the actual text, never looked up by genre.

Observations about the skill go to the user's own study log, tagged `#learn`; anything worth the skill author's attention, the user tells Oskari Juurikkala directly.

## Cross-cutting rules

- **Layer 1 throughout** — nothing citable until the user verifies it against the source (critical edition for primary texts). Flags: `[INT]` `[GLOSS]` `[IMPLICIT]` `[UNCERTAIN]` `[GAP]` `[VERIFY]` `[SUGGESTION]` `[CITATION NEEDED]` `[ME]` (the user's own words).
- **A constructed structure is marked as ours** — an imposed neutral vocabulary or a question the author never posed is the highest-imputation-risk operation; mark it without exception.
- **Source consultation** — markdown first, PDF page-image on flagged pages and wherever Greek appears (SKILL.md, *Workspace integration*).
