"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { duration, ease } from "@/lib/motion";

/** "~110/s" → { prefix: "~", value: 110, suffix: "/s" }. Non-numeric values don't animate. */
function parse(value: string) {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const number = Number(match[2].replace(/,/g, ""));
  const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
  return { prefix: match[1], number, suffix: match[3], decimals, grouped: match[2].includes(",") };
}

/**
 * Counts a stat up from 0 the first time it scrolls into view.
 * Server HTML contains the final value (SEO, no-JS); reduced motion shows it as-is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reducedMotion = usePrefersReducedMotion();
  const parsed = parse(value);

  // Before it's seen, park the number at 0 (DOM only: no re-render, no flash on screen).
  useEffect(() => {
    if (!parsed || reducedMotion || inView || !ref.current) return;
    ref.current.textContent = `${parsed.prefix}0${parsed.suffix}`;
    // Only on mount / reduced-motion change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  useEffect(() => {
    if (!parsed || reducedMotion || !inView || !ref.current) return;
    const el = ref.current;
    const format = (n: number) => {
      const fixed = n.toFixed(parsed.decimals);
      const body = parsed.grouped ? Number(fixed).toLocaleString("en-IN") : fixed;
      return `${parsed.prefix}${body}${parsed.suffix}`;
    };
    const controls = animate(0, parsed.number, {
      duration: duration.hero,
      ease: ease.outExpo,
      onUpdate: (n) => (el.textContent = format(n)),
      onComplete: () => (el.textContent = value),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
