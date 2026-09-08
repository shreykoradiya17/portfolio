"use client";

/**
 * No handoff.
 *
 * Six stages from Figma to shipped product. Each stage owns a glyph that is
 * drawn (stroked outline) when inactive and built (filled) when active — the
 * site's whole thesis, stated six times in miniature.
 *
 * Implemented as a real tablist: hover previews, click and arrow keys select,
 * every panel stays in the DOM. Nothing here is hidden from a screen reader or
 * unreachable from a keyboard.
 */

import { useCallback, useRef, useState } from "react";
import Reveal from "@/components/primitives/Reveal";
import SplitLines from "@/components/primitives/SplitLines";
import { SectionMark, SpecColumns, Anno } from "@/components/primitives/Marks";
import { pipeline } from "@/data/site";

/** One glyph per stage. `built` swaps stroke for fill. */
function Glyph({ id, built }: { id: string; built: boolean }) {
  const stroke = "currentColor";
  const fill = built ? "currentColor" : "none";
  const common = { stroke, strokeWidth: 1.25, fill: "none" } as const;

  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true" className="block">
      {id === "figma" && (
        <>
          <rect x="8.5" y="8.5" width="23" height="23" {...common} fill={fill} opacity={built ? 0.16 : 1} />
          <rect x="8.5" y="8.5" width="23" height="23" {...common} />
          {[[8.5, 8.5], [31.5, 8.5], [8.5, 31.5], [31.5, 31.5]].map(([cx, cy]) => (
            <rect key={`${cx}-${cy}`} x={cx - 2} y={cy - 2} width="4" height="4"
              stroke={stroke} strokeWidth="1" fill={built ? stroke : "var(--paper)"} />
          ))}
        </>
      )}
      {id === "system" && (
        <>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}${c}`} x={9 + c * 8} y={9 + r * 8} width="6" height="6"
                stroke={stroke} strokeWidth="1" fill={built ? stroke : "none"}
                opacity={built ? (r + c) % 2 === 0 ? 1 : 0.35 : 1} />
            ))
          )}
        </>
      )}
      {id === "component" && (
        <>
          <rect x="7.5" y="12.5" width="25" height="15" {...common} fill={fill} opacity={built ? 0.16 : 1} />
          <rect x="7.5" y="12.5" width="25" height="15" {...common} />
          {[12, 20, 28].map((cx) => (
            <circle key={cx} cx={cx} cy="20" r="2" stroke={stroke} strokeWidth="1"
              fill={built ? stroke : "none"} />
          ))}
        </>
      )}
      {id === "code" && (
        <>
          <path d="M15 12 L8 20 L15 28" {...common} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25 12 L32 20 L25 28" {...common} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 11 L18 29" {...common} strokeLinecap="round"
            opacity={built ? 1 : 0.4} strokeWidth={built ? 2.5 : 1.25} />
        </>
      )}
      {id === "interaction" && (
        <>
          <path d="M8 32 C 8 32, 14 8, 32 8" {...common} strokeLinecap="round"
            strokeWidth={built ? 2 : 1.25} />
          <circle cx="8" cy="32" r="2" fill={built ? stroke : "none"} stroke={stroke} strokeWidth="1" />
          <circle cx="32" cy="8" r="2" fill={built ? stroke : "none"} stroke={stroke} strokeWidth="1" />
          {built ? <path d="M8 32 C 8 32, 14 8, 32 8 L32 32 Z" fill={stroke} opacity="0.12" stroke="none" /> : null}
        </>
      )}
      {id === "product" && (
        <>
          <rect x="8.5" y="8.5" width="23" height="23" {...common} fill={fill} opacity={built ? 1 : 1} />
          {!built ? <path d="M8.5 8.5 L31.5 31.5 M31.5 8.5 L8.5 31.5" {...common} opacity="0.28" /> : null}
        </>
      )}
    </svg>
  );
}

export default function Pipeline() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      const last = pipeline.length - 1;
      let next: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = last;
      if (next === null) return;
      e.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    },
    [active]
  );

  const stage = pipeline[active];

  return (
    <section id="pipeline" className="section relative" aria-labelledby="pipeline-h">
      <SpecColumns />
      <SectionMark n="03" label="No handoff" right="Figma → product" />

      <div className="grid-page mt-[clamp(3rem,9vh,7rem)]">
        <SplitLines as="h2" id="pipeline-h" className="t-display col-span-12 m-0 md:col-span-7">
          No
          <br />
          handoff.
        </SplitLines>

        <Reveal variant="rise" delay={0.1} className="col-span-12 mt-8 md:col-start-9 md:col-end-13 md:mt-0 md:self-end">
          <p className="t-body dim m-0">
            Design and engineering are one pipeline, not two teams passing files.
            Six stages — and I work in all of them.
          </p>
        </Reveal>
      </div>

      {/* ---- The rail ------------------------------------------------------- */}
      <div className="grid-page mt-[clamp(3rem,8vh,6rem)]">
        <div className="relative col-span-12">
          <div
            role="tablist"
            aria-label="Design to product pipeline"
            onKeyDown={onKey}
            className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6"
            style={{ background: "var(--rule)" }}
          >
            {pipeline.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => { tabs.current[i] = el; }}
                  role="tab"
                  id={`pipe-tab-${s.id}`}
                  aria-selected={on}
                  aria-controls={`pipe-panel-${s.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  data-cursor="explore"
                  className="pipe-tab group flex flex-col items-start gap-5 p-4 text-left lg:p-5"
                  data-on={on ? "1" : "0"}
                >
                  <span className="flex w-full items-start justify-between">
                    <span className="t-micro tnum dim-2">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-micro" style={{ color: on ? "var(--vermilion)" : "transparent" }}>
                      {s.kicker}
                    </span>
                  </span>

                  <span className="pipe-glyph block h-9 w-9 lg:h-11 lg:w-11">
                    <Glyph id={s.id} built={on} />
                  </span>

                  <span className="t-meta block" style={{ letterSpacing: "0.05em" }}>
                    {s.stage}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress through the pipeline */}
          <div className="relative mt-px h-px w-full" style={{ background: "var(--rule)" }}>
            <span
              className="absolute left-0 top-0 block h-px origin-left"
              style={{
                width: "100%",
                background: "var(--vermilion)",
                transform: `scaleX(${(active + 1) / pipeline.length})`,
                transition: "transform 0.5s var(--e-io)",
              }}
            />
          </div>

          <Anno style={{ top: "-1.6rem", left: 0 }}>TABLIST · ARROW KEYS</Anno>
        </div>
      </div>

      {/* ---- The panel ------------------------------------------------------ */}
      <div className="grid-page mt-[clamp(2rem,5vh,3.5rem)]">
        <div className="col-span-12 md:col-span-8 lg:col-span-7">
          {pipeline.map((s, i) => (
            <div
              key={s.id}
              role="tabpanel"
              id={`pipe-panel-${s.id}`}
              aria-labelledby={`pipe-tab-${s.id}`}
              hidden={i !== active}
            >
              <p className="t-title m-0">{s.line}</p>
              <p className="t-body dim mt-4 max-w-[54ch]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="col-span-12 mt-8 md:col-start-10 md:col-end-13 md:mt-0 md:text-right">
          <span className="t-micro dim-2 block">Stage</span>
          <span className="t-meta acc tnum mt-1 block">
            {String(active + 1).padStart(2, "0")} / {String(pipeline.length).padStart(2, "0")}
          </span>
          <span className="t-micro dim-2 mt-3 block">{stage.kicker}</span>
        </div>
      </div>
    </section>
  );
}
