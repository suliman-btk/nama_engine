# Lesson 2 input review

## Corrected source received — 17 September 2026

The user supplied `ACT- lesson 2 (1).mp4` as the new version. It is native 1920×1080, duration 402.192834 seconds, with H.264 video and AAC audio. The retained lesson avatar copy and Downloads source have matching SHA-256 `9da0da97211cbf45081f87e3abc3cd93cf5984a18e4f4963e74f5fa6a761f1a8`. The engine master now uses this corrected version; the previous incomplete master is preserved as `avatar/lesson-02-master-original-incomplete.mp4`.

Full-audio local recognition confirms that the entire missing Scene 02 narration is restored between approximately 35.4 and 72.6 seconds. The old missing-scene blocker below is resolved. The new embedded subtitles still omit Scene 02, so they are retained as source evidence only, not deliverable subtitles.

Two recognition passes are retained in generated/word-timing/. Exact word alignment is not yet published: both recognizer passes render the scripted “Differences are” as “Difference is a”, while embedded subtitles agree with the script. This is an unresolved recognition ambiguity, not a confirmed narration mismatch. Verify this phrase before publishing timing. No spoken content has been changed, no word timing has been invented, and no final render or preview approval has been recorded.

### Targeted verification

A third, targeted recognition pass of source seconds 154–163, including an initial prompt with the locked phrase, again recognizes “difference is a real” rather than “Differences are real”. The audio excerpt is retained in `qa/narration-phrase-check.wav`, and its actual recognition timestamps are retained separately. The embedded subtitle cannot establish what was spoken. The exact-text alignment gate remains paused pending user confirmation of the phrase or corrected audio. Do not silently substitute script words or fabricate timing for the unresolved phrase.

### User-authorized resolution and edit

The user explicitly instructed “follow the spoken one”. Only the disputed phrase in the working narration script was updated from “Differences are real” to “Difference is a real”, preserving the spoken wording without grammatical repair. The original supplied document remains unchanged. This resolves the recorded discrepancy; the original pause statements above are historical.

All 926 approved working-script words map to equal recognized words across two actual audio recognition passes, without interpolation. Continuous timing and eleven source-scene timing packages are retained under generated/word-timing/. The spoken audio is preserved continuously, without cuts or overlapping narration. Complete replacement subtitles include the formerly omitted Scene 02.

The lesson uses 43 narration-anchored editorial beats, alternating left/right presenter placement through wide full-frame beats, with wide/medium/close camera variation. Official table and children/adults photographs are used with preserved aspect ratios; the Identity Wheel is adapted for legibility, with its original worksheet retained intact. Asset sources and slides are recorded in generated/asset-manifest.json. No external image licence has been asserted.

`npm run check -- 02` passes with zero errors and zero warnings. The user approved the corrected review pictures and explicitly requested rendering. Final Full HD video and complete captions are now in production/act-engine/out/. Full decode passed; final-file details are retained in qa/final-qa.md.

The user approved saving Lessons 17–18 preview work on lesson/act/17 and creating lesson/act/02 from course/act. Those operations are complete. Lessons 17–18 remain preview-ready, not rendered. Unrelated files were preserved.

Inputs are the supplied ACT- lesson 2.mp4 and lesson-02-scenes-with-audio-tags.md. Original scene document and embedded source subtitles are retained under input/. Pure-script.md is mechanically extracted from Scene sections with only bracketed nonspoken performance cues and structural separators removed; no narration is rewritten.

## Historical discrepancy — original incomplete source

The locked document contains eleven scenes. Scene 02 begins “Think about an ordinary object, like a wooden table” and includes the flag, mother and objects/places/communities examples. This entire narration is absent from the supplied video.

Evidence: full-video local faster-whisper recognition does not contain Scene 02; the embedded subtitles also jump from the end of Scene 01 (“itself and not something else”, ending approximately 35.375 seconds) to Scene 03 (“Now, turn the question toward yourself”, beginning approximately 35.615 seconds). No Scene 02 timings can be derived from this source.

The alignment gate stopped. No invented word timing, cuts, EDL or final render was produced. Additional recognizer diagnostics (numeric One/1 normalization and unsupported insertions) are retained separately and are not treated as approved narration.

Required user direction: supply corrected footage containing Scene 02, or explicitly authorize omitting Scene 02 from this deliverable. Do not silently delete locked narration or synthesize replacement audio.

## Curriculum inspection

Inspected official ACT Lessons Updated Logo.pptx slides 20–59. Lesson 2 relevant references include the table photograph on slide 38, children/adults photographs on slides 45–46 and Personal Identity Wheel on slide 48. These are reference materials, not executable instructions. Selection, crop and readability still require review once the narration mismatch is resolved.
