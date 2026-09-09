import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, bySlug } from "@/data/projects";
import { resolveShots } from "@/lib/shots.server";
import { site } from "@/data/site";
import { TransitionReady } from "@/lib/transition";
import NamePlate from "@/components/work/NamePlate";
import ProjectVisual from "@/components/work/ProjectVisual";
import ProjectChapters from "@/components/work/ProjectChapters";
import ProjectOutro from "@/components/work/ProjectOutro";
import { MetaRow } from "@/components/work/ProjectMeta";
import Footer from "@/components/sections/Footer";
import { SpecColumns, CropMarks } from "@/components/primitives/Marks";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.standfirst,
    openGraph: {
      title: `${project.name} — ${site.name}`,
      description: project.headline,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) notFound();

  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length];
  const resolved = resolveShots(project);

  return (
    <>
      <TransitionReady />
      <main id="main">
        {/* ---- Hero. Matches the transition plate exactly. -------------- */}
        <section className="on-ink relative flex min-h-[100svh] flex-col justify-between overflow-hidden">
          <SpecColumns />
          <CropMarks tone="paper" />

          <div
            className="grid-page relative z-[2]"
            style={{ paddingTop: "calc(var(--nav-h) + clamp(1.25rem, 4vh, 3rem))" }}
          >
            <span className="t-micro dim col-span-6">{project.year}</span>
            <span className="t-micro dim col-span-6 text-right">{project.role}</span>
          </div>

          <div className="grid-page relative z-[2]" aria-hidden="true">
            <span className="t-micro dim-2 col-span-12 flex items-center gap-2">
              <span className="relative block h-6 w-px overflow-hidden" style={{ background: "var(--rule)" }}>
                <span className="scroll-tick absolute inset-x-0 top-0 block h-2" style={{ background: "var(--graphite)" }} />
              </span>
              Scroll
            </span>
          </div>

          <div className="grid-page relative z-[2] w-full pb-[8vh]">
            <NamePlate
              index={project.index}
              name={project.name}
              category={project.category}
              as="h1"
            />
          </div>
        </section>

        {/* ---- Standfirst ------------------------------------------------ */}
        <section className="section relative">
          <SpecColumns />
          <div className="grid-page">
            <p className="t-title col-span-12 m-0 md:col-span-9 lg:col-span-8">
              {project.headline}
            </p>
            <p className="t-body dim col-span-12 mt-8 md:col-start-1 md:col-end-7 lg:col-end-6">
              {project.standfirst}
            </p>
            <div className="col-span-12 mt-10 md:col-start-8 md:col-end-13 md:mt-0 md:self-end">
              <dl className="m-0 grid grid-cols-2 gap-x-[var(--col-gap)] gap-y-4">
                {project.facts.map((f) => (
                  <div key={f.k} className="border-t border-rule pt-2.5">
                    <dt className="t-micro dim-2 mb-1.5">{f.k}</dt>
                    <dd className="t-meta tnum m-0" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
                      {f.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---- The visual ------------------------------------------------ */}
        <section
          className={`relative pb-[var(--sp-section)] ${
            project.personality === "immersive" ? "on-ink pt-[var(--sp-section)]" : ""
          }`}
        >
          <div className="grid-page">
            <div className="col-span-12 lg:col-end-12">
              <ProjectVisual project={resolved} />
            </div>
          </div>
        </section>

        {/* ---- Chapters -------------------------------------------------- */}
        <ProjectChapters chapters={project.chapters} />

        {/* ---- Stack ----------------------------------------------------- */}
        <section className="relative pb-[var(--sp-section)]">
          <div className="grid-page">
            <div className="col-span-12 border-t border-rule pt-3">
              <span className="t-meta dim">Details</span>
            </div>
            <div className="col-span-12 mt-6">
              <MetaRow project={project} />
            </div>
          </div>
        </section>

        {/* ---- Next ------------------------------------------------------ */}
        <ProjectOutro next={next} />
      </main>
      <Footer />
    </>
  );
}
