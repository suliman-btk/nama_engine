#!/usr/bin/env bash
# Renders the review stills for lesson 8. Run from a real Terminal on the Mac:
#   bash render-previews.sh
set -euo pipefail
cd "$(dirname "$0")"
OUT=previews3
mkdir -p "$OUT"

shot () {
  printf '  %-28s frame %-6s' "$1" "$2"
  npx remotion still src/index.ts Lesson08 "$OUT/$1.png" --frame="$2" >/dev/null 2>&1
  printf 'done\n'
}

echo "Rendering review stills -> $OUT/"
shot 01-fullbleed-wide          45      # 1.5s   presenter owns the frame
shot 02-slide-right-presenter   210     # 7s     slide left, presenter right (30%)
shot 03-slide-LEFT-presenter    1440    # 48s    flipped: presenter left, content right
shot 04-keystatement            2250    # 75s    the component that used to overlap
shot 05-camera-close            2490    # 83s    close shot (camera variety)
shot 06-activity-5step          3930    # 131s   5-step list, presenter left
shot 07-worked-example          5160    # 172s   same frame you critiqued, rebuilt
shot 08-outro                   10980   # 366s   closing card
shot 09-turn-beat               4962    # 165.4s he expands to full to change sides
echo "All done. Open $OUT/"
