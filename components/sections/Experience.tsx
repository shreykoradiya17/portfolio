"use client";

/**
 * Experience as a typographic timeline. No cards.
 *
 * The rail on the left names the progression the roles actually describe —
 * web design into UI/UX into frontend into leadership — because that arc is
 * the point of this section, not the job titles on their own.
 */

import { useState } from "react";
import Reveal from "@/components/primitives/Reveal";
import { SectionMark, SpecColumns } from "@/components/primitives/Marks";
import { experience, progression } from "@/data/site";

export default function Experience() {
  const [hot, setHot] = useState<number | null>(null);

  return (
    <section id="experience" className="section relative" aria-labelledby="exp-h">
      <SpecColumns />
      <SectionMark n="05" label="Experience" right="2022 — present" />

      <div className="grid-page mt-[clamp(3rem,8vh,6rem)]">
        <h2 id="exp-h" className="sr-only">Experience</h2>

        {/* The arc, stated once */}
        <Reveal variant="stagger" select=":scope > span" className="col-span-12 mb-[clamp(2.5rem,7vh,5rem)] flex flex-wrap items-center gap-x-3 gap-y-2">
          {progression.map((p, i) => (
            <span key={p} className="flex items-center gap-3">
              <span className="t-meta" style={{ color: i === progression.length - 1 ? "var(--vermilion)" : undefined }}>
                {p}
              </span>
              {i < progression.length - 1 ? (
                <span aria-hidden className="t-meta dim-2">→</span>
              ) : null}
            </span>
          ))}
        </Reveal>

        <ol className="col-span-12 m-0 list-none p-0">
          {experience.map((role, i) => (
            <li
              key={`${role.company}-${role.from}`}
              className="exp-row border-t border-rule"
              data-hot={hot === i ? "1" : "0"}
              onPointerEnter={() => setHot(i)}
              onPointerLeave={() => setHot(null)}
            >
              <div className="grid grid-cols-12 gap-x-[var(--col-gap)] py-[clamp(1.5rem,4vh,2.75rem)]">
                {/* Dates */}
                <div className="col-span-12 md:col-span-3">
                  <span className="t-meta tnum exp-year block">
                    {role.from} — {role.to}
                  </span>
                  <span className="t-micro dim-2 mt-2 block">{role.stage}</span>
                </div>

                {/* Title */}
                <div className="col-span-12 mt-3 md:col-span-5 md:mt-0">
                  <h3 className="t-title m-0">{role.title}</h3>
                  <span className="t-meta dim mt-2 block" style={{ textTransform: "none", letterSpacing: "0.03em" }}>
                    {role.company}
                  </span>
                </div>

                {/* Detail */}
                <div className="col-span-12 mt-4 md:col-span-4 md:mt-0">
                  <p className="t-body dim m-0">{role.body}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                    {role.tags.map((t) => (
                      <span key={t} className="t-micro dim-2">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <span aria-hidden className="col-span-12 block h-px w-full bg-rule" />
      </div>
    </section>
  );
}
