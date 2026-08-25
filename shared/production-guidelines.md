# ACT Course Video — Production Guidelines

**Read this before producing any lesson.** Lesson 1 is the Golden Reference
(`_golden/lesson-01/`, git tag `golden-lesson-01`). Every lesson uses the shared
engine at `production/remotion-engine/`. **Never create a per-lesson Remotion project.**

---

## 1. Pipeline

```
lesson.json + scenes.json          (content, hand-authored)
        ↓  gen_edge_narration.py
audio/edge-raw/scene-XXX.wav       (Edge neural TTS)
        ↓  tools/rhubarb
audio/edge-visemes/scene-XXX.json  (real phoneme cues)
        ↓  build_presenter_lottie.py
presenter/scene-XXX.json + durations.json
        ↓  build_subtitles.py
subtitles/lesson-XX.srt|.vtt
        ↓  render_lesson.py  →  production/remotion-engine
lessons/lesson-XX/output/lesson-XX.mp4
```

Commands:
```bash
python production/scripts/gen_edge_narration.py    lesson-02
production/tools/rhubarb/rhubarb -f json -o <out>.json <in>.wav   # per scene
python production/scripts/build_presenter_lottie.py lesson-02
python production/scripts/build_subtitles.py        lesson-02 --vtt
python production/scripts/render_lesson.py          lesson-02 --preview   # QUALITY GATE
python production/scripts/render_lesson.py          lesson-02             # full
```

---

## 2. Quality gate — mandatory

**Never render a full 15–20 minute lesson before a preview has been reviewed.**

`render_lesson.py --preview` auto-selects ~90s covering different layouts, a
presenter beat and any Arabic. Check: presenter placement and lip movement,
narration pacing, Arabic pronunciation, an infographic, an image at full size,
a transition, and audio/visual sync. Only then render in full.

---

## 3. Visual identity

| Token | Value |
|---|---|
| Navy | `#1B1E4A` · deep `#12142F` · mid `#2B2F72` |
| Gold | `#CFAD3A` · light `#E4C862` |
| Light | cream `#FAF7EE` · sand `#F2ECDD` |
| Accents | comfort `#3D6E96` · challenge `#CFAD3A` · pain `#963D3D` · plum `#241738` · teal `#14303C` |
| Headings | Arial Black, weight 800, line-height ~1.16 |
| Body | Arial, 21–32px |
| Kicker | uppercase, 26px, letter-spacing 4, gold |

**Rhythm:** background treatment and ornament rotate per scene; the presenter
alternates sides. Never let consecutive scenes look identical. Do not vary
randomly — layout must follow the content.

**Motion:** ornaments drift/rotate slowly; every background carries a moving
light wash; headlines reveal word by word; each scene has a gentle scale settle
and a slow push. **Never fade a scene to transparent** — scenes are back-to-back,
so an opacity fade produces a black flash on every cut.

---

## 4. Scene layouts

`title · section-divider · statement · quote · question · concept-card ·
definition · objectives · full-image · inset-image · logo-showcase · diagram ·
process · roadmap · spotlight · comparison · table · scenario · activity ·
worksheet · quiz · external-video · summary · closing`

The engine dispatches on `layout`. **It must never branch on a scene id.** Adding
a lesson must never require editing the renderer.

---

## 5. Concept cards — visualise meaning, not words

A concept card is **not** a subtitle. Subtitles reproduce speech; a concept card
distils an idea into keywords, relationships and motion.

Use for: key definitions · principles · major messages · memorable statements ·
critical distinctions · warnings · important steps/rules · main takeaways.
**Roughly 5–10 per 15–20 minute lesson.** Don't force a number, and don't use them
so often the technique goes stale.

Structures: `progression` (A→B→C) · `contrast` (NOT x / BUT y) · `cause-effect` ·
`equation` · `pillars`.

```json
{
  "layout": "concept-card",
  "on_screen_text": "Growth lives in the challenge zone",
  "data": {
    "main_message": "Growth lives in the challenge zone",
    "visual_structure": "progression",
    "items": [{"label": "Comfort"}, {"label": "Stretch"}, {"label": "Growth"}]
  }
}
```

Do **not** put the whole narrated sentence in a box. Timing: the card lands as the
idea is spoken, holds briefly for comprehension, then moves on. The presenter may
point at it (`"action": "point-left"`, `"target": "concept-card"`) but need not
appear on every card.

---

## 6. Presenter

Configured per scene; the engine never hardcodes behaviour.

```json
{"presenter": {"enabled": true, "action": "point-left", "position": "auto",
               "scale": 1.0, "expression": "friendly", "target": "concept-card"}}
```

Actions: `idle · talking · explain · welcome · point-left · point-right ·
thinking · nod · encouraging · concerned · closing`.
`position: "auto"` alternates sides so he isn't parked in one corner.

**Swapping the character = editing `shared/presenter/rig.json` only.** The rig
declares the source asset, mouth mode, eye/brow layers, recolour and layout.
- `viseme-layers` — asset has one mouth per viseme (preferred).
- `derived-shapes` — too few mouths; derive a set by scaling the widest (current).
- `none` — fall back to the asset's own talking loop.

**Never** fall back to volume/amplitude-based mouth movement. Lip-sync is resolved
at **build** time, not render time.

Lessons learned from the current asset (encoded in `rig.json`, don't re-derive):
- Its blink is a **double** blink (two closures in 0.48s) — re-authored as one
  human blink (~0.37s) every 4.6–6.8s, identical on both eyes.
- Its brow twitch is 0.6s with an overshoot — slowed to ~1.9s, ~half travel,
  every 10–14s.
- Mouth keyframes are emitted in **pairs** (hold, then snap ≤2 frames), otherwise
  Lottie eases across the gap and the mouth drifts instead of hitting shapes.
- **Every keyframe needs easing.** A bare `{t, s}` keyframe mid-sequence makes
  lottie-web drop the whole mouth group and the character renders with no mouth.
- Do **not** combine a scale animation with the path morph on the mouth layer —
  lottie-web renders blank frames.

---

## 7. Narration & audio

- Engine: Edge neural TTS (free, no key, network).
- Voice: **`en-US-AndrewMultilingualNeural`**, rate `-1%`, pitch `-1Hz`.
- Multilingual voices speak English *and* native Arabic — **one narrator**.
  Never splice a second voice for Arabic.
- **One synthesis call per scene.** Splicing separate sentences with fixed silence
  sounds more mechanical, not less; the voice phrases a paragraph itself.
- `edge-tts` has **no request timeout** and will hang forever — always wrap in
  `asyncio.wait_for` (75s), retry, and fall back to splitting long passages.
- Output: 24 kHz mono WAV per scene.

### Arabic
Write `{{arabic:key}}` in narration; define the key in
`shared/pronunciation/lexicon.json` with real Arabic script. **Never invent Arabic
spellings** — if unsure, mark `[REVIEW REQUIRED]`.
Religious content is preserved as the source states it. Removing or changing it is
the curriculum owner's decision and must be recorded in the lesson's `review-notes.md`.

---

## 8. Subtitles

Generated by `build_subtitles.py` from the **current** narration and **current**
audio durations. Re-run it whenever narration is regenerated — Lesson 1 once
shipped with subtitles a day out of date because this step was manual.
≤42 chars/line, ≤2 lines, ≥1.2s per cue. `{{arabic:}}` resolves to Arabic script.

---

## 9. Images

Priority: **official SVG/vector → high-res official PNG → recreate simple graphics
→ upscale (last resort).**

- Every asset is declared in `lessons/lesson-XX/assets.json` with its **true pixel
  size**; the engine uses that to decide treatment.
- Full-bleed only at **≥1600px wide**. Anything smaller renders inset at ≤1.15×
  native inside a designed card.
- **Never apply strong zoom to low-resolution raster art.** Full-bleed drift is
  capped at 1.00→1.05.
- Low-res "text" graphics (e.g. unit dividers) should be **rebuilt as typography**,
  not displayed as blurry rasters.
- Record `source`, `license`, `credit` for every asset. Do not use footage of
  unclear licence — link out instead.

---

## 10. Render settings

1920×1080 · 30 fps · H.264 · **CRF 16** · AAC.
Full lesson ≈ 200 MB. For sharing, cut a short high-quality excerpt (CRF 20)
rather than crushing the whole file.

**Lesson length: 5–20 minutes.** Keep narration ≤ ~2,500 spoken words.

---

## 11. QA checklist

- [ ] Preview reviewed **before** the full render
- [ ] Duration within 5–20 min
- [ ] Audio and visuals in sync at start, middle and end
- [ ] Presenter never overlaps text (cards reserve his side)
- [ ] Mouth visibly hits distinct shapes; blinks/brows look human
- [ ] Arabic pronounced natively by the same narrator
- [ ] No image visibly upscaled or blurry
- [ ] Subtitles regenerated and matching the audio
- [ ] Consecutive scenes visually distinct
- [ ] 5–10 concept cards, each visualising meaning rather than repeating narration
- [ ] Asset licences recorded
- [ ] `review-notes.md` updated with open questions and any source departures

---

## 12. Repo layout

```
shared/           branding · presenter (rig.json + assets) · music ·
                  pronunciation · visual-style · production-guidelines.md
production/
  remotion-engine/   ONE engine for every lesson
  scripts/           gen_edge_narration · build_presenter_lottie ·
                     build_subtitles · render_lesson · migrate_scenes_v1
  tools/rhubarb/     native arm64 build (see below)
lessons/lesson-XX/   lesson.json · scenes.json · assets.json · script/ ·
                     audio/ · presenter/ · assets/ · subtitles/ · output/ ·
                     references/ · worksheets/ · review-notes.md
_golden/lesson-01/   frozen reference — do not modify
```

**Rhubarb:** the official prebuilt macOS binary is x86_64 and **segfaults under
Rosetta** on this machine. Build from source for arm64 (`brew install cmake boost`,
then CMake). The working binary is kept at `production/tools/rhubarb/` and is
gitignored (large) — rebuild if missing.
