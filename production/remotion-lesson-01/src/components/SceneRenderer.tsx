import React from "react";
import { staticFile } from "remotion";
import type { Scene } from "../lib/types";
import { BG } from "../lib/theme";
import type { Side } from "./Cards";
import {
  StatementCard,
  QuoteCard,
  QuestionCard,
  PhotoCard,
  InsetPhotoCard,
  LogoShowcase,
  TitleCard,
  UnitSpotlight,
  ThreeZonesTable,
  FourUnitsRoadmap,
  ActivityPauseCard,
  WorksheetCard,
  VideoLinkCard,
  SummaryCard,
  OutroCard,
} from "./Cards";

/** Native pixel sizes — used to keep low-resolution art from being upscaled. */
const ASSETS: Record<string, { file: string; size: [number, number] }> = {
  "act-logo": { file: "act-logo.png", size: [660, 320] },
  "scenario-plane": { file: "scenario-plane.jpg", size: [1920, 1080] },
  "scenario-sharks": { file: "scenario-sharks.jpg", size: [1200, 800] },
  "scenario-crowd": { file: "scenario-crowd.jpg", size: [1170, 612] },
  "scenario-food": { file: "scenario-food.jpg", size: [771, 416] },
  "scenario-scales": { file: "scenario-scales.png", size: [516, 341] },
  "stadium-crowd-visual": { file: "scenario-crowd.jpg", size: [1170, 612] },
  "stock-summit": { file: "stock-summit.jpg", size: [1024, 768] },
};

/** Only genuinely large art is allowed to go full-bleed. */
const FULL_BLEED_MIN_WIDTH = 1600;

const SURVEY_ITEMS = [
  "I understand what ACT is and what it's for.",
  "I could name at least one of the four units.",
  'I know what the "challenge zone" means.',
  "I feel confident stepping outside my comfort zone.",
  "I'm excited to start this program.",
];

const SUMMARY_POINTS = [
  "You were welcomed into ACT — attitude cultivates transformation.",
  "You saw the four-unit journey you're about to walk.",
  "You set the ground rules for your own safe space.",
  "You met the three learning zones — and why growth lives in the challenge zone.",
];

/** Rotating background/ornament treatments so no two neighbours match. */
const BG_CYCLE = [BG.navyGrad, BG.navyGradAlt, BG.navySolid, BG.teal, BG.navyDeep];

export const SceneRenderer: React.FC<{ scene: Scene; index: number; side: Side }> = ({ scene, index, side }) => {
  const caption = scene.on_screen_text ?? "";
  const kicker = scene.section.replace(/-/g, " ");
  const id = scene.id;

  // ---- purpose-built layouts -------------------------------------------
  if (id === "scene-001") {
    const a = ASSETS["stock-summit"];
    return <InsetPhotoCard side={side} src={staticFile(`images/${a.file}`)} natural={a.size} caption={caption} kicker={kicker} />;
  }
  if (id === "scene-002") {
    const a = ASSETS["act-logo"];
    return <TitleCard side={side} logoSrc={staticFile(`images/${a.file}`)} natural={a.size} caption={caption} kicker={kicker} />;
  }
  if (id === "scene-005") {
    const a = ASSETS["act-logo"];
    return <TitleCard side={side} logoSrc={staticFile(`images/${a.file}`)} natural={a.size} caption={caption} kicker={kicker} />;
  }
  if (id === "scene-007") {
    return (
      <LogoShowcase side={side}
        caption={caption}
        kicker={kicker}
        logos={[
          { src: staticFile("images/org-logo-nama.jpg"), natural: [859, 618] },
          { src: staticFile("images/org-logo-nice.jpg"), natural: [490, 479] },
          { src: staticFile("images/org-logo-ghadan.png"), natural: [512, 512] },
        ]}
      />
    );
  }
  if (id === "scene-009" || id === "scene-014") return <FourUnitsRoadmap side={side} caption={caption} kicker={kicker} />;
  if (id === "scene-010") return <UnitSpotlight side={side} index={0} kicker={kicker} />;
  if (id === "scene-011") return <UnitSpotlight side={side} index={1} kicker={kicker} />;
  if (id === "scene-012") return <UnitSpotlight side={side} index={2} kicker={kicker} />;
  if (id === "scene-013") return <UnitSpotlight side={side} index={3} kicker={kicker} />;
  if (id === "scene-026" || id === "scene-027") return <ThreeZonesTable side={side} caption={caption} kicker={kicker} />;
  if (id === "scene-037") return <ThreeZonesTable side={side} caption={caption} kicker={kicker} highlight={1} />;
  if (id === "scene-025") return <WorksheetCard side={side} caption="Pre-Workshop Survey — rate yourself 1 to 5" kicker={kicker} items={SURVEY_ITEMS} />;
  if (id === "scene-018" || id === "scene-022" || id === "scene-034")
    return <ActivityPauseCard side={side} caption={caption} sub="Pause the video, then press play to continue" kicker={kicker} />;
  if (id === "scene-043") return <VideoLinkCard side={side} caption={caption} kicker={kicker} url="youtube.com/watch?v=jU4oA3kkAWU" />;
  if (id === "scene-049") return <SummaryCard side={side} caption="What you covered today" kicker={kicker} points={SUMMARY_POINTS} />;
  if (id === "scene-051") return <OutroCard side={side} caption={caption} kicker={kicker} next="Next: Who Am I?" />;

  // ---- image-backed scenes ---------------------------------------------
  const asset = scene.asset_id ? ASSETS[scene.asset_id] : undefined;
  if (asset) {
    const src = staticFile(`images/${asset.file}`);
    return asset.size[0] >= FULL_BLEED_MIN_WIDTH ? (
      <PhotoCard side={side} src={src} caption={caption} kicker={kicker} />
    ) : (
      <InsetPhotoCard side={side} src={src} natural={asset.size} caption={caption} kicker={kicker} />
    );
  }

  // ---- text scenes: pick a template by intent, vary by position ---------
  if (scene.visual_type === "quote") return <QuoteCard side={side} text={caption} kicker={kicker} />;
  if (scene.type === "reflection" || scene.visual_type === "question") return <QuestionCard side={side} text={caption} kicker={kicker} />;

  const variant = (index % 3) as 0 | 1 | 2;
  return (
    <StatementCard side={side}
      headline={caption}
      kicker={kicker}
      variant={variant}
      bg={BG_CYCLE[index % BG_CYCLE.length]}
      ornament={index}
    />
  );
};
