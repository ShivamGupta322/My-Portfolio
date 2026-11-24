import { cn } from "@/lib/cn";

/** Renders a simple-icons path (24×24 viewBox) in currentColor. */
export function BrandIcon({
  path,
  title,
  className,
}: {
  path: string;
  title?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn("size-4 shrink-0 fill-current", className)}
    >
      <path d={path} />
    </svg>
  );
}
