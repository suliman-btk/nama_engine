import { parseEdl, type Edl, type EdlInput } from "../edl/schema";

const LABEL = "ACT \u00b7 Lesson 8";

/**
 * Lesson 8 EDL.
 *
 * REBUILT after client feedback (Ghani, Sep 12) on the first render. The original cut kept the
 * presenter in a small bottom-right corner box for 22 of its 24 scenes, with a slide on screen
 * essentially the whole runtime. The note was: make the speaker bigger, and only bring text up
 * when there is text to show.
 *
 * So the grammar here is two states and nothing else:
 *   - PresenterFull  - he owns the frame, no slide. This is the default.
 *   - PresenterRight - he drops to half the frame and a slide takes the other half.
 * The presenter springs between the two on its own (PresenterLayer), so the shrink IS the
 * transition: scene changes inside a section are "clean-cut" and let that move carry them.
 * Designed transitions are kept for the nine real section boundaries.
 *
 * Anchors: every graphic STARTS on a verbatim phrase from pure-script.md, verified against the
 * real word-timing track. Graphic END / gap boundaries may use atSeconds - those are pacing
 * choices (how long he sits full-bleed), not content cues, so they carry no meaning to drift.
 *
 * Note: StatementSlide variant "split" is deliberately NOT used any more. Its gold column
 * starts content at 520px, which collides with a half-frame presenter.
 */
const lesson08EdlInput: EdlInput = {
  lessonId: "lesson-08",
  title: "Defining a Social Issue Clearly",
  fps: 30,
  width: 1920,
  height: 1080,
  avatarVideoSrc: "avatar/lesson-08-master.mp4",
  sourceCutSeconds: [39.868, 81.458, 120.416, 164.124, 204.494, 242.832, 286.7075, 328.248],
  scenes: [
    {
      sceneId: "s1-open",
      start: { atSeconds: 0 },
      end: { atPhrase: "Think about a problem you see around you" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "clean-cut",
      events: [],
    },
    {
      sceneId: "s1-hook",
      start: { atPhrase: "Think about a problem you see around you" },
      end: { atSeconds: 11.5 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "hook-question",
          anchor: { atPhrase: "Think about a problem you see around you" },
          action: "show",
          component: "QuestionSlide",
          props: {
            kicker: "Unit 3 · Social Issues",
            questions: ["What problem do you see around you?"],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s1-beat",
      start: { atSeconds: 11.5 },
      end: { atPhrase: "A social issue is simply a problem" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s1-def",
      start: { atPhrase: "A social issue is simply a problem" },
      end: { atSeconds: 24.5 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "social-issue-def",
          anchor: { atPhrase: "A social issue is simply a problem" },
          action: "show",
          component: "StatementSlide",
          props: {
            headline: "A problem affecting a community, large or small.",
            kicker: "Social issue",
            variant: "bar",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s1-beat2",
      start: { atSeconds: 24.5 },
      end: { atPhrase: "what is happening, who is affected" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s1-q4",
      start: { atPhrase: "what is happening, who is affected" },
      end: { atSeconds: 39.868 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "four-questions",
          anchor: { atPhrase: "what is happening, who is affected" },
          action: "show",
          component: "ChecklistSlide",
          props: {
            kicker: "Ask yourself",
            title: "Four questions to start with",
            items: [
              "What is happening?",
              "Who is affected?",
              "Where is it happening?",
              "Is it getting better, worse, or staying the same?",
            ],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s2-open",
      start: { atSeconds: 39.868 },
      end: { atPhrase: "lions were attacking livestock" },
      avatar: { layout: "PresenterClose", camera: "medium" },
      transitionIn: "section-reveal",
      events: [],
    },
    {
      sceneId: "s2-case",
      start: { atPhrase: "lions were attacking livestock" },
      end: { atSeconds: 52.0 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "lion-case",
          anchor: { atPhrase: "lions were attacking livestock" },
          action: "show",
          component: "StatementSlide",
          props: {
            headline: "A young man faced lions attacking his community’s livestock.",
            kicker: "Case example",
            variant: "bar",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s2-beat",
      start: { atSeconds: 52.0 },
      end: { atPhrase: "Pause here and watch" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s2-video",
      start: { atPhrase: "Pause here and watch" },
      end: { atPhrase: "notice what changed" },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "lion-video-link",
          anchor: { atPhrase: "Pause here and watch" },
          action: "show",
          component: "VideoLinkSlide",
          props: {
            kicker: "Pause here",
            title: "My Invention That Made Peace With Lions",
            note: "Pause here and watch, then come back and press play.",
            url: "https://www.youtube.com/watch?v=RAoo--SeUIk",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s2-notice",
      start: { atPhrase: "notice what changed" },
      end: { atPhrase: "is not enough by itself" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s2-key",
      start: { atPhrase: "is not enough by itself" },
      end: { atSeconds: 77.5 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "effort-key",
          anchor: { atPhrase: "is not enough by itself" },
          action: "show",
          component: "KeyStatement",
          props: {
            text: "Effort. Understanding. Adaptation.",
          },
        },
      ],
    },
    {
      sceneId: "s2-close",
      start: { atSeconds: 77.5 },
      end: { atSeconds: 81.458 },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s3-open",
      start: { atSeconds: 81.458 },
      end: { atPhrase: "Look at the problems you noticed before" },
      avatar: { layout: "PresenterClose", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [],
    },
    {
      sceneId: "s3-look",
      start: { atPhrase: "Look at the problems you noticed before" },
      end: { atSeconds: 92.0 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "choose-issue",
          anchor: { atPhrase: "Look at the problems you noticed before" },
          action: "show",
          component: "StatementSlide",
          props: {
            headline: "Look back at the problems you noticed before choosing one.",
            kicker: "From lesson 7",
            variant: "bar",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s3-beat",
      start: { atSeconds: 92.0 },
      end: { atPhrase: "Ask yourself" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s3-crit",
      start: { atPhrase: "Ask yourself" },
      end: { atPhrase: "Pick one issue and write it down" },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "choose-wisely",
          anchor: { atPhrase: "Ask yourself" },
          action: "show",
          component: "ChecklistSlide",
          props: {
            kicker: "Choose wisely",
            title: "Ask yourself",
            items: [
              "Who is affected by this?",
              "Can I find useful information about it?",
              "Do I want to stay with this issue for the next few lessons?",
            ],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s3-key",
      start: { atPhrase: "Pick one issue and write it down" },
      end: { atSeconds: 120.416 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "crossfade",
      events: [
        {
          id: "pick-one-key",
          anchor: { atPhrase: "Pick one issue and write it down" },
          action: "show",
          component: "KeyStatement",
          props: {
            text: "Pick one issue and write it down.",
          },
        },
      ],
    },
    {
      sceneId: "s4-open",
      start: { atSeconds: 120.416 },
      end: { atPhrase: "answers five simple things" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s4-form",
      start: { atPhrase: "answers five simple things" },
      end: { atSeconds: 138.0 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "five-part-formula",
          anchor: { atPhrase: "answers five simple things" },
          action: "show",
          component: "ActivitySlide",
          props: {
            kicker: "The formula",
            title: "A strong issue statement answers five simple things",
            steps: [
              "What is changing? (increasing, decreasing, spreading, or steady)",
              "What exactly is the problem?",
              "Who is affected?",
              "Where is it happening?",
              "When is it happening, if time matters",
            ],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s4-beat",
      start: { atSeconds: 138.0 },
      end: { atPhrase: "Compare these two" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s4-comp",
      start: { atPhrase: "Compare these two" },
      end: { atPhrase: "much more direction for research" },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "compare-two",
          anchor: { atPhrase: "Compare these two" },
          action: "show",
          component: "StatementSlide",
          props: {
            headline: "“Smoking is a problem” vs. “Smoking is increasing among teenagers in this area.”",
            kicker: "Compare",
            variant: "centred",
            emphasize: ["increasing"],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s4-key",
      start: { atPhrase: "much more direction for research" },
      end: { atSeconds: 164.124 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "crossfade",
      events: [
        {
          id: "direction-key",
          anchor: { atPhrase: "much more direction for research" },
          action: "show",
          component: "KeyStatement",
          props: {
            text: "A clear statement gives your research direction.",
          },
        },
      ],
    },
    {
      sceneId: "s5-turn",
      start: { atSeconds: 164.124 },
      end: { atPhrase: "The increase in the number of high school dropouts" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [],
    },
    {
      sceneId: "s5-ex",
      start: { atPhrase: "The increase in the number of high school dropouts" },
      end: { atSeconds: 178.0 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      reviewRequired: "Carry whisperVocabHint: 'Jeddah' into any re-transcription of scene-005 footage.",
      events: [
        {
          id: "worked-example",
          anchor: { atPhrase: "The increase in the number of high school dropouts" },
          action: "show",
          component: "StatementSlide",
          props: {
            headline: "The increase in the number of high school dropouts in Jeddah in 2015",
            kicker: "Worked example",
            variant: "bar",
            emphasize: ["increase", "dropouts", "Jeddah", "2015"],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s5-beat",
      start: { atSeconds: 178.0 },
      end: { atPhrase: "A clear sentence makes the next steps easier" },
      avatar: { layout: "PresenterClose", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s5-key",
      start: { atPhrase: "A clear sentence makes the next steps easier" },
      end: { atSeconds: 199.0 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "clear-sentence-key",
          anchor: { atPhrase: "A clear sentence makes the next steps easier" },
          action: "show",
          component: "KeyStatement",
          props: {
            text: "A clear sentence makes the next steps easier.",
          },
        },
      ],
    },
    {
      sceneId: "s5-close",
      start: { atSeconds: 199.0 },
      end: { atSeconds: 204.494 },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s6-write",
      start: { atSeconds: 204.494 },
      end: { atPhrase: "when it happens if that matters" },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "crossfade",
      events: [
        {
          id: "write-your-own",
          anchor: { atSeconds: 204.494 },
          action: "show",
          component: "ActivitySlide",
          props: {
            kicker: "Your turn",
            title: "Write your own issue statement",
            steps: ["What is changing", "What the problem is", "Who is affected", "Where it happens", "When it happens, if that matters"],
            pauseNote: "Pause here and write one clear issue statement.",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s6-beat",
      start: { atPhrase: "when it happens if that matters" },
      end: { atPhrase: "read it again as if someone else wrote it" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s6-check",
      start: { atPhrase: "read it again as if someone else wrote it" },
      end: { atSeconds: 226.0 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "self-check",
          anchor: { atPhrase: "read it again as if someone else wrote it" },
          action: "show",
          component: "ChecklistSlide",
          props: {
            kicker: "Self-check",
            title: "Read it again as if someone else wrote it",
            items: [
              "Would you understand the problem from that one sentence?",
              "Is anything too broad?",
              "Is anything missing?",
            ],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s6-beat2",
      start: { atSeconds: 226.0 },
      end: { atPhrase: "A good issue statement gives your research a direction" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s6-key",
      start: { atPhrase: "A good issue statement gives your research a direction" },
      end: { atSeconds: 240.0 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "clear-direction-key",
          anchor: { atPhrase: "A good issue statement gives your research a direction" },
          action: "show",
          component: "KeyStatement",
          props: {
            text: "Clear issue = clearer direction.",
            emphasize: ["Clear", "clearer"],
          },
        },
      ],
    },
    {
      sceneId: "s6-turn",
      start: { atSeconds: 240.0 },
      end: { atSeconds: 242.832 },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s7-steps",
      start: { atSeconds: 242.832 },
      end: { atSeconds: 256.0 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [
        {
          id: "research-steps",
          anchor: { atSeconds: 242.832 },
          action: "show",
          component: "ActivitySlide",
          props: {
            kicker: "Research",
            title: "Learn more about the issue",
            steps: [
              "Find out how it affects people",
              "Consider what may happen if nothing changes",
              "Use reliable websites, reports, and local information",
              "Talk with people who understand the situation",
            ],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s7-beat",
      start: { atSeconds: 256.0 },
      end: { atPhrase: "you want to take photos, be respectful" },
      avatar: { layout: "PresenterClose", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s7-eth",
      start: { atPhrase: "you want to take photos, be respectful" },
      end: { atSeconds: 271.0 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "be-respectful",
          anchor: { atPhrase: "you want to take photos, be respectful" },
          action: "show",
          component: "StatementSlide",
          props: {
            headline: "Ask permission before photographing or sharing identifiable people.",
            kicker: "Be respectful",
            variant: "bar",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s7-beat2",
      start: { atSeconds: 271.0 },
      end: { atPhrase: "Change your understanding instead of forcing the facts to fit it" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s7-key",
      start: { atPhrase: "Change your understanding instead of forcing the facts to fit it" },
      end: { atSeconds: 286.7075 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "challenge-assumptions-key",
          anchor: { atPhrase: "Change your understanding instead of forcing the facts to fit it" },
          action: "show",
          component: "KeyStatement",
          props: {
            text: "Good research should challenge your assumptions.",
          },
        },
      ],
    },
    {
      sceneId: "s8-turn",
      start: { atSeconds: 286.7075 },
      end: { atPhrase: "keep your notes simple" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [],
    },
    {
      sceneId: "s8-notes",
      start: { atPhrase: "keep your notes simple" },
      end: { atSeconds: 296.0 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "keep-notes-simple",
          anchor: { atPhrase: "keep your notes simple" },
          action: "show",
          component: "ActivitySlide",
          props: {
            kicker: "One-page summary",
            title: "Keep your research notes simple",
            steps: ["What the issue is", "Who it affects", "How it affects them", "The strongest information you found"],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s8-beat",
      start: { atSeconds: 296.0 },
      end: { atPhrase: "your original issue statement is too wide or not quite right" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s8-rev",
      start: { atPhrase: "your original issue statement is too wide or not quite right" },
      end: { atPhrase: "Good research should make your thinking clearer" },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "revise-if-needed",
          anchor: { atPhrase: "your original issue statement is too wide or not quite right" },
          action: "show",
          component: "StatementSlide",
          props: {
            headline: "It’s normal to revise your issue statement as you learn more.",
            kicker: "Revise if needed",
            variant: "bar",
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s8-key",
      start: { atPhrase: "Good research should make your thinking clearer" },
      end: { atSeconds: 313.0 },
      avatar: { layout: "PresenterLeft", camera: "medium" },
      transitionIn: "crossfade",
      events: [
        {
          id: "clearer-not-longer-key",
          anchor: { atPhrase: "Good research should make your thinking clearer" },
          action: "show",
          component: "KeyStatement",
          props: {
            text: "Good research should make your thinking clearer, not just longer.",
            emphasize: ["clearer"],
          },
        },
      ],
    },
    {
      sceneId: "s8-close",
      start: { atSeconds: 313.0 },
      end: { atSeconds: 328.248 },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },
    {
      sceneId: "s9-open",
      start: { atSeconds: 328.248 },
      end: { atPhrase: "one issue you want to work on" },
      avatar: { layout: "PresenterClose", camera: "medium" },
      transitionIn: "section-reveal",
      events: [],
    },
    {
      sceneId: "s9-recap",
      start: { atPhrase: "one issue you want to work on" },
      end: { atSeconds: 343.0 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "lesson-recap",
          anchor: { atPhrase: "one issue you want to work on" },
          action: "show",
          component: "LessonSummary",
          props: {
            title: "What you should have now",
            points: ["One issue you want to work on", "One clear issue statement", "Some useful research to understand it better"],
          },
        },
      ],
    },
    {
      sceneId: "s9-beat",
      start: { atSeconds: 343.0 },
      end: { atPhrase: "A problem tells you what is going wrong" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s9-bridge",
      start: { atPhrase: "A problem tells you what is going wrong" },
      end: { atPhrase: "In the next part" },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "problem-need-bridge",
          anchor: { atPhrase: "A problem tells you what is going wrong" },
          action: "show",
          component: "StatementSlide",
          props: {
            headline: "A problem tells you what is going wrong. A need tells you what would help.",
            kicker: "Problem → need",
            variant: "centred",
            emphasize: ["problem.", "need"],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s9-outro",
      start: { atPhrase: "In the next part" },
      end: { atSeconds: 371.031655 },
      avatar: { layout: "PresenterRight", camera: "medium" },
      transitionIn: "crossfade",
      events: [
        {
          id: "outro",
          anchor: { atPhrase: "In the next part" },
          action: "show",
          component: "OutroSlide",
          props: {
            kicker: "That’s lesson eight",
            title: "You now have a precise, researched issue statement.",
            points: [
              "You chose one real issue to work on.",
              "You wrote a precise issue statement.",
              "You did research and kept it simple.",
            ],
            next: "Understanding the real need",
            lessonLabel: LABEL,
          },
        },
      ],
    },
  ],
};

export const lesson08Edl: Edl = parseEdl(lesson08EdlInput);
