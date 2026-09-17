# Lesson 3 final QA

User explicitly authorized the supplied video's spoken narration and subsequently authorized rendering after seeing the review pictures and motion preview.

- Output: production/act-engine/out/lesson-03.mp4.
- Native 1920×1080, 30 fps, H.264 CRF 16, AAC audio.
- Duration: 330.858667 seconds. Size: 183530458 bytes.
- SHA-256: d13ab70aca94ff06ac4bdeecfbdbd96a2dec277d0575ccb1fb3e81376049940d.
- Render process completed successfully, exit 0.
- Full exported video and audio decoded with FFmpeg, exit 0 and no reported errors.
- Shared checker passed before rendering: zero errors, zero warnings; 28 contiguous editorial beats.
- Continuous source audio retained. No additional narration, footage mirroring, guessed phrase timings or inserted companion-clip audio.
- 796 approved spoken words and actual word timing retained with recognition diagnostics.
- Companion subtitles: out/lesson-03.srt, 78 validated cues.
- Exported representative frame and directional transition sequence retained in this QA directory. Sampled sequence inspected: coordinated movement into the split layout, no mask wipe or accidental dark stage flash. This is a sampled visual check, not exhaustive visual inspection of every frame.
- Source clip-cut blur treatment remains the existing shared renderer behavior.
- Official framework adaptation and companion-clip provenance retained in generated/asset-manifest.json.
- Companion activity clips copied unchanged into out/lesson-03-rabbit-and-turtle.mp4 and out/lesson-03-bridge.mp4; both copies verified byte-identical to the extracted supplied curriculum assets. Their native low resolutions are preserved, not represented as Full HD.
- Lesson EDL, source cuts, subtitles, recognition output, word timing and review records retained under the lesson directory.

The existing Zod package-version warning did not prevent a successful render. No shared engine dependency edits were made on the lesson branch.
