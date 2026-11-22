import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-label uppercase",
  {
    variants: {
      variant: {
        live: "bg-success/15 text-success ring-1 ring-success/30",
        shipped: "bg-success text-on-badge",
        "in-progress": "bg-warning/15 text-warning ring-1 ring-warning/30",
        store: "text-fg shadow-none glass",
        neutral: "bg-glass text-muted ring-1 ring-glass-border",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({
  className,
  variant,
  children,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "live" && (
        <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-success" />
      )}
      {children}
    </span>
  );
}
