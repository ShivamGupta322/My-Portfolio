"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { preload } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown, Cpu, MousePointerClick, Smartphone } from "lucide-react";
import { LazyMount } from "@/components/motion/LazyMount";
import { TechChip } from "@/components/ui/TechChip";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import {
  hostOf,
  KIND_LABEL,
  projectAnchorId,
  screenFor,
  type DiagramView,
  type ProjectView,
} from "@/lib/projectView";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { BrowserMockup } from "./BrowserMockup";
import { PhoneMockup } from "./PhoneMockup";
import { ProjectLinks } from "./ProjectLinks";
import { DesktopPagesPlaceholder, PhoneScreenPlaceholder, PreviewTag } from "./ScreenPlaceholder";
import { SystemDiagram } from "./SystemDiagram";
import { TerminalPanel } from "./TerminalPanel";

/**
 * Featured project "stage" (docs/MOTION_AND_SHOWCASE.md §6).
 *
 * Desktop + motion: a tall section (N × 75svh + 100svh) with a sticky frame;
 * scroll progress selects the active highlight and drives the visual:
 *   mobile → phone swaps screens · web → browser moves to that page ·
 *   hybrid → browser + phone in parallax (with an "Under the hood" diagram) ·
 *   backend → edges draw into the architecture diagram, packets flow, and on
 *   the last step the supervised worker crashes and restarts and the terminal types.
 * Only `pinned` stages (the first few) get the tall scroll-driven layout; the
 * rest, and every stage on mobile / reduced motion, are normal sections where
 * tapping a highlight selects it. On mobile the visual sits between the title
 * and the highlights so a tap visibly changes it.
 * The tall/sticky layout is pure CSS (motion-safe:lg:), so SSR is already correct.
 */
export function ProjectStage({
  project,
  index,
  diagram,
  defaultUnderHood = false,
  pinned = true,
  skipTo,
}: {
  project: ProjectView;
  index: number;
  diagram?: DiagramView;
  defaultUnderHood?: boolean;
  /** Tall scroll-driven stage on desktop; false = compact section, tap to switch steps. */
  pinned?: boolean;
  /** Element id the "skip" link jumps to (next project or the grid). */
  skipTo?: { id: string; label: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const steps = Math.max(1, project.highlights.length);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const [active, setActive] = useState(false);
  const progress = useMotionValue(0);
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();
  const scrollDriven = isDesktop && !reducedMotion && pinned;
  const { scrollTo } = useSmoothScroll();
  const [underHood, setUnderHood] = useState(defaultUnderHood && Boolean(diagram));

  const anchor = projectAnchorId(project.slug);
  const visualFirst = index % 2 === 1;
  const isBackend = project.kind === "backend";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const desktopMotion = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";
      if (pinned) mm.add(desktopMotion, () => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            progress.set(self.progress);
            const s = Math.min(steps - 1, Math.floor(self.progress * steps));
            if (s !== stepRef.current) {
              stepRef.current = s;
              setStep(s);
            }
          },
          onToggle: (self) => setActive(self.isActive),
        });
        const visual = el.querySelector("[data-stage-visual]");
        gsap.fromTo(
          visual,
          { rotateX: 12, scale: 0.9, y: 70, transformPerspective: 1400 },
          {
            rotateX: 0,
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 0.6 },
          },
        );
        // Hand-off: the copy rises in as the stage arrives and the whole frame
        // recedes as it leaves, so one project flows into the next.
        gsap.fromTo(
          el.querySelector("[data-stage-copy]"),
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 15%", scrub: 0.6 },
          },
        );
        gsap.to(el.querySelector("[data-stage-frame]"), {
          opacity: 0,
          scale: 0.96,
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: el, start: "bottom 95%", end: "bottom 35%", scrub: 0.6 },
        });
      });
      // Compact stages simply rise into view on desktop.
      if (!pinned)
        mm.add(desktopMotion, () => {
          gsap.fromTo(
            [el.querySelector("[data-stage-copy]"), el.querySelector("[data-stage-visual]")],
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.12,
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            },
          );
        });
      mm.add(
        pinned ? "(max-width: 63.99rem), (prefers-reduced-motion: reduce)" : "all",
        () => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            end: "bottom 15%",
            onToggle: (self) => setActive(self.isActive),
          });
        },
      );
    },
    { scope: ref, dependencies: [steps, pinned] },
  );

  function selectStep(i: number) {
    const el = ref.current;
    if (scrollDriven && el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = el.offsetHeight - window.innerHeight;
      scrollTo(top + ((i + 0.5) / steps) * scrollable, { offset: 0 });
    } else {
      setAutoplay(false); // the visitor took over
      stepRef.current = i;
      setStep(i);
    }
  }

  const showDiagram = isBackend || (underHood && diagram);

  /* Stages that don't follow the scroll play their steps on their own while in
     view (paused on hover, stopped for good once a step is picked), and say how
     to switch steps by hand. */
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const playing =
    !scrollDriven && autoplay && active && !hovered && !reducedMotion && !showDiagram && steps > 1;
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      const next = (stepRef.current + 1) % steps;
      stepRef.current = next;
      setStep(next);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, step, steps]);

  return (
    <section
      ref={ref}
      id={anchor}
      aria-labelledby={`${anchor}-title`}
      style={{ "--steps": steps, "--autoplay-ms": `${AUTOPLAY_MS}ms` } as CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      className={cn(
        "relative",
        pinned && "motion-safe:lg:h-[calc(var(--steps)*45svh+100svh)]",
        // stacked on mobile, consecutive projects get a divider
        index > 0 && "max-lg:border-t max-lg:border-glass-border",
      )}
    >
      <div
        data-stage-frame
        className={cn(
          "flex items-center py-14",
          pinned
            ? "motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:h-svh motion-safe:lg:py-0"
            : "lg:py-24",
        )}
      >
        <div className="container-page grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ---------- Copy + steps (`contents` on mobile so the visual can sit mid-way) ---------- */}
          <div
            data-stage-copy
            className={cn(
              "contents lg:block",
              isBackend ? "lg:col-span-4" : "lg:col-span-5",
              visualFirst && "lg:order-2",
            )}
          >
            <div className="order-1">
            <p className="font-mono text-label text-muted uppercase">
              <span className="text-primary-text">{String(index + 1).padStart(2, "0")}</span> ·{" "}
              {KIND_LABEL[project.kind]}
              {project.companyName && <> · {project.companyName}</>}
            </p>
            <h3
              id={`${anchor}-title`}
              className="mt-3 font-display text-[clamp(1.875rem,1.4vw+1.25rem,2.75rem)] leading-[1.05] font-bold tracking-[-0.02em]"
            >
              {project.title}
            </h3>
            <p className="mt-3 text-lead text-muted">{project.tagline}</p>
            </div>

            <div className="order-3">
            {!scrollDriven && steps > 1 && (
              <p className="mb-3 flex items-center gap-2 font-mono text-label text-muted uppercase lg:mt-6">
                <MousePointerClick aria-hidden className="size-3.5 text-primary-text" />
                <span>
                  <span className="lg:hidden">Tap</span>
                  <span className="max-lg:hidden">Click</span> a step to see it
                </span>
                {playing && <span className="text-fg/60">· auto-playing</span>}
              </p>
            )}
            <ol
              className={cn("space-y-0.5", scrollDriven && "lg:mt-6")}
              aria-label={`${project.title} highlights`}
            >
              {project.highlights.map((h, i) => {
                const on = i === step;
                return (
                  <li key={h.title}>
                    <button
                      type="button"
                      onClick={() => selectStep(i)}
                      aria-current={on ? "step" : undefined}
                      className="relative w-full rounded-md py-2 pr-2 pl-5 text-left"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute top-2.5 bottom-2.5 left-0 w-0.5 overflow-hidden rounded-full transition-colors duration-300",
                          on && !playing ? "bg-brand" : "bg-glass-border",
                        )}
                      >
                        {/* while auto-playing, the active bar fills up until the next step */}
                        {on && playing && (
                          <span key={step} className="absolute inset-0 origin-top bg-brand stage-progress" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "block font-display text-[1.0625rem] font-semibold transition-colors duration-300",
                          on ? "text-fg" : "text-muted hover:text-fg",
                        )}
                      >
                        {h.title}
                      </span>
                      <span
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo",
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-1.5 text-small text-muted">{h.body}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {project.metrics.length > 0 && (
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="sr-only">{m.label}</dt>
                    <dd className="font-mono text-h3 tabular-nums">{m.value}</dd>
                    <dd className="text-[0.75rem] text-muted">{m.label}</dd>
                  </div>
                ))}
              </dl>
            )}

            <ProjectLinks
              project={project}
              caseStudyHref={`/projects/${project.slug}`}
              className="mt-6"
            />
            <ul
              className={cn("mt-5 flex flex-wrap gap-1.5", isBackend && "lg:hidden")}
              aria-label="Tech stack"
            >
              {project.stack.slice(0, 6).map((t) => (
                <li key={t}>
                  <TechChip>{t}</TechChip>
                </li>
              ))}
            </ul>

            {scrollDriven && (
              <div className="mt-6 flex items-center gap-4 font-mono text-label text-muted">
                <span aria-hidden className="tabular-nums">
                  <span className="text-fg">{String(step + 1).padStart(2, "0")}</span> /{" "}
                  {String(steps).padStart(2, "0")}
                </span>
                {skipTo && (
                  <button
                    type="button"
                    onClick={() =>
                      scrollTo(`#${skipTo.id}`, skipTo.id.startsWith("project-") ? { offset: 0 } : undefined)
                    }
                    className="inline-flex items-center gap-1.5 uppercase transition-colors hover:text-fg"
                  >
                    Skip to {skipTo.label} <ArrowDown aria-hidden className="size-3.5" />
                  </button>
                )}
              </div>
            )}
            </div>
          </div>

          {/* ---------- Visual ---------- */}
          <div
            data-stage-visual
            className={cn(
              "relative order-2",
              isBackend ? "lg:col-span-8" : "lg:col-span-7",
              visualFirst ? "lg:order-1" : "lg:order-none",
            )}
          >
            {project.kind === "hybrid" && diagram && (
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  role="switch"
                  aria-checked={underHood}
                  onClick={() => setUnderHood((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-small font-medium shadow-none glass transition-colors hover:bg-glass-strong"
                >
                  {underHood ? (
                    <Smartphone aria-hidden className="size-4" />
                  ) : (
                    <Cpu aria-hidden className="size-4" />
                  )}
                  {underHood ? "Show the product" : "Under the hood"}
                </button>
              </div>
            )}

            <AnimatePresence mode="wait" initial={false}>
              {showDiagram && diagram ? (
                <motion.div
                  key="system"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: duration.base, ease: ease.outExpo }}
                >
                  <SystemVisual
                    diagram={diagram}
                    step={step}
                    steps={steps}
                    active={active}
                    scrollDriven={scrollDriven}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="product"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: duration.base, ease: ease.outExpo }}
                >
                  <LazyMount
                    rootMargin="1400px 0px"
                    fallback={
                      <VisualPlaceholder
                        kind={project.kind}
                        phoneOnMobile={
                          project.kind === "hybrid" && Boolean(project.media.phoneScreens?.length)
                        }
                      />
                    }
                  >
                    {project.kind === "mobile" && <PhoneVisual project={project} step={step} />}
                    {project.kind === "web" && (
                      <BrowserVisual project={project} step={step} progress={progress} />
                    )}
                    {project.kind === "hybrid" && (
                      <DuoVisual
                        project={project}
                        step={step}
                        progress={progress}
                        parallax={scrollDriven}
                        compact={!isDesktop}
                      />
                    )}
                  </LazyMount>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const AUTOPLAY_MS = 4000;

/* ============================== Visuals ============================== */

/** Optimized URL for a local image used as a CSS background. */
function optimizedSrc(src: string, width: number) {
  return getImageProps({ src, alt: "", width, height: width }).props.src;
}

/** Reserves the device's footprint until the (decorative) mockup mounts. */
function VisualPlaceholder({
  kind,
  phoneOnMobile = false,
}: {
  kind: ProjectView["kind"];
  /** A hybrid that shows only its phone below lg (see DuoVisual `compact`). */
  phoneOnMobile?: boolean;
}) {
  const phone = <div aria-hidden className="mx-auto aspect-[9/19.5] w-[min(290px,60vw)]" />;
  if (kind === "mobile") return phone;
  const browser = (
    <div aria-hidden className={kind === "hybrid" ? "pr-[9%] pb-[12%]" : undefined}>
      <div className="aspect-[2/1] rounded-md border border-glass-border bg-elevated/40" />
    </div>
  );
  if (!phoneOnMobile) return browser;
  return (
    <>
      <div className="lg:hidden">{phone}</div>
      <div className="max-lg:hidden">{browser}</div>
    </>
  );
}

/** Warm the cache for every screen of a stage once it mounts, so step changes never flash empty. */
function usePreloadScreens(screens: readonly string[] | undefined, sizes: string) {
  for (const src of screens ?? []) {
    const { props } = getImageProps({ src, alt: "", fill: true, sizes });
    preload(props.src, {
      as: "image",
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
      fetchPriority: "low",
    });
  }
}

/** Shimmer shown behind a screenshot until it paints over it. */
function ScreenSkeleton() {
  return <div aria-hidden className="absolute inset-0 skeleton" />;
}

const PHONE_SIZES = "320px";
const BROWSER_SIZES = "(min-width: 64rem) 760px, 100vw";

function PhoneScreen({ project, step }: { project: ProjectView; step: number }) {
  usePreloadScreens(project.media.phoneScreens, PHONE_SIZES);
  // One screenshot per highlight (its `screen`, else the step); with fewer
  // screenshots than highlights, cycle the real ones rather than mixing in placeholders.
  const shot = screenFor(project.media.phoneScreens, project.highlights, step);
  const h = project.highlights[step] ?? project.highlights[0];
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={shot ?? step}
        className="absolute inset-0"
        initial={{ opacity: 0, y: "5%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "-5%" }}
        transition={{ duration: 0.5, ease: ease.outExpo }}
      >
        {shot ? (
          <>
            <ScreenSkeleton />
            <Image
              src={shot}
              alt={`${project.title}: ${h.title}`}
              fill
              sizes={PHONE_SIZES}
              className="object-cover"
            />
          </>
        ) : (
          <PhoneScreenPlaceholder
            title={project.title}
            heading={h.title}
            body={h.body}
            step={step}
            accent={project.accent}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function StepDots({ steps, step, className }: { steps: number; step: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex gap-1.5", className)}>
      {Array.from({ length: steps }, (_, i) => (
        <span
          key={i}
          className={cn(
            "rounded-full transition-all duration-300",
            i === step ? "h-6 w-1.5 bg-brand" : "size-1.5 bg-fg/20",
          )}
        />
      ))}
    </div>
  );
}

function PhoneVisual({ project, step }: { project: ProjectView; step: number }) {
  return (
    <div className="relative mx-auto flex w-fit items-center gap-6">
      <div
        aria-hidden
        className="absolute inset-[-15%] -z-10 rounded-full opacity-35 blur-3xl"
        style={{ background: `radial-gradient(circle, ${project.accent}, transparent 65%)` }}
      />
      <div className="w-[min(290px,60vw)]">
        <PhoneMockup>
          <PhoneScreen project={project} step={step} />
        </PhoneMockup>
      </div>
      <StepDots steps={project.highlights.length} step={step} className="flex-col items-center" />
    </div>
  );
}

function BrowserScreen({
  project,
  step,
  progress,
  tag = true,
}: {
  project: ProjectView;
  step: number;
  progress: MotionValue<number>;
  tag?: boolean;
}) {
  const n = Math.max(1, project.highlights.length);
  const full = project.media.desktopFull;
  const shot = screenFor(project.media.desktopScreens, project.highlights, step);
  const bgY = useTransform(progress, [0, 1], ["0%", "100%"]);
  usePreloadScreens(project.media.desktopScreens, BROWSER_SIZES);

  if (shot) {
    // One real screen per highlight, cross-faded as the steps change.
    const h = project.highlights[step] ?? project.highlights[0];
    return (
      <AnimatePresence initial={false}>
        <motion.div
          key={shot}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: ease.outExpo }}
        >
          <ScreenSkeleton />
          <Image
            src={shot}
            alt={`${project.title}: ${h.title}`}
            fill
            sizes={BROWSER_SIZES}
            className="object-cover object-top"
          />
        </motion.div>
      </AnimatePresence>
    );
  }
  if (full) {
    // Long full-page capture scrolled with the stage.
    return (
      <motion.div
        role="img"
        aria-label={`${project.title} full page`}
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          // Route through Next's image optimizer (WebP/AVIF, resized to 1600px wide).
          backgroundImage: `url(${optimizedSrc(full, 1600)})`,
          backgroundSize: "100% auto",
          backgroundPositionY: bgY,
        }}
      />
    );
  }
  return (
    <>
      <motion.div
        className="absolute inset-x-0 top-0 flex flex-col"
        style={{ height: `${n * 100}%` }}
        animate={{ y: `-${(step / n) * 100}%` }}
        transition={{ duration: 0.7, ease: ease.outExpo }}
      >
        <DesktopPagesPlaceholder
          title={project.title}
          sections={project.highlights}
          accent={project.accent}
        />
      </motion.div>
      {tag && <PreviewTag />}
    </>
  );
}

function BrowserVisual({
  project,
  step,
  progress,
}: {
  project: ProjectView;
  step: number;
  progress: MotionValue<number>;
}) {
  const url = project.links.live ? hostOf(project.links.live) : `${project.slug}.app`;
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-[-8%] -z-10 opacity-30 blur-3xl"
        style={{ background: `radial-gradient(ellipse, ${project.accent}, transparent 65%)` }}
      />
      <BrowserMockup url={url}>
        <BrowserScreen project={project} step={step} progress={progress} />
      </BrowserMockup>
    </div>
  );
}

function DuoVisual({
  project,
  step,
  progress,
  parallax,
  compact = false,
}: {
  project: ProjectView;
  step: number;
  progress: MotionValue<number>;
  parallax: boolean;
  /** Small screens: one device, big enough to read (the phone when it has real screens). */
  compact?: boolean;
}) {
  const phoneY = useTransform(progress, [0, 1], [50, -50]);
  if (compact && project.media.phoneScreens?.length)
    return <PhoneVisual project={project} step={step} />;
  const url = project.links.live ? hostOf(project.links.live) : `${project.slug}.app`;
  // Real desktop screens but no phone ones: show the browser alone rather than
  // pairing a real page with a placeholder phone.
  const showPhone = Boolean(project.media.phoneScreens?.length) || !hasDesktopImage(project);
  if (!showPhone) return <BrowserVisual project={project} step={step} progress={progress} />;
  return (
    <div className="relative pr-[9%] pb-[12%]">
      <div
        aria-hidden
        className="absolute inset-[-6%] -z-10 opacity-30 blur-3xl"
        style={{ background: `radial-gradient(ellipse, ${project.accent}, transparent 65%)` }}
      />
      <BrowserMockup url={url}>
        {/* a placeholder phone carries the "UI preview" tag for both devices */}
        <BrowserScreen
          project={project}
          step={step}
          progress={progress}
          tag={Boolean(project.media.phoneScreens?.length)}
        />
      </BrowserMockup>
      <motion.div
        className="absolute right-0 bottom-0 w-[27%] min-w-[110px]"
        style={parallax ? { y: phoneY } : undefined}
      >
        <PhoneMockup>
          <PhoneScreen project={project} step={step} />
        </PhoneMockup>
      </motion.div>
    </div>
  );
}

function hasDesktopImage(project: ProjectView) {
  return Boolean(project.media.desktopScreens?.length || project.media.desktopFull);
}

function SystemVisual({
  diagram,
  step,
  steps,
  active,
  scrollDriven,
}: {
  diagram: DiagramView;
  step: number;
  steps: number;
  active: boolean;
  scrollDriven: boolean;
}) {
  const total = diagram.edges.length;
  // Desktop scroll reveals edges step by step; elsewhere show the whole system.
  const revealed = scrollDriven ? Math.ceil(((step + 1) / steps) * total) : total;
  const lastStep = !scrollDriven || step === steps - 1;
  const terminal = diagram.terminal;

  return (
    <div className="relative">
      <SystemDiagram
        diagram={diagram}
        revealed={revealed}
        playing={active}
        crash={active && lastStep}
      />
      {terminal && terminal.length > 0 && (
        // Space is always reserved (no layout jump in the sticky frame); it wakes
        // up and types on the last step.
        <div
          className={cn(
            "mt-4 transition-opacity duration-500",
            lastStep ? "opacity-100" : "opacity-30",
          )}
        >
          <TerminalPanel lines={terminal} active={active && lastStep} />
        </div>
      )}
    </div>
  );
}
