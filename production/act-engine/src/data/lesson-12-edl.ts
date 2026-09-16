import { parseEdl, type Edl, type EdlInput } from "../edl/schema";

const LABEL = "ACT · Lesson 12";
type Scene = EdlInput["scenes"][number];
type Component = NonNullable<Scene["events"]>[number]["component"];

const pair = (n: number, start: number, end: number, phrase: string, side: "PresenterLeft" | "PresenterRight", component: Component, props: Record<string, unknown>): Scene[] => [
  { sceneId: `s${n}-open`, start: { atSeconds: start }, end: { atPhrase: phrase }, avatar: { layout: "PresenterFull", camera: "medium" }, transitionIn: n % 3 === 0 ? "mask-wipe" : n % 3 === 1 ? "scale-through" : "crossfade", events: [] },
  { sceneId: `s${n}-visual`, start: { atPhrase: phrase }, end: { atSeconds: end }, avatar: { layout: side, camera: "medium" }, transitionIn: side === "PresenterLeft" ? "soft-push-right" : "soft-push-left", events: [{ id: `visual-${n}`, anchor: { atPhrase: phrase }, action: "show", component, props: { ...props, lessonLabel: LABEL } }] },
];

const lesson12EdlInput: EdlInput = {
  lessonId: "lesson-12", title: "Make the Solution SMART and Stronger", fps: 30, width: 1920, height: 1080,
  avatarVideoSrc: "avatar/lesson-12-master.mp4",
  sourceCutSeconds: [40.4, 81.567, 121.333, 163.333, 203.633, 241.433, 280.7, 321.5, 362.667, 406.667],
  scenes: [
    ...pair(1, 0, 40.4, "A useful way to check", "PresenterRight", "ChecklistSlide", { kicker: "SMART goals", title: "Five checks for a clearer solution", items: ["S · Specific", "M · Measurable", "A · Attainable", "R · Relevant", "T · Timely"] }),
    ...pair(2, 40.4, 81.567, "A more specific version", "PresenterLeft", "StatementSlide", { kicker: "S · Specific", headline: "Action, topic, people, and place", emphasize: ["Action", "people", "place"], variant: "bar" }),
    ...pair(3, 81.567, 121.333, "Using the same example", "PresenterRight", "StatementSlide", { kicker: "M · Measurable", headline: "3 sessions · 200 students", emphasize: ["3", "200"], variant: "centred" }),
    ...pair(4, 121.333, 163.333, "R stands for Relevant", "PresenterLeft", "ChecklistSlide", { kicker: "A + R", title: "Attainable and realistic", items: ["Current ability and support", "Money, access, and time", "A goal that can work in the real world"] }),
    ...pair(5, 163.333, 203.633, "The awareness example", "PresenterRight", "StatementSlide", { kicker: "T · Timely", headline: "During the first semester", emphasize: ["first semester"], variant: "bar" }),
    ...pair(6, 203.633, 241.433, "Ask yourself: is it specific", "PresenterLeft", "ActivitySlide", { kicker: "Your turn", title: "Rewrite your solution with SMART", steps: ["Specific and measurable", "Attainable and realistic", "A clear time period"], pauseNote: "Improve the wording until it feels clear and possible" }),
    ...pair(7, 241.433, 280.7, "Imagine giving five people", "PresenterRight", "ChecklistSlide", { kicker: "A fresh angle", title: "One starting point, different ideas", items: ["One person sees a face", "Another sees a road", "Someone creates something different"] }),
    ...pair(8, 280.7, 321.5, "Pick three prompts", "PresenterLeft", "ActivitySlide", { kicker: "Creativity exercise", title: "Change how the solution is delivered", steps: ["Choose three prompts", "Try location, audience, partner, or media", "Keep the ideas that improve the solution"], pauseNote: "A fresh angle can reveal something useful" }),
    ...pair(9, 321.5, 362.667, "A creative idea is only helpful", "PresenterRight", "ChecklistSlide", { kicker: "Refine the idea", title: "Keep what strengthens the solution", items: ["Keep useful parts", "Combine ideas that work together", "Remove what weakens or confuses"] }),
    ...pair(10, 362.667, 406.667, "Community work can be similar", "PresenterLeft", "StatementSlide", { kicker: "Effect and influence", headline: "A useful action can spread beyond the first group", emphasize: ["spread", "first group"], variant: "bar" }),
    ...pair(11, 406.667, 455.552290, "Keep that final solution safe", "PresenterRight", "OutroSlide", { kicker: "Unit Three complete", title: "Your solution is ready to become a plan", takeaways: ["Planning", "Execution", "Sharing what happened"] }),
  ],
};

export const lesson12Edl: Edl = parseEdl(lesson12EdlInput);
