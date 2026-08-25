#!/usr/bin/env python3
"""
Generate narration audio per scene using Kokoro (local MLX TTS) for English text,
splicing in macOS `say -v Majed` for the {{arabic:key}} marked phrases (Kokoro has
no Arabic voice). Mirrors the segment-splice approach used for the `say`-only version.

SETUP (see the `act-video-production-pipeline` memory for the full story):
  /opt/homebrew/bin/python3.12 -m venv .venv-kokoro   # system Python 3.9 is too old
  source .venv-kokoro/bin/activate
  pip install mlx mlx-audio soundfile sounddevice kokoro misaki
  brew install espeak-ng   # the bundled espeakng-loader wheel has broken paths
  export PHONEMIZER_ESPEAK_LIBRARY=/opt/homebrew/lib/libespeak-ng.dylib
  export ESPEAK_DATA_PATH=/opt/homebrew/Cellar/espeak-ng/<version>/share/espeak-ng-data

USAGE:
  python gen_kokoro_narration.py <lesson-number, e.g. 01>
Writes audio/scene-*.wav into that lesson's directory, overwriting any existing files.
"""
import sys, json, re, subprocess, os, shutil
from pathlib import Path
from mlx_audio.tts.utils import load_model
import soundfile as sf
import numpy as np

LESSON_NUM = sys.argv[1] if len(sys.argv) > 1 else "01"
ACT_ROOT = Path("/Users/suilman_btk/Desktop/NAMA foundation /videos-ACT/act-video-course")
LESSON_DIR = ACT_ROOT / "lessons" / f"lesson-{LESSON_NUM}"
LEXICON_PATH = ACT_ROOT / "shared" / "pronunciation" / "lexicon.json"
OUT_DIR = LESSON_DIR / "audio" / "kokoro-raw"
OUT_DIR.mkdir(exist_ok=True, parents=True)

VOICE = "af_heart"
MODEL_ID = "mlx-community/Kokoro-82M-bf16"
ARABIC_VOICE = "Majed"
SAMPLE_RATE = 24000  # Kokoro's native output rate

scenes = json.load(open(LESSON_DIR / "scenes.json"))
lexicon = {e["key"]: e for e in json.load(open(LEXICON_PATH))}
ARABIC_RE = re.compile(r"\{\{arabic:([a-z0-9\-]+)\}\}")

print("Loading Kokoro model...")
model = load_model(MODEL_ID)
print("Model loaded.")

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("CMD FAILED:", " ".join(cmd))
        print(r.stderr[-2000:])
        raise SystemExit(1)
    return r

def synth_kokoro(text, out_wav):
    segments = []
    sr = SAMPLE_RATE
    for result in model.generate(text=text, voice=VOICE, speed=1.0, lang_code="a"):
        segments.append(np.array(result.audio))
        sr = result.sample_rate
    audio = np.concatenate(segments) if segments else np.zeros(1)
    sf.write(str(out_wav), audio, sr)

def synth_arabic(text, out_wav):
    aiff = str(out_wav).replace(".wav", ".aiff")
    run(["say", "-v", ARABIC_VOICE, "-o", aiff, text])
    run(["ffmpeg", "-y", "-i", aiff, "-ar", str(SAMPLE_RATE), "-ac", "1", str(out_wav)])
    os.remove(aiff)

def build_scene_audio(scene_id, narration_text):
    parts = ARABIC_RE.split(narration_text)
    segment_files = []
    idx = 0
    for i, chunk in enumerate(parts):
        chunk = chunk.strip()
        if i % 2 == 1:
            entry = lexicon.get(chunk)
            seg_path = OUT_DIR / f"{scene_id}_seg{idx}.wav"
            if entry and entry.get("arabic"):
                synth_arabic(entry["arabic"], seg_path)
                segment_files.append(seg_path)
                idx += 1
        else:
            if chunk:
                seg_path = OUT_DIR / f"{scene_id}_seg{idx}.wav"
                synth_kokoro(chunk, seg_path)
                segment_files.append(seg_path)
                idx += 1

    final_wav = OUT_DIR / f"{scene_id}.wav"
    if len(segment_files) == 1:
        shutil.copy(segment_files[0], final_wav)
    else:
        listfile = OUT_DIR / f"{scene_id}_list.txt"
        with open(listfile, "w") as f:
            for sf_ in segment_files:
                f.write(f"file '{sf_.resolve()}'\n")
        run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listfile),
             "-ar", str(SAMPLE_RATE), "-ac", "1", str(final_wav)])
    for sf_ in segment_files:
        os.remove(sf_)
    lf = OUT_DIR / f"{scene_id}_list.txt"
    if lf.exists():
        os.remove(lf)

for i, scene in enumerate(scenes, 1):
    print(f"[{i}/{len(scenes)}] {scene['id']}")
    build_scene_audio(scene["id"], scene["narration"])

print("Done.")
