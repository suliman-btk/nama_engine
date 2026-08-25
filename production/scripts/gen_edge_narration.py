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
  python gen_edge_narration.py [lesson-number]     # default: 01

Writes <lesson>/audio/edge-raw/scene-XXX.wav (16kHz mono PCM, ready for Rhubarb).
Requires network access (Edge TTS is a hosted Microsoft service, free, no API key).
"""
import sys, json, re, subprocess, os, asyncio
from pathlib import Path
import edge_tts

LESSON_NUM = sys.argv[1] if len(sys.argv) > 1 else "01"
ACT_ROOT = Path("/Users/suilman_btk/Desktop/NAMA foundation /videos-ACT/act-video-course")
LESSON_DIR = ACT_ROOT / "lessons" / f"lesson-{LESSON_NUM}"
LEXICON_PATH = ACT_ROOT / "shared" / "pronunciation" / "lexicon.json"
OUT_DIR = LESSON_DIR / "audio" / "edge-raw"
OUT_DIR.mkdir(exist_ok=True, parents=True)

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


async def synth_one(text: str, out_wav: Path, attempts: int = 6):
    mp3 = out_wav.with_suffix(".mp3")
    last_err = None
    for i in range(attempts):
        try:
            await asyncio.wait_for(
                edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH).save(str(mp3)),
                timeout=REQUEST_TIMEOUT,
            )
            if mp3.exists() and mp3.stat().st_size > 500:
                to_wav(mp3, out_wav)
                return
            last_err = RuntimeError("empty audio returned")
        except Exception as e:  # transient network / throttling / hang
            last_err = e
        await asyncio.sleep(2 * (i + 1))
    raise RuntimeError(f"TTS failed for {out_wav.name}: {last_err}")


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


async def synth_scene(text: str, out_wav: Path, tmp: Path):
    """One synthesis call for the whole scene: the voice phrases it itself, which
    is more natural than gluing separately-rendered sentences together. Very long
    passages are split once at a sentence boundary if the service refuses them."""
    if not text.strip():
        silence(0.5, out_wav)
        return

    lead = tmp / "lead.wav"
    silence(PAUSE_LEAD_IN, lead)

    body = tmp / "body.wav"
    try:
        await synth_one(text, body)
        parts = [lead, body]
    except RuntimeError:
        parts = [lead]
        for i, chunk in enumerate(split_in_half(text)):
            seg = tmp / f"half{i}.wav"
            await synth_one(chunk, seg)
            parts.append(seg)

    concat(parts, out_wav)
    for p in parts:
        Path(p).unlink(missing_ok=True)


async def main():
    tmp = OUT_DIR / "_tmp"
    tmp.mkdir(exist_ok=True)
    for i, scene in enumerate(scenes, 1):
        sid = scene["id"]
        text = resolve_arabic(scene["narration"]).strip()
        n = len([s for s in SENTENCE_RE.split(text) if s.strip()])
        print(f"[{i}/{len(scenes)}] {sid}  ({n} sentences)", flush=True)
        await synth_scene(text, OUT_DIR / f"{sid}.wav", tmp)
        await asyncio.sleep(0.35)   # be gentle with the free service
    for leftover in tmp.glob("*"):
        leftover.unlink()
    tmp.rmdir()
    print("Done ->", OUT_DIR)


if __name__ == "__main__":
    asyncio.run(main())
