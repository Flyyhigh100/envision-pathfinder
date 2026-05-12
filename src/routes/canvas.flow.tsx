import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useReducer, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Lightbulb,
  Inbox,
  GitBranch,
  Network,
  Sparkles,
  ShieldCheck,
  Library,
  Play,
  Pause,
  RotateCcw,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/canvas/flow")({
  head: () => ({
    meta: [
      { title: "Operating Model in Motion — AI Citizen Development" },
      {
        name: "description",
        content:
          "Watch how an idea moves through the Citizen Development operating model — from intake to a live, governed, value-tracked solution.",
      },
      { property: "og:title", content: "Operating Model in Motion — AI Citizen Development" },
      {
        property: "og:description",
        content:
          "An animated end-to-end flow of the Citizen Development operating model — intake, assessment, routing, build, governance, and portfolio.",
      },
    ],
  }),
  component: FlowPage,
});

// --- Stages ---------------------------------------------------------------

type Stage = {
  id: string;
  eyebrow: string;
  title: string;
  caption: string;
  detail: string;
  icon: typeof Compass;
};

const STAGES: Stage[] = [
  {
    id: "idea",
    eyebrow: "01 · Spark",
    title: "An idea",
    caption: "Someone spots a better way to do the work.",
    detail:
      "It starts where the work happens — a person closest to the problem sees a chance to make something easier, faster, or smarter.",
    icon: Lightbulb,
  },
  {
    id: "intake",
    eyebrow: "02 · Intake",
    title: "One front door",
    caption: "Visible to the whole network.",
    detail:
      "Every idea enters the same way. No back channels, no lost requests — the network can see what's coming in and pick up what fits.",
    icon: Inbox,
  },
  {
    id: "assessment",
    eyebrow: "03 · Assessment",
    title: "A short, honest check",
    caption: "Fit, risk, and reuse — quickly.",
    detail:
      "We look at value, complexity, risk, and whether something already exists. The goal is a clear answer fast, not a long queue.",
    icon: GitBranch,
  },
  {
    id: "route",
    eyebrow: "04 · Route",
    title: "Best-placed owner",
    caption: "Product line, central team, or reuse.",
    detail:
      "Work is routed by fit and capacity — not always upward, not always central. The best-placed team picks it up.",
    icon: Network,
  },
  {
    id: "build",
    eyebrow: "05 · Build",
    title: "Studio turns ideas into solutions",
    caption: "A guided build environment.",
    detail:
      "The Citizen Development Studio gives the builder the patterns, components, and guardrails to ship a working solution with confidence.",
    icon: Sparkles,
  },
  {
    id: "guard",
    eyebrow: "06 · Guardrails + Value",
    title: "Governance and value travel together",
    caption: "Guardrails sized to risk; value captured as it ships.",
    detail:
      "Governance is part of the work, not bolted on. Value signals are captured at delivery so we know what the work is actually worth.",
    icon: ShieldCheck,
  },
  {
    id: "live",
    eyebrow: "07 · Live",
    title: "In the living portfolio",
    caption: "Visible, reusable, counted.",
    detail:
      "The solution lands in a shared portfolio — visible to the network, available for reuse, and counted in the picture of what we've built.",
    icon: Library,
  },
];

const STAGE_MS = 3200;

// --- Reducer --------------------------------------------------------------

type State = { index: number; playing: boolean };
type Action =
  | { type: "tick" }
  | { type: "play" }
  | { type: "pause" }
  | { type: "toggle" }
  | { type: "restart" }
  | { type: "jump"; index: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "tick":
      return { ...state, index: (state.index + 1) % STAGES.length };
    case "play":
      return { ...state, playing: true };
    case "pause":
      return { ...state, playing: false };
    case "toggle":
      return { ...state, playing: !state.playing };
    case "restart":
      return { index: 0, playing: true };
    case "jump":
      return { ...state, index: action.index };
  }
}

// --- Page -----------------------------------------------------------------

function FlowPage() {
  const reduced = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, {
    index: 0,
    playing: !reduced,
  });

  useEffect(() => {
    if (!state.playing || reduced) return;
    const t = setTimeout(() => dispatch({ type: "tick" }), STAGE_MS);
    return () => clearTimeout(t);
  }, [state.playing, state.index, reduced]);

  const active = reduced ? STAGES.length - 1 : state.index;
  const stage = STAGES[active];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-charcoal text-primary-foreground">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-medium">AI Citizen Development · Operating Model</div>
              <div className="text-[11px] text-muted-foreground">In Motion</div>
            </div>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-teal"
            >
              Detailed model
            </Link>
            <Link
              to="/canvas"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-teal"
            >
              Canvas
            </Link>
            <Link
              to="/canvas/flow"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal"
            >
              Flow
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-14 md:pb-14 md:pt-20">
          <div className="max-w-3xl">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Operating Model · In motion
            </span>
            <h1 className="mt-5 text-3xl leading-[1.1] md:text-[40px]">
              From first idea to live solution.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Watch a single idea move through the model — one front door, the right owner, a guided build,
              and governance and value travelling with the work.
            </p>
          </div>
        </div>
      </section>

      {/* Animated track */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div>
            <FlowTrack active={active} reduced={!!reduced} />

            {/* Controls */}
            {!reduced && (
              <div className="mt-8 flex flex-col gap-4">
                <Scrubber active={active} onJump={(i) => dispatch({ type: "jump", index: i })} />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch({ type: "toggle" })}
                    className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-foreground transition-colors hover:border-teal/40 hover:text-teal"
                    aria-label={state.playing ? "Pause" : "Play"}
                  >
                    {state.playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {state.playing ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={() => dispatch({ type: "restart" })}
                    className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-teal/40 hover:text-teal"
                    aria-label="Restart"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restart
                  </button>
                  <div className="ml-auto text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
                    Stage {active + 1} / {STAGES.length}
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal shadow-[0_0_0_4px_color-mix(in_oklab,var(--teal)_18%,transparent)]" />
                The idea, travelling
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-[2px] w-6 rounded-full bg-teal" />
                Path lit as it passes
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3 w-3 text-teal" />
                <TrendingUp className="h-3 w-3 text-teal" />
                Governance + value travel with the work
              </span>
            </div>
          </div>

          {/* Side panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="rounded-2xl border border-hairline bg-card p-6 shadow-soft"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-teal">
                    {stage.eyebrow}
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-teal-soft text-teal">
                      <stage.icon className="h-4 w-4" />
                    </span>
                    <h2 className="text-[17px] font-medium leading-snug">{stage.title}</h2>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                    {stage.detail}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 border-t border-hairline pt-4">
                <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                  Travelling with the work
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip label="Governance" icon={ShieldCheck} on={active >= 5} />
                  <Chip label="Value" icon={TrendingUp} on={active >= 5} />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4 px-1">
              <Link
                to="/canvas"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-teal"
              >
                Open the canvas
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-teal"
              >
                Detailed model
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

// --- Track ---------------------------------------------------------------

function FlowTrack({ active, reduced }: { active: number; reduced: boolean }) {
  return (
    <div
      role="group"
      aria-label="Operating model flow"
      className="rounded-2xl border border-hairline bg-surface/40 p-5 md:p-8"
    >
      {/* Desktop / tablet — horizontal */}
      <div className="hidden md:block">
        <HorizontalTrack active={active} reduced={reduced} />
      </div>
      {/* Mobile — vertical */}
      <div className="md:hidden">
        <VerticalTrack active={active} />
      </div>
    </div>
  );
}

function HorizontalTrack({ active, reduced }: { active: number; reduced: boolean }) {
  const n = STAGES.length;
  // node centers as percentages along the track
  const positions = STAGES.map((_, i) => ((i + 0.5) / n) * 100);
  const tokenLeft = `${positions[active]}%`;

  return (
    <div className="relative">
      {/* Track line */}
      <div className="relative mx-2 h-[2px] rounded-full bg-hairline">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-teal"
          initial={false}
          animate={{
            width: reduced ? "100%" : `${positions[active]}%`,
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
        {/* Token */}
        {!reduced && (
          <motion.div
            className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={{ left: tokenLeft }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <span className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-teal/40" />
              <span className="relative h-3 w-3 rounded-full bg-teal shadow-[0_0_0_5px_color-mix(in_oklab,var(--teal)_15%,transparent)]" />
            </span>
          </motion.div>
        )}
      </div>

      {/* Nodes */}
      <ol className="mt-6 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {STAGES.map((s, i) => {
          const passed = i <= active;
          const current = i === active;
          const Icon = s.icon;
          return (
            <li key={s.id} className="flex flex-col items-center px-1 text-center">
              <motion.div
                animate={{ y: current ? -2 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors",
                  current
                    ? "border-teal/60 bg-teal-soft text-teal shadow-soft"
                    : passed
                      ? "border-teal/30 bg-card text-teal"
                      : "border-hairline bg-card text-muted-foreground/60",
                )}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              <div
                className={cn(
                  "mt-3 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors",
                  current ? "text-foreground" : "text-muted-foreground/70",
                )}
              >
                {s.title.split(" ").slice(0, 3).join(" ")}
              </div>
              <AnimatePresence>
                {current && (
                  <motion.div
                    key="cap"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1.5 max-w-[14ch] text-[11px] leading-snug text-muted-foreground"
                  >
                    {s.caption}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function VerticalTrack({ active }: { active: number }) {
  return (
    <ol className="relative space-y-5 pl-6">
      <div className="absolute left-2 top-1 h-[calc(100%-0.5rem)] w-[2px] rounded-full bg-hairline" />
      <motion.div
        className="absolute left-2 top-1 w-[2px] rounded-full bg-teal"
        initial={false}
        animate={{ height: `${((active + 1) / STAGES.length) * 100}%` }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      {STAGES.map((s, i) => {
        const passed = i <= active;
        const current = i === active;
        const Icon = s.icon;
        return (
          <li key={s.id} className="relative">
            <span
              className={cn(
                "absolute -left-[18px] top-1 inline-flex h-3 w-3 items-center justify-center rounded-full border-2 transition-colors",
                current
                  ? "border-teal bg-teal"
                  : passed
                    ? "border-teal bg-card"
                    : "border-hairline bg-card",
              )}
            />
            <div className={cn("flex items-center gap-2.5", !current && "opacity-70")}>
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-md",
                  current ? "bg-teal-soft text-teal" : "bg-card text-muted-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="text-[13px] font-medium">{s.title}</div>
            </div>
            {current && (
              <p className="mt-1 pl-[38px] text-[12px] leading-relaxed text-muted-foreground">
                {s.caption}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Scrubber({ active, onJump }: { active: number; onJump: (i: number) => void }) {
  const n = STAGES.length;
  const progress = ((active + 0.5) / n) * 100;
  return (
    <div className="relative">
      <div className="relative h-[3px] rounded-full bg-hairline">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-teal/70"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
      <div className="mt-2 flex justify-between">
        {STAGES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onJump(i)}
            aria-label={`Jump to ${s.title}`}
            className="group flex flex-col items-center"
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i <= active ? "bg-teal" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  icon: Icon,
  on,
}: {
  label: string;
  icon: typeof ShieldCheck;
  on: boolean;
}) {
  return (
    <motion.span
      animate={{
        opacity: on ? 1 : 0.45,
        scale: on ? 1 : 0.96,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]",
        on
          ? "border-teal/40 bg-teal-soft text-teal"
          : "border-hairline bg-surface/60 text-muted-foreground",
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </motion.span>
  );
}

// silence unused-import lint when ref guard isn't needed
void useRef;
