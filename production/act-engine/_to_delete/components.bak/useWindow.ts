import { useCurrentFrame, useVideoConfig } from "remotion";
import { phaseAt } from "../motion/timeline";

export type GraphicWindow = {
  startFrame: number;
  durationInFrames: number;
  enterFrames?: number;
  exitFrames?: number;
};

/** Standard ENTER -> HOLD -> EXIT phase for a graphic component, given the absolute frame
 * range it should occupy (resolved from the EDL event's anchor + endAnchor by the caller). */
export function useWindowPhase(win: GraphicWindow) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterFrames = win.enterFrames ?? Math.round(fps * 0.45);
  const exitFrames = win.exitFrames ?? Math.round(fps * 0.35);
  const local = frame - win.startFrame;
  return { ...phaseAt(local, win.durationInFrames, enterFrames, exitFrames), localFrame: local, fps };
}
