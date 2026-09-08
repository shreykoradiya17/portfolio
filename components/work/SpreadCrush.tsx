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
import ProjectShot from "@/components/work/ProjectShot";
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
          <Reveal variant="rise" className="col-span-3 md:col-span-1">
            <span className="t-display block tnum" style={{ fontSize: "clamp(2.5rem,4.6vw,4.5rem)", lineHeight: 0.8 }}>
              {project.index}
            </span>
          </Reveal>
          <div className="col-span-9 md:col-span-4">
            <Reveal variant="rise" delay={0.05}>
              <h3 className="t-title m-0">{project.name}</h3>
              <span className="t-micro dim-2 mt-2 block">{project.category}</span>
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

      {/* The shipped site, after the technique that made it */}
      <div className="grid-page mt-[clamp(3rem,10vh,7rem)]">
        <div className="col-span-12 md:col-end-11">
          <figure className="m-0">
            <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <PlateLabel tone="paper">Marketing site · home</PlateLabel>
              <span className="t-micro dim-2">Scroll-linked reveals, pinned sections</span>
            </figcaption>
            <Reveal variant="media">
              <ProjectShot
                shot={project.shot}
                label={`${project.name} marketing site`}
                height="min(66svh, 670px)"
                sizes="(max-width: 767px) 92vw, 78vw"
              />
            </Reveal>
          </figure>
        </div>
      </div>

      <div className="grid-page mt-[clamp(3rem,8vh,6rem)]">
        <Reveal variant="stagger" select=":scope > div" className="col-span-12">
          <MetaRow project={project} />
        </Reveal>
      </div>
    </article>
  );
}
