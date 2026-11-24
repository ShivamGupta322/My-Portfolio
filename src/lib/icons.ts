import "server-only";
import * as simpleIcons from "simple-icons";

/**
 * Server-only lookup from a simple-icons slug to its SVG path. Resolving here
 * keeps the full icon set (several MB) out of client bundles; components get
 * just the path strings they need.
 */
const bySlug = new Map<string, string>(
  Object.values(simpleIcons as Record<string, unknown>)
    .filter(
      (v): v is { slug: string; path: string } =>
        typeof v === "object" && v !== null && "slug" in v && "path" in v,
    )
    .map((v) => [v.slug, v.path]),
);

export function iconPath(slug: string | undefined | null): string | null {
  return slug ? (bySlug.get(slug) ?? null) : null;
}
