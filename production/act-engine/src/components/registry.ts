import type { GraphicComponent } from "../edl/schema";
import { ThreeZoneDiagram } from "./ThreeZoneDiagram";
import { LeadershipCompassDiagram } from "./LeadershipCompassDiagram";
import { KeyStatement } from "./KeyStatement";
import { ScenarioSequence } from "./ScenarioSequence";
import { DefinitionCard } from "./DefinitionCard";
import { QuoteCard } from "./QuoteCard";
import { LessonSummary } from "./LessonSummary";
import { FourStepJourney } from "./FourStepJourney";
import { TitleSlide } from "../slides/TitleSlide";
import { StatementSlide } from "../slides/StatementSlide";
import { ActivitySlide } from "../slides/ActivitySlide";
import { ChecklistSlide } from "../slides/ChecklistSlide";
import { QuestionSlide } from "../slides/QuestionSlide";
import { VideoLinkSlide } from "../slides/VideoLinkSlide";
import { OutroSlide } from "../slides/OutroSlide";
import { PhotoGridSlide } from "../slides/PhotoGridSlide";
import { DiagramSlide } from "../slides/DiagramSlide";
import { CardGridSlide } from "../slides/CardGridSlide";
import { IconListSlide } from "../slides/IconListSlide";

/**
 * Maps the rule-4 component vocabulary to implementations. Only a first slice is built
 * (the six lesson-1 needs); the rest of the vocabulary (Timeline, ProcessFlow,
 * ComparisonCards, BeforeAfter, CycleDiagram, NumberedSteps, QuestionCard, BigNumber,
 * Checklist, WorksheetViewer) is reserved here — add them the same way as
 * lessons 2-20 need them, following the CardShell + theme pattern so new components stay
 * visually consistent instead of one-off per lesson (rule 4: "the renderer controls the
 * visual design," not a bespoke look per component).
 */
export const COMPONENT_REGISTRY: Partial<Record<GraphicComponent, React.ComponentType<any>>> = {
  ThreeZoneDiagram,
  LeadershipCompassDiagram,
  FourStepJourney,
  KeyStatement,
  ScenarioSequence,
  DefinitionCard,
  QuoteCard,
  LessonSummary,
  TitleSlide,
  StatementSlide,
  ActivitySlide,
  ChecklistSlide,
  QuestionSlide,
  VideoLinkSlide,
  OutroSlide,
  PhotoGridSlide,
  DiagramSlide,
  CardGridSlide,
  IconListSlide,
};

export function getComponent(name: GraphicComponent) {
  const C = COMPONENT_REGISTRY[name];
  if (!C) {
    throw new Error(
      `Component "${name}" is in the rule-4 vocabulary but has no implementation yet in components/registry.ts.`
    );
  }
  return C;
}

