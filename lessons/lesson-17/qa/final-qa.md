# Lessons 17–18 final QA

The user explicitly approved the refreshed review pictures before rendering.

- Output: production/act-engine/out/lesson-17-18.mp4.
- H.264 video, native 1920×1080, 30 fps; AAC audio.
- Duration: 328.320 seconds. Size: 196882362 bytes.
- SHA-256: 54a653d5d2211ee9477e75c017ad56cfb490d5596aafa09068b769c14c37b41d.
- Shared checker passed with zero errors and warnings across 17 contiguous beats.
- Full video and audio decoded with FFmpeg, exit 0 and no reported errors.
- Source audio remains continuous; locked narration and actual word timing are unchanged.
- Side switches route through full-frame presenter beats, without mirroring.
- Exported directional transition sequence at 44.4–45.8 seconds inspected: coordinated presenter movement and slide arrival, without the former mask wipe or navy flash. This is a sampled motion check, not a claim of exhaustive visual inspection.
- Final representative frame retained as qa/final-render.png.
- Companion subtitles: production/act-engine/out/lesson-17-18.srt (76 cues).
- EDL, word timing and asset provenance retained under generated/.

Render completed successfully despite the existing Zod package-version warning. No shared engine dependency changes were made on this lesson branch.
