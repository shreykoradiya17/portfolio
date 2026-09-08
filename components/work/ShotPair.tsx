"use client";

/**
 * A project's two captures.
 *
 * Four arrangements, one per project, so the pair reads differently each time
 * rather than four identical galleries:
 *
 *  stepped  — ERP. Second window indented under the first. Systematic.
 *  layered  — CrushWithMe. Second window overlapping and dropped. Cinematic.
 *  paired   — WeAll. Two devices side by side, the second dropped a beat.
 *  balanced — MyVitalView. Two equal windows, symmetric, no overlap.
 */

import Reveal from "@/components/primitives/Reveal";
import ProjectShot from "@/components/work/ProjectShot";
import type { Shot } from "@/data/projects";

export type PairLayout = "stepped" | "layered" | "paired" | "balanced";

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
        <One shot={a} label={lbl(0)} tone={tone} height="min(40svh, 380px)" sizes="(max-width: 767px) 92vw, 44vw" />
        <One shot={b} label={lbl(1)} tone={tone} delay={0.1} height="min(40svh, 380px)" sizes="(max-width: 767px) 92vw, 44vw" />
      </div>
    );
  }

  if (layout === "layered") {
    // Overlapping and dropped — this is the experimental spread, so depth is
    // earned here and nowhere else.
    return (
      <div className="relative">
        <div className="md:w-[78%]">
          <One shot={a} label={lbl(0)} tone={tone} height="min(52svh, 500px)" sizes="(max-width: 767px) 92vw, 60vw" />
        </div>
        <div className="mt-[clamp(1.5rem,4vh,2.5rem)] md:absolute md:bottom-[-12%] md:right-0 md:mt-0 md:w-[46%]">
          <One shot={b} label={lbl(1)} tone={tone} delay={0.14} height="min(34svh, 320px)" sizes="(max-width: 767px) 92vw, 38vw" />
        </div>
      </div>
    );
  }

  // stepped — second window indented beneath the first
  return (
    <div className="flex flex-col gap-[clamp(1.75rem,5vh,3.25rem)]">
      <One shot={a} label={lbl(0)} tone={tone} height="min(44svh, 420px)" sizes="(max-width: 767px) 92vw, 58vw" />
      <div className="md:pl-[12%]">
        <One shot={b} label={lbl(1)} tone={tone} delay={0.1} height="min(38svh, 360px)" sizes="(max-width: 767px) 92vw, 50vw" />
      </div>
    </div>
  );
}
