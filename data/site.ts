export const site = {
  name: "Shrey Patel",
  role: "UI/UX & Frontend Lead",
  discipline: "UI/UX × Frontend × Creative Development",
  city: "Ahmedabad",
  region: "Gujarat, India",
  coords: "23.02°N / 72.57°E",
  timezone: "Asia/Kolkata",
  email: "shreykoradiya17@gmail.com",
  linkedin: "https://www.linkedin.com/in/shrey-patel-ui-ux/",
  year: "2026",
  status: "Available for select projects",
  /** Nearly four years — 2022 to present. Stated as the résumé states it. */
  tenure: "Nearly four years",
} as const;

export const experience = [
  {
    from: "2026",
    to: "Present",
    title: "UI/UX & Frontend Lead",
    company: "Technource",
    stage: "Leadership",
    body: "Leading interface design and frontend delivery: design direction, architecture decisions, code review, and the client conversations that shape both.",
    tags: ["Design direction", "Frontend architecture", "Design systems", "Client communication"],
  },
  {
    from: "2024",
    to: "2026",
    title: "Web & UI/UX Designer",
    company: "Technource",
    stage: "Product",
    body: "Designed and built product interfaces across enterprise and consumer work — moving from Figma into React in the same week, on the same problem.",
    tags: ["Product UI/UX", "React", "Next.js", "Component libraries"],
  },
  {
    from: "2022",
    to: "2024",
    title: "Web Designer",
    company: "Apptisam",
    stage: "Craft",
    body: "Where the fundamentals were set: layout, type, and the habit of building what I drew rather than handing it over.",
    tags: ["Layout", "Typography", "HTML / CSS", "WordPress"],
  },
] as const;

/** The progression the timeline draws. */
export const progression = ["Web design", "UI/UX", "Frontend", "Leadership"] as const;

export type SkillGroup = { group: string; note: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    group: "Engineering",
    note: "What I build in.",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "SASS", "REST APIs"],
  },
  {
    group: "Interface",
    note: "How it gets drawn.",
    items: ["Figma", "Design systems", "UX design", "Product design", "Prototyping"],
  },
  {
    group: "Motion & 3D",
    note: "Where it comes alive.",
    items: ["GSAP", "ScrollTrigger", "Three.js", "Creative development"],
  },
  {
    group: "Systems & tooling",
    note: "What holds it together.",
    items: ["Tailwind CSS", "Shadcn UI", "Bootstrap", "WordPress"],
  },
  {
    group: "AI-assisted workflow",
    note: "Part of the toolchain now.",
    items: ["Cursor", "Claude", "ChatGPT", "Antigravity"],
  },
];

/** The pipeline section. Each stage has a drawn state and a built state. */
export const pipeline = [
  {
    id: "figma",
    stage: "Figma",
    kicker: "Draw",
    line: "Decisions get made here, cheaply.",
    body: "Layout, hierarchy and states, resolved while they still cost nothing to change. Most of the thinking is done before a component exists.",
  },
  {
    id: "system",
    stage: "System",
    kicker: "Constrain",
    line: "Type, space, colour, states.",
    body: "Choices become rules: a type scale, a spacing rhythm, a colour set, the states every component owes. This is the part that makes the next hundred screens fast.",
  },
  {
    id: "component",
    stage: "Component",
    kicker: "Resolve",
    line: "One thing, every state it can be in.",
    body: "Default, hover, focus, active, loading, empty, error, disabled. A component is not finished when it looks right — it is finished when it cannot look wrong.",
  },
  {
    id: "code",
    stage: "Code",
    kicker: "Build",
    line: "React, TypeScript, real data.",
    body: "The implementation is where design assumptions get tested. Real content is longer than the mock, the API is slower, and the edge case shows up on day one.",
  },
  {
    id: "interaction",
    stage: "Interaction",
    kicker: "Tune",
    line: "Timing, easing, feedback.",
    body: "Motion is the last 5% that decides whether the thing feels considered. Durations, easings, and knowing which elements should not move at all.",
  },
  {
    id: "product",
    stage: "Product",
    kicker: "Ship",
    line: "Performance, access, then live.",
    body: "Budgets, keyboard paths, contrast, reduced motion. Shipping is a design stage, not an afterthought — it is where the work either holds up or does not.",
  },
] as const;
