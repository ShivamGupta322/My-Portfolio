import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundView } from "@/components/sections/NotFoundView";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404 for URLs that match no route at all. It renders in the root layout only
 * (outside the (site) group), so it carries a minimal header of its own.
 */
export default function RootNotFound() {
  return (
    <>
      <header className="fixed inset-x-4 top-4 z-20 mx-auto max-w-[1240px]">
        <nav
          aria-label="Primary"
          className="flex h-16 items-center rounded-full pl-5 shadow-none glass"
        >
          <Link
            href="/"
            className="font-display text-h4 font-bold tracking-tight"
            aria-label={`${site.initials}, ${site.name}: home`}
          >
            {site.initials}
            <span className="text-primary-text">.</span>
          </Link>
        </nav>
      </header>
      <main id="main">
        <NotFoundView />
      </main>
    </>
  );
}
