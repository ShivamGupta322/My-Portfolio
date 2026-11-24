import type {
  Diagram,
  DiagramNode,
  Lens,
  Metric,
  Project,
  ProjectKind,
  ProjectLinks,
  ProjectMedia,
  ProjectStatus,
} from "@/types/content";

/**
 * Serializable view models passed from server sections to client showcase
 * components, plus pure helpers. Nothing here imports content, so client
 * components can use it without pulling every project into the bundle.
 */

export interface ProjectView {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  kind: ProjectKind;
  lens: readonly Lens[];
  status: ProjectStatus;
  companyName: string | null;
  periodLabel: string | null;
  role: string | null;
  stack: readonly string[];
  /** `screen` = which phone-N / desktop-N (0-based) illustrates this highlight. */
  highlights: readonly { title: string; body: string; screen?: number }[];
  metrics: readonly Metric[];
  links: ProjectLinks;
  media: ProjectMedia;
  featured: Partial<Record<Lens, number>>;
  architecture: string | null;
  accent: string;
}

export interface DiagramNodeView extends Omit<DiagramNode, "icon"> {
  /** SVG path from simple-icons, resolved on the server. */
  iconPath: string | null;
}

export interface DiagramView extends Omit<Diagram, "nodes"> {
  nodes: readonly DiagramNodeView[];
}

export const KIND_LABEL: Record<ProjectKind, string> = {
  mobile: "Mobile app",
  web: "Web app",
  hybrid: "Web + mobile",
  backend: "Backend system",
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live",
  shipped: "Shipped",
  internal: "Internal",
  "in-progress": "In progress",
};

/** Accent hues used by UI-preview placeholders, chosen per project. */
const ACCENTS = ["#8b5cf6", "#22d3ee", "#34d399", "#f472b6", "#fbbf24", "#60a5fa"];

export function accentFor(slug: string): string {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

export type KindFilter = ProjectKind | "all";

/** Hybrid products count as both web and mobile. */
export function matchesKind(kind: ProjectKind, filter: KindFilter): boolean {
  if (filter === "all") return true;
  return kind === filter || (kind === "hybrid" && (filter === "web" || filter === "mobile"));
}

/**
 * Every project renders exactly one element with this id for the current lens:
 * its featured stage, or its grid card.
 */
export function projectAnchorId(slug: string): string {
  return `project-${slug}`;
}

/** Best single image for a card or hero: cover, else the top of the desktop capture, else the first phone screen. */
export function primaryImage(
  media: ProjectMedia,
): { src: string; kind: "cover" | "desktop" | "phone" } | null {
  if (media.cover) return { src: media.cover, kind: "cover" };
  if (media.desktopScreens?.length) return { src: media.desktopScreens[0], kind: "desktop" };
  if (media.desktopFull) return { src: media.desktopFull, kind: "desktop" };
  if (media.phoneScreens?.length) return { src: media.phoneScreens[0], kind: "phone" };
  return null;
}

/** Screenshot for a highlight: its explicit `screen` index, else the step, cycling through what exists. */
export function screenFor(
  screens: readonly string[] | undefined,
  highlights: ProjectView["highlights"],
  step: number,
): string | undefined {
  if (!screens?.length) return undefined;
  const index = highlights[step]?.screen ?? step;
  return screens[index % screens.length];
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function toProjectView(
  p: Project,
  extra: { companyName: string | null; periodLabel: string | null },
): ProjectView {
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    summary: p.summary,
    kind: p.kind,
    lens: p.lens,
    status: p.status,
    companyName: extra.companyName,
    periodLabel: extra.periodLabel,
    role: p.role ?? null,
    stack: p.stack,
    highlights: p.highlights.map((h) => ({ title: h.title, body: h.body, screen: h.screen })),
    metrics: p.metrics ?? [],
    links: p.links,
    media: p.media,
    featured: p.featured ?? {},
    architecture: p.architecture ?? null,
    accent: accentFor(p.slug),
  };
}
