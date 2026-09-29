import { parseEdl, type Edl, type EdlInput } from "../../../production/act-engine/src/edl/schema";

const LABEL = "PRIME · Lesson 1";

/**
 * PRIME Lesson 01 — Welcome to PRIME
 *
 * FULLY REDESIGNED INTERACTIVE & DIVERSE VISUAL SYSTEM:
 *  - Scene 001: Opening co-branded Title with NAMA Foundation logo & PRIME logo,
 *               interactive Target Audience cards with progressive reveal,
 *               and the 7 Project Dimensions connected process diagram.
 *  - Progressive transparency reveals on all card and diagram slides:
 *    upcoming cards start at subtle opacity (~0.32) and smoothly animate into
 *    full prominence (opacity 1.0, active red accent and glow) as the speaker speaks.
 *  - Diverse card and layout designs:
 *    - Executive 3-card centered (Scenes 001c, 002, 004)
 *    - 4-column horizontal milestone cards (Scene 003)
 *    - 4-quadrant complexity & cause-and-effect grids (Scenes 005, 006)
 *    - Key Statement slide on brand red (Scene 007)
 *    - Triple Constraint connected triangle diagram (Scene 008)
 *    - Side-by-side comparative cards (Scenes 009, 010)
 *    - Connected curriculum roadmap & tool delivery slides (Scenes 011, 012)
 *  - Varied scene transitions: mask-wipe, soft-push-left, soft-push-right,
 *    dip-to-brand, scale-through, and section-reveal.
 *  - Strict adherence to official PRIME colors: PRIME Crimson Red (#A02828),
 *    Deep Navy (#1A1B3D), and crisp White (#FFFFFF) — zero gold.
 */
const lesson01EdlInput: EdlInput = {
  lessonId: "lesson-01",
  title: "Welcome to prime",
  fps: 30,
  width: 1920,
  height: 1080,
  avatarVideoSrc: "avatar/lesson-01-master.mp4",
  sourceCutSeconds: [0, 42.48, 84.78, 123.78, 167.26, 206.46, 245.98, 285.28, 325.08, 367.58, 407.38, 444.28],
  scenes: [
    // ── Scene 001a — Opening Greeting (Personal connection) ───────────────────
    {
      sceneId: "s01a-greeting",
      start: { atSeconds: 0 },
      end: { atPhrase: "Welcome to prime" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "clean-cut",
      events: [],
    },

    // ── Scene 001b — Welcome & Co-branded Intro (NAMA Foundation + PRIME) ─────
    {
      sceneId: "s01b-welcome-nama",
      start: { atPhrase: "Welcome to prime" },
      end: { atPhrase: "If you work with community initiatives" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s01b-title-slide",
          anchor: { atPhrase: "Welcome to prime" },
          action: "show",
          component: "TitleSlide",
          props: {
            title: "Welcome to PRIME",
            unitLabel: "Presented by NAMA Foundation",
            subtitle: "A project management learning course based on Project DPro (Second Edition).",
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 001c — Target Audience (Who Is PRIME For?) ─────────────────────
    {
      sceneId: "s01c-who-is-prime-for",
      start: { atPhrase: "If you work with community initiatives" },
      end: { atPhrase: "PRIME helps you move beyond" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s01c-audience-cards",
          anchor: { atPhrase: "If you work with community initiatives" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Who Is PRIME For?",
            title: "Built for Real Impact",
            subtitle: "Helping leaders turn ideas into real results.",
            cards: [
              {
                tag: "Target 01",
                icon: "community",
                title: "Community Leaders",
                body: "Local teams and organizers working on the ground.",
              },
              {
                tag: "Target 02",
                icon: "projects",
                title: "Development Projects",
                body: "Social programs, aid work, and public services.",
              },
              {
                tag: "Target 03",
                icon: "ngo",
                title: "NGOs & Non-Profits",
                body: "Organizations that need clear project methods.",
              },
            ],
            variant: "pill",
            revealTimes: [0, 2.3, 3.8],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 001d — The 7 Project Dimensions (Connected Lifecycle Diagram) ──
    {
      sceneId: "s01d-seven-dimensions",
      start: { atPhrase: "PRIME helps you move beyond" },
      end: { atPhrase: "Let's begin by understanding" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "scale-through",
      events: [
        {
          id: "s01d-dimensions-diagram",
          anchor: { atPhrase: "PRIME helps you move beyond" },
          action: "show",
          component: "DiagramSlide",
          props: {
            kicker: "Holistic Project Thinking",
            title: "The 7 Project Dimensions",
            subtitle: "Moving beyond daily activities to manage the entire project lifecycle.",
            cards: [
              { tag: "01", icon: "alert", label: "Problem", detail: "Needs & roots" },
              { tag: "02", icon: "users", label: "People", detail: "Stakeholders" },
              { tag: "03", icon: "clipboard", label: "Plan", detail: "Tools & timeline" },
              { tag: "04", icon: "briefcase", label: "Resources", detail: "Team & budget" },
              { tag: "05", icon: "shield", label: "Risks", detail: "Mitigations" },
              { tag: "06", icon: "target", label: "Results", detail: "Deliverables" },
              { tag: "07", icon: "flag", label: "Post-Project", detail: "Longevity" },
            ],
            layout: "row",
            revealTimes: [5.6, 6.8, 7.6, 8.4, 9.4, 10.2, 11.1],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 001e — Reflection & Transition to Core Curriculum ──────────────
    {
      sceneId: "s01e-reflection",
      start: { atPhrase: "Let's begin by understanding" },
      end: { atPhrase: "practical course for understanding" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "clean-cut",
      events: [],
    },

    // ── Scene 002 — What PRIME Is (Project DPro Core) ─────────────────────────
    {
      sceneId: "s02a-prime-introduction",
      start: { atPhrase: "practical course for understanding" },
      end: { atPhrase: "does not focus only on schedules" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "section-reveal",
      events: [],
    },
    {
      sceneId: "s02-what-prime-is",
      start: { atPhrase: "does not focus only on schedules" },
      end: { atPhrase: "Think about the kind of work" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s02-pillars",
          anchor: { atPhrase: "does not focus only on schedules" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "What Is PRIME?",
            title: "From Idea to Real Results",
            subtitle: "A clear path from needs to lasting change.",
            cards: [
              {
                tag: "Step 01",
                icon: "idea",
                title: "Understand the Problem",
                body: "Start with real challenges and the people affected.",
              },
              {
                tag: "Step 02",
                icon: "clipboard",
                title: "Plan the Work",
                body: "Set a budget, build a team, and create a timeline.",
              },
              {
                tag: "Step 03",
                icon: "target",
                title: "Deliver Results",
                body: "Make real, lasting change the community can see.",
              },
            ],
            columns: 2,
            revealTimes: [0, 9.0, 18.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 003 — Development Happens Through Projects (4 Sectors) ─────────
    {
      sceneId: "s03-development-projects",
      start: { atPhrase: "Think about the kind of work" },
      end: { atPhrase: "Before going further" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s03-sectors",
          anchor: { atPhrase: "Think about the kind of work" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Development Sectors",
            title: "Projects that Change Lives",
            subtitle: "Real projects that make a difference in communities.",
            cards: [
              {
                tag: "Sector 01",
                icon: "education",
                title: "Education",
                body: "Schools, training, and learning programs.",
              },
              {
                tag: "Sector 02",
                icon: "water",
                title: "Clean Water",
                body: "Wells, filters, and safe drinking water.",
              },
              {
                tag: "Sector 03",
                icon: "health",
                title: "Healthcare",
                body: "Clinics, care, and healthy nutrition.",
              },
              {
                tag: "Sector 04",
                icon: "livelihoods",
                title: "Livelihoods",
                body: "Farming, jobs, and income support.",
              },
            ],
            variant: "icon-top",
            revealTimes: [0, 3.5, 6.8, 10.2],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 004 — So, What Is a Project? (Brand Red Background) ────────────
    {
      sceneId: "s04a-project-definition-intro",
      start: { atPhrase: "Before going further" },
      end: { atPhrase: "Project management means" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s04-what-is-project",
      start: { atPhrase: "Project management means" },
      end: { atPhrase: "Managing a development project" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [
        {
          id: "s04-definition-cards",
          anchor: { atPhrase: "Project management means" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Core Definition",
            title: "What Makes It a Project?",
            subtitle: "Three things that set projects apart from daily work.",
            cards: [
              {
                tag: "Key 01",
                icon: "time",
                title: "Has a Start & End",
                body: "It doesn't go on forever — it has a clear finish.",
              },
              {
                tag: "Key 02",
                icon: "deliverable",
                title: "Delivers Something",
                body: "It creates a real result people can point to.",
              },
              {
                tag: "Key 03",
                icon: "constraint",
                title: "Needs Coordination",
                body: "People, money, and partners all working together.",
              },
            ],
            variant: "glass",
            themeMode: "brand",
            revealTimes: [0, 5.0, 11.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 005 — Why Development Projects Are Different (Added Visual Slide)
    {
      sceneId: "s05a-development-reality",
      start: { atPhrase: "Managing a development project" },
      end: { atPhrase: "And development projects often aim" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [],
    },
    {
      sceneId: "s05-why-different",
      start: { atPhrase: "And development projects often aim" },
      end: { atPhrase: "For practical examples throughout" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "scale-through",
      events: [
        {
          id: "s05-complexities",
          anchor: { atPhrase: "And development projects often aim" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Project Realities",
            title: "Why These Projects Are Harder",
            subtitle: "What makes development work different from regular projects.",
            cards: [
              {
                tag: "Reality 01",
                icon: "constraint",
                title: "Money Changes",
                body: "Budgets shift and funding can come and go.",
              },
              {
                tag: "Reality 02",
                icon: "users",
                title: "Many People Involved",
                body: "Communities, government, donors — all need to agree.",
              },
              {
                tag: "Reality 03",
                icon: "target",
                title: "Hard to Measure",
                body: "The goal is changing lives, not just building things.",
              },
              {
                tag: "Reality 04",
                icon: "alert",
                title: "Surprises Happen",
                body: "Plans must be flexible when conditions change.",
              },
            ],
            variant: "accent",
            revealTimes: [0, 4.5, 9.5, 14.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 006 — A Case From Project DPro (Delta River Case Study) ─────────
    {
      sceneId: "s06a-case-introduction",
      start: { atPhrase: "For practical examples throughout" },
      end: { atPhrase: "One recurring case is the Delta River" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "soft-push-right",
      events: [],
    },
    {
      sceneId: "s06-delta-river",
      start: { atPhrase: "One recurring case is the Delta River" },
      end: { atPhrase: "Delta River case shows" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-right",
      events: [
        {
          id: "s06-case",
          anchor: { atPhrase: "One recurring case is the Delta River" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Project DPro Case",
            title: "Delta River — Connected Problems",
            subtitle: "Bad water leads to bad crops, lost income, and sick children.",
            cards: [
              {
                tag: "Root Cause",
                icon: "water",
                title: "Dirty Water",
                body: "Waste and poor sanitation pollute the river.",
              },
              {
                tag: "Farming",
                icon: "livelihoods",
                title: "Crops Fail",
                body: "Polluted water hurts harvests and food supply.",
              },
              {
                tag: "Economy",
                icon: "cost",
                title: "Income Drops",
                body: "Families lose money and fall deeper into poverty.",
              },
              {
                tag: "Health",
                icon: "health",
                title: "Children Get Sick",
                body: "Dirty water causes disease, especially in kids.",
              },
            ],
            columns: 2,
            revealTimes: [0, 4.0, 7.5, 11.5],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 007 — Do Not Start With the Solution (Brand Red Statement) ──────
    {
      sceneId: "s07a-ask-first",
      start: { atPhrase: "Delta River case shows" },
      end: { atPhrase: "Waste disposal, sanitation" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [],
    },
    {
      sceneId: "s07-dont-start-solution",
      start: { atPhrase: "Waste disposal, sanitation" },
      end: { atPhrase: "Projects also have limits" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [
        {
          id: "s07-questions",
          anchor: { atPhrase: "Waste disposal, sanitation" },
          action: "show",
          component: "IconListSlide",
          props: {
            kicker: "Core Principle",
            title: "Do Not Start With the Solution",
            subtitle: "Begin with rigorous questions before assuming an intervention.",
            items: [
              {
                icon: "users",
                label: "Who is affected?",
                sublabel: "Identify all primary stakeholders, vulnerable families, and community groups.",
                tag: "Evidence",
              },
              {
                icon: "data",
                label: "What evidence do we have?",
                sublabel: "Validate assumptions with concrete field data rather than hasty opinions.",
                tag: "Validation",
              },
              {
                icon: "target",
                label: "Which causes can this project influence?",
                sublabel: "Differentiate what is within project scope from external macro conditions.",
                tag: "Focus",
              },
            ],
            revealTimes: [0, 5.0, 10.5],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 008 — Project Management Is About Balance (The Triangle) ───────
    {
      sceneId: "s08a-project-limits",
      start: { atPhrase: "Projects also have limits" },
      end: { atPhrase: "Project D Pro connects" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "section-reveal",
      events: [],
    },
    {
      sceneId: "s08-about-balance",
      start: { atPhrase: "Project D Pro connects" },
      end: { atPhrase: "You will learn tools in" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "section-reveal",
      events: [
        {
          id: "s08-triple",
          anchor: { atPhrase: "Project D Pro connects" },
          action: "show",
          component: "DiagramSlide",
          props: {
            kicker: "The Triple Constraint",
            title: "Project Management Is About Balance",
            subtitle: "A change to one constraint inevitably affects the others.",
            cards: [
              { icon: "target", label: "Scope & Quality", detail: "What the project delivers and required standards" },
              { icon: "cost", label: "Cost & Resources", detail: "Budget, funding, personnel, and materials" },
              { icon: "calendar", label: "Time & Schedule", detail: "Deadlines, phase milestones, and duration" },
            ],
            layout: "triangle",
            revealTimes: [0, 4.0, 8.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 009 — Tools Are Only Half of the Job (Science vs Art) ──────────
    {
      sceneId: "s09a-tools-and-people",
      start: { atPhrase: "You will learn tools in" },
      end: { atPhrase: "The science includes" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "scale-through",
      events: [],
    },
    {
      sceneId: "s09-art-and-science",
      start: { atPhrase: "The science includes" },
      end: { atPhrase: "The guide offers an example" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [
        {
          id: "s09-art-science",
          anchor: { atPhrase: "The science includes" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Balanced Mastery",
            title: "Tools Are Only Half the Job",
            subtitle: "You need both technical skill and people skill.",
            cards: [
              {
                tag: "Side A",
                icon: "science",
                title: "The Science",
                body: "Plans, budgets, schedules, and tracking.",
              },
              {
                tag: "Side B",
                icon: "art",
                title: "The Art",
                body: "Listening, leading, and motivating people.",
              },
            ],
            variant: "comparison",
            themeMode: "brand",
            revealTimes: [0, 5.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 010 — An Education Example (David's Leadership Lesson) ─────────
    {
      sceneId: "s10a-david-introduction",
      start: { atPhrase: "The guide offers an example" },
      end: { atPhrase: "His technical work is strong" },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [],
    },
    {
      sceneId: "s10-david-example",
      start: { atPhrase: "His technical work is strong" },
      end: { atPhrase: "14 connected lessons" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "soft-push-left",
      events: [
        {
          id: "s10-leadership-balance",
          anchor: { atPhrase: "His technical work is strong" },
          action: "show",
          component: "CardGridSlide",
          props: {
            kicker: "Case in Point",
            title: "David's Lesson",
            subtitle: "Good plans are not enough — you also need happy people.",
            cards: [
              {
                tag: "What Worked",
                icon: "clipboard",
                title: "Great Planning",
                body: "David hit every deadline and filed every report.",
              },
              {
                tag: "What Didn't",
                icon: "users",
                title: "People Left",
                body: "His team quit because he only focused on tasks, not people.",
              },
            ],
            variant: "comparison",
            revealTimes: [0, 6.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 011 — Your 14-Lesson Journey (4 Curriculum Phases) ─────────────
    {
      sceneId: "s11a-course-journey-intro",
      start: { atPhrase: "14 connected lessons" },
      end: { atPhrase: "help you understand the approach" },
      avatar: { layout: "PresenterMedium", camera: "medium" },
      transitionIn: "mask-wipe",
      events: [],
    },
    {
      sceneId: "s11-journey",
      start: { atPhrase: "help you understand the approach" },
      end: { atPhrase: "By the end of" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "section-reveal",
      events: [
        {
          id: "s11-roadmap",
          anchor: { atPhrase: "help you understand the approach" },
          action: "show",
          component: "IconListSlide",
          props: {
            kicker: "Your Curriculum Roadmap",
            title: "Your 14-Lesson Journey",
            subtitle: "Four integrated phases where each part builds systematically upon the last.",
            items: [
              {
                icon: "search",
                label: "Phase 1: Approach & Identification",
                sublabel: "Lessons 2–4: Explore project approaches, gather evidence, and analyze problems & stakeholders.",
                tag: "Lessons 2–4",
              },
              {
                icon: "clipboard",
                label: "Phase 2: Project Design",
                sublabel: "Lessons 5–7: Transform evidence into robust design, theory of change, and clear governance.",
                tag: "Lessons 5–7",
              },
              {
                icon: "calendar",
                label: "Phase 3: Planning & Baselines",
                sublabel: "Lessons 8–11: Develop work breakdown structures, schedules, risk registers, and resource plans.",
                tag: "Lessons 8–11",
              },
              {
                icon: "check",
                label: "Phase 4: Management & Closure",
                sublabel: "Lessons 12–14: Manage ongoing delivery, respond to change, and conduct orderly project handover.",
                tag: "Lessons 12–14",
              },
            ],
            revealTimes: [0, 4.0, 8.0, 12.0],
            lessonLabel: LABEL,
          },
        },
      ],
    },

    // ── Scene 012 — What You Should Take From PRIME (Tools & Closing) ────────
    {
      sceneId: "s12a-course-takeaway-intro",
      start: { atPhrase: "By the end of" },
      end: { atPhrase: "Is it addressing the right need" },
      avatar: { layout: "PresenterClose", camera: "close" },
      transitionIn: "section-reveal",
      events: [],
    },
    {
      sceneId: "s12-takeaway",
      start: { atPhrase: "Is it addressing the right need" },
      end: { atPhrase: "In lesson 2" },
      avatar: { layout: "PresenterCircle", camera: "medium" },
      transitionIn: "dip-to-brand",
      events: [
        {
          id: "s12-tools",
          anchor: { atPhrase: "Is it addressing the right need" },
          action: "show",
          component: "IconListSlide",
          props: {
            kicker: "Course Takeaways",
            title: "5 Essential Tools You Will Master",
            subtitle: "Proven international standards that help teams make informed choices together.",
            items: [
              { icon: "tree", label: "Problem Tree Analysis", sublabel: "Deconstruct underlying causes and visible effects.", tag: "Tool 01" },
              { icon: "data", label: "Logical Framework (Logframe)", sublabel: "Connect activities directly to outcomes and strategic goals.", tag: "Tool 02" },
              { icon: "deliverable", label: "Work Breakdown Structure (WBS)", sublabel: "Decompose scope into manageable, accountable deliverables.", tag: "Tool 03" },
              { icon: "risk", label: "Risk Register & Response Plan", sublabel: "Identify, quantify, and mitigate risks proactively.", tag: "Tool 04" },
              { icon: "gantt", label: "Gantt Chart & Schedule", sublabel: "Map dependencies, milestones, and realistic timelines.", tag: "Tool 05" },
            ],
            revealTimes: [0, 4.5, 9.0, 13.5, 17.5],
            lessonLabel: LABEL,
          },
        },
      ],
    },
    {
      sceneId: "s12b-closing",
      start: { atPhrase: "In lesson 2" },
      end: { atSeconds: 490 },
      avatar: { layout: "PresenterFull", camera: "medium" },
      transitionIn: "scale-through",
      events: [],
    },
  ],
};

export const lesson01Edl: Edl = parseEdl(lesson01EdlInput);
