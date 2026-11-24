"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { ScrollTrigger } from "@/lib/gsap";

export interface GlobeTech {
  name: string;
  path: string;
  /** Brand color, already checked for contrast on the dark theme (else null → text color). Light theme uses the text color. */
  color: string | null;
}

/**
 * Tech logos on a slowly turning sphere that bursts open into a labelled grid
 * as you scroll through it (docs/MOTION_AND_SHOWCASE.md, Skills).
 *  · sphere: Fibonacci points, rotated in JS each frame, depth → scale/opacity
 *  · burst: ScrollTrigger progress (scrubbed) blends each chip from its sphere
 *    position to its grid cell, turning it front-on and fading its name in
 *  · the loop only runs while the globe is on screen
 * Reduced motion: the burst layout, static. Decorative copy of the skill list
 * below (aria-hidden); the real list is the skill cards.
 */
export function TechGlobe({ techs, className }: { techs: GlobeTech[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const n = techs.length;

    // Sphere points (unit sphere).
    const golden = Math.PI * (3 - Math.sqrt(5));
    const sphere = techs.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
    });
    // Burst layout: a centred grid (fractions of the half-width), fewer columns when narrow.
    function gridSlots(cols: number) {
      const rows = Math.ceil(n / cols);
      return techs.map((_, i) => {
        const row = Math.floor(i / cols);
        const inRow = row === rows - 1 ? n - row * cols : cols;
        const col = (i % cols) + (cols - inRow) / 2;
        return {
          x: (col - (cols - 1) / 2) * (2 / cols),
          y: (row - (rows - 1) / 2) * (2 / rows) * 0.92,
        };
      });
    }
    const wideSlots = gridSlots(6);
    const narrowSlots = gridSlots(5);

    let progress = reducedMotion ? 1 : 0;
    let angle = 0;
    let raf = 0;
    let visible = false;
    let last = performance.now();

    function draw() {
      const box = el!.clientWidth / 2;
      const radius = box * 0.62;
      const slots = box < 200 ? narrowSlots : wideSlots;
      const p = progress;
      const ease = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const tilt = 0.32;
      for (let i = 0; i < n; i++) {
        const node = chips.current[i];
        if (!node) continue;
        const s = sphere[i];
        // rotate around Y, then tilt around X
        const x1 = s.x * cos + s.z * sin;
        const z1 = -s.x * sin + s.z * cos;
        const y1 = s.y * Math.cos(tilt) - z1 * Math.sin(tilt);
        const z2 = s.y * Math.sin(tilt) + z1 * Math.cos(tilt);
        const depth = (z2 + 1) / 2; // 0 back … 1 front
        const sx = x1 * radius;
        const sy = y1 * radius;
        const bx = slots[i].x * box * 0.94;
        const by = slots[i].y * box * 0.94;
        const x = sx + (bx - sx) * ease;
        const y = sy + (by - sy) * ease;
        const scale = (0.55 + depth * 0.55) * (1 - ease) + ease;
        const opacity = (0.25 + depth * 0.75) * (1 - ease) + ease;
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        node.style.opacity = opacity.toFixed(3);
        node.style.zIndex = String(Math.round(ease > 0.5 ? 50 : depth * 100));
        node.style.setProperty("--label", String(Math.max(0, ease * 1.4 - 0.4)));
      }
    }

    function tick(now: number) {
      const dt = Math.min(64, now - last);
      last = now;
      // spins while gathered, settles as it bursts
      angle += dt * 0.00032 * (1 - progress);
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    }

    draw();
    if (reducedMotion) return;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);

    const st = ScrollTrigger.create({
      trigger: el,
      // fully burst by the time the globe's centre reaches mid-screen (all of it in view)
      start: "top 85%",
      end: "center 55%",
      scrub: true,
      onUpdate: (self) => {
        progress = self.progress;
        if (!visible) draw();
      },
    });

    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      st.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [techs, reducedMotion]);

  return (
    <div
      ref={root}
      aria-hidden
      className={cn("relative aspect-square w-full select-none", className)}
    >
      {/* soft core glow + orbit rings */}
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.28),transparent_68%)] blur-2xl" />
      <div className="absolute inset-[19%] rounded-full border border-glass-border" />
      <div className="absolute inset-[7%] rounded-full border border-dashed border-glass-border/60" />

      <div className="absolute top-1/2 left-1/2">
        {techs.map((t, i) => (
          <div
            key={t.name}
            ref={(node) => {
              chips.current[i] = node;
            }}
            className="absolute top-0 left-0 flex flex-col items-center gap-1.5 will-change-transform"
            style={{ "--label": 0 } as CSSProperties}
          >
            <span className="grid size-11 place-items-center rounded-xl border border-glass-border bg-elevated/85 shadow-card backdrop-blur-sm md:size-12">
              <svg
                viewBox="0 0 24 24"
                className="size-5 fill-fg md:size-6 dark:fill-(--brand)"
                style={{ "--brand": t.color ?? "var(--c-fg)" } as CSSProperties}
              >
                <path d={t.path} />
              </svg>
            </span>
            <span className="font-mono text-[0.6875rem] whitespace-nowrap text-muted opacity-[var(--label)] max-md:hidden">
              {t.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
