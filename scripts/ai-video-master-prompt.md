# ACT Course — Master Prompt for AI Video Tools

Read this once before you start generating. It covers **voice, pacing, and
pronunciation** for every scene in every lesson script (`lesson-01.md`
through `lesson-05.md` so far).

**Update: Google Vids has no style, voice, or custom-instructions field to
paste a prompt into — so the pronunciation fix below is no longer a prompt
at all. It's already written directly into every script, word for word.
You don't need to do anything for it. This file is now mainly a reference,
for the Arabic lines (Part 2) and for what to do if a new word misfires in
a later lesson (Part 3).**

---

## Part 1 — Voice and pacing

If your tool has any field for tone, style, or delivery, this is what to
put in it. If it doesn't, this is just useful to know going in — nothing
here needs pasting anywhere.

Speak directly to camera, to one person, not a room. Warm, clear, and
unhurried — about 145 words a minute. Take a real pause at every full
stop, a shorter one at every comma. Never rush.

---

## Part 2 — The Arabic lines

Three lines across Lessons 1–2 include real Arabic script. Test each one
on its own — generate just that short line by itself — before you
generate the full lesson it belongs to. Arabic pronunciation is the
single most likely thing to still come out wrong, since (unlike ACT)
there's no text-level fix for it — it has to actually be read as Arabic.

| Where | Arabic | What it means | Rough sound |
|---|---|---|---|
| Lesson 1, Scene 1 | بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ | "In the name of God, the Most Gracious, the Most Merciful" — a standard opening phrase | bis-mil-lah ar-rah-man ar-ra-heem |
| Lesson 1, Scene 4 | صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ | "Peace and blessings be upon him" — said after naming the Prophet | sal-lal-la-hu a-lay-hi wa sal-lam |
| Lesson 2, Scene 3 | صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ | Same phrase as above | sal-lal-la-hu a-lay-hi wa sal-lam |

**If a line still comes out wrong, or the tool skips it entirely**, the
fallback is to replace the Arabic in that one line with the "rough sound"
column above, typed out in plain English letters, and regenerate just
that scene. It won't sound as authentic, but it's far better than a
skipped or mangled line. Try this only after the Arabic script version
has genuinely failed.

**These lines are religious content, quoted directly from the course's
source material.** Don't reword, shorten, or paraphrase them — swap in
the phonetic fallback above instead, only if you have to.

---

## Part 3 — If a word comes out wrong (like ACT did)

Google Vids' voice, like most AI voices, tends to spell out a short word
written in all capital letters instead of saying it — "A, C, T" instead
of "Act." That's exactly what happened, and there's no prompt or setting
to fix it from the outside, since this tool doesn't take one. The fix has
to live in the text itself.

**"Act" is written that way — capital A only — directly in every scene
script now, wherever the program's name is spoken.** That's already done;
you don't need to change anything for it. It's still written in full
capitals, "ACT," in this document and in the lesson files' own titles and
notes, because those aren't spoken — only the words inside a SCENE block
are.

If a **different** word ever comes out wrong in a later lesson — misread,
mis-stressed, or spelled out when it shouldn't be — the same fix applies:

1. Find that word inside the SCENE block (not the heading, not the notes).
2. Respell it the way it needs to be **said** — a different capitalization,
   or spaced out for emphasis, or a phonetic version if it's a name.
3. Regenerate just that one scene.

Keep the correct, normal spelling everywhere that word is only being
*talked about* — a heading, a note, a file title — since those aren't
fed to the voice.

---

## Part 4 — What this file does not cover

- **What the presenter looks like.** If your tool lets you design a custom
  avatar (appearance, setting, camera framing), see
  `lesson-01/script/ai-avatar-2min.md` in this project for a full character
  description already written for that purpose.
- **How long each lesson runs, or how the scenes are split.** That's in
  each lesson file itself.
