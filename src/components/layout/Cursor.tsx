"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";

const INTERACTIVE = 'a, button, [role="button"], [role="switch"], [role="radio"], [data-cursor]';

/**
 * Soft follower ring for mouse/trackpad users. The native cursor stays visible
 * (accessibility); the ring grows over interactive elements and shows a label
 * from `data-cursor="View"` / `"Drag"`. Disabled on touch and reduced motion.
 */
export function Cursor() {
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  if (!finePointer || reducedMotion) return null;
  return <CursorFollower />;
}

function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const show = (value: boolean) => {
      if (visibleRef.current === value) return;
      visibleRef.current = value;
      setVisible(value);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      show(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE);
      setHovering(Boolean(target));
      setLabel(target?.getAttribute("data-cursor") || null);
    };
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className={cn(
          "grid size-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border",
          "transition-[background-color,border-color] duration-200",
          label
            ? "border-transparent bg-primary-strong"
            : hovering
              ? "border-primary/70 bg-primary/10"
              : "border-fg/35",
        )}
        initial={false}
        animate={{ scale: label ? 1 : hovering ? 0.62 : 0.4, opacity: visible ? 1 : 0 }}
        transition={spring.snappy}
      >
        {label && (
          <span className="font-mono text-[0.625rem] font-semibold tracking-[0.16em] text-white uppercase">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
