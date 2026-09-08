import LocalTime from "@/components/primitives/LocalTime";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="on-ink pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[clamp(2rem,5vh,3.5rem)]">
      <div className="grid-page">
        <div
          className="col-span-12 flex flex-col gap-6 border-t pt-5 md:flex-row md:items-baseline md:justify-between"
          style={{ borderColor: "var(--rule)" }}
        >
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="t-meta">{site.name}</span>
            <span className="t-micro dim">UI/UX × Frontend</span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <a href={`mailto:${site.email}`} className="t-micro ul-link" data-cursor="link" data-cursor-label="Write to me">
              Email
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="t-micro ul-link"
              data-cursor="link"
              data-cursor-label="Open ↗"
            >
              LinkedIn
            </a>
            <a href="#top" className="t-micro ul-link">Top</a>
          </nav>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="t-micro dim">{site.city}, India</span>
            <span className="t-micro dim"><LocalTime /></span>
            <span className="t-micro acc tnum">{site.year}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
