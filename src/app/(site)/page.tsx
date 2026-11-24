import { CrossTapes } from "@/components/motion/CrossTapes";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { navSections } from "@/content/site";

/** Section numbers ("01 / About" …) follow the nav order in content/site.ts. */
const indexOf = (id: string) =>
  String(navSections.findIndex((s) => s.id === id) + 1).padStart(2, "0");

export default function Home() {
  return (
    <>
      <Hero />
      <About index={indexOf("about")} />
      <Experience index={indexOf("experience")} />
      <Work index={indexOf("work")} />
      <CrossTapes />
      <Skills index={indexOf("skills")} />
      <Contact index={indexOf("contact")} />
    </>
  );
}
