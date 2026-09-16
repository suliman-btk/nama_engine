# Lesson 6 input review

## Locked-script mismatch — resolved by user approval

At approximately 216.46–218.10 seconds (Scene 6):

- Locked script: “The boundary depends on what you **are** trying to understand.”
- Embedded subtitles: “The boundary depends on what you **were** trying to understand.”
- Independent local Whisper audio transcription also recognizes “were”.

The user explicitly approved updating this one word to “were”. The original scene-script attachment remains preserved unchanged; `pure-script.md` records the approved narration. Presenter audio is unchanged.

## Timing

- Embedded subtitles stop at 266.497 seconds, before Scene 8.
- Local audio transcription covers the complete video through 308.18 seconds, with word timestamps. All 792 approved narration words map to actual ASR word timestamps without interpolation. ASR-only insertions remain diagnostic and are excluded from the locked narration.
- Script scene boundaries are frame-snapped starts of the corresponding spoken paragraphs; scene-cut detection did not find high-confidence visual seams at 0.06/0.30 thresholds. These are editorial section boundaries, not a claim of independently detected hard cuts.

## Official visuals inspected

Source: `ACT Lessons Updated Logo.pptx`, slides 103–109.

- Slide 108: school roles diagram, useful when discussing school communities.
- Slide 109: nested hospital/network/health-sector diagram, useful for community scale.
- Slides 103 and 107 are primarily title/divider slides; whole-slide screenshots are not needed.
- Original slide diagrams have been inspected via the existing deck PDF conversion; native vector exports are staged under `/private/tmp/lesson06-school.svg` and `/private/tmp/lesson06-health.svg`.

## Preserved inputs

- Supplied scene script copied to `input/lesson-06-scenes.md`.
- `input/pure-script.md` contains the supplied narration unchanged, with non-spoken bracket cues removed.
- Master copied to `production/act-engine/public/avatar/lesson-06-master.mp4`.
- EDL and word timing are retained under the lesson package. The legacy engine checker consumes a generated timing compatibility copy and a thin EDL adapter to staged public lesson data.
- Timing/layout checker passed with zero errors and warnings. No final render or preview approval recorded.
- User requested replacing the extracted slide pictures. The edit now uses four original ACT-themed vector infographics for school roles, hospital roles, education scale, and health scale. They are original concept adaptations, not claimed as extracted official images. Original extracts remain unused references.
