"use client";

/**
 * Custom cursor. Desktop, fine-pointer, full-motion only.
 *
 * Driven entirely by `data-cursor` / `data-cursor-label` attributes read from
 * the hovered element's closest ancestor — so it works for anything, including
 * content mounted later, and costs zero React re-renders per frame.
 *
 * In spec mode it becomes a crosshair with live viewport coordinates: the
 * pointer joins the drawn layer.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { damp } from "@/lib/motion";
import { usePointerFine, useReducedMotion } from "@/lib/hooks";

type Mode = "default" | "view" | "link" | "explore" | "text";

const PRESETS: Record<Mode, { size: number; fill: boolean; label: string; dot: boolean }> = {
  default: { size: 26, fill: false, label: "", dot: true },
  view:    { size: 98, fill: true,  label: "View project", dot: false },
  link:    { size: 62, fill: false, label: "Open ↗", dot: false },
  explore: { size: 68, fill: false, label: "Explore", dot: false },
  text:    { size: 0,  fill: false, label: "", dot: true },
};

export default function Cursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const crossXRef = useRef<HTMLDivElement>(null);
  const crossYRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<((m: Mode, label?: string | null) => void) | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) {
      document.documentElement.removeAttribute("data-cursor");
      return;
    }
    document.documentElement.setAttribute("data-cursor", "on");

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const label = labelRef.current!;
    const cx = crossXRef.current!;
    const cy = crossYRef.current!;
    const coord = coordRef.current!;

    // Target and rendered state, kept out of React on purpose.
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let dx = tx;
    let dy = ty;

    let mode: Mode = "default";
    let targetSize = PRESETS.default.size;
    let size = 0;
    let targetOpacity = 0;
    let opacity = 0;
    let press = 1;
    let targetPress = 1;
    let currentLabel = "";
    let specOn = false;
    let last = performance.now();
    let raf = 0;

    const apply = (next: Mode, labelOverride?: string | null) => {
      const preset = PRESETS[next];
      const text = labelOverride ?? preset.label;
      mode = next;
      targetSize = preset.size;
      ring.dataset.fill = preset.fill ? "1" : "0";
      dot.style.opacity = preset.dot ? "1" : "0";
      if (text !== currentLabel) {
        label.textContent = text;
        currentLabel = text;
      }
      label.style.opacity = text ? "1" : "0";
    };
    applyRef.current = apply;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      targetOpacity = 1;

      const el = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor]"
      ) as HTMLElement | null;

      if (el) {
        const raw = (el.dataset.cursor || "default") as Mode;
        const next = raw in PRESETS ? raw : "default";
        const lbl = el.dataset.cursorLabel ?? null;
        if (next !== mode || (lbl ?? PRESETS[next].label) !== currentLabel) apply(next, lbl);
      } else if (mode !== "default") {
        apply("default");
      }
    };

    const onDown = () => { targetPress = 0.82; };
    const onUp = () => { targetPress = 1; };
    const onLeave = () => { targetOpacity = 0; };
    const onEnter = () => { targetOpacity = 1; };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Ring trails; dot is nearly immediate. The gap is what reads as weight.
      rx = damp(rx, tx, 13, dt);
      ry = damp(ry, ty, 13, dt);
      dx = damp(dx, tx, 34, dt);
      dy = damp(dy, ty, 34, dt);
      size = damp(size, targetSize, 16, dt);
      opacity = damp(opacity, targetOpacity, 14, dt);
      press = damp(press, targetPress, 22, dt);

      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${press})`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.opacity = `${opacity}`;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      dot.style.opacity = `${PRESETS[mode].dot ? opacity : 0}`;

      const nextSpec = document.documentElement.dataset.spec === "on";
      if (nextSpec !== specOn) {
        specOn = nextSpec;
        cx.style.opacity = cy.style.opacity = coord.style.opacity = specOn ? "1" : "0";
        ring.dataset.spec = specOn ? "1" : "0";
      }
      if (specOn) {
        cx.style.transform = `translate3d(0, ${Math.round(dy)}px, 0)`;
        cy.style.transform = `translate3d(${Math.round(dx)}px, 0, 0)`;
        coord.style.transform = `translate3d(${Math.round(dx) + 20}px, ${Math.round(dy) + 18}px, 0)`;
        coord.textContent = `X ${Math.round(tx)}  Y ${Math.round(ty + window.scrollY)}`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      applyRef.current = null;
      document.documentElement.removeAttribute("data-cursor");
    };
  }, [enabled]);

  // The cursor only re-evaluates what it is hovering on pointermove, so after
  // a click-through navigation it would keep announcing "View project" over a
  // page that has no such link until the visitor happened to move the mouse.
  useEffect(() => {
    applyRef.current?.("default");
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      {/* Blueprint crosshair — spec mode only */}
      <div
        ref={crossXRef}
        className="absolute left-0 top-0 h-px w-full opacity-0 transition-opacity duration-200"
        style={{ background: "color-mix(in oklab, var(--blueprint) 40%, transparent)" }}
      />
      <div
        ref={crossYRef}
        className="absolute left-0 top-0 h-full w-px opacity-0 transition-opacity duration-200"
        style={{ background: "color-mix(in oklab, var(--blueprint) 40%, transparent)" }}
      />
      <div
        ref={coordRef}
        className="anno absolute left-0 top-0 opacity-0 transition-opacity duration-200"
      />

      <div
        ref={ringRef}
        className="cursor-ring absolute left-0 top-0 grid place-items-center rounded-full"
      >
        <span
          ref={labelRef}
          className="t-micro select-none whitespace-nowrap opacity-0 transition-opacity duration-150"
        />
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full"
        style={{ background: "var(--ink)" }}
      />
    </div>
  );
}
