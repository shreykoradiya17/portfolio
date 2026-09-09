"use client";

/**
 * The last scene.
 *
 * Not "ready to start a project?". An invitation with a point of view: the
 * work worth having is the difficult work, and saying so filters better than
 * a generic call to action.
 */

import SplitLines from "@/components/primitives/SplitLines";
import Reveal from "@/components/primitives/Reveal";
import Magnetic from "@/components/primitives/Magnetic";
import { SpecColumns, Registration as Mark } from "@/components/primitives/Marks";
import { site } from "@/data/site";

export default function Contact() {
  return (
    <section
      id="contact"
      className="on-ink relative overflow-hidden pb-[clamp(3rem,8vh,6rem)] pt-[var(--sp-section)]"
      aria-labelledby="contact-h"
    >
      <SpecColumns />

      <div className="grid-page relative">
        <div className="col-span-12 flex items-baseline gap-[var(--col-gap)] border-t pt-3" style={{ borderColor: "var(--rule)" }}>
          <span className="t-meta acc tnum shrink-0">07</span>
          <span className="t-meta shrink-0">Contact</span>
          <span aria-hidden className="mx-1 hidden h-px flex-1 translate-y-[-0.3em] sm:block" style={{ background: "var(--rule)" }} />
          <span className="t-meta dim ml-auto shrink-0 sm:ml-0">{site.status}</span>
        </div>
      </div>

      <div className="grid-page mt-[clamp(3rem,10vh,8rem)]">
        <SplitLines as="h2" id="contact-h" className="t-hero col-span-12 m-0" stagger={0.08}>
          Send me
          <br />
          the hard
          <br />
          one.
        </SplitLines>
      </div>

      <div className="grid-page mt-[clamp(3rem,9vh,7rem)] items-end">
        <div className="col-span-12 md:col-span-7">
          <Reveal variant="rise">
            <span className="t-micro dim-2 block">Email</span>
          </Reveal>
          <Reveal variant="rise" delay={0.05}>
            <Magnetic strength={0.16} radius={160}>
              <a
                href={`mailto:${site.email}`}
                data-cursor="link"
                data-cursor-label="Write to me"
                className="t-title ul-link mt-2 inline-block"
                style={{ letterSpacing: "-0.03em" }}
              >
                {site.email}
              </a>
            </Magnetic>
          </Reveal>

          <Reveal variant="rise" delay={0.1}>
            <p className="t-body dim mt-8 max-w-[46ch]">
              Product work, design systems, and interfaces that have to survive real use.
              If the problem is genuinely difficult, lead with that.
            </p>
          </Reveal>
        </div>

        <div className="col-span-12 mt-10 flex flex-col gap-6 md:col-start-9 md:col-end-13 md:mt-0 md:items-end">
          <div className="md:text-right">
            <span className="t-micro dim-2 block">Elsewhere</span>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              data-cursor-label="Open ↗"
              className="t-meta ul-link ul-static mt-2 inline-block"
            >
              LinkedIn ↗
            </a>
          </div>
          <div className="md:text-right">
            <span className="t-micro dim-2 block">Based</span>
            <span className="t-meta mt-2 block" style={{ textTransform: "none", letterSpacing: "0.03em" }}>
              {site.city}, {site.region}
            </span>
            <span className="t-micro dim-2 mt-1 block">{site.coords}</span>
          </div>
          <span className="acc" aria-hidden>
            <Mark size={16} />
          </span>
        </div>
      </div>
    </section>
  );
}
