#!/usr/bin/env python3
"""
Generate narration audio per scene using Microsoft Edge neural TTS (edge-tts).

Uses a MULTILINGUAL voice (en-AU-WilliamMultilingualNeural), which speaks English
normally AND switches to correct native pronunciation for Arabic script — so the
{{arabic:key}} phrases are rendered inline by the SAME narrator instead of being
spliced in from a second voice. This replaces the earlier Kokoro(English) +
macOS-`say`(Arabic) two-voice splice entirely.

SETUP:
  source <venv>/bin/activate
  pip install edge-tts

USAGE:
  python gen_edge_narration.py [lesson-number]                   # default: 01
  python gen_edge_narration.py 01 --only=scene-006,scene-007     # just these scenes

Written-vs-spoken forms: `{{arabic:key}}` markers resolve to Arabic script, and
`spoken-form` lexicon entries (e.g. ACT -> "Act", so the voice says the word
instead of spelling "A-C-T") are applied to the TTS text only. What goes on
screen and into the subtitles always stays in the written form.

Writes <lesson>/audio/edge-raw/scene-XXX.wav (16kHz mono PCM, ready for Rhubarb).
Requires network access (Edge TTS is a hosted Microsoft service, free, no API key).
"""
import sys, json, re, subprocess, os, asyncio
from pathlib import Path
import edge_tts

_args = [a for a in sys.argv[1:] if not a.startswith("--")]
_flags = [a for a in sys.argv[1:] if a.startswith("--")]
LESSON_NUM = _args[0] if _args else "01"

# --only scene-006,scene-007 re-synthesises just those scenes and leaves the rest
# of the lesson's audio untouched. Editing one line of narration should not cost a
# full-lesson re-bake (and every re-bake of an unchanged scene shifts its timing
# slightly, which then invalidates its visemes and subtitles for no reason).
ONLY = set()
for f in _flags:
    if f.startswith("--only="):
        ONLY = {s.strip() for s in f.split("=", 1)[1].split(",") if s.strip()}
ACT_ROOT = Path("/Users/suilman_btk/Desktop/NAMA foundation /videos-ACT/act-video-course")
LESSON_DIR = ACT_ROOT / "lessons" / f"lesson-{LESSON_NUM}"
LEXICON_PATH = ACT_ROOT / "shared" / "pronunciation" / "lexicon.json"
OUT_DIR = LESSON_DIR / "audio" / "edge-raw"
OUT_DIR.mkdir(exist_ok=True, parents=True)
# Per-word timings, captured from the same synthesis call as the audio. These
# drive the burned-in karaoke captions; Rhubarb's phoneme cues are far too fine
# grained to group into words.
WORD_DIR = LESSON_DIR / "audio" / "word-timing"
WORD_DIR.mkdir(exist_ok=True, parents=True)

VOICE = "en-US-AndrewMultilingualNeural"
RATE = "-1%"      # Andrew reads warm at close to natural pace
PITCH = "-1Hz"

scenes = json.load(open(LESSON_DIR / "scenes.json"))
lexicon = {e["key"]: e for e in json.load(open(LEXICON_PATH))}
ARABIC_RE = re.compile(r"\{\{arabic:([a-z0-9\-]+)\}\}")


def resolve_arabic(text: str) -> str:
    """Replace {{arabic:key}} with the actual Arabic script, inline."""
    def repl(m):
        entry = lexicon.get(m.group(1))
        if entry and entry.get("arabic"):
            return entry["arabic"]
        return entry.get("display", m.group(1)) if entry else m.group(1)
    return ARABIC_RE.sub(repl, text)


# Neural voices spell out short all-caps tokens letter by letter. That is correct
# for a true initialism (DNA) and wrong for an acronym said as a word: "ACT" was
# being read "A-C-T" in every lesson that names the program. Rather than
# misspelling the brand in scenes.json, the lexicon carries a spoken form and it
# is applied HERE ONLY — scenes.json, the on-screen text and the subtitles all
# keep the written form, which is the correct spelling to *show*.
SPOKEN_FORMS = [
    (re.compile(rf"(?<![A-Za-z]){re.escape(e['written'])}(?![A-Za-z])"), e["spoken_as"])
    for e in lexicon.values()
    if e.get("type") == "spoken-form"
]


def apply_spoken_forms(text: str) -> str:
    """Rewrite written brand forms into the spelling the voice pronounces right."""
    for pattern, spoken in SPOKEN_FORMS:
        text = pattern.sub(spoken, text)
    return text


SR = 24000
PAUSE_LEAD_IN = 0.12   # tiny gap so the first word is never clipped

# NOTE: an earlier version synthesised each sentence separately and spliced fixed
# silences between them. That produced audible dead air and made the delivery feel
# more mechanical, not less. Edge's neural voices already phrase a full paragraph
# with natural sentence breaks, so each scene is now a SINGLE synthesis call.
SENTENCE_RE = re.compile(r"(?<=[.!?])\s+")


def to_wav(mp3_path: Path, wav_path: Path):
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(mp3_path), "-ar", str(SR), "-ac", "1", str(wav_path)],
        check=True, capture_output=True,
    )
    os.remove(mp3_path)


def silence(seconds: float, out_wav: Path):
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=mono",
         "-t", f"{seconds:.3f}", str(out_wav)],
        check=True, capture_output=True,
    )


REQUEST_TIMEOUT = 75  # edge-tts has no timeout of its own and will hang forever


async def _stream_once(text: str, mp3: Path):
    """One synthesis call, keeping the audio AND the per-word timings it reports.

    Both must come from the SAME request. Re-synthesising to 'just get timings'
    produces a slightly different take, and the captions then drift against the
    voice by a growing fraction of a second. WordBoundary is opt-in — the service
    defaults to SentenceBoundary, which is useless for karaoke captions."""
    words = []
    comm = edge_tts.Communicate(
        text, VOICE, rate=RATE, pitch=PITCH, boundary="WordBoundary"
    )
    with open(mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "t": chunk["offset"] / 1e7,      # 100ns ticks -> seconds
                    "d": chunk["duration"] / 1e7,
                    "w": chunk["text"],
                })
    return words


async def synth_one(text: str, out_wav: Path, attempts: int = 6):
    """Returns the word timings for this segment (seconds, segment-relative)."""
    mp3 = out_wav.with_suffix(".mp3")
    last_err = None
    for i in range(attempts):
        try:
            words = await asyncio.wait_for(
                _stream_once(text, mp3), timeout=REQUEST_TIMEOUT
            )
            if mp3.exists() and mp3.stat().st_size > 500:
                to_wav(mp3, out_wav)
                return words
            last_err = RuntimeError("empty audio returned")
        except Exception as e:  # transient network / throttling / hang
            last_err = e
        await asyncio.sleep(2 * (i + 1))
    raise RuntimeError(f"TTS failed for {out_wav.name}: {last_err}")


def wav_seconds(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


TOKEN_RE = re.compile(r"\S+")
CORE_RE = re.compile(r"[^0-9a-z']")


def _core(s: str) -> str:
    return CORE_RE.sub("", s.lower())


def attach_source_words(words, source: str):
    """Restore each timed word's ORIGINAL spelling and punctuation.

    Edge reports word text with every mark stripped — 'name', never 'name.' — so
    a caption grouper downstream has no sentence boundaries to break on and its
    phrases run straight across full stops ("...has a name Over the next few").
    Walking the source alongside the returned words fixes that, and as a bonus
    hands back the WRITTEN form for free: the voice was fed "Act", the source
    says "ACT", and the caption should show "ACT".

    A word that cannot be matched keeps the bare form rather than being guessed
    at — a wrong word on screen is worse than an unpunctuated one."""
    tokens = TOKEN_RE.findall(source)
    out, ti = [], 0
    for w in words:
        target = _core(w["w"])
        found = None
        # bounded forward scan: skips source tokens that produce no word event
        # of their own, such as a lone em-dash between clauses
        for j in range(ti, min(len(tokens), ti + 12)):
            if _core(tokens[j]) == target:
                found = j
                break
        if found is None:
            out.append(dict(w))
            continue
        out.append({**w, "w": tokens[found]})
        ti = found + 1
    return out


def concat(parts, out_wav: Path):
    listfile = out_wav.with_suffix(".txt")
    with open(listfile, "w") as f:
        for p in parts:
            f.write(f"file '{Path(p).resolve()}'\n")
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listfile),
         "-ar", str(SR), "-ac", "1", str(out_wav)],
        check=True, capture_output=True,
    )
    os.remove(listfile)


def split_in_half(text: str):
    """Break a long passage at the sentence boundary nearest the middle."""
    sents = [x.strip() for x in SENTENCE_RE.split(text) if x.strip()]
    if len(sents) < 2:
        return [text]
    mid, best, gap = len(text) / 2, 1, None
    run = 0
    for i, snt in enumerate(sents[:-1], start=1):
        run += len(snt) + 1
        d = abs(run - mid)
        if gap is None or d < gap:
            gap, best = d, i
    return [" ".join(sents[:best]), " ".join(sents[best:])]


async def synth_scene(text: str, source: str, out_wav: Path, tmp: Path):
    """One synthesis call for the whole scene: the voice phrases it itself, which
    is more natural than gluing separately-rendered sentences together. Very long
    passages are split once at a sentence boundary if the service refuses them.

    Returns word timings in FINAL-FILE seconds, i.e. already shifted past the
    lead-in silence (and past the first half, when a split was needed)."""
    if not text.strip():
        silence(0.5, out_wav)
        return []

    lead = tmp / "lead.wav"
    silence(PAUSE_LEAD_IN, lead)

    body = tmp / "body.wav"
    words = []
    try:
        raw = await synth_one(text, body)
        words = [{**w, "t": w["t"] + PAUSE_LEAD_IN} for w in raw]
        parts = [lead, body]
    except RuntimeError:
        parts = [lead]
        shift = PAUSE_LEAD_IN
        for i, chunk in enumerate(split_in_half(text)):
            seg = tmp / f"half{i}.wav"
            raw = await synth_one(chunk, seg)
            words += [{**w, "t": w["t"] + shift} for w in raw]
            shift += wav_seconds(seg)
            parts.append(seg)

    concat(parts, out_wav)
    for p in parts:
        Path(p).unlink(missing_ok=True)
    return attach_source_words(words, source)


async def main():
    tmp = OUT_DIR / "_tmp"
    tmp.mkdir(exist_ok=True)
    todo = [s for s in scenes if not ONLY or s["id"] in ONLY]
    if ONLY:
        missing = ONLY - {s["id"] for s in scenes}
        if missing:
            raise SystemExit(f"--only named scenes not in scenes.json: {sorted(missing)}")
        print(f"Re-synthesising {len(todo)} of {len(scenes)} scenes: {', '.join(s['id'] for s in todo)}")
    for i, scene in enumerate(todo, 1):
        sid = scene["id"]
        # `source` keeps the written form and the punctuation; `text` is what the
        # voice is actually fed. The captions are rebuilt from `source`.
        source = resolve_arabic(scene["narration"]).strip()
        text = apply_spoken_forms(source)
        n = len([s for s in SENTENCE_RE.split(text) if s.strip()])
        print(f"[{i}/{len(todo)}] {sid}  ({n} sentences)", flush=True)
        words = await synth_scene(text, source, OUT_DIR / f"{sid}.wav", tmp)
        json.dump(words, open(WORD_DIR / f"{sid}.json", "w"), indent=1)
        print(f"        {len(words)} word timings", flush=True)
        await asyncio.sleep(0.35)   # be gentle with the free service
    for leftover in tmp.glob("*"):
        leftover.unlink()
    tmp.rmdir()
    print("Done ->", OUT_DIR)


if __name__ == "__main__":
    asyncio.run(main())
