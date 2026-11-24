import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { getProjects } from "@/lib/content";

/**
 * Branded 404 body: big glitchy "404", a plain-language message, a way home,
 * and a few real case studies so a mistyped link still lands somewhere useful.
 */
export function NotFoundView() {
  const suggestions = getProjects()
    .filter((p) => p.featured?.product !== undefined || p.featured?.systems !== undefined)
    .slice(0, 4);

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-clip pt-32 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-80 bg-aurora"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
      <div className="container-page">
        <p className="font-mono text-label text-muted uppercase">Error 404 · Page not found</p>
        <h1 className="mt-4 font-display text-[clamp(6rem,22vw,16rem)] leading-[0.85] font-bold tracking-[-0.05em]">
          <span className="text-gradient">404</span>
        </h1>
        <p className="mt-6 max-w-[52ch] text-lead text-muted">
          This page doesn&apos;t exist, or it moved. The link may be mistyped. Here&apos;s a way
          back, plus a few things worth seeing.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            <ArrowLeft aria-hidden /> Back to home
          </Link>
          <Link href="/#work" className={buttonVariants({ variant: "glass", size: "lg" })}>
            <Briefcase aria-hidden /> See my work
          </Link>
        </div>

        <h2 className="mt-16 font-mono text-label text-muted uppercase">Popular case studies</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="block h-full rounded-lg p-5 shadow-none glass transition-colors hover:border-fg/25"
              >
                <span className="block font-display font-semibold">{p.title}</span>
                <span className="mt-1.5 line-clamp-2 block text-small text-muted">{p.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
