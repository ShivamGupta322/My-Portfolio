import { Suspense } from "react";
import { ArrowUpRight, Award, Code2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { TechGlobe, type GlobeTech } from "@/components/motion/TechGlobe";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { LensScope } from "@/components/ui/LensScope";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements } from "@/content/achievements";
import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { iconColor, iconPath } from "@/lib/icons";
import type { Lens } from "@/types/content";
import { GitHubActivity } from "./GitHubActivity";

/** Logos on the globe: the languages and tools people look for first. */
const GLOBE = [
  "JavaScript", "TypeScript", "React", "React Native", "Next.js", "Vue.js", "Node.js",
  "Express.js", "Tailwind CSS", "Redux", "Vite", "Erlang", "Apache Kafka", "XMPP",
  "PostgreSQL", "MongoDB", "Redis", "MySQL", "Docker", "AWS", "Nginx", "Git", "Firebase",
  "Electron", "Prometheus", "C++", "Python", "Linux",
];

const githubUser =
  profile.socials.find((s) => s.label === "GitHub")?.href.split("/").filter(Boolean).pop() ??
  "ShivamGupta322";

const lensLabel = { product: "Product", systems: "Systems" } as const;

/**
 * Skills (docs/MOTION_AND_SHOWCASE.md §5.6–5.7). Server component: resolves
 * brand icons here, then renders
 *  · every skill group as a card; groups matching the active lens move first
 *    and get an accent edge, the others step back (CSS only, via LensScope)
 *  · achievements (DSA, scholarship)
 */
export function Skills({ index }: { index: string }) {
  const groups = skillGroups.map((g) => ({
    ...g,
    lens: g.lens as readonly Lens[],
    items: g.items.map((s) => ({ name: s.name, iconPath: "icon" in s ? iconPath(s.icon) : null })),
  }));

  const total = new Set(groups.flatMap((g) => g.items.map((s) => s.name))).size;

  const iconOf = new Map<string, string | undefined>();
  for (const g of skillGroups)
    for (const s of g.items as readonly { name: string; icon?: string }[]) iconOf.set(s.name, s.icon);
  const globe: GlobeTech[] = GLOBE.flatMap((name) => {
    const slug = iconOf.get(name);
    const path = iconPath(slug);
    return path ? [{ name, path, color: iconColor(slug) }] : [];
  });

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative isolate overflow-x-clip border-t border-glass-border section-y"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-[-15%] -z-10 size-[520px] rounded-full bg-accent/10 blur-[130px]"
      />
      <div className="container-page grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-12">
        <Reveal>
          <SectionHeading
            id="skills-title"
            index={index}
            eyebrow="Skills"
            title="Tools I reach for"
            highlight="Tools"
            intro={`${total} tools across web, mobile, backend and Erlang/OTP. Groups that match the lens you picked come first.`}
          />
        </Reveal>
        <TechGlobe techs={globe} className="mx-auto max-w-[min(30rem,88vw)]" />
      </div>

      <LensScope className="container-page mt-12">
        <h3 className="sr-only">Skills by area</h3>
        <Reveal stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div
              key={g.id}
              data-lens-product={g.lens.includes("product") ? "" : undefined}
              data-lens-systems={g.lens.includes("systems") ? "" : undefined}
              className="lens-order"
            >
              <article
                data-lens-product={g.lens.includes("product") ? "" : undefined}
                data-lens-systems={g.lens.includes("systems") ? "" : undefined}
                className="lens-group h-full rounded-xl p-6 shadow-none glass"
              >
                <header className="flex items-start justify-between gap-3">
                  <h4 className="text-h4">{g.title}</h4>
                  <span className="shrink-0 font-mono text-[0.6875rem] text-muted uppercase">
                    {g.lens.map((l) => lensLabel[l]).join(" · ")}
                  </span>
                </header>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <li
                      key={s.name}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-glass-border bg-glass px-2.5 py-1 font-mono text-[0.75rem] text-fg/85"
                    >
                      {s.iconPath && (
                        <BrandIcon path={s.iconPath} className="size-3.5 text-muted" />
                      )}
                      {s.name}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
        </Reveal>
      </LensScope>

      <div className="container-page mt-20">
        <h3 className="flex items-center gap-2 font-mono text-label text-muted uppercase">
          <Award aria-hidden className="size-3.5 text-primary-text" /> Recognition
        </h3>
        <Reveal stagger className="mt-5 grid gap-4 md:grid-cols-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="glass-gradient flex h-full flex-col rounded-xl p-7 shadow-none glass"
            >
              <p className="font-mono text-metric tabular-nums">{a.value}</p>
              <p className="mt-3 text-h4">{a.title}</p>
              <p className="mt-1.5 text-muted">{a.description}</p>
              {"links" in a && (
                <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                  {a.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-glass-border bg-glass px-4 text-small font-medium transition-colors hover:border-fg/30 hover:bg-glass-strong"
                      >
                        <Code2 aria-hidden className="size-4 text-primary-text" />
                        {l.label}
                        <ArrowUpRight aria-hidden className="size-3.5 text-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Reveal>
        <Suspense fallback={null}>
          <Reveal className="mt-4">
            <GitHubActivity username={githubUser} />
          </Reveal>
        </Suspense>
      </div>
    </section>
  );
}
