"use client";

/**
 * Browser frame for web product and marketing screens.
 *
 * Deliberately not a macOS window render. The chrome is the drawn version of a
 * browser: ink bar, hairline separator, a mono label where the address would
 * be, and the three window dots as outlined circles rather than filled candy.
 * Drawn, not built — same vocabulary as the rest of the site.
 *
 * Sized from the viewport so the whole window is visible without scrolling,
 * with the width following from the ratio.
 */

import { useState } from "react";
import Image from "next/image";
import FrameSlot from "@/components/work/FrameSlot";
import { Dim } from "@/components/primitives/Marks";

export interface BrowserShot {
  src: string;
  alt: string;
  /** Shown where the address bar would be. A route, not a fake URL. */
  label?: string;
  /** Set when the file is not on disk; the slot renders instead. */
  missing?: boolean;
}

export default function BrowserFrame({
  shot,
  label,
  ratio = "16 / 10",
  height,
  className = "",
  sizes = "(max-width: 767px) 92vw, (max-width: 1279px) 58vw, 52vw",
  spec = "1440 × 900",
}: {
  shot?: BrowserShot;
  label?: string;
  /** Viewport ratio, excluding the chrome bar. */
  ratio?: string;
  /** Overrides --browser-h. */
  height?: string;
  className?: string;
  sizes?: string;
  spec?: string;
}) {
  const [failed, setFailed] = useState(false);
  const visible = shot && !shot.missing && !failed;
  const chrome = shot?.label ?? label;

  return (
    <div
      className={`browser ${className}`}
      style={height ? ({ ["--browser-h" as string]: height }) : undefined}
    >
      <div className="browser-body relative">
        {/* Chrome */}
        <div className="browser-bar">
          <span aria-hidden className="browser-dots">
            <i />
            <i />
            <i />
          </span>
          {chrome ? (
            <span className="browser-label t-micro" aria-hidden>
              {chrome}
            </span>
          ) : null}
        </div>

        {/* Viewport */}
        <div className="browser-view" style={{ aspectRatio: ratio }}>
          {visible ? (
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes={sizes}
              onError={() => setFailed(true)}
              className="object-cover object-top"
            />
          ) : (
            <FrameSlot label={label} spec={spec} />
          )}
        </div>

        <Dim label={spec.toUpperCase()} style={{ top: "-1.7rem", left: 0, right: 0 }} />
      </div>
    </div>
  );
}
