import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useBrand, useCourseConfig, useTheme } from "../course/CourseContext";
import type { EdlScene } from "../edl/schema";
import { LAYOUTS } from "../presenter/layoutConfig";

function findSceneIndex(scenes: EdlScene[], t: number): number {
  for (let i = scenes.length - 1; i >= 0; i--) {
    if ((scenes[i].start.atSeconds ?? 0) <= t) return i;
  }
  return 0;
}

/**
 * The course brand mark, on screen for the WHOLE video.
 *
 * Automatically detects whether the current scene is full-bleed presenter footage
 * or a light slide background:
 *  - On white/light slide backgrounds: displays the official colored logo (`watermarkLogoColored`, e.g. nama-logo.png).
 *  - On full-bleed presenter footage: displays the white logo (`watermarkLogo`, e.g. nama-logo-white.png) with drop shadow.
 */
export function BrandWatermark({
  size = 138,
  opacity = 0.98,
  scenes,
}: {
  size?: number;
  opacity?: number;
  scenes?: EdlScene[];
}) {
  const brand = useBrand();
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let isFullBleed = false;
  let isRedSlide = false;
  if (scenes && scenes.length > 0) {
    const idx = findSceneIndex(scenes, t);
    const scene = scenes[idx];
    if (scene) {
      const layout = LAYOUTS[scene.avatar.layout];
      isFullBleed = layout?.fullBleed ?? false;
      for (const ev of scene.events) {
        const props = (ev as any).props;
        if (props) {
          if (
            props.themeMode === "brand" ||
            props.themeMode === "dark" ||
            props.variant === "brand" ||
            props.redBg === true ||
            (Boolean(props.bg) && (props.bg === "#A02828" || props.bg === theme.colors.mid || props.bg === theme.colors.gold))
          ) {
            isRedSlide = true;
          }
        }
      }
    }
  }

  // When not full bleed, not a red slide, and the surface is white/light, use the colored logo
  const isLightBg = !isFullBleed && !isRedSlide && (theme.colors.surface === "#FFFFFF" || theme.colors.surface.startsWith("#F"));
  const logoFile = isLightBg
    ? (brand.watermarkLogoColored || "nama-logo.png")
    : (brand.watermarkLogo || "nama-logo-white.png");

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 34,
          right: 52,
          width: size,
          opacity,
          filter: isLightBg
            ? "drop-shadow(0 2px 6px rgba(0,0,0,0.06))"
            : "drop-shadow(0 6px 20px rgba(0,0,0,0.65))",
        }}
      >
        <Img
          src={staticFile(`brand/${logoFile}`)}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
}
