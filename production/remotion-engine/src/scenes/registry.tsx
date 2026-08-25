import React from "react";
import type { Scene, SceneLayout, AssetEntry } from "../lib/types";
import type { Side } from "../components/Cards";
import {
  StatementCard, QuoteCard, QuestionCard, PhotoCard, InsetPhotoCard,
  LogoShowcase, TitleCard, UnitSpotlight, ThreeZonesTable, FourUnitsRoadmap,
  ActivityPauseCard, WorksheetCard, VideoLinkCard, SummaryCard, OutroCard,
} from "../components/Cards";
import { ConceptCardScene } from "./ConceptCardScene";
import { BG } from "../lib/theme";

export type SceneComponentProps = {
  scene: Scene;
  index: number;
  side: Side;
  assets: Record<string, AssetEntry>;
  assetUrl: (id: string) => string | null;
};

const str = (d: unknown, k: string, fallback = "") =>
  (d && typeof d === "object" && typeof (d as any)[k] === "string" ? (d as any)[k] : fallback) as string;
const arr = <T,>(d: unknown, k: string): T[] =>
  (d && typeof d === "object" && Array.isArray((d as any)[k]) ? (d as any)[k] : []) as T[];
const num = (d: unknown, k: string): number | undefined =>
  (d && typeof d === "object" && typeof (d as any)[k] === "number" ? (d as any)[k] : undefined);

/** Anything below 1600px wide is shown inset at ~native size rather than
 *  full-bleed, so low-resolution source art never gets magnified into mush. */
const FULL_BLEED_MIN_WIDTH = 1600;
const BG_CYCLE = [BG.navyGrad, BG.navyGradAlt, BG.navySolid, BG.teal, BG.navyDeep];

const firstAsset = (scene: Scene, assets: Record<string, AssetEntry>) => {
  const id = scene.visual?.asset;
  return id ? assets[id] : undefined;
};

/**
 * Layout -> component. The engine dispatches on the scene's declared `layout`
 * and reads its `data`; it never inspects scene ids and holds no lesson content.
 */
export const SCENE_COMPONENTS: Record<SceneLayout, React.FC<SceneComponentProps>> = {
  title: ({ scene, side, assets, assetUrl }) => {
    const a = firstAsset(scene, assets);
    const url = scene.visual?.asset ? assetUrl(scene.visual.asset) : null;
    if (!a || !url) {
      return <StatementCard side={side} headline={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} variant={1} />;
    }
    return <TitleCard side={side} logoSrc={url} natural={[a.width, a.height]} caption={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />;
  },

  "section-divider": ({ scene, side }) => (
    <StatementCard side={side} headline={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} variant={2} />
  ),

  statement: ({ scene, index, side }) => (
    <StatementCard
      side={side}
      headline={scene.on_screen_text ?? ""}
      kicker={scene.section.replace(/-/g, " ")}
      variant={(num(scene.data, "variant") ?? index % 3) as 0 | 1 | 2}
      bg={BG_CYCLE[index % BG_CYCLE.length]}
      ornament={index}
    />
  ),

  quote: ({ scene, side }) => (
    <QuoteCard side={side} text={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />
  ),

  question: ({ scene, side }) => (
    <QuestionCard side={side} text={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />
  ),

  "concept-card": ConceptCardScene,
  definition: ConceptCardScene,
  comparison: ConceptCardScene,

  objectives: ({ scene, side }) => (
    <SummaryCard
      side={side}
      caption={str(scene.data, "title", scene.on_screen_text ?? "")}
      kicker={scene.section.replace(/-/g, " ")}
      points={arr<string>(scene.data, "items")}
    />
  ),

  "full-image": ({ scene, side, assets, assetUrl }) => {
    const a = firstAsset(scene, assets);
    const url = scene.visual?.asset ? assetUrl(scene.visual.asset) : null;
    if (!a || !url) return <StatementCard side={side} headline={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />;
    const treatment = scene.visual?.treatment ?? "auto";
    const fullBleed = treatment === "full-bleed" || (treatment === "auto" && a.width >= FULL_BLEED_MIN_WIDTH);
    return fullBleed ? (
      <PhotoCard side={side} src={url} caption={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} objectPosition={scene.visual?.focal} />
    ) : (
      <InsetPhotoCard side={side} src={url} natural={[a.width, a.height]} caption={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />
    );
  },

  "inset-image": ({ scene, side, assets, assetUrl }) => {
    const a = firstAsset(scene, assets);
    const url = scene.visual?.asset ? assetUrl(scene.visual.asset) : null;
    if (!a || !url) return <StatementCard side={side} headline={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />;
    return <InsetPhotoCard side={side} src={url} natural={[a.width, a.height]} caption={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />;
  },

  scenario: ({ scene, side, assets, assetUrl }) => {
    const a = firstAsset(scene, assets);
    const url = scene.visual?.asset ? assetUrl(scene.visual.asset) : null;
    if (!a || !url) return <QuestionCard side={side} text={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />;
    const fullBleed = a.width >= FULL_BLEED_MIN_WIDTH;
    return fullBleed ? (
      <PhotoCard side={side} src={url} caption={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />
    ) : (
      <InsetPhotoCard side={side} src={url} natural={[a.width, a.height]} caption={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />
    );
  },

  "logo-showcase": ({ scene, side, assets, assetUrl }) => {
    const ids = scene.visual?.assets ?? [];
    const logos = ids
      .map((id) => ({ a: assets[id], url: assetUrl(id) }))
      .filter((x) => x.a && x.url)
      .map((x) => ({ src: x.url as string, natural: [x.a.width, x.a.height] as [number, number] }));
    return <LogoShowcase side={side} logos={logos} caption={scene.on_screen_text ?? ""} kicker={scene.section.replace(/-/g, " ")} />;
  },

  diagram: ({ scene, side }) => (
    <ThreeZonesTable
      side={side}
      caption={scene.on_screen_text ?? ""}
      kicker={scene.section.replace(/-/g, " ")}
      rows={arr(scene.data, "rows")}
      columns={arr<string>(scene.data, "columns")}
      highlight={num(scene.data, "highlight")}
    />
  ),
  table: ({ scene, side }) => (
    <ThreeZonesTable
      side={side}
      caption={scene.on_screen_text ?? ""}
      kicker={scene.section.replace(/-/g, " ")}
      rows={arr(scene.data, "rows")}
      columns={arr<string>(scene.data, "columns")}
      highlight={num(scene.data, "highlight")}
    />
  ),

  process: ({ scene, side }) => (
    <FourUnitsRoadmap
      side={side}
      caption={scene.on_screen_text ?? ""}
      kicker={scene.section.replace(/-/g, " ")}
      steps={arr(scene.data, "steps")}
      highlight={num(scene.data, "highlight")}
    />
  ),
  roadmap: ({ scene, side }) => (
    <FourUnitsRoadmap
      side={side}
      caption={scene.on_screen_text ?? ""}
      kicker={scene.section.replace(/-/g, " ")}
      steps={arr(scene.data, "steps")}
      highlight={num(scene.data, "highlight")}
    />
  ),

  spotlight: ({ scene, side }) => (
    <UnitSpotlight
      side={side}
      kicker={scene.section.replace(/-/g, " ")}
      number={str(scene.data, "number")}
      title={str(scene.data, "title")}
      subtitle={str(scene.data, "subtitle")}
      iconIndex={num(scene.data, "icon_index") ?? 0}
    />
  ),

  activity: ({ scene, side }) => (
    <ActivityPauseCard
      side={side}
      caption={scene.on_screen_text ?? ""}
      sub={str(scene.data, "instruction", "Pause the video, then press play to continue")}
      kicker={scene.section.replace(/-/g, " ")}
    />
  ),

  worksheet: ({ scene, side }) => (
    <WorksheetCard
      side={side}
      caption={str(scene.data, "title", scene.on_screen_text ?? "")}
      kicker={scene.section.replace(/-/g, " ")}
      items={arr<string>(scene.data, "items")}
    />
  ),
  quiz: ({ scene, side }) => (
    <WorksheetCard
      side={side}
      caption={str(scene.data, "title", scene.on_screen_text ?? "")}
      kicker={scene.section.replace(/-/g, " ")}
      items={arr<string>(scene.data, "items")}
    />
  ),

  "external-video": ({ scene, side }) => (
    <VideoLinkCard
      side={side}
      caption={scene.on_screen_text ?? ""}
      kicker={scene.section.replace(/-/g, " ")}
      url={str(scene.data, "url")}
    />
  ),

  summary: ({ scene, side }) => (
    <SummaryCard
      side={side}
      caption={str(scene.data, "title", scene.on_screen_text ?? "")}
      kicker={scene.section.replace(/-/g, " ")}
      points={arr<string>(scene.data, "items")}
    />
  ),

  closing: ({ scene, side }) => (
    <OutroCard
      side={side}
      caption={scene.on_screen_text ?? ""}
      kicker={scene.section.replace(/-/g, " ")}
      next={str(scene.data, "next", "")}
    />
  ),
};

export const SceneRenderer: React.FC<SceneComponentProps> = (props) => {
  const Component = SCENE_COMPONENTS[props.scene.layout];
  if (!Component) {
    // eslint-disable-next-line no-console
    console.warn(`[engine] unknown layout "${props.scene.layout}" on ${props.scene.id}; falling back to statement`);
    return SCENE_COMPONENTS.statement(props);
  }
  return <Component {...props} />;
};
