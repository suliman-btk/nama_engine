import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useBrand } from "../course/CourseContext";

/**
 * The course brand mark, on screen for the WHOLE video.
 *
 * It used to be drawn inside SlideFrame, which put it underneath the presenter layer — so once
 * the presenter became a panel it was hidden behind the video, and during full-bleed stretches
 * there was no slide to draw it at all. It is therefore mounted at the top of the composition,
 * above both the slides and the presenter, and owns no layout of its own.
 *
 * White artwork with a soft drop shadow so it survives both the flat navy slides and bright
 * footage behind it.
 *
 * The logo filename is read from the course config (`brand.watermarkLogo`), so different
 * courses can use different logos without editing engine code.
 */
export function BrandWatermark({ size = 150, opacity = 0.88 }: { size?: number; opacity?: number }) {
  const brand = useBrand();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 46,
          right: 74,
          width: size,
          opacity,
          filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.55))",
        }}
      >
        <Img src={staticFile(`brand/${brand.watermarkLogo}`)} style={{ width: "100%", display: "block" }} />
      </div>
    </AbsoluteFill>
  );
}
