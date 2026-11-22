"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the middle band of the viewport,
 * or null above the first section (hero). Drives the nav's active pill.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    const els = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // Last section in document order that is inside the band wins.
        const current = els.filter((el) => visible.get(el.id)).at(-1);
        setActive(current ? current.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
