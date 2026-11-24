# Architecture

> Technical blueprint for **devshivam.online**: stack, structure, data model, rendering, animation plumbing, quality budgets and build phases.
> Visual rules are in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md). The animation playbook is in [MOTION_AND_SHOWCASE.md](./MOTION_AND_SHOWCASE.md).

---

## 1. Goals & constraints

| Goal | Implication |
|---|---|
| Recruiters reach shipped work and the resume within one scroll | Content-first sections, fast LCP, resume links in the hero and nav |
| Show two profiles (Full-stack/Mobile and Erlang/OTP) without two sites | **Lens** state that re-orders content. All content is tagged by lens. |
| Rich motion (parallax, pinned stages, glass) **and** Lighthouse ≥ 90 on mobile | Server Components by default, small client islands, lazy WebGL, motion gated by device and preference |
| Easy to update after every new job or project | All content in typed files under `src/content/`. No CMS needed. |
| Good link previews when shared on LinkedIn/WhatsApp | Per-page metadata and generated OG images |

---

## 2. Tech stack

Versions are the latest stable releases as of Nov 2026. Install with `@latest` at scaffold time.

| Concern | Choice | Version | Why |
|---|---|---|---|
| Framework | **Next.js** (App Router, Turbopack) | 16.x | SSG/ISR, `generateMetadata`, `next/og` OG images, `next/image`, `next/font`, Server Actions. It beats a Vite SPA on SEO and shareable case-study URLs. |
| UI runtime | **React** | 19.x | Server Components, `useActionState` for the contact form |
| Language | **TypeScript** (strict) | 5.x | Typed content model catches broken links and missing fields at build time |
| Styling | **Tailwind CSS v4** | 4.x | CSS-first `@theme` tokens map 1:1 to the design system. Includes `@tailwindcss/typography` for MDX. |
| Theme | Inline `<head>` script + `data-theme` on `<html>` | — | Next 16 docs pattern (guides/preventing-flash-before-hydration): no flash, no extra dependency. `ThemeToggle` syncs via `useSyncExternalStore`. |
| Scroll engine | **Lenis** | 1.3.x | Smooth inertial scroll synced to the GSAP ticker |
| Scroll animation | **GSAP** + **ScrollTrigger**, **SplitText**, **MotionPathPlugin**, `@gsap/react` | 3.15.x / 2.1.x | Industry standard for pinned and scrubbed timelines. All plugins are now free. |
| Component animation | **Motion** (`motion/react`) | 14.x | Layout/FLIP, shared elements, gestures, `AnimatePresence` |
| WebGL | **OGL** | 1.x | Tiny WebGL lib for the single hero aurora shader (much lighter than three.js) |
| Icons | **lucide-react**, **simple-icons** | latest | UI icons and official tech/brand logos |
| Case studies | **MDX** via `@next/mdx` | 16.x | Long-form project write-ups with embedded React stages |
| Validation | **zod** | 4.x | Contact form schema (shared client and server) |
| Email | **Resend** | 6.x | Contact form delivery from a Server Action |
| Utilities | `clsx` + `tailwind-merge` (`cn()`), `class-variance-authority` | | Component variants |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` | | Privacy-friendly, Core Web Vitals in production |
| Quality | ESLint (next config), Prettier + `prettier-plugin-tailwindcss`, Playwright + `@axe-core/playwright`, Lighthouse CI | | See §9 |
| Hosting | **Vercel** | | Edge CDN, preview deploys per PR, custom domain `devshivam.online` |

Runtime: Node 24 LTS (local is v24.19.0), npm 11.

---

## 3. Folder structure

```
portfolio-new/
├─ .claude/skills/ui-ux-pro-max/        # design-intelligence skill (already installed)
├─ design-system/shivam-gupta-portfolio/
│  ├─ MASTER.md                         # skill-readable design rules (Midnight Aurora)
│  └─ pages/                            # per-section overrides (e.g. hero.md, projects.md)
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ DESIGN_SYSTEM.md
│  └─ MOTION_AND_SHOWCASE.md
├─ public/
│  ├─ projects/<slug>/                  # cover.avif, screens/*.avif, full-page.avif, clips/*.mp4
│  ├─ archive/                          # old college-project screenshots
│  ├─ devices/                          # store badges, optional device textures
│  └─ textures/noise.png
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                     # fonts, ThemeProvider, LensProvider, SmoothScroll, Nav, Footer
│  │  ├─ page.tsx                       # home: composes section components
│  │  ├─ template.tsx                   # route transition wrapper (AnimatePresence)
│  │  ├─ globals.css                    # Tailwind v4 @theme tokens, glass/neu utilities
│  │  ├─ opengraph-image.tsx            # site OG image (next/og)
│  │  ├─ projects/
│  │  │  └─ [slug]/
│  │  │     ├─ page.tsx                 # case study (generateStaticParams + generateMetadata)
│  │  │     └─ opengraph-image.tsx      # per-project OG image
│  │  ├─ actions/contact.ts             # 'use server' Resend action
│  │  ├─ sitemap.ts · robots.ts · manifest.ts
│  │  └─ not-found.tsx
│  ├─ components/
│  │  ├─ layout/        Nav, MobileMenu, Footer, ScrollProgress, Cursor, Preloader
│  │  ├─ sections/      Hero, About, Experience, FeaturedProjects, ProjectGrid, Archive,
│  │  │                 Skills, Achievements, Contact
│  │  ├─ showcase/      PhoneMockup, BrowserMockup, TerminalPanel, SystemDiagram,
│  │  │                 PhoneStage, BrowserStage, DeviceDuoStage, SystemStage, ProjectCard
│  │  ├─ motion/        Reveal, SplitReveal, Parallax, Magnetic, TiltCard, Marquee,
│  │  │                 CountUp, AuroraCanvas (dynamic, ssr:false)
│  │  └─ ui/            Button, Badge, TechChip, SectionHeading, GlassCard, LensToggle,
│  │                    ThemeToggle, FilterChips, Lightbox, Toast
│  ├─ content/
│  │  ├─ profile.ts     # name, roles, taglines per lens, socials, resume links
│  │  ├─ experience.ts  # companies → roles → products
│  │  ├─ projects.ts    # all projects (typed), featured order per lens
│  │  ├─ skills.ts      # grouped skills with lens tags + simple-icons slugs
│  │  ├─ achievements.ts# DSA, scholarship, education
│  │  ├─ site.ts        # nav sections + shell content (derived from profile.ts)
│  │  ├─ diagrams.ts    # node/edge data for every system diagram
│  │  └─ case-studies/  # <slug>.mdx long-form write-ups (registered in lib/caseStudies.ts)
│  ├─ providers/        SmoothScrollProvider
│  ├─ hooks/            useLens, useReducedMotionPref, useIsTouch, useMediaQuery, useSectionInView
│  ├─ lib/              gsap.ts, motion.ts (tokens), cn.ts, content.ts (server read API), projectView.ts (client-safe view models), icons.ts (server-only brand icons), lens.ts, intro.ts
│  └─ types/            content.ts (shared content types)
├─ scripts/             check-content.mts (integrity + link checker, runs on Node type stripping)
├─ tests/               e2e/*.spec.ts (Playwright + axe)
├─ .github/workflows/ci.yml             # lint, typecheck, build, e2e, Lighthouse CI
├─ next.config.ts · tsconfig.json · eslint.config.mjs · .prettierrc · .env.example
└─ README.md
```

**Conventions:** components are PascalCase files with one component per file. `'use client'` is only added at the leaf that needs it. Section components are Server Components that render client motion wrappers around server-rendered markup.

---

## 4. Content model (`src/types/content.ts`)

```ts
export type Lens = 'product' | 'systems';
export type ProjectKind = 'mobile' | 'web' | 'hybrid' | 'backend';
export type ProjectStatus = 'live' | 'shipped' | 'in-progress' | 'archived';

export interface Project {
  slug: string;                       // 'fitizen', 'vela-meet', 'order-processing-system'
  title: string;
  tagline: string;                    // one-line outcome
  kind: ProjectKind;                  // selects the showcase stage
  lens: Lens[];                       // which lens(es) it belongs to
  status: ProjectStatus;
  company?: 'scramble-apps' | 'shivsys' | 'personal';
  period?: string;                    // 'Jun 2025 – Present'
  role?: string;
  stack: string[];                    // keys into skills.ts for icons
  highlights: { title: string; body: string; screen?: number }[]; // callouts; screen = index for PhoneStage
  metrics?: { value: string; label: string }[];                   // '10K+', 'downloads'
  links: {
    live?: string; playStore?: string; appStore?: string;
    github?: string; caseStudy?: boolean;
  };
  media: {
    cover: string;
    phoneScreens?: string[];
    desktopFull?: string;             // long capture for in-browser scroll
    desktopScreens?: string[];        // desktop-N: one viewport screenshot per highlight
    panels?: string[];                // admin/secondary panels for BrowserStage
    clips?: string[];
  };
  architecture?: string;              // id in content/diagrams
  featured?: { product?: number; systems?: number };  // order per lens
}
```

`experience.ts` has `Company { id, name, location, roles: { title, period, productSlugs[] }[] }`. `skills.ts` has `SkillGroup { id, title, lens: Lens[], items: { name, icon?: SimpleIconSlug }[] }`. Diagrams are `{ nodes: { id, label, icon?, x, y, group, tooltip }[], edges: { from, to, kind: 'happy' | 'retry' | 'dlq' }[], layouts: { desktop, mobile } }`.

### Seed content (from both resumes)

| slug | kind | lens | links |
|---|---|---|---|
| `fitizen` | hybrid | product (+systems via chat architecture) | Play `com.FitNation` · App Store `id6449091598` · fitnation.com |
| `vela-meet` | hybrid | product, systems | velaconference.com |
| `wingtrill` | hybrid | product, systems | wingtrill.com |
| `fitexgo` | mobile | product | Play `com.fitexgo` · App Store `id6446050793` |
| `order-processing-system` | backend | systems | (private, diagram + metrics) |
| `voip-telephony` | backend | systems | (private, diagram) |
| `groceries` | web | product | (internship project, no public link) |
| `nearby` | backend (web client) | systems, product | in progress |
| `molbhaav` | mobile | product | Play `com.molbhaav` · github.com/ShivamGupta322/MolBhaav |
| `social-media-post-scheduler` | web | product | social-media-post-scheduler-eta.vercel.app · GitHub |
| archive × 5 | web | — | Text-to-Speech, Weather App, Tic-Tac-Toe repos, etc. (the grocery app lives on as Groceries) |

Profile links: `devshivam.online`, `github.com/ShivamGupta322`, `linkedin.com/in/shivam-gupta-sg322`, `leetcode.com/u/Shivam_Gupta322`, `geeksforgeeks.org/user/guptashivamsg02`. The phone number is kept out of the public site (`profile.showPhone = false`).

---

## 5. Rendering strategy

- **Everything is statically generated** at build time. The home page and `/projects/[slug]` use `generateStaticParams`. There's no runtime data fetching, so pages are served from the CDN.
- **Server Components by default.** Client islands are limited to motion wrappers, providers, Nav, Cursor, LensToggle, ThemeToggle, FilterChips, ContactForm and AuroraCanvas.
- **Lens and SSR:** the server renders the **product** order by default (best for most visitors and crawlers). `?lens=systems` is read in a client provider, which re-orders on hydration behind a short fade to avoid flicker. Both orders exist in the HTML for SEO, since only the order changes.
- **Images:** `next/image` with AVIF/WebP, explicit sizes, `placeholder="blur"`, and `priority` only on the hero portrait (the LCP element).
- **Fonts:** `next/font/google` self-hosts Space Grotesk, DM Sans and JetBrains Mono with `display: swap` and subset `latin`.
- **WebGL:** `const AuroraCanvas = dynamic(() => import('./AuroraCanvas'), { ssr: false })`. It's mounted after first paint plus idle, skipped when `prefers-reduced-motion`, `navigator.connection.saveData`, or `deviceMemory < 4`, and falls back to CSS gradients.

---

## 6. Animation architecture

```
<SmoothScrollProvider>                 // Lenis instance, driven by gsap.ticker; exposes lenis via context
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP)   // once, in lib/gsap.ts
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)
```

- **Section pattern:**
  ```tsx
  'use client';
  export function PhoneStage({ project }: { project: Project }) {
    const root = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
               mobile:  '(max-width: 1023px) and (prefers-reduced-motion: no-preference)' },
        ({ conditions }) => { conditions?.desktop ? buildPinnedTimeline() : buildEnterTimeline(); });
    }, { scope: root });
    return <section ref={root}>…</section>;
  }
  ```
- **Motion** handles state and pointer animations (`whileHover`, `layout`, `layoutId`). There's no overlap with GSAP on the same element and property.
- **Tokens** come from `lib/motion.ts` (durations, eases, springs) and are shared by GSAP and Motion.
- **Refresh points:** after `document.fonts.ready`, after the lens reorders, and after case-study images decode.
- **Anchor navigation** uses `lenis.scrollTo(target, { offset: -80 })`, which accounts for the floating nav.

---

## 7. State & providers

| State | Where | Persistence |
|---|---|---|
| Theme | `data-theme` on `<html>`, set pre-paint by `lib/theme.ts` script | `localStorage` |
| Lens | `hooks/useLens.ts`: tiny external store read with `useSyncExternalStore` (no provider); constants in `lib/lens.ts` so client code never imports all content | `localStorage` + `?lens=` URL param |
| Active section | `useSectionInView` (IntersectionObserver) → Nav pill | — |
| Preloader seen | `sessionStorage` | per session |
| Contact form | `useActionState` + Server Action | — |

There's no global store library, because the app has very little state.

---

## 8. Contact flow

1. `ContactForm` (client) validates with the shared zod schema and includes a hidden honeypot field.
2. The `actions/contact.ts` Server Action validates (zod, server-side only, so zod never ships to the browser), checks the honeypot and a minimum time-on-form, then sends with Resend to the owner's inbox. `replyTo` is set to the visitor.
3. It returns `{ ok | fieldErrors }`, and the button morphs to the success or error state.
4. Fallback: if `RESEND_API_KEY` or `CONTACT_TO_EMAIL` is missing, or Resend rejects the send, the visitor gets a `mailto:` link prefilled with their message.

`.env.example`:
```
RESEND_API_KEY=
CONTACT_TO_EMAIL=
NEXT_PUBLIC_SITE_URL=https://www.devshivam.online
```

---

## 9. Quality budgets & checks

| Metric | Budget |
|---|---|
| Lighthouse (mobile) Performance / A11y / Best Practices / SEO | ≥ 90 / ≥ 95 / ≥ 95 / 100. Phase 9 local: 40–52 / 100 / 100 / 100. The remaining performance gap is hydration time (React rendering ~1,600 elements on a 4×-throttled slow CPU); closing it means moving stage copy to Server Components with smaller client islands |
| LCP | < 2.5 s (4G, mid-range Android) |
| CLS | < 0.05 |
| INP | < 200 ms |
| Initial JS (home, gzip) | ≤ 300 KB. Measured in Phase 6: 294 KB for modern browsers (plus a 39 KB `nomodule` polyfill only legacy browsers fetch). Phase 4 baseline: ~281 KB = React/Next ~115 + GSAP/ScrollTrigger/SplitText/Lenis/Motion ~102 + app ~64. OGL aurora (14 KB) is lazy. The original 180 KB target isn't reachable with both GSAP and Motion; Phase 9 will try lazy-loading SplitText/preloader and trimming Motion. |
| Hero media | Portrait < 120 KB AVIF |
| Per-project media | Screens < 150 KB each, clips < 1.5 MB |

**Accessibility:** semantic landmarks, one `h1` per page, skip-to-content link, visible focus, keyboard-operable toggles (lens and theme are `role="switch"` with `aria-checked`), alt text for every screen, captions/`aria-label` on diagrams plus a text list alternative, colour never the sole signal, touch targets of at least 44px.

**SEO:** `metadata` + `generateMetadata`, canonical URLs, JSON-LD `Person` (home) and `CreativeWork`/`SoftwareApplication` (projects), `sitemap.ts`, `robots.ts`, OG images per page.

**CI (`.github/workflows/ci.yml`):** `npm ci` → `lint` → `typecheck` → `build` → Playwright smoke tests (nav, lens toggle, theme toggle, contact validation) + axe scan → Lighthouse CI against the preview build.

---

## 10. Build phases

| Phase | Deliverable | Done when |
|---|---|---|
| **0. Docs** (this step) | README, ARCHITECTURE, DESIGN_SYSTEM, MOTION_AND_SHOWCASE, MASTER.md | Reviewed and approved |
| **1. Scaffold** ✅ | `create-next-app` (TS, Tailwind, App Router, src dir, Cache Components), `globals.css` tokens, fonts, theme script + `ThemeToggle`, UI primitives, `/design-system` page, ESLint/Prettier | `npm run dev` shows the token page in dark and light |
| **2. Layout shell** ✅ | SmoothScrollProvider, Nav, MobileMenu, SectionLink, ScrollProgress, Cursor, Footer, Preloader, Reveal; `(site)` route group | Anchor nav works (nav clearance via `scroll-padding-top`), reduced-motion paths in place |
| **3. Content** ✅ | `src/types/content.ts`, `src/content/*` from both resumes, `src/lib/content.ts` read API, `scripts/check-content.mts` | `tsc` + `npm run check:links` pass (LinkedIn/LeetCode block bots: verified by hand) |
| **4. Hero + About** ✅ | Aurora/AuroraCanvas (OGL), Hero (parallax, intro, role rotator), LensToggle + `useLens` store, About bento (ScrubWords, CountUp, TiltCard, Magnetic) | LCP measured on the production build: desktop 0.3–1.4 s, mobile 1.6–2.0 s, CLS 0 |
| **5. Experience** ✅ | Server-rendered `Experience` + client `TimelineMotion`: scroll-drawn rail (scaleY scrub) with glowing head, node pops, alternating card slides, lens-highlighted product chips; Techvision internship + Groceries added to content | Works on desktop (alternating) and mobile (left rail) |
| **6. Showcase** ✅ | One scroll-driven `ProjectStage` (sticky via CSS `motion-safe:lg:`) with phone / browser / duo / system visuals; PhoneMockup, BrowserMockup, ScreenPlaceholder ("UI preview" until screenshots exist), TerminalPanel, SystemDiagram (SVG desktop, flow list mobile); FeaturedProjects (lens crossfade), ProjectGrid (filters + layout animation), Archive (cursor preview). `lib/projectView.ts` view models; `lib/icons.ts` resolves brand icons server-side | Every kind renders; lens switch swaps featured set; modern initial JS 294 KB gzip |
| **7. Case studies** ✅ | `/projects/[slug]` for every project (structured sections + optional MDX story via `lib/caseStudies.ts`), `@next/mdx` + `mdx-components.tsx`, per-project and site OG images (Space Grotesk/DM Sans from `@fontsource`, read at module load so they prerender), `sitemap.ts`, `robots.ts`, JSON-LD `CreativeWork`; stages and grid cards link to case studies | All 10 pages and 11 OG images prerendered at build; unknown slugs render the not-found view with `noindex` (soft 404: Cache Components can't use `dynamicParams`) |
| **8. Skills, Achievements, Contact** ✅ | Skills: velocity-reactive `SkillMarquee`, lens-dimmed skill-group cards (`LensScope` + CSS), Recognition cards. Contact: `app/actions/contact.ts` Server Action (zod, honeypot, time-on-form re-stamped after each submit, Resend with reply-to, prefilled mailto when unconfigured or on failure), `ContactForm` (`useActionState`), `CopyEmail`. Decorative section wrappers switched to `overflow-clip` so focus can't scroll them sideways | Validation, fallback and Resend-failure paths verified on the prod build; real delivery needs `RESEND_API_KEY` + a verified sender |
| **9. Polish** ✅ | CSS-driven preloader + hero intro (no JS on the LCP path), reveals animate opacity only (content stays reachable by screen readers), `LazyMount` for decorative mockups/marquee (home DOM 2,616 → 1,598), WebGL aurora desktop-only, no card blur below `lg`, `content-visibility` on Contact/footer, SplitText removed, logo accessible name fixed, branded `not-found` (root returns a real 404) + `error` boundary | Lighthouse mobile (this machine, benchmark ≈ 1,100): accessibility/best practices/SEO 100; performance 35 → 40–52 (noisy), observed LCP 1.7–3.0 s, CLS ≤ 0.023. Re-measure on PageSpeed Insights after deploy |
| **10. Launch** | Vercel project, `devshivam.online` DNS, analytics | Live and indexed |

---

## 11. Assets needed from Shivam

- [ ] **Phone screenshots** (4–6 per app): Fitizen, FitExGo, MolBhaav, Wingtrill
- [ ] **Desktop captures** (hero + full-page): Fitizen website, Vela Meet (app + admin panel), Wingtrill site, Social Media Scheduler
- [ ] Optional **short screen recordings**: Fitizen reels and chat, Vela Meet joining a call
- [ ] **Profile photo** (transparent cut-out preferred; the old `profile-pic.png` works as a fallback)
- [x] Both **resume PDFs** (linked from Google Drive)
- [ ] Permission or NDA check for showing company products (Scramble Apps, Shivsys). Private backend systems are shown only as diagrams and metrics.
- [ ] **Resend API key** + verified sender domain (optional; the mailto fallback otherwise)
