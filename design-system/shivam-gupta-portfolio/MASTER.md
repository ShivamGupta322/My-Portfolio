# Design System Master File

> **LOGIC:** When building a specific page or section, first check `design-system/shivam-gupta-portfolio/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.
>
> Human-readable detail: [`docs/DESIGN_SYSTEM.md`](../../docs/DESIGN_SYSTEM.md) · Motion: [`docs/MOTION_AND_SHOWCASE.md`](../../docs/MOTION_AND_SHOWCASE.md)

---

**Project:** Shivam Gupta Portfolio (devshivam.online)
**Generated:** 2026-11-22 with ui-ux-pro-max (`--design-system --persist`), then customised to the chosen "Midnight Aurora" direction
**Category:** Developer Portfolio (Product ⇄ Systems lens)
**Stack:** Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP/ScrollTrigger · Motion · Lenis

---

## Global Rules

### Color Palette (dark = default)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#07070C` | `--color-bg` |
| Surface | `#11121A` | `--color-surface` |
| Elevated | `#1A1B26` | `--color-elevated` |
| Glass fill / border | `rgba(255,255,255,.06)` / `rgba(255,255,255,.10)` | `--color-glass` / `--color-glass-border` |
| Text | `#F4F4F8` | `--color-fg` |
| Muted text | `#A1A1B5` | `--color-muted` |
| Primary (brand violet, glows) | `#8B5CF6` | `--color-primary` |
| Primary fill (buttons) | `#7C3AED` | `--color-primary-strong` |
| Primary text/link | `#A78BFA` | `--color-primary-text` |
| Accent (cyan) | `#22D3EE` | `--color-accent` |
| Success (Live/Shipped) | `#34D399` | `--color-success` |
| Warning (In progress) | `#FBBF24` | `--color-warning` |
| Danger | `#FB7185` | `--color-danger` |

**Light mode:** bg `#F7F7FB`, surface `#FFFFFF`, elevated `#EEF0F6`, glass `rgba(255,255,255,.80)`, border `#E2E8F0`, text `#0F172A`, muted `#475569`, primary `#7C3AED`, primary-text `#6D28D9`, accent `#0E7490`, success `#047857`, warning `#B45309`, danger `#BE123C`.

**Signature gradient:** `linear-gradient(135deg, #8B5CF6, #22D3EE)`. It's the only multi-color gradient.

**Color Notes:** Ink-black base, violet→cyan aurora, mint for "shipped". Never put white text on `#8B5CF6` (4.23:1). Use `#7C3AED`.

### Typography

- **Display/Heading Font:** Space Grotesk (500/600/700)
- **Body Font:** DM Sans (400/500/700)
- **Mono Font:** JetBrains Mono (400/500/600). Used for eyebrows, metrics, chips and terminal.
- **Mood:** tech, precise, modern, confident
- Load via `next/font/google` (no CSS @import).

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Card padding, grid gap |
| `--space-xl` | `32px` | Large gaps |
| `--space-2xl` | `48px` | Block margins |
| `--space-3xl` | `64px` | Hero padding |
| `--section-y` | `clamp(6rem, 12vw, 11rem)` | Section vertical padding |

### Radius, Blur, Z-index

- Radius: 8 / 14 / 20 / 28 / full (phone frame 48)
- Blur: 8 / 16 / 24
- Z-index: 0 base · 10 raised · 20 nav · 30 overlay · 40 modal · 50 cursor/toast

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-card` | `0 0 0 1px var(--color-glass-border), 0 12px 40px -12px rgba(0,0,0,.7)` | Glass cards |
| `--shadow-lift` | `0 0 0 1px rgba(255,255,255,.14), 0 24px 60px -16px rgba(0,0,0,.8)` | Hovered cards, modals |
| `--shadow-glow` | `0 0 48px -12px rgba(139,92,246,.55)` | Primary CTA hover, featured |
| `--shadow-glow-cyan` | `0 0 40px -14px rgba(34,211,238,.5)` | Active/diagram highlights |

---

## Component Specs

### Buttons

```css
.btn-primary {
  background: #7C3AED; color: #fff;
  height: 48px; padding: 0 24px; border-radius: 9999px;
  font: 600 1rem/1 var(--font-sans);
  transition: box-shadow 200ms, background-color 200ms;
  cursor: pointer;
}
.btn-primary:hover { box-shadow: var(--shadow-glow); background: #6D28D9; }
.btn-primary:focus-visible { outline: 2px solid #8B5CF6; outline-offset: 2px; }

.btn-glass {
  background: rgba(255,255,255,.06); color: #F4F4F8;
  border: 1px solid rgba(255,255,255,.10); backdrop-filter: blur(16px);
  height: 48px; padding: 0 24px; border-radius: 9999px; cursor: pointer;
  transition: background-color 200ms, border-color 200ms;
}
.btn-glass:hover { background: rgba(255,255,255,.10); border-color: rgba(255,255,255,.18); }
```

### Cards (glass)

```css
.card {
  background: rgba(255,255,255,.06);
  backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 20px; padding: 24px;
  box-shadow: var(--shadow-card);
  transition: box-shadow 250ms, border-color 250ms;
  cursor: pointer;
}
.card:hover { box-shadow: var(--shadow-lift); border-color: rgba(255,255,255,.16); }
/* tilt/glare handled in JS with transform only, never width/height/top */
```

### Neumorphic controls (lens toggle, theme switch, filter chips ONLY)

```css
.neu       { background:#11121A; box-shadow: 6px 6px 14px #050508, -6px -6px 14px #1D1F2C; }
.neu-inset { background:#11121A; box-shadow: inset 4px 4px 10px #050508, inset -4px -4px 10px #1D1F2C; }
/* active knob/segment = brand gradient + visible text label */
```

### Inputs

```css
.input {
  height: 52px; padding: 20px 16px 8px; font-size: 16px;
  background: rgba(255,255,255,.04); color: #F4F4F8;
  border: 1px solid rgba(255,255,255,.10); border-radius: 14px;
  transition: border-color 200ms, box-shadow 200ms;
}
.input:focus { border-color: #8B5CF6; outline: none; box-shadow: 0 0 0 4px rgba(139,92,246,.20); }
.input[aria-invalid="true"] { border-color: #FB7185; }
```

### Modals / Lightbox

```css
.modal-overlay { background: rgba(7,7,12,.7); backdrop-filter: blur(8px); }
.modal { background: #11121A; border: 1px solid rgba(255,255,255,.10); border-radius: 28px; padding: 32px; box-shadow: var(--shadow-lift); max-width: 960px; width: 92%; }
```

---

## Style Guidelines

**Style:** Dark glassmorphism + aurora gradients, with neumorphic tactile controls and bento layouts

**Keywords:** glass, aurora, depth, precise, mono details, bento grid, device mockups, system diagrams

**Key Effects:** layered parallax (3 planes), scroll-scrubbed reveals, pinned device stages, glare/tilt on cards (≤ 6°), velocity marquees. Micro-interactions 150–250ms, reveals 400–700ms, ease-out-expo.

### Page Pattern

**Pattern Name:** Story-driven portfolio with case-study stages

- **Section Order:** 1. Hero (name, role, lens toggle) · 2. About + stats bento · 3. Experience timeline · 4. Featured projects (pinned stages) · 5. Project grid + archive · 6. Skills · 7. Achievements & education · 8. Contact + footer
- **CTA Placement:** Hero (View work / Download resume), each project (Live / Store / Case study), Contact section, footer
- **Conversion Focus:** recruiters should reach real shipped products and the resume within one scroll

---

## Anti-Patterns (Do NOT Use)

- ❌ Flat design without depth
- ❌ Text-heavy walls. Lead with visuals and metrics.
- ❌ Neumorphism on text containers or cards (low contrast)
- ❌ Glass over flat solid backgrounds (looks muddy) or glass on glass more than 2 levels deep
- ❌ More than 1–2 animated focal elements per viewport
- ❌ Scroll-jacking that ignores `prefers-reduced-motion`
- ❌ Animating width/height/top/left. Use transform and opacity only.
- ❌ **Emojis as icons.** Use Lucide plus Simple Icons.
- ❌ **Missing cursor:pointer** on clickable elements
- ❌ **Layout-shifting hovers**
- ❌ **Low contrast text** (< 4.5:1)
- ❌ **Instant state changes.** Always use transitions (150–300ms).
- ❌ **Invisible focus states**

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from a consistent set (Lucide + Simple Icons)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Light mode: text contrast 4.5:1 minimum, glass ≥ 80% opaque
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected (no pin/scrub/parallax/marquee)
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind the floating navbar
- [ ] No horizontal scroll on mobile
- [ ] Images have width/height + alt; LCP image is priority-loaded
