import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Pure-CSS phone frame (9:19.5): rounded bezel, dynamic island, side buttons and
 * a soft glass reflection. Children fill the screen.
 */
export function PhoneMockup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-[9/19.5] w-full", className)}>
      {/* side buttons */}
      <span
        aria-hidden
        className="absolute top-[18%] -left-[1.5%] h-[6%] w-[1.5%] rounded-l-sm bg-elevated"
      />
      <span
        aria-hidden
        className="absolute top-[27%] -left-[1.5%] h-[10%] w-[1.5%] rounded-l-sm bg-elevated"
      />
      <span
        aria-hidden
        className="absolute top-[24%] -right-[1.5%] h-[13%] w-[1.5%] rounded-r-sm bg-elevated"
      />

      <div className="absolute inset-0 rounded-phone border border-glass-border bg-[#0b0b12] p-[3.5%] shadow-lift">
        <div className="relative size-full overflow-hidden rounded-[calc(var(--radius-phone)*0.82)] bg-surface">
          {children}
          {/* dynamic island */}
          <span
            aria-hidden
            className="absolute top-[1.6%] left-1/2 z-20 h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-black"
          />
          {/* glass reflection */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 bg-linear-to-br from-white/10 via-transparent to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
