"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Extra offset for programmatic scrolls. The floating-nav clearance comes from
 * `scroll-padding-top: var(--nav-offset)` on <html>, which Lenis honours (and
 * native hash navigation uses too), so no extra offset is needed by default.
 */
export const SCROLL_OFFSET = 0;

type ScrollTarget = number | string | HTMLElement;

interface SmoothScrollApi {
  /** Smoothly scroll to a selector, element or Y position (instant under reduced motion). */
  scrollTo: (target: ScrollTarget, opts?: { offset?: number; immediate?: boolean }) => void;
  /** Pause / resume scrolling (menus, preloader). Safe to call before Lenis mounts. */
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

/**
 * Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync
 * (docs/ARCHITECTURE.md §6). Lenis honours prefers-reduced-motion by default
 * (`respectReducedMotion`), and touch devices keep native scrolling (`syncTouch: false`).
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  // Children's effects run before ours, so remember stop() calls made before Lenis exists.
  const stoppedRef = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      stopInertiaOnNavigate: true,
    });
    lenisRef.current = lenis;
    if (stoppedRef.current) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts change layout height: refresh trigger positions once they are ready.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback<SmoothScrollApi["scrollTo"]>((target, opts) => {
    const lenis = lenisRef.current;
    const offset = opts?.offset ?? SCROLL_OFFSET;
    if (lenis) {
      lenis.scrollTo(target, { offset, immediate: opts?.immediate, force: true });
      return;
    }
    // Fallback before Lenis mounts.
    const el = typeof target === "string" ? document.querySelector(target) : target;
    const top =
      typeof el === "number"
        ? el
        : el instanceof HTMLElement
          ? el.getBoundingClientRect().top + window.scrollY + offset - navClearance()
          : 0;
    window.scrollTo({ top, behavior: opts?.immediate ? "auto" : "smooth" });
  }, []);

  const api = useMemo<SmoothScrollApi>(
    () => ({
      scrollTo,
      stop: () => {
        stoppedRef.current = true;
        lenisRef.current?.stop();
      },
      start: () => {
        stoppedRef.current = false;
        lenisRef.current?.start();
      },
    }),
    [scrollTo],
  );

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>;
}

function navClearance() {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScrollProvider>");
  return ctx;
}
