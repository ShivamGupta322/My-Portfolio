import { Reveal } from "@/components/motion/Reveal";
import { LensToggle } from "@/components/ui/LensToggle";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { archiveProjects, LENSES } from "@/lib/content";
import type { DiagramView, ProjectView } from "@/lib/projectView";
import { getDiagramView, getProjectViews } from "@/lib/views";
import type { Lens } from "@/types/content";
import { Archive } from "./Archive";
import { FeaturedProjects } from "./FeaturedProjects";
import { ProjectGrid } from "./ProjectGrid";

/**
 * Work (docs/MOTION_AND_SHOWCASE.md §6). Server component: builds serializable
 * view models (resolving brand icons to SVG paths here, so the icon set never
 * ships to the browser) and hands them to the client showcase:
 *   featured stages (per lens) → project grid (everything else) → archive.
 */
export function Work({ index }: { index: string }) {
  const views: ProjectView[] = getProjectViews();

  const featured = Object.fromEntries(
    LENSES.map((lens) => [
      lens,
      views
        .filter((v) => v.featured[lens] !== undefined)
        .sort((a, b) => (a.featured[lens] ?? 0) - (b.featured[lens] ?? 0)),
    ]),
  ) as Record<Lens, ProjectView[]>;

  const diagrams: Record<string, DiagramView> = {};
  for (const v of views) {
    const d = getDiagramView(v.architecture);
    if (d) diagrams[d.id] = d;
  }

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative isolate overflow-x-clip border-t border-glass-border section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-[-10%] -z-10 size-[560px] rounded-full bg-primary/10 blur-[130px]"
      />
      <div className="container-page flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <SectionHeading
            id="work-title"
            index={index}
            eyebrow="Work"
            title="Selected work"
            highlight="work"
            intro="Product stages for the web and mobile apps; architecture stages for the systems behind them. Switch the lens to see the other side."
          />
        </Reveal>
        <LensToggle className="shrink-0" />
      </div>

      <div className="mt-10 lg:mt-6">
        <FeaturedProjects featured={featured} diagrams={diagrams} />
      </div>

      <div className="container-page mt-20 lg:mt-28">
        <ProjectGrid projects={views} diagrams={diagrams} />
        <Archive items={archiveProjects} />
      </div>
    </section>
  );
}
