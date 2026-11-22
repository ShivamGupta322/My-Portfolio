import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function GlassCard({
  className,
  featured,
  interactive,
  ...props
}: ComponentProps<"div"> & { featured?: boolean; interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg p-6 glass",
        featured && "glass-gradient",
        interactive &&
          "cursor-pointer transition-[box-shadow,border-color] duration-[250ms] hover:border-fg/15 hover:shadow-lift",
        className,
      )}
      {...props}
    />
  );
}
