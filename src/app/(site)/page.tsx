import { ArrowDown, Palette } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { navSections } from "@/content/site";

/**
 * Phase 2 home: real layout shell with placeholder sections so anchor nav,
 * active pill, reveals and smooth scroll can be exercised. Sections are
 * replaced one by one in Phases 4–8.
 */
const placeholders: Record<
  string,
  { title: string; highlight: string; intro: string; phase: string }
> = {
  about: {
    title: "I build the app and the backend it talks to",
    highlight: "backend",
    intro: "Bento grid with count-up stats: ~2 yrs, 10K+ downloads, 400+ DSA, 84% coverage.",
    phase: "Phase 4",
  },
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

export default function Home() {
  return (
    <>
      <section className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 animate-aurora-drift bg-aurora"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
        <div className="container-page pt-32 pb-24">
          <Badge variant="in-progress">Rebuilding · Phase 2</Badge>
          <h1 className="mt-8 text-display">
            Shivam <span className="text-gradient">Gupta</span>
          </h1>
          <p className="mt-6 max-w-[60ch] text-lead text-muted">
            Full-stack &amp; mobile engineer shipping apps to Play Store and App Store, and building
            fault-tolerant, real-time backends in Node.js and Erlang/OTP.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/#work">
              View work <ArrowDown aria-hidden />
            </ButtonLink>
            <ButtonLink href="/design-system" variant="glass">
              <Palette aria-hidden /> Design system
            </ButtonLink>
          </div>
        </div>
      </section>

      {navSections.map((section, i) => {
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
                  index={String(i + 1).padStart(2, "0")}
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
