---
name: new-lesson
description: >-
  Lesson creation wizard. Use when the user wants to add a new lesson to an
  existing course. Walks through script intake, avatar footage verification,
  visual planning from the official slide deck, and EDL scaffolding.
  Follows the procedure in docs/act-engine-lesson-procedure.md.
---

# New Lesson Wizard

Guide the user through adding a lesson to their course. This skill handles
the structured onboarding — confirming inputs, planning visuals, and
scaffolding the lesson data.

## Before Starting

1. Read `docs/act-engine-lesson-procedure.md` for the full build procedure.
2. Read `docs/agent-workflow.md` for the lesson package structure.
3. Check `git status` and `git branch` to confirm which course/lesson branch
   is active.
4. Load `course-config.json` to understand the course's visual identity.

## Pre-flight Checks

1. **Confirm the course** — Which course does this lesson belong to?
   Check the current branch or ask. The course branch must exist.
2. **Lesson number** — Ask for the lesson number and title.
3. **Check for existing lesson branch** — Look for
   `lesson/<course-slug>/<NN>`. If it exists, ask before switching.

## Interview

### Step 1 — Script

Ask using `ask_question`:

1. "Do you have the pure narration script (pure-script.md) ready?"
   - "Yes, it's ready"
   - "Not yet — I need to write it first"

If not ready, explain what's needed:
- A markdown file with explicit `## Scene 001` headings
- Each scene ≤ 800 spoken characters
- No visual directions (those are derived from the theme)
- Stop here and tell the user to come back when the script is ready.

If ready, ask where the file is located.

### Step 2 — Avatar Footage

1. "Is the master avatar video ready?"
   - "Yes, one continuous file"
   - "Yes, but as separate per-scene clips"
   - "Not yet"

If separate clips, explain they need to be joined into one continuous file
and the seam timestamps recorded in `cuts.json`.

If not ready, note it and continue with planning — footage can come later.

If ready, ask for the file path and verify it exists.

### Step 3 — Official Visuals

Inspect the matching lesson in the official slide deck:

1. Check `source-material/ACT Lessons Updated Logo.pptx` (or the course's
   equivalent deck) for the lesson number.
2. List any important diagrams, photographs, frameworks, or worksheets
   found in those slides.
3. Present them to the user and ask which ones to include.
4. Record slide numbers for the asset manifest.

### Step 4 — Visual Direction

Based on the course config's presenter grammar and the script content:

1. **Suggest scene breakdown** — Map script scenes to presenter layouts:
   - Which scenes should be full-bleed (presenter talking, no graphic)?
   - Which scenes need a split layout with a slide?
   - Where should section transitions go?

2. **Suggest component types** — For each scene with a graphic, suggest
   which engine component fits:
   - `TitleSlide` — for the opening
   - `StatementSlide` — for key messages
   - `ActivitySlide` — for exercises
   - `ChecklistSlide` — for lists
   - `ThreeZoneDiagram`, `FourStepJourney` — for concepts
   - `QuoteCard`, `DefinitionCard` — for quotes/definitions
   - `PhotoGridSlide` — for official visuals from the deck

3. **Ask for any custom needs** — "Do any sections need special visuals
   not covered by the standard components?"

### Step 5 — Review & Approve

Summarize all decisions in an artifact:
- Lesson number, title, course
- Script location
- Avatar footage status
- Official visuals selected (with slide numbers)
- Proposed scene-to-component mapping
- Any custom requirements

Wait for explicit user approval.

## After Approval

1. **Propose branch creation** — Announce the exact operation:
   - Branch name: `lesson/<course-slug>/<NN>` (zero-padded)
   - Base: `course/<course-slug>`
   - Wait for explicit approval. Do NOT create without it.

2. **Create lesson directory structure**:
   ```
   lessons/lesson-NN/
     input/
       pure-script.md
     avatar/
     assets/
     generated/
       cuts.json
       word-timing/
     qa/
     output/
   ```

3. **Stage the avatar video** — Copy/move to
   `production/act-engine/public/avatar/lesson-NN-master.mp4`

4. **Run word timing** — `npm run word-timing -- NN`

5. **Scaffold the EDL** — Create a starter EDL file at
   `lessons/lesson-NN/generated/lesson-NN-edl.ts` with scene boundaries
   matching the script.

6. **Run the checker** — `npm run check -- NN`

## Important Rules

- The pure script is LOCKED. Never rewrite, paraphrase, add, or remove
  spoken content.
- Never invent Arabic, religious text, quotations, or URLs.
- Visual decisions come from the course theme and the official deck, not
  from improvisation.
- Record the source deck filename and slide number for every extracted visual.
- Follow the exact procedure in `docs/act-engine-lesson-procedure.md`.
