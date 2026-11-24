"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, Download } from "lucide-react";
import { SectionLink } from "@/components/layout/SectionLink";
import { Aurora } from "@/components/motion/Aurora";
import { Magnetic } from "@/components/motion/Magnetic";
import { buttonVariants } from "@/components/ui/Button";
import { LensToggle } from "@/components/ui/LensToggle";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { useLens } from "@/hooks/useLens";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { duration, ease } from "@/lib/motion";

const currentRole = experience[0].roles[0];
const currentCompany = experience[0].name.replace(/ Pvt\. Ltd\.$/, "");

/**
 * Hero (docs/MOTION_AND_SHOWCASE.md §5.1)
 *  · intro (CSS): name lines rise from masks, then copy + CTAs, while the portrait
 *    settles; starts as the preloader curtain lifts, needs no JavaScript
 *  · 3-plane parallax: aurora 0.2× · blobs 0.5× · portrait 0.8×, plus pointer drift
 *  · scroll-out: content scales to 0.92 and fades as the hero leaves
 *  · lens toggle swaps tagline, rotating roles, floating stats and resume link
 */
export function Hero() {
  const lens = useLens();
  const copy = profile.lens[lens];
  const resume = profile.resume[lens];

  const root = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const motionOn = !reducedMotion;

  /* ---- scroll parallax ---- */
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const auroraY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const blobsY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* ---- pointer parallax ---- */
  const px = useSpring(useMotionValue(0), { stiffness: 80, damping: 20, mass: 0.6 });
  const py = useSpring(useMotionValue(0), { stiffness: 80, damping: 20, mass: 0.6 });
  const blobsX = useTransform(px, (v) => v * 14);
  const blobsYMouse = useTransform(py, (v) => v * 10);
  const portraitX = useTransform(px, (v) => v * -8);
  const chipsX = useTransform(px, (v) => v * 16);
  const chipsY = useTransform(py, (v) => v * 12);

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (!finePointer || reducedMotion) return;
    px.set((e.clientX / window.innerWidth - 0.5) * 2);
    py.set((e.clientY / window.innerHeight - 0.5) * 2);
  }

  /* Intro (name lines, copy, portrait) is pure CSS: .hero-line / .hero-fade /
     .hero-portrait in globals.css, so it plays on time before JS hydrates. */
  const fade = (i: number) => ({ "--i": i }) as CSSProperties;

  return (
    <section
      ref={root}
      aria-label="Introduction"
      onPointerMove={onPointerMove}
      className="relative isolate flex min-h-svh flex-col overflow-clip"
    >
      {/* Plane 1: aurora */}
      <motion.div className="absolute inset-0 -z-30" style={motionOn ? { y: auroraY } : undefined}>
        <Aurora />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-grid" />

      {/* Plane 2: blurred blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={motionOn ? { y: blobsY } : undefined}
      >
        <motion.div
          className="absolute inset-0"
          style={motionOn ? { x: blobsX, y: blobsYMouse } : undefined}
        >
          <div className="absolute top-[18%] left-[8%] size-72 rounded-full bg-primary/25 blur-[90px]" />
          <div className="absolute right-[6%] bottom-[14%] size-80 rounded-full bg-accent/15 blur-[100px]" />
        </motion.div>
      </motion.div>

      <motion.div
        className="container-page grid flex-1 items-center gap-12 pt-32 pb-28 lg:grid-cols-[1.2fr_1fr] lg:gap-8 lg:pt-28"
        style={motionOn ? { scale: contentScale, opacity: contentOpacity } : undefined}
      >
        {/* ---- Copy ---- */}
        <div className="relative">
          <p
            style={fade(0)}
            className="hero-fade inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-label text-muted uppercase shadow-none glass"
          >
            <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-success" />
            {currentRole.title}
            {/* company drops on small phones so the badge stays on one line */}
            <span className="hidden sm:inline"> · {currentCompany}</span>
          </p>

          <h1 className="mt-7 text-display">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-line block" style={fade(0)}>
                Shivam
              </span>
            </span>
            <span className="-mt-[0.08em] block overflow-hidden pb-[0.1em]">
              <span className="hero-line block text-gradient" style={fade(1)}>
                Gupta
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-6 text-h4 font-medium" style={fade(1)}>
            <span className="text-muted">Building with </span>
            <span className="sr-only">{copy.roles.join(", ")}</span>
            <RoleRotator key={lens} roles={copy.roles} />
          </p>

          <div className="hero-fade mt-4 grid max-w-[56ch]" style={fade(2)}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={lens}
                className="col-start-1 row-start-1 text-lead text-muted"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: duration.fast, ease: ease.outQuart }}
              >
                {copy.tagline}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="hero-fade mt-9 flex flex-wrap items-center gap-4" style={fade(3)}>
            <Magnetic>
              <SectionLink id="work" className={buttonVariants({ size: "lg" })}>
                View my work <ArrowDown aria-hidden />
              </SectionLink>
            </Magnetic>
            <Magnetic>
              <a
                href={resume.href}
                className={buttonVariants({ variant: "glass", size: "lg" })}
              >
                <Download aria-hidden /> Resume · {resume.label}
              </a>
            </Magnetic>
          </div>

          <LensToggle hint className="hero-fade mt-8" style={fade(4)} />
        </div>

        {/* ---- Portrait (plane 3) ---- */}
        <motion.div
          className="relative mx-auto w-full max-w-[min(440px,80vw)] lg:mr-0"
          style={motionOn ? { y: portraitY, x: portraitX } : undefined}
        >
          {/* Not opacity-gated: the portrait is the LCP element on desktop, so it must
              paint immediately; the intro only settles it from a small offset. */}
          <div className="hero-portrait relative aspect-square">
            {/* glass disc + aurora rim */}
            <div className="absolute inset-0">
              <div className="glass-gradient size-full rounded-full shadow-glow glass">
                <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(139_92_246/0.45),transparent_60%),radial-gradient(circle_at_75%_80%,rgb(34_211_238/0.35),transparent_55%)]" />
              </div>
            </div>
            {/* head breaks out of the circle; shoulders are clipped to it */}
            <div className="absolute inset-x-0 -top-[14%] bottom-0 overflow-hidden rounded-b-full">
              <Image
                src="/images/shivam-portrait.png"
                alt="Shivam Gupta, arms crossed, smiling slightly"
                fill
                priority
                sizes="(min-width: 1024px) 440px, 80vw"
                className="object-contain object-bottom"
              />
            </div>

            {/* floating stat chips */}
            <motion.div
              className="absolute top-[18%] -left-4 sm:-left-10"
              style={motionOn ? { x: chipsX, y: chipsY } : undefined}
            >
              <FloatingStat key={`${lens}-a`} value={copy.chips[0].value} label={copy.chips[0].label} />
            </motion.div>
            <motion.div
              className="absolute -right-2 bottom-[12%] sm:-right-6"
              style={motionOn ? { x: chipsX, y: chipsY } : undefined}
            >
              <FloatingStat
                key={`${lens}-b`}
                value={copy.chips[1].value}
                label={copy.chips[1].label}
                delay
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <ScrollCue />
    </section>
  );
}

/** Cycles through the lens's roles, rising one line at a time. Static under reduced motion. */
function RoleRotator({ roles }: { roles: readonly string[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2200);
    return () => window.clearInterval(id);
  }, [reducedMotion, roles.length]);

  if (reducedMotion) {
    return <span className="text-gradient">{roles.join(" · ")}</span>;
  }

  return (
    <span aria-hidden className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[index]}
          className="col-start-1 row-start-1 text-gradient"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: ease.outExpo }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FloatingStat({ value, label, delay }: { value: string; label: string; delay?: boolean }) {
  // Outer div floats (CSS keyframes); inner motion div owns the entrance transform.
  return (
    <div className={delay ? "animate-float-delayed" : "animate-float"}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: ease.outExpo }}
        className="max-w-44 rounded-md px-4 py-3 shadow-card glass-strong"
      >
        <p className="font-mono text-h4 font-semibold tabular-nums">{value}</p>
        <p className="mt-0.5 text-[0.75rem] leading-snug text-muted">{label}</p>
      </motion.div>
    </div>
  );
}

function ScrollCue() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-6 hidden flex-col items-center gap-3 md:flex"
    >
      <span className="font-mono text-label text-muted uppercase">Scroll</span>
      <span className="relative h-10 w-px overflow-hidden bg-glass-border">
        <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-linear-to-b from-transparent to-accent" />
      </span>
    </div>
  );
}
