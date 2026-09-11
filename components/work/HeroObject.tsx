"use client";

/**
 * The project hero's object.
 *
 * Two variants, chosen per project in the data: a metallic sphere, or a ring of
 * type running on a path. Both load on demand, run only while on screen, and
 * stand down for reduced motion and for browsers without WebGL — in which case
 * the hero simply keeps its negative space.
 */

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView, usePointerFine, useReducedMotion } from "@/lib/hooks";

const FluidBall = dynamic(() => import("@/components/three/FluidBall"), {
  ssr: false,
  loading: () => null,
});

/* ssr:false because TextLoop measures the path with getTotalLength in a layout
   effect, which has nothing to measure on the server. */
const TextLoop = dynamic(() => import("@/components/vendor/TextLoop"), {
  ssr: false,
  loading: () => null,
});

export default function HeroObject({
  variant = "ball",
  loopText = "",
  color,
  className = "",
}: {
  variant?: "ball" | "textloop";
  loopText?: string;
  color?: string;
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const active = useInView(stage, { threshold: 0.01, rootMargin: "200px", once: false });

  if (variant === "textloop") {
    return (
      <div ref={stage} className={`relative ${className}`}>
        {active ? (
          <TextLoop
            text={loopText}
            shape="circle"
            separator="✦"
            uppercase
            curviness={96}
            fontSize={34}
            fontWeight={600}
            letterSpacing={2}
            speed={58}
            /* Two inks, as everywhere else: the accent carries the ribbon, the
               type sits on it in ink. */
            ribbon
            ribbonColor="var(--vermilion)"
            ribbonWidth={62}
            color="var(--ink)"
            pauseOnHover
          />
        ) : null}
      </div>
    );
  }

  return (
    <div ref={stage} className={`relative ${className}`} aria-hidden="true">
      {active ? <FluidBall active={active} reduced={reduced} pointer={fine} color={color} /> : null}
    </div>
  );
}
