"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";

const INTERACTIVE =
  'a, button, summary, label[for], [role="button"], [role="switch"], [role="radio"], [role="tab"], [data-cursor]';
const TEXT_FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, [contenteditable="true"]';

type Mode = "default" | "hover" | "label" | "text" | "hidden";

/**
 * Branded custom cursor for mouse/trackpad users. It replaces the native cursor
 * (html.custom-cursor → `cursor: none`) with:
 *  · a brand-gradient dot that tracks the pointer 1:1 (precision)
 *  · a ring that trails on a spring and reacts to what's underneath:
 *      default → thin ring · interactive → grows with a cyan glow (reads on violet buttons), dot hides
 *      data-cursor="View" → filled pill with label · text fields → native I-beam
 *      data-cursor="hide" → hidden · press → ring squeezes
 * Touch devices and prefers-reduced-motion keep the native cursor.
 */
export function Cursor() {
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  if (!finePointer || reducedMotion) return null;
  return <CustomCursor />;
}

function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });

  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("custom-cursor");

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
      const el = e.target as Element | null;
      if (!el?.closest) return;
      if (el.closest(TEXT_FIELD)) {
        setMode("text");
        return;
      }
      const target = el.closest(INTERACTIVE);
      const value = target?.getAttribute("data-cursor");
      if (value === "hide") setMode("hidden");
      else if (value) {
        setMode("label");
        setLabel(value);
      } else setMode(target ? "hover" : "default");
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [x, y]);

  const hidden = !visible || mode === "text" || mode === "hidden";
  const ringScale = { default: 0.45, hover: 0.72, label: 1, text: 0.3, hidden: 0.3 }[mode];
  const showDot = mode === "default";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50">
      {/* Ring: trails on a spring */}
      <motion.div className="absolute top-0 left-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className={cn(
            "grid size-[88px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border",
            "transition-[background-color,border-color,box-shadow] duration-200",
            mode === "label" && "border-transparent bg-primary-strong shadow-glow",
            mode === "hover" && "border-accent bg-accent/10 shadow-glow-cyan",
            mode !== "label" && mode !== "hover" && "border-fg/40",
          )}
          initial={false}
          animate={{ scale: ringScale * (pressed ? 0.82 : 1), opacity: hidden ? 0 : 1 }}
          transition={spring.snappy}
        >
          {mode === "label" && label && (
            <span className="font-mono text-[0.625rem] font-semibold tracking-[0.16em] text-white uppercase">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Dot: tracks the pointer exactly */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <motion.div
          className="size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-glow-cyan"
          initial={false}
          animate={{
            scale: showDot && !hidden ? (pressed ? 1.6 : 1) : 0,
            opacity: showDot && !hidden ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </div>
  );
}
