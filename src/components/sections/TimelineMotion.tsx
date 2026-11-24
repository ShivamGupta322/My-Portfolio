"use client";

import { useRef, type ReactNode } from "react";
import { useLens } from "@/hooks/useLens";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Client-side motion for the server-rendered Experience timeline:
 *  · the gradient rail draws itself as you scroll (scrubbed scaleY) and a glowing
 *    head rides its tip
 *  · each role: node pops, card slides in from its side (desktop) or rises
 *    (mobile), date fades up, product chips stagger in
 *  · data-current-lens lets CSS highlight products that match the active lens
 * Under reduced motion everything renders static with the rail fully drawn.
 */
export function TimelineMotion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lens = useLens();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const track = root.querySelector<HTMLElement>("[data-tl-track]");
      const progress = root.querySelector("[data-tl-progress]");
      const head = root.querySelector("[data-tl-head]");
      const items = root.querySelectorAll<HTMLElement>("[data-tl-item]");

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const desktop = Boolean(ctx.conditions?.desktop);
          const railTrigger = { trigger: root, start: "top 65%", end: "bottom 65%", scrub: 0.6 };

          gsap.fromTo(
            progress,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", scrollTrigger: railTrigger },
          );
          gsap.fromTo(
            head,
            { y: 0 },
            {
              y: () => track?.offsetHeight ?? 0,
              ease: "none",
              scrollTrigger: { ...railTrigger, invalidateOnRefresh: true },
            },
          );

          items.forEach((item) => {
            const fromX = item.dataset.side === "left" ? -48 : 48;
            gsap
              .timeline({
                defaults: { ease: "expo.out" },
                scrollTrigger: { trigger: item, start: "top 80%", once: true },
              })
              .from(item.querySelector("[data-tl-node]"), {
                scale: 0,
                duration: 0.5,
                ease: "back.out(2)",
              })
              .from(
                item.querySelector("[data-tl-card]"),
                { opacity: 0, x: desktop ? fromX : 0, y: desktop ? 0 : 28, duration: 0.9 },
                "-=0.3",
              )
              .from(
                item.querySelector("[data-tl-date]"),
                { opacity: 0, y: 12, duration: 0.7 },
                "<0.1",
              )
              .from(
                item.querySelectorAll("[data-tl-product]"),
                { opacity: 0, y: 14, duration: 0.6, stagger: 0.07 },
                "-=0.5",
              );
          });
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-current-lens={lens} className={className}>
      {children}
    </div>
  );
}
