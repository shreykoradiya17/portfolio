"use client";

/**
 * Leaving a project: onward to the next one, or back to the index. Both use
 * the same transition, so the whole set feels like one continuous surface.
 */

import { useRef } from "react";
import { useTransition } from "@/lib/transition";
import ProjectLink from "@/components/work/ProjectLink";
import Magnetic from "@/components/primitives/Magnetic";
import { SpecColumns } from "@/components/primitives/Marks";
import type { Project } from "@/data/projects";

export default function ProjectOutro({ next }: { next: Project }) {
  const { go } = useTransition();
  const stage = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={stage}
      className="on-ink relative overflow-hidden pb-[var(--sp-section)] pt-[clamp(3rem,9vh,6rem)]"
      aria-label="Continue"
    >
      <SpecColumns />

      <div className="grid-page">
        <div className="col-span-12 flex items-baseline justify-between gap-4 border-t pt-3" style={{ borderColor: "var(--rule)" }}>
          <span className="t-meta dim">Next project</span>
          <a
            href="/#work"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              go("/#work");
            }}
            className="t-meta ul-link"
            data-cursor="link"
            data-cursor-label="All work"
          >
            All work
          </a>
        </div>
      </div>

      <div className="grid-page mt-[clamp(2.5rem,7vh,5rem)]">
        <div className="col-span-12">
          <Magnetic strength={0.1} radius={260}>
            <ProjectLink project={next} mediaRef={stage} label={`Open ${next.name}`} className="block">
              <span className="t-meta acc tnum block">{next.index}</span>
              <span className="t-hero mt-3 block">{next.name}</span>
              <span className="t-micro dim mt-4 block">{next.category}</span>
            </ProjectLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
