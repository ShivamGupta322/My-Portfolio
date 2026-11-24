import type { CSSProperties, ReactNode } from "react";
import type { StatArt as StatArtKind } from "@/types/content";

/**
 * Small looping illustrations behind the About tiles, one per kind of stat.
 * Pure CSS/SVG, decorative (aria-hidden), and still under reduced motion.
 * They sit at the right edge of the tile, behind the text.
 */
export function StatArt({ kind }: { kind: StatArtKind }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-4 size-24 -translate-y-1/2 text-accent opacity-50 md:size-28"
    >
      {ART[kind]}
    </div>
  );
}

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

const ART: Record<StatArtKind, ReactNode> = {
  /* a clock face whose hand sweeps round */
  time: (
    <svg viewBox="0 0 100 100" className="size-full">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="50"
          y1="14"
          x2="50"
          y2={i % 3 === 0 ? "21" : "18"}
          stroke="currentColor"
          strokeOpacity="0.5"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <g className="origin-center motion-safe:animate-[spin_10s_linear_infinite]">
        <line x1="50" y1="50" x2="50" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="origin-center motion-safe:animate-[spin_60s_linear_infinite]">
        <line x1="50" y1="50" x2="68" y2="50" stroke="var(--c-primary)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  ),

  /* a bar chart that keeps climbing, with a download arrow */
  downloads: (
    <div className="flex size-full items-end gap-1.5 pb-2">
      {[35, 50, 42, 64, 58, 80, 100].map((h, i) => (
        <span
          key={i}
          className="flex-1 origin-bottom rounded-t-sm bg-linear-to-t from-primary/50 to-accent motion-safe:animate-[bar-rise_2.8s_ease-in-out_infinite_alternate]"
          style={{ height: `${h}%`, ...delay(i * 0.18) }}
        />
      ))}
    </div>
  ),

  /* three phones fanned out, floating */
  apps: (
    <div className="relative size-full">
      {[
        { x: "8%", r: -14, d: 0 },
        { x: "34%", r: 0, d: -2 },
        { x: "60%", r: 14, d: -4 },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute top-[14%] h-[72%] w-[32%] motion-safe:animate-float"
          style={{ left: p.x, ...delay(p.d) }}
        >
          <span
            className="block size-full rounded-[10px] border-2 border-current bg-accent/10"
            style={{ transform: `rotate(${p.r}deg)` }}
          >
            <span className="mx-auto mt-1 block h-1 w-1/3 rounded-full bg-current/60" />
          </span>
        </span>
      ))}
    </div>
  ),

  /* a contribution-style heatmap lighting up */
  code: (
    <div className="grid size-full grid-cols-7 gap-1 p-1">
      {Array.from({ length: 35 }, (_, i) => {
        const level = (i * 7 + (i % 5) * 3) % 4;
        return (
          <span
            key={i}
            className="rounded-[3px] bg-accent motion-safe:animate-pulse"
            style={{ opacity: 0.12 + level * 0.22, ...delay(((i * 37) % 23) / 10) }}
          />
        );
      })}
    </div>
  ),

  /* packets flowing along three lanes */
  throughput: (
    <div className="relative flex size-full flex-col justify-center gap-5 overflow-hidden">
      {[0, 1, 2].map((lane) => (
        <div key={lane} className="relative h-px bg-current/25">
          {[0, 1].map((k) => (
            <span
              key={k}
              className="absolute -top-1 size-2 rounded-full bg-current shadow-[0_0_10px_currentColor] motion-safe:animate-[lane_2.4s_linear_infinite]"
              style={delay(-(lane * 0.5 + k * 1.2))}
            />
          ))}
        </div>
      ))}
    </div>
  ),

  /* a ring filled to 84% */
  coverage: (
    <svg viewBox="0 0 100 100" className="size-full -rotate-90">
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="url(#stat-ring)"
        strokeWidth="8"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="84 100"
        className="motion-safe:animate-[ring-draw_3s_ease-out_infinite_alternate]"
      />
      <defs>
        <linearGradient id="stat-ring" x1="0" x2="1">
          <stop offset="0" stopColor="var(--c-primary)" />
          <stop offset="1" stopColor="var(--c-accent)" />
        </linearGradient>
      </defs>
    </svg>
  ),

  /* a shield with a tick, pinging */
  check: (
    <div className="relative grid size-full place-items-center">
      <span className="absolute size-16 rounded-full border border-current/40 motion-safe:animate-ping" />
      <svg viewBox="0 0 24 24" className="size-16" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" fillOpacity="0.1" fill="currentColor" />
        <path d="m8.5 12 2.5 2.5 4.5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ),
};
