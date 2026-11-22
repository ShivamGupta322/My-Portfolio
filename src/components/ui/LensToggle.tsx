"use client";

import type { ComponentProps } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { profile } from "@/content/profile";
import { setLens, useLens } from "@/hooks/useLens";
import { cn } from "@/lib/cn";
import type { Lens } from "@/types/content";

const options = [
  { value: "product", label: profile.lens.product.label },
  { value: "systems", label: profile.lens.systems.label },
] as const satisfies readonly { value: Lens; label: string }[];

/** Neumorphic Product ⇄ Systems switch. Re-orders projects/skills and swaps hero copy. */
export function LensToggle({
  className,
  showCaption = true,
  ...props
}: ComponentProps<"div"> & { showCaption?: boolean }) {
  const lens = useLens();
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)} {...props}>
      {showCaption && (
        <span id="lens-caption" className="font-mono text-label text-muted uppercase">
          View as
        </span>
      )}
      <SegmentedControl label="Portfolio lens" options={options} value={lens} onChange={setLens} />
    </div>
  );
}
