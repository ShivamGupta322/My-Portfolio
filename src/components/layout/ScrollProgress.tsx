"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** 2px brand-gradient bar pinned to the top edge, scaled by page progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-brand"
      style={{ scaleX: reducedMotion ? scrollYProgress : smooth }}
    />
  );
}
