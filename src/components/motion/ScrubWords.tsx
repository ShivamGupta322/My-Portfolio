"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Paragraph whose words light up (opacity 0.15 → 1) as it scrolls through the
 * viewport: scrubbed on desktop, a simple fade-in on smaller screens, static
 * under reduced motion. Words are real text nodes, so screen readers and
 * copy/paste see a normal paragraph.
 */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll("[data-word]");
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          targets,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
          },
        );
      });
      mm.add("(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 16,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      ScrollTrigger.refresh();
    },
    { scope: ref, dependencies: [text], revertOnUpdate: true },
  );

  return (
    <p ref={ref} className={cn(className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} data-word>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
