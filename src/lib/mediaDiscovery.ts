import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ProjectMedia } from "../types/content";

/**
 * Drop-in project images. Put files in public/projects/<slug>/ named:
 *
 *   phone-1.png … phone-N.png   phone screenshots, one per highlight, in order
 *   desktop-1.png … desktop-N   single-screen desktop screenshots, one per highlight
 *   desktop.png                 a tall full-page desktop capture (scrolls inside the frame)
 *   cover.png                   optional 16:10 image for cards and the case-study hero
 *   gallery-1.png …             optional extra screenshots for the case-study page
 *
 * Any of .webp .avif .png .jpg .jpeg works. Paths set explicitly in
 * src/content/projects.ts (media: {...}) win over discovered files.
 * Used by the site (lib/views.ts) and by `npm run check:content`.
 * See docs/SETUP_MEDIA_AND_EMAIL.md.
 */

export const MEDIA_EXTENSIONS = ["webp", "avif", "png", "jpg", "jpeg"] as const;
const EXT = MEDIA_EXTENSIONS.join("|");
const PHONE = new RegExp(`^phone-(\\d+)\\.(${EXT})$`, "i");
const GALLERY = new RegExp(`^gallery-(\\d+)\\.(${EXT})$`, "i");
const DESKTOP_N = new RegExp(`^desktop-(\\d+)\\.(${EXT})$`, "i");
const SINGLE = (name: string) => new RegExp(`^${name}\\.(${EXT})$`, "i");

export interface DiscoveredMedia extends ProjectMedia {
  gallery?: string[];
  /** Files in the folder that don't follow the naming scheme (reported by check:content). */
  ignored: string[];
}

function numbered(files: string[], pattern: RegExp, base: string): string[] {
  return files
    .map((f) => ({ f, m: f.match(pattern) }))
    .filter((x): x is { f: string; m: RegExpMatchArray } => x.m !== null)
    .sort((a, b) => Number(a.m[1]) - Number(b.m[1]))
    .map((x) => `${base}/${x.f}`);
}

export function discoverMedia(
  slug: string,
  publicDir = join(process.cwd(), "public"),
): DiscoveredMedia {
  const dir = join(publicDir, "projects", slug);
  if (!existsSync(dir)) return { ignored: [] };
  const files = readdirSync(dir).filter((f) => !f.startsWith("."));
  const base = `/projects/${slug}`;
  const one = (name: string) => {
    const f = files.find((x) => SINGLE(name).test(x));
    return f ? `${base}/${f}` : undefined;
  };

  const phoneScreens = numbered(files, PHONE, base);
  const desktopScreens = numbered(files, DESKTOP_N, base);
  const gallery = numbered(files, GALLERY, base);
  const known = (f: string) =>
    PHONE.test(f) ||
    GALLERY.test(f) ||
    DESKTOP_N.test(f) ||
    SINGLE("desktop").test(f) ||
    SINGLE("cover").test(f);

  return {
    phoneScreens: phoneScreens.length ? phoneScreens : undefined,
    desktopFull: one("desktop"),
    desktopScreens: desktopScreens.length ? desktopScreens : undefined,
    cover: one("cover"),
    gallery: gallery.length ? gallery : undefined,
    ignored: files.filter((f) => !known(f) && !/\.(md|txt)$/i.test(f)),
  };
}

/** Explicit content media first, discovered files fill the gaps. */
export function mergeMedia(
  explicit: ProjectMedia,
  found: DiscoveredMedia,
): ProjectMedia & { gallery?: string[] } {
  return {
    cover: explicit.cover ?? found.cover,
    phoneScreens: explicit.phoneScreens ?? found.phoneScreens,
    desktopFull: explicit.desktopFull ?? found.desktopFull,
    desktopScreens: explicit.desktopScreens ?? found.desktopScreens,
    panels: explicit.panels,
    clips: explicit.clips,
    gallery: explicit.gallery ?? found.gallery,
  };
}
