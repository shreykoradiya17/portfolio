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

      {/* Headline centered across top */}
      <div className="grid-page relative">
        <div className="col-span-12 flex flex-col items-center justify-center text-center">
          <Reveal variant="rise" className="flex items-baseline justify-center gap-3 md:gap-4">
            <span className="project-header-index shrink-0">
              {project.index}
            </span>
            <div className="min-w-0">
              <h3 className="project-header-title">{project.name}</h3>
              <span className="t-micro dim-2 mt-2 block">{project.category}</span>
            </div>
          </Reveal>
        </div>

        <SplitLines
          as="p"
          className="t-display col-span-12 m-0 mt-[clamp(2rem,5vh,3.5rem)] text-center md:col-start-2 md:col-end-12"
          stagger={0.07}
        >
          {project.headline}
        </SplitLines>
      </div>

      <div className="grid-page mt-[clamp(2.5rem,7vh,5rem)] items-start">
        {/* Left: 2 phone screens */}
        <div ref={media} className="col-span-12 md:col-start-1 md:col-end-5">
          <div className="mb-4 flex justify-start">
            <PlateLabel>App screens · discovery</PlateLabel>
          </div>
          <div className="media-dim">
            <ShotPair shots={project.shots?.slice(0, 2)} layout="paired" name={project.name} />
          </div>
          <Anno style={{ top: "-1.7rem", left: 0 }}>COL 1 → 4 · PAIRED</Anno>
        </div>

        {/* Middle: centered data content with equal spacing */}
        <div className="col-span-12 mt-12 flex flex-col items-center text-center md:col-start-5 md:col-end-9 md:mt-0 md:self-stretch px-2 md:px-4 lg:px-6">
          <Reveal variant="rise">
            <p className="t-body m-0 text-center">{project.standfirst}</p>
          </Reveal>

          <Reveal variant="stagger" className="mt-8 flex flex-col gap-3 w-full" select=":scope > span">
            {project.facts.map((f) => (
              <span key={f.k} className="flex items-baseline justify-between gap-4 border-b border-rule-soft pb-2">
                <span className="t-micro dim-2">{f.k}</span>
                <span className="t-meta" style={{ textTransform: "none", letterSpacing: "0.02em" }}>{f.v}</span>
              </span>
            ))}
          </Reveal>

          <Reveal variant="rise" delay={0.1} className="mt-8 flex justify-center md:mt-auto md:pt-[clamp(2rem,4vh,3rem)]">
            <ViewProject project={project} mediaRef={media} />
          </Reveal>
        </div>

        {/* Right: 2 more phone screens (mirrored drop offset for equal side spacing) */}
        <div className="col-span-12 mt-12 md:col-start-9 md:col-end-13 md:mt-0">
          <div className="mb-4 flex justify-end">
            <PlateLabel>Product flows · community & messaging</PlateLabel>
          </div>
          <div className="media-dim">
            <ShotPair shots={project.shots?.slice(2, 4)} layout="paired" name={project.name} reverse={true} />
          </div>
          <Anno style={{ top: "-1.7rem", right: 0 }}>COL 9 → 12 · PAIRED</Anno>
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
