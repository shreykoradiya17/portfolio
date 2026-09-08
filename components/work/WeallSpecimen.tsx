"use client";

/**
 * WeAll — the editorial, human composition.
 *
 * A design specimen page: the type ramp, the states every component owes, the
 * string-length tolerance that bilingual support actually demands, and the
 * surfaces the product covers. It is a real specimen rendered in real CSS, so
 * it is evidence rather than illustration.
 *
 * The bilingual block deliberately demonstrates length tolerance instead of
 * naming languages — the résumé says bilingual, not which two.
 */

import { Fragment } from "react";
import { PlateLabel } from "@/components/work/ProjectMeta";

const RAMP = [
  { label: "Display", size: "clamp(2rem,4vw,3.25rem)", weight: 600, wdth: 90 },
  { label: "Title", size: "clamp(1.25rem,2vw,1.75rem)", weight: 500, wdth: 96 },
  { label: "Body", size: "1.0625rem", weight: 400, wdth: 100 },
  { label: "Meta", size: "0.75rem", weight: 400, wdth: 100, mono: true },
];

const STATES = ["Default", "Hover", "Focus", "Disabled"] as const;

const SURFACES = [
  "Community", "Groups", "Messaging", "Maps", "Nearby discovery",
  "Filters", "Profiles", "Notifications", "Settings",
];

export default function WeallSpecimen() {
  return (
    <figure className="relative m-0">
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <PlateLabel>Design specimen · system</PlateLabel>
        <span className="t-micro dim-2">Rendered, not captured</span>
      </figcaption>

      <div className="border border-rule p-[clamp(1rem,2.4vw,2.25rem)]">
        {/* ---- Type ramp -------------------------------------------------- */}
        <div className="mb-10">
          <div className="t-micro dim-2 mb-4 border-b border-rule pb-2">Type ramp</div>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {RAMP.map((r) => (
              <li key={r.label} className="flex items-baseline gap-4 border-b border-rule-soft pb-1.5 last:border-b-0">
                <span
                  aria-hidden
                  style={{
                    fontSize: r.size,
                    fontWeight: r.weight,
                    fontVariationSettings: `"wdth" ${r.wdth}`,
                    fontFamily: r.mono ? "var(--font-mono)" : undefined,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Aa
                </span>
                <span aria-hidden className="h-px flex-1 bg-rule-soft" />
                <span className="t-micro dim-2 shrink-0">{r.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- States ----------------------------------------------------- */}
        <div className="mb-10">
          <div className="t-micro dim-2 mb-4 border-b border-rule pb-2">
            Every component owes these
          </div>
          <div className="flex flex-wrap gap-2">
            {STATES.map((s) => (
              <span key={s} className={`spec-chip spec-chip--${s.toLowerCase()} t-meta`}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ---- String tolerance ------------------------------------------- */}
        <div className="mb-10">
          <div className="t-micro dim-2 mb-4 border-b border-rule pb-2">
            String-length tolerance
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { label: "Nearby", w: 34 },
              { label: "People near you right now", w: 92 },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span
                  className="t-meta shrink-0 border border-rule px-2 py-1"
                  style={{ textTransform: "none", letterSpacing: "0.02em" }}
                >
                  {row.label}
                </span>
                <span
                  aria-hidden
                  className="block h-[3px] shrink-0"
                  style={{
                    width: `${row.w}px`,
                    background: "color-mix(in oklab, var(--vermilion) 55%, transparent)",
                  }}
                />
                <span className="t-micro dim-2 truncate">
                  same component · {row.label.length} chars
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Surfaces --------------------------------------------------- */}
        <div>
          <div className="t-micro dim-2 mb-4 border-b border-rule pb-2">Surfaces designed</div>
          {/* The separators carry real space text nodes on both sides. Adjacent
              inline spans with no whitespace between them give the browser no
              break opportunity, and the whole list lays out as one unbreakable
              run that overflows narrow viewports. */}
          <p className="t-lead m-0" style={{ letterSpacing: "-0.018em" }}>
            {SURFACES.map((s, i) => (
              <Fragment key={s}>
                <span className="surface-word">{s}</span>
                {i < SURFACES.length - 1 ? (
                  <>
                    {" "}
                    <span aria-hidden className="dim-2">
                      /
                    </span>{" "}
                  </>
                ) : null}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </figure>
  );
}
