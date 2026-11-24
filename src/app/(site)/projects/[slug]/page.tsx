import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { BrowserMockup } from "@/components/showcase/BrowserMockup";
import { PhoneMockup } from "@/components/showcase/PhoneMockup";
import { ProjectLinks } from "@/components/showcase/ProjectLinks";
import {
  DesktopPagesPlaceholder,
  PhoneScreenPlaceholder,
  PreviewTag,
} from "@/components/showcase/ScreenPlaceholder";
import { SystemDiagram } from "@/components/showcase/SystemDiagram";
import { TerminalPanel } from "@/components/showcase/TerminalPanel";
import { TechChip } from "@/components/ui/TechChip";
import { profile } from "@/content/profile";
import { loadCaseStudy } from "@/lib/caseStudies";
import { getProjects } from "@/lib/content";
import { hostOf, KIND_LABEL, type DiagramView, type ProjectView } from "@/lib/projectView";
import { getDiagramView, getProjectView, getProjectViews } from "@/lib/views";

/**
 * Case study: /projects/[slug] (docs/MOTION_AND_SHOWCASE.md §6.7).
 * Every project gets a page built from its structured content; projects with
 * an MDX write-up (lib/caseStudies.ts) also get a long-form "The story" section.
 * Prerendered for every slug; unknown slugs 404 (Cache Components doesn't
 * support dynamicParams, so the page calls notFound()).
 */
export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectView(slug);
  if (!project) return {};
  const title = `${project.title}: case study`;
  return {
    title,
    description: project.tagline,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { type: "article", title, description: project.tagline, url: `/projects/${slug}` },
    twitter: { card: "summary_large_image", title, description: project.tagline },
  };
}

export default async function CaseStudyPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const all = getProjectViews();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = all[index];
  const next = all[(index + 1) % all.length];
  const diagram = getDiagramView(project.architecture);
  const Story = await loadCaseStudy(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.devshivam.online";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.tagline,
    description: project.summary,
    url: `${siteUrl}/projects/${slug}`,
    keywords: project.stack.join(", "),
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    ...(project.links.live ? { sameAs: [project.links.live] } : {}),
  };

  const facts = [
    project.role && { label: "Role", value: project.role },
    project.companyName && { label: "Company", value: project.companyName },
    project.periodLabel && { label: "Period", value: project.periodLabel },
    { label: "Type", value: KIND_LABEL[project.kind] },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ---------- Hero ---------- */}
      <header className="relative isolate overflow-clip pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 opacity-80 bg-aurora"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
        <div className="container-page grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 rounded-full py-1 text-small text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft aria-hidden className="size-4" /> All work
            </Link>
            <p className="mt-6 font-mono text-label text-muted uppercase">
              Case study · {KIND_LABEL[project.kind]}
            </p>
            <h1 className="mt-3 text-h1">{project.title}</h1>
            <p className="mt-5 max-w-[56ch] text-lead text-muted">{project.tagline}</p>
            <ProjectLinks project={project} className="mt-8" />
            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-label text-muted uppercase">{f.label}</dt>
                  <dd className="mt-1.5 text-fg">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6">
            <HeroVisual project={project} diagram={diagram} />
          </div>
        </div>
      </header>

      {/* ---------- Overview ---------- */}
      <section aria-labelledby="overview" className="border-t border-glass-border py-20">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 id="overview" className="font-mono text-label text-muted uppercase">
              Overview
            </h2>
            <p className="mt-5 font-display text-[clamp(1.25rem,1vw+1rem,1.625rem)] leading-snug">
              {project.summary}
            </p>
          </Reveal>
          {project.metrics.length > 0 && (
            <Reveal stagger className="grid grid-cols-2 gap-4 self-start lg:col-span-5">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-lg p-5 shadow-none glass">
                  <p className="font-mono text-h2 tabular-nums">{m.value}</p>
                  <p className="mt-1 text-small text-muted">{m.label}</p>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------- What I built ---------- */}
      <section aria-labelledby="built" className="border-t border-glass-border py-20">
        <div className="container-page">
          <h2 id="built" className="text-h2">
            What I <span className="text-gradient">built</span>
          </h2>
          <Reveal stagger className="mt-10 grid gap-5 md:grid-cols-2">
            {project.highlights.map((h, i) => (
              <div key={h.title} className="h-full rounded-xl p-6 shadow-none glass md:p-7">
                <p className="font-mono text-label text-primary-text">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-h4">{h.title}</h3>
                <p className="mt-2 text-muted">{h.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- Architecture (non-backend projects with a diagram) ---------- */}
      {diagram && project.kind !== "backend" && (
        <section aria-labelledby="architecture" className="border-t border-glass-border py-20">
          <div className="container-page">
            <h2 id="architecture" className="text-h2">
              Under the <span className="text-gradient">hood</span>
            </h2>
            <p className="mt-4 max-w-[70ch] text-muted">{diagram.description}</p>
            <div className="mt-10">
              <SystemDiagram
                diagram={diagram}
                revealed={diagram.edges.length}
                playing
                crash={false}
              />
            </div>
          </div>
        </section>
      )}

      {/* ---------- Screens (real screenshots only) ---------- */}
      <Screens project={project} />

      {/* ---------- Story (MDX) ---------- */}
      {Story && (
        <section aria-labelledby="story" className="border-t border-glass-border py-20">
          <div className="container-page">
            <h2 id="story" className="text-h2">
              The <span className="text-gradient">story</span>
            </h2>
            <div className="mt-6 max-w-[70ch]">
              <Story />
            </div>
          </div>
        </section>
      )}

      {/* ---------- Stack ---------- */}
      <section aria-labelledby="stack" className="border-t border-glass-border py-16">
        <div className="container-page">
          <h2 id="stack" className="font-mono text-label text-muted uppercase">
            Stack
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <li key={t}>
                <TechChip>{t}</TechChip>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Next project ---------- */}
      <nav aria-label="Next case study" className="border-t border-glass-border">
        <Link
          href={`/projects/${next.slug}`}
          data-cursor="Next"
          className="group container-page flex items-center justify-between gap-8 py-16 md:py-24"
        >
          <span>
            <span className="font-mono text-label text-muted uppercase">Next case study</span>
            <span className="mt-3 block font-display text-[clamp(2rem,5vw,4.5rem)] leading-none font-bold transition-colors group-hover:text-primary-text">
              {next.title}
            </span>
            <span className="mt-3 block max-w-[56ch] text-muted">{next.tagline}</span>
          </span>
          <span className="grid size-16 shrink-0 place-items-center rounded-full shadow-none glass transition-transform duration-300 group-hover:translate-x-1 md:size-20">
            <ArrowRight aria-hidden className="size-6" />
          </span>
        </Link>
      </nav>
    </article>
  );
}

/** Large hero visual by kind; backend projects show their live architecture diagram. */
function HeroVisual({ project, diagram }: { project: ProjectView; diagram?: DiagramView }) {
  const h = project.highlights[0];
  const url = project.links.live ? hostOf(project.links.live) : `${project.slug}.app`;
  const glow = (
    <div
      aria-hidden
      className="absolute inset-[-10%] -z-10 opacity-35 blur-3xl"
      style={{ background: `radial-gradient(circle, ${project.accent}, transparent 65%)` }}
    />
  );

  if (project.kind === "backend" && diagram) {
    return (
      <div className="relative">
        {glow}
        <SystemDiagram diagram={diagram} revealed={diagram.edges.length} playing crash />
        {diagram.terminal && (
          <TerminalPanel lines={diagram.terminal} active className="mt-4 hidden lg:block" />
        )}
      </div>
    );
  }

  const { cover, desktopFull, desktopScreens, phoneScreens } = project.media;
  const phoneShot = phoneScreens?.[0];
  const desktopShot = cover ?? desktopScreens?.[0] ?? desktopFull;

  // A mobile app with a promo cover but no phone screens: show the cover itself.
  if (project.kind === "mobile" && !phoneShot && cover) {
    return (
      <div className="relative">
        {glow}
        <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-glass-border bg-elevated shadow-lift">
          <Image
            src={cover}
            alt={`${project.title} preview`}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  const phone = (
    <PhoneMockup>
      {phoneShot ? (
        <Image
          src={phoneShot}
          alt={`${project.title} on mobile`}
          fill
          priority
          sizes="300px"
          className="object-cover object-top"
        />
      ) : (
        <PhoneScreenPlaceholder
          title={project.title}
          heading={h.title}
          body={h.body}
          step={0}
          accent={project.accent}
        />
      )}
    </PhoneMockup>
  );
  const browser = (
    <BrowserMockup url={url}>
      {desktopShot ? (
        <Image
          src={desktopShot}
          alt={`${project.title} on desktop`}
          fill
          priority
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover object-top"
        />
      ) : (
        <>
          <div className="absolute inset-0 flex flex-col">
            <DesktopPagesPlaceholder title={project.title} sections={[h]} accent={project.accent} />
          </div>
          {project.kind === "web" && <PreviewTag />}
        </>
      )}
    </BrowserMockup>
  );

  return (
    <div className="relative">
      {glow}
      {project.kind === "mobile" && <div className="mx-auto w-[min(300px,70vw)]">{phone}</div>}
      {(project.kind === "web" || (project.kind === "hybrid" && desktopShot && !phoneShot)) &&
        browser}
      {project.kind === "hybrid" && (phoneShot || !desktopShot) && (
        <div className="relative pr-[14%] pb-[16%]">
          {browser}
          <div className="absolute right-0 bottom-0 w-[30%] min-w-[110px]">{phone}</div>
        </div>
      )}
    </div>
  );
}

/** Title of the highlight a screenshot illustrates (its `screen`, else its position). */
function captionFor(project: ProjectView, index: number) {
  return project.highlights.find((h, i) => (h.screen ?? i) === index)?.title;
}

/**
 * Every real screenshot for the project: phone screens in device frames, then
 * desktop screens, the full-page capture and gallery images. Renders nothing until
 * images are added to public/projects/<slug>/ (see docs/SETUP_MEDIA_AND_EMAIL.md).
 */
function Screens({ project }: { project: ProjectView }) {
  const phones = project.media.phoneScreens ?? [];
  const desktops = project.media.desktopScreens ?? [];
  const wide = [project.media.desktopFull, ...(project.media.gallery ?? [])].filter(
    (src): src is string => Boolean(src),
  );
  if (phones.length === 0 && desktops.length === 0 && wide.length === 0) return null;

  return (
    <section aria-labelledby="screens" className="border-t border-glass-border py-20">
      <div className="container-page">
        <h2 id="screens" className="text-h2">
          The <span className="text-gradient">screens</span>
        </h2>

        {phones.length > 0 && (
          <ul className="mt-10 flex snap-x snap-mandatory [scrollbar-width:thin] gap-6 overflow-x-auto pb-4">
            {phones.map((src, i) => (
              <li key={src} className="w-[min(240px,62vw)] shrink-0 snap-start">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="View"
                  className="block"
                >
                  <PhoneMockup>
                    <Image
                      src={src}
                      alt={`${project.title} screen ${i + 1}${captionFor(project, i) ? `: ${captionFor(project, i)}` : ""}`}
                      fill
                      sizes="240px"
                      className="object-cover object-top"
                    />
                  </PhoneMockup>
                </a>
                {captionFor(project, i) && (
                  <p className="mt-3 text-center text-small text-muted">
                    {captionFor(project, i)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {desktops.length > 0 && (
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {desktops.map((src, i) => (
              <li key={src}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="View"
                  className="relative block aspect-[2/1] overflow-hidden rounded-xl border border-glass-border bg-elevated shadow-card"
                >
                  <Image
                    src={src}
                    alt={`${project.title} on desktop ${i + 1}${captionFor(project, i) ? `: ${captionFor(project, i)}` : ""}`}
                    fill
                    sizes="(min-width: 1240px) 560px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </a>
                {captionFor(project, i) && (
                  <p className="mt-3 text-small text-muted">{captionFor(project, i)}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        {wide.length > 0 && (
          <div className="mt-10 grid gap-6">
            {wide.map((src, i) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="View"
                className="relative block aspect-[16/10] overflow-hidden rounded-xl border border-glass-border bg-elevated shadow-card"
              >
                <Image
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  fill
                  sizes="(min-width: 1240px) 1144px, 100vw"
                  className="object-cover object-top"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
