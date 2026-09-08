"use client";

/**
 * Magnetic hover. The element leans toward the pointer within a radius, then
 * settles back. The rAF loop only runs while there is something to resolve, so
 * several of these on a page cost nothing at rest.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { damp } from "@/lib/motion";
import { usePointerFine, useReducedMotion } from "@/lib/hooks";

interface Props {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

export default function Magnetic({
  children,
  strength = 0.3,
  radius = 130,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    let tx = 0, ty = 0, x = 0, y = 0;
    let raf = 0;
    let last = performance.now();

    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      x = damp(x, tx, 12, dt);
      y = damp(y, ty, 12, dt);
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (Math.abs(x - tx) < 0.05 && Math.abs(y - ty) < 0.05) {
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        stop();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cxp = r.left + r.width / 2;
      const cyp = r.top + r.height / 2;
      const ddx = e.clientX - cxp;
      const ddy = e.clientY - cyp;
      const dist = Math.hypot(ddx, ddy);
      const reach = radius + Math.max(r.width, r.height) / 2;
      if (dist < reach) {
        const falloff = 1 - dist / reach;
        tx = ddx * strength * falloff;
        ty = ddy * strength * falloff;
      } else {
        tx = 0; ty = 0;
      }
      start();
    };

    const onLeaveWindow = () => { tx = 0; ty = 0; start(); };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveWindow);
      el.style.transform = "";
    };
  }, [active, strength, radius]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", willChange: "transform" }}>
      {children}
    </span>
  );
}
