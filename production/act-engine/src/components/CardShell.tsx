import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { MotionPreset } from "../edl/schema";
import { useWindowPhase, type GraphicWindow } from "./useWindow";
import { useTheme } from "../course/CourseContext";
import { SlideFrame, SlideBody } from "../slides/SlideFrame";

/**
 * The frame every diagram sits in — now a full slide, not a floating panel.
 *
 * Originally these were glass cards over the footage, which left them looking like a
 * different product from the title/activity/checklist slides: no kicker, no ACT mark, no
 * gold baseline, and a lot of empty blurred backdrop around them. Routing them through
 * SlideFrame means one visual system across the whole lesson, and the diagram gets the room
 * it needs instead of being squeezed into a column.
 */
export function CardShell({
  window,
  animation = "fade-rise",
  eyebrow,
  title,
  bg,
  children,
}: {
  /** Kept for source compatibility with the diagram components; slides are full-frame, so
   * side no longer positions anything. */
  side?: "left" | "right" | "center" | "full";
  window: GraphicWindow;
  animation?: MotionPreset;
  eyebrow?: string;
  title?: string;
  bg?: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (phase === "before" || phase === "after") return null;

  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;
  const rail = Math.min(1, Math.max(0, (frame - window.startFrame) / (fps * 0.5)));
  const railEase = 1 - Math.pow(1 - rail, 3);

  return (
    <div style={{ opacity: slideOpacity }}>
      <SlideFrame kicker={eyebrow} bg={bg}>
        <SlideBody>
          {title ? (
            <div
              style={{
                fontFamily: theme.headingFamily,
                fontWeight: theme.headingWeight,
                fontSize: 44,
                lineHeight: 1.15,
                color: theme.colors.cream,
                marginBottom: 26,
                opacity: railEase,
                transform: `translateY(${(1 - railEase) * 16}px)`,
              }}
            >
              {title}
            </div>
          ) : null}
          {children}
        </SlideBody>
      </SlideFrame>
    </div>
  );
}

/** Per-item stagger: 0..1 for item `index`. What makes a list visibly build. */
export function useStagger(window: GraphicWindow, index: number, delayEach = 0.16, riseFrames = 12) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = window.startFrame + (window.enterFrames ?? Math.round(fps * 0.45)) + index * delayEach * fps;
  const p = Math.min(1, Math.max(0, (frame - startFrame) / riseFrames));
  return 1 - Math.pow(1 - p, 3);
}
