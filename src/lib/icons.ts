import "server-only";
import * as simpleIcons from "simple-icons";

/**
 * Server-only lookup from a simple-icons slug to its SVG path. Resolving here
 * keeps the full icon set (several MB) out of client bundles; components get
 * just the path strings they need.
 */
const icons = Object.values(simpleIcons as Record<string, unknown>).filter(
  (v): v is { slug: string; path: string; hex: string } =>
    typeof v === "object" && v !== null && "slug" in v && "path" in v && "hex" in v,
);
const bySlug = new Map<string, string>(icons.map((v) => [v.slug, v.path]));
const hexBySlug = new Map<string, string>(icons.map((v) => [v.slug, v.hex]));

export function iconPath(slug: string | undefined | null): string | null {
  return slug ? (bySlug.get(slug) ?? null) : null;
}

/** Relative luminance of a #rrggbb colour (WCAG). */
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Brand colour for a logo, or null when it wouldn't read on the dark surface
 * (#1a1b26, contrast under 3:1: Next.js, Express, GitHub…) so callers fall back to the text colour.
 */
export function iconColor(slug: string | undefined | null): string | null {
  const hex = slug ? hexBySlug.get(slug) : undefined;
  if (!hex) return null;
  const surface = luminance("1a1b26");
  const contrast = (luminance(hex) + 0.05) / (surface + 0.05);
  return contrast >= 3 ? `#${hex}` : null;
}
