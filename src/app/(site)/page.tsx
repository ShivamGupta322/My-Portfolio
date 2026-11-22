import { Reveal } from "@/components/motion/Reveal";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { navSections } from "@/content/site";

/**
 * Home. Hero + About are real (Phase 4); the remaining sections are placeholders
 * replaced in Phases 5–8. Section numbers follow navSections order.
 */
const placeholders: Record<
  string,
  { title: string; highlight: string; intro: string; phase: string }
> = {
  experience: {
    title: "Where I've shipped",
    highlight: "shipped",
    intro: "Scroll-drawn timeline: Scramble Apps (2025 – now) and Shivsys (2025).",
    phase: "Phase 5",
  },
  work: {
    title: "Selected work",
    highlight: "work",
    intro: "Phone, browser, device-duo and system-diagram stages for every project.",
    phase: "Phase 6",
  },
  skills: {
    title: "Tools I reach for",
    highlight: "Tools",
    intro: "Velocity-reactive marquees grouped by lens: Product and Systems.",
    phase: "Phase 8",
  },
  contact: {
    title: "Let's build something",
    highlight: "build",
    intro: "Glass contact form sending through Resend, with a mailto fallback.",
    phase: "Phase 8",
  },
};

const indexOf = (id: string) =>
  String(navSections.findIndex((s) => s.id === id) + 1).padStart(2, "0");

export default function Home() {
  return (
    <>
      <Hero />
      <About index={indexOf("about")} />

      {navSections
        .filter((section) => section.id in placeholders)
        .map((section) => {
          const p = placeholders[section.id];
          return (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="relative border-t border-glass-border section-y"
            >
              <div className="container-page">
                <Reveal>
                  <SectionHeading
                    id={`${section.id}-title`}
                    index={indexOf(section.id)}
                    eyebrow={section.label}
                    title={p.title}
                    highlight={p.highlight}
                    intro={p.intro}
                  />
                </Reveal>
                <Reveal stagger className="mt-12 grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <GlassCard
                      key={n}
                      className="min-h-48"
                      data-cursor={n === 2 ? "View" : undefined}
                    >
                      <p className="font-mono text-label text-muted uppercase">
                        {p.phase} · placeholder {n}
                      </p>
                    </GlassCard>
                  ))}
                </Reveal>
              </div>
            </section>
          );
        })}
    </>
  );
}
