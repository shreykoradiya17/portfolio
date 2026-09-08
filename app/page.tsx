import Hero from "@/components/sections/Hero";
import Positioning from "@/components/sections/Positioning";
import WorkIndex from "@/components/sections/WorkIndex";
import Pipeline from "@/components/sections/Pipeline";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { resolveProjects } from "@/lib/shots.server";

export default function Home() {
  // Resolved here so a capture that has not been added yet falls back to its
  // labelled slot instead of shipping a broken image.
  const projects = resolveProjects();

  return (
    <>
      <main id="main">
        <Hero />
        <Positioning />
        <WorkIndex projects={projects} />
        <Pipeline />
        <Marquee />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
