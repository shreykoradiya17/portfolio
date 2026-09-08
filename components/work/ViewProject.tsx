"use client";

import type { RefObject } from "react";
import ProjectLink from "@/components/work/ProjectLink";
import Magnetic from "@/components/primitives/Magnetic";
import type { Project } from "@/data/projects";

/** The one control shared by all four spreads. Compositions vary; the way you
 *  enter a project should not. */
export default function ViewProject({
  project,
  mediaRef,
  tone = "ink",
}: {
  project: Project;
  mediaRef?: RefObject<HTMLElement | null>;
  tone?: "ink" | "paper";
}) {
  return (
    <Magnetic strength={0.22} radius={90}>
      <ProjectLink
        project={project}
        mediaRef={mediaRef}
        aria-label={`View project: ${project.name}`}
        className="group inline-flex items-baseline gap-3 py-1"
      >
        <span className="t-meta ul-link ul-static">View project</span>
        <span
          aria-hidden
          className="t-meta inline-block transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: tone === "paper" ? "var(--vermilion)" : "var(--vermilion)" }}
        >
          ↗
        </span>
      </ProjectLink>
    </Magnetic>
  );
}
