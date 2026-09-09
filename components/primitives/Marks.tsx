"use client";

import type { ReactNode } from "react";

/**
 * The drawn layer's vocabulary: editorial section marks that are always
 * present, and blueprint annotations that only exist in spec mode.
 */

/** Always-visible editorial section label. A hairline, a number, a name. */
export function SectionMark({
  n,
  label,
  right,
  className = "",
}: {
  n: string;
  label: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid-page ${className}`}>
      <div className="col-span-12 flex items-baseline gap-[var(--col-gap)] border-t border-rule pt-3">
        <span className="t-meta acc tnum shrink-0">{n}</span>
        <span className="t-meta shrink-0">{label}</span>
        <span aria-hidden className="mx-1 hidden h-px flex-1 translate-y-[-0.3em] bg-rule sm:block" />
        {right ? <span className="t-meta dim ml-auto shrink-0 sm:ml-0">{right}</span> : null}
      </div>
    </div>
  );
}

/** 12 blueprint column rules. Absolutely positioned, spec mode only. */
export function SpecColumns({ className = "" }: { className?: string }) {
  return (
    <div className={`spec-layer spec-columns ${className}`} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

/** A blueprint annotation chip. Positioned by the caller. */
export function Anno({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`spec-layer anno absolute ${className}`} style={style} aria-hidden="true">
      {children}
    </span>
  );
}

/** A dimension line with a measurement, drawn in spec mode. */
export function Dim({
  label,
  axis = "x",
  className = "",
  style,
}: {
  label: string;
  axis?: "x" | "y";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`spec-layer absolute flex items-center gap-1 ${
        axis === "y" ? "flex-col" : ""
      } ${className}`}
      style={style}
    >
      <span
        className={axis === "x" ? "h-px flex-1" : "w-px flex-1"}
        style={{ background: "color-mix(in oklab, var(--blueprint) 45%, transparent)" }}
      />
      <span className="anno">{label}</span>
      <span
        className={axis === "x" ? "h-px flex-1" : "w-px flex-1"}
        style={{ background: "color-mix(in oklab, var(--blueprint) 45%, transparent)" }}
      />
    </span>
  );
}

/** Registration cross — the print mark that gives the concept its name. */
export function Registration({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      className={className}
      fill="none"
    >
      <circle cx="7" cy="7" r="3.4" stroke="currentColor" strokeWidth="1" />
      <path d="M7 0v3.2M7 10.8V14M0 7h3.2M10.8 7H14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Four corner trim marks. Separate SVGs so each path lives in its own viewBox
 *  and DrawSVG can stroke them on. Marks the viewport as a printed sheet. */
export function CropMarks({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const corners = [
    { cls: "left-0 top-0",     d: "M0.5 0.5 H22 M0.5 0.5 V22" },
    { cls: "right-0 top-0",    d: "M23.5 0.5 H2 M23.5 0.5 V22" },
    { cls: "left-0 bottom-0",  d: "M0.5 23.5 H22 M0.5 23.5 V2" },
    { cls: "right-0 bottom-0", d: "M23.5 23.5 H2 M23.5 23.5 V2" },
  ];
  return (
    <div
      data-h-crop
      aria-hidden="true"
      className="pointer-events-none absolute inset-[var(--gx)] z-[2]"
      style={{ color: tone === "paper" ? "#4A4844" : "var(--graphite-2)" }}
    >
      {corners.map((c) => (
        <svg key={c.cls} className={`absolute ${c.cls}`} width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d={c.d} />
        </svg>
      ))}
    </div>
  );
}
