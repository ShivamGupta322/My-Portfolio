import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function TechChip({
  className,
  active,
  ...props
}: ComponentProps<"span"> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[0.75rem] leading-none",
        "transition-colors duration-200",
        active
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-glass-border bg-glass text-muted hover:text-fg",
        className,
      )}
      {...props}
    />
  );
}
