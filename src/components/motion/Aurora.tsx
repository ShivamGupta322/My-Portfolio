"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

const AuroraCanvas = dynamic(() => import("./AuroraCanvas"), { ssr: false });

/** WebGL only when the device can afford it (docs/ARCHITECTURE.md §5). */
function canUseWebGL() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // Phones and tablets get the CSS aurora: saves battery and main-thread time.
  if (!window.matchMedia("(pointer: fine) and (min-width: 64rem)").matches) return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl");
  } catch {
    return false;
  }
}

let capability: boolean | null = null;
const noopSubscribe = () => () => {};

/**
 * Hero background: the static CSS aurora always renders (instant paint, and
 * the fallback), and the OGL shader fades in on top once its first frame is
 * drawn. The canvas chunk is loaded lazily, after hydration.
 */
export function Aurora({ className }: { className?: string }) {
  const webgl = useSyncExternalStore(
    noopSubscribe,
    () => (capability ??= canUseWebGL()),
    () => false,
  );
  const canvasLayer = useRef<HTMLDivElement>(null);
  const cssLayer = useRef<HTMLDivElement>(null);
  const reveal = useCallback(() => {
    canvasLayer.current?.classList.add("opacity-100");
    cssLayer.current?.classList.add("opacity-40");
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        ref={cssLayer}
        className="absolute inset-0 animate-aurora-drift transition-opacity duration-[1200ms] bg-aurora"
      />
      {webgl && (
        <div
          ref={canvasLayer}
          className="absolute inset-0 opacity-0 transition-opacity duration-[1200ms] ease-out"
        >
          <AuroraCanvas onReady={reveal} />
        </div>
      )}
    </div>
  );
}
