# Lesson 5 — narration-version mismatch and open engine question

With explicit user approval, `lesson/act/05` was created from `course/act`. The prior
uncommitted lesson-04/09 work was committed to `lesson/act/04` first (WIP checkpoint) so the
tree was clean before branching.

The user supplied `ACT- lesson 5.mp4` (native 1920x1080, 356.961s, checksum-verified after
transfer) and `lesson-05-scenes.md`. The scene document and the video's embedded caption track
disagree from the opening line onward: the document begins "Before anything else: if you went
and asked people who matter to you..." while the video's own captions begin "Before we build
the leadership compass, look at the feedback you collected from people you trust...". The
document also targets 6 Google-Vids scenes / ~8-9 minutes; the actual master is one continuous
take, ~6 minutes. This is the same kind of mismatch found on Lesson 4.

The user was asked and explicitly chose to follow the video's spoken audio. `input/pure-script.md`
now holds that authorized version, reconstructed from the video's own embedded caption track.
`input/original-scenes.md` is retained unchanged as reference only.

**Alignment method — deviates from Lesson 4, noted for transparency.** Lesson 4 used two local
Whisper ASR passes. No local Whisper/ASR model is reachable from this session (network egress
blocks huggingface.co and Whisper's model host), so per-word timing here was instead derived
from the video's own embedded caption cues (175 cues, already sentence/phrase-level with
correct punctuation), with each cue's duration distributed across its words in proportion to
word length. This is an approximation, not a measured per-word ASR timestamp — anchors resolve
against cue-level boundaries confidently; timing within a multi-word cue (typically 3-6 words
over 1-2 seconds) is estimated. No word was invented; total token count matches the caption
transcript exactly (851 words), and word order/timing is monotonic with zero out-of-order
timestamps. Treated as a single continuous scene (`generated/cuts.json = [0]`) since the master
is one uncut take with no detected clip-join seams, so no per-scene offset is needed.

**One wording correction, not a content change.** The caption track twice renders "access"
where the speaker is audibly describing the two "axis" lines of the compass ("the first
access is about interest or focus" / "the second access is speed") — an evident homophone
mis-transcription by the caption engine, not a different word being spoken. `pure-script.md`
corrects both to "axis" for the same audio; nothing was added, removed, or paraphrased.

**Official curriculum visual — open question, needs an engine decision before the EDL is
authored.** `source-material/ACT Lessons Updated Logo.pptx` slides 79-89 cover the leadership
compass. Slide 89 is a genuine match: four SmartArt trait-wheels (North/South/East/West) whose
labels are what the narration lifts almost verbatim per direction (e.g. North: "Straightforward,
Focuses on results, loves to be in control, Initiator by nature..." mirrors the narration's
"straightforward, results focused, quick to initiate..." line for line). See
`generated/asset-manifest.json` for the full slide survey. Slide 89 is SmartArt, not an
embeddable picture object, so it was captured as a whole-slide screenshot
(`assets/deck/slide-089-leadership-compass-wheels.png`), consistent with `AGENTS.md`'s rule to
screenshot a slide only when the full composition matters — the four wheels only mean something
as a set. No literal two-crossing-axes quadrant diagram exists anywhere in the deck; slide 89's
wheels are the closest official visual.

The act-engine has no way to show this yet: `docs/act-engine-lesson-procedure.md` records
under "Open items" that official slide visuals are not used by any act-engine lesson and "the
act-engine has no image component yet — this needs building." Per `AGENTS.md`, that is an
engine change and belongs on `main`, not on this lesson branch, and branch moves need explicit
approval. It is also the kind of visual `AGENTS.md` prefers rebuilt as an editable diagram
rather than a raster screenshot where practical — here that would mean a genuine drawn
"leadership compass" component (two crossing axes, four labelled quadrants, current direction
highlighted at the narration's timestamp), in the same family as the existing `ThreeZoneDiagram`
/ `FourStepJourney` components, rather than embedding the slide-89 screenshot as a flat image.

Nothing beyond input files, word timing, and this survey has been written yet. The EDL,
composition, `Root.tsx` registration, and `npm run check -- 05` are pending the user's decision
on how to handle this visual.
