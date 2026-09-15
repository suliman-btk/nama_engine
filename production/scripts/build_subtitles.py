#!/usr/bin/env python3
"""
Generate subtitles for a lesson from the CURRENT narration and the CURRENT audio.

Timing comes from the rendered per-scene WAV durations, so subtitles can never
drift from the audio: regenerate narration -> re-run this -> they are back in
sync. (Lesson 1 shipped once with subtitles ~a day stale because this step only
existed inside a throwaway script; hence this file.)

Within a scene, sentences are apportioned by character count. That is an
approximation, not word-level timing, but it keeps every cue inside its own
scene's audio window, which is what matters for readability.

{{arabic:key}} markers are resolved to the Arabic script from the shared lexicon
so captions show what is actually spoken.

The lexicon's `spoken-form` entries are deliberately NOT applied here. Those exist
only to stop the TTS voice spelling out an acronym that is said as a word (ACT is
fed to the voice as "Act"); on screen the brand is written "ACT", so that is what
a caption must show. Written form for the eye, spoken form for the ear.

USAGE: python build_subtitles.py [lesson-01] [--vtt]
OUT:   lessons/<lesson>/subtitles/<lesson>.srt   (and .vtt with --vtt)
"""
import json, re, subprocess, sys, textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LESSON = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else "lesson-01"
WANT_VTT = "--vtt" in sys.argv

LDIR = ROOT / "lessons" / LESSON
AUDIO = LDIR / "audio" / "edge-raw"
OUT_DIR = LDIR / "subtitles"
OUT_DIR.mkdir(parents=True, exist_ok=True)
LEXICON = json.load(open(ROOT / "shared" / "pronunciation" / "lexicon.json"))
LEX = {e["key"]: e for e in LEXICON}

ARABIC_RE = re.compile(r"\{\{arabic:([a-z0-9\-]+)\}\}")
SENTENCE_RE = re.compile(r"(?<=[.!?])\s+")

MAX_CHARS_PER_LINE = 42
MAX_LINES = 2
MIN_CUE_SECONDS = 1.2


def resolve(text: str) -> str:
    def repl(m):
        e = LEX.get(m.group(1))
        if e and e.get("arabic"):
            return e["arabic"]
        return e.get("display", m.group(1)) if e else m.group(1)
    return ARABIC_RE.sub(repl, text)


def duration(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def ts(t: float, sep=",") -> str:
    h = int(t // 3600); t -= h * 3600
    m = int(t // 60); t -= m * 60
    s = int(t); ms = int(round((t - s) * 1000))
    if ms == 1000:
        s, ms = s + 1, 0
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def wrap(text: str) -> str:
    lines = textwrap.wrap(text, MAX_CHARS_PER_LINE)
    if len(lines) > MAX_LINES:
        # rebalance rather than spill a third line
        lines = textwrap.wrap(text, max(MAX_CHARS_PER_LINE, len(text) // MAX_LINES + 1))[:MAX_LINES]
    return "\n".join(lines)


def build():
    scenes = json.load(open(LDIR / "scenes.json"))
    cues, cursor = [], 0.0

    for scene in scenes:
        wav = AUDIO / f"{scene['id']}.wav"
        if not wav.exists():
            print(f"  ! missing audio for {scene['id']}, skipping", file=sys.stderr)
            continue
        dur = duration(wav)
        text = resolve(scene["narration"]).strip()
        sentences = [s.strip() for s in SENTENCE_RE.split(text) if s.strip()] or [text]

        total_chars = sum(len(s) for s in sentences) or 1
        t = cursor
        for i, sent in enumerate(sentences):
            share = (len(sent) / total_chars) * dur
            end = cursor + dur if i == len(sentences) - 1 else t + share
            if end - t < MIN_CUE_SECONDS and i < len(sentences) - 1:
                end = min(t + MIN_CUE_SECONDS, cursor + dur)
            cues.append((t, end, sent))
            t = end
        cursor += dur

    srt = OUT_DIR / f"{LESSON}.srt"
    with open(srt, "w") as f:
        for i, (a, b, text) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{wrap(text)}\n\n")

    if WANT_VTT:
        vtt = OUT_DIR / f"{LESSON}.vtt"
        with open(vtt, "w") as f:
            f.write("WEBVTT\n\n")
            for a, b, text in cues:
                f.write(f"{ts(a,'.')} --> {ts(b,'.')}\n{wrap(text)}\n\n")
        print("wrote", vtt)

    print(f"wrote {srt}  ({len(cues)} cues, {cursor/60:.2f} min)")


if __name__ == "__main__":
    build()
