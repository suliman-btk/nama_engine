import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../components/theme";

/**
 * The gold baseline, drawn at the very top of the composition so it runs the FULL width of the
 * frame — across the presenter as well as the slide.
 *
 * It used to live inside SlideFrame, which put it underneath the presenter layer: the rule ran
 * along the bottom of the slide and then simply stopped where the video panel began, and it
 * disappeared entirely on full-bleed shots where there is no slide at all. Mounted here it is
 * one continuous line under the whole picture, which is what makes it read as the frame of the
 * video rather than a decoration on one half of it.
 */
export function GoldBaseline({ height = 8 }: { height?: number }) {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height,
          background: theme.colors.gold,
        }}
      />
    </AbsoluteFill>
  );
}
