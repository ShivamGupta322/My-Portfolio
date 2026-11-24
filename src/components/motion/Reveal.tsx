"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, gsapEase, scroll, stagger as staggerTokens } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Fade-and-rise when scrolled into view (once). With `stagger`, animates direct
 * children one after another. No-op under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = scroll.revealOffsetY,
  stagger = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(stagger ? el.children : el, {
          opacity: 0,
          y,
          duration: duration.slow,
          ease: gsapEase.outExpo,
          delay,
          stagger: stagger ? staggerTokens.items : 0,
          scrollTrigger: { trigger: el, start: scroll.revealStart, once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
