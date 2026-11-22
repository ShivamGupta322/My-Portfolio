/**
 * Content model for the portfolio. All content lives in src/content/*.ts and is
 * validated by `npm run check:content` (scripts/check-content.ts).
 * See docs/ARCHITECTURE.md §4.
 */

/** The two ways to read the portfolio: shipped web/mobile products, or backend systems. */
export type Lens = "product" | "systems";

/** Selects the showcase stage (docs/MOTION_AND_SHOWCASE.md §6). */
export type ProjectKind = "mobile" | "web" | "hybrid" | "backend";

/**
 * live        public product you can open right now
 * shipped     released (on an app store, or code published) but not a hosted website
 * internal    company system without a public URL: shown as diagram + metrics
 * in-progress being built
 */
export type ProjectStatus = "live" | "shipped" | "internal" | "in-progress";

export type CompanyId = "scramble-apps" | "shivsys";

/** ISO year-month, e.g. "2025-06". */
export type YearMonth = `${number}-${number}`;

export interface Period {
  start: YearMonth;
  /** null = present */
  end: YearMonth | null;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Highlight {
  title: string;
  body: string;
  /** For PhoneStage/BrowserStage: index of the screen this callout points at. */
  screen?: number;
}

export interface ProjectLinks {
  live?: string;
  playStore?: string;
  appStore?: string;
  github?: string;
}

export interface ProjectMedia {
  cover?: string;
  phoneScreens?: string[];
  /** Long full-page capture scrolled inside the BrowserMockup. */
  desktopFull?: string;
  /** Secondary panels (admin, calendar…) fanned out in BrowserStage. */
  panels?: string[];
  clips?: string[];
}

export interface Project {
  slug: string;
  title: string;
  /** One-line outcome shown on cards. */
  tagline: string;
  /** Short paragraph for case-study intros and stage headers. */
  summary: string;
  kind: ProjectKind;
  lens: readonly Lens[];
  status: ProjectStatus;
  company: CompanyId | "personal";
  period?: Period;
  role?: string;
  /** Skill names; must exist in skills.ts so icons resolve. */
  stack: readonly string[];
  highlights: readonly Highlight[];
  metrics?: readonly Metric[];
  links: ProjectLinks;
  media: ProjectMedia;
  /** id of a diagram in src/content/diagrams. */
  architecture?: string;
  /** Position in each lens's featured stages (1 = first). Omit = grid only. */
  featured?: Partial<Record<Lens, number>>;
  /** Write-up exists at src/content/case-studies/<slug>.mdx (Phase 7). */
  caseStudy?: boolean;
}

export interface ArchiveProject {
  slug: string;
  title: string;
  description: string;
  stack: readonly string[];
  href: string;
  image: string;
}

export interface Role {
  title: string;
  period: Period;
  summary: string;
  productSlugs: readonly string[];
}

export interface Company {
  id: CompanyId;
  name: string;
  location: string;
  roles: readonly Role[];
}

export interface Skill {
  name: string;
  /** simple-icons slug (validated against the installed package). */
  icon?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  lens: readonly Lens[];
  items: readonly Skill[];
}

export interface Achievement {
  id: string;
  title: string;
  value: string;
  description: string;
  links?: readonly { label: string; href: string }[];
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  university: string;
  grade: string;
  period: { start: number; end: number };
}

export interface Social {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  initials: string;
  role: string;
  location: string;
  email: string;
  /** Kept out of the public site by default. */
  showPhone: false;
  socials: readonly Social[];
  resume: Record<Lens, { label: string; href: string }>;
  /** Hero copy and stats change with the lens. */
  lens: Record<
    Lens,
    {
      label: string;
      headline: string;
      tagline: string;
      summary: string;
      roles: readonly string[];
      stats: readonly Metric[];
    }
  >;
}

/* ---------- System diagrams (SystemStage, Phase 6) ---------- */

export type DiagramNodeGroup =
  "client" | "service" | "supervisor" | "queue" | "store" | "infra" | "external";

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  /** simple-icons slug */
  icon?: string;
  group: DiagramNodeGroup;
  /** Desktop position on a 12 × 8 grid (column, row). Mobile stacks nodes in array order. */
  x: number;
  y: number;
  /** "What it does and why", shown on hover/focus. */
  tooltip: string;
}

/** happy = main flow · retry = backoff loop · dlq = dead-letter path · async = side effect/telemetry */
export type DiagramEdgeKind = "happy" | "retry" | "dlq" | "async";

export interface DiagramEdge {
  from: string;
  to: string;
  kind: DiagramEdgeKind;
  label?: string;
}

export interface Diagram {
  id: string;
  title: string;
  /** Plain-text description of the flow (screen readers + mobile fallback). */
  description: string;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  /** Lines typed out by the TerminalPanel after the diagram plays. */
  terminal?: readonly { command: string; output: string }[];
}
