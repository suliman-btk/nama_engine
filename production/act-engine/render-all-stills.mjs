/**
 * Renders every scene of Lesson 8 as a still, bundling ONCE.
 *
 * `npx remotion still` re-bundles the whole project on every invocation, which is fine for one
 * frame and unusable for seventy. This drives @remotion/bundler and @remotion/renderer
 * directly: one bundle, then every frame off it.
 *
 * Run from a real Terminal on the Mac:  node render-all-stills.mjs
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { SHOTS } from "./shots.mjs";

const root = process.cwd();
const outDir = path.join(root, "previews-all");
fs.mkdirSync(outDir, { recursive: true });

console.log(`Bundling once (this is the slow part)...`);
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  onProgress: (p) => process.stdout.write(`\r  bundling ${p}%    `),
});
console.log(`\nBundled.\n`);

const composition = await selectComposition({ serveUrl, id: "Lesson08" });
console.log(`Composition: ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames\n`);

let done = 0;
let failed = 0;
for (const [name, frame] of SHOTS) {
  const output = path.join(outDir, `${name}.png`);
  try {
    await renderStill({ composition, serveUrl, output, frame, imageFormat: "png" });
    done++;
    console.log(`  [${String(done + failed).padStart(2)}/${SHOTS.length}] ${name}  (frame ${frame})`);
  } catch (err) {
    failed++;
    console.error(`  [!!] ${name} failed: ${err.message}`);
  }
}

console.log(`\n${done} stills written to ${outDir}${failed ? `, ${failed} failed` : ""}`);
