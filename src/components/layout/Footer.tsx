import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { navSections, site } from "@/content/site";
import { SectionLink } from "./SectionLink";

const marqueeWords = ["Let's build something", "Web", "Mobile", "Real-time"];

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {marqueeWords.map((word, i) => (
        <span key={word} className="flex items-center gap-10">
          <span
            className={
              i === 0
                ? "text-gradient"
                : "text-transparent [-webkit-text-stroke:1.5px_var(--c-muted)]"
            }
          >
            {word}
          </span>
          <span className="size-3 shrink-0 rounded-full bg-brand md:size-4" />
        </span>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate overflow-clip border-t border-glass-border bg-surface defer-render">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] opacity-70 bg-aurora"
      />

      <h2 className="sr-only">Let&apos;s build something together</h2>
      <div
        aria-hidden
        className="group flex overflow-hidden py-12 font-display text-[clamp(3rem,10vw,9rem)] leading-none font-bold tracking-tight uppercase select-none md:py-16"
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>

      <div className="container-page grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-h3 font-bold">
            {site.initials}
            <span className="text-primary-text">.</span>
          </p>
          <p className="mt-3 max-w-[32ch] text-muted">{site.tagline}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-flex items-center gap-2 font-medium text-fg underline-offset-4 hover:underline"
          >
            <Mail aria-hidden className="size-4 text-primary-text" />
            {site.email}
          </a>
          <p className="mt-2 text-small text-muted">{site.location}</p>
        </div>

        <nav aria-label="Footer">
          <h3 className="mb-4 font-mono text-label text-muted uppercase">Navigate</h3>
          <ul className="flex flex-col gap-2">
            {navSections.map((s) => (
              <li key={s.id}>
                <SectionLink id={s.id} className="text-fg/85 transition-colors hover:text-fg">
                  {s.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 font-mono text-label text-muted uppercase">Elsewhere</h3>
          <ul className="flex flex-col gap-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fg/85 transition-colors hover:text-fg"
                >
                  {s.label} <ArrowUpRight aria-hidden className="size-3.5 text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-mono text-label text-muted uppercase">Resume</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={site.resume.fullStack}
                className="text-fg/85 transition-colors hover:text-fg"
              >
                Full Stack &amp; Mobile
              </a>
            </li>
            <li>
              <a
                href={site.resume.erlang}
                className="text-fg/85 transition-colors hover:text-fg"
              >
                Erlang/OTP Backend
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col gap-4 border-t border-glass-border py-6 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {site.copyrightYear} {site.name}. Built with Next.js, GSAP &amp; Motion.
        </p>
        <SectionLink
          id="top"
          className="inline-flex items-center gap-2 self-start rounded-full px-3 py-2 transition-colors hover:bg-glass hover:text-fg sm:self-auto"
        >
          Back to top <ArrowUp aria-hidden className="size-4" />
        </SectionLink>
      </div>
    </footer>
  );
}
