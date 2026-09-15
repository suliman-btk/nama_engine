import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../components/theme";

/**
 * The stage the whole lesson sits on. Its job is that the frame is NEVER empty black:
 * whenever the presenter shrinks out of full-bleed, this is what the vacated space
 * becomes.
 *
 * It is the presenter's own footage — scaled up, heavily blurred and washed with brand
 * navy. That keeps the real room visible behind the graphics (the shot stays continuous
 * rather than the background being "removed"), gives cards something to sit on with enough
 * contrast to stay readable, and costs nothing extra to produce since it reuses the one
 * video layer we already have.
 *
 * `intensity` is how present the stage is: 0 while the presenter is full-bleed (the sharp
 * video covers it anyway), 1 once the presenter has moved aside.
 */
export function Stage({ videoSrc, intensity }: { videoSrc: string; intensity: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // While the presenter is full-bleed the stage is completely hidden behind it, so mounting
  // a second video layer would decode and blur an entire 1080p frame that nobody can see.
  // Skipping it there is the single biggest saving in the render: roughly half the frames in
  // a typical lesson are full-bleed.
  if (intensity < 0.01) {
    return <AbsoluteFill style={{ backgroundColor: theme.colors.deep }} />;
  }

  // Very slow drift so the backdrop is never a dead still image behind a static card.
  const t = frame / fps;
  const drift = Math.sin(t * 0.09) * 1.2;
  const driftY = Math.cos(t * 0.07) * 0.8;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.deep }}>
      <AbsoluteFill style={{ opacity: intensity, overflow: "hidden" }}>
        {/* Painted at a quarter size and scaled back up, rather than blurred at full res.
            The result is visually identical once blurred — but a blur costs time
            proportional to the area it covers, so this is roughly 16x cheaper per frame than
            the same effect applied at 1920x1080. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "25%",
            height: "25%",
            transformOrigin: "top left",
            transform: `scale(4) scale(1.28) translate(${drift}%, ${driftY}%)`,
            filter: "blur(7px) saturate(0.9) brightness(0.62)",
          }}
        >
          <OffthreadVideo
            src={videoSrc}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        {/* brand wash: pulls the blurred room toward navy so cream text always clears contrast */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(115deg, ${theme.colors.deep}D6 0%, ${theme.colors.navy}B8 45%, ${theme.colors.mid}8A 100%)`,
          }}
        />
        {/* vignette, so the eye settles on the card and the presenter rather than the edges */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(125% 90% at 38% 46%, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        {/* a single gold hairline: the only piece of persistent brand furniture on the stage */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            background: `linear-gradient(90deg, ${theme.colors.gold} 0%, rgba(207,173,58,0) 62%)`,
            opacity: interpolate(intensity, [0, 1], [0, 0.85]),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
