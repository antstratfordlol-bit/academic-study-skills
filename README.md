# Academic Study Skills for Claude

A dual-skill toolkit for Claude (Claude Code, Claude Projects, and Claude Desktop) designed for rigorous scholarship in philosophy, theology, and the humanities.

```
academic-study-skills/
├── README.md
├── socratic-mentor/
│   ├── SKILL.md
│   └── references/
│       └── questions.md
└── study/
    ├── SKILL.md
    ├── README.md
    └── references/
        ├── questioning.md
        ├── scholastic.md
        └── terms-and-names.md
```

---

## 1. Overview of the Skills

### `socratic-mentor`
* **Role**: An exacting Socratic supervisor and sparring partner.
* **Core Principle**: *Questions, not drafts*. The assistant never writes the thesis, draft, or outline for you; it tests your grasp through oral, closed-book dialogue.
* **Key Features**:
  * Asks exactly one piercing question at a time.
  * Challenges vague terms and demands formal distinctions.
  * Formulates the strongest counter-argument (*videtur quod non*).
  * Demands structural textual loci and verifies claims.
  * 8 developmental stages from topic selection to viva voce defence.
  * Rich reference battery across disciplines in `references/questions.md`.

### `study`
* **Role**: An analytical reading companion for deep textual mastery.
* **Core Principle**: Two colleagues navigating a source by units (passage, chapter, whole work).
* **Key Features**:
  * Three recurring questions at any scale: **L1** (the whole), **L2** (the parts), and **L3** (the findings).
  * Dedicated instruments: *The Sweep*, *Terms and Names*, *Questioning* (withholding interpretation until the reader commits), and *The Scholastic Disputation Loop* (*articulus*, *objectiones*, *sed contra*, *respondeo*, *responsiones*).

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
   * Open the text. Follow Mortimer Adler's analytical reading method.
   * Isolate the *status quaestionis*, mark technical terms, and trace the logical joints of the argument.
   * No passive highlighting; take structural margin notes only.

2. **Block 2: Closed-Book Socratic Sparring (40 min)**
   * Close the book and all notes (*a libro chiuso*).
   * Activate `socratic-mentor` in Claude.
   * **Use voice dictation**: Press `Win + H` on Windows or double-tap `Fn` on macOS. Dictating answers aloud forces neural retrieval and sharpens verbal precision.
   * Face the examiner's counter-objections and expose any hidden gaps (*lacunae*).

3. **Block 3: Synthesis & Anki Flashcards (20 min)**
   * Formulate 3 to 5 atomic Anki flashcards addressing the specific distinctions or loci where you hesitated during Block 2.
   * Record a brief two-sentence resolution in your study log.

---

## 3. Installation Guide for Claude

### Method A: Claude Code (CLI)

#### Option 1: Global Installation (Available across all projects)
Copy both skill directories to your personal Claude skills directory:

* **macOS / Linux**:
  ```bash
  mkdir -p ~/.claude/skills
  cp -r socratic-mentor study ~/.claude/skills/
  ```

* **Windows (PowerShell)**:
  ```powershell
  New-Item -ItemType Directory -Force -Path "$HOME\.claude\skills"
  Copy-Item -Recurse socratic-mentor, study "$HOME\.claude\skills\"
  ```

#### Option 2: Project-Specific Installation
Copy the skills directly into the `.claude/skills/` directory of your active project repository:
```text
your-project/
└── .claude/
    └── skills/
        ├── socratic-mentor/
        └── study/
```

Claude Code will automatically discover both skills and trigger them when you say:
* *"Play my supervisor and question me on Aquinas on faith"*
* *"Help me think through my thesis"*
* *"Study this text with me"*
* *"/study"*

---

### Method B: Claude.ai Web (Claude Projects)

If you use Claude through the browser (Claude Pro / Team):

1. Go to [Claude.ai](https://claude.ai) and open or create a **Project** (e.g. *"Theology & Philosophy Seminar"*).
2. Under **Project Knowledge**, upload:
   * `socratic-mentor/SKILL.md`
   * `socratic-mentor/references/questions.md`
   * `study/SKILL.md`
   * `study/references/scholastic.md`
   * `study/references/questioning.md`
   * `study/references/terms-and-names.md`
3. Under **Project Instructions**, paste the following directive:

```markdown
You have access to the `socratic-mentor` and `study` skill files in Project Knowledge.
When the user asks to be examined, questioned, or prepared for a defence, strictly adhere to the rules in `socratic-mentor/SKILL.md`:
- Ask exactly one question at a time.
- Never write drafts or essays for the user; make them articulate the thesis.
- Challenge vague answers and demand formal distinctions.
- Present formidable counter-arguments (videtur quod non).
When the user asks to read or work through a source, adopt the `study` protocol.
```

---

## 4. Licence & Conventions
Designed for classical academic rigour, Patristic and Scholastic disputation, and philosophical investigation. All Latin technical expressions and formulas are preserved in standard academic orthography.
