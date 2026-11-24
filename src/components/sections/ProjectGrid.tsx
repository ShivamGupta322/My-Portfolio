"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LazyMount } from "@/components/motion/LazyMount";
import { TiltCard } from "@/components/motion/TiltCard";
import { BrowserMockup } from "@/components/showcase/BrowserMockup";
import { PhoneMockup } from "@/components/showcase/PhoneMockup";
import { ProjectLinks } from "@/components/showcase/ProjectLinks";
import {
  DesktopPagesPlaceholder,
  PhoneScreenPlaceholder,
} from "@/components/showcase/ScreenPlaceholder";
import { Badge } from "@/components/ui/Badge";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TechChip } from "@/components/ui/TechChip";
import { useLens } from "@/hooks/useLens";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import {
  hostOf,
  KIND_LABEL,
  matchesKind,
  projectAnchorId,
  STATUS_LABEL,
  type DiagramView,
  type KindFilter,
  type ProjectView,
} from "@/lib/projectView";

const filters = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
] as const satisfies readonly { value: KindFilter; label: string }[];

/**
 * Every project not featured in the current lens, lens-matching ones first.
 * Filter chips reflow cards with Motion layout animations.
 */
export function ProjectGrid({
  projects,
  diagrams,
}: {
  projects: ProjectView[];
  diagrams: Record<string, DiagramView>;
}) {
  const lens = useLens();
  const [filter, setFilter] = useState<KindFilter>("all");

  const items = projects
    .filter((p) => p.featured[lens] === undefined && matchesKind(p.kind, filter))
    .sort((a, b) => Number(b.lens.includes(lens)) - Number(a.lens.includes(lens)));

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-h3">More projects</h3>
          <p className="mt-2 text-muted">
            Everything else I&apos;ve built, from shipped apps to systems in progress.
          </p>
        </div>
        <SegmentedControl
          label="Filter projects by type"
          options={filters}
          value={filter}
          onChange={setFilter}
          className="self-start overflow-x-auto sm:self-auto"
        />
      </div>

      <motion.ul layout className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((p) => (
            <motion.li
              key={p.slug}
              id={projectAnchorId(p.slug)}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: ease.outExpo }}
            >
              <ProjectCard
                project={p}
                diagram={p.architecture ? diagrams[p.architecture] : undefined}
                lens={lens}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {items.length === 0 && (
        <p className="mt-8 rounded-md border border-dashed border-glass-border p-6 text-center text-muted">
          No {filter} projects outside the featured stages in this lens. Try another filter.
        </p>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  diagram,
  lens,
}: {
  project: ProjectView;
  diagram?: DiagramView;
  lens: "product" | "systems";
}) {
  const matches = project.lens.includes(lens);
  return (
    <TiltCard
      max={4}
      className={cn(
        "flex h-full flex-col rounded-xl shadow-none glass transition-[border-color,box-shadow] duration-300 hover:shadow-lift",
        matches && "glass-gradient",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-glass-border bg-elevated">
        <LazyMount className="absolute inset-0">
          <MiniVisual project={project} diagram={diagram} />
        </LazyMount>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              project.status === "live"
                ? "live"
                : project.status === "in-progress"
                  ? "in-progress"
                  : "neutral"
            }
          >
            {STATUS_LABEL[project.status]}
          </Badge>
          <span className="font-mono text-label text-muted uppercase">
            {KIND_LABEL[project.kind]}
          </span>
        </div>
        <h4 className="mt-4 text-h4">{project.title}</h4>
        {project.companyName && (
          <p className="mt-1 text-[0.75rem] text-muted">{project.companyName}</p>
        )}
        <p className="mt-2 text-small text-muted">{project.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.stack.slice(0, 4).map((t) => (
            <li key={t}>
              <TechChip>{t}</TechChip>
            </li>
          ))}
        </ul>
        <ProjectLinks
          project={project}
          compact
          caseStudyHref={`/projects/${project.slug}`}
          className="mt-auto pt-5"
        />
      </div>
    </TiltCard>
  );
}

/** Small static visual for a card: phone, browser, both, or a diagram thumbnail. */
function MiniVisual({ project, diagram }: { project: ProjectView; diagram?: DiagramView }) {
  const h = project.highlights[0];
  const url = project.links.live ? hostOf(project.links.live) : `${project.slug}.app`;
  const glow = (
    <span
      aria-hidden
      className="absolute inset-0 opacity-40"
      style={{
        background: `radial-gradient(circle at 70% 30%, ${project.accent}, transparent 60%)`,
      }}
    />
  );

  const { cover, desktopFull, desktopScreens, phoneScreens } = project.media;
  const desktopShot = desktopScreens?.[0] ?? desktopFull;

  // A cover image (public/projects/<slug>/cover.*) fills the card for any kind.
  if (cover) {
    return (
      <Image
        src={cover}
        alt={`${project.title} preview`}
        fill
        sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-top"
      />
    );
  }

  if (project.kind === "backend" && diagram)
    return (
      <>
        {glow}
        <DiagramThumb diagram={diagram} />
      </>
    );

  const phoneShot = phoneScreens?.[0];
  const phone = (
    <PhoneMockup>
      {phoneShot ? (
        <Image src={phoneShot} alt="" fill sizes="140px" className="object-cover object-top" />
      ) : (
        <PhoneScreenPlaceholder
          title={project.title}
          heading={h.title}
          body={h.body}
          step={0}
          accent={project.accent}
          tag={false}
        />
      )}
    </PhoneMockup>
  );
  const browser = (
    <BrowserMockup url={url} className="shadow-card">
      {desktopShot ? (
        <Image src={desktopShot} alt="" fill sizes="400px" className="object-cover object-top" />
      ) : (
        <div className="absolute inset-0 flex flex-col">
          <DesktopPagesPlaceholder title={project.title} sections={[h]} accent={project.accent} />
        </div>
      )}
    </BrowserMockup>
  );
  // A hybrid with real desktop screens but no phone ones shows the browser alone.
  const layout =
    project.kind === "hybrid" && desktopShot && !phoneShot ? "web" : project.kind;
  const usesPlaceholder =
    ((layout === "mobile" || layout === "hybrid") && !phoneShot) ||
    ((layout === "web" || layout === "hybrid") && !desktopShot);

  return (
    <>
      {glow}
      {layout === "mobile" && (
        <div className="absolute top-[12%] left-1/2 w-[34%] -translate-x-1/2 rotate-[-4deg]">
          {phone}
        </div>
      )}
      {layout === "web" && (
        <div className="absolute top-[12%] right-[-6%] left-[8%]">{browser}</div>
      )}
      {layout === "hybrid" && (
        <>
          <div className="absolute top-[10%] right-[-10%] left-[6%]">{browser}</div>
          <div className="absolute top-[30%] right-[8%] w-[22%]">{phone}</div>
        </>
      )}
      {usesPlaceholder && (
        <span className="absolute right-2 bottom-2 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.12em] text-white/80 uppercase">
          UI preview
        </span>
      )}
    </>
  );
}

function DiagramThumb({ diagram }: { diagram: DiagramView }) {
  const cx = (x: number) => 40 + x * (320 / 11);
  const cy = (y: number) => 30 + y * (165 / 7);
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  return (
    <svg viewBox="0 0 400 225" aria-hidden className="absolute inset-0 size-full">
      {diagram.edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const mx = (cx(a.x) + cx(b.x)) / 2;
        return (
          <path
            key={i}
            d={`M ${cx(a.x)} ${cy(a.y)} C ${mx} ${cy(a.y)}, ${mx} ${cy(b.y)}, ${cx(b.x)} ${cy(b.y)}`}
            fill="none"
            stroke={
              e.kind === "happy"
                ? "#22d3ee"
                : e.kind === "dlq"
                  ? "var(--c-danger)"
                  : "var(--c-muted)"
            }
            strokeOpacity={e.kind === "happy" ? 0.8 : 0.5}
            strokeWidth={1.5}
            strokeDasharray={e.kind === "async" || e.kind === "retry" ? "3 4" : undefined}
          />
        );
      })}
      {diagram.nodes.map((n) => (
        <rect
          key={n.id}
          x={cx(n.x) - 20}
          y={cy(n.y) - 9}
          width={40}
          height={18}
          rx={5}
          fill="var(--c-surface)"
          stroke={n.group === "supervisor" ? "var(--c-success)" : "var(--c-glass-border)"}
        />
      ))}
    </svg>
  );
}
