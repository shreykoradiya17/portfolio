"use client";

/**
 * A project's two captures.
 *
 * Four arrangements, one per project, so the pair reads differently each time
 * rather than four identical galleries:
 *
 *  staggered — ERP. Two windows across the column at unequal widths, the
 *              second dropped and pushed right. Fills the full measure while
 *              staying asymmetric, so it reads as a system, not a grid.
 *  layered   — CrushWithMe. Second window overlapping and dropped. Cinematic.
 *  paired    — WeAll. Two devices side by side, the second dropped a beat.
 *  balanced  — MyVitalView. Two equal windows, symmetric, no overlap.
 *
 * The browser layouts pass no height, so each frame fills the width it is
 * given. Scale is set by how many columns the spread allots, not by a cap.
 */

import Reveal from "@/components/primitives/Reveal";
import ProjectShot from "@/components/work/ProjectShot";
import type { Shot } from "@/data/projects";

export type PairLayout = "staggered" | "layered" | "paired" | "balanced";

function Caption({ shot, tone }: { shot: Shot; tone: "ink" | "paper" }) {
  if (!shot.caption) return null;
  return (
    <figcaption
      className="t-micro mt-3 flex items-baseline gap-2 leading-relaxed"
      style={{ color: tone === "paper" ? "#6B6862" : "var(--graphite-2)" }}
    >
      <span aria-hidden className="mt-[0.4em] block h-[5px] w-[5px] shrink-0" style={{ background: "var(--vermilion)" }} />
      {shot.caption}
    </figcaption>
  );
}

function One({
  shot,
  label,
  height,
  sizes,
  tone,
  delay = 0,
}: {
  shot?: Shot;
  label: string;
  height?: string;
  sizes?: string;
  tone: "ink" | "paper";
  delay?: number;
}) {
  return (
    <figure className="m-0 w-full">
      <Reveal variant="media" delay={delay} className="w-full">
        <ProjectShot shot={shot} label={label} height={height} sizes={sizes} />
      </Reveal>
      {shot ? <Caption shot={shot} tone={tone} /> : null}
    </figure>
  );
}

export default function ShotPair({
  shots,
  layout,
  name,
  tone = "ink",
}: {
  shots?: Shot[];
  layout: PairLayout;
  name: string;
  tone?: "ink" | "paper";
}) {
  const [a, b] = shots ?? [];
  const lbl = (i: number) => `${name} screen ${i + 1}`;

  if (layout === "paired") {
    // Two devices, the second dropped a beat so the pair has rhythm.
    return (
      <div className="flex items-start gap-[clamp(0.75rem,2vw,1.75rem)]">
        <div className="min-w-0 flex-1">
          <One shot={a} label={lbl(0)} tone={tone} sizes="(max-width: 767px) 42vw, 16vw" />
        </div>
        <div className="min-w-0 flex-1 pt-[clamp(1.5rem,6vh,4rem)]">
          <One shot={b} label={lbl(1)} tone={tone} delay={0.1} sizes="(max-width: 767px) 42vw, 16vw" />
        </div>
      </div>
    );
  }

  if (layout === "balanced") {
    // Symmetric. The only pair in the set that does not offset.
    return (
      <div className="grid grid-cols-1 gap-[clamp(1.5rem,4vh,3rem)] md:grid-cols-2 md:gap-[var(--col-gap)]">
        <One shot={a} label={lbl(0)} tone={tone} sizes="(max-width: 767px) 92vw, 44vw" />
        <One shot={b} label={lbl(1)} tone={tone} delay={0.1} sizes="(max-width: 767px) 92vw, 44vw" />
      </div>
    );
  }

  if (layout === "layered") {
    // Overlapping and dropped — this is the experimental spread, so depth is
    // earned here and nowhere else.
    return (
      <div className="relative">
        <div className="md:w-[68%]">
          <One shot={a} label={lbl(0)} tone={tone} sizes="(max-width: 767px) 92vw, 38vw" />
        </div>
        <div className="mt-[clamp(1.5rem,4vh,2.5rem)] md:absolute md:bottom-[-14%] md:right-0 md:mt-0 md:w-[42%]">
          <One shot={b} label={lbl(1)} tone={tone} delay={0.14} sizes="(max-width: 767px) 92vw, 24vw" />
        </div>
      </div>
    );
  }

  // staggered — across the column at unequal widths, the second dropped and
  // pushed right. A vertical stack left half the measure empty on wide screens.
  return (
    <div className="flex flex-col gap-[clamp(1.5rem,4vh,2.5rem)] md:flex-row md:items-start md:gap-[var(--col-gap)]">
      <div className="md:w-[56%]">
        <One shot={a} label={lbl(0)} tone={tone} sizes="(max-width: 767px) 92vw, 34vw" />
      </div>
      <div className="md:w-[42%] md:pt-[clamp(2rem,8vh,5rem)]">
        <One shot={b} label={lbl(1)} tone={tone} delay={0.1} sizes="(max-width: 767px) 92vw, 26vw" />
      </div>
    </div>
  );
}
