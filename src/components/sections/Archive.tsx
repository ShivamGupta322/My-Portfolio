"use client";

import Image from "next/image";
import { useState, type PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import type { ArchiveProject } from "@/types/content";

/**
 * College-era projects as a compact list. On desktop a screenshot follows the
 * cursor while you hover a row (tilting with pointer velocity); on touch or
 * reduced motion the list stands alone and each row links to its repo.
 */
export function Archive({ items }: { items: readonly ArchiveProject[] }) {
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const preview = finePointer && !reducedMotion;
  const [hovered, setHovered] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1500, 0, 1500], [-8, 0, 8], { clamp: true });

  function onMove(e: PointerEvent<HTMLUListElement>) {
    x.set(e.clientX);
    y.set(e.clientY);
  }

  const current = items.find((i) => i.slug === hovered);

  return (
    <div className="mt-24">
      <h3 className="text-h3">Archive</h3>
      <p className="mt-2 text-muted">College projects, kept for the record.</p>

      <ul
        onPointerMove={preview ? onMove : undefined}
        onPointerLeave={() => setHovered(null)}
        className="mt-8 divide-y divide-glass-border border-y border-glass-border"
      >
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setHovered(item.slug)}
              data-cursor={preview ? "hide" : undefined}
              className="group grid grid-cols-[1fr_auto] items-center gap-4 py-5 transition-colors md:grid-cols-[1.1fr_1.8fr_1fr_auto]"
            >
              <span className="font-display text-h4 transition-colors group-hover:text-primary-text">
                {item.title}
              </span>
              <span className="hidden text-small text-muted md:block">{item.description}</span>
              <span className="hidden font-mono text-[0.75rem] text-muted md:block">
                {item.stack.join(" · ")}
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-5 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
              />
              <span className="sr-only">(opens repository in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>

      {preview && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-40"
          style={{ x: sx, y: sy, rotate }}
        >
          <AnimatePresence>
            {current && (
              <motion.div
                key={current.slug}
                className="relative -mt-24 -ml-36 aspect-[16/10] w-72 overflow-hidden rounded-md border border-glass-border shadow-lift"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
              >
                <Image
                  src={current.image}
                  alt=""
                  fill
                  sizes="288px"
                  className="object-cover object-top"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
