# Lesson 3 preview QA

- Branch: lesson/act/03, created from course/act after explicit approval.
- The supplied Markdown differs from the master. The user explicitly authorized the spoken master as narration authority. Original Markdown and embedded subtitles are preserved unchanged.
- Source and staged master SHA-256: 837ecfe6dfe687c5e93e92d3f1486819c3e6ef34bc259f8536790b8578189d98.
- Native source: 1920×1080, 330.814694 seconds. Continuous presenter audio is preserved.
- 796 actual narration words mapped to recognized timestamps from two local passes, without interpolation. Every approved word is recognized; first-pass insertions absent from the second pass are diagnostic only.
- Eight source blocks, 28 contiguous phrase-anchored editorial beats. Source picture cuts detected separately are covered by the shared renderer.
- `npm run word-timing -- 03` built the continuous track. Canonical lesson data remains under the lesson directory; the current checker still requires the legacy generated engine-side timing copy.
- `npm run check -- 03`: zero errors, zero warnings. Full-frame presenter 42%; split graphics 58%. No direct side-to-side move or mirroring.
- Stage background off. Coordinated directional pushes and full-frame returns; no mask wipe or scale-through and no consecutive identical transition presets.
- 24 source-scene stills, supplementary early graphic states, and complete-state review cards cover all 15 graphic beats.
- Short motion preview: H.264/AAC, 1280×720, 11.434667 seconds, four representative transitions. Complete FFmpeg decode passed without reported errors. Sampled transition sequence was visually inspected; this is not a claim of exhaustive motion inspection.
- 78 subtitle cues cover all 796 words. Two lines maximum, 42 characters per line maximum, 1.2-second minimum cue length validated.
- Official slide 54 framework uses readable native typography and the actual spoken labels. Official slides 57/59 clips are companion activity files, not enlarged low-resolution pictures or inserted audio. No web URLs or external licence claims were invented.
- Asset provenance and companion links retained under generated/.

The user replied “start” after being shown the new review pictures and transition preview and asked to approve rendering. Final rendering and complete file-decode QA are now finished; see final-qa.md.
