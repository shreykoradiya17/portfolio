"use client";

/**
 * Device frame for mobile product screens.
 *
 * Geometry is iPhone 15/16 Pro: a 393×852pt screen, a 55pt screen radius and a
 * 125×36pt Dynamic Island. Every measurement is in `cqw` against the frame's
 * own inline size, so the geometry scales without the corner radii distorting
 * the way percentage radii do on a tall box.
 *
 * Height-driven: sized from the viewport so the whole device is visible without
 * scrolling, with the width following from the ratio.
 *
 * Art direction: a drawn object, not a glossy product render. Ink bezel,
 * hairline inner ring so it separates on warm paper and near-black alike, no
 * gloss, no drop shadow. Rendered with `fill`, so any capture at the right
 * ratio drops in without declaring dimensions.
 */

import { useState } from "react";
import Image from "next/image";
import FrameSlot from "@/components/work/FrameSlot";
import { Dim } from "@/components/primitives/Marks";

/** iPhone 15/16 Pro logical points. A capture must match this ratio. */
const PT_W = 393;
const PT_H = 852;

export interface PhoneShotSrc {
  src: string;
  alt: string;
  /** Set when the file is not on disk; the slot renders instead. */
  missing?: boolean;
}

export default function PhoneFrame({
  shot,
  className = "",
  height,
  sizes = "(max-width: 767px) 62vw, (max-width: 1023px) 32vw, 24vw",
  label,
}: {
  shot?: PhoneShotSrc;
  className?: string;
  /** Overrides --phone-h, e.g. "min(72svh, 660px)". */
  height?: string;
  sizes?: string;
  label?: string;
}) {
  // A configured-but-missing file degrades to the slot instead of a broken
  // image, so an asset path can be wired up before the file exists.
  const [failed, setFailed] = useState(false);
  const visible = shot && !shot.missing && !failed;

  return (
    <div
      className={`phone ${className}`}
      style={height ? ({ ["--phone-h" as string]: height }) : undefined}
    >
      <div className="phone-body relative">
        {/* Side buttons — thin bars protruding from the body edge */}
        <span aria-hidden className="phone-btn phone-btn--action" />
        <span aria-hidden className="phone-btn phone-btn--vol-up" />
        <span aria-hidden className="phone-btn phone-btn--vol-dn" />
        <span aria-hidden className="phone-btn phone-btn--power" />

        <div className="phone-screen">
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
            <FrameSlot label={label} spec={`${PT_W} × ${PT_H} pt`} />
          )}
        </div>

        {/* Dynamic Island. Sits in the capture's own status-bar gap. */}
        <span aria-hidden className="phone-island" />

        <Dim label={`${PT_W} × ${PT_H} PT`} style={{ top: "-1.7rem", left: 0, right: 0 }} />
      </div>
    </div>
  );
}
