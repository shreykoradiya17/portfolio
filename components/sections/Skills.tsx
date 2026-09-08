"use client";

/**
 * Skills as an interactive typographic index, not a wall of cards or a set of
 * invented proficiency bars. Grouped by what each thing is actually for, since
 * "React and Figma" in one flat list says nothing.
 */

import { useState } from "react";
import Reveal from "@/components/primitives/Reveal";
import { SectionMark, SpecColumns } from "@/components/primitives/Marks";
import { skills } from "@/data/site";

export default function Skills() {
  const [hot, setHot] = useState<string | null>(null);

  return (
    <section id="skills" className="section relative" aria-labelledby="skills-h">
      <SpecColumns />
      <SectionMark n="06" label="Toolkit" right={`${skills.length} groups`} />

      <div className="grid-page mt-[clamp(3rem,8vh,6rem)]">
        <h2 id="skills-h" className="sr-only">Toolkit</h2>

        <ul className="col-span-12 m-0 list-none p-0">
          {skills.map((g) => (
            <li key={g.group} className="border-t border-rule">
              <div className="grid grid-cols-12 gap-x-[var(--col-gap)] py-[clamp(1.5rem,4vh,2.5rem)]">
                <div className="col-span-12 md:col-span-3">
                  <h3 className="t-meta m-0">{g.group}</h3>
                  <span className="t-micro dim-2 mt-2 block">{g.note}</span>
                </div>

                <div className="col-span-12 mt-4 md:col-start-5 md:col-end-13 md:mt-0">
                  <ul className="m-0 flex list-none flex-wrap gap-x-[clamp(1rem,2vw,2rem)] gap-y-1 p-0">
                    {g.items.map((item) => (
                      <li key={item}>
                        <span
                          className="skill-item"
                          data-cursor="explore"
                          data-hot={hot === item ? "1" : "0"}
                          onPointerEnter={() => setHot(item)}
                          onPointerLeave={() => setHot(null)}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <span aria-hidden className="col-span-12 block h-px w-full bg-rule" />

        <Reveal variant="rise" className="col-span-12 mt-8 md:col-start-5 md:col-end-13">
          <p className="t-body dim m-0 max-w-[52ch]">
            AI-assisted tooling sits in the workflow the same way a linter does — useful,
            supervised, and not a substitute for knowing what the interface should do.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
