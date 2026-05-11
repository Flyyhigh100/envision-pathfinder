import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Compass,
  Eye,
  Inbox,
  GitBranch,
  Library,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Users,
  Building2,
  Network,
  ArrowRight,
  Sparkles,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/canvas")({
  head: () => ({
    meta: [
      { title: "Operating Model Canvas — AI Citizen Development" },
      {
        name: "description",
        content:
          "A one-page canvas of the citizen development operating model — direction, capability network, flow of work, and system enablers — for stakeholder conversations.",
      },
      { property: "og:title", content: "Operating Model Canvas — AI Citizen Development" },
      {
        property: "og:description",
        content:
          "Direction, capability network, flow of work, and system enablers — on one page, built for live stakeholder conversations.",
      },
    ],
  }),
  component: CanvasPage,
});

// --- Data ------------------------------------------------------------------

type Target =
  | { kind: "node"; nodeId: string }
  | { kind: "anchor"; anchor: string };

type Tile = {
  id: string;
  title: string;
  blurb: string;
  icon: typeof Compass;
  target: Target;
  accent?: boolean;
};

const DIRECTION: Tile[] = [
  {
    id: "vision",
    title: "Vision · Why it matters",
    blurb: "Make AI citizen development easy, governed, and scalable.",
    icon: Eye,
    target: { kind: "anchor", anchor: "vision" },
    accent: true,
  },
  {
    id: "roadmap",
    title: "Strategy & Roadmap",
    blurb: "Now · Next · North Star — pace without locking in the answer.",
    icon: Compass,
    target: { kind: "anchor", anchor: "roadmap" },
  },
];

const NETWORK: Tile[] = [
  {
    id: "product-line",
    title: "Product line AI citizen developers",
    blurb: "Closest to the domain. Often the most natural first owner.",
    icon: Building2,
    target: { kind: "anchor", anchor: "roles" },
  },
  {
    id: "central",
    title: "Central team AI citizen developers",
    blurb: "Same role family. Picks up overflow, cross-cutting, or unhomed work.",
    icon: Network,
    target: { kind: "anchor", anchor: "roles" },
  },
];

const TRAINING: Tile = {
  id: "training",
  title: "Training & Enablement",
  blurb: "Tiered support that grows people from curious user to confident citizen builder.",
  icon: GraduationCap,
  target: { kind: "node", nodeId: "training" },
};

const FLOW: Tile[] = [
  {
    id: "intake",
    title: "Opportunity Intake",
    blurb: "One front door, visible to the whole network.",
    icon: Inbox,
    target: { kind: "node", nodeId: "intake" },
  },
  {
    id: "assessment",
    title: "Assessment & Routing",
    blurb: "A short, honest check to decide the best path forward.",
    icon: GitBranch,
    target: { kind: "node", nodeId: "assessment" },
  },
  {
    id: "build",
    title: "Build · Reuse · Route",
    blurb: "Work goes to whoever is best placed to take it on — by fit and capacity.",
    icon: Library,
    target: { kind: "node", nodeId: "route" },
    accent: true,
  },
];

const ENABLERS: Tile[] = [
  {
    id: "governance",
    title: "Governance & Boundaries",
    blurb: "Guardrails sized to risk, travelling with the work.",
    icon: ShieldCheck,
    target: { kind: "node", nodeId: "governance" },
  },
  {
    id: "value",
    title: "Value Tracking",
    blurb: "Light, honest signals of what the work is worth.",
    icon: TrendingUp,
    target: { kind: "node", nodeId: "value" },
  },
  {
    id: "studio",
    title: "Citizen Development Studio",
    blurb: "A guided build environment that makes it easier to turn ideas into working solutions.",
    icon: Sparkles,
    target: { kind: "node", nodeId: "route" },
  },
  {
    id: "support",
    title: "Support & Community",
    blurb: "Living portfolio, office hours, working library.",
    icon: Users,
    target: { kind: "node", nodeId: "portfolio" },
  },
];

const SUPPORT: Tile[] = [
  {
    id: "support-product-line",
    title: "Product Line AI Resources",
    blurb: "First line for product line ideas.",
    icon: Building2,
    target: { kind: "anchor", anchor: "roles" },
  },
  {
    id: "support-central",
    title: "Central AI Team",
    blurb: "Primary path for enterprise and leadership requests.",
    icon: Network,
    target: { kind: "anchor", anchor: "roles" },
  },
  {
    id: "support-shared",
    title: "Shared Capacity",
    blurb: "Mutual support where capacity allows.",
    icon: Users,
    target: { kind: "anchor", anchor: "roles" },
  },
];

// --- Lenses ----------------------------------------------------------------

type LensKey = "none" | "enter" | "pickup" | "routing" | "support";

const LENSES: { key: LensKey; label: string }[] = [
  { key: "none", label: "Whole canvas" },
  { key: "enter", label: "Where work enters" },
  { key: "pickup", label: "Who picks it up" },
  { key: "routing", label: "How routing works" },
  { key: "support", label: "What supports the model" },
];

const HIGHLIGHTS: Record<LensKey, Set<string>> = {
  none: new Set(),
  enter: new Set(["intake"]),
  pickup: new Set(["product-line", "central", "build"]),
  routing: new Set(["assessment", "build"]),
  support: new Set(["governance", "value", "support", "training"]),
};

// --- Component -------------------------------------------------------------

function CanvasPage() {
  const navigate = useNavigate();
  const [lens, setLens] = useState<LensKey>("none");
  const [hover, setHover] = useState<string | null>(null);

  const goTo = (target: Target) => {
    if (target.kind === "node") {
      navigate({ to: "/", search: { open: target.nodeId } as never });
    } else {
      navigate({ to: "/", hash: target.anchor });
    }
  };

  const isDimmed = (id: string) => {
    if (hover) return hover !== id;
    if (lens === "none") return false;
    return !HIGHLIGHTS[lens].has(id);
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
              <div className="text-[11px] text-muted-foreground">Operating Model Canvas</div>
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
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal"
            >
              Canvas
            </Link>
          </div>
        </div>
      </header>

      {/* Framing */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-12 md:pt-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Operating Model Canvas
            </span>
            <h1 className="mt-4 text-3xl leading-[1.1] md:text-[40px]">
              One page. The whole way of working.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              A working view for stakeholder conversations — direction, the people who do the work,
              how work flows, and what holds it all up.
            </p>
          </div>

          {/* Lens chips */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
              Lens
            </span>
            {LENSES.map((l) => (
              <button
                key={l.key}
                onClick={() => setLens(l.key)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[12px] transition-colors",
                  lens === l.key
                    ? "border-teal/50 bg-teal-soft text-teal"
                    : "border-hairline bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Canvas */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="space-y-10 md:space-y-12">
          <Layer eyebrow="Layer 1 · Direction" caption="Sets the why and the pace.">
            <div className="grid gap-4 md:grid-cols-2">
              {DIRECTION.map((t) => (
                <CanvasTile
                  key={t.id}
                  tile={t}
                  dim={isDimmed(t.id)}
                  onHover={setHover}
                  onSelect={goTo}
                />
              ))}
            </div>
          </Layer>

          <Connector label="sets direction for" />

          <Layer
            eyebrow="Layer 2 · Capability Network"
            caption="One role family in two homes. Training strengthens both."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {NETWORK.map((t) => (
                <CanvasTile
                  key={t.id}
                  tile={t}
                  dim={isDimmed(t.id)}
                  onHover={setHover}
                  onSelect={goTo}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center">
              <span className="rounded-full border border-hairline bg-card px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                shared way of working · mutual support
              </span>
            </div>
            <div className="mt-4">
              <CanvasTile
                tile={TRAINING}
                dim={isDimmed(TRAINING.id)}
                onHover={setHover}
                onSelect={goTo}
                muted
              />
            </div>
          </Layer>

          <Connector label="people who do the work" />

          <Layer
            eyebrow="Layer 3 · Flow of Work"
            caption="The spine. Where ideas become solutions."
            spine
          >
            <div className="relative">
              <div className="grid gap-4 md:grid-cols-3">
                {FLOW.map((t, i) => (
                  <div key={t.id} className="relative">
                    <CanvasTile
                      tile={t}
                      dim={isDimmed(t.id)}
                      onHover={setHover}
                      onSelect={goTo}
                    />
                    {i < FLOW.length - 1 && (
                      <div className="pointer-events-none absolute right-[-14px] top-1/2 hidden -translate-y-1/2 text-muted-foreground/40 md:block">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-[12px] italic text-muted-foreground">
                Routes by fit and capacity — not always upward, not always central.
              </p>
            </div>
          </Layer>

          <Connector label="held up by" />

          <Layer eyebrow="Layer 4 · System Enablers" caption="Persistent foundations across the whole model.">
            <div className="grid gap-4 md:grid-cols-3">
              {ENABLERS.map((t) => (
                <CanvasTile
                  key={t.id}
                  tile={t}
                  dim={isDimmed(t.id)}
                  onHover={setHover}
                  onSelect={goTo}
                />
              ))}
            </div>
          </Layer>
        </div>

        <p className="mx-auto mt-16 max-w-3xl text-center text-[13px] leading-relaxed text-muted-foreground">
          Product line and central AI citizen developers are one role family in two organisational
          homes. Work routes to its most natural owner by origin, fit, skill, and capacity.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-teal"
          >
            Open the detailed model
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Layer({
  eyebrow,
  caption,
  children,
  spine,
}: {
  eyebrow: string;
  caption: string;
  children: React.ReactNode;
  spine?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[180px_1fr] md:gap-8">
      <div className="md:pt-1">
        <div
          className={cn(
            "text-[11px] font-medium uppercase tracking-[0.16em]",
            spine ? "text-teal" : "text-muted-foreground",
          )}
        >
          {eyebrow}
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground/80">{caption}</p>
      </div>
      <div
        className={cn(
          "relative rounded-2xl border p-5 md:p-6",
          spine
            ? "border-teal/30 bg-teal-soft/30"
            : "border-hairline bg-surface/40",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center md:pl-[180px] md:[padding-left:calc(180px+2rem)]">
      <div className="flex flex-col items-center gap-1">
        <div className="h-6 w-px bg-hairline" />
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
          {label}
        </span>
        <div className="h-6 w-px bg-hairline" />
      </div>
    </div>
  );
}

function CanvasTile({
  tile,
  dim,
  onHover,
  onSelect,
  muted,
}: {
  tile: Tile;
  dim: boolean;
  onHover: (id: string | null) => void;
  onSelect: (target: Target) => void;
  muted?: boolean;
}) {
  const Icon = tile.icon;
  return (
    <motion.button
      onClick={() => onSelect(tile.target)}
      onMouseEnter={() => onHover(tile.id)}
      onMouseLeave={() => onHover(null)}
      animate={{ opacity: dim ? 0.35 : 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex h-full w-full flex-col gap-3 rounded-xl border p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        muted
          ? "border-hairline bg-card/60 hover:border-teal/30"
          : tile.accent
            ? "border-teal/40 bg-card hover:border-teal/60"
            : "border-hairline bg-card hover:border-teal/40",
      )}
    >
      <div className="flex items-center justify-between">
        <Icon
          className={cn(
            "h-4 w-4 transition-colors",
            tile.accent ? "text-teal" : "text-charcoal/70 group-hover:text-teal",
          )}
        />
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal" />
      </div>
      <div>
        <h3 className="text-[14px] font-medium leading-snug">{tile.title}</h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{tile.blurb}</p>
      </div>
    </motion.button>
  );
}
