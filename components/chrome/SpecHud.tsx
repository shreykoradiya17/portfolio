"use client";

/**
 * Two quiet instruments.
 *
 * A progress rail pinned to the right edge of the viewport — outside the
 * content gutter, so it cannot collide with whatever a section puts in its own
 * corner. And, in spec mode only, the drawn layer's instrument panel.
 *
 * Scroll values are written straight to the DOM inside a rAF, so scrolling
 * never triggers a React render.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";

const BP = (w: number) =>
  w >= 1536 ? "2xl" : w >= 1280 ? "xl" : w >= 1024 ? "lg" : w >= 768 ? "md" : w >= 640 ? "sm" : "xs";

export default function SpecHud() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });

  useEffect(() => {
    let raf = 0;
    const write = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (railRef.current) railRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(write); };
    const onResize = () => { setVp({ w: window.innerWidth, h: window.innerHeight }); onScroll(); };
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Progress — the full height of the right edge, one pixel wide */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 z-[96] h-full w-px"
        style={{ background: "var(--rule-soft)" }}
      >
        <span
          ref={railRef}
          className="block h-full w-full origin-top"
          style={{ background: "var(--vermilion)", transform: "scaleY(0)" }}
        />
      </div>

      {/* The drawn layer's instrument panel */}
      <div
        aria-hidden="true"
        className="spec-layer pointer-events-none fixed bottom-0 right-0 z-[96] hidden p-[var(--gx)] sm:block"
      >
        <div
          className="flex flex-col items-end gap-[3px] px-2 py-1.5 text-right"
          style={{
            color: "var(--blueprint)",
            background: "var(--paper)",
            border: "1px solid color-mix(in oklab, var(--blueprint) 28%, transparent)",
          }}
        >
          <span className="t-micro tnum">
            SCROLL <span ref={pctRef}>000</span>%
          </span>
          <span className="t-micro">
            VIEWPORT {vp.w}×{vp.h} · {BP(vp.w).toUpperCase()}
          </span>
          <span className="t-micro">GRID 12 COL · GUTTER VAR(--COL-GAP)</span>
          <span className="t-micro">REDUCED MOTION {reduced ? "ON" : "OFF"} · GRAIN 3.8%</span>
          <span className="t-micro" style={{ opacity: 0.7 }}>PRESS S TO CLOSE THE DRAWN LAYER</span>
        </div>
      </div>
    </>
  );
}
