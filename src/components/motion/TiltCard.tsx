"use client";

import { useRef, type ComponentProps, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * Glass card that tilts up to `max` degrees toward the pointer, with a soft glare
 * that follows it. Transform-only (no layout shift); flat on touch/reduced motion.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  ...props
}: Omit<ComponentProps<typeof motion.div>, "style" | "children"> & {
  children?: ReactNode;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Call both hooks unconditionally (no short-circuit: hook order must stay stable).
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reducedMotion;
  const springCfg = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useMotionValue(0), springCfg);
  const rotateY = useSpring(useMotionValue(0), springCfg);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(useMotionValue(0), { stiffness: 200, damping: 30 });
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, color-mix(in srgb, var(--c-fg) 10%, transparent), transparent 60%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * 2 * max);
    rotateX.set(-(py - 0.5) * 2 * max);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(1);
  }
  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={enabled ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {children}
      {enabled && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glare, opacity: glareOpacity }}
        />
      )}
    </motion.div>
  );
}
