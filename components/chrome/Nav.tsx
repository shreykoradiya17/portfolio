"use client";

/**
 * Navigation. Small, permanent, and never a sticky bar.
 *
 * `mix-blend-mode: difference` means it reads correctly over warm paper and
 * near-black alike with no scroll listener deciding its colour. The only thing
 * scroll changes is a hairline underneath it and the descriptor beside the
 * name, both of which are earned rather than decorative.
 *
 * Spec mode has no control here by request. It is still reachable on the S key,
 * which means it is now effectively undiscoverable — see lib/spec.tsx.
 *
 * Mobile gets its own composition: a full panel of large type, not the desktop
 * row shrunk down.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ensureGsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";
import { site } from "@/data/site";
import { Registration as Mark } from "@/components/primitives/Marks";

const LINKS = [
  { href: "#work", label: "Work", n: "01" },
  { href: "#about", label: "About", n: "02" },
  { href: "#contact", label: "Contact", n: "03" },
];

export default function Nav() {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll state — one passive listener, rAF-throttled.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > window.innerHeight * 0.55);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Which section owns the viewport right now.
  useEffect(() => {
    const ids = ["work", "about", "contact"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.01, 0.2] }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // Mobile panel: animate, trap focus, close on Escape and on navigation.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!open) {
      document.body.style.removeProperty("overflow");
      if (reduced) { panel.style.visibility = "hidden"; return; }
      const { gsap } = ensureGsap();
      gsap.to(panel, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.5,
        ease: EASE.mech,
        onComplete: () => { panel.style.visibility = "hidden"; },
      });
      return;
    }

    document.body.style.overflow = "hidden";
    panel.style.visibility = "visible";
    closeBtnRef.current?.focus();

    if (reduced) {
      panel.style.clipPath = "inset(0% 0% 0% 0%)";
    } else {
      const { gsap } = ensureGsap();
      const q = gsap.utils.selector(panel);
      gsap
        .timeline()
        .fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.62, ease: EASE.mech })
        .fromTo(q("[data-mlink] span"), { yPercent: 110 },
          { yPercent: 0, duration: 0.6, ease: EASE.out, stagger: 0.06 }, 0.2)
        .fromTo(q("[data-mmeta]"), { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, 0.42);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      const f = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    panel.addEventListener("keydown", onKey);
    return () => panel.removeEventListener("keydown", onKey);
  }, [open, reduced]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[100]"
        style={{ mixBlendMode: "difference", color: "var(--paper)" }}
      >
        <div
          className="grid-page items-center"
          style={{ minHeight: "var(--nav-h)", display: "grid" }}
        >
          <div className="col-span-12 flex items-center justify-between gap-4">
            {/* Identity */}
            <div className="flex items-baseline gap-2 md:gap-3">
              <a href="#top" className="t-meta ul-link" style={{ letterSpacing: "0.1em" }}>
                {site.name}
              </a>
              <span
                aria-hidden="true"
                className="t-micro hidden transition-opacity duration-500 md:inline"
                style={{ opacity: scrolled ? 0.62 : 0 }}
              >
                UI/UX × Frontend
              </span>
            </div>

            {/* Desktop links */}
            <nav aria-label="Primary" className="hidden items-center gap-6 md:flex lg:gap-8">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="t-meta ul-link"
                  aria-current={active === l.href ? "true" : undefined}
                  style={{ opacity: active === l.href ? 1 : 0.72 }}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Mobile trigger */}
            <button
              type="button"
              className="t-meta md:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-panel"
            >
              Menu
            </button>
          </div>
        </div>

        {/* Earned hairline — only once you have left the hero */}
        <span
          aria-hidden="true"
          className="block h-px origin-left transition-transform duration-700"
          style={{
            background: "currentColor",
            opacity: 0.22,
            transform: `scaleX(${scrolled ? 1 : 0})`,
            transitionTimingFunction: "var(--e-io)",
          }}
        />
      </header>

      {/* Mobile panel — its own composition */}
      <div
        id="menu-panel"
        ref={panelRef}
        className="fixed inset-0 z-[115] flex flex-col justify-between md:hidden"
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          visibility: "hidden",
          clipPath: "inset(0% 0% 100% 0%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="grid-page pt-[calc(var(--nav-h)*0.34)]">
          <div className="col-span-12 flex items-center justify-between">
            <span data-mmeta className="t-meta" style={{ color: "#8E8B85" }}>
              {site.name}
            </span>
            <button ref={closeBtnRef} type="button" className="t-meta" onClick={close}>
              Close
            </button>
          </div>
        </div>

        <nav aria-label="Mobile" className="grid-page">
          <ul className="col-span-12 m-0 list-none p-0">
            {LINKS.map((l) => (
              <li key={l.href} className="border-t" style={{ borderColor: "color-mix(in oklab, var(--paper) 14%, transparent)" }}>
                <a
                  href={l.href}
                  onClick={close}
                  data-mlink
                  className="flex items-baseline gap-4 py-4"
                >
                  <span className="t-micro block shrink-0" style={{ color: "var(--vermilion)" }}>
                    {l.n}
                  </span>
                  <span className="t-title block overflow-hidden">
                    <span className="block">{l.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid-page pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="col-span-12 flex flex-col gap-3 border-t pt-4" style={{ borderColor: "color-mix(in oklab, var(--paper) 14%, transparent)" }}>
            <a data-mmeta href={`mailto:${site.email}`} className="t-meta ul-link ul-static">
              {site.email}
            </a>
            <div className="flex items-center justify-between">
              <span data-mmeta className="t-micro" style={{ color: "#8E8B85" }}>
                {site.city} / India
              </span>
              <span data-mmeta className="t-micro flex items-center gap-2" style={{ color: "var(--vermilion)" }}>
                <Mark size={11} /> {site.year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
