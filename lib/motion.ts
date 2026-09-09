/**
 * The motion system. Four easings, three durations, one stagger law.
 * These mirror the CSS custom properties exactly so JS and CSS motion agree.
 */

export const EASE = {
  /** Reveals: fast out, long settle. */
  out: "power4.out",
  /** State swaps in and out. */
  io: "power3.inOut",
  /** Hovers and small corrections. */
  soft: "power2.out",
  /** Curtains and mode switches — mechanical, deliberate. */
  mech: "expo.inOut",
} as const;

export const DUR = {
  fast: 0.28,
  base: 0.62,
  slow: 1.1,
} as const;

/** The one stagger law. Everything staggered on this site uses it. */
export const STAGGER = 0.075;

/** Parallax is capped. 12% of the element's travel, never more. */
export const PARALLAX_MAX = 0.12;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isPointerFine = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Frame-rate independent damping. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const mapRange = (v: number, a1: number, a2: number, b1: number, b2: number) =>
  b1 + ((v - a1) / (a2 - a1)) * (b2 - b1);
