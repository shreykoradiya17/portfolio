"use client";

/**
 * Spread 01 — structured, grid-locked, technical.
 *
 * A narrow spec column against a stepped pair of windows: the second indented
 * beneath the first, so the two read as a system rather than a gallery. The
 * most rigid composition in the set on purpose — it is the enterprise project.
 */

import { useRef } from "react";
import Reveal from "@/components/primitives/Reveal";
import SplitLines from "@/components/primitives/SplitLines";
import { SpecColumns, Anno } from "@/components/primitives/Marks";
import { MetaRow, PlateLabel } from "@/components/work/ProjectMeta";
import ViewProject from "@/components/work/ViewProject";
import ShotPair from "@/components/work/ShotPair";
import type { Project } from "@/data/projects";

export default function SpreadErp({ project }: { project: Project }) {
  const media = useRef<HTMLDivElement>(null);

  return (
    <article className="relative pb-[var(--sp-section)]">
      <SpecColumns />

      <div className="grid-page relative items-start">
        {/* ---- Row 1, narrow column: the name plate --------------------- */}
        <div className="col-span-12 md:col-start-1 md:col-end-5">
          <Reveal variant="rise" className="flex items-baseline gap-4">
            <span
              className="t-display block tnum shrink-0"
              style={{ fontSize: "clamp(2.5rem,4.4vw,4.25rem)", lineHeight: 0.78 }}
            >
              {project.index}
            </span>
            <span className="min-w-0">
              <h3 className="t-title m-0">{project.name}</h3>
            </span>
          </Reveal>
          <Reveal variant="rise" delay={0.06}>
            <span className="t-micro dim-2 mt-3 block border-t border-rule pt-2">
              {project.category}
            </span>
          </Reveal>
        </div>

        {/* ---- The pair, spanning both rows ----------------------------- */}
        <div
          ref={media}
          className="col-span-12 mt-12 md:col-start-5 md:col-end-13 md:row-start-1 md:row-end-3 md:mt-0 md:self-start"
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <PlateLabel>Web app · two modules</PlateLabel>
            <span className="t-micro dim-2">Eight modules, one component library</span>
          </div>
          <div className="media-dim">
            <ShotPair shots={project.shots} layout="staggered" name={project.name} />
          </div>
          <Anno style={{ top: "-1.6rem", left: 0 }}>COL 5 → 12 · STAGGERED</Anno>
        </div>

        {/* ---- Row 2, narrow column: the argument ----------------------- */}
        <div className="col-span-12 mt-10 md:col-start-1 md:col-end-5 md:mt-[clamp(2rem,5vh,3.5rem)]">
          <SplitLines as="p" className="t-title m-0" stagger={0.06}>
            {project.headline}
          </SplitLines>

          <Reveal variant="rise" delay={0.08}>
            <p className="t-body dim mt-5">{project.standfirst}</p>
          </Reveal>

          <Reveal variant="stagger" className="mt-8 flex flex-col gap-3" select=":scope > span">
            {project.facts.map((f) => (
              <span
                key={f.k}
                className="flex items-baseline justify-between gap-4 border-b border-rule-soft pb-2"
              >
                <span className="t-micro dim-2">{f.k}</span>
                <span className="t-meta tnum" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
                  {f.v}
                </span>
              </span>
            ))}
          </Reveal>

          <Reveal variant="rise" delay={0.12} className="mt-8">
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
