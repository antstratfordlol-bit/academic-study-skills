# Batch — a literature rather than a single source

**A batch is a study of a *question*, with a corpus underneath it.** The subject is master and the sources are servants. It is not a study of several sources in turn.

**No separate architecture.** A literature is a unit like any other: it has a whole (what the debate is about), parts (the questions, camps, or sources), and an inside (what is actually happening in a particular exchange). The four moves are the same. What batch needs is **its own instruments**, and — the one thing single-source study does not face — **a deliberate choice of how to organize the corpus.**

**Defaults to given-first at corpus scale.** Ten sources cannot be skimmed in three minutes, so the withholding step has nothing to withhold from. Questioning re-enters when a single source is *promoted* out of the batch and worked on its own (below).

> ### ⭐ The governing principle: flexible and learning
> Batch mode is **not a pipeline.** It aims at two things at once — **(i) follow the user's instructions** on how to approach the corpus, and **(ii) read the material for the shape that best fits it** — and it keeps a growing record of the framings that have worked (*Framings seen so far*, at the foot). Design decisions below are defaults and available moves, not forced steps; the case decides, and the skill may remind but does not compel.

---

## ⭐⭐ Choosing the organizing axis — the central batch act

**How a corpus is organized is a first-class, interpretive act, and it is the user's to confirm — never adopted on the AI's own conviction.** This is the skill's *propose-then-stop / be-contestable* rule applied to the framing of a whole literature, and it is the highest-imputation-risk operation in a batch: a chosen axis is a construction laid over the sources.

### The axes seen so far (a repertoire, meant to grow)

- **disagreement** — sort by who holds what and where positions conflict.
- **methodology / what-question-are-they-asking** — sort by what each source is *doing* and the method it uses, not by conflict. Useful where the sources broadly agree.
- **timeline + dependency** — how sources sit in time and build on each other. **Often more useful in historical and textual/exegetical literatures**, where two dependency kinds surface: **(i) citation genealogies** (studies citing prior studies → lineages of an interpretation) and **(ii) primary-source dependency** (which primary texts each study rests on). *Why it earns its place:* in such fields there is often no real disagreement on conclusions, yet tracking who-relies-on-which-primary-text and which-secondary-authors surfaces **subtle nuances and gaps a disagreement-only sort would miss.**
- **multi-axis** — identify two (or more) axes in the sources and cross them (e.g. disagreement × methodology). Where disagreements are tangled, a second axis often un-tangles them.

*(This list is the same one kept at the foot under "Framings seen so far" — add to it as trials reveal new shapes.)*

### The protocol — propose, then wait

| Situation | Do |
|---|---|
| **The user has not specified a shape** | **Propose 2–3 alternative framings**, say what each would give, then **wait for their choice.** Do not pick one and run. |
| **The user specified a shape, but you see other fruitful ones** | **Propose the alternatives anyway**, then **wait.** Do not silently follow, and do not silently override. |
| **A re-sort along a different axis would dissolve or clarify the disagreements** | Surface it **as a hypothesis** (below). Do not adopt it. Wait. |

### ⭐ The axis-hypothesis, and why it carries its own reasons

When you see that the corpus would be better understood along a different axis than the one in play, **name it as a hypothesis** — and in the same breath:

- **briefly outline the reasons for it**, and
- **name any problem or complication with the framing**,
- then **wait for the user's check. Do not adopt it.**

> **Why the discipline matters.** The AI failure mode is to see something promising and rush to a conclusion; the user's confirmation is what makes a framing academically usable, not your conviction. And giving the reasons *and the complications* up front is not only to help their thinking — **it sharpens the hypothesis itself.** A framing well-defined and qualified from the start beats one corrected later.

---

## The store at corpus scale

**A corpus's node tree is not fixed.** Four structures are available; the chosen axis (above) decides which are load-bearing and which are only expressed as map-views.

| Structure | Groups by | |
|---|---|---|
| **by question** | the contested / cross-cutting questions running through the corpus | *primary default* — the questions become the menu of descents |
| **by source** | one node per source: its position, its role in the debate, fidelity/OCR notes | *always present as index* — every source has a home before it is sorted |
| **by camp / position** | families of sources sharing a commitment | *available* — promote to nodes when the corpus calls for it |
| **by thread / axis** | a term, assumption, or fault-line traced *across* sources, owned by none | *available* — often better as a map than as nodes |

**Default:** question-primary, with a source-node index always present (so an unsorted source is still recorded, not lost). Camp and thread become standing nodes only when they carry weight; otherwise they are map-views (see the visual layer).

**A node that is absent says the unit is untouched** — the single-source rule holds at corpus scale, and it is what makes the store the resume state for a multi-session batch.

**Promotion link-back.** When a source is promoted to a deep single-source run, its own `<Author>, <Short Title> — study-store.md` is created beside it, and the **batch store's source-node points to it** (`→ deep study: <path>`). Never duplicate; link. Store format: `store-template.md`.

---

## The instruments

The existing instruments re-aim to corpus scale; one is new to batch.

| Instrument | At corpus scale |
|---|---|
| **the sweep** | L1 on every source — this **is** the read-all-and-skeleton pass. Per source: what it argues, its role in the debate, its names/terms, fidelity/OCR notes. Writes source-nodes as it goes. |
| **the visual outline** | the debate's divisions made spatial → a **map** (the "debate-map" is a map, not a new artifact — see the visual layer); plus names / timeline / thread maps as the corpus calls for them. |
| **the conversation** | unchanged — pursue a question the corpus opened, with no text to work through. Expect it to be high-yield here as in single-source runs. |
| **terms and names** | inventory across the corpus — shared vocabulary, the recurring cast; feeds names-maps. `terms-and-names.md`. |
| **cross-source search** | ⭐ **new** — search the whole corpus against the user's question. The capability they do not have at all. |
| **questioning** | re-enters at a **promoted** source, not at corpus scale (given-first is the corpus default). `questioning.md`. |

### ⚠ Read all and skeleton each *before* anything user-facing

The sweep comes first, and the inventory is settled as part of it — **a batch is usually larger or messier than the opening message named.** Name mislabeled or irrelevant items out; add ones that belong. The corpus-L1 deliverable is **the shape of the debate** (the contested question, the camps in a line each, the cross-cutting questions that become the descent menu) — **not a source-by-source roll-call.**

### The two seams to single-source study

- **Promotion.** The closing verdict of a batch is a **promotion shortlist**: which two or three sources earn a deep single-source run, **with the reason for each** (the constructive engine · an orthogonal axis · the outlier), and which to hold as background. Each promotion is a future run; the batch store records the verdict and links out (above).
- **Questioning re-enters at the promoted source.** The corpus is given-first; a promoted source is a fresh single-source unit where asked-first returns if being wrong there would be diagnostic (their own field, a text they will write on).

Both are **available moves.** The skill may remind at the natural moment ("three sources look worth a deep run — want the shortlist?") but does not force.

### Completion conditions

An operation with no test for being finished gets skipped, and only its residue gets produced. The two batch-specific ones:

| Operation | Finished when |
|---|---|
| **the sweep / inventory** | every source in the settled inventory has a source-node, and the inventory itself is settled (nothing mislabeled left in, nothing relevant left out). |
| **cross-source search** | **every source in the inventory is marked hit / partial / miss against the question, with a located anchor for every hit.** A search that looked at some and stopped is not finished — an unsearched source is indistinguishable from a miss unless it is marked. |

---

## ⭐ The quotation rule — the rule the old batch mode most obviously lacked

> **Every interpretation of an author's position carries an actual quotation beside it. Constructed terminology — a neutral vocabulary imposed on the debate, or a question attributed to an author he never posed — is marked as ours, without exception.**

Building a neutral terminology and attributing to an author a question he never asked are **legitimate and necessary** — a debate-map *is* an imposed vocabulary. They are also the highest-imputation-risk operations in the system, because the author's structure and ours become indistinguishable later. So: the position gets a quotation; the construction gets marked `[INT]` (ours). This is the same discipline as the axis-hypothesis above — a framing is a construction, and a construction is owned and checked.

---

## The derived artifacts — companion and maps, re-aimed

Terminology is the skill's throughout — the **study-store** (md, governing) · the **thinking note** (md, the user's) · the **response record** (md, log) · **maps** (html, plural) · the **companion** (html, one). No new artifact kind for batch. Full spec: `maps.md`, `store-template.md`.

- **The companion** — the **run-through**, read start to finish. Single source: the whole, then chapter by chapter. **Batch: the surveyed field as a whole, then source by source** — one stratum per article/book. Its job is to *walk the material in order.*
- **The debate-map is a map** — interpretive sorting of sides, camps, and fault-lines: the map whose question is *"how does this debate divide?"* It is simply a map, under **one map, one question** applied flexibly (the debate's divisions, plus names / timeline / thread maps the corpus calls for).

Both derived wholesale from the store; corrections land in the store, never in a view; run `check-maps.js` on the maps.

---

## ⚠ Drift — reconcile a long batch before logging it

A plural, accreting store — especially one built piecemeal as sources arrive in waves (the honest way to start before the source set is known) — goes stale as later stages reframe earlier nodes. Write-before-speaking prevents *worked-but-not-written*; it does **not** prevent *written-early-then-reframed-later*.

- **Completion condition:** in a multi-stage or many-node batch, **reconcile the store against its own later nodes before the closing study-log line** — one named pass (catch garbled words, orphan first-mentions, duplicated sections, stale "do-not-yet" instructions overtaken by later stages).
- The skill **may remind** at the stopping point ("this ran long and reframed itself twice — worth a reconciliation pass before I log it?"). It does not force.
- **First-mention identification binds store nodes, not only chat messages.** A name entering a node bare — no clause of who/what it is — is the same failure in the store as in the message, and the store is what is read cold months later.

---

## Closing the session

Append one line to the study log (the profile's `study_log`) — *source(s) · date · goal · depth (batch) · map? · **feeds** (what project or piece of writing this serves, if any) · artifacts · location* — and, for a batch, **record the framing/axis used** so the repertoire below can grow. The brief axis goes in the log's substance; the one-line addition to *Framings seen so far* (below) is what the next session reads.

---

## Framings seen so far — add as trials reveal them

*A running, brief list of organizing axes that have proven fruitful on real corpora. One line each. The **details** — which corpus, why the axis fit, what it revealed, what it missed — live in that session's study-log entry, not here.*

- **disagreement** — who holds what, where positions conflict. *(AI-and-understanding, 2026-09: three families by what they make understanding require.)*
- **methodology / what-question-they-ask** — what each source does and how, not who disagrees. *(Contemplation-beauty-science debate-map.)*
- **timeline + dependency** — time-order + citation genealogies + primary-source reliance; esp. historical/exegetical. *(named as a possibility; test and refine.)*
- **multi-axis** — identify two axes and cross them. *(Natural-theology-beauty study-map: disagreement × methodology, "really useful.")*
