"use client";

/**
 * The project narrative. A numbered editorial sequence: the label sits in a
 * narrow left column like a margin note, the argument runs in the wide one.
 */

import Reveal from "@/components/primitives/Reveal";
import SplitLines from "@/components/primitives/SplitLines";
import { SpecColumns } from "@/components/primitives/Marks";
import type { Project } from "@/data/projects";

export default function ProjectChapters({ chapters }: { chapters: Project["chapters"] }) {
  return (
    <section className="relative pb-[var(--sp-section)]" aria-label="Project narrative">
      <SpecColumns />
      <ol className="m-0 list-none p-0">
        {chapters.map((c, i) => (
          <li key={c.label} className="grid-page border-t border-rule py-[clamp(2rem,6vh,4.5rem)]">
            <div className="col-span-12 flex items-baseline gap-4 md:col-span-3 md:flex-col md:items-start md:gap-2">
              <span className="t-micro acc tnum">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-micro dim-2">{c.label}</span>
            </div>

            <div className="col-span-12 mt-5 md:col-start-5 md:col-end-13 md:mt-0 lg:col-end-11">
              <SplitLines as="h2" className="t-title m-0" stagger={0.055}>
                {c.title}
              </SplitLines>
              <Reveal variant="rise" delay={0.06}>
                <p className="t-body dim mt-5 max-w-[62ch]">{c.body}</p>
              </Reveal>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
