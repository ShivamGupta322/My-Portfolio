import { achievements, education } from "@/content/achievements";
import { diagrams } from "@/content/diagrams";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { archive, projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import type {
  ArchiveProject,
  Company,
  CompanyId,
  Diagram,
  Lens,
  Period,
  Project,
  ProjectKind,
  Skill,
  SkillGroup,
} from "@/types/content";

/**
 * Typed read API over src/content. Components import from here, not from the
 * raw content files, so ordering/lens rules live in one place.
 */

export { DEFAULT_LENS, isLens, LENSES } from "@/lib/lens";

export type ProjectSlug = (typeof projects)[number]["slug"];

const allProjects: readonly Project[] = projects;
const allSkillGroups: readonly SkillGroup[] = skillGroups;
const allDiagrams: readonly Diagram[] = diagrams;
const allCompanies: readonly Company[] = experience;

export { achievements, education, profile };
export const archiveProjects: readonly ArchiveProject[] = archive;

/* ---------- Projects ---------- */

export function getProjects(): readonly Project[] {
  return allProjects;
}

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

/** Featured stages for a lens, in their configured order. */
export function getFeaturedProjects(lens: Lens): Project[] {
  return allProjects
    .filter((p) => p.featured?.[lens] !== undefined)
    .sort((a, b) => (a.featured?.[lens] ?? 0) - (b.featured?.[lens] ?? 0));
}

/** Everything not featured in this lens; lens-matching projects first (stable). */
export function getGridProjects(lens: Lens): Project[] {
  return sortByLens(
    allProjects.filter((p) => p.featured?.[lens] === undefined),
    lens,
  );
}

export function sortByLens<T extends { lens: readonly Lens[] }>(
  items: readonly T[],
  lens: Lens,
): T[] {
  return [...items].sort((a, b) => Number(b.lens.includes(lens)) - Number(a.lens.includes(lens)));
}

export function filterByKind(items: readonly Project[], kind: ProjectKind | "all"): Project[] {
  if (kind === "all") return [...items];
  // Hybrid products count as both web and mobile.
  return items.filter(
    (p) => p.kind === kind || (p.kind === "hybrid" && (kind === "web" || kind === "mobile")),
  );
}

export function getCompanyProjects(company: CompanyId): Project[] {
  return allProjects.filter((p) => p.company === company);
}

/* ---------- Experience ---------- */

export function getExperience(): readonly Company[] {
  return allCompanies;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-06" → "Jun 2025". No Date objects, so output is identical on server and client. */
export function formatYearMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** { start: "2025-06", end: null } → "Jun 2025 – Present" */
export function formatPeriod(period: Period): string {
  return `${formatYearMonth(period.start)} – ${period.end ? formatYearMonth(period.end) : "Present"}`;
}

/* ---------- Skills ---------- */

export function getSkillGroups(lens: Lens): (SkillGroup & { highlighted: boolean })[] {
  return sortByLens(allSkillGroups, lens).map((g) => ({
    ...g,
    highlighted: g.lens.includes(lens),
  }));
}

export function getSkill(name: string): Skill | undefined {
  for (const group of allSkillGroups) {
    const skill = group.items.find((s) => s.name === name);
    if (skill) return skill;
  }
  return undefined;
}

/* ---------- Diagrams ---------- */

export function getDiagram(id: string): Diagram | undefined {
  return allDiagrams.find((d) => d.id === id);
}
