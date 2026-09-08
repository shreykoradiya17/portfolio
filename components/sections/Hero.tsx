"use client";

/**
 * Hero.
 *
 * The interaction here is the concept, not an effect. The headline is set as
 * two printing plates: an ink plate (the real, semantic text) and a vermilion
 * plate behind it. They rest very slightly out of register — the way a cheaply
 * printed sheet does — and drift further apart as the pointer moves. Design and
 * engineering, aligning and misaligning on the same sheet.
 *
 * Transform-only, so it costs one composited layer and no layout. The markup
 * carries no hidden state: if JS never runs, the whole hero is simply there.
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { EASE, damp } from "@/lib/motion";
import { useIntro } from "@/lib/intro";
import { usePointerFine, useReducedMotion } from "@/lib/hooks";
import { site } from "@/data/site";
import { SpecColumns, Anno, CropMarks, Registration as Mark } from "@/components/primitives/Marks";

const LINE_1 = "First frame";
const LINE_2 = "Last commit.";

/** Resting misregistration, in percent of the headline's own width. A hint of
 *  vermilion at the edges, so the second plate announces itself unprompted. */
const REST_X = 0.14;
const REST_Y = 0.09;
/** How far the plates travel apart across the full viewport. */
const RANGE = 1.05;

/** One plate's worth of headline. The vermilion plate suppresses the small
 *  serif connective — at that size a few pixels of offset just reads as a
 *  doubled letter, which is a typo, not a print artefact. */
function Plate({ ghost = false }: { ghost?: boolean }) {
  const attr = ghost ? { "data-h-gline": true } : { "data-h-line": true };
  return (
    <>
      <span {...attr} className="line-mask">
        <span className="block whitespace-nowrap">{LINE_1}</span>
      </span>
      <span {...attr} className="line-mask">
        <span
          className="t-serif block"
          style={{
            fontSize: "0.24em",
            lineHeight: 1.75,
            paddingLeft: "36%",
            letterSpacing: 0,
            visibility: ghost ? "hidden" : undefined,
          }}
        >
          to
        </span>
      </span>
      <span {...attr} className="line-mask">
        <span className="block whitespace-nowrap">{LINE_2}</span>
      </span>
    </>
  );
}

export default function Hero() {
  const { introDone } = useIntro();
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  /* ---- Entrance sequence ------------------------------------------------
     Initial states are applied before first paint so nothing flashes. The
     timeline is built paused and released by the registration panel.       */
  useLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    const { gsap } = ensureGsap();
    const q = gsap.utils.selector(el);

    const ctx = gsap.context(() => {
      gsap.set(q("[data-h-meta]"), { autoAlpha: 0, y: 10 });
      gsap.set(q("[data-h-sub]"), { autoAlpha: 0, y: 16 });
      gsap.set(q("[data-h-line] > span, [data-h-gline] > span"), { yPercent: 112 });
      gsap.set(q("[data-h-rule]"), { scaleX: 0 });
      gsap.set(q("[data-h-cue]"), { autoAlpha: 0 });
      gsap.set(q("[data-h-crop] path"), { drawSVG: "0% 50%" });
      if (plate.current) gsap.set(plate.current, { xPercent: -3.2, yPercent: 5, autoAlpha: 0 });

      const lineTween = { yPercent: 0, duration: 1.05, stagger: 0.085 };

      tlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: EASE.out } })
        // 1 — metadata registers first
        .to(q("[data-h-meta]"), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.055 }, 0)
        // 2 — the sheet's trim marks draw
        .to(q("[data-h-crop] path"), { drawSVG: "0% 100%", duration: 0.7, stagger: 0.04 }, 0.08)
        // 3 — headline, line by line. Both plates move as one.
        .to(q("[data-h-line] > span"), lineTween, 0.2)
        .to(q("[data-h-gline] > span"), lineTween, 0.2)
        // 4 — the vermilion plate settles into register
        .to(plate.current, {
          xPercent: REST_X, yPercent: REST_Y, autoAlpha: 1,
          duration: 1.35, ease: EASE.io,
        }, 0.3)
        // 5 — the rule closes the composition
        .to(q("[data-h-rule]"), {
          scaleX: 1, duration: 1, ease: EASE.io, transformOrigin: "left center",
        }, 0.6)
        // 6 — supporting text, then the cue
        .to(q("[data-h-sub]"), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0.7)
        .to(q("[data-h-cue]"), { autoAlpha: 1, duration: 0.5 }, 1.05);
    }, el);

    return () => { tlRef.current = null; ctx.revert(); };
  }, [reduced]);

  useEffect(() => {
    if (introDone) tlRef.current?.play();
  }, [introDone]);

  /* ---- Plate misregistration on pointer --------------------------------- */
  useEffect(() => {
    if (!fine || reduced || !introDone) return;
    const el = root.current;
    const p = plate.current;
    if (!el || !p) return;

    let tx = REST_X, ty = REST_Y, x = REST_X, y = REST_Y;
    let raf = 0, last = performance.now(), inside = false;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      x = damp(x, tx, 6.5, dt);
      y = damp(y, ty, 6.5, dt);
      p.style.transform = `translate3d(${x.toFixed(3)}%, ${y.toFixed(3)}%, 0)`;
      if (!inside && Math.abs(x - tx) < 0.004 && Math.abs(y - ty) < 0.004) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      inside = true;
      tx = REST_X + nx * RANGE;
      ty = REST_Y + ny * RANGE * 0.5;
      start();
    };
    const onLeave = () => { inside = false; tx = REST_X; ty = REST_Y; start(); };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, reduced, introDone]);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-[max(2.25rem,env(safe-area-inset-bottom))]"
      aria-label="Introduction"
    >
      <SpecColumns />
      <CropMarks />

      {/* ---- Metadata, aligned to the grid rather than merely spread ------ */}
      <div
        className="grid-page relative z-[3]"
        style={{ paddingTop: "calc(var(--nav-h) + clamp(1.25rem, 4vh, 3rem))" }}
      >
        <span data-h-meta className="t-meta col-span-8 flex items-center gap-2 sm:col-span-4 lg:col-span-3">
          <span className="acc"><Mark size={11} /></span>
          {site.city} / India
        </span>
        <span data-h-meta className="t-micro dim col-span-4 hidden self-center sm:block lg:col-span-3">
          {site.coords}
        </span>
        <span data-h-meta className="t-micro dim col-span-3 hidden self-center lg:block">
          UI/UX + Frontend
        </span>
        <span data-h-meta className="t-meta acc tnum col-span-4 self-center text-right sm:col-span-4 lg:col-span-3">
          {site.year}
        </span>
      </div>

      {/* ---- Headline ------------------------------------------------------ */}
      <div className="grid-page relative z-[3] py-[clamp(1.5rem,5vh,4rem)]">
        <div className="relative col-span-12">
          {/* The vermilion plate. Decorative duplicate — never read aloud. */}
          <span
            ref={plate}
            aria-hidden="true"
            className="t-hero pointer-events-none absolute inset-0 select-none"
            style={{
              color: "var(--vermilion)",
              mixBlendMode: "multiply",
              willChange: "transform",
            }}
          >
            <Plate ghost />
          </span>

          <h1 className="t-hero relative m-0">
            <Plate />
          </h1>

          <Anno style={{ top: "-1.5rem", left: 0 }}>H1 · ARCHIVO 600 · WDTH 88</Anno>
          <Anno style={{ bottom: "-1.5rem", right: 0 }}>PLATE OFFSET ← POINTER</Anno>
        </div>
      </div>

      {/* ---- Foot of the sheet --------------------------------------------- */}
      <div className="grid-page relative z-[3]">
        <div className="col-span-12">
          <span data-h-rule aria-hidden className="mb-5 block h-px w-full origin-left bg-rule" />
        </div>

        <div className="col-span-12 flex items-center justify-between gap-4 md:col-span-4 md:flex-col md:items-start md:justify-start md:gap-4">
          <p data-h-sub className="t-meta m-0">
            <span className="acc">{site.status}</span>
          </p>
          <span data-h-cue className="t-micro dim flex items-center gap-2" aria-hidden="true">
            <span className="relative block h-6 w-px overflow-hidden bg-rule-soft">
              <span className="scroll-tick absolute inset-x-0 top-0 block h-2" style={{ background: "var(--ink)" }} />
            </span>
            Scroll
          </span>
        </div>

        <p
          data-h-sub
          className="t-lead col-span-12 m-0 mt-6 md:col-start-7 md:col-end-13 md:mt-0 lg:col-start-8 lg:col-end-13"
        >
          I design interfaces and then build them.
          <span className="dim"> The handoff happens in my head.</span>
        </p>
      </div>
    </section>
  );
}
