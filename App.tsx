import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SEARCH_PHRASES = [
  'why is my cash flow always tight at month end',
  'how do I stop losing receipts and invoices',
  'is there an easier way to approve vendor payments',
  'how do I know if a vendor charged me twice',
  'where does all my money actually go every month',
  'how do I run payables without hiring another person',
  'why does month-end close take us so long',
  'something in my business keeps breaking and I don\'t know what',
  'how do I get more customers without more ad spend',
];

const SERVICES = [
  { title: 'Invoice Intelligence', copy: 'Capture, route, and review invoices without inbox chaos.' },
  { title: 'Fraud Detection', copy: 'Spot duplicate charges, odd patterns, and vendor drift early.' },
  { title: 'Workflow Automation', copy: 'Move repeat work out of inboxes, texts, and memory.' },
  { title: 'Quick Capture', copy: 'Collect receipts, notes, and approvals when work happens.' },
];

const WORKFLOW_STEPS = [
  { title: 'Map the bottleneck', copy: 'Find where time, money, or trust gets stuck.' },
  { title: 'Structure the inputs', copy: 'Clean up the forms, files, approvals, and handoffs.' },
  { title: 'Build the workflow', copy: 'Automate the repeatable parts. Keep judgment where it belongs.' },
];

const PRINCIPLES = [
  { rule: 'Ambiguity', action: 'HOLD', copy: 'Incomplete inputs stop before they create rework.' },
  { rule: 'Uncertainty', action: 'VERIFY', copy: 'High-stakes steps get checked.' },
  { rule: 'Conflict', action: 'ESCALATE', copy: 'Conflicting records go to the right person.' },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$497',
    period: 'one-time',
    tag: 'Best for solo operators',
    description: 'Get your most broken workflow mapped and fixed. One system. Done.',
    features: [
      'One workflow audit',
      'Bottleneck identification report',
      'Recommended tool stack',
      '30-min implementation call',
      '14-day async support',
    ],
    cta: 'Start here',
    highlight: false,
  },
  {
    name: 'Workflow',
    price: '$1,497',
    period: 'per month',
    tag: 'Most popular',
    description: 'Ongoing systems work. We build, monitor, and improve your operational layer.',
    features: [
      'Up to 3 active workflows',
      'Invoice + approval automation',
      'Monthly systems review',
      'Anomaly and fraud monitoring',
      'Dedicated Slack channel',
      'Priority response',
    ],
    cta: 'Build my workflow',
    highlight: true,
  },
  {
    name: 'Full Stack',
    price: '$3,500',
    period: 'per month',
    tag: 'For growing teams',
    description: 'End-to-end operational infrastructure. AP, receipts, approvals, reporting — all of it.',
    features: [
      'Unlimited workflows',
      'Full AP + AR automation',
      'Vendor risk monitoring',
      'Custom GL coding rules',
      'Weekly ops review call',
      'White-glove onboarding',
      'Quarterly audit report',
    ],
    cta: "Let's talk scope",
    highlight: false,
  },
];

const IMPULSE_TOOLS = [
  {
    id: 'revenue-check',
    name: 'Revenue Reality Check',
    price: '$47',
    badge: 'Instant download',
    emoji: '🔍',
    tagline: 'Know where your money actually goes before the next invoice hits.',
    description: "A structured diagnostic tool that walks you through your revenue, expenses, and margin in under 30 minutes. You'll get a clear picture of your real numbers — not what you hope they are.",
    deliverable: 'Interactive spreadsheet + 12-question diagnostic + interpretation guide',
    forWho: 'Solo operators and small teams who want clarity before committing to a full system.',
    outcomes: [
      'Identify your top 3 money leaks',
      'Calculate your real effective margin',
      'See which clients or jobs cost more than they earn',
      'One-page summary you can actually act on',
    ],
    cta: 'Get the tool — $47',
    color: 'cyan',
  },
  {
    id: 'receipt-router',
    name: 'Quick Capture Receipt Router',
    price: '$67',
    badge: 'Ready to use today',
    emoji: '📎',
    tagline: 'Stop losing receipts. Start closing your books on time.',
    description: "A pre-built capture and routing system for business receipts. Works with your phone camera, email, and existing tools. No new software required — just a smarter process.",
    deliverable: 'Setup guide + routing template + naming conventions + 3 automation recipes',
    forWho: "Anyone drowning in paper receipts, email attachments, or 'I'll deal with it later' piles.",
    outcomes: [
      'Receipts land in one place, automatically sorted',
      'Vendor and category already tagged on arrival',
      'Bookkeeper-ready by end of each week',
      'Works with Google Drive, Dropbox, or local folders',
    ],
    cta: 'Get the tool — $67',
    color: 'teal',
  },
];

// ─── HUMAN TYPING HOOK ────────────────────────────────────────────────────────

function useHumanTyping(phrases: string[]) {
  const [displayed, setDisplayed] = useState('');
  const stateRef = useRef({
    phraseIdx: 0,
    charIdx: 0,
    phase: 'typing' as 'typing' | 'pausing' | 'deleting',
    displayed: '',
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      const s = stateRef.current;
      const target = phrases[s.phraseIdx];

      if (s.phase === 'typing') {
        if (s.charIdx < target.length) {
          const ch = target[s.charIdx];
          const isSpace = ch === ' ';
          const afterPunct = s.charIdx > 0 && ',.!?'.includes(target[s.charIdx - 1]);

          // Variable speed: faster mid-word, slower after punctuation/spaces
          let speed = 55 + Math.random() * 65;
          if (isSpace) speed = 80 + Math.random() * 50;
          if (afterPunct) speed += 120 + Math.random() * 100;
          if (s.charIdx < 3) speed += 60; // slow start

          // Occasional mid-phrase hesitation (~4% chance after char 10)
          if (s.charIdx > 10 && Math.random() < 0.04) speed += 250 + Math.random() * 350;

          s.charIdx++;
          s.displayed = target.slice(0, s.charIdx);
          setDisplayed(s.displayed);
          timerRef.current = setTimeout(tick, speed);
        } else {
          // Finished typing — pause
          s.phase = 'pausing';
          timerRef.current = setTimeout(tick, 1600 + Math.random() * 700);
        }
      } else if (s.phase === 'pausing') {
        s.phase = 'deleting';
        timerRef.current = setTimeout(tick, 60);
      } else {
        // Deleting
        if (s.charIdx > 0) {
          // Occasionally delete 2-3 chars at once (feels natural at end of word)
          const chunk = s.charIdx > 6 && Math.random() < 0.12 ? 2 : 1;
          s.charIdx = Math.max(0, s.charIdx - chunk);
          s.displayed = target.slice(0, s.charIdx);
          setDisplayed(s.displayed);
          timerRef.current = setTimeout(tick, 22 + Math.random() * 18);
        } else {
          // Move to next phrase
          s.phraseIdx = (s.phraseIdx + 1) % phrases.length;
          s.charIdx = 0;
          s.displayed = '';
          s.phase = 'typing';
          timerRef.current = setTimeout(tick, 280 + Math.random() * 180);
        }
      }
    };

    timerRef.current = setTimeout(tick, 800);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phrases]);

  return displayed;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({
  children, className = '', id,
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-14%' }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.section>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-4 text-sm font-medium uppercase tracking-widest text-cyan-300/70">{children}</p>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────

const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0c0c0f]/75 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        {/* Hamburger — left, mobile only */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded focus:outline-none focus:ring-2 focus:ring-cyan-300/40 md:hidden"
        >
          <span className={`block h-px w-5 bg-neutral-300 transition-all duration-200 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-neutral-300 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-5 bg-neutral-300 transition-all duration-200 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>

        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 text-sm font-semibold text-white"
          aria-label="Blue Dot Technology home"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_24px_rgba(34,211,238,0.15)]">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
          </span>
          Blue Dot Technology
        </a>

        {/* Desktop nav links */}
        <div className="ml-auto hidden items-center gap-7 text-sm text-neutral-400 md:flex">
          {['services', 'process', 'pricing', 'tools', 'contact'].map(href => (
            <a key={href} className="capitalize transition hover:text-white" href={`#${href}`}>
              {href}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-3 md:hidden"
          >
            {['services', 'process', 'pricing', 'tools', 'contact'].map(href => (
              <a
                key={href}
                href={`#${href}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm capitalize text-neutral-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                {href}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── HERO SEARCH ──────────────────────────────────────────────────────────────

const HeroSearch: React.FC = () => {
  const typed = useHumanTyping(SEARCH_PHRASES);

  return (
    <div className="w-full max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        className="relative rounded-xl border border-white/[0.11] bg-[#111115] shadow-xl shadow-black/40"
      >
        <div className="flex min-h-[64px] items-center gap-3.5 px-5">
          {/* Search icon — replaces the dot */}
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <input
            id="hero-search"
            readOnly
            value={typed}
            aria-label="Animated business search"
            className="min-w-0 flex-1 bg-transparent text-lg text-white/90 outline-none sm:text-xl"
          />

          {/* Blinking cursor only — no line above, no dot */}
          <span
            aria-hidden="true"
            className="h-5 w-px shrink-0 bg-cyan-300/70"
            style={{
              animation: 'blink 1s step-start infinite',
            }}
          />
        </div>

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

// ─── PRICING ──────────────────────────────────────────────────────────────────

const PricingSection: React.FC = () => (
  <SectionReveal id="pricing" className="px-5 py-32 sm:py-44 border-t border-white/[0.06]">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Pick the level of fix you need.
        </h2>
        <p className="mt-5 text-sm leading-7 text-neutral-400">
          No retainers until you're ready. Start with one workflow. Scale when it works.
        </p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {PRICING_TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex flex-col rounded-xl border p-8 ${
              tier.highlight
                ? 'border-cyan-300/35 bg-cyan-300/[0.05] shadow-xl shadow-cyan-500/[0.08]'
                : 'border-white/10 bg-white/[0.025]'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-6">
                <span className="rounded-full bg-cyan-300 px-3 py-0.5 text-xs font-semibold text-[#071014]">
                  {tier.tag}
                </span>
              </div>
            )}

            {!tier.highlight && (
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-600">{tier.tag}</p>
            )}

            <h3 className="text-xl font-semibold text-white mt-1">{tier.name}</h3>

            <div className="mt-4 flex items-end gap-1.5">
              <span className="text-4xl font-bold text-white">{tier.price}</span>
              <span className="mb-1 text-xs text-neutral-500">/ {tier.period}</span>
            </div>

            <p className="mt-4 text-sm leading-6 text-neutral-400">{tier.description}</p>

            <ul className="mt-8 flex flex-col gap-3">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <span className="mt-px shrink-0 text-cyan-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <a
                href="#contact"
                className={`block rounded-lg px-5 py-3 text-center text-sm font-semibold transition focus:outline-none focus:ring-2 ${
                  tier.highlight
                    ? 'bg-cyan-200 text-[#071014] hover:bg-white focus:ring-cyan-300/40'
                    : 'border border-white/12 text-neutral-200 hover:border-cyan-300/30 hover:bg-white/[0.04] focus:ring-cyan-300/20'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-neutral-600">
        All plans include a free 20-min systems assessment before any commitment.
      </p>
    </div>
  </SectionReveal>
);

// ─── IMPULSE TOOLS ────────────────────────────────────────────────────────────

const ToolCard: React.FC<{ tool: typeof IMPULSE_TOOLS[0]; index: number }> = ({ tool, index }) => {
  const isCyan = tool.color === 'cyan';
  const accent = isCyan
    ? { border: 'border-cyan-300/20', bg: 'bg-cyan-300/[0.04]', headerBorder: 'border-cyan-300/10', badge: 'bg-cyan-300/15 text-cyan-300', icon: 'bg-cyan-300/10', eyebrow: 'text-cyan-300/60', arrow: 'text-cyan-400', btn: 'bg-cyan-200 hover:bg-white focus:ring-cyan-300/40' }
    : { border: 'border-teal-400/20', bg: 'bg-teal-400/[0.04]', headerBorder: 'border-teal-400/10', badge: 'bg-teal-400/15 text-teal-300', icon: 'bg-teal-400/10', eyebrow: 'text-teal-300/60', arrow: 'text-teal-400', btn: 'bg-teal-300 hover:bg-white focus:ring-teal-300/40' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className={`flex flex-col overflow-hidden rounded-xl border ${accent.border} bg-white/[0.025]`}
    >
      {/* Header */}
      <div className={`px-8 pt-8 pb-6 ${accent.bg} border-b ${accent.headerBorder}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 ${accent.badge}`}>
              {tool.badge}
            </span>
            <h3 className="text-2xl font-semibold text-white">{tool.name}</h3>
            <p className={`mt-1.5 text-sm ${isCyan ? 'text-cyan-300/65' : 'text-teal-300/65'}`}>{tool.tagline}</p>
          </div>
          <div className={`shrink-0 grid h-12 w-12 place-items-center rounded-xl text-xl ${accent.icon}`}>
            {tool.emoji}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 p-8">
        <p className="text-sm leading-7 text-neutral-400">{tool.description}</p>

        <div>
          <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${accent.eyebrow}`}>What you get</p>
          <ul className="flex flex-col gap-2">
            {tool.outcomes.map(o => (
              <li key={o} className="flex items-start gap-2.5 text-sm text-neutral-300">
                <span className={`mt-0.5 shrink-0 ${accent.arrow}`}>→</span>
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-white/[0.07] bg-[#0c0c0f]/60 px-4 py-3">
          <p className="text-xs text-neutral-600 mb-1">Deliverable</p>
          <p className="text-sm text-neutral-300">{tool.deliverable}</p>
        </div>

        <div className="rounded-lg border border-white/[0.07] bg-[#0c0c0f]/60 px-4 py-3">
          <p className="text-xs text-neutral-600 mb-1">Built for</p>
          <p className="text-sm text-neutral-300">{tool.forWho}</p>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between gap-4">
          <div>
            <p className="text-3xl font-bold text-white">{tool.price}</p>
            <p className="text-xs text-neutral-600 mt-0.5">One-time. No subscription.</p>
          </div>
          <a
            href="#contact"
            className={`rounded-lg px-5 py-3 text-sm font-semibold text-[#071014] transition focus:outline-none focus:ring-2 ${accent.btn}`}
          >
            {tool.cta}
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const ImpulseToolsSection: React.FC = () => (
  <SectionReveal id="tools" className="px-5 py-32 sm:py-44 border-t border-white/[0.06]">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl">
        <Eyebrow>Quick-start tools</Eyebrow>
        <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Not ready for the full fix?
        </h2>
        <p className="mt-5 text-sm leading-7 text-neutral-400">
          Two standalone tools you can buy today and use this week. No onboarding call. No commitment.
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        {IMPULSE_TOOLS.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} index={i} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-neutral-600">
        Purchased a tool and want to go deeper?{' '}
        <a href="#contact" className="text-cyan-400 underline underline-offset-4 hover:text-cyan-200 transition">
          The cost applies toward any engagement.
        </a>
      </p>
    </div>
  </SectionReveal>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0c0c0f] text-neutral-200 selection:bg-cyan-300/20 selection:text-cyan-100">
      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.08),transparent_26%),radial-gradient(circle_at_55%_90%,rgba(20,184,166,0.06),transparent_30%)]" />

      <Nav />

      <main className="relative z-10">
        {/* HERO */}
        <section id="hero" className="flex min-h-screen items-center px-5 pb-32 pt-40 sm:pt-48">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mb-10"
              >
                <HeroSearch />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.22 }}
                className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-[5.5rem]"
              >
                It&apos;s not you.<br className="hidden sm:block" /> It&apos;s your systems.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.36 }}
                className="mt-7 max-w-lg text-base leading-8 text-neutral-400 sm:text-lg"
              >
                Manual steps. Disconnected tools. Money leaks you cannot see.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.48 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <a
                  href="#pricing"
                  className="inline-flex min-h-12 items-center rounded-lg bg-cyan-200 px-6 text-sm font-semibold text-[#071014] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                >
                  See pricing
                </a>
                <a
                  href="#tools"
                  className="inline-flex min-h-12 items-center rounded-lg border border-white/12 px-6 text-sm font-medium text-neutral-300 transition hover:border-cyan-300/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                >
                  Start with a tool →
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <SectionReveal id="services" className="px-5 py-32 sm:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Eyebrow>Services</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Make the work visible.
              </h2>
            </div>
            <div className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {SERVICES.map((service, index) => (
                <motion.article
                  key={service.title}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="group min-h-60 rounded-xl border border-white/10 bg-white/[0.025] p-8 shadow-xl shadow-black/20 transition hover:border-cyan-300/25 hover:bg-white/[0.045]"
                >
                  <div className="mb-10 flex items-center justify-between">
                    <span className="text-sm text-neutral-600">0{index + 1}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/50 transition group-hover:shadow-[0_0_14px_rgba(103,232,249,0.65)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-neutral-400">{service.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* PROCESS */}
        <SectionReveal id="process" className="border-y border-white/[0.06] bg-white/[0.015] px-5 py-32 sm:py-44">
          <div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                From messy to reliable.
              </h2>
            </div>
            <div className="space-y-5">
              {WORKFLOW_STEPS.map((step, index) => (
                <div key={step.title} className="rounded-xl border border-white/10 bg-[#0d0d10]/80 p-8">
                  <div className="mb-5 flex items-center gap-4">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-300/10 text-sm font-semibold text-cyan-200">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-7 text-neutral-400">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* PRINCIPLES */}
        <SectionReveal className="px-5 py-32 sm:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Eyebrow>Failure has a workflow</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Good systems know when to stop.
              </h2>
            </div>
            <div className="mt-20 grid gap-6 md:grid-cols-3">
              {PRINCIPLES.map(p => (
                <article key={p.action} className="rounded-xl border border-white/10 bg-white/[0.025] p-8">
                  <p className="text-sm text-neutral-500">{p.rule}</p>
                  <h3 className="mt-3 text-4xl font-semibold text-cyan-200">{p.action}</h3>
                  <p className="mt-5 text-sm leading-7 text-neutral-400">{p.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* AI SECTION */}
        <SectionReveal className="px-5 py-32 sm:py-44">
          <div className="mx-auto grid max-w-7xl gap-12 overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-cyan-500/[0.06] md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                alt="Connected city lights representing operational systems"
                className="h-72 w-full object-cover opacity-70 lg:h-[460px]"
              />
            </div>
            <div className="pb-4 lg:p-4">
              <Eyebrow>Practical AI for high-stakes admin</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                AI where mistakes are expensive.
              </h2>
              <p className="mt-6 text-sm leading-8 text-neutral-400">Read. Classify. Compare. Route. Verify.</p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {['Invoices', 'Approvals', 'Receipts', 'Follow-ups'].map(item => (
                  <div key={item} className="rounded-lg border border-white/10 bg-[#0c0c0f]/70 px-4 py-3 text-sm text-neutral-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* PRICING */}
        <PricingSection />

        {/* TOOLS */}
        <ImpulseToolsSection />

        {/* CONTACT */}
        <SectionReveal id="contact" className="px-5 py-32 sm:py-44">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">Bring the mess.</h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-neutral-400">We will find the workflow inside it.</p>
            <form className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={e => e.preventDefault()}>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="owner@business.com"
                className="min-h-14 flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-5 text-white outline-none transition placeholder:text-neutral-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20"
              />
              <button
                type="submit"
                className="min-h-14 rounded-lg bg-cyan-200 px-7 text-sm font-semibold text-[#071014] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:ring-offset-2 focus:ring-offset-[#0c0c0f]"
              >
                Request a systems review
              </button>
            </form>
          </div>
        </SectionReveal>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-neutral-400">Blue Dot Technology</p>
          <p>&copy; {currentYear} Blue Dot Technology. Systems over guesswork.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
