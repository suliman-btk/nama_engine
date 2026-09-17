import { parseEdl, type Edl, type EdlInput } from "../edl/schema";

const LABEL = "ACT · Lesson 5";

/**
 * Lesson 5 EDL — "The Leadership Compass," closing Unit 1.
 *
 * Follows the video's own spoken narration, not the originally-supplied scene document — the
 * two disagreed from the opening line on (see lessons/lesson-05/review-notes.md, same kind of
 * mismatch as Lesson 4). Every graphic below anchors to a verbatim phrase from
 * lessons/lesson-05/input/pure-script.md, checked against the real word-timing track built
 * from the video's own caption cues (no per-scene clip joins to offset — this master is one
 * continuous take, `sourceCutSeconds: []`).
 *
 * House grammar per docs/act-engine-lesson-procedure.md: PresenterFull is the default with
 * nothing to show; PresenterLeft/Right when a slide is up; every side change passes through a
 * full-bleed beat of at least ~2s (the layout spring alone is 0.85s each way) — every `*-beat`
 * scene below is sized for that, trimming the preceding slide's end a beat early rather than
 * letting two slides touch.
 *
 * The compass itself is drawn (`LeadershipCompassDiagram`, added to the engine for this
 * lesson) rather than shown as the official deck's slide-89 screenshot — narration names one
 * direction at a time, so `activeId` tracks which arm the narration is currently on. East and
 * West get their own scenes (not one scene with two chained events, which the checker's
 * anchor resolver does not currently handle) so each can flip screen side too.
 */
const lesson05EdlInput: EdlInput = {
  lessonId: "lesson-05",
  title: "The Leadership Compass",
  fps: 30,
  width: 1920,
  height: 1080,
  avatarVideoSrc: "avatar/lesson-05-master.mp4",
  sourceCutSeconds: [],
  scenes: [
    {
      sceneId: "s1-open",
      start: { atSeconds: 0 },
      end: { atPhrase: "Which strengths appeared more than once" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "clean-cut",
      events: [],
    },
    {
      sceneId: "s1-feedback-q",
      start: { atPhrase: "Which strengths appeared more than once" },
      end: { atSeconds: 21.84 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "feedback-questions",
          anchor: { atPhrase: "Which strengths appeared more than once" },
          endAnchor: { atSeconds: 21.84 },
          action: "show",
          component: "QuestionSlide",
          props: {
            kicker: "Before the compass",
            questions: ["Which strengths appeared more than once?", "Which answer surprised you?"],
            askAtSeconds: [6.24, 9.24],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s1-beat",
      start: { atSeconds: 21.84 },
      end: { atPhrase: "Today, we will organize" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s2-model",
      start: { atPhrase: "Today, we will organize" },
      end: { atSeconds: 40.6 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "model-intro",
          anchor: { atPhrase: "Today, we will organize" },
          endAnchor: { atSeconds: 40.8 },
          action: "show",
          component: "StatementSlide",
          props: {
            kicker: "A simple leadership model",
            headline: "Not a box — a way to understand how people naturally approach tasks, decisions and relationships.",
            variant: "bar",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s2-beat",
      start: { atSeconds: 40.6 },
      end: { atPhrase: "Picture two lines crossing" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s2-compass-intro",
      start: { atPhrase: "Picture two lines crossing" },
      end: { atSeconds: 84.5 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "compass-intro",
          anchor: { atPhrase: "Picture two lines crossing" },
          endAnchor: { atSeconds: 84.5 },
          action: "show",
          component: "LeadershipCompassDiagram",
          props: { eyebrow: "The leadership compass" },
        },
      ],
    },
    {
      sceneId: "s2-beat2",
      start: { atSeconds: 84.5 },
      end: { atPhrase: "North is the fast task focused direction" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s3-north",
      start: { atPhrase: "North is the fast task focused direction" },
      end: { atSeconds: 124.2 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "compass-north",
          anchor: { atPhrase: "North is the fast task focused direction" },
          endAnchor: { atSeconds: 124.4 },
          action: "show",
          component: "LeadershipCompassDiagram",
          props: { activeId: "north", eyebrow: "The leadership compass" },
        },
      ],
    },
    {
      sceneId: "s3-beat",
      start: { atSeconds: 124.2 },
      end: { atPhrase: "South is more people focused and patient" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s3-south",
      start: { atPhrase: "South is more people focused and patient" },
      end: { atSeconds: 149.7 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "compass-south",
          anchor: { atPhrase: "South is more people focused and patient" },
          endAnchor: { atSeconds: 149.9 },
          action: "show",
          component: "LeadershipCompassDiagram",
          props: { activeId: "south", eyebrow: "The leadership compass" },
        },
      ],
    },
    {
      sceneId: "s3-beat2",
      start: { atSeconds: 149.7 },
      end: { atPhrase: "East is the detail focused direction" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s4-east",
      start: { atPhrase: "East is the detail focused direction" },
      end: { atSeconds: 170.3 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "compass-east",
          anchor: { atPhrase: "East is the detail focused direction" },
          endAnchor: { atSeconds: 170.3 },
          action: "show",
          component: "LeadershipCompassDiagram",
          props: { activeId: "east", eyebrow: "The leadership compass" },
        },
      ],
    },
    {
      sceneId: "s4-mid-beat",
      start: { atSeconds: 170.3 },
      end: { atPhrase: "West is the creative and adventurous direction" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s4-west",
      start: { atPhrase: "West is the creative and adventurous direction" },
      end: { atSeconds: 193.0 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "compass-west",
          anchor: { atPhrase: "West is the creative and adventurous direction" },
          endAnchor: { atSeconds: 193.0 },
          action: "show",
          component: "LeadershipCompassDiagram",
          props: { activeId: "west", eyebrow: "The leadership compass" },
        },
      ],
    },
    {
      sceneId: "s4-beat",
      start: { atSeconds: 193.0 },
      end: { atPhrase: "Put all four directions together" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s5-together",
      start: { atPhrase: "Put all four directions together" },
      end: { atSeconds: 214.9 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "compass-together",
          anchor: { atPhrase: "Put all four directions together" },
          endAnchor: { atSeconds: 214.9 },
          action: "show",
          component: "LeadershipCompassDiagram",
          props: { eyebrow: "All four, together" },
        },
      ],
    },
    {
      sceneId: "s5-beat",
      start: { atSeconds: 214.9 },
      end: { atPhrase: "The curriculum also warns us not to turn the compass into a cage" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s5-cage",
      start: { atPhrase: "The curriculum also warns us not to turn the compass into a cage" },
      end: { atSeconds: 247.7 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "not-a-cage",
          anchor: { atPhrase: "The curriculum also warns us not to turn the compass into a cage" },
          endAnchor: { atSeconds: 247.9 },
          action: "show",
          component: "StatementSlide",
          props: {
            kicker: "Don't turn it into a label",
            headline: "Not a cage. The same person may lead differently at home, at work, or with friends.",
            variant: "bar",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s5-beat2",
      start: { atSeconds: 247.7 },
      end: { atPhrase: "Self-awareness means recognizing your pattern" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s5-key",
      start: { atPhrase: "Self-awareness means recognizing your pattern" },
      end: { atSeconds: 257.4 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "self-awareness-key",
          anchor: { atPhrase: "Self-awareness means recognizing your pattern" },
          endAnchor: { atSeconds: 257.6 },
          action: "show",
          component: "KeyStatement",
          props: {
            text: "Self-awareness means recognizing your pattern, noticing its impact, and adapting when the people around you need something different.",
          },
        },
      ],
    },
    {
      sceneId: "s6-beat",
      start: { atSeconds: 257.4 },
      end: { atPhrase: "Now, apply the compass to a real decision" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s6-activity",
      start: { atPhrase: "Now, apply the compass to a real decision" },
      end: { atSeconds: 278.5 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "apply-activity",
          anchor: { atPhrase: "Now, apply the compass to a real decision" },
          endAnchor: { atSeconds: 278.5 },
          action: "show",
          component: "ActivitySlide",
          props: {
            kicker: "Your turn",
            title: "Apply the compass",
            steps: [
              "A community project suddenly has a problem.",
              "The deadline is close, one teammate is upset, details are missing, the plan isn't working.",
              "Pause the video and decide which leadership strength you'd call on first.",
            ],
            pauseNote: "Pause the video",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s6-mid-beat",
      start: { atSeconds: 278.5 },
      end: { atSeconds: 280.5 },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s6-quickfire",
      start: { atSeconds: 280.5 },
      end: { atSeconds: 290.78 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "quickfire-directions",
          anchor: { atSeconds: 280.5 },
          endAnchor: { atSeconds: 290.78 },
          action: "show",
          component: "ScenarioSequence",
          props: {
            eyebrow: "Which strength leads first?",
            items: [
              { n: 1, text: "North might push for a decision." },
              { n: 2, text: "South might address the relationship." },
              { n: 3, text: "East might examine the missing details." },
              { n: 4, text: "West might generate a new approach." },
            ],
            revealAtSeconds: [280.821, 283.141, 285.243, 287.941],
          },
        },
      ],
    },
    {
      sceneId: "s6-beat2",
      start: { atSeconds: 290.78 },
      end: { atPhrase: "This closes unit one" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s7-close",
      start: { atPhrase: "This closes unit one" },
      end: { atSeconds: 317.7 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "unit-close-statement",
          anchor: { atPhrase: "This closes unit one" },
          endAnchor: { atSeconds: 317.7 },
          action: "show",
          component: "StatementSlide",
          props: {
            kicker: "Closing Unit 1",
            headline: "Everything so far has been answering one question: who am I?",
            variant: "centred",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s7-beat",
      start: { atSeconds: 317.7 },
      end: { atPhrase: "The source ends this unit with an important decision" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s7-question",
      start: { atPhrase: "The source ends this unit with an important decision" },
      end: { atSeconds: 340.7 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "mature-leadership-question",
          anchor: { atPhrase: "The source ends this unit with an important decision" },
          endAnchor: { atSeconds: 340.7 },
          action: "show",
          component: "QuestionSlide",
          props: {
            kicker: "Mature leadership",
            questions: [
              "Ready to lead when your abilities fit the mission — and ready to step back when someone else is better suited?",
            ],
            askAtSeconds: [319.732],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s7-beat2",
      start: { atSeconds: 340.7 },
      end: { atPhrase: "In the next lesson, act turns outward" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s8-outro",
      start: { atPhrase: "In the next lesson, act turns outward" },
      end: { atSeconds: 356.961 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "unit2-outro",
          anchor: { atPhrase: "In the next lesson, act turns outward" },
          endAnchor: { atSeconds: 356.961 },
          action: "show",
          component: "OutroSlide",
          props: {
            kicker: "That's Unit 1",
            title: "Unit 2 begins: who are others?",
            points: [
              "You explored your identity, your strengths, and how you naturally lead.",
              "Next: the roles people play, and how those roles form communities.",
            ],
            next: "Lesson 6 — Who Are Others?",
            lessonLabel: LABEL,
          },
        },
      ],
    },
  ],
};

export const lesson05Edl: Edl = parseEdl(lesson05EdlInput);
