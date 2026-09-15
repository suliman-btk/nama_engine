# Reusable realistic-avatar lesson workflow

This workflow turns one locked scene-based pure script plus real avatar clips
into a deterministic ACT lesson. The agent derives the visuals from the
established approved video theme; the user does not prepare a visual script or
visual-plan file. The engine edits and composes; it does not rewrite narration.

Before editing a lesson, follow `git-lesson-branches.md`. Each lesson uses its
own `lesson/lesson-XX` branch. The agent must announce the exact create or switch
operation and wait for explicit user approval. Other lesson branches may be
inspected read-only to understand existing engine usage.

## Authority order

1. Locked pure script and supplied avatar audio
2. Established approved video theme from previous lesson branches
3. Official lesson slides and curriculum references
4. ACT production guidelines and branding
5. Existing reusable engine components
6. Editorial judgment

Content concerns are raised before avatar generation. Once footage is supplied
or marked locked, do not cut or regenerate it without explicit approval.

## Lesson package

```text
lessons/lesson-XX/
  input/
    pure-script.md
    scene-config.json          optional structured visual decisions
  avatar/
    scene-001.mp4
    scene-002.mp4
  assets/
  generated/
    avatar-manifest.json
    word-timing/
    lesson-XX.srt
  qa/
  output/
```

The repository-level `source-material/` directory contains the official trainer
manual and PowerPoint lesson deck. Before planning visuals, inspect the matching
lesson slides for important diagrams, images, frameworks, and worksheets. Add
selected visuals to the lesson asset manifest with the source filename and slide
number, and ensure they appear in the scene review pictures before approval.

Both scripts use explicit headings such as `## Scene 001`. Scene ids must match
and remain in the same order. A scene may contain at most 800 spoken characters.

No `visual-script.md` or `visual-plan.md` is required for new lessons. If a
legacy lesson already contains a visual script, the engine accepts it for
backward compatibility and verifies that its spoken words still match the pure
script. Agents must not ask the user to create one.

## Optional scene configuration

`input/scene-config.json` is keyed by scene id. It records visual decisions
without putting lesson-specific logic in the renderer:

```json
{
  "scene-001": {
    "section": "Closing",
    "avatar": {"layout": "corner", "position": "right"},
    "visualEvents": [
      {
        "kind": "list",
        "atPhrase": "keep three things together",
        "durationSeconds": 8,
        "kicker": "Before you finish",
        "title": "Keep these together",
        "items": ["Problem statement", "Useful information", "Current need"]
      }
    ],
    "transitionOut": {
      "kind": "soft-push-left",
      "scope": "presenter-card",
      "durationFrames": 14
    }
  }
}
```

Supported avatar layouts are `full`, `corner`, and `hidden`. Supported
transition scopes are `presenter-card`, `main-canvas`, `full-frame`, and
`coordinated`.

Visual events may use explicit `startSeconds`, or `atPhrase` with real word
timing in `generated/word-timing/scene-XXX.json`. The preparation step refuses
to guess an unresolved or ambiguous phrase.

## Commands

```bash
python3 production/scripts/act_video.py init lesson-08
python3 production/scripts/act_video.py align lesson-08
python3 production/scripts/act_video.py prepare lesson-08
python3 production/scripts/act_video.py validate lesson-08
python3 production/scripts/act_video.py preview lesson-08
python3 production/scripts/act_video.py approve-preview lesson-08 --reviewer NAME
python3 production/scripts/act_video.py render lesson-08
python3 production/scripts/act_video.py qa lesson-08
```

`align` runs the locally available multilingual Whisper model against each
avatar clip and writes real per-word timings. It refuses to publish timings if
the recognized words do not match the locked pure script.

`prepare` parses the pure script, probes every avatar clip, resolves phrase anchors
when word timing exists, rotates safe default transitions, and writes the
machine-readable manifest. `preview` creates three 1920x1080 review pictures
for every scene (opening, middle/visual moment, and ending) plus a combined
contact sheet; it does not render the video. Show these artifacts to the user
and stop.
`approve-preview` records the user's explicit approval; an agent must never run
it on the user's behalf. `render` remains blocked until that approval exists and
all presenter sources are native 1920x1080 or higher. `qa` checks the delivered
file with ffprobe and a full decode.

## Transition policy

- Every scene except the last has `transitionOut`.
- Ordinary boundaries default to `coordinated` or `presenter-card`.
- `section-reveal` and `dip-to-brand` require a genuine section change.
- Audio is never overlapped to create a visual transition.
- Presenter motion follows main-canvas motion with smaller amplitude.
- The renderer uses an ACT navy surface during coverage; it never fades through
  accidental black.

## Required review artifacts

Before a final render, retain `qa/scene-stills/` (three pictures per scene) and
`qa/all-scenes-contact-sheet.jpg`. The user must inspect them and explicitly
approve before the full render starts. Check the opening,
every slide/visual state, presenter placement, transitions, Arabic if present,
and the closing. Final QA must verify native-source quality, 1920x1080 output,
30 fps, H.264/AAC, complete decode, duration, audio continuity, subtitles, safe
areas, branding, and transition coverage.
