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
  spine?: boolean;
  rubric?: { q: string; signals: { reuse: string; build: string; route: string } }[];
  paths?: { key: "Reuse" | "Build" | "Route"; when: string }[];
  boundary?: { role: string; does: string; when: string }[];
  tiers?: { tier: string; what: string }[];
  community?: { label: string; what: string }[];
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
    spine: true,
    definition: "The decision on how an idea becomes a working solution: build it, reuse something, or route it on.",
    why: "This is the spine of the model. Treating every idea as a fresh build fragments the estate; refusing to build kills momentum. The call made here shapes everything downstream.",
    practice:
      "A short rubric is applied in shaping. The output is a recommended path — Reuse, Build, or Route — with the reasoning visible.",
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
    rubric: [
      {
        q: "Is there already a solution that could be reused?",
        signals: { reuse: "Yes, with light tailoring", build: "Close but materially different", route: "Yes, owned by another product line" },
      },
      {
        q: "Does the use case touch sensitive or governed data?",
        signals: { reuse: "Approved pattern exists", build: "Standard data only", route: "Needs enterprise-grade controls" },
      },
      {
        q: "Is the audience local or enterprise-wide?",
        signals: { reuse: "Local, similar to existing users", build: "Local team or function", route: "Cross-business or critical" },
      },
      {
        q: "Is the effort small and local, or complex and strategic?",
        signals: { reuse: "Small tailoring", build: "Small to medium, well-shaped", route: "Complex, strategic, or load-bearing" },
      },
    ],
    paths: [
      { key: "Reuse", when: "An existing solution covers most of the need. Tailor lightly, credit the original, log the avoided build." },
      { key: "Build", when: "Local scope, standard data, citizen-developer-sized. Shape it, build it, register it." },
      { key: "Route", when: "Sensitive data, enterprise scale, or strategic dependency. Hand to a product line or escalate to the AI factory." },
    ],
    boundary: [
      { role: "Central AI consultant", does: "Shapes the idea, applies the rubric, recommends the path. Coaches citizen developers through build and reuse.", when: "Every idea passes through here." },
      { role: "AI factory", does: "Owns enterprise-grade builds: production data, scaled audiences, complex integrations, load-bearing systems.", when: "Triggered by sensitivity, scale, complexity, or strategic weight — not by ambition alone." },
    ],
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
    community: [
      { label: "Teams community", what: "Open forum for questions, patterns and quick help between citizen developers." },
      { label: "Weekly office hours", what: "Drop-in time with the central AI consultant — no booking, no agenda required." },
      { label: "Shared examples library", what: "Real working solutions, with owner, audience and what they reused." },
      { label: "Reuse showcase", what: "Visible credit when a solution is picked up by another team." },
      { label: "Monthly show-and-tell", what: "Short demos from builders. Patterns surface; stale items get retired." },
      { label: "Visible learning loop", what: "What worked, what didn't, what changed in the rubric this quarter." },
    ],
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
    definition: "The full support model that lets more people build safely — not just training.",
    why: "Scale comes from more capable hands and a place to turn when stuck. Courses alone don't deliver that.",
    practice:
      "A platform provided and evolved by the AI factory, sitting under a layered support model: self-service, community, enablement team, and technical escalation when needed.",
    involved: ["AI factory (platform)", "Central AI consultant", "Citizen developers", "Data & governance"],
    current:
      "Citizen development platform in place. Office hours, a Teams community, starter playbooks and an AI buddy assistant. Technical escalation path defined.",
    future: {
      next: "Role-based learning paths. Certified citizen developers. Playbooks kept current by the community. AI buddy guides more of the build.",
      north:
        "Enablement embedded in product lines. Self-service handles the common case; escalation is rare and clean.",
    },
    audience: {
      business: "Help when you need it, not a six-week course you don't have time for.",
      citizen: "A real path from first build to confident contributor — with backup when you hit a wall.",
      consultant: "Your time spent on shaping, not repeating the basics.",
      governance: "Builders who understand the boundaries before they hit them.",
      factory: "A platform you own, a community that uses it well, and a clean path for the issues that need you.",
    },
    tiers: [
      { tier: "Self-service", what: "Citizen development platform, playbooks, examples, AI buddy / guided assistant." },
      { tier: "Community", what: "Teams forum, peer help, monthly show-and-tell." },
      { tier: "Enablement team", what: "Office hours, paired-build sessions, coaching from the central AI consultant." },
      { tier: "Technical escalation", what: "AI factory engineering support for issues beyond normal citizen developer help." },
    ],
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
  tension: string;
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
    title: "Executive wants it now — but a similar tool may exist",
    prompt: "A leader has pushed for a quick solution. Shaping suggests a product line already runs something close.",
    tension: "Speed of response vs. cost of a parallel build the executive doesn't yet know about.",
    path: ["intake", "assessment", "portfolio", "route"],
    start: "intake",
    outcome: "Reuse path proposed back to the executive within days, with a candid note on what it does and doesn't cover.",
    involves: ["business", "consultant", "citizen"],
    next: "If reuse is accepted, light tailoring by the owning team. If rejected with reason, build proceeds and the gap is logged.",
    reactions: {
      now: "Match found in shaping. Consultant brokers the conversation between executive and owning team.",
      next: "Catalogue surfaces the match at intake. The reuse-vs-build call is made with evidence, not opinion.",
      north: "Intake proposes the reusable solution before the request is even submitted formally.",
    },
  },
  {
    id: "governed-data",
    title: "A business user has an idea — it may touch governed data",
    prompt: "The idea looks small. The data behind it might not be.",
    tension: "Encourage the build vs. risk a sensitive-data exposure that lands later as a finding.",
    path: ["intake", "assessment", "governance", "route"],
    start: "intake",
    outcome: "Governance reviewed in shaping. If a pre-approved pattern fits, build proceeds; if not, the use case is reshaped or routed.",
    involves: ["business", "governance", "consultant", "citizen"],
    next: "Pattern (or its absence) is recorded so the next similar idea is faster — or honestly slower.",
    reactions: {
      now: "Governance joins the shaping call. Reshape is a real option, not a polite refusal.",
      next: "Pre-approved data patterns cover most cases. Review focuses on genuinely new ones.",
      north: "Platform makes the safe path the default; governance reviews exceptions, not every build.",
    },
  },
  {
    id: "local-vs-enterprise",
    title: "A team wants to build locally — the use case may need enterprise support",
    prompt: "A confident team wants to crack on. Shaping signals scale, criticality, or load-bearing dependencies.",
    tension: "Local momentum and ownership vs. the cost of a fragile build under enterprise weight.",
    path: ["intake", "assessment", "route"],
    start: "intake",
    outcome: "An honest call: build locally with named limits, or route to AI factory with the team's input preserved.",
    involves: ["citizen", "consultant", "factory"],
    next: "If routed, the team stays close as a product owner — they don't disappear from their own idea.",
    reactions: {
      now: "Consultant names the trade-off explicitly: what local build can carry, and what it can't.",
      next: "Defined thresholds make this conversation faster and less personal.",
      north: "Most ideas have an obvious home; the boundary cases are rare and well-handled.",
    },
  },
  {
    id: "reuse-vs-rebuild",
    title: "A product line already has a similar tool — reuse or rebuild?",
    prompt: "Overlap is real but partial. The owning team is busy. The new requester wants control.",
    tension: "Reuse protects coherence but borrows someone else's roadmap. Rebuild is faster locally but fragments the estate.",
    path: ["intake", "assessment", "portfolio", "route"],
    start: "intake",
    outcome: "Three honest options put on the table: reuse-as-is, sponsor a small extension on the existing tool, or build with a stated end-of-life if the original catches up.",
    involves: ["business", "consultant", "citizen"],
    next: "Whichever path is chosen, the decision and reasoning are recorded in the portfolio.",
    reactions: {
      now: "Brokered conversation between teams. Decision documented even if it's a rebuild.",
      next: "Catalogue shows usage and roadmap of the existing tool, making the call easier.",
      north: "Reuse, extension, and rebuild are first-class options — chosen, not defaulted into.",
    },
  },
  {
    id: "escalate",
    title: "An idea is escalated to the AI factory — what triggers it, what happens next",
    prompt: "Sensitivity, scale, complexity or strategic weight push the idea past the citizen line.",
    tension: "Escalation must be earned, not aspirational. Too eager and the factory becomes a bottleneck; too reluctant and risk leaks into citizen builds.",
    path: ["intake", "assessment", "route", "governance"],
    start: "intake",
    outcome: "Escalated with a shaped brief: problem, value, constraints, what's been tried. Factory accepts, defers with reason, or sends back with a smaller scope to try first.",
    involves: ["consultant", "factory", "governance"],
    next: "Citizen community kept informed. Any interim solution is clearly marked as interim, not the answer.",
    reactions: {
      now: "Warm handover with a one-page brief. Triggers (sensitive data, scale, criticality) named explicitly.",
      next: "Defined escalation path with SLAs. Briefs follow a shared template; deferrals come with a reason.",
      north: "Continuous flow between citizen builds and factory programmes. Patterns travel in both directions.",
    },
  },
];

type QuestionTag = "Ownership TBD" | "Policy Needed" | "Design Decision" | "Operating Assumption";

const OPEN_QUESTIONS: { q: string; tag: QuestionTag }[] = [
  {
    q: "Where does ownership sit when a citizen build outgrows its original team?",
    tag: "Ownership TBD",
  },
  {
    q: "How deep should governance go before it becomes a brake on momentum?",
    tag: "Policy Needed",
  },
  {
    q: "What does enablement look like once demand outpaces central capacity?",
    tag: "Design Decision",
  },
  {
    q: "When does value tracking move from a simple log to something more formal?",
    tag: "Operating Assumption",
  },
  {
    q: "Who arbitrates when a product line and a citizen build claim the same space?",
    tag: "Ownership TBD",
  },
  {
    q: "What is the right trigger to escalate from citizen build to AI factory?",
    tag: "Policy Needed",
  },
  {
    q: "What is the right balance between platform standardisation and local flexibility?",
    tag: "Design Decision",
  },
  {
    q: "How much of intake volume is realistic to absorb in the first six months?",
    tag: "Operating Assumption",
  },
];

const QUESTION_TAG_STYLE: Record<QuestionTag, string> = {
  "Ownership TBD": "border-charcoal/30 bg-charcoal text-primary-foreground",
  "Policy Needed": "border-teal/40 bg-teal-soft text-teal",
  "Design Decision": "border-hairline bg-surface text-foreground",
  "Operating Assumption": "border-hairline bg-card text-muted-foreground",
};

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
        "group relative flex h-full w-full flex-col gap-3 rounded-2xl border p-5 text-left shadow-soft transition-shadow hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        node.spine
          ? "bg-charcoal text-primary-foreground border-charcoal shadow-lift"
          : "bg-card",
        highlighted && !node.spine ? "border-teal/60 ring-1 ring-teal/30" : "",
        !highlighted && !node.spine ? "border-hairline" : "",
      )}
    >
      {node.spine && (
        <span className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-teal px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-foreground shadow-soft">
          Spine of the model
        </span>
      )}
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
            node.spine
              ? "bg-teal text-primary-foreground"
              : highlighted ? "bg-teal-soft text-teal" : "bg-surface text-charcoal",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className={cn(
          "text-[10px] font-medium uppercase tracking-[0.14em]",
          node.spine ? "text-primary-foreground/60" : "text-muted-foreground",
        )}>
          {node.group}
        </span>
      </div>
      <div>
        <h3 className={cn("leading-snug", node.spine ? "text-xl" : "text-lg")}>{node.title}</h3>
        <p className={cn("mt-1 text-sm", node.spine ? "text-primary-foreground/70" : "text-muted-foreground")}>{node.definition}</p>
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

              {node.rubric && node.paths && (
                <section className="rounded-xl border border-charcoal/15 bg-charcoal/[0.03] p-5">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">
                    Decision rubric
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Four short questions. The pattern of answers points to the likely path.
                  </p>
                  <ul className="mt-4 space-y-3">
                    {node.rubric.map((r) => (
                      <li key={r.q} className="rounded-lg border border-hairline bg-card p-3">
                        <div className="text-sm font-medium">{r.q}</div>
                        <div className="mt-2 grid gap-1.5 text-xs sm:grid-cols-3">
                          <div><span className="font-medium text-teal">Reuse</span> · <span className="text-muted-foreground">{r.signals.reuse}</span></div>
                          <div><span className="font-medium text-foreground">Build</span> · <span className="text-muted-foreground">{r.signals.build}</span></div>
                          <div><span className="font-medium text-charcoal">Route</span> · <span className="text-muted-foreground">{r.signals.route}</span></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Likely path
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {node.paths.map((p) => (
                        <div key={p.key} className="rounded-lg border border-hairline bg-card p-3">
                          <div className={cn(
                            "text-xs font-semibold uppercase tracking-wider",
                            p.key === "Reuse" ? "text-teal" : p.key === "Route" ? "text-charcoal" : "text-foreground",
                          )}>{p.key}</div>
                          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.when}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {node.boundary && (
                <section>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Where the boundary sits
                  </h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {node.boundary.map((b) => (
                      <div key={b.role} className="rounded-lg border border-hairline bg-surface p-4">
                        <div className="text-sm font-medium">{b.role}</div>
                        <div className="mt-1.5 text-xs leading-relaxed">{b.does}</div>
                        <div className="mt-2 text-[11px] uppercase tracking-wider text-teal">When</div>
                        <div className="text-xs text-muted-foreground">{b.when}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {node.tiers && (
                <section>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Support tiers
                  </h4>
                  <ol className="mt-3 space-y-2">
                    {node.tiers.map((t, i) => (
                      <li key={t.tier} className="flex items-start gap-3 rounded-lg border border-hairline bg-surface p-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-teal/40 bg-card text-[11px] font-medium text-teal">
                          {i + 1}
                        </span>
                        <div>
                          <div className="text-sm font-medium">{t.tier}</div>
                          <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t.what}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Self-service → community → enablement team → AI factory technical escalation.
                  </p>
                </section>
              )}

              {node.community && (
                <section>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    How knowledge travels
                  </h4>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {node.community.map((c) => (
                      <div key={c.label} className="rounded-lg border border-hairline bg-surface p-3">
                        <div className="text-sm font-medium">{c.label}</div>
                        <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{c.what}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

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
