#!/usr/bin/env bash
# Render a lesson on this machine.
#
#   ./render-local.sh                 -> full lesson to out/lesson-01.mp4
#   ./render-local.sh 11200 11400     -> just those frames, for checking a change quickly
#
# Requires Node 18+. First run downloads Chromium (~150MB) and the npm deps.
set -euo pipefail
cd "$(dirname "$0")"

FOOTAGE="public/ACT-lesson 1.mp4"
if [ ! -f "$FOOTAGE" ]; then
  echo "Missing footage: $FOOTAGE"
  echo "Copy the lesson's avatar video there first (it is git-ignored because of its size)."
  exit 1
fi

[ -d node_modules ] || npm install

mkdir -p out
if [ $# -eq 2 ]; then
  npx remotion render src/index.ts Lesson01 "out/lesson-01-$1-$2.mp4" --frames="$1-$2"
else
  npx remotion render src/index.ts Lesson01 out/lesson-01.mp4
fi
echo "Done -> out/"
