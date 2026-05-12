# Animated Operating Model Flow — `/canvas/flow`

A new page that plays like a short film (~24s loop) showing how an idea moves through the Citizen Development operating model from first conversation to live, tracked solution.

## What the user sees

A wide horizontal "track" anchored on the page, with seven stages laid out left-to-right:

```text
Idea ─▶ Intake ─▶ Assessment ─▶ Route ─▶ Build (Studio) ─▶ Governance + Value ─▶ Live in Portfolio
```

A glowing **token** (the idea) travels along the track. As it reaches each stage:
- the stage card lifts, its icon fills with the teal accent, and a one-line caption fades in
- the connecting line draws itself in teal as the token passes
- a side panel updates with the current stage's eyebrow, title, and a 1–2 sentence plain-language explanation
- governance + value tracking briefly "attach" to the token as small chips that then travel with it for the rest of the journey (reinforces "guardrails travel with the work")

At the end the token settles into the **Living Portfolio** card, the full path stays lit, and the timeline loops after a short pause.

## Controls

Minimal, executive-feeling controls under the track:
- Play / Pause toggle
- Restart
- A thin scrubber showing progress with seven tick marks (one per stage); clicking a tick jumps to that stage
- Auto-plays on mount; respects `prefers-reduced-motion` (renders the final lit state with no motion, controls hidden)

## Page structure

1. **Top bar** — same sticky header pattern as `/canvas`, with a third nav item "Flow" marked active
2. **Hero strip** — eyebrow "Operating Model · In motion", h1 "From first idea to live solution.", one-sentence supporting line, link back to `/canvas`
3. **Animated track** — the centerpiece; sticky-ish on desktop so the side panel can update beneath it on smaller heights it stacks
4. **Stage detail panel** — to the right of the track on lg+, below on mobile; updates in sync with the active stage
5. **Legend** — small row explaining the token, the teal path, and the governance/value chips
6. **Footer CTAs** — "Open the canvas" → `/canvas`, "Open the detailed model" → `/`

## Stages (content)

| # | Stage | One-liner |
|---|---|---|
| 1 | Idea | Someone spots a better way to do the work. |
| 2 | Intake | One front door — visible to the whole network. |
| 3 | Assessment | A short, honest check of fit, risk, and reuse. |
| 4 | Route | Product line, central team, or reuse — by best fit. |
| 5 | Build · Studio | A guided environment turns the idea into a working solution. |
| 6 | Governance + Value | Guardrails sized to risk; value captured as it ships. |
| 7 | Live in Portfolio | Visible, reusable, and counted in the living portfolio. |

## Technical details

- New route file `src/routes/canvas.flow.tsx` (TanStack flat dot routing → `/canvas/flow`) with its own `head()` metadata (unique title, description, og:title, og:description). No og:image yet.
- Nav: add a "Flow" `<Link to="/canvas/flow">` to the header in `src/routes/canvas.tsx`. The header on `/` is unchanged for now (out of scope unless you want it).
- Animation: `framer-motion` only (already used on `/canvas`). No new deps.
  - A single `useReducer`-driven timeline indexes the active stage (0–6).
  - An internal `useEffect` advances the index every ~3.2s when `playing` is true; pause/restart/scrub mutate state directly.
  - Token position is interpolated along an SVG `<path>` using `motion`'s `offsetDistance` (CSS `offset-path`) for a smooth curve; fallback to translate-based animation if needed.
  - Connecting line is an SVG path with `pathLength` animated 0 → 1 segment-by-segment as the token passes each node.
  - Stage cards use `animate` props keyed off active index (lift, icon color, caption fade).
  - `useReducedMotion()` short-circuits to the final lit state.
- Styling: semantic tokens only (`bg-card`, `border-hairline`, `text-teal`, `bg-teal-soft`, `text-muted-foreground`, `shadow-soft`). Reuse existing eyebrow tracking and type scale from `/canvas` for consistency.
- Responsive: lg+ horizontal track + side panel; below lg the track wraps to vertical (top-to-bottom) and the side panel collapses into the active card.
- A11y: track has `role="group" aria-label="Operating model flow"`; current stage announced via `aria-live="polite"` in the side panel; controls are real `<button>`s with labels; scrubber ticks are keyboard-focusable.
- No backend, no data fetching, all content as typed `const` arrays at the top of the route file.

## Out of scope

- No changes to `/` or the canvas hero image
- No new icons beyond what's already imported from `lucide-react`
- No analytics, no persistence of playback state across visits
