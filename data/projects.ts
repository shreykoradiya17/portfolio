/**
 * Source of truth for project content.
 *
 * `media` is intentionally optional. No screenshots of these products are
 * available, and inventing them would be dishonest — so each project renders a
 * bespoke generative composition instead (a system map, a live scene, a design
 * specimen, a data study). Drop real captures into /public and add them here and
 * the composition steps aside automatically.
 */

export type Personality = "system" | "immersive" | "editorial" | "precision";

/** Which device frame a project's capture belongs in. */
export type FrameKind = "browser" | "phone";

/**
 * A real captured screen, shown inside a device frame.
 *
 * Rendered with `fill`, so no intrinsic dimensions are declared and any capture
 * at the frame's ratio drops in unchanged. Until the file exists the frame
 * shows a labelled slot rather than inventing a screenshot.
 *
 * Ratios: `browser` wants a desktop capture (16:10 by default, e.g. 1440×900);
 * `phone` wants a 393×852pt screen at any scale factor (1179×2556 @3x).
 */
export interface Shot {
  src: string;
  alt: string;
  frame: FrameKind;
  /** Shown where a browser address bar would be. A route, not a fake URL. */
  label?: string;
  /** Human-readable caption shown beside the frame in the composition. */
  caption?: string;
  /** Browser viewport ratio. Defaults to 16/10. */
  ratio?: string;
  /** Capture size, named in the slot and the spec annotation. */
  spec?: string;
  /**
   * Set by the server resolver when the file is not on disk. The frame then
   * renders its labelled slot while keeping its kind, label and ratio — the
   * presentation is configured here, only the asset is conditional.
   */
  missing?: boolean;
}

export interface Project {
  slug: string;
  index: string;
  name: string;
  category: string;
  year: string;
  role: string;
  stack: string[];
  /** The single line that carries the project. */
  headline: string;
  /** One paragraph. What it was, honestly. */
  standfirst: string;
  /** Drives which bespoke composition renders. */
  personality: Personality;
  /** Ordered narrative for the detail page. */
  chapters: { label: string; title: string; body: string }[];
  /** Small factual pairs. Never invented metrics. */
  facts: { k: string; v: string }[];
  /** Optional real media. When absent, the generative composition renders. */
  media?: { src: string; alt: string }[];
  /**
   * The project's captured screens, framed for its medium. Two per project —
   * each spread composes the pair differently.
   */
  shots?: Shot[];
}

export const projects: Project[] = [
  {
    slug: "technource-erp",
    index: "01",
    name: "Technource ERP",
    category: "Enterprise Product / UX / Frontend",
    year: "2024 — 2026",
    role: "UI/UX Design + Frontend Engineering",
    stack: ["React.js", "Tailwind CSS", "REST APIs", "WebSockets", "Figma"],
    headline: "Designing clarity into enterprise complexity.",
    standfirst:
      "An internal ERP built as a single-page React application. Eight modules, eight roles, one component library — and a permission model that had to be legible to the people using it, not just correct in the database.",
    personality: "system",
    shots: [
      {
        src: "/work/technource-erp/01-board.png",
        alt: "Technource ERP, projects module: a sprint board with task cards arranged across columns.",
        frame: "browser",
        label: "ERP / projects / board",
        caption: "Projects · board, drag & drop, sprint sync",
        spec: "1440 × 900",
      },
      {
        src: "/work/technource-erp/02-reporting.png",
        alt: "Technource ERP, reporting module: dashboards summarising attendance and project data.",
        frame: "browser",
        label: "ERP / reporting",
        caption: "Reporting · dashboards across eight modules",
        spec: "1440 × 900",
      },
    ],
    chapters: [
      {
        label: "The problem",
        title: "Eight modules that had to feel like one product.",
        body: "Projects, HRMS, Attendance, Recruitment and Reporting each arrived with their own vocabulary and their own idea of what a table should look like. The work was not adding features. It was finding the small set of patterns that every module could be expressed in, then holding the line on them.",
      },
      {
        label: "Access",
        title: "Eight roles, one interface.",
        body: "Role-based access control across eight user roles. Rather than branching the interface per role, permissions resolve into the same layout — actions and modules appear, disappear or explain themselves, so nobody learns a different product because of their job title.",
      },
      {
        label: "Workflow",
        title: "A Kanban board that behaves like the one people already know.",
        body: "A Jira-style board with drag-and-drop task movement, sprint synchronisation and filtering. Familiarity was the requirement: the fastest interface to learn is the one that matches the mental model people brought with them.",
      },
      {
        label: "Realtime",
        title: "Attendance that is true right now.",
        body: "Real-time biometric attendance over WebSockets, feeding HR scoring and reporting dashboards. Live data changes the design problem — the interface has to stay readable while the numbers underneath it move.",
      },
      {
        label: "The system",
        title: "A component library, not a stylesheet.",
        body: "A reusable Tailwind component library underpins all eight modules. Designed in Figma, implemented in React, then used as the actual constraint on what new screens could look like. That loop is the reason the product stayed coherent.",
      },
    ],
    facts: [
      { k: "Modules", v: "8+" },
      { k: "User roles", v: "8" },
      { k: "Architecture", v: "React SPA" },
      { k: "Realtime", v: "WebSockets" },
    ],
  },
  {
    slug: "crushwithme",
    index: "02",
    name: "CrushWithMe",
    category: "Social / Dating / Creative Development",
    year: "2025",
    role: "Frontend + Creative Development",
    stack: ["React.js", "Three.js", "GSAP", "ScrollTrigger", "Lenis", "Tailwind CSS", "REST API", "Figma"],
    headline: "Motion as the first impression.",
    standfirst:
      "A marketing site for a social product, where the interface had to do the persuading. Scroll-linked reveals, pinned sections and timeline transitions carry the narrative — and an interactive Three.js scene in the hero responds to both scroll and pointer.",
    personality: "immersive",
    shots: [
      {
        src: "/work/crushwithme/01-home.png",
        alt: "CrushWithMe marketing site: the home page hero with its interactive three-dimensional scene.",
        frame: "browser",
        label: "crushwithme / home",
        caption: "Home · the interactive hero",
        spec: "1440 × 900",
      },
      {
        src: "/work/crushwithme/02-experience.png",
        alt: "CrushWithMe marketing site: a scroll-linked section further down the page.",
        frame: "browser",
        label: "crushwithme / experience",
        caption: "Pinned section · scroll-linked reveal",
        spec: "1440 × 900",
      },
    ],
    chapters: [
      {
        label: "The hero",
        title: "A scene, not a background video.",
        body: "A custom Three.js scene with its own lighting and materials, driven by scroll position and pointer input. Built as real geometry rather than a loop, so it responds instead of playing — and so it costs nothing to download beyond the code that draws it.",
      },
      {
        label: "Choreography",
        title: "Scroll as a timeline.",
        body: "GSAP with ScrollTrigger and Lenis, treating the page as a single sequence: pinned sections, scroll-linked reveals and transitions that hand off to each other. The ordering is the design work — deciding what earns movement and what should hold still.",
      },
      {
        label: "Discipline",
        title: "Motion that survives a real device.",
        body: "The scene caps its pixel ratio, pauses when scrolled out of view, and stands down entirely for reduced-motion and touch. An animation you cannot turn off is not a feature.",
      },
      {
        label: "Responsive",
        title: "The same story, recomposed.",
        body: "Mobile is not the desktop sequence with the effects removed. Pinning gives way to a simpler vertical rhythm, and the scene simplifies rather than disappearing, so the narrative still lands on a phone.",
      },
    ],
    facts: [
      { k: "Renderer", v: "Three.js / WebGL" },
      { k: "Scroll", v: "Lenis + ScrollTrigger" },
      { k: "Input", v: "Scroll + pointer" },
      { k: "Fallback", v: "Static, reduced-motion" },
    ],
  },
  {
    slug: "weall",
    index: "03",
    name: "WeAll",
    category: "Product Design / Social Networking / UX",
    year: "2024 — 2025",
    role: "End-to-end UI/UX + Marketing Site Development",
    stack: ["Figma", "Design Systems", "WordPress", "HTML", "SASS", "JavaScript"],
    headline: "A social product, designed end to end.",
    standfirst:
      "I owned the UI/UX for a social networking app — high-fidelity Figma screens, the design system behind them, and every state they can be in. Then I built the marketing site as a custom WordPress theme from scratch.",
    personality: "editorial",
    shots: [
      {
        src: "/work/weall/01-map.png",
        alt: "WeAll app: a map of nearby users, with a selected profile card showing distance, online status and a send-message action.",
        frame: "phone",
        caption: "Nearby discovery · map, filters",
        spec: "393 × 852 pt",
      },
      {
        src: "/work/weall/02-profile.png",
        alt: "WeAll app: a second screen from the product, designed in the same system.",
        frame: "phone",
        caption: "Profiles, groups and messaging",
        spec: "393 × 852 pt",
      },
    ],
    chapters: [
      {
        label: "Scope",
        title: "Community, groups, messaging, maps.",
        body: "Nearby-user discovery with filters, group and community spaces, messaging, profiles, notifications and settings. A social product is mostly edge cases — the empty group, the muted thread, the profile with nothing in it yet — so those got designed alongside the happy path rather than after it.",
      },
      {
        label: "The system",
        title: "Components, states, and the rules between them.",
        body: "A design system covering components, states, typography and iconography. The value of a system in a product this broad is not consistency for its own sake; it is that a new screen becomes an assembly job instead of a design negotiation.",
      },
      {
        label: "Language",
        title: "Bilingual from the layout up.",
        body: "Bilingual interface support, handled as a layout constraint rather than a translation pass. Labels get room to grow, components stop assuming English string lengths, and typography holds up in both languages.",
      },
      {
        label: "Build",
        title: "A marketing site, hand-built.",
        body: "The public site was developed as a custom WordPress theme from scratch — no page builder, no purchased theme. Designing the thing and then building it meant the site that shipped was the site that was drawn.",
      },
    ],
    facts: [
      { k: "Ownership", v: "End-to-end UI/UX" },
      { k: "Deliverable", v: "Design system + screens" },
      { k: "Languages", v: "Bilingual UI" },
      { k: "Site", v: "Custom WP theme" },
    ],
  },
  {
    slug: "myvitalview",
    index: "04",
    name: "MyVitalView",
    category: "Healthcare / Product / Frontend",
    year: "2025 — 2026",
    role: "Frontend Engineering + UI/UX",
    stack: ["Next.js", "React.js", "Tailwind CSS", "GSAP", "REST APIs", "Figma"],
    headline: "Clinical data, made legible.",
    standfirst:
      "A healthcare platform with four portals behind it — Care Provider, Staff, Client and Admin — plus a multilingual, server-rendered marketing site. The whole brief was legibility: vitals, care plans and alerts read correctly at a glance, by people who are busy.",
    personality: "precision",
    shots: [
      {
        src: "/work/myvitalview/01-provider.png",
        alt: "MyVitalView: a care provider dashboard showing vital-sign trends, care plans and alerts.",
        frame: "browser",
        label: "myvitalview / care provider",
        caption: "Care provider · clinical dashboard",
        spec: "1440 × 900",
      },
      {
        src: "/work/myvitalview/02-client.png",
        alt: "MyVitalView: the client-facing portal, presenting the same record for a different reader.",
        frame: "browser",
        label: "myvitalview / client",
        caption: "Client portal · the same record, read differently",
        spec: "1440 × 900",
      },
    ],
    chapters: [
      {
        label: "Front of house",
        title: "Server-rendered, multilingual, indexed.",
        body: "The marketing site is built on Next.js with server-rendered routes, SEO and multilingual content, with scroll-linked animation used sparingly. In healthcare, restraint reads as credibility — motion has to clarify, not perform.",
      },
      {
        label: "Four portals",
        title: "One system, four vantage points.",
        body: "Care Provider, Staff, Client and Admin portals share components but not priorities. The same underlying record surfaces differently depending on who is looking and what they are about to do about it.",
      },
      {
        label: "Reading vitals",
        title: "Graphs that answer a question.",
        body: "Clinical dashboards with vital graphs, care plans and alerts. A vital sign chart is not a chart problem, it is a threshold problem: the design has to make normal boring and abnormal impossible to miss.",
      },
      {
        label: "Intake",
        title: "Onboarding, questionnaires, analytics.",
        body: "Onboarding workflows and questionnaires that gather clinical detail without feeling like a form, plus the analytics views that make sense of what came back. Long flows live or die on knowing where you are and how much is left.",
      },
    ],
    facts: [
      { k: "Portals", v: "4" },
      { k: "Rendering", v: "Server-rendered (Next.js)" },
      { k: "Content", v: "Multilingual + SEO" },
      { k: "Surfaces", v: "Dashboards, alerts, plans" },
    ],
  },
];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
