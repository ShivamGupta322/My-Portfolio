# Motion & Project Showcase Playbook

> How the site moves, and how each kind of project (**mobile app**, **web app**, **hybrid**, **backend system**) gets its own showcase "stage".
> Colors, type and surfaces are in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md). Code structure is in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 1. Motion principles

1. **Motion explains, it doesn't decorate.** Every animation either reveals hierarchy, shows how a product works, or gives feedback.
2. **One or two focal motions per viewport.** Everything else is still or subtle (fades of 8–16px or less).
3. **Transform and opacity only.** No layout-property animation. Use `will-change` only while an animation is running.
4. **Ease-out to enter, ease-in to exit.** Never use linear for UI. Linear is only for scrubbed scroll and marquees.
5. **Interruptible.** Hovers and toggles use springs or short tweens that can reverse mid-way.
6. **Reduced motion is a first-class mode**, not an afterthought (see §8).
7. **Mobile gets choreography, not scroll-jacking.** No pinned sections under 1024px. Animations play on enter instead.

---

## 2. Tool responsibilities

| Layer | Tool | Owns |
|---|---|---|
| Smooth scroll | **Lenis** | Inertial scrolling and anchor scrolling. Driven by the GSAP ticker so ScrollTrigger stays in sync (same pattern as the old `script.js`). |
| Scroll choreography | **GSAP + ScrollTrigger** (`@gsap/react` → `useGSAP`) | Pinning, scrubbed timelines, parallax, horizontal rails, SVG line drawing |
| Text splitting | **GSAP SplitText** | Hero name characters, heading words, word-by-word paragraph reveal |
| Path motion | **GSAP MotionPathPlugin** | Packets travelling along system-diagram edges |
| Component motion | **Motion** (`motion/react`) | Hover/tap, `layout` reflow (filters, lens reorder), `layoutId` shared elements, `AnimatePresence` (menus, lightbox, route transitions) |
| Ambient | **CSS keyframes** | Pulse dots, caret blink, aurora blob drift, marquee fallback |
| WebGL | **OGL** (lazy) | Hero aurora shader only |

Rule of thumb: **if it depends on scroll position, use GSAP. If it depends on state or the pointer, use Motion. If it loops forever, use CSS.**

---

## 3. Motion tokens

| Token | Value | GSAP equivalent | Use |
|---|---|---|---|
| `--dur-instant` | 150ms | 0.15 | Color, opacity micro-feedback |
| `--dur-fast` | 250ms | 0.25 | Hover, toggles, chips |
| `--dur-base` | 400ms | 0.4 | Card reveals, menus |
| `--dur-slow` | 700ms | 0.7 | Section headings, device entrances |
| `--dur-hero` | 1200ms | 1.2 | Preloader → hero hand-off |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | `expo.out` | Default enter |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | `power4.out` | Smaller reveals |
| `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | `power4.inOut` | Route/curtain transitions |
| `--ease-in` | `cubic-bezier(0.5, 0, 0.75, 0)` | `power3.in` | Exits |
| `spring.snappy` | `{ stiffness: 260, damping: 24 }` | — | Toggles, magnetic buttons |
| `spring.soft` | `{ stiffness: 120, damping: 20, mass: 0.8 }` | — | Tilt, cursor follower |
| Stagger | chars 0.03s · words 0.05s · items 0.08s | | |
| Scrub | `scrub: 0.8` (smoothed) | | All scroll-linked timelines |
| Reveal offset | `y: 24px`, `opacity: 0 → 1`, start `"top 85%"` | | Generic `<Reveal>` |

These live in `src/lib/motion.ts` (exported for both GSAP and Motion) and mirror CSS variables in `globals.css`.

---

## 4. Global motion

| Element | Behaviour | Reduced motion |
|---|---|---|
| **Preloader** | ~1.35 s. A mono counter runs 0→100 while "SHIVAM GUPTA" reveals by character, then a curtain wipes up (`power4.inOut`). The hero intro starts as the curtain *begins* lifting (`intro:ready` event, `lib/intro.ts`). Skipped on repeat visits (`sessionStorage`). | Skipped entirely |
| **Floating nav** | Glass pill `top-4 inset-x-4`. It hides on scroll-down, shows on scroll-up, and condenses (more blur and fill) after 80px. The active-section indicator is a Motion `layoutId` pill. | Always visible, no slide |
| **Scroll progress** | 2px brand-gradient bar under the nav, `scaleX` bound to page progress | Kept (not motion-heavy) |
| **Custom cursor** | Desktop and `pointer:fine` only; replaces the native cursor (`html.custom-cursor`). A brand-gradient dot tracks the pointer 1:1 while a ring trails on a spring. Over interactive elements the ring grows with a cyan glow and the dot hides; `data-cursor="View"`/`"Drag"` turns it into a filled labelled pill; `data-cursor="hide"` hides it; pressing squeezes the ring; text fields get the native I-beam. | Disabled (native cursor) |
| **Magnetic CTAs** | Hero and contact buttons pull toward the pointer (max 8px) and spring back | Disabled |
| **Route transitions** | `template.tsx` with `AnimatePresence`. Content fades and lifts 16px. A project card → case study uses a `layoutId` shared hero image (plus the View Transitions API where supported). | Plain crossfade |
| **Section headings** | The eyebrow slides in from 12px. The h2 words rise from a mask with a 0.05s stagger. The gradient word gets a one-time shimmer. | Fade only |

---

## 5. Section-by-section map

| # | Section | Entrance | Scroll behaviour (≥1024px) | Interaction | Mobile (<1024px) |
|---|---|---|---|---|---|
| 1 | **Hero** | Name chars rise from a mask. The role line types or rotates ("Full-stack" → "React Native" → "Erlang/OTP"). The CTAs and lens toggle fade up. | 3-plane parallax: aurora 0.2×, blobs 0.5×, portrait 0.8×. On exit the hero is pinned for 40vh while it scales to 0.92, fades and blurs 4px. | Mouse parallax on the planes (±12px). Toggling the lens crossfades the tagline with a blur. | No pin, no mouse parallax, lighter shader or CSS aurora |
| 2 | **About + stats bento** | Bento tiles stagger in (0.08s) | The intro paragraph reveals word by word (opacity 0.15 → 1, scrubbed) | Stats count up once in view (`10K+`, `400+`, `84%`, `~110/s`, `~2 yrs`). Tiles tilt and glare. | Count-up on enter, no scrub |
| 3 | **Experience timeline** | Briefcase nodes pop in (`back.out`) | A gradient rail draws with scroll (scrubbed `scaleY`, transform-only) with a glowing head riding its tip. Role cards slide in from alternating sides (±48px); dates sit opposite the card. | Product chips link to their project stages; chips matching the active lens get a cyan highlight | Single left rail, dates inside cards, cards rise from 28px |
| 4 | **Featured stages** | See §6 | Pinned, scrubbed stages, one per featured project | Store/Live/Case study CTAs | Unpinned, auto-play-on-enter variants |
| 5 | **Project grid + archive** | Cards stagger in | Light parallax on card media (±20px) | Filter chips (All / Web / Mobile / Backend) reflow cards with Motion `layout`. Hovering a card auto-scrolls its screenshot. Archive rows show a preview image that follows the cursor. | Chips scroll horizontally. No cursor preview: tapping expands a thumbnail. |
| 6 | **Skills** | Group cards stagger in | **Tech globe** beside the heading: ~27 logos on a turning sphere that bursts into a labelled grid as you scroll (`TechGlobe`, rAF only while on screen). Below Recognition, an **On GitHub** card (repos, last-year contributions, streaks, contribution calendar) from `lib/github.ts`, cached hourly. | The lens moves matching groups first and gives them an accent edge; the others step back to 72% opacity, still ≥ 4.5:1. | Same, without the stagger |
| 7 | **Achievements & education** | Cards flip up (`rotateX 12° → 0`) | — | LeetCode/GFG badges link out | Same |
| 8 | **Contact + footer** | The form fields stagger. A giant outlined "LET'S BUILD SOMETHING" marquee runs in the footer. | Footer reveal: the page content lifts to uncover a fixed footer (`clip-path` / translate) | Field focus glow, submit button morph (idle → spinner → ✓), success toast | Same, minus the footer uncover |

---

### Phase 9 changes

- **Preloader and hero intro are pure CSS** (`.preloader*`, `.hero-line`, `.hero-fade`, `.hero-portrait` in globals.css). The curtain lifts at 1 s and the hero starts then; on repeat visits (`html[data-preloaded]`, set pre-paint) the hero starts at once. No JavaScript sits on the LCP path, so slow phones aren't stuck behind hydration.
- **Reveals animate opacity only** (never `autoAlpha`/visibility), so below-the-fold headings stay reachable by screen readers before they're scrolled into view.
- **Decorative visuals mount lazily** via `LazyMount` (stage device mockups, grid mini-mockups) with same-size placeholders.
- **WebGL aurora is desktop-only** (`pointer: fine` and ≥ 1024 px); phones and tablets get the CSS aurora. Cards drop `backdrop-filter` below `lg`.
- Reduced motion also zeroes `animation-delay`, so CSS intros jump straight to their end state.

### LCP rule for intros (superseded in Phase 9: intros no longer hide content before JS)

Hero copy is hidden before first paint by `html.intro-pending` (`[data-intro]` → `visibility: hidden`) so it never flashes and then re-animates. The **LCP element must never be opacity-gated**: the portrait (desktop and mobile LCP) only settles from a small transform offset that CSS applies pre-paint and GSAP matches. A 4 s safety timeout in the head script reveals everything if JS fails.

## 6. Project showcase system

Every project in `src/content/projects.ts` has a `kind` that selects its **stage component**:

| `kind` | Stage | Projects |
|---|---|---|
| `mobile` | `PhoneStage` | FitExGo, MolBhaav |
| `web` | `BrowserStage` | Social Media Post Scheduler |
| `hybrid` | `DeviceDuoStage` (browser + phone) | Fitizen (app + Vue website), Wingtrill (mobile/web/desktop), Vela Meet (web + backend) |
| `backend` | `SystemStage` (diagram + terminal) | Fault-Tolerant Order Processing System, VoIP & Telephony Platform, Nearby (XMPP) |

A project can also define an `architecture` diagram, which renders as a second "Under the hood" stage. This is how **Vela Meet, Wingtrill, Fitizen chat and Nearby** appear in *both* lenses.

### Implementation note (Phase 6)

All four stages share one component, `ProjectStage`. Only the **first three stages per lens are pinned**; later ones are compact sections (tap a highlight to switch, they rise into view once). On desktop with motion allowed a pinned section is `N × 45svh + 100svh` tall with a **CSS sticky** frame (no GSAP pin, so no pin-spacer reflow and no limit on how many stages a page can have). A ScrollTrigger maps progress to the active highlight; clicking a highlight scrolls to it. Compact stages say "Click / Tap a step to see it" and auto-play their steps every 4 s while in view (the active step's bar fills as a timer; hover pauses, picking a step stops it). A `02 / 05` counter and a **Skip to next project** link sit under the copy. As a stage arrives its copy rises in; as it leaves, the whole frame fades and recedes, so stages hand off instead of cutting. All of a stage's screenshots are preloaded when it mounts, with a shimmer behind each until it paints. The visual reacts per kind (phone screen swap, browser screen cross-fade or full-page scroll, duo parallax, diagram edge reveal + packets + crash beat + terminal on the last step). Mobile and reduced motion get a normal section where tapping a highlight selects it; on mobile the visual sits between the title and the highlights (so a tap visibly changes it), hybrids show just the phone, large, and diagrams become a vertical flow list. Real screenshots come from `public/projects/<slug>/` (`phone-N`, `desktop-N`, or a full-page `desktop`); a highlight can pick its screen with `screen`. Without them, screens show branded placeholders built from each project's highlights and tagged **UI preview**.

### 6.1 Featured order per lens

| Order | Product lens | Systems lens |
|---|---|---|
| 1 | Fitizen (hybrid) | Fault-Tolerant Order System (backend) |
| 2 | Vela Meet (hybrid) | Vela Meet (backend architecture) |
| 3 | Wingtrill (hybrid) | Wingtrill (Erlang/XMPP messaging) |
| 4 | FitExGo (mobile) | VoIP & Telephony (Kazoo/FreeSWITCH) |
| 5 | — | Nearby (MongooseIM, in progress) |

Everything else (MolBhaav, Scheduler, Nearby in the product lens) goes into the **grid**. College projects go into the **archive**.

### 6.2 `PhoneStage`: mobile apps

The goal is to make the app feel like it's in your hand. The visitor scrolls *through* the app's flows.

```
Pinned for ~250vh (desktop)
0% ─ 15%   Phone rises (y: 120 → 0, rotateX 25° → 0, scale .9 → 1). Title and badges fade in on the left.
15% ─ 85%  Screen sequence: N screens (e.g. Feed → Reels → Chat → Profile). Each step:
           · Screen crossfades plus slides 8% inside the frame
           · A callout card flies in on alternating sides with an SVG connector line drawn to the hotspot
           · The progress dots beside the phone fill in
85% ─ 100% Phone tilts (rotateY -18°) and slides right. A metrics row and store badges appear.
```

- **Frame:** a pure CSS `PhoneMockup` (radius 48, dynamic island, side buttons, glass reflection overlay). Screens are `next/image`, or a muted looping `<video>` for motion-heavy features (Fitizen reels, chat typing).
- **Callouts** come from `highlights[]` and are written as product outcomes. Fitizen examples: "Real-time chat over WebSockets + offline SQLite", "Deep links open shared reels in-app", "Video compression → faster uploads".
- **Secondary apps rail** (MolBhaav, FitExGo when not featured) is a horizontal pinned rail of phones. Each phone has a slight `rotateY` based on its distance from center (coverflow-lite). It's draggable, and the cursor shows "Drag".
- **Mobile viewport:** no pin. The phone frame is static and its screens become a **swipeable scroll-snap carousel** with dots. Callouts become a list under the phone.
- **Store badges:** Google Play and App Store, deep-linked from `links.playStore` and `links.appStore`. A `downloads` metric badge ("10K+ downloads") appears where it's real.

### 6.3 `BrowserStage`: web apps

The goal is to show the real product at real scale, plus the parts nobody sees (admin and integrations).

```
Pinned for ~200vh (desktop)
0% ─ 30%   Browser mockup enters tilted (rotateX 20° → 0, scale .85 → 1, y 80 → 0). Aurora glow intensifies behind it.
30% ─ 70%  The long full-page screenshot scrolls INSIDE the browser (translateY scrubbed). A synced highlight list
           on the side ticks through features as their region passes.
70% ─ 100% Secondary panels (admin panel, calendar sync, email invite) fan out as stacked cards from behind the
           browser (x/rotate stagger). The "Visit live" button gets a mint pulse dot.
```

- **Frame:** `BrowserMockup`, made of CSS chrome, traffic lights and a URL pill showing the real domain (e.g. `velaconference.com`).
- **Hover (grid cards):** the inner screenshot auto-scrolls top→bottom over about 6s and returns on leave. A pointer-tracked **glare** and **≤6° tilt** are applied.
- **Mobile viewport:** no tilt, no pin. The screenshot is shown at a fixed crop. Tapping opens a **lightbox** with the full-page capture scrollable inside.

### 6.4 `DeviceDuoStage`: hybrid (app + web)

This is for products Shivam built on *both* sides (Fitizen app + Vue website, Wingtrill mobile/web/desktop, Vela Meet web + backend).

- A browser (back plane) and a phone (front plane, overlapping its bottom-right corner) move at **different parallax speeds** (browser 0.9×, phone 1.25×). This sells the "same product, every platform" story.
- On scroll, both screens step through **matching** states together (e.g. the Fitizen profile on web and app at the same time).
- An optional third plane is a **desktop app** window for Wingtrill (Electron), entering from the left.
- An **"Under the hood"** button morphs the stage into its `SystemStage` (Motion `layoutId` on the container). In the Systems lens this is open by default.

### 6.5 `SystemStage`: backend & Erlang systems

These projects have no UI to screenshot, so the **architecture becomes the visual** and the **metrics become the proof**.

```
Pinned for ~220vh (desktop)
0% ─ 25%   Nodes (glass rects with Simple Icons) appear with stagger. Edges draw in (gradient strokes, strokeDashoffset).
25% ─ 70%  Packets (cyan dots) travel along edges via MotionPath, the happy path first.
           "Let it crash" beat: a worker node flashes danger red → its supervisor pulses → the worker
           restarts in mint with a tooltip "one_for_one restart". A poisoned message then routes to the
           amber DLQ edge after 3 retries (retry counter ticks 1-2-3).
70% ─ 100% A TerminalPanel slides up and types the evidence:
             $ make loadtest        → ~110 orders/s end-to-end
             $ rebar3 cover         → 84% coverage (EUnit · PropEr · Common Test · Pact)
             $ rebar3 dialyzer      → 0 warnings
```

**Diagrams to build** (SVG data in `src/content/diagrams/*.ts`, rendered by one `SystemDiagram` component):

| Project | Nodes & flow |
|---|---|
| **Order Processing System** | Producer → **Kafka** `orders` topic → Consumer (gen_server pool) → **OTP supervision tree** (app_sup → consumer_sup / payment_sup / storage_sup) → idempotency check → **PostgreSQL ⇄ Mnesia** (pluggable) · retry-with-backoff loop · **DLQ** topic · **Prometheus** metrics tap · JSON logs |
| **VoIP & Telephony** | SIP phone → **FreeSWITCH** (media) ⇄ **Kazoo** Erlang services (call-flow, routing) → agent flows: *sales demo booking*, *receptionist support ticket* |
| **Vela Meet** | React client → **Node/Express API** → **PostgreSQL** + **Redis** (notification cache) → **Jitsi** (self-hosted) · Google/Outlook Calendar sync · **SendGrid** invites · **Active Directory** + 2FA · all behind **Nginx + PM2 on AWS EC2** |
| **Wingtrill** | RN / Next.js / Electron clients → XMPP over WebSocket → **MongooseIM** (1:1 + workspace rooms) · virtual numbers · Firebase Crashlytics |
| **Nearby** | Browser geolocation → **geohash cell (raw coords never leave the browser)** → typed XMPP WS client (reconnect + backoff + keepalive) → **MongooseIM MUC** room per cell → **MAM** archive (PostgreSQL / MongoDB) → paginated history catch-up |
| **Fitizen chat** | RN app → **WebSocket** server → offline **SQLite** store → **FCM** push · deep links → OG preview pages |

- **Hover on a node** shows a tooltip explaining what it does and why (e.g. "Idempotency key on payment, so at-least-once delivery never double-charges").
- **Mobile viewport:** the diagram re-flows into a **vertical** flow (same data, different layout preset). It animates once on enter with no scrub. The terminal stays.

### 6.6 Project grid card

- A glass card with a gradient hairline when featured. The media area holds a phone crop, browser crop or mini-diagram depending on `kind`.
- It shows a status badge (`Live`, `On Play Store`, `In progress`), the title, a one-line outcome, 3–5 tech chips, and links.
- Hover: lift via shadow (no layout shift), glare, tilt, inner screenshot auto-scroll, and the cursor shows "View".
- Clicking does a shared-element morph into `/projects/[slug]`.

### 6.7 Case-study page `/projects/[slug]`

| Block | Motion |
|---|---|
| Hero (title, role, period, stack, links, cover media) | Shared-element from card. Title words rise. |
| Problem → What I built → Impact | Paragraph word reveal. Metrics count up. |
| Stage (Phone / Browser / Duo / System) | Same stage component as on the home page |
| Gallery | Masonry with lightbox (`AnimatePresence`, swipe on mobile) |
| Architecture & decisions | `SystemDiagram` plus bullet "decision records" |
| Next project | Large hover-reveal link that previews the next cover |

### 6.8 Archive (college work)

Text-to-Speech, Weather App, Fanta Reimagined, Obeys Agency UI, and Tic-Tac-Toe. These go in a compact table-style list (name · stack · year · link). On desktop a preview image follows the cursor with `spring.soft` and a slight rotation from velocity. The screenshots are reused from the old repo's `imgs/`.

---

## 7. Lens toggle (Product ⇄ Systems)

- **Control:** a neumorphic inset track with a gradient knob that moves on `spring.snappy`. The labels change weight and color.
- **On change:**
  1. The hero tagline crossfades with a 6px blur (250ms).
  2. Featured stages swap order. Motion `layout` animates the FLIP and ScrollTrigger refreshes when it's done.
  3. The grid re-sorts (`layout` reflow) and matching cards briefly glow cyan.
  4. The skills section highlights the relevant group, and the others dim to 50%.
- The choice persists (`localStorage`) and is shareable (`?lens=systems`). Links in the Erlang resume can point straight to the Systems lens.

---

## 8. Reduced motion & device matrix

Implemented with `gsap.matchMedia()` and Motion's `useReducedMotion()`:

| Feature | Desktop | Mobile / touch | `prefers-reduced-motion` |
|---|---|---|---|
| Lenis smooth scroll | ✔ | Native scroll (`syncTouch: false`) | Off |
| Pinned / scrubbed stages | ✔ | Off (play-on-enter) | Off (static layout) |
| Parallax planes | ✔ | Reduced (scroll only, 50%) | Off |
| WebGL aurora | ✔ (paused offscreen) | CSS gradient if low-power / `saveData` | CSS gradient, static |
| Custom cursor, magnetic, tilt, glare | ✔ | Off | Off |
| Marquees | Velocity-reactive | Slow auto | Static grid |
| Text splitting reveals | ✔ | ✔ (shorter) | Simple fade |
| Count-ups | ✔ | ✔ | Final number shown |
| Micro-interactions (hover color, focus) | ✔ | ✔ | ✔ (color only) |

---

## 9. Performance rules for animation

- Register GSAP plugins once in `src/lib/gsap.ts`. Every scroll animation lives inside `useGSAP()` (automatic `gsap.context` cleanup) and is scoped to its section ref.
- Call `ScrollTrigger.refresh()` after fonts load, images decode, and the lens reorders.
- **Maximum of 3 pinned stages per page on desktop, 0 on mobile.** Use `anticipatePin: 1` and `pinSpacing` carefully.
- Lazy-load stage media with `loading="lazy"`. The `IntersectionObserver` pauses videos and the WebGL loop offscreen.
- Keep the main thread clear during scroll. No React state updates in scroll handlers. Use GSAP `quickTo`/`quickSetter` or Motion values (`useScroll`, `useTransform`) instead.
- Budget: the hero shader is under 60 lines, renders at 0.5× DPR on mobile, and is capped at 60fps.

---

## 10. About the `scroll-site-generator` skill

That skill produces Apple-style product films: AI-generated stills (Higgsfield) turned into clips (Kling), then scrubbed frame by frame on a canvas with GSAP ScrollTrigger. For this portfolio:
- **We reuse its techniques:** the GSAP ScrollTrigger pin and scrub architecture and the canvas frame-sequence pattern.
- **We don't use its AI film pipeline by default.** It needs paid Higgsfield/Kling access, and a developer portfolio is better served by *real* product screens and diagrams than by generated footage.
- **Optional future enhancement:** a short frame-sequence hero intro (e.g. a phone and laptop assembling out of the aurora). It would be added as `HeroSequence` behind a flag without changing the rest of the architecture.

### Additions (Nov 2026)

- **About stat art** (`StatArt`): a small looping illustration behind each stat tile, picked by `art` in `profile.ts` (clock, rising bars, fanned phones, heatmap, packet lanes, coverage ring, shield). CSS/SVG only, static under reduced motion.
- **Crossed tapes** (`CrossTapes`) between Work and Skills: two tilted bands (cyan, violet) that slide in opposite directions, scrubbed to scroll. Inspired by "caution tape" marquees; the footer marquee stays as the closing beat.
- **No page scrollbar**: hidden on `html`; the gradient progress bar under the nav shows position.
- **Backend card scenes** (`components/stageshow/BackendScenes.tsx`, built with the Stageshow kit from `.agents/skills/stageshow`): the Order processing, VoIP and Nearby cards in "More projects" show faux product components instead of diagram thumbnails: a worker that crashes and is restarted by its supervisor while throughput dips and recovers; an incoming call matched, routed and answered; a local group chat with a "location never stored" corner chip. Each plays once when first seen, has a `compact` phone composition, and loads in its own chunk. Notes in `components/stageshow/REHEARSAL.md`.
