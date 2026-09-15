/**
 * Resolves `atPhrase` anchors in an EDL to real `atSeconds` timestamps, using per-word
 * timing extracted from the actual footage (rule 2: "actual audio controls timing" —
 * never assume written-script timing equals final video timing).
 *
 * Matching strategy: normalize both the anchor phrase and the word-timing track (lowercase,
 * strip punctuation), then find the anchor's word sequence as a contiguous run. This is
 * intentionally simple and intentionally strict — a silent wrong match is worse than a
 * loud failure, so an anchor that can't be found throws with enough context to fix the
 * EDL, rather than falling back to a guess.
 */
import type { Edl, EdlScene, EdlEvent } from "./schema";

export type WordTiming = { t0: number; t1: number; w: string };
export type WordTimingTrack = { words: WordTiming[] };

function normalize(s: string): string[] {
  return s
    .toLowerCase()
    // Written as explicit escapes on purpose. This class previously held STRAIGHT quotes
    // twice over - an editor had flattened the curly ones - so any anchor touching a word
    // the transcript spells with a smart quote ("\u201cThe", "Let\u2019s", "2015.\u201d") could never
    // match, and failed loudly at render. Escapes cannot be silently reflowed.
    .replace(/[\u2018\u2019\u201C\u201D\u0022\u0027.,!?;:()\[\]]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

/** Finds the first occurrence of `phrase` in the word track; returns [startTime, endTime]. */
export function findPhrase(
  track: WordTimingTrack,
  phrase: string,
  searchFromIndex = 0
): { t0: number; t1: number; wordIndex: number } {
  const needle = normalize(phrase);
  if (needle.length === 0) {
    throw new Error(`Empty phrase anchor.`);
  }
  const haystack = track.words.map((w) => normalize(w.w)[0] ?? "");

  for (let i = searchFromIndex; i <= haystack.length - needle.length; i++) {
    let match = true;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      return {
        t0: track.words[i].t0,
        t1: track.words[i + needle.length - 1].t1,
        wordIndex: i,
      };
    }
  }

  throw new Error(
    `Anchor phrase not found in footage transcript: "${phrase}". ` +
      `Check it against the ACTUAL transcript (not the old approved script) — ` +
      `the avatar tool may have reworded this line.`
  );
}

function resolveTimeAnchor(
  anchor: { atSeconds?: number; atPhrase?: string },
  track: WordTimingTrack,
  cursor: { index: number },
  which: "t0" | "t1"
): number {
  if (anchor.atSeconds !== undefined) return anchor.atSeconds;
  if (anchor.atPhrase !== undefined) {
    const hit = findPhrase(track, anchor.atPhrase, cursor.index);
    cursor.index = hit.wordIndex;
    return hit[which];
  }
  throw new Error("Anchor has neither atSeconds nor atPhrase.");
}

/** Returns a NEW Edl with every anchor resolved to plain numbers (still stored as
 * `atSeconds` so the schema stays uniform downstream). Scenes must be in chronological
 * order in the source EDL — resolution walks forward through the transcript so repeated
 * words (e.g. "Act") resolve to the right occurrence. */
export function resolveEdlAnchors(edl: Edl, track: WordTimingTrack): Edl {
  const cursor = { index: 0 };

  const scenes: EdlScene[] = edl.scenes.map((scene) => {
    const start = resolveTimeAnchor(scene.start, track, cursor, "t0");
    // Events search forward from the scene's START, not its end — otherwise an event
    // anchored earlier in the scene than the scene's own end-phrase would never be found
    // (the end-phrase search would already have moved the cursor past it).
    const eventCursorStart = cursor.index;
    // "t0", not "t1". Scenes are authored contiguously: scene N's end phrase IS scene N+1's
    // start phrase. Resolving the end to t1 (where the phrase FINISHES) while the next scene
    // starts at t0 (where it BEGINS) made every shared boundary overlap by the whole spoken
    // length of that phrase - up to two seconds of two slides drawn on top of each other.
    const end = resolveTimeAnchor(scene.end, track, cursor, "t0");

    const events: EdlEvent[] = scene.events.map((ev) => {
      const evCursor = { index: eventCursorStart };
      const at = resolveTimeAnchor(ev.anchor, track, evCursor, "t0");
      const resolvedEvent: EdlEvent = {
        ...ev,
        anchor: { atSeconds: at },
      };
      if (ev.endAnchor) {
        const endAt = resolveTimeAnchor(ev.endAnchor, track, evCursor, "t1");
        resolvedEvent.endAnchor = { atSeconds: endAt };
      }
      return resolvedEvent;
    });

    return {
      ...scene,
      start: { atSeconds: start },
      end: { atSeconds: end },
      events,
    };
  });

  return { ...edl, scenes };
}

/** Convenience: seconds -> frame at the EDL's fps. */
export function toFrame(seconds: number, fps: number): number {
  return Math.round(seconds * fps);
}
