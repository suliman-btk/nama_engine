import { parseEdl, type Edl, type EdlInput } from "../../../production/act-engine/src/edl/schema";

const LABEL = "PRIME · Lesson 2";

/**
 * PRIME Lesson 02 — How Project DPro Works Across the Lifecycle
 *
 * Visual System & Presenter Rhythm:
 *  - 12 comprehensive learning scenes matching locked narration.
 *  - Frequent full-screen presenter moments (Full, Medium, Close) at key transitions,
 *    reflections, takeaways, and closing.
 *  - Modern circular presenter avatar (PresenterCircle) during content slides.
 *  - Diverse slide layouts:
 *    - Co-branded Title Slide (Scene 001)
 *    - Connected 5-Phase Process Diagram (Scene 002)
 *    - 3-Card Interacting Realities (Scene 003)
 *    - 5 Core Principles Grid (Scene 004)
 *    - 4 Governance Pillars (Scene 005)
 *    - Meaningful Stakeholder Participation Cards (Scene 006)
 *    - Side-by-Side Comprehensive vs. Integrated Comparison (Scene 007)
 *    - Adaptive Management 3-Card System (Scene 008)
 *    - Decision Gates Triangle Checkpoint (Scene 009)
 *    - Delta River Latrine Governance Case Walkthrough (Scene 010)
 *    - MEAL 4-Quadrant Discipline Grid (Scene 011)
 *    - 4-Pillar Summary Map & Lesson 3 Look Ahead (Scene 012)
 *  - Official NAMA brand colors: Deep Navy (#01005F / #020181), Gold (#CDAC3B),
 *    crisp White (#FFFFFF), and light background (#F7F7FB).
 */
const lesson02EdlInput: EdlInput = {
  lessonId: "lesson-02",
  title: "How Project DPro Works Across the Lifecycle",
  fps: 30,
  width: 1920,
  height: 1080,
  avatarVideoSrc: "avatar/lesson-02-master.mp4",
  sourceCutSeconds: [
    0,
    37.37,
    74.1,
    114.5,
    152.36,
    188.41,
    222.32,
    262.4,
    302.9,
    335.92,
    372.95,
    413.27,
  ],
  scenes: [
    // ── Scene 001a — Opening Greeting (Full-screen connection) ─────────────────
    {
      sceneId: "s01a-greeting",
      start: { atSeconds: 0 },
      end: { atPhrase: "Welcome back to Prime" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "clean-cut",
      events: [],
    },

    // ── Scene 001b — Co-branded Intro Slide ───────────────────────────────────
    {
      sceneId: "s01b-title-slide",
      start: { atPhrase: "Welcome back to Prime" },
      end: { atPhrase: "Now we need the bigger picture" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s01b-title-event",
          anchor: { atPhrase: "Welcome back to Prime" },
          action: "show",
          component: "TitleSlide",
          props: {
            title: "Lifecycle & Principles",
            unitLabel: "Unit 1: Foundations",
            subtitle: "Understanding the Project DPro phases, principles, decision gates, and MEAL.",
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 001c — Bigger Picture Reflection (Full-screen Punch-in) ───────────
    {
      sceneId: "s01c-bigger-picture",
      start: { atPhrase: "Now we need the bigger picture" },
      end: { atPhrase: "We need to understand the need" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 001d — Overview of Project Lifecycle ────────────────────────────
    {
      sceneId: "s01d-lifecycle-overview",
      start: { atPhrase: "We need to understand the need" },
      end: { atPhrase: "organizes project management into five connected phases" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s01d-overview-cards",
          anchor: { atPhrase: "We need to understand the need" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "The Project Journey",
            title: "More Than a List of Activities",
            subtitle: "Every development project moves through key milestones.",
            cards: [
              {
                tag: "Step 01",
                icon: "search",
                title: "Understand Need",
                body: "Identify real community challenges and root causes.",
              },
              {
                tag: "Step 02",
                icon: "clipboard",
                title: "Prepare & Plan",
                body: "Establish authorization, resources, and implementation steps.",
              },
              {
                tag: "Step 03",
                icon: "tools",
                title: "Manage & Close",
                body: "Execute with accountability, then hand over sustainably.",
              },
            ],
            variant: "pill",
            revealTimes: [0, 2.0, 4.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 002a — Section 2 Intro (Full-frame Transition) ───────────────────
    {
      sceneId: "s02a-phases-intro",
      start: { atPhrase: "organizes project management into five connected phases" },
      end: { atPhrase: "Identification and definition is where we understand" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [],
    },

    // ── Scene 002b — The Five Connected Phases (Horizontal Diagram) ────────────
    {
      sceneId: "s02b-connected-phases",
      start: { atPhrase: "Identification and definition is where we understand" },
      end: { atPhrase: "These phases are not five separate boxes" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s02b-phases-diagram",
          anchor: { atPhrase: "Identification and definition is where we understand" },
          action: "show",
          component: "DiagramSlide",
          props: {
            kicker: "Project DPro Framework",
            title: "The Five Connected Phases",
            subtitle: "A structured map guiding every project decision from concept to handover.",
            layout: "row",
            cards: [
              {
                tag: "Phase 1",
                label: "Identification",
                detail: "Define the need & project scope",
                icon: "search",
              },
              {
                tag: "Phase 2",
                label: "Setup",
                detail: "Governance, charter & authority",
                icon: "clipboard",
              },
              {
                tag: "Phase 3",
                label: "Planning",
                detail: "Schedule, budget, risk & MEAL",
                icon: "calendar",
              },
              {
                tag: "Phase 4",
                label: "Implementation",
                detail: "Direct work, team & manage changes",
                icon: "tools",
              },
              {
                tag: "Phase 5",
                label: "Closure",
                detail: "Handover, reporting & learning",
                icon: "check",
              },
            ],
            revealTimes: [0, 4.5, 9.0, 13.5, 20.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 003a — Core Insight: Not Rigid Boxes (Full-bleed Close) ─────────
    {
      sceneId: "s03a-not-boxes",
      start: { atPhrase: "These phases are not five separate boxes" },
      end: { atPhrase: "You may think about sustainability and closure" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 003b — Interacting Phases & Adaptive Reality ────────────────────
    {
      sceneId: "s03b-interacting-phases",
      start: { atPhrase: "You may think about sustainability and closure" },
      end: { atPhrase: "The life cycle gives direction but the work" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s03b-interacting-cards",
          anchor: { atPhrase: "You may think about sustainability and closure" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Dynamic Lifecycle",
            title: "Phases Interact & Overlap",
            subtitle: "Real projects require active feedback across all stages.",
            cards: [
              {
                tag: "Early Foresight",
                icon: "target",
                title: "Closure in Design",
                body: "Plan for sustainability and handover right from project identification.",
              },
              {
                tag: "Live Feedback",
                icon: "risk",
                title: "Revisit & Adjust",
                body: "New information during implementation prompts updates to risks and plans.",
              },
              {
                tag: "Shared Memory",
                icon: "document",
                title: "Continuity of Data",
                body: "Phase information must remain active so plans reflect current reality.",
              },
            ],
            variant: "accent",
            revealTimes: [0, 4.0, 12.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 003c — Presenter Reflection on Plan Reality ─────────────────────
    {
      sceneId: "s03c-reality-reflection",
      start: { atPhrase: "The life cycle gives direction but the work" },
      end: { atPhrase: "The phases show where we are in a project" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 004a — Principles Intro (Full-frame Transition) ─────────────────
    {
      sceneId: "s04a-principles-intro",
      start: { atPhrase: "The phases show where we are in a project" },
      end: { atPhrase: "five principles guide how we manage it in every phase" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [],
    },

    // ── Scene 004b — The Five Core Principles Grid ────────────────────────────
    {
      sceneId: "s04b-five-principles",
      start: { atPhrase: "five principles guide how we manage it in every phase" },
      end: { atPhrase: "Think of these as habits not another five" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s04b-principles-cards",
          anchor: { atPhrase: "five principles guide how we manage it in every phase" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Guiding Principles",
            title: "Five Habits for Every Phase",
            subtitle: "Principles guide every choice from small tasks to major strategic decisions.",
            cards: [
              {
                tag: "01",
                icon: "check",
                title: "Well-Governed",
                body: "Clear roles, authorities, accountability, and escalation limits.",
              },
              {
                tag: "02",
                icon: "users",
                title: "Participatory",
                body: "Meaningful involvement of appropriate community stakeholders.",
              },
              {
                tag: "03",
                icon: "search",
                title: "Comprehensive",
                body: "Considering all dimensions: risks, schedule, budget, and MEAL.",
              },
              {
                tag: "04",
                icon: "tools",
                title: "Integrated",
                body: "Aligning connected parts so changes in one area inform others.",
              },
              {
                tag: "05",
                icon: "target",
                title: "Adaptive",
                body: "Managing change systematically while holding to project goals.",
              },
            ],
            variant: "horizontal",
            revealTimes: [0, 1.5, 3.0, 4.5, 6.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 004c — Habits Insight (Full-bleed Punch-in) ─────────────────────
    {
      sceneId: "s04c-habits-insight",
      start: { atPhrase: "Think of these as habits not another five" },
      end: { atPhrase: "means there is clarity about decisions" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 005 — Principle 1: Well-Governed ────────────────────────────────
    {
      sceneId: "s05-well-governed",
      start: { atPhrase: "means there is clarity about decisions" },
      end: { atPhrase: "Participatory means giving the right stakeholders" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s05-governance-cards",
          anchor: { atPhrase: "means there is clarity about decisions" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Principle 01",
            title: "Well-Governed: Clarity in Authority",
            subtitle: "Without clear governance, even minor issues trigger confusion.",
            cards: [
              {
                tag: "Authority",
                icon: "check",
                title: "Defined Roles",
                body: "Clear understanding of who makes the final call on decisions.",
              },
              {
                tag: "Accountability",
                icon: "users",
                title: "Accountable Delivery",
                body: "Knowing who is responsible for deliverables and outcomes.",
              },
              {
                tag: "Discretion",
                icon: "tools",
                title: "Manager Autonomy",
                body: "Clear boundaries of what the PM can resolve independently.",
              },
              {
                tag: "Tolerances",
                icon: "alert",
                title: "Escalation Limits",
                body: "Agreed tolerances trigger timely escalation to board or sponsor.",
              },
            ],
            variant: "icon-top",
            revealTimes: [0, 3.0, 12.0, 20.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 006a — Principle 2: Participatory Intro (Full-screen) ────────────
    {
      sceneId: "s06a-participatory-intro",
      start: { atPhrase: "Participatory means giving the right stakeholders" },
      end: { atPhrase: "Participation can improve the information we collect" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 006b — Meaningful Participation ─────────────────────────────────
    {
      sceneId: "s06b-participation-values",
      start: { atPhrase: "Participation can improve the information we collect" },
      end: { atPhrase: "Two principles are easy to confuse" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s06b-participation-cards",
          anchor: { atPhrase: "Participation can improve the information we collect" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Principle 02",
            title: "Participatory: Engaging Stakeholders",
            subtitle: "Projects affect real lives and cannot be designed from an office.",
            cards: [
              {
                tag: "Evidence",
                icon: "search",
                title: "Better Information",
                body: "Deepens understanding of authentic community needs.",
              },
              {
                tag: "Design",
                icon: "clipboard",
                title: "Stronger Solutions",
                body: "Ensures interventions are culturally and technically viable.",
              },
              {
                tag: "Expectations",
                icon: "users",
                title: "Managed Expectations",
                body: "Aligns community, donor, and government hopes early.",
              },
              {
                tag: "Ownership",
                icon: "target",
                title: "Local Ownership",
                body: "Builds lasting commitment that endures beyond project closure.",
              },
            ],
            variant: "glass",
            revealTimes: [0, 3.0, 7.0, 12.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 007a — Confusion Warning (Full-bleed Punch-in) ───────────────────
    {
      sceneId: "s07a-two-principles-intro",
      start: { atPhrase: "Two principles are easy to confuse" },
      end: { atPhrase: "Comprehensive means considering the whole project" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 007b — Comprehensive vs. Integrated (Comparison Slide) ──────────
    {
      sceneId: "s07b-comprehensive-vs-integrated",
      start: { atPhrase: "Comprehensive means considering the whole project" },
      end: { atPhrase: "The fifth principle is adaptive" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s07b-comparison-cards",
          anchor: { atPhrase: "Comprehensive means considering the whole project" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Principles 03 & 04",
            title: "Comprehensive vs. Integrated",
            subtitle: "Connected disciplines working as one coherent system.",
            cards: [
              {
                tag: "Principle 03",
                icon: "search",
                title: "Comprehensive (The Whole)",
                body: "Considering every aspect together: activities, stakeholders, risks, resources, communication, sustainability, and MEAL.",
              },
              {
                tag: "Principle 04",
                icon: "tools",
                title: "Integrated (The Connections)",
                body: "Recognizing how parts affect each other: schedule drives resources, risks impact timelines, and MEAL triggers adaptations.",
              },
            ],
            variant: "comparison",
            revealTimes: [0, 10.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 008a — Adaptive Statement (Full-frame Transition) ────────────────
    {
      sceneId: "s08a-adaptive-intro",
      start: { atPhrase: "The fifth principle is adaptive" },
      end: { atPhrase: "Being adaptive does not mean changing direction" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [],
    },

    // ── Scene 008b — Adaptive Management ──────────────────────────────────────
    {
      sceneId: "s08b-adaptive-cards",
      start: { atPhrase: "Being adaptive does not mean changing direction" },
      end: { atPhrase: "also uses decision gates" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s08b-adaptive-event",
          anchor: { atPhrase: "Being adaptive does not mean changing direction" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Principle 05",
            title: "Adaptive: Responding with Control",
            subtitle: "Plans adapt to evidence while maintaining focus on the project goal.",
            cards: [
              {
                tag: "Discipline",
                icon: "check",
                title: "Controlled Change",
                body: "Not changing direction on whim, but managing change through formal review.",
              },
              {
                tag: "Evidence",
                icon: "data",
                title: "Information-Driven",
                body: "Using live monitoring data and changing context to justify plan revisions.",
              },
              {
                tag: "Stability",
                icon: "target",
                title: "Goal Focus",
                body: "Keeping the intended community impact intact while adjusting methods.",
              },
            ],
            variant: "accent",
            revealTimes: [0, 4.0, 12.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 009a — Decision Gates Intro (Full-frame Section Intro) ───────────
    {
      sceneId: "s09a-gates-intro",
      start: { atPhrase: "also uses decision gates" },
      end: { atPhrase: "Are we still doing the right project in the right" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 009b — Decision Gates Checkpoint (Triangle Diagram) ──────────────
    {
      sceneId: "s09b-gates-diagram",
      start: { atPhrase: "Are we still doing the right project in the right" },
      end: { atPhrase: "Stopping is not automatically failure" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s09b-gates-event",
          anchor: { atPhrase: "Are we still doing the right project in the right" },
          action: "show",
          component: "DiagramSlide",
          props: {
            kicker: "Governance Checkpoints",
            title: "The Three Gate Decisions",
            subtitle: "Deliberate checkpoints where authorized leaders verify ongoing viability.",
            layout: "triangle",
            cards: [
              {
                tag: "Option 01",
                label: "Continue",
                detail: "Evidence confirms project is viable and on track",
                icon: "check",
              },
              {
                tag: "Option 02",
                label: "Modify",
                detail: "Adjust schedule, budget, or scope to address changes",
                icon: "tools",
              },
              {
                tag: "Option 03",
                label: "Stop",
                detail: "Close responsibly if intervention is no longer suitable",
                icon: "alert",
              },
            ],
            revealTimes: [0, 3.0, 6.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 009c — Stopping Reflection (Full-bleed Punch-in) ─────────────────
    {
      sceneId: "s09c-stopping-reflection",
      start: { atPhrase: "Stopping is not automatically failure" },
      end: { atPhrase: "Here is governance in the Delta River Latrine project" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 010a — Delta River Case Intro (Full-frame Connection) ────────────
    {
      sceneId: "s10a-delta-case-intro",
      start: { atPhrase: "Here is governance in the Delta River Latrine project" },
      end: { atPhrase: "Imagine that it rains for five straight days" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [],
    },

    // ── Scene 010b — Governance in Action: Tolerances & Escalation ─────────────
    {
      sceneId: "s10b-governance-walkthrough",
      start: { atPhrase: "Imagine that it rains for five straight days" },
      end: { atPhrase: "One more idea runs through the whole journey" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s10b-governance-case-cards",
          anchor: { atPhrase: "Imagine that it rains for five straight days" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Delta River Case Study",
            title: "Governance & Tolerances in Action",
            subtitle: "How clear authority limits guide manager decisions during crises.",
            cards: [
              {
                tag: "The Event",
                icon: "alert",
                title: "5 Days of Rain",
                body: "Unforeseen rainfall stops digging of community latrine pits.",
              },
              {
                tag: "Tolerance Limit",
                icon: "time",
                title: "3-Day PM Limit",
                body: "Project manager can absorb delays up to 3 days independently.",
              },
              {
                tag: "Board Escalation",
                icon: "users",
                title: "Board Decides",
                body: "Because delay exceeds tolerance, issue escalates to Project Board.",
              },
            ],
            variant: "pill",
            revealTimes: [0, 5.0, 10.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 011a — MEAL Intro (Full-frame Transition) ───────────────────────
    {
      sceneId: "s11a-meal-intro",
      start: { atPhrase: "One more idea runs through the whole journey" },
      end: { atPhrase: "meaning monitoring evaluation accountability and learning" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [],
    },

    // ── Scene 011b — MEAL 4-Quadrant Discipline Grid ──────────────────────────
    {
      sceneId: "s11b-meal-disciplines",
      start: { atPhrase: "meaning monitoring evaluation accountability and learning" },
      end: { atPhrase: "Now you have the map" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s11b-meal-grid",
          anchor: { atPhrase: "meaning monitoring evaluation accountability and learning" },
          action: "show",
          component: "DiagramSlide",
          props: {
            kicker: "Cross-Cutting Discipline",
            title: "MEAL Across the Lifecycle",
            subtitle: "Evidence flowing continuously through every project phase.",
            layout: "grid",
            cards: [
              {
                tag: "M",
                label: "Monitoring",
                detail: "Track daily progress and catch emerging issues early",
                icon: "search",
              },
              {
                tag: "E",
                label: "Evaluation",
                detail: "Assess true results and long-term community impact",
                icon: "target",
              },
              {
                tag: "A",
                label: "Accountability",
                detail: "Listen, respond, and remain transparent to stakeholders",
                icon: "users",
              },
              {
                tag: "L",
                label: "Learning",
                detail: "Extract lessons to adapt current and future interventions",
                icon: "idea",
              },
            ],
            revealTimes: [0, 8.0, 14.0, 19.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 012a — Summary Map ──────────────────────────────────────────────
    {
      sceneId: "s12a-summary-map",
      start: { atPhrase: "Now you have the map" },
      end: { atPhrase: "Keep the Delta River in mind" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s12a-summary-cards",
          anchor: { atPhrase: "Now you have the map" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "The Complete Framework",
            title: "The Four Foundations of PRIME",
            subtitle: "Your comprehensive roadmap for managing development projects.",
            cards: [
              {
                tag: "Where",
                icon: "calendar",
                title: "5 Connected Phases",
                body: "Guide where the project is going across its full lifecycle.",
              },
              {
                tag: "How",
                icon: "check",
                title: "5 Core Principles",
                body: "Guide decision habits in every phase and at every level.",
              },
              {
                tag: "Check",
                icon: "alert",
                title: "Decision Gates",
                body: "Formally verify viability: Continue, Modify, or Stop.",
              },
              {
                tag: "Evidence",
                icon: "data",
                title: "Continuous MEAL",
                body: "Informs action, promotes accountability, and drives adaptation.",
              },
            ],
            variant: "icon-top",
            revealTimes: [0, 3.0, 7.0, 10.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 012b — Look Ahead to Lesson 3 ───────────────────────────────────
    {
      sceneId: "s12b-look-ahead",
      start: { atPhrase: "Keep the Delta River in mind" },
      end: { atPhrase: "Thats it for today Ill see you in the next lesson" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "crossfade",
      events: [],
    },

    // ── Scene 012c — Warm Final Closing (Presenter Full Screen) ───────────────
    {
      sceneId: "s12c-closing",
      start: { atPhrase: "Thats it for today Ill see you in the next lesson" },
      end: { atSeconds: 453.53 },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "crossfade",
      events: [],
    },
  ],
};

export const lesson02Edl: Edl = parseEdl(lesson02EdlInput);
