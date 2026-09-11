"use client";

/**
 * Spread 02 — the immersive one, and the visual peak of the page.
 *
 * Full-bleed ink, a live scene held to the upper right, headline anchored
 * bottom left. The scene is loaded on demand and only renders while it is on
 * screen, so nothing here costs anything until you arrive.
 */

import { useRef } from "react";
import dynamic from "next/dynamic";
import Reveal from "@/components/primitives/Reveal";
import SplitLines from "@/components/primitives/SplitLines";
import { Anno } from "@/components/primitives/Marks";
import { MetaRow, PlateLabel } from "@/components/work/ProjectMeta";
import ShotPair from "@/components/work/ShotPair";
import ViewProject from "@/components/work/ViewProject";
import { useInView, usePointerFine, useReducedMotion } from "@/lib/hooks";
import type { Project } from "@/data/projects";

/** three.js stays out of the initial bundle entirely. */
const PlatesScene = dynamic(() => import("@/components/three/PlatesScene"), {
  ssr: false,
  loading: () => null,
});

export default function SpreadCrush({ project }: { project: Project }) {
  const media = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();

  // Only mount and run the renderer while the stage is actually in view.
  const active = useInView(stage, { threshold: 0.02, rootMargin: "220px", once: false });

  return (
    <article className="on-ink relative overflow-hidden pb-[var(--sp-section)] pt-[clamp(3rem,10vh,7rem)]">
      {/* ---- Stage --------------------------------------------------------- */}
      <div
        ref={stage}
        className="relative min-h-[62svh] md:min-h-[86svh]"
        data-cursor="explore"
      >
        <div
          ref={media}
          className="absolute inset-x-0 top-0 h-[52%] md:left-auto md:right-[-3%] md:top-0 md:h-[80%] md:w-[62%]"
        >
          {active ? <PlatesScene active={active} reduced={reduced} pointer={fine} /> : null}
        </div>

        {/* ---- Overlay content ---------------------------------------------- */}
        <div className="grid-page relative z-[2] h-full items-start">
          <div className="col-span-12 md:col-span-6">
            <Reveal variant="rise" className="flex items-baseline gap-3 md:gap-4">
              <span className="project-header-index shrink-0">
                {project.index}
              </span>
              <div className="min-w-0">
                <h3 className="project-header-title">{project.name}</h3>
                <span className="t-micro dim-2 mt-2 block">{project.category}</span>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="grid-page relative z-[2] mt-[38svh] md:mt-[34svh]">
          <div className="col-span-12 md:col-span-7 lg:col-span-6">
            <SplitLines as="p" className="t-display m-0" stagger={0.07}>
              {project.headline}
            </SplitLines>
            <Reveal variant="rise" delay={0.1}>
              <p className="t-body dim mt-6 max-w-[48ch]">{project.standfirst}</p>
            </Reveal>
            <Reveal variant="rise" delay={0.14} className="mt-7">
              <ViewProject project={project} mediaRef={media} tone="paper" />
            </Reveal>
          </div>

          <div className="col-span-12 mt-8 flex items-end md:col-start-10 md:col-end-13 md:mt-0 md:justify-end">
            <PlateLabel tone="paper">
              {reduced ? "Scene · static (reduced motion)" : "Scene · live WebGL"}
            </PlateLabel>
          </div>

          <Anno style={{ top: "-1.6rem", left: "var(--gx)" }}>SECTION · ON-INK · BLEED</Anno>
        </div>
      </div>

      {/* The shipped site, after the technique that made it. Overlapping and
          dropped — depth is earned on this spread and nowhere else. */}
      <div className="grid-page mt-[clamp(3rem,10vh,7rem)]">
        <div className="col-span-12 md:col-end-8">
          <div className="mb-4">
            <PlateLabel tone="paper">Marketing site · two moments</PlateLabel>
          </div>
          <ShotPair shots={project.shots} layout="layered" name={project.name} tone="paper" />
        </div>

        {/* The measure beside the pair carries the technical facts rather than
            sitting empty — the images stay small and the row still reads full. */}
        <div className="col-span-12 mt-10 md:col-start-9 md:col-end-13 md:mt-0">
          <span className="t-micro dim-2 mb-5 block">Scroll-linked reveals, pinned sections</span>
          <Reveal variant="stagger" className="flex flex-col gap-3" select=":scope > span">
            {project.facts.map((f) => (
              <span
                key={f.k}
                className="flex items-baseline justify-between gap-4 border-b pb-2"
                style={{ borderColor: "var(--rule-soft)" }}
              >
                <span className="t-micro dim-2">{f.k}</span>
                <span className="t-meta" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
                  {f.v}
                </span>
              </span>
            ))}
          </Reveal>
        </div>
      </div>

      <div className="grid-page mt-[clamp(6rem,16vh,11rem)]">
        <Reveal variant="stagger" select=":scope > div" className="col-span-12">
          <MetaRow project={project} />
        </Reveal>
      </div>
    </article>
  );
}
