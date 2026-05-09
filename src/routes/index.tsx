import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Inbox,
  Gauge,
  GitBranch,
  Library,
  TrendingUp,
  GraduationCap,
  ShieldCheck,
  X,
  CircleDot,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

// --- Domain data -----------------------------------------------------------

type PhaseKey = "now" | "next" | "north";
type RoleKey = "business" | "citizen" | "consultant" | "governance" | "factory";

const PHASES: Record<
  PhaseKey,
  { label: string; horizon: string; tagline: string; mood: string }
> = {
  now: {
    label: "Now",
    horizon: "0 – 6 months",
    tagline: "Make what we already have work, end to end.",
    mood: "Realistic with current capabilities. Lightweight intake, a small set of patterns, hands-on support.",
  },
  next: {
    label: "Next",
    horizon: "6 – 18 months",
    tagline: "Add structure where the volume now demands it.",
    mood: "Reuse becomes the default. Training scales. Governed data and routing get clearer rails.",
  },
  north: {
    label: "North Star",
    horizon: "18 months +",
    tagline: "An adaptive AI citizen development capability.",
    mood: "More people building safely. A living portfolio. Value visible. The factory handles the heavy lifts.",
  },
};

const ROLES: Record<RoleKey, { label: string; short: string }> = {
  business: { label: "Business User", short: "Business" },
  citizen: { label: "Citizen Developer", short: "Citizen Dev" },
  consultant: { label: "Central AI Consultant", short: "AI Consultant" },
  governance: { label: "Data & Governance", short: "Governance" },
  factory: { label: "AI Factory", short: "AI Factory" },
};

type NodeId =
  | "intake"
  | "assessment"
  | "route"
  | "portfolio"
  | "value"
  | "training"
  | "governance";

type Node = {
  id: NodeId;
  title: string;
  group: "intake" | "shaping" | "delivery" | "scale" | "guardrails";
  icon: typeof Compass;
  definition: string;
  why: string;
  practice: string;
  involved: string[];
  current: string;
  future: Record<Exclude<PhaseKey, "now">, string>;
  audience: Record<RoleKey, string>;
};

const NODES: Node[] = [
  {
    id: "intake",
    title: "Idea Intake",
    group: "intake",
    icon: Inbox,
    definition: "A single, low-friction front door for any AI idea, from anyone in the business.",
    why: "Without one entry point, ideas get lost, duplicated or quietly built in shadow. A clear intake makes the pipeline visible.",
    practice:
      "Anyone submits an idea in a few short fields. It is acknowledged within days, not weeks, and routed to the right next step.",
    involved: ["Business user", "Central AI consultant"],
    current:
      "A simple form plus a triage call each week. Light tagging by domain, data sensitivity and effort.",
    future: {
      next: "Intake feeds a shared backlog. Patterns are tagged automatically. Submitters can see status.",
      north:
        "Conversational intake that suggests reuse, surfaces similar live solutions and proposes a shaped next step.",
    },
    audience: {
      business: "One place to bring an idea. You don't need to know who owns what.",
      citizen: "Visibility into what's already in flight before you start building.",
      consultant: "Demand is legible. Triage replaces ad-hoc requests.",
      governance: "Sensitive ideas surface early, not after a build.",
      factory: "A clean signal of where complex work is forming.",
    },
  },
  {
    id: "assessment",
    title: "Opportunity Assessment",
    group: "shaping",
    icon: Gauge,
    definition: "A short, repeatable shaping step that decides what an idea actually is.",
    why: "Most ideas are not what they first look like. A few targeted questions prevent wasted builds and misrouted work.",
    practice:
      "A 30-minute shaping conversation against a small rubric: value, complexity, data sensitivity, audience, reuse potential.",
    involved: ["Central AI consultant", "Submitter", "Citizen developer (when relevant)"],
    current:
      "A one-page rubric. Two consultants triage together. Output is a recommendation, not a verdict.",
    future: {
      next: "Rubric is embedded in intake. Common patterns auto-suggest a recommendation for human review.",
      north:
        "Shaping draws on portfolio history. The model learns which assessments held up and which didn't.",
    },
    audience: {
      business: "A quick, honest read on whether this is worth building and how.",
      citizen: "Clear scope before you commit time.",
      consultant: "Your judgement, applied consistently and visibly.",
      governance: "Risk is named at the start, not discovered late.",
      factory: "Only the work that genuinely needs you reaches you.",
    },
  },
  {
    id: "route",
    title: "Build · Reuse · Route",
    group: "delivery",
    icon: GitBranch,
    definition: "The decision on how an idea becomes a working solution: build it, reuse something, or route it on.",
    why: "Treating every idea as a fresh build is the fastest way to fragment the estate. Reuse and routing protect both speed and coherence.",
    practice:
      "Four clear paths: build it locally, reuse an existing solution with light tailoring, route to a product line that already owns the space, or escalate to the AI factory.",
    involved: ["Citizen developer", "Central AI consultant", "Product line owner", "AI factory (when escalated)"],
    current:
      "Decision made in shaping. Reuse encouraged but mostly word-of-mouth. Routing relies on known relationships.",
    future: {
      next: "Reuse-first by default. Product line catalogues are searchable. Routing has named owners.",
      north:
        "The model recommends a path with confidence. Handoffs are warm and tracked end to end.",
    },
    audience: {
      business: "A clear answer on what happens next, and who owns it.",
      citizen: "Permission to reuse, and credit for doing so.",
      consultant: "A consistent way to make the call, defendable later.",
      governance: "Routing decisions are recorded and reviewable.",
      factory: "Escalations arrive shaped and justified, not raw.",
    },
  },
  {
    id: "portfolio",
    title: "Portfolio & Community",
    group: "scale",
    icon: Library,
    definition: "A living view of what's been built, by whom, and a community that keeps it useful.",
    why: "A portfolio prevents reinvention. A community keeps it honest, current, and worth searching.",
    practice:
      "Every solution is registered with owner, audience, status and a short demo. A monthly community session shares patterns and retires what isn't used.",
    involved: ["Citizen developers", "Central AI consultant", "Product lines"],
    current:
      "A simple registry plus a monthly show-and-tell. Ownership of stale items reviewed quarterly.",
    future: {
      next: "Searchable catalogue with usage signals. Reuse paths from any entry. Recognised contributor roles.",
      north:
        "Portfolio is the default starting point for every new idea. Community is self-sustaining across product lines.",
    },
    audience: {
      business: "A place to find what already exists before asking for something new.",
      citizen: "Your work is seen, reused and credited.",
      consultant: "A real artefact to point at, not a slide.",
      governance: "Visibility of the estate, including what to retire.",
      factory: "Patterns from the field inform what to industrialise.",
    },
  },
  {
    id: "value",
    title: "Value Tracking",
    group: "scale",
    icon: TrendingUp,
    definition: "A lightweight way to capture whether solutions are actually used and useful.",
    why: "Without any read on value, the programme cannot defend itself, prioritise, or learn. Heavy measurement, however, kills momentum.",
    practice:
      "Each solution carries a one-line value hypothesis and a simple usage signal. Quarterly review groups solutions into kept, improved, retired.",
    involved: ["Solution owner", "Central AI consultant", "Sponsor"],
    current:
      "Self-reported value note plus basic usage. Deliberately light to avoid theatre.",
    future: {
      next: "Standard signals (usage, time saved, satisfaction) collected consistently. Quarterly portfolio read-out.",
      north:
        "Value evidence informs funding and routing decisions. Stays proportionate — never a tax on small wins.",
    },
    audience: {
      business: "Confidence that what you sponsored is worth keeping.",
      citizen: "A simple way to show your work mattered.",
      consultant: "Evidence to prioritise the next wave.",
      governance: "A basis to retire solutions that no longer earn their place.",
      factory: "Signal on which patterns deserve enterprise-grade investment.",
    },
  },
  {
    id: "training",
    title: "Training & Enablement",
    group: "scale",
    icon: GraduationCap,
    definition: "How more people become safely capable of building useful AI solutions.",
    why: "Scale comes from more capable hands, not more central capacity. Enablement is the multiplier.",
    practice:
      "A short onboarding path, office hours each week, paired-build sessions, and a small library of patterns that work.",
    involved: ["Central AI consultant", "Citizen developers", "Data & governance"],
    current:
      "Onboarding session, weekly office hours, a starter pattern library. Personal coaching where it matters most.",
    future: {
      next: "Role-based learning paths. Certified citizen developers. Pattern library kept current by the community.",
      north:
        "Enablement embedded in product lines. New joiners productive in weeks, not quarters.",
    },
    audience: {
      business: "Help when you need it, not a six-week course you don't have time for.",
      citizen: "A real path from first build to confident contributor.",
      consultant: "Your time spent on shaping, not repeating the basics.",
      governance: "Builders who understand the boundaries before they hit them.",
      factory: "A pipeline of capable people you can collaborate with.",
    },
  },
  {
    id: "governance",
    title: "Governance & Boundaries",
    group: "guardrails",
    icon: ShieldCheck,
    definition: "The clear, lightweight rules that say what is safe to build where, and with which data.",
    why: "Without boundaries, citizen development slows or breaks. With heavy ones, it never starts. The point is to make safe, fast.",
    practice:
      "A short policy on data classes, allowed patterns, and review thresholds. Anything above the line goes through a defined review; anything below is encouraged.",
    involved: ["Data & governance", "Central AI consultant", "AI factory (for escalations)"],
    current:
      "A one-page policy. Defined thresholds for review. Sensitive data routes via approved patterns only.",
    future: {
      next: "Patterns and connectors are pre-approved. Review focuses on edge cases, not every build.",
      north:
        "Guardrails are encoded in the platform. Most builds are safe by construction; review is exception-based.",
    },
    audience: {
      business: "Confidence that what's encouraged is genuinely safe.",
      citizen: "Clear lines so you can move fast inside them.",
      consultant: "A defensible answer when shaping work.",
      governance: "Proportionate control without becoming a bottleneck.",
      factory: "Clean handover for anything that needs enterprise-grade controls.",
    },
  },
];

type Scenario = {
  id: string;
  title: string;
  prompt: string;
  path: NodeId[];
  start: NodeId;
  outcome: string;
  involves: RoleKey[];
  next: string;
  reactions: Record<PhaseKey, string>;
};

const SCENARIOS: Scenario[] = [
  {
    id: "exec-quick",
    title: "Executive needs a quick solution",
    prompt: "A leader has a clear, narrow need and wants something usable soon.",
    path: ["intake", "assessment", "route"],
    start: "intake",
    outcome: "Built locally by a citizen developer with shaping support.",
    involves: ["business", "consultant", "citizen"],
    next: "Register in portfolio, capture a one-line value hypothesis, set a 6-week check-in.",
    reactions: {
      now: "Shaped within a week. Built with a known pattern. Live in two to three weeks.",
      next: "Reuse check first. If nothing fits, a citizen developer builds against a paved pattern.",
      north: "Intake suggests a reusable solution on the spot. Tailoring takes days, not weeks.",
    },
  },
  {
    id: "reuse",
    title: "A product line already has a similar tool",
    prompt: "The idea overlaps meaningfully with something a product line already runs.",
    path: ["intake", "assessment", "portfolio", "route"],
    start: "intake",
    outcome: "Routed to the existing owner; the requester becomes a second user, not a second build.",
    involves: ["business", "consultant", "citizen"],
    next: "Owner tailors lightly if needed. Reuse credited. Avoided build logged for the portfolio view.",
    reactions: {
      now: "Match found in shaping conversation. Warm intro to the owning team.",
      next: "Catalogue surfaces the match at intake. Reuse path is the default recommendation.",
      north: "Reuse happens before a request becomes a build. Most overlap is resolved in seconds.",
    },
  },
  {
    id: "no-time",
    title: "Business user has an idea but no time",
    prompt: "A strong idea from someone who cannot build it themselves.",
    path: ["intake", "assessment", "route", "training"],
    start: "intake",
    outcome: "Paired with a citizen developer who builds it; submitter stays as the product owner.",
    involves: ["business", "citizen", "consultant"],
    next: "Light enablement so the submitter can iterate later. Solution registered with both names.",
    reactions: {
      now: "Pair-up at the weekly triage. Build sized to fit a citizen developer's available time.",
      next: "Standing pool of citizen developers takes work in. Submitters get a clear timeline.",
      north: "Marketplace-style matching. Submitter follows progress without project overhead.",
    },
  },
  {
    id: "governed-data",
    title: "Idea needs governed enterprise data",
    prompt: "Useful only with data that carries real sensitivity or controls.",
    path: ["intake", "assessment", "governance", "route"],
    start: "intake",
    outcome: "Built against an approved pattern, with data access reviewed once and reused thereafter.",
    involves: ["business", "governance", "consultant", "citizen"],
    next: "Pattern added to the approved library so the next similar idea is faster.",
    reactions: {
      now: "Governance review in shaping. Approved connector pattern used. Build proceeds with confidence.",
      next: "Pre-approved data patterns cover most cases. Review is targeted at genuinely new ones.",
      north: "Safe-by-construction platform. Governance focuses on policy, not per-build sign-off.",
    },
  },
  {
    id: "escalate",
    title: "Idea should be escalated to the AI factory",
    prompt: "Real complexity, enterprise scale or critical dependencies.",
    path: ["intake", "assessment", "route", "governance"],
    start: "intake",
    outcome: "Escalated with a shaped brief: problem, value, constraints, and what's already been tried.",
    involves: ["consultant", "factory", "governance"],
    next: "Factory takes ownership. Citizen community kept informed; any interim solution clearly marked.",
    reactions: {
      now: "Warm handover with a one-page brief. Factory accepts or sends back with a reason.",
      next: "Defined escalation path with SLAs. Briefs follow a shared template.",
      north: "Continuous flow between citizen builds and factory programmes. Patterns travel both ways.",
    },
  },
];

const OPEN_QUESTIONS = [
  {
    q: "Where does ownership sit when a citizen build outgrows its original team?",
    tag: "Ownership",
  },
  {
    q: "How deep should governance go before it becomes a brake on momentum?",
    tag: "Governance depth",
  },
  {
    q: "What does training look like once demand outpaces central capacity?",
    tag: "Training scale",
  },
  {
    q: "When does value tracking move from a one-line note to something more formal?",
    tag: "Value tracking",
  },
  {
    q: "Who arbitrates when a product line and a citizen build claim the same space?",
    tag: "Routing conflicts",
  },
  {
    q: "What is the right trigger to escalate from citizen build to AI factory?",
    tag: "Escalation",
  },
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
            {ROLES[k].short}
          </button>
        );
      })}
    </div>
  );
}

function NodeCard({
  node,
  phase,
  highlighted,
  dimmed,
  step,
  isStart,
  onOpen,
}: {
  node: Node;
  phase: PhaseKey;
  highlighted: boolean;
  dimmed: boolean;
  step: number | null;
  isStart: boolean;
  onOpen: () => void;
}) {
  const Icon = node.icon;
  const stateText =
    phase === "now"
      ? node.current
      : phase === "next"
        ? node.future.next
        : node.future.north;
  return (
    <motion.button
      layout
      onClick={onOpen}
      whileHover={{ y: -2 }}
      animate={{ opacity: dimmed ? 0.45 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex h-full w-full flex-col gap-3 rounded-2xl border bg-card p-5 text-left shadow-soft transition-shadow hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        highlighted ? "border-teal/60 ring-1 ring-teal/30" : "border-hairline",
      )}
    >
      {step !== null && (
        <span
          className={cn(
            "absolute -top-2 -left-2 inline-flex h-6 w-6 items-center justify-center rounded-full border bg-card text-[11px] font-medium shadow-soft",
            isStart ? "border-teal text-teal" : "border-hairline text-foreground",
          )}
        >
          {step}
        </span>
      )}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg",
            highlighted ? "bg-teal-soft text-teal" : "bg-surface text-charcoal",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {node.group}
        </span>
      </div>
      <div>
        <h3 className="text-lg leading-snug">{node.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{node.definition}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-3">
        <span className="text-xs text-muted-foreground line-clamp-2">
          <span className="text-foreground">{PHASES[phase].label}:</span> {stateText}
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
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {node.definition}
                </p>
              </div>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">
                  Why it matters
                </h4>
                <p className="mt-2 text-base leading-relaxed">{node.why}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  What happens in practice
                </h4>
                <p className="mt-2 text-base leading-relaxed">{node.practice}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Who is involved
                </h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {node.involved.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-hairline bg-surface px-3 py-1 text-xs text-foreground"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-hairline bg-surface p-5">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  What this means for {ROLES[role].label}
                </h4>
                <p className="mt-2 text-base leading-relaxed">{node.audience[role]}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Current and future versions
                </h4>
                <div className="mt-3 space-y-3">
                  {([
                    { k: "now" as const, text: node.current },
                    { k: "next" as const, text: node.future.next },
                    { k: "north" as const, text: node.future.north },
                  ]).map(({ k, text }) => (
                    <div
                      key={k}
                      className={cn(
                        "rounded-lg border p-4 transition-colors",
                        k === phase ? "border-teal/40 bg-teal-soft/40" : "border-hairline bg-card",
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium">{PHASES[k].label}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {PHASES[k].horizon}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
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
  const [role, setRole] = useState<RoleKey>("business");
  const [openId, setOpenId] = useState<NodeId | null>(null);
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0].id);

  const openNode = useMemo(() => NODES.find((n) => n.id === openId) ?? null, [openId]);
  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId)!, [scenarioId]);

  const stepFor = (id: NodeId): number | null => {
    const idx = scenario.path.indexOf(id);
    return idx === -1 ? null : idx + 1;
  };

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
              <div className="text-sm font-medium">AI Citizen Development · Operating Model</div>
              <div className="text-[11px] text-muted-foreground">A working draft, open to refinement</div>
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
              Proposed operating model · v0.5
            </span>
            <h1 className="mt-6 text-4xl leading-[1.05] md:text-6xl">
              Make AI citizen development{" "}
              <em className="not-italic text-teal">easy, governed, and scalable</em> — so more
              people can turn ideas into useful working solutions.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              This is one clear way to think about it — not the final answer. Use the map below
              to see how each part of the model works <em className="not-italic">Now</em>, what
              comes <em className="not-italic">Next</em>, and where it points{" "}
              <em className="not-italic">long term</em>. React, push back, refine.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 md:hidden">
              <RoleToggle role={role} setRole={setRole} />
              <PhaseToggle phase={phase} setPhase={setPhase} />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-teal" /> Click any area to open its
                detail
              </span>
              <span className="inline-flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-teal" /> Toggle the phase to see how it
                evolves
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
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              02 · Operating model map
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl">The shape, in seven areas.</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              From an idea coming in, to a working solution that's safe, found and reused. Click
              any area to dig in.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Reading as <span className="text-foreground">{ROLES[role].label}</span> · phase{" "}
            <span className="text-foreground">{PHASES[phase].label}</span>
          </div>
        </div>

        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {NODES.map((n) => (
            <NodeCard
              key={n.id}
              node={n}
              phase={phase}
              highlighted={false}
              dimmed={false}
              step={null}
              isStart={false}
              onOpen={() => setOpenId(n.id)}
            />
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
            <h2 className="mt-2 text-3xl md:text-4xl">How does the model handle real situations?</h2>
            <p className="mt-3 text-muted-foreground">
              Pick a scenario. The map highlights the path through the model, and you can see how
              the response evolves across phases.
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

          <div className="space-y-6">
            {/* Path through the model */}
            <motion.div
              key={`${scenario.id}-path`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-hairline bg-card p-6 shadow-soft"
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-teal">
                Path through the model
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {scenario.path.map((id, i) => {
                  const n = NODES.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <button
                        onClick={() => setOpenId(id)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          id === scenario.start
                            ? "border-teal bg-teal-soft text-accent-foreground"
                            : "border-hairline bg-surface text-foreground hover:border-teal/40",
                        )}
                      >
                        <span className="font-mono text-[10px] text-muted-foreground">{i + 1}</span>
                        {n.title}
                      </button>
                      {i < scenario.path.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Likely outcome
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed">{scenario.outcome}</p>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Likely next step
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed">{scenario.next}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Who gets involved
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {scenario.involves.map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-hairline bg-surface px-3 py-1 text-xs"
                    >
                      {ROLES[r].label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Phase reactions */}
            <div className="grid gap-4 md:grid-cols-3">
              {(Object.keys(PHASES) as PhaseKey[]).map((k) => (
                <motion.div
                  key={`${scenario.id}-${k}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={cn(
                    "flex flex-col rounded-2xl border p-5 transition-colors",
                    k === phase ? "border-teal/40 bg-card shadow-soft" : "border-hairline bg-card",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{PHASES[k].label}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {PHASES[k].horizon}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed">{scenario.reactions[k]}</p>
                </motion.div>
              ))}
            </div>

            {/* Mini-map showing highlighted nodes */}
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Highlighted on the map
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {NODES.map((n) => {
                  const step = stepFor(n.id);
                  const highlighted = step !== null;
                  return (
                    <NodeCard
                      key={n.id}
                      node={n}
                      phase={phase}
                      highlighted={highlighted}
                      dimmed={!highlighted}
                      step={step}
                      isStart={n.id === scenario.start}
                      onOpen={() => setOpenId(n.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In practice */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              04 · How this works in practice
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl">From idea to working solution.</h2>
            <p className="mt-3 text-muted-foreground">
              The model in plain language: an idea comes in, gets shaped, becomes a build, a
              reuse, or a route — with support around it and a record of value left behind.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-hairline bg-surface p-4 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-teal" />
              Less ceremony. More working solutions in the right hands.
            </div>
          </div>

          <ol className="relative space-y-8 border-l border-hairline pl-6">
            {[
              {
                w: "Step 1",
                t: "Idea comes in",
                d: "Anyone submits in a few short fields. Acknowledged within days.",
              },
              {
                w: "Step 2",
                t: "Shaped, not judged",
                d: "A 30-minute conversation against a small rubric: value, complexity, data, audience, reuse.",
              },
              {
                w: "Step 3",
                t: "Build · reuse · route decision",
                d: "Build it locally, reuse what exists, route to a product line, or escalate to the AI factory.",
              },
              {
                w: "Step 4",
                t: "Support along the way",
                d: "Office hours, paired build sessions, a small library of patterns that work.",
              },
              {
                w: "Step 5",
                t: "Value captured, lightly",
                d: "A one-line value hypothesis and a simple usage signal. Enough to learn, not enough to drown in.",
              },
              {
                w: "Step 6",
                t: "Learning reused",
                d: "What worked becomes a pattern. What didn't is retired. The next idea starts from a better place.",
              },
            ].map((s, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] top-1 inline-flex h-3 w-3 items-center justify-center rounded-full border border-teal bg-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                </span>
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-teal">
                  {s.w}
                </div>
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
                05 · Open questions & refinement areas
              </div>
              <h2 className="mt-2 text-3xl md:text-4xl">Where this draft is least confident.</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                These are the places to push on. They are open on purpose — bringing opinions
                here is the point of the conversation.
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
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {q.tag}
                  </div>
                  <p className="mt-1 text-base leading-relaxed">{q.q}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground">
          <span>A working artefact, intended to be marked up.</span>
          <span>AI Citizen Development · Operating Model · v0.5 · Internal review</span>
        </div>
      </footer>

      <DetailPanel node={openNode} phase={phase} role={role} onClose={() => setOpenId(null)} />
    </div>
  );
}
