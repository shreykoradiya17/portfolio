"use client";

/**
 * A project page's visuals: the captured screen first, framed for its medium,
 * then the generated composition that explains the thinking behind it.
 *
 * The split is deliberate. The home spread shows the artifact; the project page
 * shows the artifact and then the system, the specimen or the data study that
 * produced it.
 */

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView, usePointerFine, useReducedMotion } from "@/lib/hooks";
import ErpSystemMap from "@/components/work/ErpSystemMap";
import WeallSpecimen from "@/components/work/WeallSpecimen";
import VitalCharts from "@/components/work/VitalCharts";
import ProjectShot from "@/components/work/ProjectShot";
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

/** The generated composition behind each project. */
function Study({ project }: { project: Project }) {
  switch (project.personality) {
    case "system": return <ErpSystemMap />;
    case "immersive": return <SceneStage />;
    case "editorial": return <WeallSpecimen />;
    case "precision": return <VitalCharts />;
  }
}

export default function ProjectVisual({ project }: { project: Project }) {
  const onInk = project.personality === "immersive";

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
        project.shot && (
          <figure className="m-0">
            <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <PlateLabel tone={onInk ? "paper" : "ink"}>
                {project.shot.frame === "phone" ? "App screen" : "Web screen"}
              </PlateLabel>
              {project.shot.label ? (
                <span className="t-micro dim-2">{project.shot.label}</span>
              ) : null}
            </figcaption>
            <div className={project.shot.frame === "phone" ? "flex justify-center md:justify-start" : ""}>
              <ProjectShot
                shot={project.shot}
                label={`${project.name} screen`}
                height={project.shot.frame === "phone" ? "min(72svh, 660px)" : "min(64svh, 620px)"}
                sizes={project.shot.frame === "phone"
                  ? "(max-width: 767px) 62vw, 30vw"
                  : "(max-width: 767px) 92vw, 84vw"}
              />
            </div>
          </figure>
        )
      )}

      <Study project={project} />
    </div>
  );
}
