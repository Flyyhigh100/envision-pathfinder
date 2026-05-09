import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Layers,
  LineChart,
  Network,
  Sparkles,
  Target,
  Users,
  Workflow,
  X,
  CircleDot,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

// --- Domain data -----------------------------------------------------------

type PhaseKey = "now" | "next" | "north";
type RoleKey = "exec" | "product" | "ops" | "eng";

const PHASES: Record<PhaseKey, { label: string; horizon: string; tagline: string; mood: string }> = {
  now: {
    label: "Now",
    horizon: "0 – 6 months",
    tagline: "Stabilise the operating rhythm we already have.",
    mood: "Make the current shape legible. Reduce friction without redrawing the org.",
  },
  next: {
    label: "Next",
    horizon: "6 – 18 months",
    tagline: "Reshape around outcomes, not functions.",
    mood: "Introduce cross-functional pods, lightweight platform and a shared planning cadence.",
  },
  north: {
    label: "North Star",
    horizon: "18 months +",
    tagline: "An adaptive, product-led operating model.",
    mood: "Stable platforms, autonomous teams, decisions pushed to the edge.",
  },
};

const ROLES: Record<RoleKey, string> = {
  exec: "Executive",
  product: "Product",
  ops: "Operations",
  eng: "Engineering",
};

type Node = {
  id: string;
  title: string;
  group: "leadership" | "delivery" | "platform" | "enabling";
  icon: typeof Compass;
  blurb: string;
  detail: Record<PhaseKey, { state: string; signals: string[] }>;
  audience: Record<RoleKey, string>;
};

const NODES: Node[] = [
  {
    id: "strategy",
    title: "Strategy & Direction",
    group: "leadership",
    icon: Compass,
    blurb: "Where we're going and why — refreshed on a cadence, not a whim.",
    detail: {
      now: { state: "Annual plan, mid-year check-in. Owned by exec.", signals: ["One plan doc", "Quarterly business review"] },
      next: { state: "Rolling 18-month bets reviewed each quarter with pod leads.", signals: ["Bet portfolio", "Quarterly bet review"] },
      north: { state: "Continuous strategy: hypotheses, evidence, retire/double-down.", signals: ["Living thesis", "Monthly evidence loop"] },
    },
    audience: {
      exec: "You set the bets. The model gives you sharper levers and feedback.",
      product: "Clearer bets translate directly into pod missions.",
      ops: "Predictable cadence makes capacity planning tractable.",
      eng: "Fewer reorgs. Technology investment aligned to bets, not projects.",
    },
  },
  {
    id: "pods",
    title: "Delivery Pods",
    group: "delivery",
    icon: Users,
    blurb: "Small, durable teams owning an outcome end-to-end.",
    detail: {
      now: { state: "Project teams assembled per initiative, disbanded after.", signals: ["Project plans", "Resource requests"] },
      next: { state: "8 durable pods aligned to customer journeys. Shared roadmap.", signals: ["Pod missions", "Journey OKRs"] },
      north: { state: "Self-forming pods around live opportunities. Funding, not staffing.", signals: ["Opportunity backlog", "Internal funding model"] },
    },
    audience: {
      exec: "Outcome accountability lives in one team, not a matrix.",
      product: "End-to-end ownership, including discovery and measurement.",
      ops: "Stable pods make rituals and reporting cheap.",
      eng: "Long-lived ownership of services and code.",
    },
  },
  {
    id: "platform",
    title: "Platform",
    group: "platform",
    icon: Layers,
    blurb: "Shared capabilities that pods consume like a product.",
    detail: {
      now: { state: "Shared services org takes tickets. Bottleneck on critical paths.", signals: ["Ticket queue", "SLA misses"] },
      next: { state: "Platform-as-a-product with paved roads for the top 5 use cases.", signals: ["Self-serve docs", "Internal NPS"] },
      north: { state: "Platform anticipates demand. Pods rarely build undifferentiated work.", signals: ["Adoption metrics", "Time-to-first-value"] },
    },
    audience: {
      exec: "Compounds engineering investment instead of duplicating it.",
      product: "Pods focus on customer value, not plumbing.",
      ops: "Standardised observability and compliance by default.",
      eng: "A real internal product, not a help desk.",
    },
  },
  {
    id: "enabling",
    title: "Enabling Functions",
    group: "enabling",
    icon: Sparkles,
    blurb: "Design, data, security, finance — embedded where the work is.",
    detail: {
      now: { state: "Centralised, allocated to projects on request.", signals: ["Capacity matrix", "Allocation conflict"] },
      next: { state: "Hub-and-spoke: home in craft, embedded in pods.", signals: ["Craft guilds", "Pod liaisons"] },
      north: { state: "Capability flows to need. Craft excellence remains central.", signals: ["Mobility scheme", "Craft standards"] },
    },
    audience: {
      exec: "Specialist judgement near the decision, craft standards still upheld.",
      product: "Designers and analysts who know the domain.",
      ops: "Clear home for governance and compliance craft.",
      eng: "Embedded SREs and security partners in pods.",
    },
  },
  {
    id: "rhythm",
    title: "Operating Rhythm",
    group: "leadership",
    icon: Workflow,
    blurb: "The cadence of planning, review and learning that holds it together.",
    detail: {
      now: { state: "Quarterly planning + weekly status. Heavy slide prep.", signals: ["Status decks", "Quarterly resets"] },
      next: { state: "6-week pod cycles. Monthly portfolio review on real artefacts.", signals: ["Demo days", "Single source of truth"] },
      north: { state: "Continuous flow. Reviews are exceptions, not events.", signals: ["Always-on dashboards", "Async decisions"] },
    },
    audience: {
      exec: "Less ceremony, more signal.",
      product: "Cycles long enough to ship, short enough to learn.",
      ops: "A rhythm you can plan a calendar around.",
      eng: "Protected build time between reviews.",
    },
  },
  {
    id: "metrics",
    title: "Outcomes & Metrics",
    group: "delivery",
    icon: LineChart,
    blurb: "How we know it's working — leading indicators over vanity stats.",
    detail: {
      now: { state: "Output metrics: launches, tickets, utilisation.", signals: ["Velocity", "Utilisation"] },
      next: { state: "Pod-owned outcome metrics tied to the bet portfolio.", signals: ["Journey health", "Bet scorecards"] },
      north: { state: "Customer outcomes drive funding decisions.", signals: ["Customer outcome tree", "Live cohort views"] },
    },
    audience: {
      exec: "Decisions on evidence, not anecdote.",
      product: "Outcomes you can defend and adjust against.",
      ops: "Fewer competing scorecards.",
      eng: "Engineering effort visibly tied to customer value.",
    },
  },
  {
    id: "decisions",
    title: "Decision Rights",
    group: "leadership",
    icon: Target,
    blurb: "Who decides what, at which altitude.",
    detail: {
      now: { state: "Most decisions escalate. Slow but safe.", signals: ["Escalation queues", "Approval boards"] },
      next: { state: "Documented decision map. Pods own ‘inside the box’ decisions.", signals: ["Decision log", "Boundary doc"] },
      north: { state: "Decisions made at the lowest competent altitude by default.", signals: ["Reversible-by-default", "Clear non-negotiables"] },
    },
    audience: {
      exec: "Your time spent on the decisions only you can make.",
      product: "Authority to adjust scope without a steering committee.",
      ops: "Fewer ambiguous handoffs.",
      eng: "Architecture decisions owned, not committee'd.",
    },
  },
  {
    id: "talent",
    title: "Talent & Growth",
    group: "enabling",
    icon: Network,
    blurb: "How people grow without leaving the work that grew them.",
    detail: {
      now: { state: "Promotion = manage more people. IC ceiling low.", signals: ["Manager-heavy ladder"] },
      next: { state: "Dual ladders. Craft progression to senior staff.", signals: ["Updated levels", "Craft rubrics"] },
      north: { state: "Mobility across pods. Craft + leadership both rewarded.", signals: ["Internal mobility rate", "Staff-level ICs"] },
    },
    audience: {
      exec: "Retain senior talent without inflating management.",
      product: "Senior PM craft is a real path.",
      ops: "Operations craft is recognised, not assumed.",
      eng: "Staying technical is a career, not a holding pattern.",
    },
  },
];

const SCENARIOS: { id: string; title: string; prompt: string; reactions: Record<PhaseKey, string> }[] = [
  {
    id: "launch",
    title: "A new product opportunity appears mid-quarter",
    prompt: "How does the model absorb a fresh, time-sensitive bet without breaking everything else?",
    reactions: {
      now: "Re-prioritisation meeting. Something else slips. Visibility is patchy.",
      next: "Portfolio review reallocates from a lower-conviction bet. One pod re-points.",
      north: "Funded from the opportunity buffer. A pod self-forms within two weeks.",
    },
  },
  {
    id: "incident",
    title: "A critical platform incident",
    prompt: "Where does ownership land, and how quickly is the blast radius contained?",
    reactions: {
      now: "War room across teams. Ownership unclear. Lessons live in a doc no one reads.",
      next: "Platform pod owns response. Incident review feeds the paved-road backlog.",
      north: "Self-healing in many cases. Human response focuses on systemic root cause.",
    },
  },
  {
    id: "hire",
    title: "Hiring a senior specialist",
    prompt: "Where do they sit, who do they report to, and how do they have impact?",
    reactions: {
      now: "Slotted into a function. Impact depends on which projects pull them in.",
      next: "Home in their craft, embedded with a pod aligned to their expertise.",
      north: "They choose a mission. The model flexes around the strongest fit.",
    },
  },
  {
    id: "cut",
    title: "We need to reduce cost by 15%",
    prompt: "What does the model preserve, and what does it let go of, gracefully?",
    reactions: {
      now: "Across-the-board cuts. High performers leave. Capability hollows out.",
      next: "Retire two lowest-conviction bets. Pods consolidate. Platform protected.",
      north: "Funding model surfaces low-return work weekly. Cuts are continuous and small.",
    },
  },
];

const OPEN_QUESTIONS = [
  "Where exactly does the line between platform and pod sit for data?",
  "How do we fund pods without recreating project budgeting?",
  "Which decisions stay at exec, and which we genuinely push down?",
  "What does success look like in 12 months — and how would we know we were wrong?",
];

// --- Components ------------------------------------------------------------

function PhaseToggle({ phase, setPhase }: { phase: PhaseKey; setPhase: (p: PhaseKey) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-hairline bg-card p-1 shadow-soft">
      {(Object.keys(PHASES) as PhaseKey[]).map((k) => {
        const active = phase === k;
        return (
          <button
            key={k}
            onClick={() => setPhase(k)}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="phase-pill"
                className="absolute inset-0 rounded-full bg-charcoal"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{PHASES[k].label}</span>
          </button>
        );
      })}
    </div>
  );
}

function RoleToggle({ role, setRole }: { role: RoleKey; setRole: (r: RoleKey) => void }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-hairline bg-surface p-1">
      {(Object.keys(ROLES) as RoleKey[]).map((k) => {
        const active = role === k;
        return (
          <button
            key={k}
            onClick={() => setRole(k)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
              active
                ? "bg-teal-soft text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {ROLES[k]}
          </button>
        );
      })}
    </div>
  );
}

function NodeCard({
  node,
  phase,
  onOpen,
}: {
  node: Node;
  phase: PhaseKey;
  onOpen: () => void;
}) {
  const Icon = node.icon;
  const groupTone: Record<Node["group"], string> = {
    leadership: "text-charcoal",
    delivery: "text-teal",
    platform: "text-teal",
    enabling: "text-charcoal",
  };
  return (
    <motion.button
      layout
      onClick={onOpen}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full w-full flex-col gap-3 rounded-2xl border border-hairline bg-card p-5 text-left shadow-soft transition-shadow hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between">
        <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface", groupTone[node.group])}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {node.group}
        </span>
      </div>
      <div>
        <h3 className="text-lg leading-snug">{node.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{node.blurb}</p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-hairline pt-3">
        <span className="text-xs text-muted-foreground line-clamp-1">
          <span className="text-foreground">{PHASES[phase].label}:</span>{" "}
          {node.detail[phase].state}
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal" />
      </div>
    </motion.button>
  );
}

function DetailPanel({
  node,
  phase,
  role,
  onClose,
}: {
  node: Node | null;
  phase: PhaseKey;
  role: RoleKey;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {node && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-charcoal/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto border-l border-hairline bg-card shadow-lift"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-card/90 px-6 py-4 backdrop-blur">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {node.group} · {PHASES[phase].label}
              </span>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-8 px-6 py-8">
              <div>
                <h2 className="text-3xl">{node.title}</h2>
                <p className="mt-2 text-base text-muted-foreground">{node.blurb}</p>
              </div>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">
                  In the {PHASES[phase].label} phase
                </h4>
                <p className="mt-2 text-base leading-relaxed">{node.detail[phase].state}</p>
                <ul className="mt-4 space-y-2">
                  {node.detail[phase].signals.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CircleDot className="h-3.5 w-3.5 text-teal" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-hairline bg-surface p-5">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  What this means for {ROLES[role]}
                </h4>
                <p className="mt-2 text-base leading-relaxed">{node.audience[role]}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Across phases
                </h4>
                <div className="mt-3 space-y-3">
                  {(Object.keys(PHASES) as PhaseKey[]).map((k) => (
                    <div
                      key={k}
                      className={cn(
                        "rounded-lg border p-4 transition-colors",
                        k === phase
                          ? "border-teal/40 bg-teal-soft/40"
                          : "border-hairline bg-card",
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium">{PHASES[k].label}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {PHASES[k].horizon}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{node.detail[k].state}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Page ------------------------------------------------------------------

function Index() {
  const [phase, setPhase] = useState<PhaseKey>("now");
  const [role, setRole] = useState<RoleKey>("exec");
  const [openId, setOpenId] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0].id);

  const openNode = useMemo(() => NODES.find((n) => n.id === openId) ?? null, [openId]);
  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId)!, [scenarioId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-charcoal text-primary-foreground">
              <Compass className="h-3.5 w-3.5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-medium">Operating Model</div>
              <div className="text-[11px] text-muted-foreground">A working draft, not a verdict</div>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <RoleToggle role={role} setRole={setRole} />
            <PhaseToggle phase={phase} setPhase={setPhase} />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              Proposed operating model · v0.4
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] md:text-7xl">
              A clearer way to <em className="not-italic text-teal">think</em> about how we operate.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              This is one well-formed answer — not the answer. Use the map below to
              explore how each part shifts from where we are <em className="not-italic">Now</em>,
              to a sensible <em className="not-italic">Next</em>, and toward a long-term{" "}
              <em className="not-italic">North Star</em>. React, push back, refine.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 md:hidden">
              <RoleToggle role={role} setRole={setRole} />
              <PhaseToggle phase={phase} setPhase={setPhase} />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-teal" /> Click any node to open its detail
              </span>
              <span className="inline-flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-teal" /> Toggle the phase to see how it evolves
              </span>
              <span className="inline-flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-teal" /> Switch role for a tailored read
              </span>
            </div>
          </motion.div>

          {/* Phase summary card */}
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-14 grid gap-4 rounded-2xl border border-hairline bg-card p-6 shadow-soft md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-8"
          >
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Current phase
              </div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-3xl">{PHASES[phase].label}</span>
                <span className="text-xs text-muted-foreground">{PHASES[phase].horizon}</span>
              </div>
            </div>
            <div className="border-l border-hairline pl-0 md:pl-8">
              <p className="text-base leading-relaxed">{PHASES[phase].tagline}</p>
              <p className="mt-1 text-sm text-muted-foreground">{PHASES[phase].mood}</p>
            </div>
            <div className="flex items-center gap-2 self-end md:self-center">
              {(Object.keys(PHASES) as PhaseKey[]).map((k, i) => (
                <button
                  key={k}
                  onClick={() => setPhase(k)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    k === phase ? "w-10 bg-teal" : "w-5 bg-hairline hover:bg-muted-foreground/40",
                  )}
                  aria-label={`Go to ${PHASES[k].label} (step ${i + 1})`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between gap-6 pb-8">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              02 · Operating model map
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl">The shape, in eight pieces.</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Eight components that together describe how decisions, people and work move.
              Click any one to dig in.
            </p>
          </div>
        </div>

        <motion.div
          layout
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {NODES.map((n) => (
            <NodeCard key={n.id} node={n} phase={phase} onOpen={() => setOpenId(n.id)} />
          ))}
        </motion.div>
      </section>

      {/* Scenarios */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              03 · Scenario explorer
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl">How does it behave under pressure?</h2>
            <p className="mt-3 text-muted-foreground">
              A model is only as good as how it copes with the unexpected. Pick a scenario
              and watch how each phase responds.
            </p>

            <div className="mt-8 space-y-2">
              {SCENARIOS.map((s) => {
                const active = s.id === scenarioId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setScenarioId(s.id)}
                    className={cn(
                      "group flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-all",
                      active
                        ? "border-teal/40 bg-card shadow-soft"
                        : "border-hairline bg-card/40 hover:border-hairline hover:bg-card",
                    )}
                  >
                    <div>
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{s.prompt}</div>
                    </div>
                    <ArrowRight
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0 transition-all",
                        active ? "text-teal" : "text-muted-foreground group-hover:translate-x-0.5",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 lg:auto-rows-fr xl:grid-cols-3">
            {(Object.keys(PHASES) as PhaseKey[]).map((k) => (
              <motion.div
                key={`${scenario.id}-${k}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={cn(
                  "flex flex-col rounded-2xl border p-6 transition-colors",
                  k === phase
                    ? "border-teal/40 bg-card shadow-soft"
                    : "border-hairline bg-card",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{PHASES[k].label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {PHASES[k].horizon}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-base leading-relaxed">{scenario.reactions[k]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* In practice */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              04 · In practice
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl">A typical month, on this model.</h2>
            <p className="mt-3 text-muted-foreground">
              Less ceremony. Fewer slide reviews. More time spent on the actual work and the
              decisions that matter.
            </p>
          </div>

          <ol className="relative space-y-8 border-l border-hairline pl-6">
            {[
              { w: "Week 1", t: "Pods publish their plan for the cycle on a single page.", d: "Lightweight, comparable, no decks." },
              { w: "Week 2", t: "Portfolio review on real artefacts.", d: "Demos, dashboards and decisions — not status updates." },
              { w: "Week 3", t: "Mid-cycle adjust.", d: "Pods reallocate their own capacity. Exec only sees exceptions." },
              { w: "Week 4", t: "Learn and retire.", d: "What worked, what didn't, what we'll stop doing — written down once." },
            ].map((s, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] top-1 inline-flex h-3 w-3 items-center justify-center rounded-full border border-teal bg-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                </span>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-teal">{s.w}</div>
                <div className="mt-1 text-lg">{s.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Open questions */}
      <section className="border-t border-hairline bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                05 · Open questions
              </div>
              <h2 className="mt-2 text-3xl md:text-4xl">Where we still need to land.</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                These are the places this draft is least confident. Bring opinions — that's
                the point of this conversation.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {OPEN_QUESTIONS.map((q, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 rounded-2xl border border-hairline bg-card p-6 transition-shadow hover:shadow-soft"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface font-mono text-xs text-teal">
                  Q{i + 1}
                </span>
                <p className="text-base leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground">
          <span>A working artefact, intended to be marked up.</span>
          <span>Operating Model · v0.4 · Internal review</span>
        </div>
      </footer>

      <DetailPanel node={openNode} phase={phase} role={role} onClose={() => setOpenId(null)} />
    </div>
  );
}
