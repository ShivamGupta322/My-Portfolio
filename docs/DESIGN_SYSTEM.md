# Design System: "Midnight Aurora"

> The visual language of **devshivam.online**. It's dark-first, with glass surfaces over a slow violet→cyan aurora, crisp geometric type, and mono details that hint at code.
> Source of truth for tokens: `src/app/globals.css` (`@theme` block). The machine-readable summary for the `ui-ux-pro-max` skill is [`design-system/shivam-gupta-portfolio/MASTER.md`](../design-system/shivam-gupta-portfolio/MASTER.md).
> Motion tokens and the animation playbook live in [MOTION_AND_SHOWCASE.md](./MOTION_AND_SHOWCASE.md).

---

## 1. Design principles

| Principle | What it means in practice |
|---|---|
| **Work first** | Product screens, diagrams and metrics carry the page. Decoration (blobs, noise, glow) always sits behind content at low opacity. |
| **Depth, not clutter** | Use three depth planes: the aurora background, glass mid-layer cards, and solid foreground text and CTAs. Never stack glass on glass more than twice. |
| **Engineer's precision** | Mono labels, tabular numbers, a 4 px grid and hairline borders make it feel built, not decorated. |
| **Two lenses, one identity** | The *Product* lens (web/mobile) and the *Systems* lens (Erlang/backend) share every token. Only ordering and copy change. |
| **Accessible by default** | Text contrast is at least 4.5:1, focus rings are visible, touch targets are at least 44 px, and `prefers-reduced-motion` is honoured everywhere. |

---

## 2. Color

### 2.1 Core palette (dark, default)

| Token | Hex / value | Use |
|---|---|---|
| `--color-bg` | `#07070C` | Page background ("ink") |
| `--color-surface` | `#11121A` | Solid cards, neumorphic base, footer |
| `--color-elevated` | `#1A1B26` | Popovers, hovered surfaces, code panels |
| `--color-glass` | `rgba(255,255,255,0.06)` | Glass fill |
| `--color-glass-strong` | `rgba(255,255,255,0.10)` | Glass on hover / nav when scrolled |
| `--color-glass-border` | `rgba(255,255,255,0.10)` | Hairline borders |
| `--color-fg` | `#F4F4F8` | Primary text |
| `--color-muted` | `#A1A1B5` | Secondary text, captions |
| `--color-primary` | `#8B5CF6` | Brand violet: glows, gradients, focus ring, icons |
| `--color-primary-strong` | `#7C3AED` | **Filled buttons** (white text, 5.7:1) |
| `--color-primary-text` | `#A78BFA` | Violet *text* and links on dark (7.4:1) |
| `--color-accent` | `#22D3EE` | Cyan: highlights, diagram packets, active states |
| `--color-success` | `#34D399` | "Live" / "Shipped" badges, pulse dots |
| `--color-warning` | `#FBBF24` | "In progress" badge (Nearby), DLQ path in diagrams |
| `--color-danger` | `#FB7185` | Form errors, "crash" moment in the OTP diagram |
| `--color-on-brand` | `#07070C` | Text on the brand gradient (≥ 4.75:1 from violet to cyan; white fails on the cyan end) |

### 2.2 Light mode

| Token | Hex / value | Notes |
|---|---|---|
| `--color-bg` | `#F7F7FB` | Cool off-white |
| `--color-surface` | `#FFFFFF` | |
| `--color-elevated` | `#EEF0F6` | Also the neumorphic base in light |
| `--color-glass` | `rgba(255,255,255,0.80)` | Glass must be ≥ 80% opaque in light mode |
| `--color-glass-border` | `#E2E8F0` | Visible hairline |
| `--color-fg` | `#0F172A` | 16.7:1 on bg |
| `--color-muted` | `#475569` | 7.1:1 on bg |
| `--color-primary` / `-strong` | `#7C3AED` | 5.3:1 on bg, also fine as text |
| `--color-primary-text` | `#6D28D9` | 6.7:1 |
| `--color-accent` | `#0E7490` | Cyan-700 (the brighter `#0891B2` fails at 3.7:1) |
| `--color-success` | `#047857` | 5.5:1 |
| `--color-warning` | `#B45309` | 5.0:1 |
| `--color-danger` | `#BE123C` | 6.3:1 |

### 2.3 Gradients & glows

```css
--gradient-brand:  linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%);
--gradient-text:   linear-gradient(90deg, #A78BFA 0%, #22D3EE 100%);   /* one highlighted word per heading */
--gradient-border: linear-gradient(135deg, rgba(139,92,246,.6), rgba(34,211,238,.2) 50%, rgba(255,255,255,.06));
--aurora-1: radial-gradient(40% 50% at 20% 30%, rgba(139,92,246,.35), transparent 70%);
--aurora-2: radial-gradient(35% 45% at 80% 20%, rgba(34,211,238,.25), transparent 70%);
--aurora-3: radial-gradient(30% 40% at 60% 80%, rgba(52,211,153,.12), transparent 70%);
```

Rules:
- Gradient **text** is limited to 1 word or short phrase per heading, never body copy.
- The brand gradient is the *only* multi-color gradient. Don't invent new ones per section.
- In light mode, aurora opacity drops to roughly 40% so text stays crisp.

### 2.4 Verified contrast (WCAG 2.1)

| Pair | Ratio | Pass |
|---|---|---|
| fg `#F4F4F8` on bg `#07070C` | 18.3 | AA/AAA |
| muted `#A1A1B5` on elevated `#1A1B26` | 6.7 | AA |
| primary-text `#A78BFA` on surface `#11121A` | 6.9 | AA |
| accent `#22D3EE` on bg | 11.1 | AA |
| white on primary-strong `#7C3AED` | 5.7 | AA |
| ink `#07070C` on success `#34D399` (badge) | 10.5 | AA |
| light fg `#0F172A` on `#F7F7FB` | 16.7 | AA/AAA |
| light muted `#475569` on `#F7F7FB` | 7.1 | AA |
| light accent `#0E7490` on white | 5.4 | AA |

> White on `#8B5CF6` is only **4.23**, so `#8B5CF6` is never used as a text-bearing fill.

---

## 3. Typography

### 3.1 Families (all via `next/font/google`, self-hosted, `display: swap`)

| Role | Family | Weights | Why |
|---|---|---|---|
| **Display / headings** | **Space Grotesk** | 500, 600, 700 | Geometric with quirky details, techy but warm. It carries over from the old site for continuity. |
| **Body / UI** | **DM Sans** | 400, 500, 700 | Very readable at small sizes and pairs cleanly with Space Grotesk. |
| **Mono / data** | **JetBrains Mono** | 400, 500, 600 | Eyebrow labels, metrics, terminal panels, tech chips, code |

CSS variables: `--font-display`, `--font-sans`, `--font-mono`. In Tailwind that's `font-display`, `font-sans`, `font-mono`.

### 3.2 Fluid type scale

| Token | Size | Line-height | Tracking | Family / weight | Used for |
|---|---|---|---|---|---|
| `text-display` | `clamp(3rem, 7vw + 1rem, 7.5rem)` | 0.95 | -0.04em | Display 700 | Hero name |
| `text-h1` | `clamp(2.5rem, 4.5vw + 1rem, 4.5rem)` | 1.0 | -0.03em | Display 700 | Case-study titles |
| `text-h2` | `clamp(2rem, 3vw + 1rem, 3.5rem)` | 1.05 | -0.02em | Display 600 | Section titles |
| `text-h3` | `clamp(1.5rem, 1.2vw + 1rem, 2rem)` | 1.2 | -0.01em | Display 600 | Card titles |
| `text-h4` | `1.25rem` | 1.3 | 0 | Display 600 | Sub-headings |
| `text-lead` | `clamp(1.125rem, .5vw + 1rem, 1.375rem)` | 1.6 | 0 | Sans 400 | Section intros |
| `text-body` | `1rem` (never below 16px on mobile) | 1.65 | 0 | Sans 400 | Paragraphs |
| `text-small` | `0.875rem` | 1.5 | 0 | Sans 500 | Meta, captions |
| `text-label` | `0.75rem` | 1.2 | 0.16em, UPPERCASE | Mono 500 | Eyebrows ("01 / EXPERIENCE"), chips |
| `text-metric` | `clamp(2.5rem, 4vw + 1rem, 4.5rem)` | 1.0 | -0.02em | Mono 600, `tabular-nums` | Stats (10K+, 84%, 110/s) |

Rules: body copy is at most **70ch** wide. Headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty`.

---

## 4. Layout, spacing & shape

| Token group | Values |
|---|---|
| **Spacing** (4px grid) | 1=4 · 2=8 · 3=12 · 4=16 · 6=24 · 8=32 · 12=48 · 16=64 · 24=96 · 32=128 |
| **Section padding-y** | `clamp(6rem, 12vw, 11rem)` |
| **Container** | `max-w-[1240px]`, gutters 20px (mobile) / 32px (tablet) / 48px (desktop) |
| **Grid** | 4 cols (mobile) · 8 cols (tablet) · 12 cols (desktop), gap 24px |
| **Breakpoints** | 375 (base) · `md` 768 · `lg` 1024 · `xl` 1440 |
| **Radius** | `sm` 8 · `md` 14 · `lg` 20 · `xl` 28 · `full`. Phone frame 48, browser frame 14. |
| **Blur** | `glass-sm` 8px · `glass` 16px · `glass-lg` 24px |
| **Z-index** | base 0 · raised 10 · sticky/nav 20 · overlay 30 · modal 40 · cursor/toast 50 |

### Shadows (dark)

```css
--shadow-card:  0 0 0 1px var(--color-glass-border), 0 12px 40px -12px rgba(0,0,0,.7);
--shadow-lift:  0 0 0 1px rgba(255,255,255,.14), 0 24px 60px -16px rgba(0,0,0,.8);
--shadow-glow:  0 0 48px -12px rgba(139,92,246,.55);          /* primary CTA, focused cards */
--shadow-glow-cyan: 0 0 40px -14px rgba(34,211,238,.5);
```
In light mode, shadows switch to slate-tinted `rgba(15,23,42,.08–.14)` and glows drop to about 40%.

---

## 5. Surface recipes

### 5.1 Glassmorphism (primary surface style)

Used for the **nav, project cards, stat tiles, modals/lightbox, contact form and terminal panel**.

```css
.glass {
  background: var(--color-glass);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
/* gradient hairline variant for featured cards */
.glass-gradient { position: relative; }
.glass-gradient::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: var(--gradient-border);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
}
```
- Glass only works over something. Every glass surface sits above the aurora or a blob.
- Fallback: `@supports not (backdrop-filter: blur(1px))` uses solid `--color-surface`.
- Never put long body text on glass without at least 6% fill plus a blur of 16px or more.

### 5.2 Neumorphism (accent only)

Neumorphism has weak contrast, so it is limited to **tactile controls**: the **Product⇄Systems lens toggle**, the **theme switch**, and **segmented filter chips** (All / Web / Mobile / Backend).

```css
/* dark */
.neu        { background: #11121A; box-shadow: 6px 6px 14px #050508, -6px -6px 14px #1D1F2C; }
.neu-inset  { background: #11121A; box-shadow: inset 4px 4px 10px #050508, inset -4px -4px 10px #1D1F2C; }
/* light */
.light .neu       { background: #EEF0F6; box-shadow: 6px 6px 14px #CFD3DE, -6px -6px 14px #FFFFFF; }
.light .neu-inset { background: #EEF0F6; box-shadow: inset 4px 4px 10px #CFD3DE, inset -4px -4px 10px #FFFFFF; }
```
The track is `.neu-inset`. The knob or active segment is filled with `--gradient-brand` so the state never relies on shadow alone. A text label always accompanies the state.

### 5.3 Atmosphere layers

| Layer | Implementation | Opacity |
|---|---|---|
| Aurora (hero) | OGL fragment shader, lazy-loaded. Fallback: `--aurora-1..3` stacked radial gradients. | 100% (hero), 0 elsewhere |
| Section blobs | 2–3 blurred (`blur(80px)`) absolutely-positioned gradient circles with parallax | 20–35% |
| Grid lines | `background-image` 64px dotted/line grid, masked radially | 4–6% |
| Noise | Tiny tiled PNG/SVG grain over everything (`pointer-events:none`) | 3% |

---

## 6. Iconography & imagery

- **UI icons:** `lucide-react`, 24px viewBox, stroke 1.75, sized `size-5` / `size-6`. **No emoji as icons.**
- **Tech logos:** `simple-icons` (official paths), shown monochrome `--color-muted`, tinted to brand color on hover.
- **Store badges:** official Google Play / App Store badge SVGs, unmodified.
- **Screenshots:** AVIF/WebP via `next/image` with explicit width/height (no CLS) and a blur placeholder.
  - Phone: 1179×2556 (9:19.5) per screen.
  - Desktop: 1440×900 hero plus a **long full-page capture** (1440×N) for the auto-scroll effect.
  - Short screen recordings (reels, chat) as muted, looping `<video playsinline>` under 1.5 MB with a poster.
- **Portrait:** transparent PNG/WebP cut-out (can reuse old `profile-pic.png`) on a glass disc with an aurora rim light.

---

## 7. Component inventory

| Component | Style | Key states / notes |
|---|---|---|
| `Button` | `primary` (solid `--color-primary-strong` + glow on hover), `glass`, `ghost`, `link` | Height 44/48, radius `full`, focus ring `2px --color-primary` offset 2, `cursor-pointer`, loading spinner + disabled |
| `MagneticButton` | wraps Button | Follows the pointer up to 8px. Desktop only. |
| `Badge` | pill, mono label | `live` (mint + pulse dot), `shipped`, `in-progress` (amber), `store` |
| `TechChip` | glass-sm, mono 12px | Icon and name. Highlighted when it matches the active lens. |
| `SectionHeading` | eyebrow `01 / EXPERIENCE` (mono, muted) + h2 with one gradient word | Shared by every section |
| `GlassCard` / `ProjectCard` | glass + optional gradient hairline | Hover: border brightens, glare follows pointer, 3D tilt ≤ 6° |
| `StatTile` | glass, `text-metric` | Count-up, caption below |
| `LensToggle` | neumorphic track + gradient knob | Two labelled options: "Product" / "Systems" |
| `ThemeToggle` | neumorphic round button | Sun/moon icon morph |
| `FilterChips` | neumorphic segmented control | Animated active pill (`layoutId`) |
| `Nav` | floating glass bar, `top-4 inset-x-4`, radius `full` | Active-section pill, condenses on scroll, mobile full-screen sheet |
| `TimelineItem` | glass card + node dot on a gradient line | Company, role, dates, product chips |
| `PhoneMockup` | CSS frame (radius 48, dynamic island, side buttons) | Screens slot, video support, iOS/Android variant |
| `BrowserMockup` | CSS chrome (traffic lights, URL pill) | Long-screenshot auto-scroll slot |
| `TerminalPanel` | elevated surface, mono, traffic lights | Typed output lines, blinking caret |
| `SystemDiagram` | SVG, nodes = glass rects, edges = gradient strokes | Packets, crash/restart, DLQ states |
| `Marquee` | CSS/GSAP infinite track | Velocity-reactive, pauses on hover |
| `ContactForm` | glass, floating labels | Inline errors (danger), success toast |
| `Footer` | surface, giant outlined "Let's build" marquee | Socials, resume downloads, back-to-top |

---

## 8. Voice & micro-copy

- First person, short and concrete. For example: "I build the app *and* the backend it talks to."
- Lead with numbers wherever they're real: 10K+ downloads, 84% coverage, ~110 orders/s, 400+ DSA.
- Hero lines by lens:
  - **Product:** "Full-stack & mobile engineer shipping apps to Play Store and App Store."
  - **Systems:** "Backend engineer building fault-tolerant, real-time systems in Erlang/OTP."
