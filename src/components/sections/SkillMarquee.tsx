"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { LazyMount } from "@/components/motion/LazyMount";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export interface MarqueeSkill {
  name: string;
  iconPath: string | null;
}

/** Keep v within [min, max) by wrapping around. */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * Infinite skill rows whose speed and direction react to scroll velocity
 * (docs/MOTION_AND_SHOWCASE.md §5.6): scroll down and rows race in their own
 * direction, scroll up and they reverse, then settle back to a slow drift.
 * Hover pauses a row. Decorative (aria-hidden): the grouped list below carries
 * the same information. Hidden under reduced motion.
 */
export function SkillMarquee({ rows }: { rows: MarqueeSkill[][] }) {
  return (
    <LazyMount className="min-h-[144px] motion-reduce:hidden">
      <div aria-hidden className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <MarqueeRow key={i} items={row} direction={i % 2 === 0 ? -1 : 1} speed={28 + i * 6} />
        ))}
      </div>
    </LazyMount>
  );
}

function MarqueeRow({
  items,
  direction,
  speed,
}: {
  items: MarqueeSkill[];
  direction: 1 | -1;
  speed: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const widthRef = useRef(0);
  const dirRef = useRef<number>(direction);

  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2500, 0, 2500], [-5, 0, 5], { clamp: false });

  // Width of one copy of the items (the track holds two, so wrapping is seamless).
  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => (widthRef.current = el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const w = widthRef.current;
    if (!inView || paused || reducedMotion || !w) return;
    const b = boost.get();
    if (b < 0) dirRef.current = -direction;
    else if (b > 0) dirRef.current = direction;
    const move = dirRef.current * speed * (delta / 1000) * (1 + Math.abs(b));
    x.set(wrap(-w, 0, x.get() + move));
  });

  const copy = (
    <div ref={copyRef} className="flex shrink-0 gap-3 pr-3">
      {items.map((s) => (
        <span
          key={s.name}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 text-small whitespace-nowrap text-fg/85"
        >
          {s.iconPath && <BrandIcon path={s.iconPath} className="size-4 text-muted" />}
          {s.name}
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <motion.div className="flex w-max" style={{ x }}>
        {copy}
        <div className="flex shrink-0 gap-3 pr-3">
          {items.map((s) => (
            <span
              key={s.name}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 text-small whitespace-nowrap text-fg/85"
            >
              {s.iconPath && <BrandIcon path={s.iconPath} className="size-4 text-muted" />}
              {s.name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
