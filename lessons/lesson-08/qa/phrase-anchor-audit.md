# Lesson 08 — Visual Plan vs Locked Script: Phrase-Anchor Audit

Checked programmatically: every `atPhrase` anchor in `lesson08visualplan.md` against the
locked `pure-script.md`, scene by scene. **Only 2 of 31 anchors exist verbatim in the script.**
This is checked before any Whisper/word-timing work, because word timing can't rescue an
anchor that isn't actually spoken — the engine skips events whose `atPhrase` text can't be
found in the transcript (with a warning, not a crash), so as-written this plan would still
render almost empty.

Legend: ✅ exact match, no change needed · 🟡 near-miss — proposed verbatim substitute below ·
🔴 no basis in this lesson's script — needs your decision, not a guess from me.

## Scene 01 — What is a social issue?
- 🔴 `"what do others suffer from?"` — this framing ("others suffer") isn't in the script at all; scene 1 opens with "Think about a problem you see around you." Different angle. **Your call**: reword the on-screen question to match the script's actual framing, or tell me the intended framing.
- 🟡 `"A social issue is a problem"` → **"A social issue is simply a problem"** (verbatim, script just adds "simply").
- 🟡 `"The danger is starting with a solution too early"` — no such sentence exists. Nearest real passage: **"jump straight to a solution"** (script: "It is easy to jump straight to a solution because that feels active."). Proposed anchor swap; the wrong-order diagram concept still fits here.
- ✅ `"what is happening, who is affected"` — matches exactly.

## Scene 02 — Lion case
- 🟡 `"community was losing livestock to lions"` → **"lions were attacking livestock"** (verbatim).
- 🟡 `"Pause the video and watch"` → **"Pause here and watch"** (verbatim — script never says "the video").
- 🟡 `"notice three things"` — script never says "three things" here, just "notice what changed between his first attempts and the solution that finally worked." Proposed anchor: **"notice what changed"** (verbatim). The 3-prompt visual can still sit here, it's just not textually cued as "three."
- 🟡 `"effort alone is not enough"` → **"is not enough by itself"** (verbatim — script says "wanting to help is not enough by itself").

## Scene 03 — Choose one issue
- 🔴 `"the issue you identified on your Society Map"` — "Society Map" is never mentioned in this lesson's locked script. If that's a real tool/worksheet from an earlier lesson, this may be an intentional callback — but I can't confirm that from lesson 8's script alone. **Needs your confirmation** before I anchor or word this.
- 🟡 `"Start by making a short list"` → **"Pick one issue and write it down"** (verbatim, nearest actual instruction — script doesn't ask for a "short list," it asks the learner to pick one).
- 🟡 `"which one affects people in a meaningful way"` → anchor at **"Ask yourself"** (verbatim — leads into the script's actual 3-question sequence: who is affected / useful information / stay with this issue). These do map onto Meaningful / Researchable / Willing-to-continue, just not in the plan's exact wording.
- 🔴 `"If you are working alone"` — no solo/team framing anywhere in this lesson's script. **Needs your decision**: drop this event, or confirm it's an LMS-only addition with no spoken cue (fine to keep as a static note, just won't be phrase-anchored to anything specific).

## Scene 04 — Five indicators
Good news: the script actually enumerates "First / Second / Third / Fourth / Fifth," so every anchor here has a clean, faithful fix:
- 🟡 `"five indicators"` → **"answers five simple things"** (verbatim).
- 🟡 `"issue indicator"` → **"First: what is changing"** (verbatim).
- 🟡 `"the subject"` → **"Second: what exactly is the problem"** (verbatim).
- 🟡 `"targeted group"` → **"Third: who is affected"** (verbatim).
- 🟡 `"geographical indicator"` → **"Fourth: where is it happening"** (verbatim).
- 🟡 `"time indicator"` → **"Fifth: when is it happening"** (verbatim).

## Scene 05 — Worked example
- 🟡 `"The increase of the number of dropouts"` → **"The increase in the number of high school dropouts in Jeddah in 2015"** (verbatim — plan paraphrased "in" as "of" and dropped "high school").
- 🟡 `"Precision helps you"` → **"A clear sentence makes the next steps easier"** (verbatim). Displayed KeyStatement text ("Precise issue → better questions → better research → better solution later") is a fine on-screen paraphrase/caption of that line — only the anchor needs fixing.

## Scene 06 — Write your issue statement
- 🟡 `"Now write your own issue statement"` → **"Now try it with your own issue"** (verbatim).
- 🔴 `"Pause the video"` — unlike scene 2, scene 6's script never contains a pause instruction anywhere. This entire event has no spoken basis. **Needs your decision**: drop it, or keep it as a production-only overlay not tied to a specific phrase.
- 🟡 `"Can someone tell what is changing?"` — the script's actual self-check questions are different ("Would you understand the problem from that one sentence? Is anything too broad? Is anything missing?"), not the plan's 5-item list. Proposed anchor: **"read it again as if someone else wrote it"** (verbatim). Worth deciding whether to display the script's actual 3 self-check questions instead of the plan's 5.
- 🟡 `"A vague issue creates vague research"` → **"A good issue statement gives your research a direction"** (verbatim). KeyStatement text "CLEAR ISSUE = CLEARER DIRECTION" fits as a caption.

## Scene 07 — Research the issue
- 🟡 `"Describe the issue clearly"` → **"spend some time learning more about the issue"** (verbatim, scene opening).
- 🟡 `"how it affects the community"` → **"how it affects people"** (verbatim — script says "people," not "the community").
- 🟡 `"what may happen if it remains unresolved"` → **"what may happen if nothing changes"** (verbatim).
- 🟡 `"online information"` → **"reliable websites, reports, local information"** (verbatim).
- 🟡 `"Photos can help"` → **"you want to take photos, be respectful"** (verbatim).
- 🟡 `"listen before deciding"` → **"Change your understanding instead of forcing the facts to fit it"** (verbatim). KeyStatement "RESEARCH SHOULD CHALLENGE YOUR ASSUMPTIONS" fits as a caption of that line.

## Scene 08 — Turn research into understanding
- 🔴 `"three things"` panel ("Describe the issue / Effect on the community / What may happen if it continues") — this content doesn't match scene 08's script at all. Scene 08 actually lists **four** things (issue / who it affects / how it affects them / strongest information found) — and "what may happen if it continues" is literally scene 07's content, not scene 08's. **This looks like a misplaced/duplicated event from scene 07 — needs your check**, not a wording tweak.
- 🟡 `"If new evidence shows"` → **"your original issue statement is too wide or not quite right"** (verbatim). Note: scene 08's script never uses the word "evidence."
- 🟡 `"summarize your findings"` → **"keep your notes simple"** (verbatim). The one-page mockup (Issue / Affected group / Effect / Key evidence) actually lines up nicely with scene 08's real four-item list — just the anchor needs fixing.
- 🟡 `"willing to refine the problem"` → **"Good research should make your thinking clearer"** (verbatim). Minor: the KeyStatement text ("A strong leader can change the definition when the evidence changes") mentions "leader" and "evidence," neither of which appear in scene 08's script — thematically adjacent but worth a look.

## Scene 09 — Close
- 🟡 `"one issue you are willing to work on"` → **"one issue you want to work on"** (verbatim — "want," not "willing").
- ✅ `"A problem tells you what is going wrong"` — matches exactly.
- 🟡 `"In the next lesson"` → **"In the next part"** (verbatim — script says "part," not "lesson").

## Summary
- ✅ Exact matches: 2
- 🟡 Near-miss, safe verbatim fix proposed above: 24
- 🔴 No basis in this lesson's locked script, needs your decision: 5 (scene 1 opening question framing, scene 3 "Society Map" reference, scene 3 solo/team note, scene 6 pause instruction, scene 8 misplaced "three things" panel)
