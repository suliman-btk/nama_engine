# ACT Engine — Per-Lesson Build Procedure

Concrete companion to `AGENTS.md`. That file is the governance rulebook; this is the house
grammar and the mechanical procedure settled on while building lesson 8, plus the invariants
behind each defect found in review. Any agent building a lesson video reads both.

Everything here lives in `production/act-engine/`. The engine is shared — components, layouts,
the resolver and all fixes below apply to every lesson automatically. Only four files change
per lesson.

> NOTE: `production/remotion-engine/` is the OLDER avatar-scenes pipeline driven by
> `production/scripts/act_video.py`. Lesson 8's approved look was rebuilt on `act-engine`.
> Do not mix them.

## The house grammar

Two presenter states and nothing else.

`PresenterFull` (also `PresenterMedium` / `PresenterClose`, which are camera distances, not
sizes) when he is talking and there is nothing to show. This is the default. `PresenterLeft` or
`PresenterRight` — a 40%-wide, full-height panel with a hard edge — when a slide is up, with the
slide taking the other ~60%.

The presenter alternates sides once per section, roughly every forty seconds, not per slide.
Flipping per slide is just a different mechanical rhythm and reads as restless.

Every side change must pass through a full-bleed beat: he grows to fill the frame, then comes
back down on the other side. A direct left-to-right change slides the panel across the middle of
the frame, which the client rejected twice. Turn beats are always the wide shot and need at
least two seconds, since the layout spring alone is 0.85s each way.

The full-bleed stretches rotate camera distance. Lesson 8's first cut had 157 seconds of one
identical shot, which was most of why it read as flat.

Aim for roughly 45% full-bleed and 55% slide. Lesson 8 sits at 44/56.

## Per-lesson procedure

1. Put the uncut master avatar video at `public/avatar/lesson-NN-master.mp4`. One continuous
   file — never per-scene clips. Verify the checksum after transfer.
2. Write the scene seams to `lessons/lesson-NN/generated/cuts.json` as an array of seconds,
   first entry 0. These are where the avatar tool joined its per-scene clips.
3. `npm run word-timing -- NN` builds `src/data/lesson-NN-word-timing.json`.
4. Author `src/data/lesson-NN-edl.ts`. Every graphic starts on a verbatim phrase from the locked
   script; gap boundaries may use `atSeconds`, since those are pacing choices carrying no
   meaning that can drift.
5. Copy `src/compositions/Lesson08.tsx` to `LessonNN.tsx`, change imports and the lesson label,
   register the composition in `src/Root.tsx` with the true duration.
6. `npm run check -- NN`. This must pass before rendering. It is a gate, not advice.
7. `npm run stills` for review frames. Show them to the user and wait for explicit approval
   (see `AGENTS.md`). Only then `npm run render`.

## Invariants the checker enforces

Each is a defect that reached a render. The check exists so it cannot happen twice.

Anchors must resolve. The resolver strips punctuation before matching, and its character class
must include curly quotes — the transcript is full of them (`"The`, `Let's`, `2015."`). It once
held straight quotes twice over because an editor had flattened them, so any anchor touching a
quoted word or contraction could never match. It is written as `\u` escapes now.

Scenes must be contiguous. Scene ends resolve to `t0`, where the end phrase *begins*. They
previously resolved to `t1`, where it finishes, while the next scene started at `t0` of the same
shared phrase — so every boundary overlapped by that phrase's whole spoken length, up to 2.9
seconds of two slides drawn on top of each other.

No two slides on screen at once. `EventRenderer` must keep `leadInFrames = 0` and derive its
window from `rawEnd - rawStart`, not a rounded duration, which left one-frame overlaps.

Every side change routes through a full-bleed beat. Split scenes always carry a graphic;
full-bleed scenes never do.

Every component used must paint its own background. `KeyStatement` and `LessonSummary` paint
none — they were built to sit over the blurred stage — so they fell through to the root colour
and rendered visibly darker than every other slide.

## Other settled decisions

Background is one flat token, `theme.colors.surface` (`#454C8A`). No gradients, no drifting
wash; the composition root matches so nothing dips dark mid-fade.

The `Stage` (a blurred copy of the footage at `brightness(0.62)`) is off. Every split scene is
covered by an opaque slide, so the only time it showed was through a slide mid-fade — the dark
flash between slides.

Brand mark and gold baseline are composition-level layers above the presenter. Drawn inside the
slide they sat underneath him and were invisible for most of the runtime.

The content column is fixed per scene. Animating it so it "narrowed with the presenter"
re-wrapped the text every frame and words hopped between lines.

`StatementSlide` variant `split` is unusable alongside a side presenter — its gold column starts
content at 520px and collides. Use `bar` or `centred`.

Soft-push amplitude is 7% of frame width. At 14% it pulled the presenter off his screen edge and
opened a gap onto the background.

## A note on verifying

`scripts/check-lesson.ts` imports the real engine modules rather than re-implementing them.
This matters: three separate hand-written checks passed while the render failed, each because
the check modelled the resolver slightly wrong — a looser punctuation strip, the wrong cursor
semantics, and `t0` where the engine used `t1`. Anything it cannot import, such as the window
maths in `EventRenderer`, is mirrored *and* guarded by a source assertion, so changing that
fails the check rather than silently invalidating it.

Confirm the checker still fails when a known bug is reintroduced. A gate that only ever passes
is worth nothing.

## Open items

Official slide visuals are NOT yet used by any act-engine lesson. `AGENTS.md` requires pulling
important diagrams, photographs and frameworks from
`source-material/ACT Lessons Updated Logo.pptx`, recording deck filename and slide number in the
lesson asset manifest, and including every sourced visual in the review stills. The act-engine
has no image component yet — this needs building.

Intro montage and end credits are not built. They need a `Sequence` offset wrapping the lesson
body so runtime extends without moving any phrase anchor, plus shared `CourseIntro` and
`CourseCredits` components. Blocked on credit copy.

`ThreeZoneDiagram`, `FourStepJourney` and `ScenarioSequence` are built and tested but unused in
lesson 8. The five-part issue formula is a numbered list where a built diagram was specced.

Lesson 1 picks up every engine fix automatically but its EDL still uses the old corner layout.
It needs the same rebuild and a re-render.
