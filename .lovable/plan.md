## Goal

Add a new dedicated page — the **Operating Model Canvas** — designed for live stakeholder conversations. It shows the whole citizen development model on one screen as four horizontal layers connected by a visible spine, and lets users click any node to drill into the existing detail content on the home page.

The current home (`/`) and its `StrategyOverview` grid stay exactly as they are. The canvas is a sibling page, linked from the header, not a replacement.

## New route

`src/routes/canvas.tsx` — `/canvas`, with proper `head()` metadata (title, description, og:*).

## Page structure (single screen, four stacked layers)

```text
   ┌─ Layer 1 · Direction ──────────────────────────────────┐
   │   Vision / Why it matters     Strategy & Roadmap        │
   └────────────────────────┬───────────────────────────────┘
                            │  (sets direction for…)
   ┌─ Layer 2 · Capability Network ─────────────────────────┐
   │   Product line AI CDs ◀──shared role family──▶ Central │
   │                  ▲                                ▲    │
   │                  └─────── Training & Enablement ──┘    │
   └────────────────────────┬───────────────────────────────┘
                            │  (people who do the work)
   ┌─ Layer 3 · Flow of Work (the spine) ───────────────────┐
   │   Intake ─▶ Assessment & Routing ─▶ Build · Reuse ·    │
   │                                            Route       │
   └────────────────────────┬───────────────────────────────┘
                            │  (held up by…)
   ┌─ Layer 4 · System Enablers ────────────────────────────┐
   │   Governance & Boundaries   Value Tracking   Support   │
   └────────────────────────────────────────────────────────┘
```

Visual notes:
- One connected canvas, not a card grid. Faint hairline rails behind each layer, soft vertical connector lines between layers, a slightly heavier accent on the Flow-of-Work spine.
- Layer labels sit in the left gutter as small uppercase eyebrows.
- Capability Network shows the two "homes" as two paired tiles with a horizontal connector labelled "one role family · two homes," and Training sitting beneath as a supporting tile feeding both.
- Flow-of-work nodes are connected by arrows. A subtle annotation beneath the arrows reads "routes by fit and capacity — not always upward, not always central."
- System Enablers render as a foundation band with three equal tiles.
- Calm palette using existing tokens (`bg-card`, `border-hairline`, `text-teal`, `text-charcoal`, `text-muted-foreground`). No new colors.

## Interactions (conversation tool, not static)

- **Click any node** → navigate to `/` and open the matching detail (anchor for `vision`/`roadmap`, modal node for the rest). Reuse the existing `StrategyTarget` mechanism by passing a query param (e.g. `?open=intake` or `#vision`) that the home route reads on mount and opens accordingly.
- **Hover a node** → connectors related to that node brighten; others dim. Helps explain handoffs in a live walk-through.
- **Lens chips** at the top of the canvas (small, optional, off by default) to highlight a single relationship at a time:
  - "Where work enters" → highlight Intake + connector to capability network
  - "Who picks it up" → highlight both capability tiles + Build·Reuse·Route
  - "How routing works" → highlight Assessment + Build·Reuse·Route + the routing annotation
  - "What supports the model" → highlight Layer 4 enablers + their connectors upward
  Lenses are pure visual emphasis (opacity / accent), not filters that hide content.
- **"Open detail"** affordance on each node (small `ArrowUpRight`) makes click-through obvious.

## Wiring to existing content

- Reuse `STRATEGY_NODES` data (extract to `src/lib/strategy-nodes.ts` so both `/` and `/canvas` import it; no behavioural change to home).
- On `/`, read `location.search` / `location.hash` once on mount: if `?open=<nodeId>` is present, set `openId`; if a hash matches a section, scroll to it. This lets the canvas deep-link cleanly.
- Header gets a new `<Link to="/canvas">Canvas</Link>` next to the existing "Overview" link, on both `/` and `/canvas`. Canvas page has a matching link back to `/` ("Detailed model").

## Framing copy on the canvas

- Eyebrow: `OPERATING MODEL CANVAS`
- Title (single line, restrained): `One page. The whole way of working.`
- Subtitle: `A working view for stakeholder conversations — direction, the people who do the work, how work flows, and what holds it all up.`
- Footnote under the spine: `Product line and central AI citizen developers are one role family in two organisational homes. Work routes to its most natural owner by origin, fit, skill, and capacity.`

## Out of scope

- No changes to `NODES`, `SCENARIOS`, `ROLES`, phase/role toggles, or any modal content.
- No new colors, fonts, or design tokens.
- No backend, no data fetching.

## Files touched

- **new** `src/routes/canvas.tsx` — the canvas page + layout + connectors + lens chips.
- **new** `src/lib/strategy-nodes.ts` — extract `STRATEGY_NODES` and `StrategyTarget` types so both routes share them.
- **edit** `src/routes/index.tsx` — import shared strategy nodes; add header `Canvas` link; on mount, honor `?open=<nodeId>` and `#<anchor>` for deep links from the canvas.
