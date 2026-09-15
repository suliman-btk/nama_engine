#!/usr/bin/env python3
"""Agent-safe workflow for real-avatar ACT lessons.

The renderer consumes generated/avatar-manifest.json. This tool is the only
supported way to create that file from the paired scene scripts.
"""

import argparse
import datetime as dt
import hashlib
import json
import math
import re
import shutil
import subprocess
import sys
import textwrap
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ENGINE = ROOT / "production" / "remotion-engine"
TEMPLATE = ROOT / "lessons" / "_avatar-template"
SCENE_HEADING = re.compile(r"^#{1,6}\s+scene\s+([A-Za-z0-9_-]+)\s*$", re.I)
CUE = re.compile(r"\[([^\]]+)\]")
TRANSITIONS = (
    ("soft-push-left", "coordinated"),
    ("soft-push-right", "presenter-card"),
    ("scale-through", "coordinated"),
    ("mask-wipe", "main-canvas"),
)
KNOWN_CUES = {
    "natural", "natural pace", "hope", "hopeful", "warm", "friendly",
    "calm", "confident", "reflective", "encouraging", "serious",
    "short pause", "pause", "long pause", "emphasis", "softly",
}


class InputError(Exception):
    pass


def canonical_lesson(value):
    return value if value.startswith("lesson-") else "lesson-" + value


def canonical_scene(value):
    value = value.strip().lower()
    if value.startswith("scene-"):
        value = value[6:]
    return "scene-" + (value.zfill(3) if value.isdigit() else value)


def compact(text):
    return re.sub(r"\s+", " ", text).strip()


def parse_script(path):
    if not path.exists():
        raise InputError("missing required script: %s" % path)
    scenes = []
    current = None
    lines = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        match = SCENE_HEADING.match(raw.strip())
        if match:
            if current is not None:
                scenes.append((current, compact("\n".join(lines))))
            current = canonical_scene(match.group(1))
            lines = []
        elif current is not None:
            lines.append(raw)
    if current is not None:
        scenes.append((current, compact("\n".join(lines))))
    if not scenes:
        raise InputError("%s has no headings like '## Scene 001'" % path)
    ids = [sid for sid, _ in scenes]
    if len(ids) != len(set(ids)):
        raise InputError("duplicate scene id in %s" % path)
    if any(not text for _, text in scenes):
        raise InputError("empty scene in %s" % path)
    return scenes


def spoken_performance(text):
    return compact(CUE.sub(" ", text))


def comparison_tokens(text):
    # Typographic ("smart") apostrophes and straight apostrophes are the same
    # word to a human but different codepoints to Python -- NFKC does NOT fold
    # ’ (RIGHT SINGLE QUOTATION MARK) to ' (APOSTROPHE), so without this
    # a locked script using proper typographic quotes ("Here’s") would never
    # match Whisper's transcription of the same word ("Here's"), even though the
    # word counts and everything else line up exactly. Confirmed on lesson-08
    # scene-002 ("Here’s") and scene-005 ("Let’s") via diagnose_scene002.py.
    text = unicodedata.normalize("NFKC", text).casefold()
    text = text.replace("’", "'").replace("‘", "'")
    return re.findall(r"[^\W_]+(?:['’][^\W_]+)?", text, flags=re.UNICODE)


def core_token(text):
    return "".join(comparison_tokens(text))


def attach_locked_words(words, source):
    """Attach locked spelling and punctuation to Whisper's timed words."""
    source_tokens = re.findall(r"\S+", source)
    out = []
    source_index = 0
    for word in words:
        target = core_token(word["w"])
        found = None
        for index in range(source_index, min(len(source_tokens), source_index + 16)):
            if core_token(source_tokens[index]) == target:
                found = index
                break
        if found is None:
            out.append(word)
            continue
        out.append({**word, "w": source_tokens[found]})
        source_index = found + 1
    return out


def probe_media(path):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate",
        "-of", "json", str(path),
    ]
    result = subprocess.run(cmd, text=True, capture_output=True)
    if result.returncode:
        raise InputError("invalid avatar media %s: %s" % (path, result.stderr.strip()))
    data = json.loads(result.stdout)
    streams = data.get("streams", [])
    video = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio = next((s for s in streams if s.get("codec_type") == "audio"), None)
    if not video or not audio:
        raise InputError("avatar clip must contain video and audio: %s" % path)
    duration = float(data.get("format", {}).get("duration", 0))
    if duration <= 0:
        raise InputError("avatar clip has no usable duration: %s" % path)
    width, height = int(video.get("width", 0)), int(video.get("height", 0))
    if not width or not height or abs(width / height - 16 / 9) > 0.02:
        raise InputError("avatar clip must be 16:9: %s is %sx%s" % (path, width, height))
    return {
        "durationSeconds": duration,
        "sourceWidth": width,
        "sourceHeight": height,
        "sourceFps": video.get("r_frame_rate", "unknown"),
        "videoCodec": video.get("codec_name", "unknown"),
        "audioCodec": audio.get("codec_name", "unknown"),
        "upscaled": width < 1920 or height < 1080,
    }


def find_clip(lesson_dir, scene_id, configured=None):
    if configured:
        path = lesson_dir / configured
        if path.exists():
            return path, configured
        raise InputError("configured avatar clip does not exist: %s" % path)
    for ext in (".mp4", ".mov", ".mkv", ".webm"):
        rel = "avatar/%s%s" % (scene_id, ext)
        path = lesson_dir / rel
        if path.exists():
            return path, rel
    raise InputError("missing avatar clip for %s under %s/avatar" % (scene_id, lesson_dir))


def load_json(path, fallback):
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise InputError("invalid JSON in %s: %s" % (path, exc))


def file_sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_word_timing(path):
    rows = load_json(path, [])
    if not isinstance(rows, list):
        raise InputError("word timing must be a JSON array: %s" % path)
    out = []
    for row in rows:
        if not isinstance(row, dict) or "w" not in row or "t" not in row:
            raise InputError("bad word timing entry in %s" % path)
        out.append({"w": str(row["w"]), "t": float(row["t"]), "d": float(row.get("d", 0))})
    return out


def resolve_phrase(phrase, words, fps):
    wanted = comparison_tokens(phrase)
    actual = [comparison_tokens(row["w"]) for row in words]
    flat = [tokens[0] if tokens else "" for tokens in actual]
    matches = []
    for i in range(0, len(flat) - len(wanted) + 1):
        if flat[i:i + len(wanted)] == wanted:
            matches.append(i)
    if len(matches) != 1:
        raise InputError("phrase anchor must resolve exactly once: %r resolved %d times" % (phrase, len(matches)))
    return round(words[matches[0]]["t"] * fps)


def resolve_events(events, timing_path, fps, duration):
    if not isinstance(events, list):
        raise InputError("visualEvents must be an array")
    words = None
    resolved = []
    for event in events:
        if not isinstance(event, dict):
            raise InputError("each visual event must be an object")
        item = dict(event)
        if "startSeconds" in item:
            start = round(float(item["startSeconds"]) * fps)
        elif item.get("atPhrase"):
            if words is None:
                if not timing_path.exists():
                    raise InputError("%s needs real word timing to resolve atPhrase" % timing_path)
                words = load_word_timing(timing_path)
            start = resolve_phrase(str(item["atPhrase"]), words, fps)
        else:
            raise InputError("visual event needs startSeconds or atPhrase")
        event_duration = float(item.get("durationSeconds", 6))
        end = min(round(duration * fps), start + max(1, round(event_duration * fps)))
        if start < 0 or start >= round(duration * fps):
            raise InputError("visual event starts outside its scene")
        item["startFrame"] = start
        item["endFrame"] = end
        resolved.append(item)
    return resolved


def srt_timestamp(seconds):
    millis = max(0, round(seconds * 1000))
    hours, millis = divmod(millis, 3600000)
    minutes, millis = divmod(millis, 60000)
    secs, millis = divmod(millis, 1000)
    return "%02d:%02d:%02d,%03d" % (hours, minutes, secs, millis)


def write_delivery_files(lesson_dir, manifest):
    generated = lesson_dir / "generated"
    generated.mkdir(parents=True, exist_ok=True)
    cursor = 0.0
    edl_scenes = []
    cues = []
    cue_index = 1
    for scene in manifest["scenes"]:
        edl_scenes.append({
            "id": scene["id"],
            "startSeconds": cursor,
            "durationSeconds": scene["durationSeconds"],
            "avatar": scene["avatar"],
            "visualEvents": scene["visualEvents"],
            "transitionOut": scene["transitionOut"],
        })
        words = scene.get("words", [])
        group = []
        for word in words:
            candidate = " ".join([x["w"] for x in group] + [word["w"]])
            if group and (len(candidate) > 76 or len(group) >= 10):
                start = cursor + group[0]["t"]
                end = cursor + group[-1]["t"] + group[-1]["d"]
                lines = textwrap.wrap(" ".join(x["w"] for x in group), width=42)[:2]
                cues.append("%d\n%s --> %s\n%s" % (cue_index, srt_timestamp(start), srt_timestamp(end), "\n".join(lines)))
                cue_index += 1
                group = []
            group.append(word)
        if group:
            start = cursor + group[0]["t"]
            end = cursor + group[-1]["t"] + group[-1]["d"]
            lines = textwrap.wrap(" ".join(x["w"] for x in group), width=42)[:2]
            cues.append("%d\n%s --> %s\n%s" % (cue_index, srt_timestamp(start), srt_timestamp(end), "\n".join(lines)))
            cue_index += 1
        cursor += scene["durationSeconds"]
    edl = {
        "schemaVersion": 1,
        "lesson": manifest["lesson"],
        "fps": manifest["fps"],
        "totalSeconds": manifest["totalSeconds"],
        "scenes": edl_scenes,
    }
    (generated / "avatar-edl.json").write_text(json.dumps(edl, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if cues:
        (generated / (manifest["lesson"] + ".srt")).write_text("\n\n".join(cues) + "\n", encoding="utf-8")


def align_lesson(lesson, model_name, language):
    """Transcribe each supplied clip and accept only exact locked wording."""
    lesson = canonical_lesson(lesson)
    lesson_dir = ROOT / "lessons" / lesson
    input_dir = lesson_dir / "input"
    pure = parse_script(input_dir / "pure-script.md")
    config = load_json(input_dir / "scene-config.json", {})
    try:
        import whisper
    except ImportError:
        raise InputError("OpenAI Whisper is not installed; cannot create real word timing")

    print("loading Whisper model %s" % model_name)
    model = whisper.load_model(model_name)
    timing_dir = lesson_dir / "generated" / "word-timing"
    timing_dir.mkdir(parents=True, exist_ok=True)
    for scene_id, pure_text in pure:
        cfg = config.get(scene_id, {}) if isinstance(config, dict) else {}
        avatar_cfg = cfg.get("avatar", {}) if isinstance(cfg, dict) else {}
        configured_src = avatar_cfg.get("src") if isinstance(avatar_cfg, dict) else None
        clip, _ = find_clip(lesson_dir, scene_id, configured_src)
        print("aligning %s <- %s" % (scene_id, clip.name))
        # NOTE: initial_prompt was previously set to pure_text to bias Whisper
        # toward the locked wording, but on scene-002 of lesson-08 it produced a
        # reproducible decoding failure (repeated/garbled tail text) -- confirmed
        # by re-running the identical clip through the identical model WITHOUT
        # initial_prompt, which transcribed it perfectly on the first try, twice.
        # attach_locked_words() already snaps recognized words back onto the
        # locked script's own spelling/punctuation, so initial_prompt bought
        # little accuracy benefit while introducing this failure mode. Removed.
        options = {"word_timestamps": True, "verbose": False}
        # Optional short vocabulary hint for words Whisper's general English
        # model tends to mishear (foreign/transliterated proper nouns, etc.) --
        # deliberately NOT the full scene text (see the note above about why
        # that induces decoding failures). Opt-in per scene via scene-config.json:
        #   "whisperVocabHint": "Jeddah"
        # Added after lesson-08 scene-005 ("Jeddah") was consistently misheard
        # as "JETA" by the small model with no hint at all.
        vocab_hint = cfg.get("whisperVocabHint") if isinstance(cfg, dict) else None
        if vocab_hint:
            options["initial_prompt"] = str(vocab_hint)
        if language:
            options["language"] = language
        result = model.transcribe(str(clip), **options)
        raw = []
        for segment in result.get("segments", []):
            for word in segment.get("words", []):
                start = float(word["start"])
                end = float(word["end"])
                raw.append({"t": start, "d": max(0.01, end - start), "w": str(word["word"]).strip()})
        timed = attach_locked_words(raw, pure_text)
        if comparison_tokens(" ".join(row["w"] for row in timed)) != comparison_tokens(pure_text):
            transcript = compact(str(result.get("text", "")))
            raise InputError("%s audio does not match locked text; review transcript: %s" % (scene_id, transcript))
        (timing_dir / (scene_id + ".json")).write_text(
            json.dumps(timed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    print("word timing -> %s" % timing_dir)


def validate_transition(value, final, scene_id):
    if final:
        if value not in (None, {}):
            raise InputError("final scene %s must have transitionOut: null" % scene_id)
        return None
    if not isinstance(value, dict):
        raise InputError("%s requires transitionOut" % scene_id)
    allowed_kind = {x[0] for x in TRANSITIONS} | {"crossfade", "clean-cut", "section-reveal", "dip-to-brand"}
    allowed_scope = {"presenter-card", "main-canvas", "full-frame", "coordinated"}
    kind = value.get("kind")
    scope = value.get("scope")
    frames = int(value.get("durationFrames", 14))
    if kind not in allowed_kind or scope not in allowed_scope:
        raise InputError("unsupported transition on %s: %r" % (scene_id, value))
    if not 1 <= frames <= 30:
        raise InputError("transition duration on %s must be 1..30 frames" % scene_id)
    return {"kind": kind, "scope": scope, "durationFrames": frames}


def build_manifest(lesson, write=False):
    lesson = canonical_lesson(lesson)
    lesson_dir = ROOT / "lessons" / lesson
    input_dir = lesson_dir / "input"
    pure = parse_script(input_dir / "pure-script.md")
    visual_script = input_dir / "visual-script.md"
    # Legacy lessons may retain a visual performance script, but new lessons
    # require only pure-script.md. Never ask the user to create another script.
    performance = parse_script(visual_script) if visual_script.exists() else pure
    if [x[0] for x in pure] != [x[0] for x in performance]:
        raise InputError("scene ids/order differ between pure and legacy visual scripts")
    config = load_json(input_dir / "scene-config.json", {})
    if not isinstance(config, dict):
        raise InputError("scene-config.json must contain an object keyed by scene id")

    fps = 30
    warnings = []
    scenes = []
    previous_transition = None
    for index, ((scene_id, pure_text), (_, performance_text)) in enumerate(zip(pure, performance)):
        spoken = spoken_performance(performance_text)
        if comparison_tokens(pure_text) != comparison_tokens(spoken):
            raise InputError("spoken wording differs between pure and legacy visual scripts in %s" % scene_id)
        if len(compact(pure_text)) > 800:
            raise InputError("%s has %d spoken characters; maximum is 800" % (scene_id, len(compact(pure_text))))
        for cue in CUE.findall(performance_text):
            if cue.strip().casefold() not in KNOWN_CUES:
                warnings.append("%s preserves unknown performance cue [%s]" % (scene_id, cue.strip()))

        cfg = config.get(scene_id, {})
        if not isinstance(cfg, dict):
            raise InputError("configuration for %s must be an object" % scene_id)
        avatar_cfg = cfg.get("avatar", {})
        configured_src = avatar_cfg.get("src") if isinstance(avatar_cfg, dict) else None
        clip, rel = find_clip(lesson_dir, scene_id, configured_src)
        media = probe_media(clip)
        final = index == len(pure) - 1
        layout = avatar_cfg.get("layout", "full" if index in (0, len(pure) - 1) else "corner")
        position = avatar_cfg.get("position", "right" if index % 2 == 0 else "left")
        if layout not in ("full", "corner", "hidden") or position not in ("left", "right"):
            raise InputError("invalid avatar layout/position for %s" % scene_id)

        if "transitionOut" in cfg:
            transition_value = cfg.get("transitionOut")
        elif final:
            transition_value = None
        else:
            kind, scope = TRANSITIONS[index % len(TRANSITIONS)]
            transition_value = {"kind": kind, "scope": scope, "durationFrames": 14}
        transition = validate_transition(transition_value, final, scene_id)
        if transition and transition["kind"] == previous_transition:
            raise InputError("transition %s repeats consecutively at %s" % (previous_transition, scene_id))
        previous_transition = transition["kind"] if transition else previous_transition

        timing_path = lesson_dir / "generated" / "word-timing" / (scene_id + ".json")
        words = load_word_timing(timing_path) if timing_path.exists() else []
        if words:
            timed_text = " ".join(row["w"] for row in words)
            if comparison_tokens(timed_text) != comparison_tokens(pure_text):
                raise InputError("real word timing does not match locked text in %s" % scene_id)
        else:
            warnings.append("%s has no real word timing; subtitles and atPhrase anchors are unavailable" % scene_id)
        events = resolve_events(cfg.get("visualEvents", []), timing_path, fps, media["durationSeconds"])
        scene = {
            "id": scene_id,
            "section": cfg.get("section", "Lesson"),
            "pureText": pure_text,
            "performanceText": performance_text,
            "durationSeconds": media["durationSeconds"],
            "avatar": {"src": rel, "layout": layout, "position": position},
            "visualEvents": events,
            "words": words,
            "transitionOut": transition,
            "media": media,
        }
        scenes.append(scene)

    total = sum(s["durationSeconds"] for s in scenes)
    for index, scene in enumerate(scenes[:-1]):
        transition = scene["transitionOut"]
        if transition and transition["kind"] in ("section-reveal", "dip-to-brand"):
            if scene["section"] == scenes[index + 1]["section"]:
                raise InputError("%s may only precede a genuine section change (%s)" % (transition["kind"], scene["id"]))
    manifest = {
        "schemaVersion": 1,
        "lesson": lesson,
        "mode": "avatar-scenes",
        "fps": fps,
        "width": 1920,
        "height": 1080,
        "totalSeconds": total,
        "warnings": warnings,
        "scenes": scenes,
    }
    if write:
        generated = lesson_dir / "generated"
        generated.mkdir(parents=True, exist_ok=True)
        (generated / "avatar-manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        write_delivery_files(lesson_dir, manifest)
    return manifest


def stage(manifest):
    lesson = manifest["lesson"]
    source = ROOT / "lessons" / lesson
    dest = ENGINE / "public" / "lessons" / lesson
    if dest.exists():
        shutil.rmtree(dest)
    (dest / "avatar").mkdir(parents=True)
    for scene in manifest["scenes"]:
        rel = Path(scene["avatar"]["src"])
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source / rel, target)
    (dest / "avatar-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    branding = ROOT / "shared" / "branding"
    if branding.exists():
        brand_dest = ENGINE / "public" / "shared" / "branding"
        brand_dest.mkdir(parents=True, exist_ok=True)
        for path in branding.glob("*.png"):
            shutil.copy2(path, brand_dest / path.name)
    render_manifest = {
        "lesson": lesson,
        "mode": "avatar-scenes",
        "fps": manifest["fps"],
        "width": manifest["width"],
        "height": manifest["height"],
        "totalSeconds": manifest["totalSeconds"],
    }
    data_dir = ENGINE / "src" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    (data_dir / "render-manifest.json").write_text(json.dumps(render_manifest, indent=2) + "\n")


def render_scene_stills(manifest, lesson_dir):
    """Render three review frames per scene before any full video render."""
    qa_dir = lesson_dir / "qa"
    still_dir = qa_dir / "scene-stills"
    still_dir.mkdir(parents=True, exist_ok=True)
    for stale in still_dir.glob("scene-*.png"):
        stale.unlink()

    stills = []
    scene_start = 0
    for scene in manifest["scenes"]:
        duration_frames = max(1, round(scene["durationSeconds"] * manifest["fps"]))
        local_frames = {
            "opening": min(duration_frames - 1, max(0, round(duration_frames * 0.12))),
            "middle": min(duration_frames - 1, max(0, round(duration_frames * 0.50))),
            "ending": min(duration_frames - 1, max(0, round(duration_frames * 0.82))),
        }
        events = scene.get("visualEvents", [])
        if events:
            event = events[0]
            local_frames["middle"] = min(
                duration_frames - 1,
                max(0, round((event["startFrame"] + event["endFrame"]) / 2)),
            )
        for position, local_frame in local_frames.items():
            filename = "%s-%s.png" % (scene["id"], position)
            stills.append({
                "sceneId": scene["id"],
                "position": position,
                "localFrame": local_frame,
                "frame": scene_start + local_frame,
                "timeSeconds": (scene_start + local_frame) / manifest["fps"],
                "output": str((still_dir / filename).resolve()),
            })
        scene_start += duration_frames

    plan = {
        "lesson": manifest["lesson"],
        "resolution": "%sx%s" % (manifest["width"], manifest["height"]),
        "stillsPerScene": 3,
        "stills": stills,
    }
    plan_path = qa_dir / "scene-stills-index.json"
    plan_path.write_text(json.dumps(plan, indent=2) + "\n", encoding="utf-8")
    log = qa_dir / "scene-stills-render.log"
    cmd = ["node", "scripts/render-avatar-stills.mjs", str(plan_path.resolve())]
    with log.open("w", encoding="utf-8") as handle:
        process = subprocess.run(cmd, cwd=ENGINE, text=True, stdout=handle, stderr=subprocess.STDOUT)
    if process.returncode:
        raise InputError("scene review still rendering failed; see %s" % log)

    missing = [row["output"] for row in stills if not Path(row["output"]).exists()]
    if missing:
        raise InputError("scene review stills are incomplete: " + ", ".join(missing))

    rows = max(1, math.ceil(len(stills) / 3))
    sheet = qa_dir / "all-scenes-contact-sheet.jpg"
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-pattern_type", "glob", "-i", str(still_dir / "scene-*.png"),
        "-vf", "scale=600:-1,tile=3x%d" % rows,
        "-frames:v", "1", str(sheet),
    ], check=True)
    print("review stills -> %s (%d images)" % (still_dir, len(stills)))
    print("contact sheet -> %s" % sheet)


def run_render(lesson, preview, crf):
    manifest = build_manifest(lesson, write=True)
    lesson_dir = ROOT / "lessons" / manifest["lesson"]
    approval_path = lesson_dir / "qa" / "preview-approval.json"
    if not preview and not approval_path.exists():
        raise InputError("final render blocked: user preview approval is missing")
    if not preview:
        still_index = lesson_dir / "qa" / "scene-stills-index.json"
        if not still_index.exists():
            raise InputError("final render blocked: scene review pictures are missing")
        approval = load_json(approval_path, {})
        manifest_path = lesson_dir / "generated" / "avatar-manifest.json"
        if approval.get("manifestSha256") != file_sha256(manifest_path):
            raise InputError("final render blocked: lesson changed after user approval; generate new pictures")
        if approval.get("stillsIndexSha256") != file_sha256(still_index):
            raise InputError("final render blocked: review pictures changed after user approval")
        low_resolution = [scene["id"] for scene in manifest["scenes"] if scene["media"]["upscaled"]]
        if low_resolution:
            raise InputError(
                "final render blocked: native 1920x1080 avatar footage is required for "
                + ", ".join(low_resolution)
            )
        missing_timing = [scene["id"] for scene in manifest["scenes"] if not scene.get("words")]
        if missing_timing:
            raise InputError("final render blocked: real word timing is missing for " + ", ".join(missing_timing))
    stage(manifest)
    if preview:
        if approval_path.exists():
            approval_path.unlink()
        render_scene_stills(manifest, lesson_dir)
        print("STOP: show the review pictures to the user and wait for explicit approval.")
        return
    out = lesson_dir / ("output/%s-final.mp4" % manifest["lesson"])
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = ["npx", "remotion", "render", "src/index.ts", "AvatarLesson", str(out), "--concurrency=4", "--crf=%d" % crf]
    log = lesson_dir / "qa" / "final-render.log"
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open("w", encoding="utf-8") as handle:
        process = subprocess.Popen(cmd, cwd=ENGINE, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        assert process.stdout is not None
        for line in process.stdout:
            print(line, end="")
            handle.write(line)
        if process.wait() != 0:
            raise InputError("Remotion render failed; see %s" % log)
    subtitle = lesson_dir / "generated" / (manifest["lesson"] + ".srt")
    if subtitle.exists():
        shutil.copy2(subtitle, out.parent / subtitle.name)
    print("rendered -> %s" % out)


def qa(lesson):
    lesson = canonical_lesson(lesson)
    lesson_dir = ROOT / "lessons" / lesson
    out = lesson_dir / "output" / (lesson + "-final.mp4")
    if not out.exists():
        raise InputError("missing final output: %s" % out)
    probe = probe_media(out)
    errors = []
    if probe["sourceWidth"] != 1920 or probe["sourceHeight"] != 1080:
        errors.append("final resolution is not 1920x1080")
    if probe["sourceFps"] not in ("30/1", "60/2"):
        errors.append("final frame rate is not 30 fps")
    if probe["videoCodec"] != "h264" or probe["audioCodec"] != "aac":
        errors.append("final codecs are not H.264/AAC")
    manifest_path = lesson_dir / "generated" / "avatar-manifest.json"
    manifest = load_json(manifest_path, {})
    expected_duration = float(manifest.get("totalSeconds", 0)) if isinstance(manifest, dict) else 0
    if expected_duration and abs(probe["durationSeconds"] - expected_duration) > 0.15:
        errors.append("final duration differs from avatar timing authority")
    decode = subprocess.run(["ffmpeg", "-hide_banner", "-v", "error", "-i", str(out), "-f", "null", "-"], text=True, capture_output=True)
    if decode.returncode:
        errors.append("full decode failed: " + decode.stderr.strip())
    report = {
        "lesson": lesson,
        "checkedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "file": str(out),
        "media": probe,
        "errors": errors,
        "status": "pass" if not errors else "fail",
    }
    qa_dir = lesson_dir / "qa"
    qa_dir.mkdir(parents=True, exist_ok=True)
    (qa_dir / "final-qa.json").write_text(json.dumps(report, indent=2) + "\n")
    markdown = [
        "# Final QA — %s" % lesson,
        "",
        "- Status: **%s**" % report["status"].upper(),
        "- File: `%s`" % out,
        "- Resolution: %sx%s" % (probe["sourceWidth"], probe["sourceHeight"]),
        "- Frame rate: %s" % probe["sourceFps"],
        "- Codecs: %s / %s" % (probe["videoCodec"], probe["audioCodec"]),
        "- Duration: %.3f seconds" % probe["durationSeconds"],
        "- Full decode: %s" % ("passed" if decode.returncode == 0 else "failed"),
        "",
    ]
    if errors:
        markdown.extend(["## Errors", ""] + ["- " + error for error in errors] + [""])
    (qa_dir / "final-qa.md").write_text("\n".join(markdown), encoding="utf-8")
    print(json.dumps(report, indent=2))
    if errors:
        raise InputError("final QA failed")


def init_lesson(lesson):
    lesson = canonical_lesson(lesson)
    dest = ROOT / "lessons" / lesson
    if dest.exists():
        raise InputError("lesson already exists: %s" % dest)
    shutil.copytree(TEMPLATE, dest)
    (dest / "avatar").mkdir()
    (dest / "assets").mkdir()
    print("created -> %s" % dest)


def approve(lesson, reviewer, note):
    lesson = canonical_lesson(lesson)
    lesson_dir = ROOT / "lessons" / lesson
    still_index = lesson_dir / "qa" / "scene-stills-index.json"
    if not still_index.exists():
        raise InputError("cannot approve before scene review pictures exist: %s" % still_index)
    review = load_json(still_index, {})
    missing = [row.get("output", "") for row in review.get("stills", []) if not Path(row.get("output", "")).exists()]
    if not review.get("stills") or missing:
        raise InputError("cannot approve: scene review pictures are incomplete")
    manifest_path = lesson_dir / "generated" / "avatar-manifest.json"
    if not manifest_path.exists():
        raise InputError("cannot approve before the reviewed manifest exists")
    payload = {
        "lesson": lesson,
        "reviewer": reviewer,
        "approvedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "note": note,
        "manifestSha256": file_sha256(manifest_path),
        "stillsIndexSha256": file_sha256(still_index),
    }
    path = lesson_dir / "qa" / "preview-approval.json"
    path.write_text(json.dumps(payload, indent=2) + "\n")
    print("approved -> %s" % path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ("init", "prepare", "validate", "preview", "render", "qa"):
        p = sub.add_parser(name)
        p.add_argument("lesson")
        if name in ("preview", "render"):
            p.add_argument("--crf", type=int, default=16)
    approval = sub.add_parser("approve-preview")
    approval.add_argument("lesson")
    approval.add_argument("--reviewer", required=True)
    approval.add_argument("--note", default="")
    alignment = sub.add_parser("align")
    alignment.add_argument("lesson")
    alignment.add_argument("--model", default="small")
    alignment.add_argument("--language", help="optional language code; omit for multilingual detection")
    args = parser.parse_args()
    try:
        if args.command == "init":
            init_lesson(args.lesson)
        elif args.command in ("prepare", "validate"):
            manifest = build_manifest(args.lesson, write=args.command == "prepare")
            print("validated %d scenes, %.2f minutes" % (len(manifest["scenes"]), manifest["totalSeconds"] / 60))
            for warning in manifest["warnings"]:
                print("warning: " + warning)
        elif args.command == "preview":
            run_render(args.lesson, True, args.crf)
        elif args.command == "render":
            run_render(args.lesson, False, args.crf)
        elif args.command == "approve-preview":
            approve(args.lesson, args.reviewer, args.note)
        elif args.command == "qa":
            qa(args.lesson)
        elif args.command == "align":
            align_lesson(args.lesson, args.model, args.language)
    except InputError as exc:
        sys.exit("error: %s" % exc)


if __name__ == "__main__":
    main()
