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

### Realistic-avatar lessons

Lessons supplied as real avatar clips use the same shared Remotion project but
the `AvatarLesson` composition and the agent-safe wrapper command:

Each lesson is developed on its canonical `lesson/lesson-XX` branch. Before
creating or switching that branch, the agent must show the exact branch name,
base, and dirty-tree preservation plan, then wait for the user's explicit
approval. Use read-only Git inspection when another lesson branch is needed as
an engine reference. See `docs/git-lesson-branches.md`.

The official PowerPoint in `source-material/` is the primary source for lesson
images and diagrams. When an important slide visual directly supports the
narration, extract it at the best available quality, record its slide number in
the asset manifest, and show its video placement in the pre-render review
pictures. Do not add decorative slide images that do not advance understanding.

```bash
python3 production/scripts/act_video.py align lesson-08
python3 production/scripts/act_video.py prepare lesson-08
python3 production/scripts/act_video.py preview lesson-08
python3 production/scripts/act_video.py approve-preview lesson-08 --reviewer NAME
python3 production/scripts/act_video.py render lesson-08
python3 production/scripts/act_video.py qa lesson-08
```

For this workflow, `input/pure-script.md` is the only required narration input,
and the supplied avatar audio is timing authority. Do not request or create a
separate `visual-script.md` or `visual-plan.md`; derive visuals from the
established approved theme, official slides, and shared engine. The
content-scrub guidance in section 3 is a
pre-generation review rule: once avatar footage is supplied or marked locked,
raise any concern in `review-notes.md` rather than silently rewriting or
cutting speech. See `AGENTS.md` and `docs/agent-workflow.md`.

---

## 2. Quality gate — mandatory

**Never render a full 15–20 minute lesson before scene pictures have been
reviewed and the user has explicitly approved them.**

For realistic-avatar lessons, `act_video.py preview` generates three 1920x1080
pictures for every scene and a combined contact sheet without rendering video.
Show them to the user and stop. Check presenter placement, text, visual quality,
transitions, branding, safe areas, and every scene's opening/middle/ending.
Only the user's explicit approval may unlock the full render.

---

## 3. What a lesson says — content focus

**Every lesson must stand on its own for a stranger.** Assume the viewer found
this video on its own, is not in a cohort, was not selected for anything, is not
in Tanzania, and has no relationship with anyone running the program. If a line
only makes sense to someone inside the original rollout, it does not belong in
the video.

**Never mention:** awards, an awards ceremony, prizes, judging, "the strongest
groups", competition between participants, or any framing in which the program is
something to win. This program was originally produced for a competition and
awards track; **none of that is part of the course.** The content is the point.

**Also cut, for the same reason:**

| Don't say | Say instead |
|---|---|
| "You've been chosen to be part of it" | "It was built for young people who… If that sounds like you, you're in the right place." |
| "Working alongside Ghadan…" | Name only NAMA Foundation (see §4) — keep the *idea*, drop the partner |
| "An awards ceremony awaits" | *(cut the beat entirely)* |
| "Hold onto that competitive mindset" | "Hold onto that mindset" |
| "Tanzania's flag is an identity" | "Take Tanzania's… Whatever flag is yours does the same thing for you." |

Keep a country-, culture- or source-specific example when it teaches something —
just open it outward in the same breath so a viewer anywhere lands on it too.
Deleting the example loses content; widening it doesn't.

**This is a scrub rule, not a rewrite rule.** Cutting a promotional beat is
right. Cutting or softening *curriculum* content — religious material, a
difficult idea, a source anecdote — is a curriculum-owner decision and must be
raised in `review-notes.md`, never done silently. When in doubt: is this line
teaching something, or selling the program? Teach; don't sell.

**Applies retroactively.** Every lesson already produced gets re-checked against
this section, not just new ones.

---

## 4. Visual identity

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

**One organization only — NAMA Foundation.** No other organization's logo, name
or credit appears anywhere in any lesson: not on a slide, not in narration, not
in an on-screen caption. The source curriculum names and shows several partner
organizations (Ghadan, NICE) on its own slides; those are **extracted and kept on
disk as a record of the source, and deliberately never rendered** — their
`asset-manifest.json` entries carry `"status": "extracted-not-used"`. If a source
slide is a multi-logo grid, take the NAMA logo out of it and show that alone;
`logo-showcase` sizes its card from how many logos it is given, so a single logo
renders large rather than looking like a leftover from a three-up row. Anything
that explains a *concept* attached to a partner (e.g. what "not-for-profit"
means) is content — keep the concept, drop the organization's name.

**Every card component must render `BrandFooter`.** `PhotoCard` (full-bleed
images) was missing it and shipped four Lesson 2 slides with no brand mark, no
gold baseline and no lesson label — a full-bleed photo is still a slide. The only
deliberate exception is the activity beat. When adding a card component, the
`<BrandFooter />` goes in with the first draft, not after someone spots a bare
frame in QA.

**Branding:** the NAMA Foundation mark sits **top-right, fixed** (not
side-aware, deliberately static regardless of which side the presenter is on)
on every scene **except activity beats** (`activity` layout — `hideLogo` on
its `BrandFooter` call, so the pause-and-do prompt gets full attention) —
rendered once inside `BrandFooter` in `Frame.tsx`, not added per scene or per
lesson. Two colour variants: `nama-logo.png` (navy/gold original) on light
backgrounds, `nama-logo-white.png` on dark ones — picked automatically by
`BrandFooter`'s existing `dark` prop, since the navy original is close to
invisible on the navy backgrounds most scenes use. Regenerating either from a
new source file: threshold near-white pixels to alpha and crop to content for
the transparent original; recolour every opaque pixel white, same alpha, for
the white variant. **To add or change a persistent, every-scene brand
element, edit `BrandFooter` once — never touch individual scene
components.** `render_lesson.py` stages `shared/branding/*.png` into the
engine's public dir the same way it stages music, so a new lesson picks it up
with no extra steps.

---

## 5. Scene layouts

`title · section-divider · statement · quote · question · concept-card ·
definition · objectives · full-image · inset-image · logo-showcase · diagram ·
process · roadmap · spotlight · comparison · table · scenario · activity ·
worksheet · quiz · external-video · summary · closing`

The engine dispatches on `layout`. **It must never branch on a scene id.** Adding
a lesson must never require editing the renderer.

---

## 6. Concept cards — visualise meaning, not words

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

## 7. Presenter

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

## 8. Narration & audio

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

### Written form vs. spoken form

**"ACT" is a word. It is always spoken "act", never spelled out "A-C-T."**

Neural voices spell out short all-caps tokens by default. That is correct for a
true initialism (DNA) and wrong for an acronym read as a word — and it was wrong
in every lesson that named the program. Measured on
`en-US-AndrewMultilingualNeural`: *"…something called ACT."* runs **3.288s**
against **2.688s** for *"…something called Act."*, and the 0.6s gap is exactly
the three spelled letters.

The fix is a **`spoken-form` entry in the shared lexicon**, not a respelling in
the lesson files:

```json
{ "key": "act-program-name", "type": "spoken-form",
  "written": "ACT", "spoken_as": "Act", "applies_to": "tts-only" }
```

- `gen_edge_narration.py` applies these **to the TTS text only**, word-bounded and
  case-sensitive (so `ACTION`, `FACT`, `react` are untouched).
- `scenes.json`, `on_screen_text` and the **subtitles keep the written form** —
  `build_subtitles.py` deliberately does not apply spoken forms. *Written form for
  the eye, spoken form for the ear.*
- Write "ACT" normally in every script. Never hand-respell a brand to fix audio.
- **New acronym in a script?** Decide out loud whether it is said as a word or as
  letters. Said as a word → add a `spoken-form` entry. Said as letters → add a
  `spelled-acronym` entry (documentation only, never substituted) so a later pass
  doesn't "fix" what was already right. `DNA` is recorded that way.
- Verify by measurement, not by ear-guessing: synthesise the sentence with and
  without the token and compare durations. A spelled-out three-letter token costs
  roughly 0.6s more than the same token said as one syllable.

Changing one line of narration should never cost a full-lesson re-bake — every
unnecessary re-synthesis shifts a scene's timing and invalidates its visemes and
subtitles for nothing. Use:

```bash
python3 gen_edge_narration.py 01 --only=scene-006,scene-007
```

---

## 9. Background music

Seven licensed tracks, one per **content role**, not one flat loop for the whole
lesson and not a per-lesson choice — the roles and the engine logic are shared,
so a new lesson gets music automatically.

| Role | Fires on | Track |
|---|---|---|
| `opening` | The very first scene | Cinematic Ambient — Kulakovka |
| `default` | Everything else (recap, general explanation) | Ambient Cinematic — AtlasAudio |
| `concept-lift` | `concept-card` / `definition` / `comparison` layouts | Valley Sunset — Alejandro Magaña |
| `activity` | `activity` / `worksheet` / `quiz` layouts | Calm Ambient — Kulakovka |
| `reflection` | `type: "reflection"` or `question` layout | Finding Myself — Michael Ramir C. |
| `reverent` | A `quote` layout whose narration contains `{{arabic:...}}` | Harp Relax — Francisco Alvear |
| `closing` | `summary` / `closing` layouts | Discover — Eugenio Mininni |

Full source/artist/license per track: `shared/music/music-manifest.json`. All
seven are properly licensed (Mixkit License / Pixabay Content License, both
free, no attribution required) — never substitute a track without confirming
its licence the same way.

**How it works** (`production/remotion-engine/src/engine/music.ts`):
`musicRoleFor(scene, index)` classifies every scene from data already in
`scenes.json` — layout, `type`, and the `{{arabic:}}` marker — never from a
lesson or scene id. `buildMusicTimeline()` then groups consecutive
same-role scenes into one continuous cue (so five `default` scenes in a row
don't restart the track five times) and crossfades at every role change.
Mix levels live in `ROLE_VOLUME` in the same file — keep music **felt, not
heard**; if it ever competes with narration, that's a volume bug, not a
retry-the-render problem.

**To add an eighth role or swap a track:** add/replace the file under
`shared/music/roles/`, update `music-manifest.json`, and extend
`musicRoleFor`'s classification rule — never hardcode a lesson or scene id
into the decision.

---

## 10. Subtitles

Generated by `build_subtitles.py` from the **current** narration and **current**
audio durations. Re-run it whenever narration is regenerated — Lesson 1 once
shipped with subtitles a day out of date because this step was manual.
≤42 chars/line, ≤2 lines, ≥1.2s per cue. `{{arabic:}}` resolves to Arabic script.

---

## 11. Images

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

## 12. Render settings

1920×1080 · 30 fps · H.264 · **CRF 16** · AAC.
Full lesson ≈ 200 MB. For sharing, cut a short high-quality excerpt (CRF 20)
rather than crushing the whole file.

Realistic-avatar final renders require native 1920×1080 (or higher) presenter
clips. A 1280×720 clip may be used for workflow previews, but upscaling it does
not create true 1080p detail and the final render gate must reject it.

**Lesson length: 5–20 minutes.** Keep narration ≤ ~2,500 spoken words.

---

## 13. QA checklist

- [ ] Three review pictures from every scene reviewed **before** the full render
- [ ] User explicitly approved the scene pictures; agent did not self-approve
- [ ] Every presenter source is native 1920x1080 or higher
- [ ] Duration within 5–20 min
- [ ] Audio and visuals in sync at start, middle and end
- [ ] Presenter never overlaps text (cards reserve his side)
- [ ] Mouth visibly hits distinct shapes; blinks/brows look human
- [ ] Arabic pronounced natively by the same narrator
- [ ] No image visibly upscaled or blurry
- [ ] Subtitles regenerated and matching the audio
- [ ] Consecutive scenes visually distinct
- [ ] 5–10 concept cards, each visualising meaning rather than repeating narration
- [ ] Music matches each moment's content (§9) and sits under narration, never over it
- [ ] NAMA Foundation mark visible top-right on every scene except activity beats (via `BrandFooter`) — **and actually legible against that scene's backdrop**, not white-on-cream
- [ ] **"ACT" heard as the word "act"**, never spelled "A-C-T" — and any other new acronym deliberately classified (§8)
- [ ] **No organization but NAMA Foundation** named, shown or credited anywhere (§4)
- [ ] **No awards, prizes, judging, competition or cohort-selection language** — the video works for a stranger who found it on its own (§3)
- [ ] Asset licences recorded
- [ ] `review-notes.md` updated with open questions and any source departures

---

## 14. Repo layout

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
