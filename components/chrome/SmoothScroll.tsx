"use client";

/**
 * Lenis, wired to the GSAP ticker so ScrollTrigger and smoothing share one
 * clock. Lenis 1.x drives real window scroll, so anchors, focus scrolling and
 * ScrollTrigger all keep working without a transformed wrapper.
 *
 * Anchor link clicks are intercepted globally to scroll smoothly without
 * modifying window.location.hash in the address bar.
 */

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  // Lenis clock and tick setup
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

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  // Global anchor click interceptor: scrolls to section/top without mutating URL hash
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href="/"], a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href) return;

      // Ignore external or non-http links
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) return;

      if (href === "/") {
        if (pathname === "/") {
          e.preventDefault();
          if (window.__lenis) {
            window.__lenis.scrollTo(0, { offset: 0, duration: 1.15 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
        return;
      }

      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const hash = href.slice(hashIndex); // e.g. "#top", "#work"
      const targetPath = href.slice(0, hashIndex); // e.g. "", "/"

      const isSamePage = !targetPath || targetPath === "/" || targetPath === pathname;

      if (isSamePage) {
        e.preventDefault();

        const scrollToTop = hash === "#top" || hash === "#" || hash === "";
        const targetEl = scrollToTop ? null : document.querySelector(hash);

        if (window.__lenis) {
          if (scrollToTop || !targetEl) {
            window.__lenis.scrollTo(0, { offset: 0, duration: 1.15 });
          } else {
            window.__lenis.scrollTo(targetEl as HTMLElement, { offset: 0, duration: 1.15 });
          }
        } else {
          if (scrollToTop || !targetEl) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            targetEl ? targetEl.scrollIntoView({ behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }

        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      } else {
        // Navigating from a subpage like /work/foo to /#work
        e.preventDefault();
        router.push(targetPath || "/");
        if (hash && hash !== "#top" && hash !== "#") {
          sessionStorage.setItem("pending_scroll_hash", hash);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [pathname, router]);

  // Scroll to pending section if coming from another page
  useEffect(() => {
    const pendingHash = sessionStorage.getItem("pending_scroll_hash");
    if (pendingHash) {
      sessionStorage.removeItem("pending_scroll_hash");
      const targetEl = document.querySelector(pendingHash);
      if (targetEl) {
        setTimeout(() => {
          if (window.__lenis) {
            window.__lenis.scrollTo(targetEl as HTMLElement, { offset: 0, duration: 1.15 });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }, 120);
      }
    }
  }, [pathname]);

  return null;
}
