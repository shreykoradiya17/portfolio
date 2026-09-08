"use client";

/**
 * The opening beat. Named for the print term: two plates aligning on the same
 * sheet, which is the concept of the whole site.
 *
 * It waits on `document.fonts.ready` — a real wait, not a fake progress bar —
 * so the hero's line reveal never runs against a fallback face. Two plain
 * timelines rather than one with a pause in it, because a paused timeline that
 * is later extended re-triggers its own pause callback.
 *
 * `finish()` fires as the plate starts lifting, not after, so the hero's
 * entrance overlaps the wipe instead of following it.
 */

import { useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { useIntro } from "@/lib/intro";
import { useReducedMotion } from "@/lib/hooks";
import { site } from "@/data/site";
import { Registration as Mark } from "@/components/primitives/Marks";

/** Hard ceiling. The visitor is never held behind this panel longer than this. */
const MAX_HOLD = 1700;

export default function Registration() {
  const { finish } = useIntro();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  // No "has it run" ref here on purpose. React re-invokes effects in
  // development, and a guard like that leaves the first run cleaned up and the
  // second run bailing out — which strands the visitor behind this panel. The
  // effect is written to be safe to run twice instead. The layout does not
  // remount on client navigation, so this still plays once per page load.
  useEffect(() => {
    const el = root.current;
    if (!el) { finish(); return; }

    const release = () => document.body.style.removeProperty("overflow");
    const teardown = () => { release(); el.style.display = "none"; };

    if (reduced) { teardown(); finish(); return; }

    document.body.style.overflow = "hidden";

    const { gsap } = ensureGsap();
    const q = gsap.utils.selector(el);
    let killed = false;

    // Whatever happens below, the panel comes down.
    const failsafe = window.setTimeout(() => {
      if (killed) return;
      teardown();
      finish();
    }, MAX_HOLD + 2600);

    gsap.set(el, { autoAlpha: 1 });

    const tlIn = gsap.timeline({ defaults: { ease: EASE.out } })
      .fromTo(q("[data-mark]"), { autoAlpha: 0, scale: 0.5 },
        { autoAlpha: 1, scale: 1, duration: 0.5 }, 0)
      .fromTo(q("[data-r-name] > span"), { yPercent: 112 },
        { yPercent: 0, duration: 0.85, stagger: 0.06 }, 0.12)
      .fromTo(q("[data-r-rule]"), { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: EASE.io, transformOrigin: "left center" }, 0.28)
      .fromTo(q("[data-r-meta]"), { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.soft, stagger: 0.06 }, 0.46);

    const fontsReady: Promise<unknown> =
      "fonts" in document ? document.fonts.ready : Promise.resolve(null);

    const gate = Promise.race([fontsReady, new Promise((r) => setTimeout(r, MAX_HOLD))]);

    Promise.all([gate, tlIn.then()]).then(() => {
      if (killed) return;
      window.clearTimeout(failsafe);

      // Hand off to the hero now, so its reveal runs under the lifting plate.
      finish();

      gsap.timeline({ onComplete: teardown })
        .to(q("[data-r-inner]"), { autoAlpha: 0, y: -20, duration: 0.4, ease: EASE.soft })
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: EASE.mech }, "-=0.16");
    });

    return () => {
      killed = true;
      window.clearTimeout(failsafe);
      tlIn.kill();
      release();
    };
  }, [finish, reduced]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[130] flex items-center justify-center"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        visibility: "hidden",
        clipPath: "inset(0% 0% 0% 0%)",
      }}
    >
      <div data-r-inner className="grid-page w-full">
        <div className="col-span-12 flex flex-col items-start gap-4 md:col-start-2 md:col-end-12">
          <div className="flex items-center gap-3">
            <span data-mark style={{ color: "var(--vermilion)" }}>
              <Mark size={16} />
            </span>
            <span data-r-meta className="t-micro" style={{ color: "#8E8B85" }}>
              Registering plates
            </span>
          </div>

          <p data-r-name className="t-display m-0 overflow-hidden">
            <span className="block">{site.name}</span>
          </p>

          <span
            data-r-rule
            className="block h-px w-full"
            style={{ background: "color-mix(in oklab, var(--paper) 26%, transparent)" }}
          />

          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <span data-r-meta className="t-meta" style={{ color: "#8E8B85" }}>
              UI/UX × Frontend
            </span>
            <span data-r-meta className="t-meta" style={{ color: "#8E8B85" }}>
              {site.city} / India
            </span>
            <span data-r-meta className="t-meta tnum" style={{ color: "var(--vermilion)" }}>
              {site.year}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
