"use client";

/**
 * Lenis, wired to the GSAP ticker so ScrollTrigger and smoothing share one
 * clock. Lenis 1.x drives real window scroll, so anchors, focus scrolling and
 * ScrollTrigger all keep working without a transformed wrapper.
 *
 * Reduced motion disables smoothing entirely rather than shortening it.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const { gsap, ScrollTrigger } = ensureGsap();

    const lenis = new Lenis({
      duration: 1.05,
      // Long, flat tail — reads as weight rather than bounce.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // native momentum on touch is better than emulated
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
      autoRaf: false,
    });

    window.__lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    // Anchor links hand off to Lenis so in-page jumps are part of the motion.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.15 });
    };
    document.addEventListener("click", onClick);

    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  return null;
}
