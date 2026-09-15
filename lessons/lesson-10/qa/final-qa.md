# Lesson 10 final QA

Date: 2026-09-16

## Deliverables

- Video: `production/act-engine/out/lesson-10.mp4`
- Subtitles: `output/lesson-10.srt`
- Video SHA-256: `4c7a617b3f1ad25bc3a6bc88c70d7bf09a84626e1be6bf61f9bf60ce70d98cd4`
- Subtitle SHA-256: `9af3bfe44177e315548f7268390d09fa35a2780505297c0d0b5e030aaf9ee167`

## Technical verification

- Full decode: PASS (video and audio decoded to completion with no ffmpeg errors)
- Resolution: PASS — 1920x1080
- Frame rate: PASS — 30 fps
- Video codec: PASS — H.264
- Audio codec: PASS — AAC, stereo, 48 kHz
- Video frames: PASS — 12,848
- Video duration: 428.266667 seconds
- Audio duration: 428.309333 seconds
- Container duration: 428.309333 seconds
- File size: 236,531,768 bytes
- Average container bitrate: 4,417,961 bps
- Audio continuity scan: PASS — no silence interval longer than 1.5 seconds at -50 dB

## Content and visual verification

- Pre-render lesson checker: PASS — 0 errors, 0 warnings
- Locked narration retained; master audio was not cut or replaced
- Nine source seams covered with the approved 0.6-second zoom-blur treatment
- Presenter/text collision review: PASS
- Brand-logo and slide collision review: PASS
- Official slide visuals reviewed in final output: PASS
- Final encoded contact sheet: `qa/final-render/final-contact-sheet.jpg`

## Tooling note

Remotion reported that installed `zod` 4.6.2 is newer than its expected 4.5.4. The schema
check, rendering, encoding, and full decode all completed successfully; this warning did not
affect the Lesson 10 deliverable and belongs to shared-engine dependency maintenance.
