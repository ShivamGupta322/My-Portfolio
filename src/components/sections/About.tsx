"use client";

import { useEffect, useRef } from "react";
import { GraduationCap, MapPin, Sparkles } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { StatArt } from "@/components/motion/StatArt";
import { TiltCard } from "@/components/motion/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechChip } from "@/components/ui/TechChip";
import { education } from "@/content/achievements";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { useLens } from "@/hooks/useLens";
import { cn } from "@/lib/cn";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const now = experience[0];
const nowRole = now.roles[0];
const [startYear, startMonth] = nowRole.period.start.split("-").map(Number);
const since = `${MONTHS[startMonth - 1]} ${startYear}`;

const tile = "glass h-full rounded-lg p-6 shadow-none md:p-7";

/**
 * About: bento grid (docs/MOTION_AND_SHOWCASE.md §5.2)
 *  · summary paragraph lights up word by word on scroll
 *  · four lens-specific stats count up when they enter the viewport
 *  · education, location (live IST clock) and current focus tiles
 * Tiles tilt toward the pointer with a glare (desktop only).
 */
export function About({ index }: { index: string }) {
  const lens = useLens();
  const copy = profile.lens[lens];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-clip border-t border-glass-border section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[520px] rounded-full bg-primary/15 blur-[120px]"
      />
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="about-title"
            index={index}
            eyebrow="About"
            title="I build the app and the backend it talks to"
            highlight="backend"
          />
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* Summary */}
          <div className="md:col-span-2 lg:row-span-2">
            <TiltCard
              max={3}
              className={cn(tile, "glass-gradient flex flex-col justify-between gap-10")}
            >
              <div>
                <p className="flex items-center gap-2 font-mono text-label text-muted uppercase">
                  <Sparkles aria-hidden className="size-3.5 text-primary-text" /> In short
                </p>
                <ScrubWords
                  key={lens}
                  text={copy.summary}
                  className="mt-5 font-display text-[clamp(1.25rem,1.1vw+0.9rem,1.6rem)] leading-snug font-medium"
                />
              </div>
              <p className="flex flex-wrap items-center gap-2 text-small text-muted">
                <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-success" />
                <span>
                  Now: <span className="text-fg">{nowRole.title}</span> at{" "}
                  <span className="text-fg">{now.name}</span> · since {since}
                </span>
              </p>
            </TiltCard>
          </div>

          {/* Stats */}
          {copy.stats.map((stat, i) => (
            <div key={`${lens}-${i}`}>
              <TiltCard
                className={cn(
                  tile,
                  "relative flex min-h-40 flex-col justify-between gap-6 overflow-hidden",
                )}
              >
                {stat.art && <StatArt kind={stat.art} />}
                <CountUp
                  value={stat.value}
                  className="relative font-mono text-[clamp(2.25rem,2.6vw+0.75rem,3.25rem)] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap text-gradient tabular-nums"
                />
                <p className="relative text-small text-muted">{stat.label}</p>
              </TiltCard>
            </div>
          ))}

          {/* Education */}
          <div className="md:col-span-2">
            <TiltCard
              max={3}
              className={cn(tile, "flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6")}
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-md text-primary-text neu">
                <GraduationCap aria-hidden className="size-6" />
              </span>
              <div>
                <p className="font-mono text-label text-muted uppercase">
                  Education · {education.period.start}–{education.period.end}
                </p>
                <p className="mt-2 font-display text-h4">{education.degree}</p>
                <p className="mt-1 text-small text-muted">
                  {education.institution} · {education.university}
                </p>
                <p className="mt-2 font-mono text-small text-accent">{education.grade}</p>
              </div>
            </TiltCard>
          </div>

          {/* Location */}
          <div>
            <TiltCard className={cn(tile, "relative flex flex-col justify-between gap-6 overflow-hidden")}>
              <LocationPing />
              <p className="flex items-center gap-2 font-mono text-label text-muted uppercase">
                <MapPin aria-hidden className="size-3.5 text-primary-text" /> Based in
              </p>
              <div>
                <p className="font-display text-h4">Bareilly, India</p>
                <p className="mt-1 text-small text-muted">
                  <LocalTime /> IST · UTC+5:30
                </p>
                <p className="mt-1 font-mono text-[0.6875rem] text-muted">28.37° N · 79.43° E</p>
              </div>
            </TiltCard>
          </div>

          {/* Focus */}
          <div>
            <TiltCard className={cn(tile, "flex flex-col justify-between gap-6")}>
              <p className="font-mono text-label text-muted uppercase">Current focus</p>
              <ul className="flex flex-wrap gap-2">
                {copy.roles.map((role) => (
                  <li key={`${lens}-${role}`}>
                    <TechChip active>{role}</TechChip>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Decorative map ping in the corner of the location tile (static under reduced motion). */
function LocationPing() {
  return (
    <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 size-36">
      <div className="absolute inset-0 rounded-full border border-accent/15" />
      <div className="absolute inset-[18%] rounded-full border border-accent/20" />
      <div className="absolute inset-[36%] rounded-full border border-accent/30 motion-safe:animate-ping" />
      <div className="absolute top-1/2 left-1/2 size-2.5 -translate-1/2 rounded-full bg-accent shadow-[0_0_14px_var(--c-accent)]" />
    </div>
  );
}

/** Live clock in Asia/Kolkata. Server renders a placeholder; the client fills it in (no hydration mismatch). */
function LocalTime() {
  const ref = useRef<HTMLTimeElement>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
    const tick = () => {
      if (ref.current) ref.current.textContent = fmt.format(new Date());
    };
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time ref={ref} className="font-mono text-fg tabular-nums" suppressHydrationWarning>
      --:--
    </time>
  );
}
