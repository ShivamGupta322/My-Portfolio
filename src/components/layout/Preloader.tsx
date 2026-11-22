"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { PRELOADER_SESSION_KEY } from "@/lib/initScript";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

/**
 * First-visit intro (under 1.6s): the name rises by character while a mono counter
 * runs 000 → 100, then a curtain wipes up into the page.
 * Server-rendered so it covers the first paint; CSS hides it before paint on
 * repeat visits (html[data-preloaded]), under reduced motion, and without JS.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const [done, setDone] = useState(false);
  const { stop, start, scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const el = root.current;
      if (!el || getComputedStyle(el).display === "none") return;

      const hash = window.location.hash;
      stop();

      const split = SplitText.create(nameRef.current, { type: "chars", mask: "chars" });
      const count = { value: 0 };

      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => {
            try {
              sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
            } catch {
              /* storage unavailable: preloader shows again next visit */
            }
            document.documentElement.setAttribute("data-preloaded", "");
            start();
            if (hash) scrollTo(hash, { immediate: true });
            setDone(true);
          },
        })
        .from(split.chars, { yPercent: 110, duration: 0.8, stagger: 0.03 }, 0)
        .to(
          count,
          {
            value: 100,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(Math.round(count.value)).padStart(3, "0");
              }
            },
          },
          0,
        )
        .to(el, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "+=0.1");

      return () => split.revert();
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="preloader fixed inset-0 z-40 flex flex-col justify-between bg-bg p-6 md:p-10"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70 bg-aurora" />
      <p className="relative font-mono text-label text-muted uppercase">
        Portfolio · {site.copyrightYear}
      </p>
      <p
        ref={nameRef}
        className="relative self-center font-display text-[clamp(2.5rem,9vw,8rem)] leading-none font-bold tracking-tight"
      >
        {site.name}
      </p>
      <span
        ref={counterRef}
        className="relative self-end font-mono text-metric text-primary-text tabular-nums"
      >
        000
      </span>
    </div>
  );
}
