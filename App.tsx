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
  "something in my business keeps breaking and I don't know what",
  'how do I get more customers without more ad spend',
];

const PRICING_TIERS = [
  {
    size: 'Small',
    name: 'Fix One Workflow',
    price: 'Starting at $497',
    period: 'one-time',
    tag: null,
    best: 'Best for when something is clearly broken.',
    description: 'We find the leak, map the process, and fix it. One system. Working.',
    features: [
      'Workflow audit + mapping',
      'Bottlenecks identified',
      'Clean implementation',
      'Tool + process recommendations',
    ],
    cta: 'Fix the break',
    highlight: false,
  },
  {
    size: 'Medium',
    name: 'Run Your Systems',
    price: 'Starting at $1,497',
    period: 'per month',
    tag: 'Most common',
    best: "Best when you don't want to deal with ops anymore.",
    description: 'We build it, monitor it, and keep it running.',
    features: [
      'Core workflows built + maintained',
      'Invoice + approval flows stabilized',
      'Monthly system review',
      'Issue + anomaly monitoring',
    ],
    cta: 'Run my systems',
    highlight: true,
  },
  {
    size: 'Large',
    name: 'Full Operations Layer',
    price: 'Starting at $3,500',
    period: 'per month',
    tag: null,
    best: 'Best for teams that need structure at scale.',
    description: 'We own the system so it actually behaves.',
    features: [
      'End-to-end workflow architecture',
      'AP + AR + reporting structure',
      'Vendor + risk controls',
      'Custom rules + ongoing optimization',
    ],
    cta: "Let's scope it",
    highlight: false,
  },
];

const SYSTEM_CAPABILITIES = [
  {
    group: 'Intake & Capture',
    items: ['Invoice ingestion (email, upload, routing)', 'OCR + structured data extraction', 'Centralized storage'],
  },
  {
    group: 'Validation & Controls',
    items: ['Vendor verification', 'Duplicate detection', 'Approval routing logic'],
  },
  {
    group: 'Payment & Execution',
    items: ['Payment scheduling', 'Controlled authorization flows', 'Audit-safe processing'],
  },
  {
    group: 'Monitoring & Risk',
    items: ['Anomaly detection', 'Fraud flags', 'Exception handling'],
  },
  {
    group: 'Reporting & Visibility',
    items: ['Workflow reporting', 'Bottleneck identification', 'Ongoing system review'],
  },
];

const ADDITIONAL_CAPABILITIES = [
  {
    name: 'Automation & Integrations',
    items: ['Connecting tools across your stack', 'Eliminating manual handoffs', 'Building reliable workflows'],
  },
  {
    name: 'AI Implementation',
    items: ['AI-assisted data extraction', 'Workflow augmentation (not automation chaos)', 'Practical AI use inside real operations'],
  },
  {
    name: 'Reporting & Financial Visibility',
    items: ['Cash flow clarity', 'Workflow reporting', 'Bottleneck identification'],
  },
  {
    name: 'Industry-Specific Systems',
    items: ['Legal workflows', 'Trades / field operations', 'Custom intake + routing systems'],
  },
  {
    name: 'Cleanup & Recovery',
    items: ['Fixing broken workflows', 'Untangling messy systems', 'Rebuilding from real-world usage'],
  },
];

const DIGITAL_PRODUCTS = [
  {
    name: 'The Operator Bundle',
    tagline: 'Understand how real systems actually work.',
    price: '$299',
    anchor: 'Previously $499',
    badge: 'Early access',
    note: null,
    features: ['Viform Methodology', 'Where AI Stops + Quick Capture Lite', 'Build guide + SYNCd AP blueprint'],
    deliverable: 'Five PDFs: methodology, AI boundaries playbook, starter system, build guide, and AP blueprint.',
    forWho: 'Operators, builders, and business owners who want a practical system for designing controlled workflows.',
    cta: 'Get the Operator Bundle',
    highlight: false,
  },
  {
    name: 'Build & Deploy a Live App',
    tagline: 'Go from idea to live system using AI.',
    price: '$199',
    anchor: null,
    badge: 'Hands-on',
    note: 'You will have a live app. Not a prototype.',
    features: ['Define a system', 'Generate the app with AI', 'Deploy it live'],
    deliverable: 'Build walkthrough, Claude prompt, GitHub setup, and Vercel deployment steps.',
    forWho: 'People who want a hands-on build path instead of theory.',
    cta: 'Build and deploy my app',
    highlight: false,
  },
  {
    name: 'The Full Operator Stack',
    tagline: 'Understand it. Then build it.',
    price: '$599',
    anchor: 'Bundle of both',
    badge: 'Best value',
    note: null,
    features: ['Operator Bundle included', 'Build & Deploy a Live App included', 'Best value if you want both'],
    deliverable: 'Everything in both product offers.',
    forWho: 'Buyers who want both the system model and the live build path.',
    cta: 'Get everything',
    highlight: true,
  },
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

// ─── TYPING HOOK (freeze-proof) ───────────────────────────────────────────────
// Uses a single incrementing generation counter so any orphaned
// setTimeout from a previous render cycle simply no-ops on fire.

function useHumanTyping(phrases: readonly string[]) {
  const [displayed, setDisplayed] = useState('');
  const genRef = useRef(0);
  const phraseIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const phaseRef = useRef<'typing' | 'pausing' | 'deleting'>('typing');

  useEffect(() => {
    const myGen = ++genRef.current;

    const tick = () => {
      if (genRef.current !== myGen) return; // stale closure - bail out

      const phraseIdx = phraseIdxRef.current;
      const charIdx = charIdxRef.current;
      const phase = phaseRef.current;
      const target = phrases[phraseIdx];

      if (phase === 'typing') {
        if (charIdx < target.length) {
          const ch = target[charIdx];
          const isSpace = ch === ' ';
          const afterPunct = charIdx > 0 && ',.!?'.includes(target[charIdx - 1]);
          let speed = 55 + Math.random() * 65;
          if (isSpace) speed = 80 + Math.random() * 50;
          if (afterPunct) speed += 100 + Math.random() * 80;
          if (charIdx < 3) speed += 50;
          if (charIdx > 10 && Math.random() < 0.04) speed += 220 + Math.random() * 280;
          charIdxRef.current = charIdx + 1;
          setDisplayed(target.slice(0, charIdx + 1));
          setTimeout(tick, speed);
        } else {
          phaseRef.current = 'pausing';
          setTimeout(tick, 1400 + Math.random() * 600);
        }
      } else if (phase === 'pausing') {
        phaseRef.current = 'deleting';
        setTimeout(tick, 50);
      } else {
        // deleting
        if (charIdx > 0) {
          const chunk = charIdx > 8 && Math.random() < 0.1 ? 2 : 1;
          const next = Math.max(0, charIdx - chunk);
          charIdxRef.current = next;
          setDisplayed(target.slice(0, next));
          setTimeout(tick, 18 + Math.random() * 16);
        } else {
          phraseIdxRef.current = (phraseIdx + 1) % phrases.length;
          charIdxRef.current = 0;
          phaseRef.current = 'typing';
          setTimeout(tick, 260 + Math.random() * 160);
        }
      }
    };

    const t = setTimeout(tick, 600);
    return () => {
      genRef.current++; // invalidate this generation
      clearTimeout(t);
    };
  }, [phrases]);

  return displayed;
}

// ─── SHARED ───────────────────────────────────────────────────────────────────

const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({
  children, className = '', id,
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-12%' }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.section>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/70">{children}</p>
);

const Check: React.FC = () => (
  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
    <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────

const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = ['process', 'pricing', 'products', 'contact'];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.08] bg-[#0c0c0f]/85 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        {/* Hamburger left, mobile only */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded md:hidden"
        >
          <span className={`block h-px w-5 bg-neutral-300 transition-all duration-200 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-neutral-300 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-5 bg-neutral-300 transition-all duration-200 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>

        <a href="#hero" className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_22px_rgba(34,211,238,0.14)]">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
          </span>
          Blue Dot Technology
        </a>

        <div className="ml-auto hidden items-center gap-7 text-sm text-neutral-400 md:flex">
          {links.map(l => (
            <a key={l} className="capitalize transition hover:text-white" href={`#${l}`}>{l}</a>
          ))}
        </div>
      </div>

      {/* Mobile dropdown - no AnimatePresence to avoid re-render cascade */}
      {open && (
        <div className="mt-3 flex flex-col gap-1 border-t border-white/[0.08] pt-3 md:hidden">
          {links.map(l => (
            <a key={l} href={`#${l}`} onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm capitalize text-neutral-300 transition hover:bg-white/[0.05] hover:text-white">
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

// ─── HERO TYPEWRITER ──────────────────────────────────────────────────────────

const HeroTypewriter: React.FC = () => {
  const typed = useHumanTyping(SEARCH_PHRASES);

  return (
    <>
      <style>{`
        @keyframes cur { 0%,100%{opacity:1} 50%{opacity:0} }
        .tw-cursor {
          display: inline-block;
          width: 3px;
          height: 0.85em;
          background: #fff;
          border-radius: 1px;
          margin-left: 4px;
          vertical-align: middle;
          animation: cur 1s step-start infinite;
        }
      `}</style>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        aria-live="polite"
        className="text-3xl font-light leading-snug tracking-tight text-white sm:text-4xl lg:text-5xl"
      >
        {typed}
        <span aria-hidden="true" className="tw-cursor" />
      </motion.p>
    </>
  );
};

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

const PricingSection: React.FC = () => (
  <SectionReveal id="pricing" className="px-5 py-32 sm:py-44 border-t border-white/[0.05]">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl mb-16">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Pick the level of fix you need.
        </h2>
      </div>

      {/* Three tiers */}
      <div className="grid gap-5 lg:grid-cols-3">
        {PRICING_TIERS.map((tier, i) => (
          <motion.div
            key={tier.size}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className={`relative flex flex-col rounded-xl border p-8 ${
              tier.highlight
                ? 'border-cyan-300/35 bg-cyan-300/[0.05] shadow-xl shadow-cyan-500/[0.07]'
                : 'border-white/[0.08] bg-white/[0.02]'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-6">
                <span className="rounded-full bg-cyan-300 px-3 py-0.5 text-xs font-semibold text-[#071014]">
                  {tier.tag}
                </span>
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600 mb-3">{tier.size}</p>
            <h3 className="text-2xl font-semibold text-white">{tier.name}</h3>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className={`text-3xl font-bold ${tier.highlight ? 'text-cyan-200' : 'text-white'}`}>
                {tier.price}
              </span>
              <span className="text-xs text-neutral-500">/ {tier.period}</span>
            </div>

            <p className="mt-4 text-xs text-neutral-500 leading-5">{tier.best}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-300">{tier.description}</p>

            <div className="my-6 h-px bg-white/[0.07]" />

            <ul className="flex flex-col gap-3 flex-1">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <Check />{f}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a href="#contact"
                className={`block rounded-lg px-5 py-3 text-center text-sm font-semibold transition ${
                  tier.highlight
                    ? 'bg-cyan-200 text-[#071014] hover:bg-white'
                    : 'border border-white/[0.12] text-neutral-200 hover:border-cyan-300/25 hover:bg-white/[0.04]'
                }`}>
                {tier.cta}
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-sm leading-7 text-neutral-500 max-w-2xl">
        No two operations are the same. Pricing reflects your workflows — not a template. We scope it quickly and give you a clear number.
      </p>

      {/* System capabilities */}
      <div className="mt-24">
        <div className="max-w-xl mb-12">
          <Eyebrow>What's inside</Eyebrow>
          <h3 className="text-3xl font-semibold text-white leading-tight">Capabilities by system.</h3>
          <p className="mt-4 text-sm text-neutral-400 leading-7">
            Every tier draws from the same system. What changes is depth, coverage, and ownership.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {SYSTEM_CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.group}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.06 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/70 mb-4">{cap.group}</p>
              <ul className="space-y-2.5">
                {cap.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-5 text-neutral-400">
                    <span className="mt-0.5 shrink-0 text-neutral-700">&#8212;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional capabilities */}
      <div className="mt-20 border-t border-white/[0.06] pt-16">
        <div className="max-w-xl mb-10">
          <Eyebrow>Additional capabilities</Eyebrow>
          <h3 className="text-3xl font-semibold text-white leading-tight">Added as your systems evolve.</h3>
          <p className="mt-4 text-sm text-neutral-400 leading-7">
            Not every business needs everything upfront. These are scoped and added when you're ready.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ADDITIONAL_CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.06 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6"
            >
              <p className="text-sm font-semibold text-neutral-200 mb-4">{cap.name}</p>
              <ul className="space-y-2">
                {cap.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-5 text-neutral-500">
                    <span className="mt-0.5 shrink-0 text-neutral-700">&#8212;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </SectionReveal>
);

const ProductsSection: React.FC = () => (
  <SectionReveal id="products" className="px-5 py-32 sm:py-44 border-t border-white/[0.05]">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl mb-16">
        <Eyebrow>Digital products</Eyebrow>
        <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">Not ready for the full fix?</h2>
        <p className="mt-5 text-sm leading-7 text-neutral-400">
          Start here. Buy today, use this week. No call required.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {DIGITAL_PRODUCTS.map((product, i) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className={`relative flex flex-col rounded-xl border p-8 ${
              product.highlight
                ? 'border-cyan-300/35 bg-cyan-300/[0.05] shadow-xl shadow-cyan-500/[0.07]'
                : 'border-white/[0.08] bg-white/[0.02]'
            }`}
          >
            {product.highlight && (
              <div className="absolute -top-3 left-6">
                <span className="rounded-full bg-cyan-300 px-3 py-0.5 text-xs font-semibold text-[#071014]">{product.badge}</span>
              </div>
            )}
            {!product.highlight && (
              <span className="mb-3 inline-block rounded-full border border-white/[0.1] px-2.5 py-0.5 text-xs font-medium text-neutral-500">
                {product.badge}
              </span>
            )}

            <h3 className="text-xl font-semibold text-white mt-1">{product.name}</h3>
            <p className="mt-1.5 text-sm leading-6 text-neutral-400">{product.tagline}</p>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{product.price}</span>
              {product.anchor && (
                <span className="mb-1 text-xs text-neutral-600 line-through">{product.anchor}</span>
              )}
            </div>
            {product.note && <p className="mt-1.5 text-xs font-medium text-cyan-300/70">{product.note}</p>}

            <ul className="mt-6 space-y-2.5">
              {product.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <Check />{f}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg border border-white/[0.07] bg-[#0c0c0f]/60 px-4 py-3">
              <p className="text-xs text-neutral-600 mb-1">What's included</p>
              <p className="text-sm leading-6 text-neutral-300">{product.deliverable}</p>
            </div>

            <div className="mt-3 rounded-lg border border-white/[0.07] bg-[#0c0c0f]/60 px-4 py-3">
              <p className="text-xs text-neutral-600 mb-1">Built for</p>
              <p className="text-sm leading-6 text-neutral-300">{product.forWho}</p>
            </div>

            <div className="mt-auto pt-7">
              <a href="#contact"
                className={`block rounded-lg px-5 py-3 text-center text-sm font-semibold transition ${
                  product.highlight
                    ? 'bg-cyan-200 text-[#071014] hover:bg-white'
                    : 'border border-white/[0.12] text-neutral-200 hover:border-cyan-300/25 hover:bg-white/[0.04]'
                }`}>
                {product.cta}
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-neutral-600">
        Purchased a product and want to go deeper?{' '}
        <a href="#contact" className="text-cyan-400 underline underline-offset-4 hover:text-cyan-200 transition">
          The cost applies toward any engagement.
        </a>
      </p>
    </div>
  </SectionReveal>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0c0c0f] text-neutral-200 selection:bg-cyan-300/20 selection:text-cyan-100">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.11),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.07),transparent_26%),radial-gradient(circle_at_55%_90%,rgba(20,184,166,0.06),transparent_30%)]" />

      <Nav />

      <main className="relative z-10">
        {/* HERO */}
        <section id="hero" className="relative flex min-h-screen flex-col bg-[#0c0c0f]">
          {/* Top half — pure black, typewriter centered */}
          <div className="flex flex-1 items-center justify-center px-8 pb-16 pt-36 sm:pt-44">
            <div className="w-full max-w-4xl">
              <HeroTypewriter />
            </div>
          </div>

          {/* Hairline divider */}
          <div className="mx-8 h-px bg-white/[0.07]" />

          {/* Bottom half — headline + CTAs */}
          <div className="px-8 pb-24 pt-16 sm:pb-32">
            <div className="mx-auto w-full max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-[5.5rem]"
              >
                It&apos;s not you.<br className="hidden sm:block" /> It&apos;s your systems.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.34 }}
                className="mt-7 max-w-lg text-base leading-8 text-neutral-400 sm:text-lg"
              >
                Manual steps. Disconnected tools. Money leaks you cannot see.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.46 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <a href="#pricing"
                  className="inline-flex min-h-12 items-center rounded-lg bg-cyan-200 px-6 text-sm font-semibold text-[#071014] transition hover:bg-white">
                  See pricing
                </a>
                <a href="#products"
                  className="inline-flex min-h-12 items-center rounded-lg border border-white/[0.1] px-6 text-sm font-medium text-neutral-300 transition hover:border-cyan-300/25 hover:text-white">
                  Start with a product &rarr;
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <SectionReveal id="process" className="border-y border-white/[0.06] bg-white/[0.015] px-5 py-32 sm:py-44">
          <div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">From messy to reliable.</h2>
            </div>
            <div className="space-y-5">
              {WORKFLOW_STEPS.map((step, i) => (
                <div key={step.title} className="rounded-xl border border-white/[0.08] bg-[#0d0d10]/80 p-8">
                  <div className="mb-5 flex items-center gap-4">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-300/10 text-sm font-semibold text-cyan-200">{i + 1}</span>
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
            <div className="max-w-3xl mb-16">
              <Eyebrow>Failure has a workflow</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">Good systems know when to stop.</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {PRINCIPLES.map(p => (
                <article key={p.action} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8">
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
          <div className="mx-auto grid max-w-7xl gap-12 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                alt="Connected city lights representing operational systems"
                className="h-72 w-full object-cover opacity-70 lg:h-[460px]"
              />
            </div>
            <div className="pb-4 lg:p-4">
              <Eyebrow>Practical AI for high-stakes admin</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">AI where mistakes are expensive.</h2>
              <p className="mt-6 text-sm leading-8 text-neutral-400">Read. Classify. Compare. Route. Verify.</p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {['Invoices', 'Approvals', 'Receipts', 'Follow-ups'].map(item => (
                  <div key={item} className="rounded-lg border border-white/[0.08] bg-[#0c0c0f]/70 px-4 py-3 text-sm text-neutral-300">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* PRICING */}
        <PricingSection />

        {/* PRODUCTS */}
        <ProductsSection />

        {/* CONTACT */}
        <SectionReveal id="contact" className="px-5 py-32 sm:py-44 border-t border-white/[0.05]">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">Bring the mess.</h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-neutral-400">We will find the workflow inside it.</p>
            <form className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={e => e.preventDefault()}>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" type="email" required placeholder="owner@business.com"
                className="min-h-14 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.05] px-5 text-white outline-none transition placeholder:text-neutral-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20" />
              <button type="submit"
                className="min-h-14 rounded-lg bg-cyan-200 px-7 text-sm font-semibold text-[#071014] transition hover:bg-white">
                Request a systems review
              </button>
            </form>
          </div>
        </SectionReveal>
      </main>

      <footer className="relative z-10 border-t border-white/[0.05] px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-neutral-400">Blue Dot Technology</p>
          <p>&copy; {currentYear} Blue Dot Technology. Systems over guesswork.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
