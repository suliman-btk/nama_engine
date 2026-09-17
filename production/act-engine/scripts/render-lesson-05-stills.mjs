/**
 * Review stills for Lesson 5 — one frame per content-bearing EDL scene (the full-bleed
 * "*-beat" breather scenes carry no graphic, so a single spot-check frame from one of them is
 * enough; they aren't each rendered separately here) plus a labelled contact sheet, so the
 * whole lesson's visual arc can be reviewed as one image. Scene boundaries below are copied
 * from src/data/lesson-05-edl.ts's resolved anchors (atSeconds values, or the exact atPhrase
 * strings resolved against the same word-timing track) — if the EDL's scene list changes,
 * update this list to match.
 *
 * Run from the repo root: node production/act-engine/scripts/render-lesson-05-stills.mjs
 *
 * Optional: pass one or more scene ids (the first column below, e.g. s3-north) as CLI args to
 * re-render only those stills instead of all 17 — useful after a component tweak, so you don't
 * have to wait through a full re-render just to check one fix. The contact sheet is always
 * rebuilt from whatever stills currently exist in qa/scene-stills/, whichever ids were rendered.
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..", "..", "..");
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

const ALL_SHOTS = [
  ...CONTENT_SCENES.map(([id, start, end], i) => [`${String(i + 1).padStart(2, "0")}-${id}`, (start + end) / 2]),
  ...FULL_BLEED_SPOT_CHECKS.map(([id, at], i) => [`fb${i + 1}-${id}`, at]),
];

const requestedIds = process.argv.slice(2);
const shots = requestedIds.length === 0
  ? ALL_SHOTS
  : ALL_SHOTS.filter(([name]) => requestedIds.some((id) => name === id || name.endsWith(`-${id}`)));

if (requestedIds.length > 0 && shots.length === 0) {
  console.error(`No matching scenes for: ${requestedIds.join(", ")}`);
  console.error(`Known ids: ${ALL_SHOTS.map(([n]) => n.replace(/^(\d\d-|fb\d-)/, "")).join(", ")}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

console.log("Bundling once...");
const serveUrl = await bundle({
  entryPoint: path.join(engineRoot, "src/index.ts"),
  onProgress: (p) => process.stdout.write(`\r  bundling ${p}%    `),
});
console.log("\nBundled.");

const composition = await selectComposition({ serveUrl, id: "Lesson05" });

let i = 0;
for (const [name, seconds] of shots) {
  i++;
  const frame = Math.max(0, Math.min(composition.durationInFrames - 1, Math.round(seconds * composition.fps)));
  const output = path.join(outDir, `${name}.jpg`);
  process.stdout.write(`\r  [${i}/${shots.length}] ${name} @ ${seconds.toFixed(2)}s    `);
  await renderStill({ composition, serveUrl, frame, output, imageFormat: "jpeg", jpegQuality: 90 });
}
console.log(`\nWrote ${shots.length} still(s) to ${path.relative(repo, outDir)}`);

// Contact sheet: 5 columns x 3 rows for the 15 content scenes (the 2 full-bleed spot checks
// are reviewed individually, not tiled in). Built from whatever files currently exist on disk,
// so a partial re-render still produces an up-to-date sheet as long as all 15 have been
// rendered at least once. Each input gets its own labelled stream ([0:v]..[14:v]) scaled
// individually, then hstack'd into rows and vstack'd into the grid — `tile` only tiles frames
// of a single stream, which is why the original version of this script silently produced a
// mostly-black sheet with only the first image visible.
const files = CONTENT_SCENES.map((_, idx) => path.join(outDir, `${String(idx + 1).padStart(2, "0")}-${CONTENT_SCENES[idx][0]}.jpg`));
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length > 0) {
  console.error(`Skipping contact sheet — missing stills: ${missing.map((f) => path.basename(f)).join(", ")}`);
} else {
  const cols = 5;
  const rows = 3;
  const cellW = 384;
  const cellH = 216;
  const scaleLabels = files.map((_, idx) => `[${idx}:v]scale=${cellW}:${cellH}[s${idx}]`);
  const rowLabels = [];
  for (let r = 0; r < rows; r++) {
    const inputs = Array.from({ length: cols }, (_, c) => `[s${r * cols + c}]`).join("");
    rowLabels.push(`${inputs}hstack=inputs=${cols}[row${r}]`);
  }
  const vstackInputs = Array.from({ length: rows }, (_, r) => `[row${r}]`).join("");
  const filterComplex = [...scaleLabels, ...rowLabels, `${vstackInputs}vstack=inputs=${rows}[out]`].join(";");

  const montage = spawnSync("ffmpeg", [
    "-y",
    ...files.flatMap((f) => ["-i", f]),
    "-filter_complex",
    filterComplex,
    "-map",
    "[out]",
    contactSheet,
  ], { stdio: "inherit" });
  if (montage.status === 0) {
  console.log(`Wrote contact sheet: ${path.relative(repo, contactSheet)}`);
  } else {
    console.error("Contact sheet generation failed; individual stills are still in", outDir);
  }
}
