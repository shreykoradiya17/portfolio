"use client";

/**
 * One marquee, slow, and it says the only thing worth repeating.
 *
 * "Drawn" is set as outline, "built" as solid — the concept stated in the
 * letterforms themselves rather than in a list of services. Pauses on hover,
 * stops entirely under reduced motion.
 */

export default function Marquee() {
  const PAIR = ["Drawn", "Built"];
  // Two identical halves; the track translates exactly -50% for a seamless loop.
  const run = Array.from({ length: 8 }, (_, i) => PAIR[i % 2]);

  return (
    <section
      className="on-ink marquee-host relative overflow-hidden py-[clamp(2.5rem,6vh,4.5rem)]"
      aria-hidden="true"
    >
      <div className="marquee-track" style={{ ["--mq-dur" as string]: "52s" }}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-baseline">
            {run.map((word, i) => (
              <span key={`${half}-${i}`} className="flex shrink-0 items-baseline">
                <span className={word === "Drawn" ? "mq-word mq-drawn" : "mq-word mq-built"}>
                  {word}
                </span>
                <span className="mq-sep" aria-hidden>
                  ·
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
