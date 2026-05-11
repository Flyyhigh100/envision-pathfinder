import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  ChevronDown,
  Lightbulb,
  Repeat,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import canvasHero from "@/assets/canvas-hero.png";

export const Route = createFileRoute("/canvas")({
  head: () => ({
    meta: [
      { title: "Operating Model Canvas — AI Citizen Development" },
      {
        name: "description",
        content:
          "A premium one-page strategy canvas of the Citizen Development operating model — direction, flow of work, support, governance, and community as one connected system.",
      },
      { property: "og:title", content: "Operating Model Canvas — AI Citizen Development" },
      {
        property: "og:description",
        content:
          "Citizen Development as one connected operating model — platform, support, governance, and community working as one.",
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
  {
    id: "training",
    title: "Training & Enablement",
    blurb: "Tiered support that grows people from curious user to confident builder.",
    icon: GraduationCap,
    target: { kind: "node", nodeId: "training" },
  },
];

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

const SUPPORT: Tile[] = [
  {
    id: "support-product-line",
    title: "Product Line AI Resources",
    blurb: "Closest to the domain — the natural first owner for product line ideas.",
    icon: Building2,
    target: { kind: "anchor", anchor: "roles" },
  },
  {
    id: "support-central",
    title: "Central AI Team",
    blurb: "Primary path for enterprise and leadership requests; picks up cross-cutting work.",
    icon: Network,
    target: { kind: "anchor", anchor: "roles" },
  },
  {
    id: "support-shared",
    title: "Shared Capacity & Community",
    blurb: "Mutual support, office hours, and a working library across the network.",
    icon: Users,
    target: { kind: "anchor", anchor: "roles" },
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
    blurb: "A guided build environment that turns ideas into working solutions.",
    icon: Sparkles,
    target: { kind: "node", nodeId: "route" },
  },
  {
    id: "portfolio",
    title: "Living Portfolio",
    blurb: "A shared view of what's live, what's reusable, and what's in flight.",
    icon: Library,
    target: { kind: "node", nodeId: "portfolio" },
  },
];

type Scenario = {
  id: string;
  title: string;
  caption: string;
  icon: typeof Compass;
  steps: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "scenario-idea",
    title: "Business user with an idea",
    caption: "A frontline idea finds its first owner without a queue.",
    icon: Lightbulb,
    steps: ["Submitted via Intake", "Quick fit & risk check", "Product line picks it up"],
  },
  {
    id: "scenario-reuse",
    title: "Reusable solution already exists",
    caption: "Don't rebuild — match the request to a working solution.",
    icon: Repeat,
    steps: ["Intake matched to portfolio", "Reuse confirmed", "Adapted & shipped"],
  },
  {
    id: "scenario-central",
    title: "Enterprise request needs central support",
    caption: "A leadership ask routed to the team built for it.",
    icon: Network,
    steps: ["Intake flagged enterprise", "Routed to central team", "Delivered with governance"],
  },
  {
    id: "scenario-complex",
    title: "Higher-risk or cross-cutting use case",
    caption: "Complexity changes the path — not the front door.",
    icon: Layers,
    steps: ["Intake same as any other", "Risk-based assessment", "Routed by fit & guardrails"],
  },
];

// --- Component -------------------------------------------------------------

const SECTIONS = [
  { id: "flow", label: "Flow of Work" },
  { id: "support", label: "Support Model" },
  { id: "enablers", label: "System Enablers" },
  { id: "scenarios", label: "Scenarios" },
] as const;

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function CanvasPage() {
  const navigate = useNavigate();
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  const goTo = (target: Target) => {
    if (target.kind === "node") {
      navigate({ to: "/", search: { open: target.nodeId } as never });
    } else {
      navigate({ to: "/", hash: target.anchor });
    }
  };

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
              <div className="text-[11px] text-muted-foreground">Strategy Canvas</div>
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

      {/* HERO */}
      <section id="hero" className="border-b border-hairline">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-14 md:pb-20 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Operating Model · One connected system
            </span>
            <h1 className="mt-5 text-3xl leading-[1.1] md:text-[44px]">
              Citizen Development is one connected operating&nbsp;model.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Platform, support, governance, and community working as one — so ideas move from the
              first conversation to a working solution without losing the bigger picture.
            </p>
          </div>

          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-12 overflow-hidden rounded-2xl border border-hairline bg-surface/40 shadow-soft"
          >
            <img
              src={canvasHero}
              alt="System map of the Citizen Development operating model showing Vision, Strategy and Enablement at the top; Idea Intake, Assessment, and Build·Reuse·Route as the central flow; and Governance, Value, and Community as supporting foundations."
              width={1920}
              height={1024}
              loading="eager"
              className="h-auto w-full"
            />
          </motion.figure>

          <a
            href="#flow"
            className="mx-auto mt-10 flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-teal"
          >
            Scroll to unpack the model
            <ChevronDown className="h-3.5 w-3.5" />
          </a>

          {/* Direction strip — quiet anchor for top layer of the hero */}
          <div className="mt-16 grid gap-3 md:grid-cols-3">
            {DIRECTION.map((t) => (
              <button
                key={t.id}
                onClick={() => goTo(t.target)}
                className="group flex items-start gap-3 rounded-xl border border-hairline bg-card/60 p-4 text-left transition-colors hover:border-teal/40"
              >
                <t.icon className="mt-0.5 h-4 w-4 shrink-0 text-charcoal/70 group-hover:text-teal" />
                <div>
                  <div className="text-[13px] font-medium leading-snug">{t.title}</div>
                  <div className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{t.blurb}</div>
                </div>
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SCROLL BODY with sticky mini-map */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_220px] lg:gap-16">
          <main className="space-y-24 md:space-y-28">
            <Section
              id="flow"
              eyebrow="02 · Flow of Work"
              title="The operational spine."
              caption="How an idea becomes a working solution — same front door for everyone, then routed by fit."
              spine
            >
              <div className="relative">
                <div className="grid gap-4 md:grid-cols-3">
                  {FLOW.map((t, i) => (
                    <div key={t.id} className="relative">
                      <CanvasTile tile={t} onSelect={goTo} />
                      {i < FLOW.length - 1 && (
                        <div className="pointer-events-none absolute right-[-14px] top-1/2 hidden -translate-y-1/2 text-teal/50 md:block">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-[12.5px] italic text-muted-foreground">
                  Work flows to whoever is best placed to take it on — not always upward, not always central.
                </p>
              </div>
            </Section>

            <Section
              id="support"
              eyebrow="03 · Support Model"
              title="Support travels with the work."
              caption="Product lines, the central team, and a shared community pick up work where they're best placed — not as separate stages, but as one network."
            >
              <div className="grid gap-4 md:grid-cols-3">
                {SUPPORT.map((t) => (
                  <CanvasTile key={t.id} tile={t} onSelect={goTo} muted />
                ))}
              </div>
            </Section>

            <Section
              id="enablers"
              eyebrow="04 · System Enablers"
              title="What makes the model safe and durable."
              caption="Governance, value tracking, and the build environment are part of the system — not bolted on after the fact."
            >
              <div className="grid gap-4 md:grid-cols-2">
                {ENABLERS.map((t) => (
                  <CanvasTile key={t.id} tile={t} onSelect={goTo} />
                ))}
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-hairline bg-card/60 px-5 py-4">
                <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Way of Working — </span>
                  Today: we use the current way of working. Over time: citizen development lives inside the Way of Working Tool as the shared source of truth.
                </p>
              </div>
            </Section>

            <Section
              id="scenarios"
              eyebrow="05 · In Practice"
              title="What this looks like on the ground."
              caption="Four typical journeys through the same model — different paths, one front door."
            >
              <div className="grid gap-4 md:grid-cols-2">
                {SCENARIOS.map((s) => (
                  <article
                    key={s.id}
                    className="rounded-xl border border-hairline bg-card p-5 transition-colors hover:border-teal/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-teal-soft text-teal">
                        <s.icon className="h-3.5 w-3.5" />
                      </span>
                      <h3 className="text-[14px] font-medium">{s.title}</h3>
                    </div>
                    <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">{s.caption}</p>
                    <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
                      {s.steps.map((step, i) => (
                        <li key={step} className="flex items-center gap-2">
                          <span className="rounded-full border border-hairline bg-surface/60 px-2.5 py-1 text-[11.5px] text-foreground">
                            {step}
                          </span>
                          {i < s.steps.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                          )}
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
            </Section>

            <div className="border-t border-hairline pt-12">
              <p className="mx-auto max-w-3xl text-center text-[13px] leading-relaxed text-muted-foreground">
                Product line and central AI citizen developers are one role family in two homes. Work goes to whoever is best placed to take it on — by origin, fit, skill, and capacity.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-teal"
                >
                  Open the detailed model
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </main>

          {/* Sticky mini-map */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-xl border border-hairline bg-card/60">
                <img
                  src={canvasHero}
                  alt=""
                  aria-hidden
                  className="h-auto w-full opacity-80"
                  loading="lazy"
                />
              </div>
              <nav className="mt-5 space-y-1.5">
                <div className="px-1 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                  On this page
                </div>
                {SECTIONS.map((s) => {
                  const isActive = active === s.id;
                  return (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-2 py-1.5 text-[12px] transition-colors",
                        isActive
                          ? "bg-teal-soft text-teal"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors",
                          isActive ? "bg-teal" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60",
                        )}
                      />
                      {s.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  caption,
  spine,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  caption: string;
  spine?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="scroll-mt-24"
    >
      <header className="mb-6 max-w-2xl">
        <div
          className={cn(
            "text-[11px] font-medium uppercase tracking-[0.16em]",
            spine ? "text-teal" : "text-muted-foreground",
          )}
        >
          {eyebrow}
        </div>
        <h2 className="mt-3 text-[22px] leading-snug md:text-[26px]">{title}</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{caption}</p>
      </header>
      <div
        className={cn(
          "rounded-2xl border p-5 md:p-6",
          spine ? "border-teal/30 bg-teal-soft/30" : "border-hairline bg-surface/40",
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}

function CanvasTile({
  tile,
  onSelect,
  muted,
}: {
  tile: Tile;
  onSelect: (target: Target) => void;
  muted?: boolean;
}) {
  const Icon = tile.icon;
  return (
    <button
      onClick={() => onSelect(tile.target)}
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
    </button>
  );
}
