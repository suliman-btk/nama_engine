#!/usr/bin/env python3
"""
One-off migration: Lesson 1's scenes.json -> the engine's declarative schema.

The old renderer chose a layout with `if (id === "scene-023")` branches, so the
layout knowledge lived in React. This lifts that knowledge into the lesson data
(layout + data + visual + presenter) so the engine can render any lesson without
knowing anything about it. Content that was hardcoded inside components (the ACT
units, the learning-zones table, survey items, summary points, the video URL) is
moved into the scenes that use it.

Also inserts the approved concept cards for Lesson 1's key ideas.

Safe to re-run: reads scenes.json, writes scenes.json (v2) + assets.json.
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LESSON = sys.argv[1] if len(sys.argv) > 1 else "lesson-01"
LDIR = ROOT / "lessons" / LESSON

scenes = json.load(open(LDIR / "scenes.json"))
manifest = json.load(open(LDIR / "asset-manifest.json"))

# ── content lifted out of the React components ──────────────────────────────
UNITS = [
    {"n": "1", "title": "Self-Awareness",     "q": "Who am I?"},
    {"n": "2", "title": "Social Awareness",   "q": "Who are others?"},
    {"n": "3", "title": "Social Issues",      "q": "What do others struggle with?"},
    {"n": "4", "title": "Social Initiatives", "q": "What can I offer?"},
]
ZONE_COLUMNS = ["ZONE", "HOW IT FEELS", "WHAT IT MEANS"]
ZONE_ROWS = [
    {"name": "COMFORT",   "tag": "Easy",     "color": "#3D6E96",
     "cells": ["Calm, automatic, no effort", "You already know how to do this"]},
    {"name": "CHALLENGE", "tag": "Let's Go", "color": "#CFAD3A",
     "cells": ["Nervous but capable", "You have an idea how — but not enough experience yet"]},
    {"name": "PAIN",      "tag": "No Way!",  "color": "#963D3D",
     "cells": ["Overwhelmed, stuck", "You don't know where to even start"]},
]
SURVEY_ITEMS = [
    "I understand what ACT is and what it's for.",
    "I could name at least one of the four units.",
    'I know what the "challenge zone" means.',
    "I feel confident stepping outside my comfort zone.",
    "I'm excited to start this program.",
]
SUMMARY_POINTS = [
    "You were welcomed into ACT — attitude cultivates transformation.",
    "You saw the four-unit journey you're about to walk.",
    "You set the ground rules for your own safe space.",
    "You met the three learning zones — and why growth lives in the challenge zone.",
]
VIDEO_URL = "youtube.com/watch?v=jU4oA3kkAWU"

# scene id -> (layout, data)  — mirrors the old renderer's branches exactly
EXPLICIT = {
    "scene-001": ("inset-image", {}),
    "scene-002": ("title", {}),
    "scene-005": ("title", {}),
    "scene-007": ("logo-showcase", {}),
    "scene-009": ("roadmap", {"steps": UNITS}),
    "scene-014": ("roadmap", {"steps": UNITS}),
    "scene-010": ("spotlight", {"number": "1", "title": UNITS[0]["title"], "subtitle": UNITS[0]["q"], "icon_index": 0}),
    "scene-011": ("spotlight", {"number": "2", "title": UNITS[1]["title"], "subtitle": UNITS[1]["q"], "icon_index": 1}),
    "scene-012": ("spotlight", {"number": "3", "title": UNITS[2]["title"], "subtitle": UNITS[2]["q"], "icon_index": 2}),
    "scene-013": ("spotlight", {"number": "4", "title": UNITS[3]["title"], "subtitle": UNITS[3]["q"], "icon_index": 3}),
    "scene-026": ("table", {"columns": ZONE_COLUMNS, "rows": ZONE_ROWS}),
    "scene-027": ("table", {"columns": ZONE_COLUMNS, "rows": ZONE_ROWS}),
    "scene-037": ("table", {"columns": ZONE_COLUMNS, "rows": ZONE_ROWS, "highlight": 1}),
    "scene-025": ("worksheet", {"title": "Pre-Workshop Survey — rate yourself 1 to 5", "items": SURVEY_ITEMS}),
    "scene-018": ("activity", {}),
    "scene-022": ("activity", {}),
    "scene-034": ("activity", {}),
    "scene-043": ("external-video", {"url": VIDEO_URL}),
    "scene-049": ("summary", {"title": "What you covered today", "items": SUMMARY_POINTS}),
    "scene-051": ("closing", {"next": "Next: Who Am I?"}),
}

# ── concept cards: the key ideas worth visualising, not just narrating ──────
# Applied only where they genuinely strengthen the approved video.
CONCEPT_CARDS = {
    "scene-014": {
        "main_message": "The journey ACT walks you through",
        "visual_structure": "progression",
        "items": [
            {"label": "Who am I?",              "note": "Self-awareness"},
            {"label": "Who are others?",        "note": "Social awareness"},
            {"label": "What do they struggle with?", "note": "Social issues"},
            {"label": "What can I offer?",      "note": "Social initiatives"},
        ],
    },
    "scene-027": {
        "main_message": "Three zones — only one of them grows you",
        "visual_structure": "progression",
        "items": [
            {"label": "Comfort",   "note": "No effort, no growth"},
            {"label": "Challenge", "note": "Stretch — this is where you learn"},
            {"label": "Pain",      "note": "Overwhelmed, stuck"},
        ],
    },
    "scene-037": {
        "main_message": "Growth lives in the challenge zone",
        "visual_structure": "progression",
        "items": [
            {"label": "Comfort"},
            {"label": "Stretch"},
            {"label": "Growth"},
        ],
    },
    "scene-042": {
        "main_message": "ACT keeps you in the challenge zone on purpose",
        "visual_structure": "cause-effect",
        "items": [
            {"label": "Challenge", "note": "Chosen, not avoided"},
            {"label": "New skill"},
            {"label": "A different person"},
        ],
    },
    "scene-046": {
        "main_message": "Hardship is not a sign something went wrong",
        "visual_structure": "contrast",
        "negative": "Something has gone wrong",
        "positive": "You are growing",
    },
    "scene-048": {
        "main_message": "Ask this of every challenge",
        "visual_structure": "progression",
        "items": [
            {"label": "What can I learn from this?"},
            {"label": "What skill comes out of it?"},
        ],
    },
}

# ── asset table: id -> file + true pixel size (drives the sharpness rule) ────
ASSET_SIZES = {
    "act-logo": ("act-logo.png", 660, 320),
    "org-logo-nama": ("org-logo-nama.jpg", 859, 618),
    "org-logo-nice": ("org-logo-nice.jpg", 490, 479),
    "org-logo-ghadan": ("org-logo-ghadan.png", 512, 512),
    "scenario-plane": ("scenario-plane.jpg", 1920, 1080),
    "scenario-sharks": ("scenario-sharks.jpg", 1200, 800),
    "scenario-crowd": ("scenario-crowd.jpg", 1170, 612),
    "scenario-food": ("scenario-food.jpg", 771, 416),
    "scenario-scales": ("scenario-scales.png", 516, 341),
    "stadium-crowd-visual": ("scenario-crowd.jpg", 1170, 612),
    "stock-summit": ("stock-summit.jpg", 1024, 768),
}
CREDIT = {c["id"]: c for c in manifest if isinstance(c, dict) and "id" in c}

LAYOUT_BY_VISUAL = {
    "quote": "quote", "question": "question",
    "worksheet": "worksheet", "summary": "summary",
    "activity-card": "activity", "external-video": "external-video",
}

ACTION_FROM_GESTURE = {
    "none": "talking", "open-hands": "explain", "counting": "explain",
    "raise-hand": "explain", "welcome": "welcome", "closing": "closing",
    "point-left": "point-left", "point-right": "point-right",
    "thinking": "thinking", "nod": "nod", "encouraging": "encouraging",
    "concerned": "concerned",
}


def migrate(scene, index):
    sid = scene["id"]
    old_presenter = scene.get("presenter", {}) or {}

    if sid in CONCEPT_CARDS:
        layout, data = "concept-card", dict(CONCEPT_CARDS[sid])
    elif sid in EXPLICIT:
        layout, data = EXPLICIT[sid]
        data = dict(data)
    else:
        asset_id = scene.get("asset_id")
        if asset_id and asset_id in ASSET_SIZES:
            layout = "scenario" if scene.get("section") == "learning-zones" else "full-image"
        elif scene.get("visual_type") in LAYOUT_BY_VISUAL:
            layout = LAYOUT_BY_VISUAL[scene["visual_type"]]
        elif scene.get("type") == "reflection":
            layout = "question"
        else:
            layout = "statement"
        data = {}

    if layout == "statement":
        data.setdefault("variant", index % 3)

    visual = None
    if sid == "scene-007":
        visual = {"assets": ["org-logo-nama", "org-logo-nice", "org-logo-ghadan"]}
    elif sid in ("scene-002", "scene-005"):
        visual = {"asset": "act-logo", "treatment": "inset"}
    elif sid == "scene-001":
        visual = {"asset": "stock-summit", "treatment": "inset"}
    elif scene.get("asset_id") in ASSET_SIZES:
        visual = {"asset": scene["asset_id"], "treatment": "auto"}

    gesture = old_presenter.get("gesture", "none")
    presenter = {
        "enabled": bool(old_presenter.get("visible", True)),
        "action": ACTION_FROM_GESTURE.get(gesture, "talking"),
        "position": "auto",
        "scale": 1.0,
        "expression": old_presenter.get("emotion", "friendly"),
        "target": old_presenter.get("gaze_target"),
    }

    out = {
        "id": sid,
        "section": scene["section"],
        "type": scene.get("type"),
        "layout": layout,
        "narration": scene["narration"],
        "on_screen_text": scene.get("on_screen_text"),
    }
    if data:
        out["data"] = data
    if visual:
        out["visual"] = visual
    out["presenter"] = presenter
    if scene.get("activity"):
        out["activity"] = scene["activity"]
    return out


migrated = [migrate(s, i) for i, s in enumerate(scenes)]

assets = []
for aid, (fname, w, h) in ASSET_SIZES.items():
    src = CREDIT.get(aid, {})
    assets.append({
        "id": aid, "file": fname, "width": w, "height": h,
        "source": src.get("source"), "license": src.get("license"),
        "credit": src.get("notes"),
    })

json.dump(migrated, open(LDIR / "scenes.json", "w"), indent=2, ensure_ascii=False)
json.dump(assets, open(LDIR / "assets.json", "w"), indent=2, ensure_ascii=False)

from collections import Counter
print(f"migrated {len(migrated)} scenes")
print("layouts:", dict(Counter(s["layout"] for s in migrated)))
print(f"concept cards: {sum(1 for s in migrated if s['layout']=='concept-card')}")
print("assets.json:", len(assets))
