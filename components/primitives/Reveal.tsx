"use client";

/**
 * The single scroll-reveal primitive. Four variants, all transform+opacity or
 * clip-path only — no blur, no filters, nothing that forces a repaint on scroll.
 *
 * Under reduced motion this renders its children as-is and registers nothing.
 */

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { ensureGsap } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

type Variant = "rise" | "mask" | "media" | "rule" | "stagger";

interface Props {
  /** Optional: the `rule` variant is a self-closing hairline. */
  children?: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  start?: string;
  className?: string;
  /** For `stagger`: selector of children to stagger. */
  select?: string;
  id?: string;
}

export default function Reveal({
  children,
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  start = "top 86%",
  className,
  select = ":scope > *",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const { gsap } = ensureGsap();
    const st = { trigger: el, start, once: true } as const;

    const ctx = gsap.context(() => {
      if (variant === "rise") {
        gsap.from(el, {
          y: 34,
          autoAlpha: 0,
          duration: DUR.base,
          ease: EASE.out,
          delay,
          scrollTrigger: st,
        });
      } else if (variant === "mask") {
        gsap.from(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          y: 18,
          duration: DUR.slow,
          ease: EASE.out,
          delay,
          scrollTrigger: st,
        });
      } else if (variant === "media") {
        // clip-path only, deliberately no scale. A `scale` from-state is
        // applied immediately on creation, so every media reveal still below
        // the fold sat 6% oversized and pushed the document wider than the
        // viewport — worse the wider the screen. clip-path can only ever clip
        // inward, so it cannot overflow, and the expanding-window read is the
        // same.
        gsap.from(el, {
          clipPath: "inset(14% 8% 14% 8%)",
          duration: 1.25,
          ease: EASE.out,
          delay,
          scrollTrigger: st,
        });
      } else if (variant === "rule") {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: DUR.slow,
            ease: EASE.io,
            delay,
            scrollTrigger: st,
          }
        );
      } else if (variant === "stagger") {
        const kids = gsap.utils.toArray<HTMLElement>(select, el);
        if (!kids.length) return;
        gsap.from(kids, {
          y: 26,
          autoAlpha: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: STAGGER,
          delay,
          scrollTrigger: st,
        });
      }
    }, el);

    return () => ctx.revert();
  }, [reduced, variant, delay, start, select]);

  return (
    <Tag ref={ref} id={id} className={className} data-reveal={variant}>
      {children}
    </Tag>
  );
}
