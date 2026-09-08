"use client";

/**
 * Selected work.
 *
 * Four spreads, four compositions, one shared metadata voice. No card grid:
 * spread 01 is grid-locked and technical, 02 is full-bleed ink with a live
 * scene, 03 mirrors 01 and runs editorial, 04 is the only symmetric one. The
 * variety is the point — a series, not a template applied four times.
 */

import { projects } from "@/data/projects";
import { SectionMark } from "@/components/primitives/Marks";
import SpreadErp from "@/components/work/SpreadErp";
import SpreadCrush from "@/components/work/SpreadCrush";
import SpreadWeall from "@/components/work/SpreadWeall";
import SpreadVital from "@/components/work/SpreadVital";

export default function WorkIndex() {
  const [erp, crush, weall, vital] = projects;

  return (
    <section id="work" aria-labelledby="work-h" className="relative pt-[var(--sp-section)]">
      <h2 id="work-h" className="sr-only">Selected work</h2>
      <SectionMark n="02" label="Selected work" right={`${projects.length} projects · 2022 — 2026`} />

      <div className="mt-[clamp(3rem,9vh,7rem)]">
        <SpreadErp project={erp} />
        <SpreadCrush project={crush} />
        <SpreadWeall project={weall} />
        <SpreadVital project={vital} />
      </div>
    </section>
  );
}
