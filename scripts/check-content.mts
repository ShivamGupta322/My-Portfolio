/**
 * Content integrity + link checker.
 *
 *   npm run check:content          structure, cross-references, icons, local assets
 *   npm run check:links            …plus a live request to every external URL
 *
 * Runs with Node's built-in TypeScript type stripping (Node ≥ 23.6), no build step.
 * Exits 1 on errors; missing user-supplied assets are reported as warnings.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import * as simpleIcons from "simple-icons";
import { achievements } from "../src/content/achievements.ts";
import { diagrams } from "../src/content/diagrams.ts";
import { experience } from "../src/content/experience.ts";
import { profile } from "../src/content/profile.ts";
import { archive, projects } from "../src/content/projects.ts";
import { skillGroups } from "../src/content/skills.ts";
import { discoverMedia } from "../src/lib/mediaDiscovery.ts";
import type { Project } from "../src/types/content.ts";

const checkLinks = process.argv.includes("--links");
const errors: string[] = [];
const warnings: string[] = [];
const error = (msg: string) => errors.push(msg);
const warn = (msg: string) => warnings.push(msg);

const GRID = { cols: 12, rows: 8 };
const publicDir = join(import.meta.dirname, "..", "public");

/* ---------- lookups ---------- */
const iconSlugs = new Set(
  Object.values(simpleIcons as Record<string, unknown>)
    .filter((v): v is { slug: string } => typeof v === "object" && v !== null && "slug" in v)
    .map((v) => v.slug),
);
const skillNames = new Set<string>(skillGroups.flatMap((g) => g.items.map((s) => s.name)));
const projectSlugs = new Set<string>(projects.map((p) => p.slug));
const diagramIds = new Set<string>(diagrams.map((d) => d.id));

function duplicates(values: readonly string[]) {
  return [...new Set(values.filter((v, i) => values.indexOf(v) !== i))];
}

/* ---------- uniqueness ---------- */
for (const d of duplicates([...projects.map((p) => p.slug), ...archive.map((a) => a.slug)]))
  error(`duplicate project slug "${d}"`);
for (const d of duplicates(diagrams.map((d) => d.id))) error(`duplicate diagram id "${d}"`);
for (const d of duplicates(skillGroups.map((g) => g.id))) error(`duplicate skill group id "${d}"`);
for (const d of duplicates(skillGroups.flatMap((g) => g.items.map((s) => s.name))))
  error(`skill "${d}" appears in more than one group`);

/* ---------- projects ---------- */
for (const p of projects as readonly Project[]) {
  for (const tech of p.stack)
    if (!skillNames.has(tech)) error(`${p.slug}: stack "${tech}" is not in skills.ts`);
  if ("architecture" in p && p.architecture && !diagramIds.has(p.architecture))
    error(`${p.slug}: architecture "${p.architecture}" has no diagram`);
  if (p.highlights.length === 0) error(`${p.slug}: needs at least one highlight`);
  if (p.status === "internal" && Object.keys(p.links).length > 0)
    warn(`${p.slug}: internal project has public links. Is that intended?`);
  if ((p.status === "live" || p.status === "shipped") && Object.keys(p.links).length === 0)
    error(`${p.slug}: ${p.status} project needs at least one link`);
  if (
    p.company !== "personal" &&
    !experience.some((c) =>
      c.roles.some((r) => (r.productSlugs as readonly string[]).includes(p.slug)),
    )
  )
    error(`${p.slug}: company project is not listed under any role in experience.ts`);
}

for (const lens of ["product", "systems"] as const) {
  const positions = projects
    .map((p) =>
      "featured" in p ? (p.featured as Partial<Record<string, number>>)[lens] : undefined,
    )
    .filter((n): n is number => n !== undefined)
    .sort((a, b) => a - b);
  positions.forEach((n, i) => {
    if (n !== i + 1)
      error(
        `featured.${lens}: positions must be 1..${positions.length} with no gaps/duplicates (got ${positions.join(", ")})`,
      );
  });
  const featuredWrongLens = projects.filter(
    (p) =>
      "featured" in p &&
      (p.featured as Partial<Record<string, number>>)[lens] !== undefined &&
      !(p.lens as readonly string[]).includes(lens),
  );
  for (const p of featuredWrongLens)
    error(`${p.slug}: featured in "${lens}" but not tagged with that lens`);
}

for (const a of archive)
  for (const tech of a.stack)
    if (!skillNames.has(tech)) error(`archive/${a.slug}: stack "${tech}" is not in skills.ts`);

/* ---------- experience ---------- */
for (const company of experience)
  for (const role of company.roles) {
    for (const slug of role.productSlugs)
      if (!projectSlugs.has(slug)) error(`experience/${company.id}: unknown product "${slug}"`);
    if (role.period.end && role.period.end < role.period.start)
      error(`experience/${company.id}: period ends before it starts`);
  }

/* ---------- skills & icons ---------- */
for (const g of skillGroups)
  for (const s of g.items)
    if ("icon" in s && s.icon && !iconSlugs.has(s.icon))
      error(`skills/${g.id}: "${s.name}" icon "${s.icon}" not in simple-icons`);

/* ---------- diagrams ---------- */
for (const d of diagrams) {
  const ids = d.nodes.map((n) => n.id);
  for (const dup of duplicates(ids)) error(`diagram/${d.id}: duplicate node "${dup}"`);
  for (const n of d.nodes) {
    if (n.x < 0 || n.x >= GRID.cols || n.y < 0 || n.y >= GRID.rows)
      error(`diagram/${d.id}: node "${n.id}" is off the 12×8 grid`);
    if ("icon" in n && n.icon && !iconSlugs.has(n.icon))
      error(`diagram/${d.id}: node "${n.id}" icon "${n.icon}" not in simple-icons`);
  }
  const overlap = duplicates(d.nodes.map((n) => `${n.x},${n.y}`));
  for (const o of overlap) error(`diagram/${d.id}: two nodes share grid cell ${o}`);
  for (const e of d.edges) {
    if (!ids.includes(e.from)) error(`diagram/${d.id}: edge from unknown node "${e.from}"`);
    if (!ids.includes(e.to)) error(`diagram/${d.id}: edge to unknown node "${e.to}"`);
  }
  const connected = new Set(d.edges.flatMap((e) => [e.from, e.to]));
  for (const n of d.nodes)
    if (!connected.has(n.id)) warn(`diagram/${d.id}: node "${n.id}" has no edges`);
}

/* ---------- local assets ---------- */
const localAssets: { owner: string; path: string; userSupplied?: boolean }[] = [
  ...archive.map((a) => ({ owner: `archive/${a.slug}`, path: a.image })),
  ...projects.flatMap((p) => {
    const m = p.media as Record<string, string | string[] | undefined>;
    return Object.values(m)
      .flat()
      .filter((v): v is string => typeof v === "string")
      .map((path) => ({ owner: `${p.slug}.media`, path }));
  }),
];
for (const asset of localAssets) {
  if (existsSync(join(publicDir, asset.path))) continue;
  (asset.userSupplied ? warn : error)(`${asset.owner}: missing public${asset.path}`);
}

/* ---------- external links ---------- */
const externalLinks = [
  ...profile.socials.map((s) => ({ owner: `social/${s.label}`, url: s.href })),
  ...Object.entries(profile.resume).map(([lens, r]) => ({ owner: `resume/${lens}`, url: r.href })),
  ...projects.flatMap((p) =>
    Object.entries(p.links).map(([k, url]) => ({ owner: `${p.slug}.${k}`, url: url as string })),
  ),
  ...archive.map((a) => ({ owner: `archive/${a.slug}`, url: a.href })),
  ...achievements.flatMap((a) =>
    ("links" in a ? a.links : []).map((l) => ({ owner: `achievement/${a.id}`, url: l.href })),
  ),
];
for (const l of externalLinks)
  if (!/^https:\/\//.test(l.url)) error(`${l.owner}: link must be https (${l.url})`);

async function probe(url: string): Promise<number | string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; portfolio-link-check/1.0)",
        accept: "text/html,*/*",
      },
    });
    await res.body?.cancel();
    return res.status;
  } catch (e) {
    return e instanceof Error ? e.name : "error";
  } finally {
    clearTimeout(timer);
  }
}

if (checkLinks) {
  const unique = [...new Map(externalLinks.map((l) => [l.url, l])).values()];
  console.log(`Checking ${unique.length} external links…`);
  const results = await Promise.all(
    unique.map(async (l) => ({ ...l, status: await probe(l.url) })),
  );
  for (const r of results) {
    const ok = typeof r.status === "number" && r.status < 400;
    // Some sites refuse automated requests (LinkedIn answers 999, others 403/429): verify those by hand.
    const blocked = r.status === 999 || r.status === 403 || r.status === 429;
    console.log(
      `  ${ok ? "ok " : blocked || typeof r.status === "string" ? "?? " : "ERR"} ${String(r.status).padEnd(5)} ${r.url}`,
    );
    // Network-level failures (DNS, TLS, timeout) may be local to this machine.
    const unreachable = typeof r.status === "string";
    if (blocked)
      warn(`${r.owner}: ${r.url} refused automated check (${r.status}); verify manually`);
    else if (unreachable)
      warn(`${r.owner}: ${r.url} could not connect (${r.status}); check it's up`);
    else if (!ok) error(`${r.owner}: ${r.url} → HTTP ${r.status}`);
  }
}

/* ---------- project images (public/projects/<slug>/) ---------- */
const mediaRows: string[] = [];
let withoutImages = 0;
for (const p of projects as readonly Project[]) {
  const m = discoverMedia(p.slug, publicDir);
  const explicit = p.media;
  const phones = (explicit.phoneScreens ?? m.phoneScreens ?? []).length;
  const desktopScreens = (explicit.desktopScreens ?? m.desktopScreens ?? []).length;
  const desktop = desktopScreens > 0 || Boolean(explicit.desktopFull ?? m.desktopFull);
  const cover = Boolean(explicit.cover ?? m.cover);
  const gallery = (explicit.gallery ?? m.gallery ?? []).length;
  for (const f of m.ignored)
    warn(
      `${p.slug}: public/projects/${p.slug}/${f} doesn't match phone-N / desktop-N / desktop / cover / gallery-N, so it isn't used`,
    );
  // A mobile app's cover stands in for phone screens; a hybrid needs either device's screens.
  const missing = [
    p.kind === "mobile" && phones === 0 && !cover && "phone-N",
    p.kind === "web" && !desktop && "desktop-N",
    p.kind === "hybrid" && phones === 0 && !desktop && "phone-N or desktop-N",
  ].filter(Boolean);
  if (missing.length) withoutImages++;
  mediaRows.push(
    `  ${p.slug.padEnd(30)} phone:${String(phones).padStart(2)}  desktop:${desktopScreens ? String(desktopScreens).padStart(3) : desktop ? "yes" : " - "}  cover:${cover ? "yes" : " - "}  gallery:${String(gallery).padStart(2)}${missing.length ? `   (UI preview until: ${missing.join(", ")})` : ""}`,
  );
}

/* ---------- report ---------- */
console.log(
  `\nContent: ${projects.length} projects, ${archive.length} archive, ${experience.length} companies, ` +
    `${skillGroups.length} skill groups (${skillNames.size} skills), ${diagrams.length} diagrams.`,
);
console.log(`
Project images (public/projects/<slug>/), ${withoutImages} project(s) still showing UI previews:`);
for (const row of mediaRows) console.log(row);
console.log("");
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);
console.log(errors.length ? `\n✗ ${errors.length} error(s)` : "\n✓ content checks passed");
process.exit(errors.length ? 1 : 0);
