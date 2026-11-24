"use client";

import { useId, useState } from "react";
import { ArrowDown } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import type { DiagramNodeView, DiagramView } from "@/lib/projectView";
import type { DiagramEdgeKind, DiagramNodeGroup } from "@/types/content";

/* Desktop canvas: 12 × 8 grid mapped into a 1000 × 540 viewBox. */
const VB = { w: 1000, h: 540 };
const NODE = { w: 140, h: 78 };
const cx = (x: number) => 75 + x * (850 / 11);
const cy = (y: number) => 45 + y * (450 / 7);

const groupStyle: Record<DiagramNodeGroup, { border: string; dot: string; label: string }> = {
  client: { border: "border-fg/25", dot: "bg-fg/60", label: "Client" },
  service: { border: "border-primary/55", dot: "bg-primary", label: "Service" },
  supervisor: { border: "border-success/60", dot: "bg-success", label: "Supervisor" },
  queue: { border: "border-accent/55", dot: "bg-accent", label: "Queue / topic" },
  store: { border: "border-warning/55", dot: "bg-warning", label: "Storage" },
  infra: { border: "border-muted/50", dot: "bg-muted", label: "Infrastructure" },
  external: { border: "border-dashed border-fg/30", dot: "bg-fg/40", label: "External service" },
};

const edgeStyle: Record<DiagramEdgeKind, { stroke: string; dash?: string; width: number }> = {
  happy: { stroke: "url(#__grad__)", width: 2.5 },
  async: { stroke: "var(--c-muted)", dash: "4 6", width: 1.5 },
  retry: { stroke: "var(--c-warning)", dash: "7 5", width: 2 },
  dlq: { stroke: "var(--c-danger)", width: 2 },
};

function edgePath(a: DiagramNodeView, b: DiagramNodeView) {
  const x1 = cx(a.x);
  const y1 = cy(a.y);
  const x2 = cx(b.x);
  const y2 = cy(b.y);
  const mx = (x1 + x2) / 2;
  return {
    d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
    mid: [mx, (y1 + y2) / 2] as const,
  };
}

/**
 * Architecture diagram for SystemStage (docs/MOTION_AND_SHOWCASE.md §6.5).
 * `revealed` = number of edges drawn (edges are listed in request-flow order),
 * `playing` = packets travel the drawn happy-path edges, `crash` = the node a
 * supervisor watches flashes red and restarts green.
 */
export function SystemDiagram({
  diagram,
  revealed,
  playing,
  crash,
  className,
}: {
  diagram: DiagramView;
  revealed: number;
  playing: boolean;
  crash: boolean;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const gradId = useId().replace(/:/g, "");
  const [focus, setFocus] = useState<string | null>(null);

  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const shownEdges = diagram.edges.slice(0, Math.max(0, revealed));
  const litNodes = new Set(shownEdges.flatMap((e) => [e.from, e.to]));
  const supervisor = diagram.nodes.find((n) => n.group === "supervisor");
  const crashTarget = supervisor
    ? diagram.edges.find((e) => e.from === supervisor.id)?.to
    : undefined;
  const focused = focus ? byId.get(focus) : undefined;

  return (
    <div className={cn("w-full", className)}>
      {/* ---------- Desktop: SVG canvas ---------- */}
      <div className="hidden lg:block">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          role="img"
          aria-label={`${diagram.title}. ${diagram.description}`}
          className="w-full overflow-visible"
        >
          <defs>
            <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* edges */}
          {diagram.edges.map((edge, i) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;
            const { d, mid } = edgePath(a, b);
            const style = edgeStyle[edge.kind];
            const on = i < revealed;
            return (
              <g key={`${edge.from}-${edge.to}-${i}`}>
                {/* faint ghost so the whole system is visible from the start */}
                <path d={d} fill="none" stroke="var(--c-glass-border)" strokeWidth={1.5} />
                {style.dash ? (
                  // dashed kinds fade in (a draw-on reveal would fight the dash pattern)
                  <path
                    d={d}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={style.width}
                    strokeDasharray={style.dash}
                    style={{ opacity: on ? 1 : 0, transition: "opacity 600ms" }}
                  />
                ) : (
                  // solid kinds draw themselves on (pathLength=1 dash trick)
                  <path
                    d={d}
                    fill="none"
                    pathLength={1}
                    stroke={style.stroke === "url(#__grad__)" ? `url(#${gradId})` : style.stroke}
                    strokeWidth={style.width}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    strokeDashoffset={on ? 0 : 1}
                    style={{ transition: "stroke-dashoffset 900ms var(--ease-out-expo)" }}
                  />
                )}
                {edge.label && (
                  <text
                    x={mid[0]}
                    y={mid[1] - 8}
                    textAnchor="middle"
                    className="fill-muted font-mono"
                    style={{ fontSize: 12, opacity: on ? 1 : 0, transition: "opacity 400ms" }}
                  >
                    {edge.label}
                  </text>
                )}
                {/* packets along drawn main-path edges */}
                {playing && on && !reducedMotion && edge.kind === "happy" && (
                  <circle r={4.5} fill="#22d3ee" style={{ filter: "drop-shadow(0 0 6px #22d3ee)" }}>
                    <animateMotion
                      dur="2.2s"
                      repeatCount="indefinite"
                      begin={`${(i % 4) * 0.35}s`}
                      path={d}
                    />
                  </circle>
                )}
                {playing && on && !reducedMotion && edge.kind === "dlq" && (
                  <circle r={4} fill="var(--c-danger)">
                    <animateMotion dur="3.2s" repeatCount="indefinite" begin="1.2s" path={d} />
                  </circle>
                )}
              </g>
            );
          })}

          {/* nodes */}
          {diagram.nodes.map((node) => {
            const lit = litNodes.has(node.id);
            const crashing = crash && !reducedMotion && node.id === crashTarget;
            return (
              <foreignObject
                key={node.id}
                x={cx(node.x) - NODE.w / 2}
                y={cy(node.y) - NODE.h / 2}
                width={NODE.w}
                height={NODE.h}
                style={{ overflow: "visible" }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setFocus(node.id)}
                  onMouseLeave={() => setFocus(null)}
                  onFocus={() => setFocus(node.id)}
                  onBlur={() => setFocus(null)}
                  aria-label={`${node.label}${node.sublabel ? `, ${node.sublabel}` : ""}: ${node.tooltip}`}
                  className={cn(
                    "flex size-full flex-col items-center justify-center gap-0.5 rounded-md border bg-surface px-2 text-center",
                    "transition-[opacity,border-color,box-shadow] duration-500",
                    groupStyle[node.group].border,
                    lit ? "opacity-100 shadow-card" : "opacity-35",
                    focus === node.id && "border-accent shadow-glow-cyan",
                    crashing && "animate-crash",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {node.iconPath && (
                      <BrandIcon path={node.iconPath} className="size-3.5 text-muted" />
                    )}
                    <span className="font-display text-[15px] leading-tight font-semibold text-fg">
                      {node.label}
                    </span>
                  </span>
                  {node.sublabel && (
                    <span className="line-clamp-2 font-mono text-[11px] leading-tight text-muted">
                      {node.sublabel}
                    </span>
                  )}
                </button>
              </foreignObject>
            );
          })}
        </svg>

        {/* info bar: hovered/focused node, else legend */}
        <div
          className="mt-3 min-h-14 rounded-md border border-glass-border bg-glass px-4 py-3 text-small"
          aria-live="polite"
        >
          {focused ? (
            <p>
              <span className="font-display font-semibold text-fg">{focused.label}</span>{" "}
              <span className="text-muted">· {groupStyle[focused.group].label}.</span>{" "}
              <span className="text-muted">{focused.tooltip}</span>
            </p>
          ) : (
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-muted">
              <span className="text-fg/80">Hover a node for details</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-5 rounded bg-linear-to-r from-primary to-accent" /> main
                flow
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-5 rounded bg-warning" /> retry
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-5 rounded bg-danger" /> dead letter
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-px w-5 border-t border-dashed border-muted" /> async
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ---------- Mobile: vertical flow ---------- */}
      <ol className="flex flex-col items-stretch lg:hidden" aria-label={diagram.title}>
        {diagram.nodes.map((node, i) => (
          <li key={node.id} className="flex flex-col items-center">
            <div
              className={cn(
                "w-full rounded-md border bg-surface p-3.5",
                groupStyle[node.group].border,
              )}
            >
              <p className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("size-2 shrink-0 rounded-full", groupStyle[node.group].dot)}
                />
                {node.iconPath && (
                  <BrandIcon path={node.iconPath} className="size-3.5 text-muted" />
                )}
                <span className="font-display font-semibold">{node.label}</span>
                {node.sublabel && (
                  <span className="truncate font-mono text-[0.6875rem] text-muted">
                    · {node.sublabel}
                  </span>
                )}
              </p>
              <p className="mt-1.5 text-small text-muted">{node.tooltip}</p>
            </div>
            {i < diagram.nodes.length - 1 && (
              <ArrowDown aria-hidden className="my-1.5 size-4 text-muted" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
