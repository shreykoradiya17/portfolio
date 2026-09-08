/**
 * MyVitalView — the precision composition.
 *
 * Real charts drawn from deterministic seeded values, labelled plainly as an
 * illustrative study. No patient data, no invented product metrics, and no
 * pretend screenshot.
 *
 * The point being made is the design thesis for this project: a vital sign is
 * a threshold problem, not a chart problem. Normal is deliberately boring —
 * hairline, graphite, inside a quiet band. Out of range is the only vermilion
 * on the plate, and it is impossible to miss.
 *
 * Values are computed at module scope from a fixed seed, so the server and the
 * client draw byte-identical paths.
 */

import { PlateLabel } from "@/components/work/ProjectMeta";

/** mulberry32 — small, fast, and stable across runtimes. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 260;
const H = 70;
const N = 26;

interface Series {
  key: string;
  label: string;
  unit: string;
  band: [number, number];
  base: number;
  jitter: number;
  seed: number;
  /** Index forced outside the band, if any. */
  breach?: { i: number; to: number };
  decimals: number;
}

const SERIES: Series[] = [
  { key: "hr", label: "Heart rate", unit: "bpm", band: [60, 100], base: 74, jitter: 7, seed: 11, decimals: 0 },
  { key: "spo2", label: "SpO₂", unit: "%", band: [95, 100], base: 97.6, jitter: 1.1, seed: 29, decimals: 1 },
  { key: "sys", label: "Systolic", unit: "mmHg", band: [90, 120], base: 111, jitter: 6, seed: 47,
    breach: { i: 19, to: 134 }, decimals: 0 },
  { key: "temp", label: "Temperature", unit: "°C", band: [36.1, 37.2], base: 36.7, jitter: 0.22, seed: 71, decimals: 1 },
];

interface Built {
  s: Series;
  path: string;
  bandY: [number, number];
  breachPt?: { x: number; y: number; v: number };
  last: number;
}

const BUILT: Built[] = SERIES.map((s) => {
  const rand = rng(s.seed);
  const vals: number[] = [];
  for (let i = 0; i < N; i++) {
    const drift = Math.sin(i / 3.4 + s.seed) * s.jitter * 0.4;
    vals.push(s.base + drift + (rand() - 0.5) * s.jitter);
  }
  if (s.breach) vals[s.breach.i] = s.breach.to;

  // Fix the y-domain to the band plus headroom, so the band is always the
  // visual reference and a breach visibly leaves it.
  const pad = (s.band[1] - s.band[0]) * 0.55;
  const lo = Math.min(s.band[0] - pad, ...vals);
  const hi = Math.max(s.band[1] + pad, ...vals);
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  const x = (i: number) => (i / (N - 1)) * W;

  return {
    s,
    path: vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" "),
    bandY: [y(s.band[1]), y(s.band[0])],
    breachPt: s.breach
      ? { x: x(s.breach.i), y: y(s.breach.to), v: s.breach.to }
      : undefined,
    last: vals[N - 1],
  };
});

function Chart({ b }: { b: Built }) {
  const { s } = b;
  const inRange = b.last >= s.band[0] && b.last <= s.band[1];
  return (
    <div className="vital-cell border-t border-rule pt-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="t-meta" style={{ textTransform: "none", letterSpacing: "0.03em" }}>
          {s.label}
        </span>
        <span className="t-micro tnum" style={{ color: inRange ? "var(--graphite)" : "var(--vermilion)" }}>
          {b.last.toFixed(s.decimals)} {s.unit}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={`${s.label}, illustrative series. Reference range ${s.band[0]} to ${s.band[1]} ${s.unit}.${
          b.breachPt ? ` One reading of ${b.breachPt.v} ${s.unit} falls outside the range.` : ""
        }`}
      >
        {/* Reference range — normal is quiet by design */}
        <rect
          x="0"
          y={b.bandY[0]}
          width={W}
          height={b.bandY[1] - b.bandY[0]}
          fill="color-mix(in oklab, var(--ink) 5%, transparent)"
        />
        <line x1="0" y1={b.bandY[0]} x2={W} y2={b.bandY[0]} stroke="var(--rule)" strokeDasharray="2 3" />
        <line x1="0" y1={b.bandY[1]} x2={W} y2={b.bandY[1]} stroke="var(--rule)" strokeDasharray="2 3" />

        <path d={b.path} fill="none" stroke="var(--graphite)" strokeWidth="1.25" strokeLinejoin="round" />

        {b.breachPt ? (
          <g>
            <line
              x1={b.breachPt.x} y1={b.breachPt.y} x2={b.breachPt.x} y2={H}
              stroke="var(--vermilion)" strokeWidth="1"
            />
            <circle cx={b.breachPt.x} cy={b.breachPt.y} r="3.4" fill="var(--vermilion)" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}

export default function VitalCharts() {
  return (
    <figure className="relative m-0">
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <PlateLabel>Data study · illustrative</PlateLabel>
        <span className="t-micro dim-2">Seeded values · no patient data</span>
      </figcaption>

      <div className="grid grid-cols-1 gap-x-[var(--col-gap)] gap-y-6 border border-rule p-[clamp(1rem,2.4vw,2rem)] sm:grid-cols-2">
        {BUILT.map((b) => (
          <Chart key={b.s.key} b={b} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="t-micro dim-2 flex items-center gap-2">
          <span aria-hidden className="block h-2.5 w-4" style={{ background: "color-mix(in oklab, var(--ink) 8%, transparent)", border: "1px dashed var(--rule)" }} />
          Reference range
        </span>
        <span className="t-micro dim-2 flex items-center gap-2">
          <span aria-hidden className="block h-2.5 w-2.5 rounded-full" style={{ background: "var(--vermilion)" }} />
          Outside range
        </span>
        <span className="t-micro dim-2">
          Four portals read the same record differently
        </span>
      </div>
    </figure>
  );
}
