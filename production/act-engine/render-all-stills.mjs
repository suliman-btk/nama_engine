/** Render three review pictures per source scene, plus a combined contact sheet. */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const lesson = (process.argv[2] ?? "08").padStart(2, "0");
const root = process.cwd();
const repo = path.resolve(root, "../..");
const lessonDir = path.join(repo, "lessons", `lesson-${lesson}`);
const cutsPath = path.join(lessonDir, "generated", "cuts.json");
const outDir = path.join(lessonDir, "qa", "scene-stills");
const contactSheet = path.join(lessonDir, "qa", "all-scenes-contact-sheet.jpg");

if (!fs.existsSync(cutsPath)) throw new Error(`Missing ${cutsPath}`);
const cuts = JSON.parse(fs.readFileSync(cutsPath, "utf8"));
fs.mkdirSync(outDir, { recursive: true });

console.log("Bundling once...");
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  onProgress: (p) => process.stdout.write(`\r  bundling ${p}%    `),
});
console.log("\nBundled.");

const composition = await selectComposition({ serveUrl, id: `Lesson${lesson}` });
const totalSeconds = composition.durationInFrames / composition.fps;
const ends = [...cuts.slice(1), totalSeconds];
const shots = [];
for (let i = 0; i < cuts.length; i++) {
  const start = cuts[i];
  const end = ends[i];
  shots.push([`scene-${String(i + 1).padStart(3, "0")}-opening`, Math.min(end - 0.1, start + 0.8)]);
  shots.push([`scene-${String(i + 1).padStart(3, "0")}-middle`, (start + end) / 2]);
  shots.push([`scene-${String(i + 1).padStart(3, "0")}-ending`, Math.max(start + 0.1, end - 0.8)]);
}

for (const [name, seconds] of shots) {
  const frame = Math.max(0, Math.min(composition.durationInFrames - 1, Math.round(seconds * composition.fps)));
  const output = path.join(outDir, `${name}.png`);
  await renderStill({ composition, serveUrl, output, frame, imageFormat: "png" });
  console.log(`${name} (${seconds.toFixed(3)}s, frame ${frame})`);
}

const ffmpeg = spawnSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y", "-framerate", "1", "-pattern_type", "glob",
  "-i", path.join(outDir, "scene-*.png"), "-vf", "scale=480:270,tile=4x6", "-frames:v", "1", contactSheet,
], { stdio: "inherit" });
if (ffmpeg.status !== 0) throw new Error("ffmpeg contact-sheet generation failed");
console.log(`Wrote ${shots.length} stills and ${contactSheet}`);
