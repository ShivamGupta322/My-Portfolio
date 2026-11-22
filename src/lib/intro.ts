/**
 * Coordinates the hero intro with the first-visit preloader.
 *
 * The head script adds `html.intro-pending` (unless reduced motion), which hides
 * `[data-intro]` elements before first paint so the hero never flashes and then
 * re-animates. The hero calls `onIntroReady` and removes the class when its
 * timeline starts. A 4 s safety timeout in the head script reveals content if
 * JavaScript fails.
 */
export const INTRO_READY_EVENT = "intro:ready";

export function introIsReady() {
  return document.documentElement.hasAttribute("data-preloaded");
}

/** Runs `cb` once the preloader has finished (immediately on repeat visits). */
export function onIntroReady(cb: () => void): () => void {
  if (introIsReady()) {
    const raf = requestAnimationFrame(cb);
    return () => cancelAnimationFrame(raf);
  }
  const handler = () => cb();
  window.addEventListener(INTRO_READY_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_READY_EVENT, handler);
}

export function clearIntroPending() {
  document.documentElement.classList.remove("intro-pending");
}
