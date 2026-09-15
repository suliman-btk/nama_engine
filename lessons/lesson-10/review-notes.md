# Lesson 10 review notes

## Inputs

- Locked narration: `input/pure-script.md`
- Original scene document: `input/lesson-10-scenes.md`
- Master presenter video: `production/act-engine/public/avatar/lesson-10-master.mp4`
- Source/master SHA-256: `12461599dabd3c0ea9e241dcb9989feccfb6d737a56a6f436a71e219a7820088`
- Master duration: 428.268844 seconds; 1920x1080, 30 fps, H.264/AAC

## Source seams

Nine internal presenter-generation seams were detected at 44.533, 86.567, 127.867,
169.367, 212.267, 254.267, 297.167, 336.000, and 375.300 seconds. The shared
0.6-second zoom-blur treatment covers each seam.

## Script/alignment review

The embedded subtitle track matches the locked script exactly in scenes 1–2 and 4–10.
Scene 3 contains three small subtitle differences:

- locked script `seem`; embedded subtitle `seems`
- one extra repeated `need` in the embedded subtitle
- locked script `shortlist`; embedded subtitle `short list` (same spoken wording)

Timing data keeps the locked script text and maps it to the corresponding subtitle spans.
The final render must retain the master audio unchanged. User acceptance of the supplied
master's spoken delivery is required with preview approval.

## Official curriculum visuals

The PowerPoint Lesson 10 range (slides 152–157) and trainer-manual pages 164–175 were
reviewed. Two useful official illustrations were selected:

- Slide 154: Solutions Blender, used while the narration discusses combining ideas.
- Slide 156: Case Study, used while the narration discusses gaining marketing experience
  through a volunteer project.

Slide 155's world map is an unrelated energizer and was not selected. Full provenance and
adaptation details are recorded in `assets/asset-manifest.json`.

## Gate status

`npm run check -- 10` passes with 0 errors and 0 warnings. The edit contains 41 contiguous
beats with 43% full-frame presenter and 57% presenter-plus-graphic coverage.

The user explicitly approved the review and requested the full render on 2026-09-15.
