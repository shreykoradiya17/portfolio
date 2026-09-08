"use client";

/**
 * Spread 03 — editorial and human. The mirror of spread 01: specimen on the
 * left, text pushed right and down, headline allowed to run wide.
 */

import { useRef } from "react";
import Reveal from "@/components/primitives/Reveal";
import SplitLines from "@/components/primitives/SplitLines";
import { SpecColumns, Anno } from "@/components/primitives/Marks";
import { MetaRow, PlateLabel } from "@/components/work/ProjectMeta";
import ViewProject from "@/components/work/ViewProject";
import ShotPair from "@/components/work/ShotPair";
import type { Project } from "@/data/projects";

export default function SpreadWeall({ project }: { project: Project }) {
  const media = useRef<HTMLDivElement>(null);

  return (
    <article className="relative pb-[var(--sp-section)] pt-[var(--sp-section)]">
      <SpecColumns />

      {/* Headline runs wide across the top, breaking the two-column reading */}
      <div className="grid-page relative">
        <div className="col-span-12 flex items-baseline gap-4 md:col-span-11">
          <Reveal variant="rise">
            <span className="t-display block tnum" style={{ fontSize: "clamp(2.5rem,4.6vw,4.5rem)", lineHeight: 0.8 }}>
              {project.index}
            </span>
          </Reveal>
          <div className="min-w-0">
            <Reveal variant="rise" delay={0.05}>
              <h3 className="t-title m-0">{project.name}</h3>
              <span className="t-micro dim-2 mt-2 block">{project.category}</span>
            </Reveal>
          </div>
        </div>

        <SplitLines
          as="p"
          className="t-display col-span-12 m-0 mt-[clamp(2rem,5vh,3.5rem)] md:col-span-10"
          stagger={0.07}
        >
          {project.headline}
        </SplitLines>
      </div>

      <div className="grid-page mt-[clamp(2.5rem,7vh,5rem)] items-start">
        {/* Specimen leads on the left this time */}
        {/* Two devices, the second dropped a beat so the pair has rhythm */}
        <div ref={media} className="col-span-12 md:col-start-1 md:col-end-6 lg:col-end-6">
          <div className="mb-4">
            <PlateLabel>App screens · designed end to end</PlateLabel>
          </div>
          <div className="media-dim">
            <ShotPair shots={project.shots} layout="paired" name={project.name} />
          </div>
          <Anno style={{ top: "-1.7rem", left: 0 }}>COL 1 → 5 · PAIRED</Anno>
        </div>

        {/* Text offset right and dropped a beat */}
        <div className="col-span-12 mt-12 flex flex-col md:col-start-7 md:col-end-13 md:mt-[clamp(1rem,4vh,3rem)] md:self-stretch lg:col-start-7 lg:col-end-12">
          <Reveal variant="rise">
            <p className="t-body m-0 max-w-[44ch]">{project.standfirst}</p>
          </Reveal>

          <Reveal variant="stagger" className="mt-8 flex flex-col gap-3 md:max-w-[30rem]" select=":scope > span">
            {project.facts.map((f) => (
              <span key={f.k} className="flex items-baseline justify-between gap-4 border-b border-rule-soft pb-2">
                <span className="t-micro dim-2">{f.k}</span>
                <span className="t-meta" style={{ textTransform: "none", letterSpacing: "0.02em" }}>{f.v}</span>
              </span>
            ))}
          </Reveal>

          {/* Pushed to the foot of the column so it lands level with the
              device's base instead of leaving one open corner. */}
          <Reveal variant="rise" delay={0.1} className="mt-8 md:mt-auto md:pt-[clamp(2rem,6vh,4rem)]">
            <ViewProject project={project} mediaRef={media} />
          </Reveal>
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
