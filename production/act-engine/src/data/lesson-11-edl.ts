import { parseEdl, type Edl, type EdlInput } from "../edl/schema";

const LABEL = "ACT · Lesson 11";
type Transition = EdlInput["scenes"][number]["transitionIn"];
const open = (sceneId: string, start: number, endPhrase: string, transitionIn: Transition = "clean-cut") => ({
  sceneId, start: { atSeconds: start }, end: { atPhrase: endPhrase },
  avatar: { layout: "PresenterFull" as const, camera: "medium" as const }, transitionIn, events: [],
});

const lesson11EdlInput: EdlInput = {
  lessonId: "lesson-11", title: "Choosing the Best-Fit Solution", fps: 30, width: 1920, height: 1080,
  avatarVideoSrc: "avatar/lesson-11-master.mp4",
  sourceCutSeconds: [35.267, 75.833, 117.167, 157.667, 199.2, 242.233, 281.5, 320.133],
  scenes: [
    open("s1-open", 0, "This is not about choosing"),
    { sceneId: "s1-filter", start: { atPhrase: "This is not about choosing" }, end: { atSeconds: 35.267 }, avatar: { layout: "PresenterRight", camera: "medium" }, transitionIn: "soft-push-left", events: [{ id: "filter", anchor: { atPhrase: "This is not about choosing" }, action: "show", component: "StatementSlide", props: { kicker: "Choose with a reason", headline: "Compare three ideas fairly", emphasize: ["Compare", "fairly"], variant: "bar", lessonLabel: LABEL } }] },
    open("s2-open", 35.267, "What strengths do you already have", "scale-through"),
    { sceneId: "s2-six", start: { atPhrase: "What strengths do you already have" }, end: { atSeconds: 75.833 }, avatar: { layout: "PresenterLeft", camera: "medium" }, transitionIn: "soft-push-right", events: [{ id: "six", anchor: { atPhrase: "What strengths do you already have" }, action: "show", component: "ChecklistSlide", props: { kicker: "Solution Filter · official worksheet", title: "Look at the whole picture", items: ["Strengths and challenges", "Skills you could build", "People and community need", "Positive values", "A suitable environment"], lessonLabel: LABEL } }] },
    open("s3-open", 75.833, "Be honest about both sides", "mask-wipe"),
    { sceneId: "s3-ability", start: { atPhrase: "Be honest about both sides" }, end: { atSeconds: 117.167 }, avatar: { layout: "PresenterRight", camera: "medium" }, transitionIn: "soft-push-left", events: [{ id: "strengths", anchor: { atPhrase: "Be honest about both sides" }, action: "show", component: "ChecklistSlide", props: { kicker: "Solution Filter · checks 1–2", title: "Be honest about both sides", items: ["What strengths can help?", "What could make it difficult?", "Where might you need learning or support?"], lessonLabel: LABEL } }] },
    open("s4-open", 117.167, "Maybe one idea helps you improve", "scale-through"),
    { sceneId: "s4-skills", start: { atPhrase: "Maybe one idea helps you improve" }, end: { atSeconds: 157.667 }, avatar: { layout: "PresenterLeft", camera: "medium" }, transitionIn: "soft-push-right", events: [{ id: "skills", anchor: { atPhrase: "Maybe one idea helps you improve" }, action: "show", component: "ChecklistSlide", props: { kicker: "Solution Filter · skill growth", title: "Learn through doing", items: ["Communication", "Planning or budgeting", "Design or technical skills", "Community need comes first"], lessonLabel: LABEL } }] },
    open("s5-open", 157.667, "Do not just write a big number", "crossfade"),
    { sceneId: "s5-beneficiaries", start: { atPhrase: "Do not just write a big number" }, end: { atSeconds: 199.2 }, avatar: { layout: "PresenterRight", camera: "medium" }, transitionIn: "soft-push-left", events: [{ id: "benefit", anchor: { atPhrase: "Do not just write a big number" }, action: "show", component: "QuestionSlide", props: { kicker: "Solution Filter · people and need", questions: ["Who benefits?", "How do they benefit?", "Does this answer the need?"], lessonLabel: LABEL } }] },
    open("s6-open", 199.2, "A good idea can fail", "mask-wipe"),
    { sceneId: "s6-values", start: { atPhrase: "A good idea can fail" }, end: { atSeconds: 242.233 }, avatar: { layout: "PresenterLeft", camera: "medium" }, transitionIn: "soft-push-right", events: [{ id: "values", anchor: { atPhrase: "A good idea can fail" }, action: "show", component: "ChecklistSlide", props: { kicker: "Solution Filter · checks 5–6", title: "Values and environment", items: ["What positive value does it support?", "Is there a suitable place or situation?", "Does the idea have a real chance to work?"], lessonLabel: LABEL } }] },
    open("s7-open", 242.233, "Take your time here", "scale-through"),
    { sceneId: "s7-worksheet", start: { atPhrase: "Take your time here" }, end: { atSeconds: 281.5 }, avatar: { layout: "PresenterRight", camera: "medium" }, transitionIn: "soft-push-left", events: [{ id: "worksheet", anchor: { atPhrase: "Take your time here" }, action: "show", component: "ActivitySlide", props: { kicker: "Your turn · official worksheet", title: "Compare your three ideas", steps: ["Answer all six questions for each idea", "Place the three options side by side", "Choose the strongest overall fit"], pauseNote: "Pause here if you need more time", lessonLabel: LABEL } }] },
    open("s8-open", 281.5, "And remember, the filter is a guide", "crossfade"),
    { sceneId: "s8-choice", start: { atPhrase: "And remember, the filter is a guide" }, end: { atSeconds: 320.133 }, avatar: { layout: "PresenterLeft", camera: "medium" }, transitionIn: "soft-push-right", events: [{ id: "choice", anchor: { atPhrase: "And remember, the filter is a guide" }, action: "show", component: "ActivitySlide", props: { kicker: "Final decision", title: "Choose the best overall fit", steps: ["Write down the solution", "Explain your choice in 2–3 sentences", "Give a clear reason behind it"], lessonLabel: LABEL } }] },
    open("s9-open", 320.133, "Next, we are going to make", "mask-wipe"),
    { sceneId: "s9-outro", start: { atPhrase: "Next, we are going to make" }, end: { atSeconds: 363.856689 }, avatar: { layout: "PresenterRight", camera: "medium" }, transitionIn: "soft-push-left", events: [{ id: "outro", anchor: { atPhrase: "Next, we are going to make" }, action: "show", component: "OutroSlide", props: { kicker: "Next lesson", title: "Make the solution clearer", takeaways: ["Specific and measurable", "Realistic and time-aware", "A creative improvement"], lessonLabel: LABEL } }] },
  ],
};

export const lesson11Edl: Edl = parseEdl(lesson11EdlInput);
