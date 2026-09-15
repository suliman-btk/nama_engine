import fs from "node:fs";
import path from "node:path";

const lesson = (process.argv[2] ?? "08").padStart(2, "0");
const root = path.resolve(process.cwd(), "../..");
const source = path.join(root, "lessons", `lesson-${lesson}`, "assets");
const destination = path.join(process.cwd(), "public", "lesson-assets", `lesson-${lesson}`);

if (!fs.existsSync(source)) {
  console.log(`No lesson assets to stage at ${source}`);
  process.exit(0);
}
fs.mkdirSync(destination, { recursive: true });
fs.cpSync(source, destination, { recursive: true, force: true });
console.log(`Staged lesson-${lesson} assets at ${path.relative(process.cwd(), destination)}`);
