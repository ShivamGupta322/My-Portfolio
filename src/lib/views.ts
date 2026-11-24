import "server-only";
import { formatPeriod, getDiagram, getExperience, getProjects } from "@/lib/content";
import { iconPath } from "@/lib/icons";
import { discoverMedia, mergeMedia } from "@/lib/mediaDiscovery";
import { toProjectView, type DiagramView, type ProjectView } from "@/lib/projectView";

/**
 * Server-side builders for the serializable view models that client showcase
 * components receive. Shared by the Work section and case-study pages.
 */

/** "Scramble Apps", not "Scramble Apps Pvt. Ltd.": keeps eyebrows on one line. */
function companyNames() {
  return new Map(getExperience().map((c) => [c.id, c.name.replace(/ Pvt\. Ltd\.$/, "")] as const));
}

export function getProjectViews(): ProjectView[] {
  const companies = companyNames();
  return getProjects().map((p) => {
    const view = toProjectView(p, {
      companyName: p.company === "personal" ? null : (companies.get(p.company) ?? null),
      periodLabel: p.period ? formatPeriod(p.period) : null,
    });
    // Drop-in screenshots from public/projects/<slug>/ (see lib/mediaDiscovery.ts).
    return { ...view, media: mergeMedia(p.media, discoverMedia(p.slug)) };
  });
}

export function getProjectView(slug: string): ProjectView | undefined {
  return getProjectViews().find((p) => p.slug === slug);
}

export function getDiagramView(id: string | null | undefined): DiagramView | undefined {
  if (!id) return undefined;
  const d = getDiagram(id);
  if (!d) return undefined;
  return {
    ...d,
    nodes: d.nodes.map(({ icon, ...node }) => ({ ...node, iconPath: iconPath(icon) })),
  };
}
