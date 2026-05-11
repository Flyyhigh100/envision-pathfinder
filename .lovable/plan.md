## Goal

Transform `/canvas` into a premium one-page strategy experience anchored by a custom-generated hero image, then progressively unpack the Citizen Development operating model layer by layer underneath — keeping the hero canvas visible as a conceptual anchor throughout.

## Page structure

```text
┌──────────────────────────────────────────────────────────────┐
│ 1. HERO / BIG PICTURE                                        │
│   • Generated wide-format system-map image (the anchor)      │
│   • Headline + 1 short paragraph                             │
│   • Quiet "Scroll to unpack" hint                            │
├──────────────────────────────────────────────────────────────┤
│ 2. FLOW OF WORK            (operational spine)               │
│ 3. SUPPORT MODEL           (travels with the work)           │
│ 4. SYSTEM ENABLERS         (governance · value · platform)   │
│ 5. PRACTICAL SCENARIOS     (4 example journeys)              │
└──────────────────────────────────────────────────────────────┘
   Sticky mini-map on the right (lg+) re-renders the hero in   
   miniature and highlights the active layer as user scrolls.  
```

## 1. Hero image (generated once, saved to `src/assets/`)

Use the agent image generator (`imagegen--generate_image`, `model: "premium"`, 1920×1024, transparent_background false) with this prompt — captured verbatim from the user's brief, tightened for a single render:

> Premium enterprise visual metaphor of a Citizen Development operating model as a single connected system map. Three horizontal layers on a calm off-white background: top layer of small elegant nodes for direction & capability, middle horizontal flow of three nodes connected by soft directional arrows for Idea Intake → Assessment → Build/Reuse/Route, bottom layer of three nodes for Governance, Value, and Community. Charcoal text accents, subtle teal highlights on the middle spine, soft thin connectors between layers, soft shadows, clean geometry, generous whitespace, modern restrained consulting aesthetic. No dashboards, no gradients, no neon, no sci-fi, minimal text inside the image.

Save to `src/assets/canvas-hero.png`. If the first render is busy or off-brief, regenerate once with a tightened prompt.

## 2. Hero section

- Full-bleed container, max-w-7xl, generous top padding.
- `<img>` of the generated hero with `loading="eager"`, soft `shadow-soft`, hairline border, rounded-2xl. Alt text describes the system map for SEO/a11y.
- Eyebrow: `Operating Model · One connected system`
- H1 (≈40px): "Citizen Development is one connected operating model."
- Sub (1 short paragraph, ~2 lines): platform, support, governance, and community working as one.
- Quiet scroll hint with chevron → `#flow`.

## 3. Layered scroll sections (`#flow`, `#support`, `#enablers`, `#scenarios`)

Reuse the existing `Layer` / `CanvasTile` / `Connector` components already in `src/routes/canvas.tsx` so the deeper sections visually echo the hero. Each section:

- Eyebrow chip with section number (`02 · Flow of Work` etc.)
- Short caption
- Existing tiles regrouped per section:
  - **Flow** → existing `FLOW` tiles (Intake, Assessment, Build·Reuse·Route)
  - **Support** → existing `SUPPORT` + `TRAINING` tile (support & community + training travels with the work)
  - **Enablers** → existing `ENABLERS` tiles (Governance, Value, Studio, Support & Community) plus a small "Way of Working tool" footnote card already present
  - **Scenarios** → new section with 4 cards:
    1. Business user with an idea → Intake → product-line picks up
    2. Product line with an existing reusable solution → reuse path
    3. Enterprise idea needing central support → central team picks up
    4. Higher-risk / cross-cutting use case → routed by complexity & governance
    Each card shows a 3-step mini path using the same pill style as the spine.

## 4. Sticky mini-map (lg+ only)

- Right-rail sticky panel (`top-24`, hidden < lg) containing a small version of the hero image (or a CSS-drawn 3-band schematic) with 4 dots labelled Flow · Support · Enablers · Scenarios.
- Uses `IntersectionObserver` on the section anchors to highlight the active dot in teal.
- Clicking a dot smooth-scrolls to that section.
- Keeps the user anchored to the big picture throughout.

## 5. Lens chips & old framing

- Remove the existing `LENSES` chips and the current "Layer 1 / Layer 2 / Layer 3 / Layer 4" framing — they become redundant once the page is structured around Hero → Flow → Support → Enablers → Scenarios.
- Keep `DIRECTION`, `NETWORK`, `TRAINING`, `FLOW`, `SUPPORT`, `ENABLERS` data — `DIRECTION` and `NETWORK` are now represented inside the hero image itself, with one short "Direction & capability" paragraph above the Flow section linking to `/#vision`, `/#roadmap`, and node `training` for users who want the deeper detail.

## 6. Routing & links

- All tiles keep their existing deep-links into `/` (anchors and node IDs) — no behaviour change there.
- Top header: keep current "Detailed model" / "Canvas" links, no new routes.

## Technical notes

- File touched: `src/routes/canvas.tsx` (rewrite component body, keep Route export & data constants).
- New asset: `src/assets/canvas-hero.png` via `imagegen--generate_image`.
- Add a tiny `useActiveSection(ids: string[])` hook inside the file using `IntersectionObserver` for the mini-map.
- Reuse existing tokens: `surface`, `card`, `hairline`, `teal`, `teal-soft`, `charcoal`, `muted-foreground`, `shadow-soft`. No new design tokens, no new dependencies.
- `framer-motion` already present — fade/rise on section enter only (no scattered micro-interactions).
- Type-check with `bunx tsc --noEmit` after implementation.

## Out of scope

- No changes to `/` (detailed model), modals, scenarios, or footer there.
- No new routes, no backend, no new packages.
- No changes to `STRATEGY_NODES`, `NODES`, `SCENARIOS`, `ROLES` data on `/`.
