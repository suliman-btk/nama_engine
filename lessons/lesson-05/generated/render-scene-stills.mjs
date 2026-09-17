/**
 * Review stills for Lesson 5 — one frame per content-bearing EDL scene (the full-bleed
 * "*-beat" breather scenes carry no graphic, so a single spot-check frame from one of them is
 * enough; they aren't each rendered separately here) plus a labelled contact sheet, so the
 * whole lesson's visual arc can be reviewed as one image. Scene boundaries below are copied
 * from src/data/lesson-05-edl.ts's resolved anchors (atSeconds values, or the exact atPhrase
 * strings resolved against the same word-timing track) — if the EDL's scene list changes,
 * update this list to match.
 *
 * Run from the repo root: node lessons/lesson-05/generated/render-scene-stills.mjs
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function findRepoRoot(start) {
  let dir = start;
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "AGENTS.md"))) return dir;
    dir = path.dirname(dir);
  }
  throw new Error("Could not locate repo root (AGENTS.md not found above " + start + ")");
}
const repo = findRepoRoot(process.cwd());
const engineRoot = path.join(repo, "production", "act-engine");
const lessonDir = path.join(repo, "lessons", "lesson-05");
const outDir = path.join(lessonDir, "qa", "scene-stills");
const contactSheet = path.join(lessonDir, "qa", "all-scenes-contact-sheet.jpg");

// [id, startSeconds, endSeconds, note]
const CONTENT_SCENES = [
  ["s1-feedback-q", 6.24, 21.84, "QuestionSlide"],
  ["s2-model", 30.279, 40.6, "StatementSlide"],
  ["s2-compass-intro", 42.791, 84.5, "Compass — intro"],
  ["s3-north", 86.656, 124.2, "Compass — North"],
  ["s3-south", 126.374, 149.7, "Compass — South"],
  ["s4-east", 151.893, 170.3, "Compass — East"],
  ["s4-west", 172.374, 193.0, "Compass — West"],
  ["s5-together", 195.014, 214.9, "Compass — all four"],
  ["s5-cage", 216.915, 247.7, "StatementSlide"],
  ["s5-key", 249.875, 257.4, "KeyStatement"],
  ["s6-activity", 259.581, 278.5, "ActivitySlide"],
  ["s6-quickfire", 280.5, 290.78, "ScenarioSequence"],
  ["s7-close", 304.372, 317.7, "StatementSlide"],
  ["s7-question", 319.732, 340.7, "QuestionSlide"],
  ["s8-outro", 342.732, 356.961, "OutroSlide"],
];
// Two full-bleed spot checks: the cold open, and one mid-lesson breather.
const FULL_BLEED_SPOT_CHECKS = [
  ["s1-open", 2.0],
  ["s2-beat2", 85.3],
];

fs.mkdirSync(outDir, { recursive: true });

console.log("Bundling once...");
const serveUrl = await bundle({
  entryPoint: path.join(engineRoot, "src/index.ts"),
  onProgress: (p) => process.stdout.write(`\r  bundling ${p}%    `),
});
console.log("\nBundled.");

const composition = await selectComposition({ serveUrl, id: "Lesson05" });

const shots = [];
CONTENT_SCENES.forEach(([id, start, end], i) => {
  const n = String(i + 1).padStart(2, "0");
  shots.push([`${n}-${id}`, (start + end) / 2]);
});
FULL_BLEED_SPOT_CHECKS.forEach(([id, at], i) => {
  shots.push([`fb${i + 1}-${id}`, at]);
});

let i = 0;
for (const [name, seconds] of shots) {
  i++;
  const frame = Math.max(0, Math.min(composition.durationInFrames - 1, Math.round(seconds * composition.fps)));
  const output = path.join(outDir, `${name}.jpg`);
  process.stdout.write(`\r  [${i}/${shots.length}] ${name} @ ${seconds.toFixed(2)}s    `);
  await renderStill({ composition, serveUrl, frame, output, imageFormat: "jpeg", jpegQuality: 90 });
}
console.log(`\nWrote ${shots.length} stills to ${path.relative(repo, outDir)}`);

// Contact sheet: 5 columns x 3 rows for the 15 content scenes (the 2 full-bleed spot checks
// are reviewed individually, not tiled in).
const files = CONTENT_SCENES.map((_, i) => path.join(outDir, `${String(i + 1).padStart(2, "0")}-${CONTENT_SCENES[i][0]}.jpg`));
const montage = spawnSync("ffmpeg", [
  "-y",
  ...files.flatMap((f) => ["-i", f]),
  "-filter_complex",
  "scale=384:216,tile=5x3",
  contactSheet,
], { stdio: "inherit" });
if (montage.status === 0) {
  console.log(`Wrote contact sheet: ${path.relative(repo, contactSheet)}`);
} else {
  console.error("Contact sheet generation failed; individual stills are still in", outDir);
}
