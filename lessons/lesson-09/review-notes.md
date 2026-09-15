# Lesson 9 — review notes

## Locked script received

The approved eight-scene Lesson 9 script was supplied on 2026-09-15 as
`lesson-09-scenes.md`. Its spoken narration was copied verbatim to
`input/pure-script.md`; square-bracket performance and pause cues were stripped as
non-spoken metadata, following the Lesson 8 pure-script format.

## Production status

- [x] Master avatar video transferred to
      `production/act-engine/public/avatar/lesson-09-master.mp4`
- [x] Scene-cut timestamps detected from the embedded subtitle scene boundaries →
      `lessons/lesson-09/generated/cuts.json`

Master verification:

- SHA-256: `b15708776081ca0562a87d24b313df31ccb7b49a2cc76352a3e00913f434b245`
- Source: 1920×1080, 30 fps, H.264 video with AAC stereo audio
- Duration: 346.650703 seconds

The video contains no detectable hard visual cuts because the presenter framing is continuous.
The eight scene starts are therefore taken from the embedded subtitle timing at the exact points
where each locked scene begins: 0, 38.583, 84.323, 128.208, 170.948, 212.708, 256.416, and
300.916 seconds.

## Script/audio verification note

The embedded subtitle track broadly follows the locked script and exposes two transcription
differences that must be checked against the spoken audio during word alignment:

- Scene 03 subtitle: `a new act`; locked script: `a new app`.
- Scene 08 subtitle: `instead of using the first idea`; locked script: `instead of choosing the
  first idea`.

The embedded subtitles are not timing authority for the spoken wording. Do not change the locked
script unless the avatar audio confirms a genuine mismatch and the user directs how to resolve it.

## Official visual review

The official PowerPoint's Lesson 9 section is slides 143–150. Slide 145 introduces the question
about what helps each person or thing work or grow, and slide 146 contains the four matching source
photos: tree, student, horse, and carpenter. The trainer manual confirms the same exercise on pages
156–159.

All four original embedded photos were selected for Scene 02 and extracted without resizing to
`assets/official-slide-146/`. Their source slide, embedded media filename, dimensions, checksum,
and intended phrase are recorded in `assets/asset-manifest.json`. No additional trainer-manual
visual was selected because it would duplicate the same exercise rather than clarify a new idea.

## Still needed

1. The uncut Lesson 9 master avatar video.
2. Script-to-audio verification after the master is available.
3. User review and explicit approval of all scene stills before final rendering.
