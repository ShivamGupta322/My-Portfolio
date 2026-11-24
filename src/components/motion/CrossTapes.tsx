"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";

const TAPES = [
  {
    words: ["Shipped to Play Store", "App Store", "The web", "AWS", "10K+ downloads"],
    tilt: "-rotate-[4deg]",
    tone: "bg-accent text-[#06141a]",
    drift: -1,
  },
  {
    words: ["Fault-tolerant", "Real-time", "Let it crash", "Erlang/OTP", "Always on"],
    tilt: "rotate-[3deg]",
    tone: "bg-primary text-white",
    drift: 1,
  },
] as const;

/**
 * Two "caution tape" bands that cross between sections and slide in opposite
 * directions as you scroll past (scrubbed to scroll, so they move only when
 * the page does). Decorative (aria-hidden); static under reduced motion.
 */
export function CrossTapes({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        root.current?.querySelectorAll<HTMLElement>("[data-tape-track]").forEach((track) => {
          const dir = Number(track.dataset.drift);
          gsap.fromTo(
            track,
            { xPercent: dir < 0 ? 0 : -25 },
            {
              xPercent: dir < 0 ? -25 : 0,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.4,
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className={cn("relative h-[clamp(9rem,16vw,13rem)] overflow-x-clip select-none", className)}
    >
      {TAPES.map((tape, t) => (
        <div
          key={t}
          className={cn(
            "absolute inset-x-[-5%] top-1/2 -translate-y-1/2 py-3 shadow-[0_10px_40px_rgb(0_0_0/0.45)] md:py-4",
            tape.tilt,
            tape.tone,
          )}
        >
          <div data-tape-track data-drift={tape.drift} className="flex w-max">
            {/* the phrase list repeated so the band never runs out while it slides */}
            {Array.from({ length: 4 }, (_, r) => (
              <span key={r} className="flex shrink-0 items-center">
                {tape.words.map((w) => (
                  <span
                    key={`${r}-${w}`}
                    className="flex items-center font-display text-[clamp(1.25rem,2.6vw,2.5rem)] leading-none font-bold tracking-[-0.01em] whitespace-nowrap uppercase"
                  >
                    <span className="px-5 md:px-7">{w}</span>
                    <span className="size-2 rounded-full bg-current opacity-70 md:size-2.5" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
