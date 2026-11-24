"use client";

import { useEffect, useId, useState, type ComponentProps } from "react";
import { ArrowLeft } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { profile } from "@/content/profile";
import { setLens, useLens } from "@/hooks/useLens";
import { cn } from "@/lib/cn";
import type { Lens } from "@/types/content";

const options = [
  { value: "product", label: profile.lens.product.label },
  { value: "systems", label: profile.lens.systems.label },
] as const satisfies readonly { value: Lens; label: string }[];

const HINT_KEY = "sg-lens-tried";
const hintText: Record<Lens, string> = {
  product: "Try Systems for my Erlang/OTP side",
  systems: "Try Product for the apps I've shipped",
};

/**
 * Neumorphic Product ⇄ Systems switch. Re-orders projects/skills and swaps hero copy.
 * `hint`: on a first visit, a short nudge fades in beside it until the lens is changed once.
 */
export function LensToggle({
  className,
  showCaption = true,
  hint = false,
  ...props
}: ComponentProps<"div"> & { showCaption?: boolean; hint?: boolean }) {
  const lens = useLens();
  const captionId = useId();
  const [initialLens] = useState(lens);
  const [hintReady, setHintReady] = useState(false);

  useEffect(() => {
    if (!hint) return;
    let tried = false;
    try {
      tried = Boolean(localStorage.getItem(HINT_KEY));
    } catch {}
    if (tried) return;
    const t = window.setTimeout(() => setHintReady(true), 2600);
    return () => window.clearTimeout(t);
  }, [hint]);

  function change(next: Lens) {
    setLens(next);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {}
    setHintReady(false);
  }

  // Hidden for good once the lens changes anywhere (this toggle, the Work one, ?lens=).
  const showHint = hint && hintReady && lens === initialLens;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)} {...props}>
      {showCaption && (
        <span id={captionId} className="font-mono text-label text-muted uppercase">
          View as
        </span>
      )}
      <SegmentedControl label="Portfolio lens" options={options} value={lens} onChange={change} />
      {hint && (
        <span
          aria-hidden={!showHint}
          // not via cn(): tailwind-merge would drop the custom text-small size
          className={`inline-flex items-center gap-1.5 text-small text-muted transition-opacity duration-500 ${
            showHint ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ArrowLeft aria-hidden className="size-3.5 motion-safe:animate-pulse" />
          {hintText[lens]}
        </span>
      )}
    </div>
  );
}
