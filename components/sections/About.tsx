"use client";

/**
 * About, as an editorial spread rather than a bio block.
 *
 * The headline makes an argument instead of introducing a person, and the
 * facts alongside it are the ones the résumé actually supports. No portrait —
 * there isn't one to use, and a stock stand-in would undo the whole point.
 */

import Reveal from "@/components/primitives/Reveal";
import SplitLines from "@/components/primitives/SplitLines";
import { SectionMark, SpecColumns, Anno } from "@/components/primitives/Marks";
import { site } from "@/data/site";

const PRACTICE = [
  { k: "Experience", v: site.tenure },
  { k: "Now", v: "UI/UX & Frontend Lead" },
  { k: "Based", v: `${site.city}, India` },
  { k: "Works in", v: "Figma + the repository" },
];

export default function About() {
  return (
    <section id="about" className="section relative" aria-labelledby="about-h">
      <SpecColumns />
      <SectionMark n="04" label="About" right={site.tenure.toLowerCase()} />

      <div className="grid-page mt-[clamp(3rem,9vh,7rem)]">
        {/* The argument, allowed to run wide */}
        <SplitLines as="h2" id="about-h" className="t-display col-span-12 m-0 md:col-span-10">
          Taste is a<br />
          technical skill.
        </SplitLines>

        <Anno style={{ top: "-1.6rem", right: 0 }}>H2 · 10 COL · WDTH 90</Anno>
      </div>

      <div className="grid-page mt-[clamp(3rem,9vh,6rem)] items-start">
        {/* Facts, hard left, small */}
        <Reveal
          variant="stagger"
          select=":scope > div"
          className="col-span-12 flex flex-col gap-4 md:col-span-3"
        >
          {PRACTICE.map((f) => (
            <div key={f.k} className="border-t border-rule pt-2.5">
              <span className="t-micro dim-2 mb-1.5 block">{f.k}</span>
              <span className="t-meta block" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
                {f.v}
              </span>
            </div>
          ))}
        </Reveal>

        {/* Prose, offset right */}
        <div className="col-span-12 mt-10 md:col-start-5 md:col-end-13 md:mt-0 lg:col-start-5 lg:col-end-12">
          <SplitLines as="p" className="t-lead m-0" stagger={0.05}>
            The interesting decisions in interface work are not visual ones. They are
            decisions about what a component owes, which states are real, and what
            happens when the data is longer than the mock.
          </SplitLines>

          <Reveal variant="rise" delay={0.08}>
            <p className="t-body dim mt-7 max-w-[58ch]">
              I have spent nearly four years moving between those two positions. Enterprise
              products where a permission model has to be legible to eight different roles.
              A healthcare platform where a threshold matters more than a chart. A social
              product designed end to end, then a marketing site hand-built to match it.
            </p>
          </Reveal>

          <Reveal variant="rise" delay={0.12}>
            <p className="t-body dim mt-5 max-w-[58ch]">
              Now I lead that work: design direction and frontend architecture, design
              systems that hold up past their first screen, and the client conversations
              where scope and reality get reconciled. I care about performance and
              accessibility for an unglamorous reason — they are the parts of a design that
              are easiest to claim and hardest to fake.
            </p>
          </Reveal>

          <Reveal variant="rise" delay={0.16}>
            <p className="t-lead mt-9 max-w-[40ch]">
              I would rather ship one interface that holds together
              <span className="t-serif"> than</span> ten that photograph well.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
