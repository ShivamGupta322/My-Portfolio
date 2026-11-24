"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

type Line = { command: string; output: string };

/**
 * Terminal that types its commands out when `active` becomes true, showing each
 * output once its command finishes. Static (everything shown) under reduced
 * motion. Text is in the DOM from the start for screen readers.
 */
export function TerminalPanel({
  lines,
  active,
  title = "zsh",
  className,
}: {
  lines: readonly Line[];
  active: boolean;
  title?: string;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  // chars typed across all commands; Infinity = everything visible
  const [typed, setTyped] = useState(0);
  const total = lines.reduce((n, l) => n + l.command.length, 0);
  const shown = reducedMotion ? Infinity : typed;

  useEffect(() => {
    if (!active || reducedMotion) return;
    const id = window.setInterval(() => {
      setTyped((t) => {
        if (t >= total) {
          window.clearInterval(id);
          return t;
        }
        return t + 1;
      });
    }, 28);
    return () => window.clearInterval(id);
  }, [active, reducedMotion, total]);

  // Character offset at which each command starts typing.
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.command.length, 0));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-glass-border bg-[#0b0b12] font-mono text-[0.75rem] shadow-lift",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto text-[0.625rem] text-white/50">{title}</span>
      </div>
      <div className="space-y-2 p-4 leading-relaxed text-white/90">
        {lines.map((line, i) => {
          const visible = Math.max(0, Math.min(line.command.length, shown - starts[i]));
          const done = visible >= line.command.length;
          const typing = !done && visible > 0;
          return (
            <div key={i} className={cn(!done && visible === 0 && "invisible")}>
              <p>
                <span className="text-[#34d399]">$</span>{" "}
                <span aria-hidden>{line.command.slice(0, visible)}</span>
                <span className="sr-only">{line.command}</span>
                {typing && (
                  <span
                    aria-hidden
                    className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-caret bg-[#22d3ee]"
                  />
                )}
              </p>
              <p className={cn("text-[#22d3ee]", !done && "invisible")}>→ {line.output}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
