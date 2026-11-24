"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts decorative, DOM-heavy children (device mockups, marquees) only when
 * their slot comes within `rootMargin` of the viewport. Keeps them out of the
 * server HTML and initial hydration: on the home page that's ~1,200 elements
 * of pure decoration. Never wrap real content (text, links, diagrams).
 * `fallback` should reserve the same space so nothing shifts when it mounts.
 */
export function LazyMount({
  children,
  fallback = null,
  rootMargin = "600px 0px",
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {shown ? children : fallback}
    </div>
  );
}
