import Loader from "@/components/Loader";
import SectionRail from "@/components/SectionRail";
import SectionDivider from "@/components/SectionDivider";
import TitleFX from "@/components/TitleFX";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Loader />
      <SectionRail />

      <main>
        <Hero />
        <About />
        <SectionDivider sector="S2" label="Skills" delta="Δ −0.214" />
        <Skills />
        <SectionDivider sector="S3" label="Projects" delta="Δ −0.087" />
        <Projects />
        <SectionDivider sector="S4" label="Experience" delta="Δ +0.031" />
        <Experience />
        <SectionDivider sector="S5" label="Contact" delta="Δ −0.342" />
        <Contact />
      </main>

      <Footer />
      <TitleFX />
    </>
  );
}