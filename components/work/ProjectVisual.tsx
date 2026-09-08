"use client";

/**
 * Picks a project's bespoke visual from its personality. If real captures ever
 * land in `data/projects.ts`, they take precedence and the generated
 * composition steps aside.
 */

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView, usePointerFine, useReducedMotion } from "@/lib/hooks";
import ErpSystemMap from "@/components/work/ErpSystemMap";
import WeallSpecimen from "@/components/work/WeallSpecimen";
import VitalCharts from "@/components/work/VitalCharts";
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
        className="relative h-[58svh] min-h-[320px] border md:h-[72svh]"
        style={{ borderColor: "var(--rule)" }}
        data-cursor="explore"
      >
        {active ? <PlatesScene active={active} reduced={reduced} pointer={fine} /> : null}
      </div>
    </figure>
  );
}

export default function ProjectVisual({ project }: { project: Project }) {
  if (project.media?.length) {
    return (
      <figure className="m-0">
        {project.media.map((m) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={m.src} src={m.src} alt={m.alt} loading="lazy" decoding="async" className="w-full" />
        ))}
      </figure>
    );
  }

  switch (project.personality) {
    case "system": return <ErpSystemMap />;
    case "immersive": return <SceneStage />;
    case "editorial": return <WeallSpecimen />;
    case "precision": return <VitalCharts />;
  }
}
