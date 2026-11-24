import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowUpRight, Download, Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechChip } from "@/components/ui/TechChip";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SegmentedDemo } from "./_components/SegmentedDemo";

export const metadata: Metadata = {
  title: "Design System",
  description: "Midnight Aurora tokens and components (internal reference).",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "bg", cls: "bg-bg", dark: "#07070C", light: "#F7F7FB" },
  { name: "surface", cls: "bg-surface", dark: "#11121A", light: "#FFFFFF" },
  { name: "elevated", cls: "bg-elevated", dark: "#1A1B26", light: "#EEF0F6" },
  { name: "glass", cls: "bg-glass", dark: "white / 6%", light: "white / 80%" },
  { name: "fg", cls: "bg-fg", dark: "#F4F4F8", light: "#0F172A" },
  { name: "muted", cls: "bg-muted", dark: "#A1A1B5", light: "#475569" },
  { name: "primary", cls: "bg-primary", dark: "#8B5CF6", light: "#7C3AED" },
  { name: "primary-strong", cls: "bg-primary-strong", dark: "#7C3AED", light: "#7C3AED" },
  { name: "primary-text", cls: "bg-primary-text", dark: "#A78BFA", light: "#6D28D9" },
  { name: "accent", cls: "bg-accent", dark: "#22D3EE", light: "#0E7490" },
  { name: "success", cls: "bg-success", dark: "#34D399", light: "#047857" },
  { name: "warning", cls: "bg-warning", dark: "#FBBF24", light: "#B45309" },
  { name: "danger", cls: "bg-danger", dark: "#FB7185", light: "#BE123C" },
];

const typeScale = [
  { token: "text-display", sample: "Shivam Gupta", cls: "text-display font-display" },
  { token: "text-h1", sample: "Vela Meet case study", cls: "text-h1 font-display" },
  { token: "text-h2", sample: "Selected work", cls: "text-h2 font-display" },
  { token: "text-h3", sample: "Fault-tolerant order processing", cls: "text-h3 font-display" },
  { token: "text-h4", sample: "Real-time chat over WebSockets", cls: "text-h4 font-display" },
  {
    token: "text-lead",
    sample: "I build the app and the backend it talks to.",
    cls: "text-lead text-muted",
  },
  {
    token: "text-body",
    sample:
      "Built a video-conferencing platform backend from scratch (PostgreSQL, Redis, Jitsi, calendar sync, 2FA, Active Directory) and deployed it on AWS.",
    cls: "text-body max-w-[70ch]",
  },
  {
    token: "text-small",
    sample: "Scramble Apps · Jun 2025 – Present",
    cls: "text-small text-muted",
  },
  {
    token: "text-label",
    sample: "01 / Experience",
    cls: "text-label font-mono uppercase text-muted",
  },
  { token: "text-metric", sample: "110/s", cls: "text-metric font-mono tabular-nums" },
];

const eases = ["ease-out-expo", "ease-out-quart", "ease-in-out-quart", "ease-in"];

const elevation = [
  ["shadow-card", "rounded-sm"],
  ["shadow-lift", "rounded-md"],
  ["shadow-glow", "rounded-lg"],
  ["shadow-glow-cyan", "rounded-xl"],
];

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-glass-border py-16">
      <h2 id={id} className="mb-8 font-mono text-label text-muted uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="relative isolate overflow-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-aurora"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-grid"
      />

      <header className="container-page flex items-center justify-between pt-8">
        <span className="font-display text-h4 font-bold">
          SG<span className="text-primary-text">.</span>
        </span>
        <ThemeToggle />
      </header>

      <main id="main" className="container-page pt-24 pb-32">
        <SectionHeading
          as="h1"
          index="00"
          eyebrow="Design system"
          title="Midnight Aurora"
          highlight="Aurora"
          intro="Living reference for the tokens in globals.css. Toggle the theme to check both modes. Everything here uses the real utilities, so if it looks right here it looks right on the site."
        />

        <Block id="colors" title="Color tokens">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {colors.map((c) => (
              <li key={c.name} className="overflow-hidden rounded-md shadow-none glass">
                <div className={`h-20 border-b border-glass-border ${c.cls}`} />
                <div className="p-3">
                  <p className="font-mono text-small font-medium">{c.name}</p>
                  <p className="font-mono text-[0.7rem] text-muted">
                    <span className="light:hidden">{c.dark}</span>
                    <span className="hidden light:inline">{c.light}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex h-24 items-end rounded-md bg-brand p-4">
              <span className="font-mono text-label font-semibold text-on-brand uppercase">
                gradient-brand · text on-brand
              </span>
            </div>
            <div className="flex h-24 items-center rounded-md p-4 shadow-none glass">
              <span className="text-gradient font-display text-h2">gradient-text</span>
            </div>
          </div>
        </Block>

        <Block id="type" title="Typography: Space Grotesk · DM Sans · JetBrains Mono">
          <ul className="flex flex-col gap-8">
            {typeScale.map((t) => (
              <li key={t.token} className="grid gap-2 md:grid-cols-[160px_1fr] md:items-baseline">
                <code className="font-mono text-small text-primary-text">{t.token}</code>
                <p className={t.cls}>{t.sample}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="buttons" title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button>
              View my work <ArrowUpRight aria-hidden />
            </Button>
            <Button variant="glass">
              <Download aria-hidden /> Download resume
            </Button>
            <Button variant="ghost">Ghost</Button>
            <ButtonLink href="#buttons" variant="link">
              Text link
            </ButtonLink>
            <Button size="md">Medium</Button>
            <Button variant="glass" size="icon" aria-label="Play demo">
              <Play aria-hidden />
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </Block>

        <Block id="badges" title="Badges & tech chips">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="live">Live</Badge>
            <Badge variant="shipped">Shipped</Badge>
            <Badge variant="in-progress">In progress</Badge>
            <Badge variant="store">On Play Store</Badge>
            <Badge>10K+ downloads</Badge>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["React Native", "Next.js", "Vue.js", "Node.js", "PostgreSQL", "Redis"].map((t) => (
              <TechChip key={t}>{t}</TechChip>
            ))}
            {["Erlang/OTP", "Kafka", "MongooseIM"].map((t) => (
              <TechChip key={t} active>
                {t}
              </TechChip>
            ))}
          </div>
        </Block>

        <Block id="surfaces" title="Surfaces: glass (primary) · neumorphism (controls only)">
          <div className="grid gap-6 md:grid-cols-3">
            <GlassCard interactive>
              <p className="font-mono text-label text-muted uppercase">glass + interactive</p>
              <h3 className="mt-3 text-h4">Fitizen</h3>
              <p className="mt-2 text-small text-muted">
                Fitness social app with real-time chat, deep links and reels.
              </p>
            </GlassCard>
            <GlassCard featured interactive>
              <p className="font-mono text-label text-muted uppercase">glass-gradient (featured)</p>
              <h3 className="mt-3 text-h4">Vela Meet</h3>
              <p className="mt-2 text-small text-muted">
                Video conferencing and scheduling, backend built from scratch.
              </p>
            </GlassCard>
            <div className="rounded-lg bg-elevated p-6 shadow-card">
              <p className="font-mono text-label text-muted uppercase">elevated (solid)</p>
              <pre className="mt-3 font-mono text-small text-accent">
                {"$ rebar3 cover\n> 84% coverage"}
                <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-caret bg-accent" />
              </pre>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <div className="grid size-24 place-items-center rounded-xl font-mono text-label text-muted uppercase neu">
              neu
            </div>
            <div className="grid size-24 place-items-center rounded-xl font-mono text-label text-muted uppercase neu-inset">
              inset
            </div>
            <ThemeToggle />
          </div>
        </Block>

        <Block id="controls" title="Neumorphic controls: lens toggle · filter chips">
          <SegmentedDemo />
        </Block>

        <Block id="elevation" title="Shadows & radius">
          <div className="flex flex-wrap gap-6">
            {elevation.map(([shadow, radius]) => (
              <div
                key={shadow}
                className={`grid size-32 place-items-center bg-surface p-3 text-center font-mono text-[0.7rem] text-muted ${shadow} ${radius}`}
              >
                {shadow}
                <br />
                {radius}
              </div>
            ))}
          </div>
        </Block>

        <Block id="motion" title="Motion easings (hover a row)">
          <ul className="flex flex-col gap-3">
            {eases.map((name) => (
              <li key={name} className="group rounded-full p-1.5 shadow-none glass">
                <div className="flex items-center gap-4">
                  <span
                    className={`size-8 shrink-0 rounded-full bg-brand transition-transform duration-700 group-hover:translate-x-[min(60vw,640px)] ${name}`}
                  />
                  <code className="font-mono text-small text-muted">{name}</code>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-small text-muted">
            Durations: 150 / 250 / 400 / 700 / 1200 ms. Reduced motion collapses these to instant.
          </p>
        </Block>
      </main>
    </div>
  );
}
