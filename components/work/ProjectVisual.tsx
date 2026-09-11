"use client";

/**
 * A project page's visuals: both captures, framed for the medium, then the
 * generated composition that explains the thinking behind them.
 *
 * The split is deliberate. A home spread shows the artifact; the project page
 * shows the artifact and then the system or specimen that produced it.
 * MyVitalView has no study — its two portals make the point on their own.
 */

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView, usePointerFine, useReducedMotion } from "@/lib/hooks";
import Reveal from "@/components/primitives/Reveal";
import ProjectShot from "@/components/work/ProjectShot";
import ErpSystemMap from "@/components/work/ErpSystemMap";
import WeallSpecimen from "@/components/work/WeallSpecimen";
import ShotPair, { type PairLayout } from "@/components/work/ShotPair";
import { PlateLabel } from "@/components/work/ProjectMeta";
import type { Project } from "@/data/projects";

const PlatesScene = dynamic(() => import("@/components/three/PlatesScene"), {
  ssr: false,
  loading: () => null,
});

function SceneStage() {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const active = useInView(stage, { threshold: 0.02, rootMargin: "220px", once: false });

  return (
    <figure className="m-0">
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <PlateLabel tone="paper">
          {reduced ? "Scene · static (reduced motion)" : "Scene · live WebGL"}
        </PlateLabel>
        <span className="t-micro dim-2">Two plates · pointer driven</span>
      </figcaption>
      <div
        ref={stage}
        className="relative h-[52svh] min-h-[300px] border md:h-[64svh]"
        style={{ borderColor: "var(--rule)" }}
        data-cursor="explore"
      >
        {active ? <PlatesScene active={active} reduced={reduced} pointer={fine} /> : null}
      </div>
    </figure>
  );
}

/** The generated composition behind each project, where there is one. */
function Study({ project }: { project: Project }) {
  switch (project.personality) {
    case "system": return <ErpSystemMap />;
    case "immersive": return <SceneStage />;
    case "editorial": return <WeallSpecimen />;
    default: return null;
  }
}

/** Each project keeps its own pair arrangement on the project page too. */
const LAYOUT: Record<Project["personality"], PairLayout> = {
  system: "staggered",
  immersive: "layered",
  editorial: "paired",
  precision: "balanced",
};

export default function ProjectVisual({ project }: { project: Project }) {
  const onInk = project.personality === "immersive";
  const study = <Study project={project} />;

  return (
    <div className="flex flex-col gap-[clamp(3rem,9vh,7rem)]">
      {/* Any explicitly supplied media wins outright. */}
      {project.media?.length ? (
        <figure className="m-0 flex flex-col gap-6">
          {project.media.map((m) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={m.src} src={m.src} alt={m.alt} loading="lazy" decoding="async" className="w-full" />
          ))}
        </figure>
      ) : (
        project.shots?.length ? (
          <div>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <PlateLabel tone={onInk ? "paper" : "ink"}>
                {project.shots[0].frame === "phone" ? "App screens" : "Web screens"}
              </PlateLabel>
              <span className="t-micro dim-2">
                {project.shots.length} of the surfaces
              </span>
            </div>
            {/* 4 Phone screens grid layout */}
            {project.shots.length > 2 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-[clamp(1rem,2vw,2rem)] items-start">
                {project.shots.map((shot, index) => (
                  <figure key={shot.src + index} className="m-0 w-full">
                    <Reveal variant="media" delay={index * 0.08} className="w-full">
                      <ProjectShot shot={shot} label={`${project.name} screen ${index + 1}`} />
                    </Reveal>
                    {shot.caption ? (
                      <figcaption
                        className="t-micro mt-3 flex items-baseline gap-2 leading-relaxed"
                        style={{ color: onInk ? "#6B6862" : "var(--graphite-2)" }}
                      >
                        <span aria-hidden className="mt-[0.4em] block h-[5px] w-[5px] shrink-0" style={{ background: "var(--vermilion)" }} />
                        {shot.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            ) : (
              <ShotPair
                shots={project.shots}
                layout={LAYOUT[project.personality]}
                name={project.name}
                tone={onInk ? "paper" : "ink"}
              />
            )}
          </div>
        ) : null
      )}

      {study}
    </div>
  );
}
