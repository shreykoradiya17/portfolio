"use client";

/**
 * Project transitions.
 *
 * A project preview expands into the full project page: the overlay plate
 * starts clipped to the exact rect of the media you clicked, opens to full
 * bleed while carrying the project's number and name, navigates, then wipes
 * upward to reveal the detail page. Typography continuity does the rest — the
 * name lands where the detail hero puts it.
 *
 * clip-path `inset()` is animated rather than left/top/width/height, so no
 * layout is recalculated mid-flight. Every path has a safety timeout: a stuck
 * full-screen curtain is the worst possible failure, so it cannot happen.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ensureGsap } from "@/lib/gsap";
import NamePlate from "@/components/work/NamePlate";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

interface Payload {
  index?: string;
  name?: string;
  category?: string;
}

interface Api {
  /** Cover the screen, navigate, and hold until `ready()` is called. */
  go: (href: string, payload?: Payload, from?: DOMRect | null) => void;
  /** Called by the arriving page once it has mounted. */
  ready: () => void;
  busy: boolean;
}

const Ctx = createContext<Api>({ go: () => {}, ready: () => {}, busy: false });

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const plateRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [meta, setMeta] = useState<Payload>({});
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const armedRef = useRef(false);
  const safety = useRef<number | null>(null);

  const clearSafety = () => {
    if (safety.current) { window.clearTimeout(safety.current); safety.current = null; }
  };

  const reveal = useCallback(() => {
    const plate = plateRef.current;
    if (!plate || !armedRef.current) return;
    armedRef.current = false;
    clearSafety();

    // Land the arriving page at the top before uncovering it.
    window.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    const { gsap, ScrollTrigger } = ensureGsap();
    ScrollTrigger.refresh();

    // Cross-fade, not a wipe. The arriving page already has an identical name
    // plate in the identical position, so fading the overlay out reads as the
    // title holding still while everything behind it changes.
    gsap
      .timeline({
        onComplete: () => {
          plate.style.visibility = "hidden";
          plate.style.pointerEvents = "none";
          busyRef.current = false;
          setBusy(false);
        },
      })
      .to(plate, { autoAlpha: 0, duration: 0.72, ease: EASE.soft }, 0);
  }, []);

  const go = useCallback(
    (href: string, payload: Payload = {}, from?: DOMRect | null) => {
      if (busyRef.current) return;

      if (reduced) {
        router.push(href);
        return;
      }

      const plate = plateRef.current;
      if (!plate) { router.push(href); return; }

      busyRef.current = true;
      setBusy(true);
      armedRef.current = true;
      setMeta(payload);

      const startClip = from
        ? `inset(${from.top}px ${window.innerWidth - from.right}px ${
            window.innerHeight - from.bottom
          }px ${from.left}px)`
        : "inset(100% 0% 0% 0%)";

      const { gsap } = ensureGsap();
      plate.style.visibility = "visible";
      plate.style.pointerEvents = "auto";

      // autoAlpha must be reset: the previous reveal faded this element to 0,
      // and without this a second navigation would cover the screen with
      // nothing visible on it.
      gsap.set(plate, { clipPath: startClip, autoAlpha: 1 });
      gsap.set(innerRef.current, { autoAlpha: 0, y: 24 });

      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            // If the destination never calls ready() (an error page, a slow
            // chunk), uncover anyway rather than trapping the visitor.
            clearSafety();
            safety.current = window.setTimeout(reveal, 2600);
          },
        })
        .to(plate, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.72, ease: EASE.mech }, 0)
        .to(innerRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.out }, 0.24);
    },
    [reduced, router, reveal]
  );

  // Browser back/forward must never leave the plate down.
  useEffect(() => {
    const onPop = () => { if (armedRef.current) reveal(); };
    window.addEventListener("popstate", onPop);
    return () => { window.removeEventListener("popstate", onPop); clearSafety(); };
  }, [reveal]);

  return (
    <Ctx.Provider value={{ go, ready: reveal, busy }}>
      {children}
      <div
        ref={plateRef}
        aria-hidden="true"
        className="on-ink fixed inset-0 z-[110] flex items-end"
        style={{
          visibility: "hidden",
          pointerEvents: "none",
          clipPath: "inset(100% 0% 0% 0%)",
        }}
      >
        <div ref={innerRef} className="grid-page w-full pb-[8vh]" style={{ opacity: 0 }}>
          <NamePlate index={meta.index ?? ""} name={meta.name ?? ""} category={meta.category} />
        </div>
      </div>
    </Ctx.Provider>
  );
}

export const useTransition = () => useContext(Ctx);

/** Called by an arriving page to uncover itself. */
export function TransitionReady() {
  const { ready } = useTransition();
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(ready));
    return () => cancelAnimationFrame(id);
  }, [ready]);
  return null;
}
