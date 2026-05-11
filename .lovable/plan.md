## Goal

Add a premium **strategy canvas hero** at the very top of `/` — a single, calm, executive-grade visual that explains the entire Citizen Development operating model at a glance. Everything currently on the page (StrategyOverview, vision/roadmap hero, detailed model, scenarios, etc.) stays exactly as is, just below.

## What the hero shows

One connected canvas with three horizontal bands and an integrated support strip — minimal text, elegant connectors, generous whitespace.

```text
                          DIRECTION
        ┌──────────┐     ┌──────────────────┐     ┌────────────────────────┐
        │  Vision  │  ─  │ Strategy & Roadmap │  ─ │ Training & Enablement │
        └──────────┘     └──────────────────┘     └────────────────────────┘
                              │  guides
                          FLOW OF WORK  (the spine)
        ┌─────────────┐  →  ┌──────────────────┐  →  ┌──────────────────┐
        │   Intake    │     │  Assess & Route  │     │ Build · Reuse · Route │
        └─────────────┘     └──────────────────┘     └──────────────────┘
              ─── support model (one slim row, integrated, no org chart) ───
        Product Line AI Resources  ·  Central AI Team  ·  Shared Capacity
                              │  enables
                          SYSTEM ENABLERS
   Governance · Value Tracking · Support & Community · CD Studio · Way of Working Tool
```

- **Top band — Direction**: 3 small tiles (Vision, Strategy & Roadmap, Training & Enablement) with one-line labels.
- **Middle band — Flow of work**: the visual spine, slightly emphasised (teal hairline, soft tinted surface), 3 stages with thin arrow connectors.
- **Integrated support strip** sits *inside* the spine band as a single slim row of three pills with one-line role: *first line · enterprise & leadership path · mutual support*. No boxes-with-reporting-lines feel.
- **Bottom band — System enablers**: 5 quiet chips in one row (Governance & Boundaries, Value Tracking, Support & Community, Citizen Development Studio, Way of Working Tool).
- Two thin vertical connectors with tiny eyebrow labels (*guides* between top↔middle, *enables* between bottom↔middle) to make hierarchy obvious.

## Look & feel

- Light neutral background, charcoal text, restrained teal accents only on the spine, connectors, and active hover.
- Hairline borders, generous padding, no shadows beyond the existing `shadow-soft`.
- Reuses existing tokens (`hairline`, `teal`, `teal-soft`, `surface`, `card`, `muted-foreground`) — no new design tokens, no new dependencies.
- Subtle `framer-motion` fade/rise on mount only. No scattered micro-interactions.
- Tiles are clickable and deep-link into existing detail (same pattern as `/canvas`):
  - Direction → `#vision`, `#roadmap`, node `training`
  - Flow → nodes `intake`, `assessment`, `route`
  - Support pills → `#roles`
  - Enablers → nodes `governance`, `value`, `portfolio`, `route` (Studio), plus a quiet *Way of Working Tool* tile that scrolls to a small footnote (no new route)
- A small hint chip below the canvas: *"Scroll for the detailed model"* with a chevron — sets the "okay, how do we operationalise this?" follow-up.

## Wording rules

- Plain business language. No "rubric", no internal jargon.
- One short label + at most one short supporting line per tile.
- Reuses the already-approved phrasing from `/canvas` so the two views stay consistent.

## Where it goes

- New component `StrategyCanvasHero` rendered in `src/routes/index.tsx` **immediately after `</header>` and before `<StrategyOverview />`**, so it is the first thing seen on `/`.
- Existing sections (StrategyOverview, vision hero, roadmap, detailed model, scenarios, footer) are untouched.
- Header `Overview` link still scrolls to `#overview` (StrategyOverview). A new top anchor `#model` is added on the hero so the header can optionally point to it later — not required now.

## What stays the same

- `/canvas` route, all modals, `STRATEGY_NODES`, `NODES`, `SCENARIOS`, `ROLES`, all copy below the new hero.
- No backend, no new routes, no new packages.

## Files touched

- `src/routes/index.tsx` — add `StrategyCanvasHero` component and render it once at the top of the page. No other edits.

## Out of scope

- No changes to `/canvas` (it remains the deeper working canvas for sessions).
- No changes to detailed model, scenarios, or footer.
- No new colors, fonts, or tokens.
