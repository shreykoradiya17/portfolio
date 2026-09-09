/**
 * The metadata block every project carries. Small, tabular, consistent — it is
 * the one thing shared across four otherwise unrelated compositions, which is
 * what makes them read as a series rather than four separate pages.
 */

import type { Project } from "@/data/projects";

export function MetaRow({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <dl className={`m-0 grid grid-cols-2 gap-x-[var(--col-gap)] gap-y-4 sm:grid-cols-4 ${className}`}>
      {[
        { k: "Category", v: project.category },
        { k: "Year", v: project.year },
        { k: "Role", v: project.role },
        { k: "Built with", v: project.stack.join(", ") },
      ].map((f) => (
        <div key={f.k} className="border-t border-rule pt-2.5">
          <dt className="t-micro dim-2 mb-1.5">{f.k}</dt>
          <dd className="t-meta m-0" style={{ letterSpacing: "0.04em", textTransform: "none" }}>
            {f.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** The label that names a bespoke visual for what it actually is. Nothing on
 *  this site pretends to be a product screenshot. */
export function PlateLabel({ children, tone = "ink" }: { children: React.ReactNode; tone?: "ink" | "paper" }) {
  return (
    <span
      className="t-micro inline-flex items-center gap-2"
      style={{ color: tone === "paper" ? "#8E8B85" : "var(--graphite)" }}
    >
      <span
        aria-hidden
        className="inline-block h-[5px] w-[5px]"
        style={{ background: "var(--vermilion)" }}
      />
      {children}
    </span>
  );
}
