/**
 * Motion tokens shared by GSAP and Motion (motion/react).
 * Mirrors the CSS variables in globals.css. See docs/MOTION_AND_SHOWCASE.md §3.
 */
export const duration = {
  instant: 0.15,
  fast: 0.25,
  base: 0.4,
  slow: 0.7,
  hero: 1.2,
} as const;

/** Cubic-bezier tuples for Motion; GSAP names for gsap.to({ ease }). */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  in: [0.5, 0, 0.75, 0],
} as const;

export const gsapEase = {
  outExpo: "expo.out",
  outQuart: "power4.out",
  inOutQuart: "power4.inOut",
  in: "power3.in",
} as const;

export const spring = {
  snappy: { type: "spring", stiffness: 260, damping: 24 },
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 0.8 },
} as const;

export const stagger = { chars: 0.03, words: 0.05, items: 0.08 } as const;

export const scroll = {
  scrub: 0.8,
  revealStart: "top 85%",
  revealOffsetY: 24,
} as const;
