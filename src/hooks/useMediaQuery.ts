"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query. Returns `serverValue` during SSR/hydration,
 * then the live value, with no hydration mismatch.
 */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** true when the user asked the OS for reduced motion. */
export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** true on mouse/trackpad devices (custom cursor, magnetic and tilt effects). */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

/** true at the `lg` breakpoint and up (pinned/scrubbed stages). */
export const useIsDesktop = () => useMediaQuery("(min-width: 64rem)");
