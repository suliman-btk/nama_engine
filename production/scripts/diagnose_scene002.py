"""
Diagnostic: reproduce align_lesson's exact word-attach step for scene-002 and
show precisely where attach_locked_words() diverges from the locked script,
without needing another full lesson run. Run this from the repo root:

    cd ~/Desktop/act-video-course
    python3 production/scripts/diagnose_scene002.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import act_video as av
import whisper

lesson = "lesson-08"
lesson_dir = Path("lessons") / lesson
pure = av.parse_script(lesson_dir / "input" / "pure-script.md")
pure_text = dict(pure)["scene-002"]
clip = lesson_dir / "avatar" / "scene-002.mp4"

print("loading whisper model small ...")
model = whisper.load_model("small")
result = model.transcribe(str(clip), word_timestamps=True, verbose=False)

raw = []
for segment in result.get("segments", []):
    for word in segment.get("words", []):
        raw.append({"t": float(word["start"]), "d": max(0.01, float(word["end"]) - float(word["start"])), "w": str(word["word"]).strip()})

print("\n--- raw whisper words (%d) ---" % len(raw))
for w in raw:
    print("%6.2f  %r" % (w["t"], w["w"]))

timed = av.attach_locked_words(raw, pure_text)

print("\n--- attach_locked_words output (%d) ---" % len(timed))
for w in timed:
    print("%6.2f  %r" % (w["t"], w["w"]))

joined = " ".join(row["w"] for row in timed)
a = av.comparison_tokens(joined)
b = av.comparison_tokens(pure_text)
print("\nmatch:", a == b)
if a != b:
    import difflib
    print("\n--- diff (attach_locked_words result vs locked pure-script) ---")
    for line in difflib.unified_diff(a, b, lineterm="", fromfile="timed", tofile="locked"):
        print(line)
