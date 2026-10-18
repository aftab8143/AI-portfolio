import HomeHero from "./components/home/Hero";
import TechMarquee from "./components/home/TechMarquee";
import Stats from "./components/home/Stats";
import Manifesto from "./components/home/Manifesto";
import Experience from "./components/home/Experience";
import Process from "./components/home/Process";
import Work from "./components/home/Work";
import Skills from "./components/home/Skills";
import About from "./components/home/About";
import Contact from "./components/home/Contact";

export default function Home() {
  return (
    <>
      <HomeHero />
      <TechMarquee />
      <Stats />
      <Manifesto />
      <Experience />
      <Process />
      <Work />
      <Skills />
      <About />
      <Contact />
    </>
  );
}
