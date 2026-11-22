# Shivam Gupta: Developer Portfolio

> **Software Engineer · Full Stack (MERN) & React Native · Erlang/OTP**
> I build the apps *and* the real-time systems behind them: React / Next.js / Vue on the web, React Native on Play Store and App Store, and fault-tolerant backends in Node.js and Erlang/OTP.

**Live:** [devshivam.online](https://www.devshivam.online) &nbsp;·&nbsp; [GitHub](https://github.com/ShivamGupta322) &nbsp;·&nbsp; [LinkedIn](https://www.linkedin.com/in/shivam-gupta-sg322/) &nbsp;·&nbsp; [LeetCode](https://leetcode.com/u/Shivam_Gupta322/) &nbsp;·&nbsp; [GeeksforGeeks](https://www.geeksforgeeks.org/user/guptashivamsg02/)

> **Status:** Phase 4 done (Hero with WebGL aurora, parallax and the Product/Systems lens; About bento). Visit `/design-system` for the living token reference. See the [roadmap](#roadmap).

---

## Highlights

- **Product ⇄ Systems lens.** One site, two lenses. *Product* leads with shipped web and mobile apps. *Systems* leads with Erlang/OTP, Kafka, XMPP and VoIP work. The lens re-orders projects and skills and is shareable via `?lens=systems`.
- **Project stages, not screenshots.** Each project type gets its own scroll-driven showcase:
  - **Mobile apps** go in a pinned phone whose screens play through as you scroll, with feature callouts and store badges.
  - **Web apps** go in a tilted browser that flattens into view while the real page scrolls inside it.
  - **Hybrid products** show web and phone together with layered parallax, to tell the "every platform" story.
  - **Backend systems** become animated architecture diagrams (Kafka → OTP supervision tree → Postgres/Mnesia, "let it crash" restarts, DLQ) plus a terminal that types out the metrics.
- **Midnight Aurora design system.** Dark glassmorphism over a violet→cyan aurora, neumorphic tactile controls, Space Grotesk / DM Sans / JetBrains Mono.
- **Motion with manners.** Lenis smooth scroll, GSAP ScrollTrigger timelines, Motion layout animations. Fully reduced-motion aware, with no scroll-jacking on mobile.
- **Fast and accessible.** Static generation, Server Components, lazy WebGL. Targets Lighthouse ≥ 90 on mobile and WCAG AA contrast.

## Featured work

| Project | What | Stack | Links |
|---|---|---|---|
| **Fitizen** | Fitness social app and website: real-time chat, deep links, reels | React Native, Vue.js, WebSockets, SQLite, FCM | [Play](https://play.google.com/store/apps/details?id=com.FitNation) · [App Store](https://apps.apple.com/in/app/fitizen-your-fitness-profile/id6449091598) · [Web](https://fitnation.com) |
| **Vela Meet** | Video conferencing and scheduling. Backend built from scratch. | React, Node.js, PostgreSQL, Redis, Jitsi, AWS | [velaconference.com](https://velaconference.com) |
| **Wingtrill** | Personal and workspace chat on mobile, web and desktop | React Native, Next.js, Electron, Erlang, MongooseIM | [wingtrill.com](https://wingtrill.com) |
| **FitExGo** | Fitness and nutrition app with 10K+ downloads | React Native, Node.js | [Play](https://play.google.com/store/apps/details?id=com.fitexgo) · [App Store](https://apps.apple.com/in/app/fitexgo-fitness-lifestyle/id6446050793) |
| **Order Processing System** | Event-driven, fault-tolerant backend: ~110 orders/s, 84% coverage | Erlang/OTP, Kafka, PostgreSQL, Mnesia, Prometheus | diagram + metrics |
| **VoIP & Telephony** | Call-flow and routing on a distributed VoIP platform | Erlang, Kazoo, FreeSWITCH, SIP | diagram |
| **Nearby** *(in progress)* | Location-based group chat that never stores raw coordinates | React, TypeScript, XMPP/MongooseIM, Docker | — |
| **MolBhaav** | Offline price↔weight calculator in multiple Indian languages | React Native, i18n | [Play](https://play.google.com/store/apps/details?id=com.molbhaav) · [GitHub](https://github.com/ShivamGupta322/MolBhaav) |
| **Social Media Post Scheduler** | Publish to every platform at a set time via Zapier | React (Vite), Node.js, Express, MongoDB | [Live](https://social-media-post-scheduler-eta.vercel.app/) · [GitHub](https://github.com/ShivamGupta322/social-media-post-scheduler) |

## Tech stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) |
| **Styling** | Tailwind CSS v4 (`@theme` tokens) · flash-free `data-theme` switch |
| **Motion** | GSAP 3 + ScrollTrigger / SplitText / MotionPath · Motion (`motion/react`) · Lenis · OGL (hero shader) |
| **Content** | Typed TS content files · MDX case studies |
| **Icons** | lucide-react · simple-icons |
| **Forms** | Server Actions · zod · Resend |
| **Quality** | ESLint · Prettier · Playwright + axe · Lighthouse CI · GitHub Actions |
| **Hosting** | Vercel → `devshivam.online` |

## Documentation

| Doc | Contents |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack rationale, folder structure, content model, rendering, animation plumbing, budgets, build phases |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Colors (dark and light, contrast-checked), typography, spacing, glass and neumorphism recipes, components |
| [docs/MOTION_AND_SHOWCASE.md](docs/MOTION_AND_SHOWCASE.md) | Motion tokens, per-section animation map, how mobile, web, hybrid and backend projects are showcased |
| [design-system/shivam-gupta-portfolio/MASTER.md](design-system/shivam-gupta-portfolio/MASTER.md) | Design rules in the format the `ui-ux-pro-max` skill reads |

## Getting started


**Prerequisites:** Node.js 24 LTS, npm 11.

```powershell
npm install
```

```powershell
Copy-Item .env.example .env.local
```

```powershell
npm run dev
```

Then open http://localhost:3000.

| Script | Does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (static) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier (with Tailwind class sorting) |
| `npm run check:content` | Validate content: cross-references, skill icons, diagrams, local assets |
| `npm run check:links` | Same, plus a live request to every external link |
| `npm run test:e2e` | Playwright + axe accessibility checks (Phase 9) |

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | optional | Sends contact-form emails. Without it, the form falls back to `mailto:`. |
| `CONTACT_TO_EMAIL` | with Resend | Inbox that receives messages |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical URLs and OG images |

## Project structure

```
src/
├─ app/            routes, layout, globals.css (tokens), OG images, server actions
├─ components/
│  ├─ layout/      Nav, Footer, Cursor, ScrollProgress, Preloader
│  ├─ sections/    Hero, About, Experience, FeaturedProjects, ProjectGrid, Skills, Contact…
│  ├─ showcase/    PhoneStage, BrowserStage, DeviceDuoStage, SystemStage + mockups
│  ├─ motion/      Reveal, SplitReveal, Parallax, TiltCard, Marquee, CountUp, AuroraCanvas
│  └─ ui/          Button, Badge, TechChip, LensToggle, ThemeToggle, FilterChips…
├─ content/        profile, experience, projects, skills, achievements, diagrams, case-studies
├─ providers/      Lens, SmoothScroll
├─ hooks/ · lib/ · types/
public/            resume PDFs, project media, archive screenshots, textures
```

Full tree: [ARCHITECTURE.md §3](docs/ARCHITECTURE.md#3-folder-structure).

## Editing content

All content is typed data, so you never have to touch components to update it.

- **New job or role:** add it to `src/content/experience.ts`.
- **New project:** add an entry to `src/content/projects.ts`.
  - Pick a `kind` (`mobile` | `web` | `hybrid` | `backend`). It decides which showcase stage is used.
  - Tag it with a `lens` (`product` | `systems`).
  - Drop the media in `public/projects/<slug>/`.
  - Optionally add `src/content/case-studies/<slug>.mdx` for a full case-study page.
- **Backend project:** add its nodes and edges to `src/content/diagrams.ts` and link it via `architecture`.
- **Skills:** edit `src/content/skills.ts`. Icons are `simple-icons` slugs.
- **Resume:** replace the PDFs in `public/resume/`.

TypeScript fails the build if a required field is missing, and `npm run check:content` catches broken cross-references (unknown stack names, diagram ids, experience slugs, missing images). Run `npm run check:links` before deploying.

## Roadmap

- [x] **0. Docs:** README, architecture, design system, motion and showcase playbook
- [x] **1. Scaffold:** Next.js + Tailwind v4 tokens + fonts + theme (see `/design-system`)
- [x] **2. Layout shell:** smooth scroll, nav, cursor, progress, preloader, footer
- [x] **3. Content:** typed data from both resumes, plus an integrity and link checker
- [x] **4. Hero + About:** aurora shader, lens toggle, parallax hero, stats bento
- [ ] **5. Experience timeline**
- [ ] **6. Showcase stages:** phone, browser, device duo, system diagram, plus grid and archive
- [ ] **7. Case-study pages** + OG images
- [ ] **8. Skills, achievements, contact** (Resend)
- [ ] **9. Polish:** a11y and performance pass (ui-ux-pro-max checklist)
- [ ] **10. Launch:** Vercel + `devshivam.online`

## Credits

- Design intelligence: the `ui-ux-pro-max` Claude skill (installed in `.claude/skills/`).
- Scroll techniques adapted from the `scroll-site-generator` skill (GSAP pin and scrub patterns).
- The previous portfolio (HTML/CSS/GSAP, college era) lives in `Projects/Personal Portfolio Shivam`. Its archive projects and screenshots carry over.

---

© 2026 Shivam Gupta
