"use client";

/**
 * The thesis, stated once.
 *
 * Two sentences, set at the same size but on opposing edges and offset
 * vertically — two plates that have not quite been aligned. The composition
 * argues the point before you read it.
 */

import SplitLines from "@/components/primitives/SplitLines";
import Reveal from "@/components/primitives/Reveal";
import { SectionMark, SpecColumns, Anno } from "@/components/primitives/Marks";
import { site } from "@/data/site";

export default function Positioning() {
  return (
    <section id="position" className="section relative" aria-labelledby="position-h">
      <SpecColumns />
      <SectionMark n="01" label="Position" right="The thesis" />

      <div className="grid-page relative mt-[clamp(3rem,9vh,7rem)]">
        <h2 id="position-h" className="sr-only">
          Design is a decision. Code is the proof.
        </h2>

        {/* Plate one — left edge */}
        <SplitLines as="p" className="t-display col-span-12 m-0 md:col-span-9 lg:col-span-8">
          Design is
          <br />
          a decision.
        </SplitLines>

        {/* Plate two — pushed right and down, deliberately out of register */}
        <SplitLines
          as="p"
          delay={0.12}
          className="t-display col-span-12 m-0 mt-[clamp(0.5rem,2vh,1.75rem)] text-left md:col-start-4 md:col-end-13 md:text-right lg:col-start-5 lg:col-end-13"
        >
          Code is
          <br />
          the proof.
        </SplitLines>

        <Anno style={{ top: "-1.5rem", right: 0 }}>OFFSET · 3 COL / +1 LINE</Anno>
      </div>

      <div className="grid-page mt-[clamp(3.5rem,11vh,9rem)]">
        <Reveal variant="rule" className="col-span-12 mb-8 h-px w-full bg-rule" />

        <div className="col-span-12 md:col-span-3">
          <Reveal variant="stagger" className="flex flex-col gap-3">
            <span className="t-meta dim">Approach</span>
            <span className="t-meta">{site.tenure}</span>
            <span className="t-meta">{site.city}, India</span>
          </Reveal>
        </div>

        <div className="col-span-12 mt-8 md:col-start-5 md:col-end-12 md:mt-0 lg:col-start-6 lg:col-end-12">
          <SplitLines as="p" className="t-lead m-0" stagger={0.055}>
            Nearly four years across interface design and frontend engineering — most of
            it on products where the design had to survive contact with real data, real
            roles and real deadlines.
          </SplitLines>

          <Reveal variant="rise" delay={0.1}>
            <p className="t-body dim mt-6 max-w-[52ch]">
              I work in Figma and in the repository, usually on the same afternoon.
              Systems first, then the components that implement them. The part most
              people call handoff is where I do my best work — because there isn&rsquo;t one.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
