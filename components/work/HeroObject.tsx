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

import type { TextLoopShape } from "@/components/vendor/TextLoop";

export default function HeroObject({
  variant = "ball",
  loopText = "",
  shape = "wave",
  color,
  className = "",
}: {
  variant?: "ball" | "textloop";
  loopText?: string;
  shape?: TextLoopShape;
  color?: string;
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const active = useInView(stage, { threshold: 0.01, rootMargin: "200px", once: false });

  if (variant === "textloop") {
    return (
      <div ref={stage} className={`relative w-full ${className}`}>
        {active ? (
          <TextLoop
            text={loopText}
            shape={shape}
            separator="✦"
            uppercase
            curviness={90}
            fontSize={34}
            fontWeight={700}
            letterSpacing={3}
            speed={58}
            /* Signature vermilion ribbon with crisp white text flowing edge to edge */
            ribbon
            ribbonColor="var(--vermilion)"
            ribbonWidth={70}
            color="#FFFFFF"
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
