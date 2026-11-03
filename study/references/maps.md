# The visual layer — maps, the companion, and the pocket

**All are *derived* from the store, regenerated wholesale, never hand-edited.** Corrections land in the store. None is maintained, so none can drift.

> ### ⭐ The ideal, and everything below is a way of not breaking half of it
>
> **See the whole at a glance, and reach any part of it without losing the whole.**

---

## Three kinds of view, and they are not rivals

| | Reads on | Answers | Optimised for |
|---|---|---|---|
| **maps** *(html, **plural** — one per question)* | desk | *where am I, and what is this?* | **Seen at once.** Spatial; detail on demand, opening in place |
| **the companion** *(html, one)* | desk | *take me through it* | **Descending and returning without losing the structure.** The whole store, with room for detail at length |
| **the pocket** *(html, one)* | **phone** | *who was that · what's next · what year* | **Answering in under five seconds, one-handed.** Search-first; nothing on screen until asked for |

**Map and companion both, not one.** The map orients and lets the user re-enter; the companion is the working surface for reading through. Trial-confirmed on Whitby, 2026-08-16.

**The pocket is conditional** — see below. Added 2026-08-27 (Levin/Hillsong).

---

## The six principles

**1 · One map, one question.** A map answers a single question about a single unit. When a second question needs answering, that is a **second map** — never more nodes on the first. *Test: can you say what this map is for in one clause?*

**2 · Three levels, and only three.** The **whole** at the centre · its **immediate parts**, visible · **detail on each part**, on demand. One unit and its immediate parts; **never the whole descent.**

⇒ **Depth comes from having more maps, not from a deeper one.** And therefore: **the map set mirrors the store's node tree and grows with it.** A unit gets its map when its L1 lands — and naming *what this chapter is actually doing* **is** the L1 task, so a map is a by-product of work already done, not a build at the end.

**3 · The material's own shape picks the form.** Sequence in time → a timeline. Whole-and-parts → a centre with its parts around it. Relations, especially reversals → a web with typed edges. A set of like things hanging off one idea → a family map with a core.

⚠ **Never impose a form the material does not have.** Where one is imposed anyway because it is useful, **say so in the caption.** *(The Whitby chronology is imposed: he refuses to narrate the field historically and says why at p. xi. Useful, and marked as ours.)*

**4 · Detail opens where the eye already is.** A click reveals **at the node clicked**, not elsewhere on the page. Detail landing below the figure is not a third level, it is a second page: on any ordinary screen the thing and its explanation are never visible together. **This is the accordion failure one level up** — a payload out of view costs a click and gives nothing.

**5 · Economy is the test, and the test is what can be seen at once.** The measure of a map is what it gives **without scrolling and without clicking**. If adding a node makes that worse, the node belongs in another map. A map that must be explored before it becomes intelligible has failed at the thing maps are for.

> ### ⭐ And opening a detail must not break that
>
> **The figure is sized to be seen whole; a detail card that pushes past the frame makes the reader lose the thing the map exists to show.** Principle 4 says detail opens where the eye already is — this is its other half: *opening a detail may not change what is on screen apart from the card itself.*
>
> **The tell is a scrollbar appearing on click.** If the frame gains one, the card has overflowed. It reads as a fault even to someone who cannot say why, because a map that scrolls is admitting it did not fit.
>
> ⚠ **The cause is almost always an unclamped axis, not a layout that needs rearranging.** A card is typically anchored below-right of its node and clamped left/right and against the top — and then nothing handles the bottom, so every node in the lower half overflows. **Clamping three sides out of four is the bug**; it passes every test done with the top half of a figure.
>
> **The fix is to flip, then clamp, in both axes:**
>
> 1. prefer the default side (below, to the right);
> 2. if it would overflow, **flip to the other side of the node** — which needs the node's *top* edge as well as its bottom, so pass both;
> 3. if it still does not fit — a card taller than the frame — clamp inside the frame and let it cover the figure. **Covering part of the map is correct here**: the reader is reading the card, and it is dismissed on click or Escape.
>
> **Measure the card, don't estimate it.** Its height depends on the text it holds, so render it hidden, read `offsetHeight`, then position. A guessed height is the same class of error as a guessed label width.
>
> **Moving nodes upward to dodge this is treating the symptom** — it constrains the layout permanently to work around a positioning bug, and position is supposed to carry meaning.
>
> *(Whitby, 2026-08-29: found by the author on the shipped page — "in principle the map is all visible on the screen but clicking on the lower boxes opens downwards so there appears a scrolling feature — but a scrolling feature already suggests something is not quite right.")*

**6 · A label carries a claim where the node is a unit; a name where the node is a name.** *"Ch. 3"* is a pointer; *"a second family, from brains and evolution, that renames what you already met"* is information. But a **term** node is properly just the term, with the claim in the detail. **The rule binds units, not leaves.**

---

## ⭐ Position must mean something

The sharpest diagnosis from the Whitby trial. A first attempt grouped terms into labelled ovals and laid them out in a grid inside each one — and read as *bulky and not very illustrative*, because **only the grouping carried information and every other spatial fact was furniture.**

> **If a node could be moved anywhere inside its region without loss, the layout is decoration.**

The fix was to give each family a **core idea** with its terms hanging off it by what they do. What then emerged was worth more than the fix: all four families turned out to share one internal shape — *core idea · its machinery · the limit it runs into*, two of them adding *the spin-offs the limit produced* — which is the book's own refrain appearing four times at family scale.

⇒ **When an arrangement makes an argument visible, that is a finding, and the caption should say whose it is.**

---

## ⭐ Every label owns a box, and boxes may not overlap

**The failure this prevents is not ugliness — it is illegibility**, and it destroys a map's whole purpose: a label you cannot read is worse than an absent one, because the space is spent and nothing is delivered. Found on the Isaacson trial (2026-08-26), where three of four maps shipped with buried text: timeline labels written over each other, three product boxes stacked at identical coordinates, and a whole column of row labels hidden under the first column of cells.

**One cause in all three cases: positions computed from hand-guessed constants, with no measurement and no reserved space.**

### The three rules

**1 · Measure, don't guess.** Estimate a string's rendered width from its characters, at its actual font size and weight, and position from that. Never `length * 6.8`, never a tuned constant that happened to look right with the strings you had. *Test: if a label's text changed, would the layout still be correct?*

**2 · Reserve, don't hope.** Any region that holds labels — a gutter, a lane, an axis, a column — has its extent **declared once**, and everything else begins after it. No element may be drawn into space another element already claims. Derive the reservation from the content (the longest label in the gutter), not from a number you picked.

**3 · Resolve collisions by displacement, not by luck.** Test the real interval `[start, start+width]` against **everything already placed at that level** — including each neighbour's width, not only the new item's — and step to the next free level. A near-miss achieved by a fudge factor is a bug that has not fired yet.

⚠ **Displacement must not falsify the reading.** Where position encodes meaning, a collision may only be resolved *within* the band that carries it. On the Isaacson products map, outcome is encoded by height, so colliding products are nudged into sub-rows inside their own band — never across the line, which would turn a success into a failure to save 20px.

### ⚠ A label wider than the region it names

**Shrinking is not always the answer.** Where a band's label is set to shrink to fit, a *narrow* band drives the type to nothing — and if a floor is set, the label silently overflows into the neighbouring band instead, where it reads as belonging to the wrong thing. *(Levin map 3: "PART IV — AND THE BAND PLAYED ON" labels a single chapter in a ~42px band; at ~200px it spilled across Part III.)*

**Three honest ways out, in order of preference:** put the label **outside** the band with a leader or tick to it · **abbreviate deliberately** rather than scaling to illegibility · or give the band a **minimum width** and let the map be wider. Scaling below about 8px is not a solution, it is a decision to make the label unreadable.

### And the container is content-derived too

A figure's height is not a constant you set at the top. **Pack first, draw second:** the stacking depth that comes out of the collision pass is what decides where the axis goes and how tall the SVG is. A map whose content outgrows its hand-set height writes over its own furniture.

### Verify by measurement, not by looking

**Assert the absence of overlaps; don't eyeball it.** Run the page's script, collect every drawn text node as a box using the same width estimator the page uses, and test all pairs. The check is cheap, it runs without a browser, and it is the difference between *"looks fine to me"* and *216 labels, zero overlaps*. Eyeballing is what shipped the bug.

```
node "<skill base directory>/references/check-maps.js" "<path to — study-maps.html>"
```

Run it by absolute path from this skill's own folder (the "Base directory for this skill" Claude Code shows when the skill loads). Both checkers need Node.js and nothing else (no packages): on a Mac `brew install node`, on Windows `winget install OpenJS.NodeJS`.

Reports script errors, per-SVG element counts, **every overlapping label pair**, and **every label buried under an opaque box** — the second because the original failure was row labels painted over by a column, which text-against-text alone cannot see. **Zero of both is the passing condition; run it before shipping any maps page.**

> ### ⚠ A verifier that only ever passes is worse than none
>
> **Prove it fires.** Reintroduce the bug it exists to catch, confirm it reports, then put the fix back. Both of this one's checks were confirmed against the exact original defect (columns starting at x=42.5 over the gutter) before being trusted.
>
> Two ways it went quietly wrong while being built, both instructive: it counted **translucent background banding** as opaque, and it missed hit-areas set via `setAttribute("class","hit")` because it only inspected `classList`. Each produced dozens of confident false positives — and a checker that cries wolf gets ignored exactly like one that never speaks.
>
> ⚠ **The width estimator was duplicated, and it drifted.** Flagged as a hazard on 26 August, real by 27 August: the page used `A–Z = 0.68`, the checker `0.76`, and the ~12% inflation invented three "buried label" reports on a page that was correct. **Fixed at the root — the checker now lifts the page's own `textW`/`tw` and uses it verbatim**, falling back to its own copy only when the page defines none, and saying which it used. A measuring tool that measures differently from the thing it measures is worse than no tool.
>
> ### ⚠ Four ways this checker failed silently, all worth knowing
>
> Each of these made it **pass a page it had not actually checked** — the worst failure mode a verifier has.
>
> | | |
> |---|---|
> | **It assumed ids `s1–s4`** | A page with three maps left a phantom fourth reporting clean. Now the SVGs are **discovered from the markup**. |
> | **It read `viewBox` only if script set it** | Set in markup, it read `null`, the canvas measured zero, and **every rect looked like a full-bleed backdrop** — so the burial check was dead on the whole file. Now seeded from the markup attributes. |
> | **It read `font-size` only from `style`** | A presentation attribute fell back to a default size, measuring the wrong box. Now reads both. |
> | **It ignored `transform`** | A rotated label cannot be measured as an axis-aligned box. It now **reports rotated labels as unchecked and fails**, rather than certifying them. |
> | **It hardcoded host ids `f1`–`f6`** | A page with a seventh map got `null` from `getElementById`, threw inside its own popover helper, and left **five SVGs empty** — reported as a page fault when it was the checker's. Host ids are now **discovered from the markup**. *(Whitby, 2026-08-29.)* |
>
> ⇒ **The lesson generalises past this tool.** *A check that cannot fail is not a check.* Whenever one is built, ask what it would do if handed a page it has never seen — different ids, attributes in different places, a construct it does not model. **Silence must mean verified, never unexamined.**

> ### ⭐⭐ When the checker reports a fault, suspect the checker first
>
> **This is now the most reliable pattern in the whole tooling record, and it should be the default expectation rather than a surprise.** Across four sessions the tool has reported faults on pages that were correct far more often than it has found real ones: a broken result counter · a shim whose `innerHTML` did not clear children · a `body\s*\{` regex matching `html,body{margin:0}` · three false burials from a drifted width estimator · hardcoded host ids blanking five maps · a missing `replaceChild` · a null `parentElement` · a missing `querySelector`.
>
> **The asymmetry has a cause.** The page is written to do a job and is looked at; the shim is a sketch of a browser, written once and generalised from a single file. **The shim is the immature artifact, and it is the one making the accusation.**
>
> **So the order of work is fixed:**
>
> 1. **Reproduce the claim against the file itself** — open the line the tool names and read it. A fault you cannot see in the source is a fault in the tool until proven otherwise.
> 2. **Only then change the page** — and if the tool was wrong, fix the tool and record why, so the same false alarm is not re-litigated next time.
> 3. **Never "fix" a page to satisfy a check you have not confirmed.** That is how a correct artifact gets damaged by its own quality gate.
>
> ⚠ **And the converse still holds**: a pass is only as good as what the tool actually examined. Both halves are the same discipline — **the tool's verdict, in either direction, is a claim to be checked, not a result to be accepted.**

---

## Forms

| Form | Use when | Notes |
|---|---|---|
| **Centre and parts** | a unit and its immediate parts | The default for a unit's own map. Part nodes carry what each part is *doing*, not its title |
| **Family map** | a set of like things hanging off one idea | A core node, and terms grouped by their function relative to it |
| **Timeline** | sequence is a real dimension of the material | Pack labels into lanes by measured collision; never hand-assign. See *Every label owns a box* above — this is where that rule bites hardest |
| **Relation web** | relations carry the argument, especially **reversals** | Edge type by **both colour and dash pattern**, so identity never rests on colour alone. Trial-proven on a prosopographically dense source |

**Untouched units are drawn, dashed and dimmed.** An absent node means the unit has not been worked, and that is true information — showing it as a gap is better than omitting it, which reads as completeness.

### ⭐⭐ Which maps are worth building is a finding of the reading, not a plan made before it

**The question arrives at the door** — *suggest maps, and say which order to do this in* — and the tempting answer is to design the set from the contents page and then read. **That produces decoration.** A map built before the reading can only redraw what the table of contents already says.

**What can and cannot be known in advance.** That a chronology will earn its place is usually predictable, because dates are visible from the outside. **Whether the cast sorts onto a useful axis — and what that axis is — cannot be**, because it is a claim about what the figures are quoted as holding. That is a finding.

> **So: sweep first, and flag map candidates as they arise.** Say this when asked, and give the reason rather than the rule — the user asked a real question and deserves the argument, not a policy.

⭐ **And the reading keeps changing the set after that.** *(Mitchell, 2026-08-29: pass one proposed the cast map with "what is the obstacle" as an axis and privately expected embodiment to be a straw-man end of it. The full read put Kapor, Karpathy **and Mitchell herself** there — so the axis became a real spectrum, and the map's central finding — the optimists cluster on one obstacle while Hofstadter sits alone — only existed once Part V was in.)* A map proposed at pass one is a candidate; it is not commissioned until the unit it draws on has been read.

### ⭐ A set of maps opens with its contents

**Required once a page carries more than about three maps.** A maps page is a set of separate figures on one scroll, and without a contents block the reader has no way to see what is there or reach a map without scrolling past the others — which is the same failure the maps themselves exist to prevent, one level up.

**What it is:** a block of linked items at the top, one per map, above the first figure. Each carries **the map's number and unit** and **what that map answers** — the same rule as principle 6, since a bare "Map 4" is a pointer, not information.

⭐ **Group the items, and let the groups be the ordering argument.** The order of a map set already claims what depends on what (below); grouping makes that visible instead of leaving it implicit in the numbering — *the book and its vocabulary · our synthesis on it · the later chapters*. A flat list of eight is a menu; three named groups is a shape.

**Build notes:** a `grid` with `auto-fit`/`minmax` so it reflows rather than a fixed column count · anchor each section with an id and give sections `scroll-margin-top` so a jump does not land under the page edge · a visible `:focus-visible` state, since these are the page's only keyboard targets · any hover motion behind `prefers-reduced-motion`.

*(Whitby, 2026-08-29, at eight maps — the author: "a missing feature: a table of contents or similar top of page with links to below". It was not in this file.)*

### Ordering a set of maps

**A map set is read top to bottom, so its order is an argument about what depends on what.** Two rules, and the second is the one that gets broken by accident:

- **The unit's own map before any synthesis on it.** A reader meets the material before the reading of it.
- ⭐ **Where the contents block groups the maps, the page order must follow the groups.** The grouping is the ordering argument made explicit (above); if the page then runs 1·2·3·4 across two interleaved groups, the contents and the scroll are making different claims, and the reader believes the scroll. **Number the maps in page order after grouping, not before.** *(Mitchell, 2026-08-29: contents grouped as the book's own · ours, page ran the book's · ours · the book's · ours. Caught on review, not in the build — because each map was correct on its own and only the set was wrong.)*
- ⭐ **A synthesis sits with the units it is about, not at the end.** When maps are added in the order the sessions happened, later chapter-maps get appended *after* a synthesis that was only ever about the earlier chapters — and it then reads as a synthesis of everything, which is a claim nobody made. **Renumber on insertion rather than appending**, and check any cross-references in the figures themselves. *(Whitby, 2026-08-29: maps 6–8 were thinking on chs. 1–3 and had to move ahead of the ch. 4–6 maps.)*

---

## ⭐ The pocket — the phone surface

**Offer it when the source is being consumed away from the desk** — an audiobook, a commute, a conference. **The listening brief is the trigger, not the default;** a source the user will only ever meet at their desk does not need one.

> ### What *trigger* means in practice — three states, not two
>
> | | |
> |---|---|
> | **default** | built every time, unasked |
> | ⭐ **trigger** *(this)* | a condition — the listening brief — makes you **offer it in a line**; the user says yes or no |
> | **never** | built only if the user asks for it by name |
>
> **Nothing in the study skill is built unasked** — the store is the only thing written automatically, and the maps and companion are already offered rather than assumed. The pocket has the same status; what *trigger* adds over *never* is that **you notice**, so the option reaches the user instead of waiting on them to remember the artifact exists.
>
> **Offer at the first natural stopping point, not at the door.** The opening is deliberately cheap, and there is nothing to put in a pocket file until the sweep has landed.

> ### ⭐ The phone is not a smaller desk — it is a different question
>
> The tempting move is *"the companion, minus 60%."* **It is wrong.** The desk views answer *what is this* and *take me through it* — questions asked sitting down, with time. The phone question is narrower and harder: **something just happened and you need one fact in under five seconds.**

**Three moments, named by the author and all three real** (2026-08-27) — and pointedly *not* "reading it properly on the phone":

1. **mid-listen lookup** — earbuds in, walking, a name went past and is gone
2. **before pressing play** — two minutes on the sofa: what is coming, and is any of it an interleave
3. **after a session** — checking what was heard against what the unit was doing

⇒ **Three modes in one instrument, not one screen and not a truncated document.** One tab each.

### What carries over from the desk views — and the one rule that inverts

**Carries over, and gets stronger:** *prose that explains the structure is noise* (on a phone there is no room for it at all) · the accordion, which is the one desk idiom that **improves** here · and *anything visibly trying to persuade fails*, which extends to anything visibly trying to be complete.

⚠ **The rule that inverts.** *"Completeness is not clutter, **unordered** completeness is"* holds on a desk and **not on a phone** — there, completeness genuinely is clutter, and ordering does not rescue it, because there is no peripheral vision to hold the order in.

> **The phone's equivalent: collapse by default, and let search be the ordering device.** Everything stays in the file; almost nothing is on screen.

### The build rules

- **Search is the primary interface, not a convenience.** Fixed top bar; filters names, terms and units at once; name-matches ranked above body-matches and auto-expanded. **Do nothing under 2 characters** — typing "a" must not dump the corpus.
- **Navigation at the *bottom*.** Thumb reach. The header is for identity, not controls.
- ⚠ **No SVG diagrams.** A relation web at 390px is unreadable and pinch-zooming while walking is worse than useless. **A cast becomes a searchable list; a timeline becomes a vertical scroll** — the phone's native direction, so this is a gain rather than a compromise.
- **Dark-first and single-theme, as a choice.** Used walking and at night; a theme that flips mid-walk is worse than one that commits. Paint every colour explicitly regardless, so the page holds on any host ground.
- **`font-size:16px` on the search input.** Anything smaller triggers iOS zoom-on-focus and wrecks the layout mid-tap.
- **`env(safe-area-inset-*)` on both fixed bars**, or the notch and the home indicator eat them.
- **48px minimum tap targets**, and the whole row is the target — never just the title text.
- **Semantic colour carries the kind**, so a medium-restoration warning survives without prose.

### Verifying a pocket

**`check-maps.js` is the wrong instrument** — the pocket has no SVG, so it reports "no `<svg id=…>` found" and then dies on the missing hosts. Use its sibling:

```
node "<skill base directory>/references/check-pocket.js" "<path to — study-pocket.html>"
```

It runs the page's own script against a DOM shim and asserts what a *phone* page gets wrong: the script executes · every pane has a matching tab and exactly one starts open · **every declared data record actually reached the DOM** · search returns for terms sampled from the page's own data, including a surname-only probe · the `<2`-character guard holds · and the phone invariants (16px input, both safe-area insets, ≥44px targets, single-theme, painted body background, no SVG).

> ⚠ **Two lessons from building it, both already on record above and both repeated anyway.**
>
> **It reported three faults on a correct page** — a broken result counter, a shim whose `innerHTML` setter did not clear children, and a `body\s*\{` regex that matched `html,body{margin:0}` first. *Every one was the checker being wrong.* Verify a reported fault against the file before "fixing" the page.
>
> **And it passed a page with all 42 chapters missing**, because the act headings kept the node count above zero. A "more than nothing" assertion is not an assertion. It now counts the records the data declares and compares — confirmed by mutation.

> ### ⭐⭐ An internal check needs an external truth
>
> **The deepest version of the same fault, found by mutation on 2026-08-27.** Even counting declared-versus-built compares the data *against itself*: truncate the chapter array from 42 records to 11 and **both numbers shrink together, so it passes clean**. The check can see records that fail to reach the DOM. It cannot see records that were never declared.
>
> ⇒ **Pass the expected counts from outside the file**, taken from the store or the outline that the view was generated from:
>
> ```
> node "<skill base directory>/references/check-pocket.js" "<— study-pocket.html>" --expect=CH:42,WHO:38,TL:28
> ```
>
> Without it the tool now says so explicitly rather than implying completeness it never tested. **Generalised: whenever a check is derived from the same artifact it is checking, name what it therefore cannot see, and get the truth from the layer above.** For every derived view, that layer is the store.

---

## Captions read the diagram

A caption is not a title. It says **what to look at and what the arrangement claims** — and it is where provenance goes: which groupings are the author's, which are ours, and what is interpretation. One or two sentences, in the same voice as everything else.

---

## Technical

Self-contained: no external stylesheets, scripts or images.

**One exception, and only one: Google Fonts.** A stylesheet from `fonts.googleapis.com` and its faces from `fonts.gstatic.com` may be linked — it is the one external host a published claude.ai Artifact allows, and the typography is visibly better for it. **Every face needs a real fallback stack**, so the page is correct when the fonts do not arrive. Nothing else is linked: no CDN scripts, no remote images, no icon fonts. *(Practice diverged first and the rule caught up — Isaacson, 2026-08-26.)*

Theme-aware — define the light palette on bare `:root`, redefine under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]` so a toggle wins both ways.

**The detail popover is simple and needs no library:** an absolutely positioned card inside the figure frame, coordinates taken from the clicked node's own bounding box, flipped to the other side when it would overflow, clamped vertically, dismissed on outside click or Escape.

⚠ **Give every SVG explicit `width` and `height` attributes, not just a viewBox.** An `<svg>` created empty in the markup and given its `viewBox` by script has **no intrinsic aspect ratio at layout time**, so `width:100%; height:auto` can resolve to zero height: the frame paints and the drawing does not. Set all three (`viewBox`, `width`, `height`) together, and keep it responsive with `svg[width]{max-width:100%}`. *(Isaacson trial, 2026-08-26 — presented as four blank rectangles.)*

⚠ **Run the script before shipping.** A single unescaped quote inside a JS string kills the entire script, and every map on the page renders empty — the same symptom as the height bug, from an unrelated cause. Executing the page's scripts against a minimal DOM shim catches both in seconds and needs no browser. **Prefer typographic quotes (`“ ”`) inside JS string data**, which cannot terminate a string and read better anyway.

Wide diagrams scroll inside their own container; the page body never scrolls horizontally.

> ### ⚠ On Windows: editing these files from PowerShell corrupts them — use Edit
>
> These pages are full of em-dashes, ellipses, typographic quotes and `·`. **`Set-Content` defaults to the system ANSI codepage**, so a read-modify-write round trip through it double-encodes every one of them — `—` becomes `â€"`, `·` becomes `Â·` — silently, across the whole file. Found on the Whitby page, 2026-08-29, doing a bulk edit of thirteen call sites.
>
> **Use the Edit tool for edits to these files.** Where a scripted bulk edit is genuinely warranted (the same change at a dozen call sites), the only safe form is explicit .NET I/O:
>
> ```powershell
> $t = [System.IO.File]::ReadAllText($f)
> # …replacements…
> [System.IO.File]::WriteAllText($f, $t, (New-Object System.Text.UTF8Encoding($false)))
> ```
>
> `UTF8Encoding($false)` writes without a BOM; `Out-File -Encoding utf8` adds one. **And check afterwards** — `grep` the file for `Â·|â€”|â€“`; a zero count is the passing condition.
>
> Two related traps in the same family: **the file's line endings are LF**, so a `.Replace()` pattern written with `` `r`n `` matches nothing and reports success by silence — always count the replacements made and compare to the number expected. And repairing double-encoding after the fact works (decode the mojibake back through codepage 1252) but is a recovery, not a workflow.

**Naming:** `<Author>, <Short Title> — study-maps.html`, `<Author>, <Short Title> — study-companion.html` and `<Author>, <Short Title> — study-pocket.html`, beside the store.

