import { Briefcase, Globe, Layers, MapPin, Server, Smartphone } from "lucide-react";
import { SectionLink } from "@/components/layout/SectionLink";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import {
  formatDuration,
  formatPeriod,
  getExperience,
  getProject,
  projectAnchorId,
} from "@/lib/content";
import type { Project, ProjectKind } from "@/types/content";
import { TimelineMotion } from "./TimelineMotion";

const kindMeta: Record<ProjectKind, { icon: typeof Globe; label: string }> = {
  mobile: { icon: Smartphone, label: "Mobile app" },
  web: { icon: Globe, label: "Web app" },
  hybrid: { icon: Layers, label: "Web + mobile" },
  backend: { icon: Server, label: "Backend system" },
};

/**
 * Experience timeline (docs/MOTION_AND_SHOWCASE.md §5.3).
 * Server-rendered so project data never ships to the client; TimelineMotion adds
 * the scroll-drawn line, node pops, alternating card slides and lens highlighting.
 * Desktop: centre rail with cards alternating sides and dates opposite.
 * Mobile: single left rail, dates inside the cards.
 */
export function Experience({ index }: { index: string }) {
  const items = getExperience().flatMap((company) =>
    company.roles.map((role) => ({ company, role })),
  );

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative isolate overflow-clip border-t border-glass-border section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-[-12%] -z-10 size-[480px] rounded-full bg-accent/10 blur-[120px]"
      />
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="experience-title"
            index={index}
            eyebrow="Experience"
            title="Where I've shipped"
            highlight="shipped"
            intro="From a MERN internship in 2024 to production mobile apps and Erlang/OTP systems today."
          />
        </Reveal>

        <TimelineMotion className="relative mt-16 lg:mt-24">
          {/* Rail: base track + scroll-drawn gradient + glowing head */}
          <div
            aria-hidden
            data-tl-track
            className="absolute top-2 bottom-2 left-5 w-px -translate-x-1/2 bg-glass-border lg:left-1/2"
          >
            <div
              data-tl-progress
              className="absolute inset-0 origin-top bg-linear-to-b from-primary via-accent to-success"
            />
            <div
              data-tl-head
              className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-glow-cyan motion-reduce:hidden"
            />
          </div>

          <ol className="relative space-y-14 lg:space-y-28">
            {items.map(({ company, role }, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              const current = role.period.end === null;
              const duration = formatDuration(role.period);
              const period = formatPeriod(role.period);
              const products = role.productSlugs
                .map((slug) => getProject(slug))
                .filter((p): p is Project => p !== undefined);

              return (
                <li
                  key={`${company.id}-${role.title}`}
                  data-tl-item
                  data-side={side}
                  className="relative grid pl-14 lg:grid-cols-2 lg:pl-0"
                >
                  {/* Node on the rail */}
                  <div
                    data-tl-node
                    aria-hidden
                    className="absolute top-7 left-5 z-10 -translate-x-1/2 lg:left-1/2"
                  >
                    <span
                      className={cn(
                        "grid size-10 place-items-center rounded-full neu",
                        current ? "text-success" : "text-primary-text",
                      )}
                    >
                      <Briefcase className="size-4" />
                    </span>
                  </div>

                  {/* Date column (desktop, opposite the card) */}
                  <div
                    data-tl-date
                    className={cn(
                      "hidden pt-7 lg:row-start-1 lg:flex lg:flex-col",
                      side === "left"
                        ? "lg:col-start-2 lg:ml-16 lg:items-start"
                        : "lg:col-start-1 lg:mr-16 lg:items-end lg:text-right",
                    )}
                  >
                    <p className="font-mono text-h4 tabular-nums">{period}</p>
                    <p className="mt-1 font-mono text-label text-muted uppercase">
                      {current ? "Current role" : duration}
                    </p>
                  </div>

                  {/* Card */}
                  <article
                    data-tl-card
                    className={cn(
                      "rounded-xl p-6 shadow-card glass md:p-8 lg:row-start-1",
                      side === "left" ? "lg:col-start-1 lg:mr-16" : "lg:col-start-2 lg:ml-16",
                    )}
                  >
                    <header>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-h3">{company.name}</h3>
                        {current && <Badge variant="live">Current</Badge>}
                      </div>
                      <p className="mt-2 text-lead text-fg">{role.title}</p>
                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin aria-hidden className="size-3.5" /> {company.location}
                        </span>
                        <span className="font-mono lg:hidden">
                          {period}
                          {duration ? ` · ${duration}` : ""}
                        </span>
                      </p>
                    </header>

                    <p className="mt-5 text-muted">{role.summary}</p>

                    {products.length > 0 && (
                      <div className="mt-6">
                        <p className="mb-3 font-mono text-label text-muted uppercase">
                          {products.length > 1 ? "Products" : "Product"}
                        </p>
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {products.map((p) => {
                            const Kind = kindMeta[p.kind].icon;
                            return (
                              <li key={p.slug} data-tl-product>
                                <SectionLink
                                  id={projectAnchorId(p.slug)}
                                  data-cursor="View"
                                  data-lens-product={p.lens.includes("product") ? "" : undefined}
                                  data-lens-systems={p.lens.includes("systems") ? "" : undefined}
                                  className="lens-chip group flex h-full flex-col gap-1.5 rounded-md border border-glass-border bg-glass p-3.5 transition-[border-color,background-color] duration-200 hover:border-fg/25"
                                >
                                  <span className="flex items-center gap-2">
                                    <Kind
                                      aria-hidden
                                      className="size-4 shrink-0 text-primary-text"
                                    />
                                    <span className="font-display font-semibold">{p.title}</span>
                                  </span>
                                  {/* a short type label instead of a clipped tagline */}
                                  <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-muted uppercase">
                                    {kindMeta[p.kind].label}
                                  </span>
                                </SectionLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </TimelineMotion>
      </div>
    </section>
  );
}
