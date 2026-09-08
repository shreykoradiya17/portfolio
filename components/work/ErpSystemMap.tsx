"use client";

/**
 * Technource ERP — the system-oriented composition.
 *
 * A technical drawing of the architecture rather than a picture of the product.
 * Every label here is supported by the résumé; the modules with no published
 * detail are left with a dash instead of an invented caption, which is both
 * honest and reads correctly as a spec sheet.
 *
 * Notes are always in the DOM. Hover only adds emphasis, so nothing is hidden
 * from assistive technology or from a keyboard.
 */

import { PlateLabel } from "@/components/work/ProjectMeta";
import { Dim } from "@/components/primitives/Marks";

const MODULES = [
  { n: "01", name: "Projects",    note: "Kanban · drag & drop · sprint sync · filtering" },
  { n: "02", name: "HRMS",        note: "HR scoring" },
  { n: "03", name: "Attendance",  note: "Biometric · realtime over WebSockets", live: true },
  { n: "04", name: "Recruitment", note: null },
  { n: "05", name: "Reporting",   note: "Dashboards" },
  { n: "··", name: "+3 more",     note: "Eight modules in total", muted: true },
];

/** A board diagram, not a screenshot. One card is drawn mid-drag. */
function BoardDiagram() {
  const cols = [
    { label: "Backlog", cards: [1, 1, 0.6] },
    { label: "Active", cards: [1, 0.75] },
    { label: "Review", cards: [0.85] },
  ];
  return (
    <div className="flex gap-2" aria-hidden="true">
      {cols.map((c, ci) => (
        <div key={c.label} className="flex-1">
          <div className="t-micro dim-2 mb-1.5 truncate">{c.label}</div>
          <div className="flex flex-col gap-1.5 border-t border-rule pt-1.5">
            {c.cards.map((w, i) => (
              <span
                key={i}
                className="block h-[9px]"
                style={{
                  width: `${w * 100}%`,
                  background: "color-mix(in oklab, var(--ink) 12%, transparent)",
                }}
              />
            ))}
            {ci === 1 ? (
              <span
                className="block h-[9px] translate-x-2"
                style={{
                  width: "88%",
                  border: "1px dashed var(--vermilion)",
                  background: "color-mix(in oklab, var(--vermilion) 10%, transparent)",
                }}
              />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ErpSystemMap() {
  return (
    <figure className="erp-map relative m-0">
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <PlateLabel>System map · architecture</PlateLabel>
        <span className="t-micro dim-2">Drawn, not captured</span>
      </figcaption>

      <div className="relative border p-[clamp(1rem,2.2vw,1.75rem)]"
        style={{ borderColor: "var(--rule-strong)", background: "color-mix(in oklab, var(--paper-2) 45%, transparent)" }}>
        {/* ---- Core + modules ------------------------------------------- */}
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-rule pb-3">
          <span className="t-meta">React SPA core</span>
          <span className="t-micro dim-2">Single page · client routed</span>
        </div>

        {/* The spine. The module ticks connect to this, which is what makes
            the block read as a drawing rather than a list with dashes. */}
        <div className="relative">
          <span
            aria-hidden
            className="absolute bottom-0 top-0 block w-px"
            style={{ left: 0, background: "var(--rule-strong)" }}
          />
          <ul className="m-0 list-none p-0">
          {MODULES.map((m) => (
            <li key={m.name} className="erp-row group relative border-b border-rule-soft last:border-b-0">
              <div className="flex items-baseline gap-3 py-2.5 sm:gap-4">
                {/* The connector back to the spine */}
                <span
                  aria-hidden
                  className="erp-tick mt-[0.55em] block h-px shrink-0"
                  style={{ width: "clamp(14px, 3vw, 34px)" }}
                />
                <span className="t-micro dim-2 tnum shrink-0">{m.n}</span>
                <span
                  className="t-meta shrink-0"
                  style={{
                    textTransform: "none",
                    letterSpacing: "0.02em",
                    opacity: m.muted ? 0.5 : 1,
                  }}
                >
                  {m.name}
                </span>
                {m.live ? (
                  <span
                    className="t-micro shrink-0 px-1.5 py-[1px]"
                    style={{ color: "var(--vermilion)", border: "1px solid currentColor" }}
                  >
                    Live
                  </span>
                ) : null}
                <span aria-hidden className="mx-1 hidden h-px flex-1 bg-rule-soft sm:block" />
                <span className="t-micro dim ml-auto hidden text-right sm:block">
                  {m.note ?? <span aria-hidden>—</span>}
                </span>
              </div>
              {/* Mobile keeps the note, on its own line */}
              {m.note ? <span className="t-micro dim mb-2.5 block pl-[calc(clamp(14px,3vw,34px)+1.5rem)] sm:hidden">{m.note}</span> : null}
            </li>
          ))}
          </ul>
        </div>

        {/* ---- Access --------------------------------------------------- */}
        <div className="mt-7 border-t border-rule pt-4">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <span className="t-meta">Role-based access</span>
            <span className="t-micro dim-2">Eight roles · one interface</span>
          </div>
          <div className="flex flex-wrap gap-1.5" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                className="role-cell t-micro grid h-7 w-7 place-items-center border border-rule leading-none"
                style={{ transitionDelay: `${i * 22}ms`, color: "var(--graphite)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>

        {/* ---- Workflow -------------------------------------------------- */}
        <div className="mt-7 border-t border-rule pt-4">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <span className="t-meta">Workflow</span>
            <span className="t-micro dim-2">Board · drag &amp; drop · sprint sync</span>
          </div>
          <BoardDiagram />
        </div>

        <Dim label="12 COL" style={{ top: "-1.6rem", left: 0, right: 0 }} />
      </div>
    </figure>
  );
}
