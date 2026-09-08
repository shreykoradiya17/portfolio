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

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Positioning />
        <WorkIndex />
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
