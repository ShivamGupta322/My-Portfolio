"use client";

import Image, { getImageProps } from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Cpu, Smartphone } from "lucide-react";
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
 * Mobile / reduced motion: a normal section; tapping a highlight selects it.
 * The tall/sticky layout is pure CSS (motion-safe:lg:), so SSR is already correct.
 */
export function ProjectStage({
  project,
  index,
  diagram,
  defaultUnderHood = false,
}: {
  project: ProjectView;
  index: number;
  diagram?: DiagramView;
  defaultUnderHood?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const steps = Math.max(1, project.highlights.length);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const [active, setActive] = useState(false);
  const progress = useMotionValue(0);
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();
  const scrollDriven = isDesktop && !reducedMotion;
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
      mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
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
      });
      mm.add("(max-width: 63.99rem), (prefers-reduced-motion: reduce)", () => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 15%",
          onToggle: (self) => setActive(self.isActive),
        });
      });
    },
    { scope: ref, dependencies: [steps] },
  );

  function selectStep(i: number) {
    const el = ref.current;
    if (scrollDriven && el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = el.offsetHeight - window.innerHeight;
      scrollTo(top + ((i + 0.5) / steps) * scrollable, { offset: 0 });
    } else {
      stepRef.current = i;
      setStep(i);
    }
  }

  const showDiagram = isBackend || (underHood && diagram);

  return (
    <section
      ref={ref}
      id={anchor}
      aria-labelledby={`${anchor}-title`}
      style={{ "--steps": steps } as CSSProperties}
      className="relative motion-safe:lg:h-[calc(var(--steps)*75svh+100svh)]"
    >
      <div className="flex items-center py-14 motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:h-svh motion-safe:lg:py-0">
        <div className="container-page grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ---------- Copy + steps ---------- */}
          <div
            className={cn(
              isBackend ? "lg:col-span-4" : "lg:col-span-5",
              visualFirst && "lg:order-2",
            )}
          >
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

            <ol className="mt-6 space-y-0.5" aria-label={`${project.title} highlights`}>
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
                          "absolute top-2.5 bottom-2.5 left-0 w-0.5 rounded-full transition-colors duration-300",
                          on ? "bg-brand" : "bg-glass-border",
                        )}
                      />
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
          </div>

          {/* ---------- Visual ---------- */}
          <div
            data-stage-visual
            className={cn(
              "relative",
              isBackend ? "lg:col-span-8" : "lg:col-span-7",
              visualFirst && "lg:order-1",
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
                  <LazyMount fallback={<VisualPlaceholder kind={project.kind} />}>
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

/* ============================== Visuals ============================== */

/** Optimized URL for a local image used as a CSS background. */
function optimizedSrc(src: string, width: number) {
  return getImageProps({ src, alt: "", width, height: width }).props.src;
}

/** Reserves the device's footprint until the (decorative) mockup mounts. */
function VisualPlaceholder({ kind }: { kind: ProjectView["kind"] }) {
  if (kind === "mobile") {
    return <div aria-hidden className="mx-auto aspect-[9/19.5] w-[min(290px,68vw)]" />;
  }
  return (
    <div aria-hidden className={kind === "hybrid" ? "pr-[14%] pb-[16%]" : undefined}>
      <div className="aspect-[2/1] rounded-md border border-glass-border bg-elevated/40" />
    </div>
  );
}

function PhoneScreen({ project, step }: { project: ProjectView; step: number }) {
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
          <Image
            src={shot}
            alt={`${project.title}: ${h.title}`}
            fill
            sizes="320px"
            className="object-cover"
          />
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
      <div className="w-[min(290px,68vw)]">
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
          <Image
            src={shot}
            alt={`${project.title}: ${h.title}`}
            fill
            sizes="(min-width: 64rem) 720px, 100vw"
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
}: {
  project: ProjectView;
  step: number;
  progress: MotionValue<number>;
  parallax: boolean;
}) {
  const phoneY = useTransform(progress, [0, 1], [50, -50]);
  const url = project.links.live ? hostOf(project.links.live) : `${project.slug}.app`;
  // Real desktop screens but no phone ones: show the browser alone rather than
  // pairing a real page with a placeholder phone.
  const showPhone = Boolean(project.media.phoneScreens?.length) || !hasDesktopImage(project);
  if (!showPhone) return <BrowserVisual project={project} step={step} progress={progress} />;
  return (
    <div className="relative pr-[14%] pb-[16%]">
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
        className="absolute right-0 bottom-0 w-[30%] min-w-[110px]"
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
