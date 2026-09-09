# Shrey Patel — Portfolio

Personal portfolio for **Shrey Patel**, UI/UX & Frontend Lead.
UI/UX × Frontend × Creative Development. Ahmedabad, India.

## The idea

The site is built around one concept: **DRAWN / BUILT**.

Everything on the page belongs to one of two layers. The *built* layer is the
shipped thing — typeset, solid, finished. The *drawn* layer is the design file
behind it — hairlines, dimension marks, column rules, monospace annotations.

Two consequences run through the whole build:

- **Spec mode.** Press <kbd>S</kbd> anywhere to reveal the drawn layer over the
  live page: the 12-column grid, section coordinates, spacing dimensions and
  component names, annotated in blueprint ink. It only ships if the underlying
  layout is genuinely rigorous, which is the point.
- **Two inks that never mix.** Vermilion belongs to the built layer, blueprint
  to the drawn layer. They are two printing plates that have to register.

The hero states it literally: the headline is set as two plates, an ink plate
and a vermilion plate, resting slightly out of register and drifting further
apart as the pointer moves.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS 4 (CSS-first `@theme`) |
| Motion | GSAP 3 + ScrollTrigger, SplitText, DrawSVG |
| Smooth scroll | Lenis |
| 3D | three.js (one scene, code-split and viewport-gated) |
| Type | Archivo (variable `wdth`), Geist Mono, Instrument Serif |

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build; all routes prerender
npm start
```

## Structure

```
app/
  layout.tsx            fonts, metadata, providers, chrome
  page.tsx              the single-page composition
  work/[slug]/page.tsx  four prerendered project pages
  globals.css           the design system: tokens, type scale, grid, spec layer
components/
  chrome/               Nav, Cursor, SmoothScroll, Registration, SpecHud
  sections/             Hero, Positioning, WorkIndex, Pipeline, Marquee,
                        About, Experience, Skills, Contact, Footer
  work/                 four bespoke project spreads + their visuals
  primitives/           Reveal, SplitLines, Magnetic, LocalTime, Marks
  three/                PlatesScene
data/
  projects.ts           project content (single source of truth)
  site.ts               identity, experience, skills, pipeline
lib/
  motion.ts             four easings, three durations, one stagger law
  gsap.ts  spec.tsx  transition.tsx  intro.tsx  hooks.ts
```

## A note on the project imagery

No screenshots of these products were available, and inventing them would have
been dishonest. So each project renders a **bespoke generated composition**
instead, labelled as what it is:

- **Technource ERP** — a system map drawn from the architecture
- **CrushWithMe** — a live WebGL scene of two plates, in and out of register
- **WeAll** — a real design specimen: type ramp, component states, string-length tolerance
- **MyVitalView** — SVG data studies from deterministic seeded values, no patient data

`data/projects.ts` accepts real `media` paths. The moment real captures exist,
they take precedence and the generated composition steps aside.

## Behaviour

- **Reduced motion** is a single gate. With `prefers-reduced-motion: reduce`
  the intro is skipped, Lenis never attaches, the custom cursor never mounts,
  the marquee and grain stop, and the WebGL scene renders one static frame.
- **Touch** disables the custom cursor and gets its own navigation panel rather
  than a shrunken desktop row.
- **Keyboard** reaches everything. The design/code pipeline is a real tablist
  with arrow-key navigation; spec mode is on <kbd>S</kbd> and closes on <kbd>Esc</kbd>.
- **No-JS** still renders the full page. Nothing is hidden behind an animation
  that has to run first.

## Contact

[shreykoradiya17@gmail.com](mailto:shreykoradiya17@gmail.com)
