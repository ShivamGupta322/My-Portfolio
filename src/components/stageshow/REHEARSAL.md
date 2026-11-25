# Rehearsal notes: backend card scenes

Faux product scenes for the three backend project cards in "More projects"
(`BackendScenes.tsx`), built with the Stageshow kit copied from
`.agents/skills/stageshow/kit` (MIT, see `kit/LICENSE`).

## Gold copied

| Scene | Gold | What was kept |
|---|---|---|
| Order processing | `dark-hero` | Dark depth from surface steps, one lit color (success) once, the status changing on one pill with spinner and dot sharing a cell |
| VoIP | `form-error` / `parts` (Check) | One mark from pending to done per step, a rail between steps, a timer that starts only on the payoff |
| Nearby | `corner-chip` | A chip centered on the card's top-right corner, half outside, over chrome only, saying one fact |

## What changed from the gold

- No window chrome: the grid already shows two browser windows, so each card
  is a single component (`references/bento.md`, rule 3).
- Layout "pinned, bottom bleed" in a 400 × 250 stage (16:10, the card's media
  slot); `compact` 340 × 212 below 390px, a closer crop at ~1:1.
- Site tokens: DM Sans, the Midnight Aurora surface `#1a1b26`, cyan accent;
  the faint ink raised to `#8e8ea6` for 12px labels on that surface.
- `play="once"`: grid tiles play when first seen, never loop against each
  other; `poster` is the payoff (reduced motion).

## Real strings (budget 3 to 7)

- Order: `order_worker_sup`, throughput, `worker_2`, its status, the crash
  reason, "Restarted by supervisor · 0 orders lost".
- VoIP: "Incoming call", the masked number, three routing steps, the timer.
- Nearby: "Nearby", "6 within 1 km", two messages, the chip.

## Checked

- Desktop 1440 (stage at ~0.92) and phone 375 (compact, ~0.98).
- Smallest text on the phone layout 10.8px; chip keeps an 18px gutter
  (card gutter 16px); payoff rows whole above the bleed.
- Typecheck and lint clean.

## Not checked

- `scripts/film.mjs --gate`: needs `playwright-core` and Google Chrome, which
  aren't installed on this machine (Edge only). Install both, or set
  `CHROME_PATH` to Edge, and film the cards at 1440 and 390 to run the gate.
- Light site theme: the scenes stay dark there by design (a console reads as
  a console), but weren't filmed in it.
