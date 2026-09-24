---
name: course-theme-preview
description: >-
  Preview and iterate on a course's visual theme. Use when the user wants to
  see what their course will look like, compare colour palettes, or adjust
  design tokens. Generates sample slide mockups and renders preview stills.
---

# Course Theme Preview

Help the user visualize and refine their course theme before committing to it.

## When to Activate

- User says "show me what it looks like" or "preview the theme"
- User wants to compare two palette options
- User wants to adjust colours, fonts, or layout parameters
- After running the `new-course` skill, to review the generated design

## Capabilities

### 1. Palette Preview

Generate colour swatch images showing the full palette from `course-config.json`.

Use `generate_image` with a prompt like:
"A professional colour palette swatch card showing 6 colours in horizontal
bands: [navy hex] (labelled 'Navy'), [surface hex] (labelled 'Surface'),
[accent hex] (labelled 'Accent'), [accent-light hex] (labelled 'Accent Light'),
[cream hex] (labelled 'Cream'), [sand hex] (labelled 'Sand'). Clean,
minimal design on white background with hex codes visible."

### 2. Sample Slide Mockups

Generate mockup images of key slide types using the course's theme.
Use `generate_image` for each:

**Title slide** — Prompt should describe:
- Left panel with accent colour gradient
- Logo area on the accent panel
- Title text in heading font on the dark surface background
- Lesson label at the bottom
- Accent baseline stripe

**Statement slide** — Prompt should describe:
- Full dark surface background
- Large statement text in cream/white
- Small kicker text in accent colour at top
- Lesson label at bottom left

**Split layout** — Prompt should describe:
- Left 60%: dark surface with content card
- Right 40%: presenter video placeholder (use a simple silhouette)
- Accent edge stripe between the two panels

### 3. Side-by-Side Comparison

When the user is choosing between options:
- Generate both versions
- Present them in a carousel artifact
- Ask which they prefer or what to adjust

### 4. Live Engine Preview

If the engine is set up and a lesson EDL exists:

```bash
cd production/act-engine && npm run stills
```

Present the output images from `previews/` for review.

### 5. Iterate

After showing previews, ask what to adjust. Common tweaks:
- "Make the accent colour warmer/cooler"
- "Increase contrast between surface and text"
- "Try a different heading font"
- "Make the split panel wider/narrower"

For each adjustment:
1. Update `course-config.json`
2. Regenerate the relevant preview
3. Show before/after comparison

## Rules

- Always show visuals, never just describe colours in words.
- Present changes as before/after comparisons when possible.
- After any config change, run `npm run typecheck` in the engine to verify.
- Never modify engine code during a preview session — only the config file.
- If the user approves the final design, commit the config with a clear message.
