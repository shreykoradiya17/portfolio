"use client";

/**
 * Line-by-line typographic reveal.
 *
 * Uses GSAP SplitText with `mask: "lines"` so each line gets its own overflow
 * clip, and `autoSplit` so the split survives font loading and resize — which
 * is the usual reason text reveals break on real sites.
 */

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { ensureGsap } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
  duration?: number;
  id?: string;
}

export default function SplitLines({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  stagger = 0.09,
  start = "top 88%",
  duration = 0.95,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const { gsap, SplitText } = ensureGsap();
    let split: InstanceType<typeof SplitText> | null = null;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "sl-line",
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 108,
            duration,
            ease: EASE.out,
            stagger,
            delay,
            scrollTrigger: { trigger: el, start, toggleActions: "play none none none" },
          });
        },
      });
    }, el);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [reduced, delay, stagger, start, duration]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
