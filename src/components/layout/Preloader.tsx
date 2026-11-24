"use client";

import { useEffect } from "react";
import { site } from "@/content/site";
import { PRELOADER_SESSION_KEY } from "@/lib/initScript";

/**
 * First-visit intro (~1.6 s), driven entirely by CSS (see "Preloader" in
 * globals.css): the name rises by character while a counter runs 0 → 100 %,
 * then the curtain lifts at 1.0 s, exactly when the hero intro starts.
 *
 * Being CSS-only, it plays on time even before JavaScript hydrates, so slow
 * devices never get stuck behind it (this used to gate LCP on JS). JS only
 * records the visit so repeat visits skip it (html[data-preloaded], set
 * pre-paint by the head script). Hidden under reduced motion and without JS.
 */
export function Preloader() {
  useEffect(() => {
    try {
      sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    } catch {
      /* storage unavailable: the preloader shows again next visit */
    }
  }, []);

  return (
    <div
      aria-hidden
      className="preloader pointer-events-none fixed inset-0 z-40 flex flex-col justify-between bg-bg p-6 md:p-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-aurora" />
      <p className="relative font-mono text-label text-muted uppercase">
        Portfolio · {site.copyrightYear}
      </p>
      <p className="relative self-center overflow-hidden pb-[0.08em] font-display text-[clamp(2.5rem,9vw,8rem)] leading-none font-bold tracking-tight">
        {[...site.name].map((ch, i) => (
          <span key={i} className="preloader-char" style={{ "--i": i } as React.CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </p>
      <span className="preloader-count relative self-end font-mono text-metric text-primary-text tabular-nums" />
    </div>
  );
}
