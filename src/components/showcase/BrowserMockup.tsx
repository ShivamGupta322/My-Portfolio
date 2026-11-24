import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

/** Desktop browser chrome (traffic lights + URL pill) around a 2:1 viewport (fits real desktop screenshots). */
export function BrowserMockup({
  url,
  children,
  className,
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-glass-border bg-elevated shadow-lift",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-glass-border px-3.5 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex max-w-[60%] min-w-0 items-center gap-1.5 rounded-full bg-glass px-3 py-1 font-mono text-[0.6875rem] text-muted">
          <Lock aria-hidden className="size-3 shrink-0" />
          <span className="truncate">{url}</span>
        </span>
        <span aria-hidden className="w-[42px]" />
      </div>
      <div className="relative aspect-[2/1] overflow-hidden bg-surface">{children}</div>
    </div>
  );
}
