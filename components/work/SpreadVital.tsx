"use client";

/**
 * Spread 04 — calm, precise, and the only symmetric composition in the set.
 * After three asymmetric spreads, centring the type reads as restraint rather
 * than default. Cool paper ground separates it from the warm sheet above.
 */

import { useRef } from "react";
import Reveal from "@/components/primitives/Reveal";
import SplitLines from "@/components/primitives/SplitLines";
import { SpecColumns, Anno } from "@/components/primitives/Marks";
import { MetaRow } from "@/components/work/ProjectMeta";
import ViewProject from "@/components/work/ViewProject";
import VitalCharts from "@/components/work/VitalCharts";
import type { Project } from "@/data/projects";

export default function SpreadVital({ project }: { project: Project }) {
  const media = useRef<HTMLDivElement>(null);

  return (
    <article
      className="relative pb-[var(--sp-section)] pt-[var(--sp-section)]"
      style={{ background: "var(--paper-2)" }}
    >
      <SpecColumns />

      <div className="grid-page relative">
        <div className="col-span-12 flex items-baseline justify-center gap-4 text-center">
          <Reveal variant="rise">
            <span className="t-display block tnum" style={{ fontSize: "clamp(2rem,3.4vw,3.25rem)", lineHeight: 0.8 }}>
              {project.index}
            </span>
          </Reveal>
          <Reveal variant="rise" delay={0.05}>
            <h3 className="t-title m-0">{project.name}</h3>
          </Reveal>
        </div>

        <Reveal variant="rise" delay={0.08} className="col-span-12 mt-3 text-center">
          <span className="t-micro dim-2">{project.category}</span>
        </Reveal>

        <SplitLines
          as="p"
          className="t-display col-span-12 m-0 mt-[clamp(2rem,5vh,3.5rem)] text-center md:col-start-2 md:col-end-12 lg:col-start-3 lg:col-end-11"
          stagger={0.07}
        >
          {project.headline}
        </SplitLines>

        <Reveal variant="rise" delay={0.1} className="col-span-12 mt-7 md:col-start-4 md:col-end-10 lg:col-start-5 lg:col-end-9">
          <p className="t-body dim m-0 text-center">{project.standfirst}</p>
        </Reveal>

        <Reveal variant="rise" delay={0.14} className="col-span-12 mt-8 flex justify-center">
          <ViewProject project={project} mediaRef={media} />
        </Reveal>
      </div>

      {/* Charts run the full grid — the only full-width visual in the set */}
      <div ref={media} className="grid-page relative mt-[clamp(3rem,9vh,6rem)]">
        <div className="col-span-12">
          <Reveal variant="mask" className="media-dim">
            <VitalCharts />
          </Reveal>
          <Anno style={{ top: "-1.6rem", left: 0 }}>COL 1 → 12 · SYMMETRIC</Anno>
        </div>
      </div>

      <div className="grid-page mt-[clamp(3rem,7vh,5rem)]">
        <Reveal variant="stagger" select=":scope > div" className="col-span-12">
          <MetaRow project={project} />
        </Reveal>
      </div>
    </article>
  );
}
