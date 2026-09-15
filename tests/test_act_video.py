import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest import mock


MODULE_PATH = Path(__file__).resolve().parents[1] / "production" / "scripts" / "act_video.py"
SPEC = importlib.util.spec_from_file_location("act_video", MODULE_PATH)
act_video = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(act_video)


class AvatarWorkflowTests(unittest.TestCase):
    def make_lesson(self, root, pure, visual=None, config="{}"):
        lesson = root / "lessons" / "lesson-test"
        (lesson / "input").mkdir(parents=True)
        (lesson / "avatar").mkdir()
        (lesson / "input" / "pure-script.md").write_text(pure, encoding="utf-8")
        if visual is not None:
            (lesson / "input" / "visual-script.md").write_text(visual, encoding="utf-8")
        (lesson / "input" / "scene-config.json").write_text(config, encoding="utf-8")
        for sid in ("scene-001", "scene-002"):
            (lesson / "avatar" / (sid + ".mp4")).touch()
        return lesson

    def media(self):
        return {
            "durationSeconds": 4.5,
            "sourceWidth": 1920,
            "sourceHeight": 1080,
            "sourceFps": "30/1",
            "videoCodec": "h264",
            "audioCodec": "aac",
            "upscaled": False,
        }

    def test_builds_matching_scene_manifest(self):
        pure = "## Scene 001\nHello there.\n\n## Scene 002\nSee you next time.\n"
        visual = "## Scene 001\n[natural] Hello there.\n\n## Scene 002\n[hope] See you next time.\n"
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self.make_lesson(root, pure, visual)
            with mock.patch.object(act_video, "ROOT", root), mock.patch.object(act_video, "probe_media", return_value=self.media()):
                manifest = act_video.build_manifest("lesson-test")
        self.assertEqual([s["id"] for s in manifest["scenes"]], ["scene-001", "scene-002"])
        self.assertEqual(manifest["scenes"][-1]["transitionOut"], None)
        self.assertEqual(manifest["totalSeconds"], 9.0)

    def test_builds_from_pure_script_without_visual_files(self):
        pure = "## Scene 001\nHello there.\n\n## Scene 002\nSee you next time.\n"
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self.make_lesson(root, pure)
            with mock.patch.object(act_video, "ROOT", root), mock.patch.object(act_video, "probe_media", return_value=self.media()):
                manifest = act_video.build_manifest("lesson-test")
        self.assertEqual(manifest["scenes"][0]["pureText"], "Hello there.")
        self.assertEqual(manifest["scenes"][0]["performanceText"], "Hello there.")

    def test_rejects_changed_spoken_wording(self):
        pure = "## Scene 001\nHello there.\n\n## Scene 002\nSee you next time.\n"
        visual = "## Scene 001\n[natural] Hello everyone.\n\n## Scene 002\n[hope] See you next time.\n"
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self.make_lesson(root, pure, visual)
            with mock.patch.object(act_video, "ROOT", root), mock.patch.object(act_video, "probe_media", return_value=self.media()):
                with self.assertRaisesRegex(act_video.InputError, "spoken wording differs"):
                    act_video.build_manifest("lesson-test")

    def test_rejects_scene_over_character_limit(self):
        long_text = "a" * 801
        pure = "## Scene 001\n%s\n\n## Scene 002\nEnd.\n" % long_text
        visual = "## Scene 001\n[natural] %s\n\n## Scene 002\nEnd.\n" % long_text
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self.make_lesson(root, pure, visual)
            with mock.patch.object(act_video, "ROOT", root), mock.patch.object(act_video, "probe_media", return_value=self.media()):
                with self.assertRaisesRegex(act_video.InputError, "maximum is 800"):
                    act_video.build_manifest("lesson-test")

    def test_attaches_locked_case_and_punctuation_to_timing(self):
        words = [
            {"t": 0.1, "d": 0.2, "w": "act"},
            {"t": 0.4, "d": 0.2, "w": "works"},
        ]
        result = act_video.attach_locked_words(words, "ACT works.")
        self.assertEqual([row["w"] for row in result], ["ACT", "works."])


if __name__ == "__main__":
    unittest.main()
