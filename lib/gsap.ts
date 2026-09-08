"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

let registered = false;

/** Registers plugins once, on the client. Safe to call from any component. */
export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
    // Never let GSAP "catch up" after a long frame — that is what causes a
    // visible jump when a heavy section mounts mid-scroll.
    gsap.ticker.lagSmoothing(0);
    registered = true;
  }
  return { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin };
