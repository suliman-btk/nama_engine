/**
 * Builds a lesson's continuous word-timing track from the per-scene Whisper output.
 *
 * The avatar tool produces one clip per script scene, and the align step transcribes each clip
 * separately — so every scene's timings restart at zero, in {t, d, w}. The engine needs ONE
 * track across the whole lesson in {t0, t1, w}, because anchors are resolved against the master
 * video. This offsets each scene by where its clip begins in the master and concatenates.
 *
 *   node scripts/build-word-timing.mjs 08
 *
 * Scene start offsets come from lessons/lesson-NN/generated/cuts.json (an array of seconds,
 * one per scene, first entry 0). That file is also what the EDL's `sourceCutSeconds` is built
 * from — the same seams, used for two different jobs.
 */
import fs from "node:fs";
import path from "node:path";

const lesson = (process.argv[2] ?? "08").padStart(2, "0");
const repo = path.join(process.cwd(), "..", "..");
const lessonDir = path.join(repo, "lessons", `lesson-${lesson}`);
const wtDir = path.join(lessonDir, "generated", "word-timing");
const cutsFile = path.join(lessonDir, "generated", "cuts.json");
const out = path.join(process.cwd(), "src", "data", `lesson-${lesson}-word-timing.json`);

if (!fs.existsSync(cutsFile)) {
  console.error(`Missing ${cutsFile}\nIt must be a JSON array of scene start seconds, e.g. [0, 39.868, 81.458, ...]`);
  process.exit(1);
}
const cuts = JSON.parse(fs.readFileSync(cutsFile, "utf8"));
const scenes = fs.readdirSync(wtDir).filter((f) => /^scene-\d+\.json$/.test(f)).sort();

if (scenes.length !== cuts.length) {
  console.error(`${scenes.length} scene transcript(s) but ${cuts.length} cut offset(s) — they must match 1:1.`);
  process.exit(1);
}

const words = [];
scenes.forEach((file, i) => {
  const offset = cuts[i];
  const rows = JSON.parse(fs.readFileSync(path.join(wtDir, file), "utf8"));
  for (const r of rows) {
    words.push({
      t0: Number((r.t + offset).toFixed(3)),
      t1: Number((r.t + r.d + offset).toFixed(3)),
      w: String(r.w),
    });
  }
});

// The resolver walks this track forward with a cursor, so anything out of order would make
// later anchors unfindable. Cheaper to catch it here than in a render.
let outOfOrder = 0;
for (let i = 1; i < words.length; i++) if (words[i].t0 < words[i - 1].t0) outOfOrder++;
if (outOfOrder) {
  console.error(`${outOfOrder} word(s) out of chronological order — check the cut offsets.`);
  process.exit(1);
}

fs.writeFileSync(out, JSON.stringify({
  lesson: Number(lesson),
  source: `${scenes.length} per-scene Whisper transcriptions, offset by cuts.json and concatenated`,
  words,
}, null, 1));

console.log(`${words.length} words, ${words[0].t0.toFixed(2)}s - ${words[words.length - 1].t1.toFixed(2)}s`);
console.log(`wrote ${path.relative(process.cwd(), out)}`);
