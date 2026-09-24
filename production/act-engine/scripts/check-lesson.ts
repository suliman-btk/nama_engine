/**
 * Pre-render gate for a lesson EDL.
 *
 * WHY THIS EXISTS: every timing bug in lesson 8 was missed by a hand-written checker that
 * re-implemented the resolver's logic and got it subtly wrong — a looser punctuation strip
 * than the engine's, the wrong cursor semantics, and t0-vs-t1 on scene ends. Each one passed
 * a bespoke check and then failed in the render.
 *
 * So this file imports the REAL engine modules. It cannot drift from them, because it IS them.
 * Anything it can't import (EventRenderer's window maths) is mirrored here AND guarded by a
 * source assertion, so a change there fails this check instead of silently invalidating it.
 *
 *   npm run check -- 08
 */
import * as fs from "fs";
import * as path from "path";
import { resolveEdlAnchors } from "../src/edl/resolveAnchors";
import { enforceLayoutRules } from "../src/edl/enforceLayoutRules";
import { REQUIRES_GRAPHIC } from "../src/presenter/layoutConfig";
import type { Edl } from "../src/edl/schema";

const LESSON = (process.argv[2] ?? "08").padStart(2, "0");
// Two roots on purpose: `require` must load the COMPILED engine (.check/src), while the
// source audits below read the real .tsx files.
const BUILT = path.join(__dirname, "..", "src");
const SRC = path.join(__dirname, "..", "..", "src");

/* ---------- load course config for grammar rules ---------- */
const CONFIG_PATH = path.join(__dirname, "..", "..", "..", "..", "course-config.json");
let courseGrammar = { minTurnSeconds: 2.0, fullBleedTarget: 0.45, requireFullBleedBetweenSides: true };
try {
  const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  if (raw.presenterGrammar) {
    courseGrammar = { ...courseGrammar, ...raw.presenterGrammar };
  }
  console.log(`  config  loaded course config (${raw.courseId ?? "unknown"})`);
} catch {
  console.log("  config  no course-config.json found, using ACT defaults");
}

const FULL_BLEED = ["PresenterFull", "PresenterMedium", "PresenterClose"];
const SPLIT = ["PresenterLeft", "PresenterRight"];
/** A full-bleed beat shorter than this cannot read: the layout spring alone is 0.85s each way. */
const MIN_TURN_SECONDS = courseGrammar.minTurnSeconds;

let errors = 0;
let warnings = 0;
const fail = (m: string) => { console.error("  FAIL  " + m); errors++; };
const warn = (m: string) => { console.warn("  warn  " + m); warnings++; };
const ok = (m: string) => console.log("  ok    " + m);

console.log(`\nChecking lesson ${LESSON}\n`);

// ---------------------------------------------------------------- load
const edlMod = require(path.join(BUILT, "data", `lesson-${LESSON}-edl.js`));
const raw: Edl = edlMod[`lesson${LESSON}Edl`] ?? Object.values(edlMod)[0];
const track = JSON.parse(
  fs.readFileSync(path.join(SRC, "data", `lesson-${LESSON}-word-timing.json`), "utf8")
);

// ------------------------------------------------- 1. anchors + layout rules
let edl: Edl;
try {
  edl = resolveEdlAnchors(raw, track);
  ok(`all anchors resolve (${raw.scenes.length} scenes)`);
} catch (e: any) {
  fail(`anchor resolution threw: ${e.message}`);
  console.error("\nStopping: nothing else can be checked until anchors resolve.\n");
  process.exit(1);
}

const { corrections } = enforceLayoutRules(edl);
if (corrections.length) corrections.forEach((c) => fail("layout rule: " + c));
else ok("no layout-rule corrections (every shrunk presenter has a graphic)");

// ------------------------------------------------------------ 2. timeline
const sc = edl.scenes.map((s) => ({
  id: s.sceneId,
  layout: s.avatar.layout as string,
  start: s.start.atSeconds!,
  end: s.end.atSeconds!,
  events: s.events.filter((e) => e.component),
}));

let contiguous = true;
for (let i = 0; i < sc.length; i++) {
  if (sc[i].end <= sc[i].start) fail(`${sc[i].id}: non-positive duration`);
  if (i && Math.abs(sc[i].start - sc[i - 1].end) > 0.001) {
    fail(`gap/overlap before ${sc[i].id}: ${sc[i - 1].end.toFixed(3)} -> ${sc[i].start.toFixed(3)}`);
    contiguous = false;
  }
}
if (contiguous) ok(`timeline contiguous, ${sc[0].start.toFixed(2)}s - ${sc[sc.length - 1].end.toFixed(2)}s`);

// --------------------------------------------- 3. two-state grammar + coverage
for (const s of sc) {
  const isSplit = SPLIT.includes(s.layout);
  const isFull = FULL_BLEED.includes(s.layout);
  if (!isSplit && !isFull) warn(`${s.id}: layout "${s.layout}" is outside the two-state grammar`);
  if (isSplit && s.events.length === 0) fail(`${s.id}: split layout with no graphic`);
  if (isFull && s.events.length > 0) fail(`${s.id}: full-bleed scene carries a slide (it would be hidden)`);
  if (isFull && s.end - s.start < MIN_TURN_SECONDS)
    warn(`${s.id}: full-bleed beat is only ${(s.end - s.start).toFixed(2)}s (spring alone is 0.85s each way)`);
  if (REQUIRES_GRAPHIC.includes(s.layout as any) && s.events.length === 0)
    fail(`${s.id}: layout requires a graphic but has none`);
}
ok("scene layouts and graphic coverage checked");

// ------------------------------- 4. slide windows must never overlap (mirrors EventRenderer)
const evSrc = fs.readFileSync(path.join(SRC, "compositions", "EventRenderer.tsx"), "utf8");
const leadMatch = evSrc.match(/const leadInFrames\s*=\s*([^;]+);/);
const leadExpr = (leadMatch?.[1] ?? "").trim();
if (leadExpr !== "0")
  fail(`EventRenderer leadInFrames is "${leadExpr}", not 0 — a lead-in puts two slides on screen at once, and this check assumes 0`);
if (!/rawEnd\s*-\s*rawStart/.test(evSrc))
  fail("EventRenderer no longer derives its window from rawEnd - rawStart; rounding overlaps can return");

const wins: { id: string; a: number; b: number }[] = [];
for (const s of sc) {
  s.events.forEach((_, i) => {
    const isLast = i === s.events.length - 1;
    const endS = isLast ? s.end : s.end;
    const a = Math.round(s.start * edl.fps);
    const b = Math.round(endS * edl.fps);
    wins.push({ id: s.id, a, b });
  });
}
let overlaps = 0;
for (let i = 1; i < wins.length; i++)
  if (wins[i].a < wins[i - 1].b) {
    fail(`slides overlap: ${wins[i - 1].id} and ${wins[i].id} share ${wins[i - 1].b - wins[i].a} frame(s)`);
    overlaps++;
  }
if (!overlaps) ok("no two slides are ever on screen together");

// ------------------------- 5. the presenter must never slide across the frame to change sides
if (courseGrammar.requireFullBleedBetweenSides) {
  const sideOf = (l: string) => (l === "PresenterRight" ? "right" : l === "PresenterLeft" ? "left" : "full");
  let lastSide = "", lastIdx = -1, directs = 0;
  sc.forEach((s, i) => {
    const side = sideOf(s.layout);
    if (side === "full") return;
    if (lastSide && side !== lastSide && i === lastIdx + 1) {
      fail(`${sc[lastIdx].id} -> ${s.id}: side change with no full-bleed beat between them; the panel will slide across the frame`);
      directs++;
    }
    lastSide = side; lastIdx = i;
  });
  if (!directs) ok("every side change routes through a full-bleed beat");
} else {
  ok("side-change rule skipped (requireFullBleedBetweenSides = false)");
}

// --------------------------- 6. every component used must paint its own background
const used = new Set<string>();
sc.forEach((s) => s.events.forEach((e) => used.add(e.component as string)));
for (const name of used) {
  const file = ["components", "slides"]
    .map((d) => path.join(SRC, d, `${name}.tsx`))
    .find((p) => fs.existsSync(p));
  if (!file) { warn(`${name}: source not found, cannot audit its background`); continue; }
  const body = fs.readFileSync(file, "utf8");
  if (!/<SlideFrame|<CardShell|colors\.surface/.test(body))
    fail(`${name} paints no background — it will fall through to whatever is behind it`);
}
ok(`${used.size} component(s) audited for background`);

// ------------------------------------------------------------------ balance
const tFull = sc.filter((s) => FULL_BLEED.includes(s.layout)).reduce((n, s) => n + s.end - s.start, 0);
const tSplit = sc.filter((s) => SPLIT.includes(s.layout)).reduce((n, s) => n + s.end - s.start, 0);
const total = sc[sc.length - 1].end - sc[0].start;
console.log(
  `\n  presenter full-bleed : ${tFull.toFixed(1)}s (${((100 * tFull) / total).toFixed(0)}%)` +
  `\n  half-frame + slide   : ${tSplit.toFixed(1)}s (${((100 * tSplit) / total).toFixed(0)}%)`
);

console.log(`\n${errors ? "FAILED" : "PASSED"} — ${errors} error(s), ${warnings} warning(s)\n`);
process.exit(errors ? 1 : 0);
