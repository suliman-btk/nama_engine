/**
 * The actual stills script lives at production/act-engine/scripts/render-lesson-05-stills.mjs
 * — not here. Node's ESM resolver looks for node_modules by walking UP from the *importing
 * script's own path*, not from the current working directory, so a script that imports
 * "@remotion/bundler" only resolves when it physically sits somewhere under
 * production/act-engine/ (where that package is installed). Kept here as a pointer so anyone
 * looking for it in the lesson folder finds it immediately.
 *
 * Run from the repo root or from production/act-engine/ (same script either way):
 *   node production/act-engine/scripts/render-lesson-05-stills.mjs
 */
