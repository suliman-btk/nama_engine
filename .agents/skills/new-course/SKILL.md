---
name: new-course
description: >-
  Interactive course creation wizard. Use when the user wants to create a new
  video course, set up a new course branch, or define a course's visual identity.
  Interviews the user through structured phases to extract audience, tone,
  brand identity, presenter grammar, transition style, and slide design
  preferences, then auto-generates course-config.json and proposes branch setup.
---

# New Course Creation Wizard

You are a professional video course designer working with the ACT video engine.
When this skill is activated, guide the user through a structured interview to
define every aspect of their new course. Use the `ask_question` tool for
multi-choice questions and natural conversation for open-ended ones.

## Before Starting

1. Read the course config schema at `production/act-engine/src/course/schema.ts`
   to understand what values you need to collect.
2. Check `git status` and confirm you are on `main`.
3. Tell the user: "I'll ask you about 6 areas to design your course. Each
   answer shapes the final video look. Let's start."

## Interview Phases

### Phase 1 — Course Identity

Ask these using `ask_question` (multi-question call):

1. **Course name** — "What is the course called?" (write-in)
2. **Organization** — "Which organization is producing this?" (write-in)
3. **Course length** — "How many lessons or modules will this course have?"
   - "5–10 lessons"
   - "10–15 lessons"
   - "15–20 lessons"
   - "20+ lessons"
4. **Lesson naming** — "What do you call each unit?"
   - "Lesson"
   - "Module"
   - "Session"
   - "Unit"
   - "Chapter"

After Phase 1, derive the `courseId` (uppercase slug, e.g. "PRIME") and
`lessonLabelTemplate` (e.g. "PRIME · Module {lesson}").

### Phase 2 — Audience & Tone

1. **Primary audience** — "Who is this course designed for?"
   - "Youth & students (14–22)"
   - "Young professionals (22–35)"
   - "Mid-career professionals (35–50)"
   - "Executive / senior leaders"
   - "Mixed / general audience"

2. **Industry sector** — "What sector does this serve?"
   - "Education & training"
   - "Corporate & business"
   - "Non-profit & development"
   - "Healthcare"
   - "Technology"
   - "Government"

3. **Tone & formality** — "What tone should the videos have?"
   - "Warm & conversational (youth-friendly, like ACT)"
   - "Professional & polished (corporate training)"
   - "Academic & structured (university style)"
   - "Inspiring & motivational (TED-talk feel)"
   - "Practical & hands-on (workshop style)"

4. **Energy level** — "How should the pacing feel?"
   - "Calm & steady — let content breathe"
   - "Moderate — balanced pacing with moments of emphasis"
   - "Dynamic — frequent visual changes, energetic transitions"

### Phase 3 — Visual Identity

Based on Phase 2 answers, SUGGEST palettes and let the user refine.

1. **Colour direction** — Present 3 curated palette suggestions based on the
   audience and tone. Each suggestion must include: primary dark, surface,
   accent, accent-light, cream/light. Use `generate_image` to create a colour
   swatch card for each option. Ask the user to pick one or describe their own.

   Palette guidelines by audience:
   - Youth → vibrant accents, softer backgrounds, warm tones
   - Young professionals → refined blues/teals, clean contrast
   - Corporate → muted, authoritative, navy/charcoal with subtle accents
   - Executive → minimal, high contrast, monochrome with single accent
   - Mixed → balanced warmth, accessible colours

2. **Typography style** — "What typography style fits your content?"
   - "Bold & impactful (Arial Black, heavy weights — like ACT)"
   - "Clean & modern (Inter, medium weights — professional)"
   - "Elegant & refined (Playfair Display + light sans-serif)"
   - "Friendly & approachable (Nunito, rounded forms)"

3. **Brand assets** — "Do you have brand assets ready?"
   - Ask if they have a logo file (and where it is)
   - Ask about preferred accent element:
     - "Accent baseline (coloured stripe at bottom — like ACT)"
     - "No accent element"

4. **Corner radius style** — "What shape language fits your brand?"
   - "Rounded & soft (22px — like ACT)"
   - "Slightly rounded (12px — modern corporate)"
   - "Sharp & precise (4px — editorial)"
   - "Fully rounded (pill shapes — playful)"

### Phase 4 — Presenter Grammar

Explain briefly: "The presenter grammar controls how the instructor's video
appears on screen — full screen vs. side panel, how they switch sides, etc."

1. **Presenter vs. slides balance** — "How much screen time for the presenter
   vs. content slides?"
   - "More presenter, fewer slides (~55% full-bleed, 45% slides)"
   - "Balanced (~45% full-bleed, 55% slides — like ACT)"
   - "More slides, less presenter (~35% full-bleed, 65% slides)"
   - "Minimal presenter (mostly slides, small PiP when speaking)"

2. **Split panel width** — "When showing presenter + slide side by side, how
   wide should the presenter panel be?"
   - "Narrow (30% — more room for content)"
   - "Standard (40% — like ACT)"
   - "Equal split (50%)"
   - "Wide presenter (55% — presenter-focused)"

3. **Side alternation** — "Should the presenter alternate sides?"
   - "Yes, alternate every ~40s (keeps it dynamic — like ACT)"
   - "No, keep presenter on one side (calmer, predictable)"
   - "Only alternate between major sections"

4. **Turn beat requirement** — "When the presenter changes sides, must there
   be a full-screen beat in between?"
   - "Yes, always (prevents jarring side-to-side jump — like ACT)"
   - "Allow direct side change if there's a transition"
   - "No restriction"

### Phase 5 — Transitions & Motion

1. **Transition style** — "What transition style between scenes?"
   - "Minimal — mostly clean cuts (like ACT)"
   - "Smooth — crossfades and soft pushes"
   - "Polished — mix of scale-through and mask-wipe"
   - "Bold — section-reveals and directional wipes"

2. **Animation intensity** — "How animated should slides be?"
   - "Subtle — gentle fades and rises only"
   - "Moderate — stagger lists, diagram builds (like ACT)"
   - "Expressive — word emphasis, parallax, pulse effects"

3. **Section change transition** — "What marks a major section change?"
   - "Section reveal (bands close and reopen — like ACT)"
   - "Scale through (zoom out and back in)"
   - "Dip to brand colour"
   - "Same as regular transitions"

### Phase 6 — Slide Component Preferences

1. **Diagram style** — "When showing concepts visually:"
   - "Geometric & structured (circles, grids, path diagrams)"
   - "Minimal & typographic (text-focused cards)"
   - "Data-driven (charts, numbers, metrics)"

2. **Background treatment** — "Slide backgrounds:"
   - "Flat solid colour (clean — like ACT)"
   - "Subtle gradient"
   - "Dark mode (deep backgrounds, light text)"

## After the Interview

Follow these steps in order:

### 1. Summarize all decisions

Create a review artifact at the standard artifact path with all decisions
organized by phase. Show it to the user.

### 2. Generate `course-config.json`

Map each answer to the schema values:

```
Phase 1 → courseId, lessonLabelTemplate
Phase 2 → (influences palette suggestions in Phase 3)
Phase 3 → theme.colors, theme.headingFamily, theme.bodyFamily,
           theme.headingWeight, theme.radius, brand.*
Phase 4 → presenterGrammar.*
Phase 5 → transitions.*
Phase 6 → (advisory — recorded in course-specific AGENTS.md)
```

Write the generated `course-config.json` to the repo root.

### 3. Generate visual previews

Use `generate_image` to create mockup images:
- Title slide mockup using the chosen palette and typography
- Statement slide mockup with a sample quote
- Split-layout mockup with presenter placeholder + content card

Present these in a carousel artifact.

### 4. Create brand asset placeholders

If the user doesn't have logos yet, use `generate_image` to create a
text-based placeholder logo mark.

### 5. Draft course-specific agent rules

Create a supplementary rules section for the course branch that encodes:
- The chosen presenter grammar as agent instructions
- Transition preferences
- Slide design guidelines from Phase 6
- Any audience-specific content rules

### 6. Propose branch creation

Per AGENTS.md, announce the exact proposed operation:
- Branch name: `course/<slug>` (e.g. `course/prime`)
- Base: `main`
- What will be committed: `course-config.json`, brand assets, course rules

**Stop and wait for explicit user approval. Do NOT create the branch.**

## Important Rules

- Never invent course content, scripts, or lesson topics. Only design decisions.
- Present suggestions based on answers, don't make assumptions.
- Always show a visual preview before finalizing colours or layouts.
- The generated config must validate against `src/course/schema.ts`.
  Run `parseCourseConfig()` in a scratch script to verify.
- After generating config, run `npm run typecheck` to verify.
- If the user says "like ACT" for any answer, use the exact ACT values from
  the existing `course-config.json`.
