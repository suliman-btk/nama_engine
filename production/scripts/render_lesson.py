#!/usr/bin/env python3
# NOTE: kept syntax-compatible with the system python 3.9 as well as the venv.
"""
Render any lesson with the shared engine.

    python render_lesson.py lesson-02                 # full render
    python render_lesson.py lesson-02 --preview       # 60-90s quality-gate clip
    python render_lesson.py lesson-02 --preview --scenes scene-001,scene-016

Stages the lesson's data + media into production/remotion-engine/public/lessons/<id>/
and writes a render manifest, so one Remotion project renders every lesson and the
engine holds no lesson-specific paths.

The --preview path exists to satisfy the quality gate: never spend 20 minutes
rendering a full lesson before a representative sample has been reviewed.
"""
import argparse, json, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENGINE = ROOT / "production" / "remotion-engine"


def sh(cmd, **kw):
    r = subprocess.run(cmd, cwd=kw.pop("cwd", None), text=True)
    if r.returncode != 0:
        sys.exit(f"command failed: {' '.join(map(str, cmd))}")


def stage(lesson, only):
    ldir = ROOT / "lessons" / lesson
    for required in ("lesson.json", "scenes.json", "durations.json"):
        if not (ldir / required).exists():
            sys.exit(f"missing {ldir/required} — run the narration/presenter build first")

    dest = ENGINE / "public" / "lessons" / lesson
    if dest.exists():
        shutil.rmtree(dest)
    (dest / "audio").mkdir(parents=True)
    (dest / "presenter").mkdir(parents=True)
    (dest / "assets").mkdir(parents=True)

    scenes = json.load(open(ldir / "scenes.json"))
    durations = json.load(open(ldir / "durations.json"))

    if only:
        keep = set(only)
        scenes = [s for s in scenes if s["id"] in keep]
        if not scenes:
            sys.exit(f"no scenes matched {sorted(keep)}")
        durations = {s["id"]: durations[s["id"]] for s in scenes if s["id"] in durations}

    for name in ("lesson.json", "assets.json"):
        if (ldir / name).exists():
            shutil.copy(ldir / name, dest / name)
    json.dump(scenes, open(dest / "scenes.json", "w"), ensure_ascii=False)
    json.dump(durations, open(dest / "durations.json", "w"))

    for s in scenes:
        sid = s["id"]
        wav = ldir / "audio" / "edge-raw" / f"{sid}.wav"
        if wav.exists():
            shutil.copy(wav, dest / "audio" / f"{sid}.wav")
        pres = ldir / "presenter" / f"{sid}.json"
        if pres.exists():
            shutil.copy(pres, dest / "presenter" / f"{sid}.json")

    if (ldir / "assets").exists():
        for f in (ldir / "assets").iterdir():
            if f.is_file():
                shutil.copy(f, dest / "assets" / f.name)

    total = sum(durations.values())
    (ENGINE / "src" / "data").mkdir(parents=True, exist_ok=True)
    json.dump({"lesson": lesson, "totalSeconds": total},
              open(ENGINE / "src" / "data" / "render-manifest.json", "w"), indent=2)
    return scenes, total


def pick_preview_scenes(scenes, target_seconds, durations):
    """A representative sample: different layouts, a presenter beat, any Arabic."""
    by_layout, chosen = {}, []
    for s in scenes:
        by_layout.setdefault(s["layout"], []).append(s)
    priority = ["title", "concept-card", "table", "roadmap", "scenario",
                "full-image", "inset-image", "question", "activity", "statement"]
    for layout in priority:
        if layout in by_layout:
            chosen.append(by_layout[layout][0])
    for s in scenes:
        if "{{arabic:" in s.get("narration", "") and s not in chosen:
            chosen.insert(1, s)
            break
    chosen.sort(key=lambda s: [x["id"] for x in scenes].index(s["id"]))
    out, acc = [], 0.0
    for s in chosen:
        d = durations.get(s["id"], 0)
        if acc + d > target_seconds and out:
            break
        out.append(s["id"]); acc += d
    return out, acc


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lesson")
    ap.add_argument("--preview", action="store_true", help="render a short representative sample")
    ap.add_argument("--scenes", help="comma-separated scene ids (implies a partial render)")
    ap.add_argument("--seconds", type=int, default=90, help="preview target length")
    ap.add_argument("--crf", type=int, default=16)
    ap.add_argument("--out", help="output path override")
    args = ap.parse_args()

    lesson = args.lesson if args.lesson.startswith("lesson-") else f"lesson-{args.lesson}"
    ldir = ROOT / "lessons" / lesson

    only = args.scenes.split(",") if args.scenes else None
    if args.preview and not only:
        scenes = json.load(open(ldir / "scenes.json"))
        durations = json.load(open(ldir / "durations.json"))
        only, acc = pick_preview_scenes(scenes, args.seconds, durations)
        print(f"preview sample: {len(only)} scenes, {acc:.0f}s -> {', '.join(only)}")

    scenes, total = stage(lesson, only)
    print(f"staged {len(scenes)} scenes, {total/60:.2f} min")

    outdir = ROOT / "lessons" / lesson / "output"
    outdir.mkdir(parents=True, exist_ok=True)
    default = f"{lesson}-preview.mp4" if (args.preview or only) else f"{lesson}.mp4"
    # resolve against the invoking cwd: remotion runs with cwd=ENGINE, so a
    # relative --out would otherwise land inside the engine directory
    out = (Path.cwd() / args.out).resolve() if args.out else outdir / default

    sh(["npx", "remotion", "render", "src/index.ts", "Lesson", str(out),
        "--concurrency=4", f"--crf={args.crf}"], cwd=ENGINE)
    print(f"\nrendered -> {out}")


if __name__ == "__main__":
    main()
