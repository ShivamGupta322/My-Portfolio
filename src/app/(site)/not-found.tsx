import type { Metadata } from "next";
import { NotFoundView } from "@/components/sections/NotFoundView";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** 404 inside the site shell (nav + footer), e.g. /projects/<unknown-slug>. */
export default function SiteNotFound() {
  return <NotFoundView />;
}
