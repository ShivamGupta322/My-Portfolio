import type { ComponentType } from "react";

/**
 * Long-form write-ups (MDX) keyed by project slug. Projects without an entry
 * still get a case-study page built from their structured content; the
 * "The story" section simply doesn't render.
 *
 * To add one: create src/content/case-studies/<slug>.mdx and register it here.
 */
const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  "order-processing-system": () => import("@/content/case-studies/order-processing-system.mdx"),
};

export async function loadCaseStudy(slug: string): Promise<ComponentType | null> {
  const load = loaders[slug];
  return load ? (await load()).default : null;
}

export function hasCaseStudy(slug: string): boolean {
  return slug in loaders;
}
