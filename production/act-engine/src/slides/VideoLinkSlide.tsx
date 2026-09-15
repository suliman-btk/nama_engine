import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../components/theme";
import { useWindowPhase, type GraphicWindow } from "../components/useWindow";
import { SlideFrame, SlideBody, fadeUp } from "./SlideFrame";

/** The hand-off to an external film (the Koh Panyee story). Per the lesson's own licensing
 * decision the film is linked, never embedded — so this slide's job is to make the link and
 * the "pause here" instruction unmissable. */
export function VideoLinkSlide({
  window,
  title,
  note,
  url,
  kicker = "Watch this",
  lessonLabel,
}: {
  window: GraphicWindow;
  title: string;
  note?: string;
  url?: string;
  kicker?: string;
  lessonLabel?: string;
}) {
  const { phase, progress } = useWindowPhase(window);
  const frame = useCurrentFrame();
  if (phase === "before" || phase === "after") return null;
  const local = frame - window.startFrame;
  const slideOpacity = phase === "enter" ? progress : phase === "exit" ? 1 - progress : 1;
  const pulse = 0.75 + Math.sin(local / 10) * 0.25;

  return (
    <div style={{ opacity: slideOpacity }}>
      <SlideFrame
        kicker={kicker}
        lessonLabel={lessonLabel}
      >
        <SlideBody>
          <div style={{ ...fadeUp(local, 0, 12), display: "flex", alignItems: "center", gap: 22, marginBottom: 26 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 18,
                background: theme.colors.gold,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: pulse,
                flexShrink: 0,
              }}
            >
              <svg width="28" height="32" viewBox="0 0 28 32">
                <path d="M4 3 L24 16 L4 29 Z" fill={theme.colors.deep} />
              </svg>
            </div>
            <div
              style={{
                fontFamily: theme.headingFamily,
                fontWeight: theme.headingWeight,
                fontSize: 44,
                lineHeight: 1.15,
                color: theme.colors.cream,
              }}
            >
              {title}
            </div>
          </div>

          {note ? (
            <div style={{ ...fadeUp(local, 14, 12), color: theme.colors.inkDim, fontSize: 27, lineHeight: 1.45, maxWidth: 760 }}>
              {note}
            </div>
          ) : null}

          {url ? (
            <div
              style={{
                ...fadeUp(local, 24, 12),
                marginTop: 30,
                display: "inline-block",
                padding: "14px 24px",
                borderRadius: 12,
                border: `2px solid ${theme.colors.gold}`,
                color: theme.colors.goldLight,
                fontSize: 23,
                letterSpacing: 0.5,
                alignSelf: "flex-start",
              }}
            >
              {url}
            </div>
          ) : null}
        </SlideBody>
      </SlideFrame>
    </div>
  );
}
