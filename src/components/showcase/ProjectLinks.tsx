import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siAppstore, siGithub, siGoogleplay } from "simple-icons";
import { Badge } from "@/components/ui/Badge";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { cn } from "@/lib/cn";
import { hostOf, STATUS_LABEL, type ProjectView } from "@/lib/projectView";

const linkClass =
  "inline-flex h-10 items-center gap-2 rounded-full border border-glass-border bg-glass px-4 text-small font-medium text-fg transition-colors duration-200 hover:border-fg/30 hover:bg-glass-strong";

/** Status badge + Live / Google Play / App Store / GitHub buttons for a project. */
export function ProjectLinks({
  project,
  compact = false,
  caseStudyHref,
  className,
}: {
  project: Pick<ProjectView, "links" | "status" | "title">;
  compact?: boolean;
  /** When set, a primary "Case study" link comes first. */
  caseStudyHref?: string;
  className?: string;
}) {
  const { links, status, title } = project;
  const statusVariant =
    status === "live" ? "live" : status === "in-progress" ? "in-progress" : "neutral";

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {!compact && <Badge variant={statusVariant}>{STATUS_LABEL[status]}</Badge>}
      {caseStudyHref && (
        <Link
          href={caseStudyHref}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-strong px-4 text-small font-semibold text-white transition-[background-color,box-shadow] duration-200 hover:bg-primary-strong-hover hover:shadow-glow"
        >
          Case study <ArrowRight aria-hidden className="size-3.5" />
          <span className="sr-only">: {title}</span>
        </Link>
      )}
      {links.live && (
        <a href={links.live} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {compact ? "Live" : hostOf(links.live)} <ArrowUpRight aria-hidden className="size-3.5" />
          <span className="sr-only">(opens {title} in a new tab)</span>
        </a>
      )}
      {links.playStore && (
        <a href={links.playStore} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <BrandIcon path={siGoogleplay.path} />
          {compact ? "Play" : "Google Play"}
        </a>
      )}
      {links.appStore && (
        <a href={links.appStore} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <BrandIcon path={siAppstore.path} />
          {compact ? "iOS" : "App Store"}
        </a>
      )}
      {links.github && (
        <a href={links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <BrandIcon path={siGithub.path} />
          {compact ? "Code" : "GitHub"}
        </a>
      )}
    </div>
  );
}
