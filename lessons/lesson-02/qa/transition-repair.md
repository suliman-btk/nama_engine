# Transition repair review

The user reported inconsistent transitions in the delivered Lesson 2 video.

## Diagnosis

The EDL contained 43 editorial beats. Many adjacent full-frame beats had identical rendered presenter layouts, yet each retriggered a wipe or scale effect. The camera metadata did not change the actual PresenterFull layout, so these were redundant effects rather than camera changes. Mask-wipe presets also clipped the presenter during ordinary returns. Repeated presets appeared at consecutive boundaries.

## Lesson-data correction

- Merged adjacent identical full-frame beats, reducing the sequence from 43 to 26 beats.
- Removed mask-wipe and scale-through effects throughout this lesson.
- Used gentle, side-appropriate soft pushes for slide arrival, opposite-direction movement for the same-side activity change, and quiet crossfade returns to the full-frame presenter.
- No identical transition preset occurs at consecutive boundaries.
- Kept all meaningful graphic anchor timings, visuals, original audio, subtitles, and the full-width route between left/right presenter changes.
- Kept the previous EDL at generated/edl-before-transition-repair.json and the existing rendered MP4 unchanged.

The motion preview also exposed the unused StageLayer painting a deep-blue background when slides unmounted. This lesson composition now leaves StageLayer off, as required by the house grammar, retaining its flat purple root background throughout. No shared renderer or engine dependency was changed. The lesson-specific repair script is retained alongside canonical lesson data.

`npm run check -- 02` passes with zero errors and zero warnings. All 33 source-scene review pictures were refreshed, with an eleven-row contact sheet covering every scene. The short eight-boundary motion preview is retained as qa/transition-review-v3.mp4, with five sampled frames per boundary in qa/transition-repair/boundary-sequences.jpg. The preview uses 1280×720 output from the native Full HD master; the final video remains Full HD. Its cuts between samples are diagnostic montage cuts, not proposed lesson edits.

Visual inspection confirms the dark backdrop is gone and the presenter is no longer masked by wipes. Full preview decode completed with exit 0 and no errors. The user approved this corrected motion preview with “good”. A new full render is authorized and running; the previous MP4 will remain recoverable as a backup after final QA.

Completed: corrected full render passed full decode and final QA. Current out/lesson-02.mp4 is the corrected video; the previous version is retained as out/lesson-02-before-transition-repair.mp4. See final-qa-transition-repair.md for the current file details.
