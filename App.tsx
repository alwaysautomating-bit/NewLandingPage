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
    items: [
      'Invoice ingestion (email, upload, routing)',
      'OCR + structured data extraction',
      'Centralized storage',
    ],
  },
  {
    group: 'Validation & Controls',
    items: [
      'Vendor verification',
      'Duplicate detection',
      'Approval routing logic',
    ],
  },
  {
    group: 'Payment & Execution',
    items: [
      'Payment scheduling',
      'Controlled authorization flows',
      'Audit-safe processing',
    ],
  },
  {
    group: 'Monitoring & Risk',
    items: [
      'Anomaly detection',
      'Fraud flags',
      'Exception handling',
    ],
  },
  {
    group: 'Reporting & Visibility',
    items: [
      'Workflow reporting',
      'Bottleneck identification',
      'Ongoing system review',
    ],
  },
];

const ADDITIONAL_CAPABILITIES = [
  {
    name: 'Automation & Integrations',
    items: [
      'Connecting tools across your stack',
      'Eliminating manual handoffs',
      'Building reliable workflows',
    ],
  },
  {
    name: 'AI Implementation',
    items: [
      'AI-assisted data extraction',
      'Workflow augmentation (not automation chaos)',
      'Practical AI use inside real operations',
    ],
  },
  {
    name: 'Reporting & Financial Visibility',
    items: [
      'Cash flow clarity',
      'Workflow reporting',
      'Bottleneck identification',
    ],
  },
  {
    name: 'Industry-Specific Systems',
    items: [
      'Legal workflows',
      'Trades / field operations',
      'Custom intake + routing systems',
    ],
  },
  {
    name: 'Cleanup & Recovery',
    items: [
      'Fixing broken workflows',
      'Untangling messy systems',
      'Rebuilding from real-world usage',
    ],
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
    anchor: 'Bundle of both products',
    badge: 'Best value',
    note: null,
    features: ['Operator Bundle included', 'Build & Deploy a Live App included', 'Best value if you want both theory and execution'],
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

// ─── HUMAN TYPING HOOK ────────────────────────────────────────────────────────

function useHumanTyping(phrases: string[]) {
  const [displayed, setDisplayed] = useState('');
  const stateRef = useRef({ phraseIdx: 0, charIdx: 0, phase: 'typing' as 'typing' | 'pausing' | 'deleting' });
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
          let speed = 55 + Math.random() * 65;
          if (isSpace) speed = 80 + Math.random() * 50;
          if (afterPunct) speed += 120 + Math.random() * 100;
          if (s.charIdx < 3) speed += 60;
          if (s.charIdx > 10 && Math.random() < 0.04) speed += 250 + Math.random() * 350;
          s.charIdx++;
          setDisplayed(target.slice(0, s.charIdx));
          timerRef.current = setTimeout(tick, speed);
        } else {
          s.phase = 'pausing';
          timerRef.current = setTimeout(tick, 1600 + Math.random() * 700);
        }
      } else if (s.phase === 'pausing') {
        s.phase = 'deleting';
        timerRef.current = setTimeout(tick, 60);
      } else {
        if (s.charIdx > 0) {
          const chunk = s.charIdx > 6 && Math.random() < 0.12 ? 2 : 1;
          s.charIdx = Math.max(0, s.charIdx - chunk);
          setDisplayed(phrases[s.phraseIdx].slice(0, s.charIdx));
          timerRef.current = setTimeout(tick, 22 + Math.random() * 18);
        } else {
          s.phraseIdx = (s.phraseIdx + 1) % phrases.length;
          s.charIdx = 0;
          s.phase = 'typing';
          timerRef.current = setTimeout(tick, 280 + Math.random() * 180);
        }
      }
    };
    timerRef.current = setTimeout(tick, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phrases]);

  return displayed;
}

// ─── SHARED ───────────────────────────────────────────────────────────────────

const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => (
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
  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/70">{children}</p>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────

const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = ['services', 'process', 'pricing', 'products', 'contact'];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.08] bg-[#0c0c0f]/80 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded focus:outline-none focus:ring-2 focus:ring-cyan-300/40 md:hidden"
        >
          <span className={`block h-px w-5 bg-neutral-300 transition-all duration-200 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-neutral-300 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-5 bg-neutral-300 transition-all duration-200 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
        <a href="#hero" className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_24px_rgba(34,211,238,0.15)]">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
          </span>
          Blue Dot Technology
        </a>
        <div className="ml-auto hidden items-center gap-7 text-sm text-neutral-400 md:flex">
          {links.map(l => <a key={l} className="capitalize transition hover:text-white" href={`#${l}`}>{l}</a>)}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="mt-3 flex flex-col gap-1 border-t border-white/[0.08] pt-3 md:hidden"
          >
            {links.map(l => (
              <a key={l} href={`#${l}`} onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm capitalize text-neutral-300 transition hover:bg-white/[0.05] hover:text-white">
                {l}
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
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
        className="rounded-xl border border-white/[0.1] bg-[#111115] shadow-xl shadow-black/50"
      >
        <div className="flex min-h-[66px] items-center gap-3.5 px-5">
          <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input readOnly value={typed} aria-label="Animated business search"
            className="min-w-0 flex-1 bg-transparent text-lg text-white/90 outline-none sm:text-xl" />
          <span aria-hidden="true" className="h-5 w-px shrink-0 bg-cyan-300/70"
            style={{ animation: 'blink 1s step-start infinite' }} />
        </div>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      </motion.div>
    </div>
  );
};

// ─── PRICING SECTION ──────────────────────────────────────────────────────────

const PricingSection: React.FC = () => (
  <SectionReveal id="pricing" className="px-5 py-32 sm:py-44 border-t border-white/[0.05]">
    <div className="mx-auto max-w-7xl">

      {/* Header */}
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex flex-col rounded-xl border p-8 ${
              tier.highlight
                ? 'border-cyan-300/35 bg-cyan-300/[0.05] shadow-xl shadow-cyan-500/[0.08]'
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

            {/* Size label */}
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600 mb-3">{tier.size}</p>

            {/* Name + price */}
            <h3 className="text-2xl font-semibold text-white">{tier.name}</h3>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className={`text-3xl font-bold ${tier.highlight ? 'text-cyan-200' : 'text-white'}`}>
                {tier.price}
              </span>
              <span className="text-xs text-neutral-500">/ {tier.period}</span>
            </div>

            {/* Best for */}
            <p className="mt-4 text-xs font-medium text-neutral-500 leading-5">{tier.best}</p>

            {/* Description */}
            <p className="mt-3 text-sm leading-6 text-neutral-300">{tier.description}</p>

            {/* Divider */}
            <div className="my-6 h-px bg-white/[0.07]" />

            {/* Features */}
            <ul className="flex flex-col gap-3 flex-1">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <span className="mt-px shrink-0 text-cyan-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              <a
                href="#contact"
                className={`block rounded-lg px-5 py-3 text-center text-sm font-semibold transition focus:outline-none focus:ring-2 ${
                  tier.highlight
                    ? 'bg-cyan-200 text-[#071014] hover:bg-white focus:ring-cyan-300/40'
                    : 'border border-white/[0.12] text-neutral-200 hover:border-cyan-300/25 hover:bg-white/[0.04] focus:ring-cyan-300/20'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-sm text-neutral-500 leading-7 max-w-2xl">
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/70 mb-4">{cap.group}</p>
              <ul className="space-y-2.5">
                {cap.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-400 leading-5">
                    <span className="mt-0.5 shrink-0 text-neutral-600">—</span>
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6"
            >
              <p className="text-sm font-semibold text-neutral-200 mb-4">{cap.name}</p>
              <ul className="space-y-2">
                {cap.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-500 leading-5">
                    <span className="mt-0.5 shrink-0 text-neutral-700">—</span>
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

// ─── DIGITAL PRODUCTS ─────────────────────────────────────────────────────────

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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
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
            <p className="mt-1.5 text-sm text-neutral-400 leading-6">{product.tagline}</p>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{product.price}</span>
              {product.anchor && <span className="mb-1 text-xs text-neutral-600 line-through">{product.anchor}</span>}
            </div>
            {product.note && <p className="mt-1.5 text-xs font-medium text-cyan-300/70">{product.note}</p>}

            <ul className="mt-6 space-y-2.5">
              {product.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <span className="mt-px shrink-0 text-cyan-400">✓</span>{f}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg border border-white/[0.07] bg-[#0c0c0f]/60 px-4 py-3">
              <p className="text-xs text-neutral-600 mb-1">What's included</p>
              <p className="text-sm text-neutral-300 leading-6">{product.deliverable}</p>
            </div>

            <div className="mt-3 rounded-lg border border-white/[0.07] bg-[#0c0c0f]/60 px-4 py-3">
              <p className="text-xs text-neutral-600 mb-1">Built for</p>
              <p className="text-sm text-neutral-300 leading-6">{product.forWho}</p>
            </div>

            <div className="mt-auto pt-7">
              <a href="#contact"
                className={`block rounded-lg px-5 py-3 text-center text-sm font-semibold transition focus:outline-none focus:ring-2 ${
                  product.highlight
                    ? 'bg-cyan-200 text-[#071014] hover:bg-white focus:ring-cyan-300/40'
                    : 'border border-white/[0.12] text-neutral-200 hover:border-cyan-300/25 hover:bg-white/[0.04] focus:ring-cyan-300/20'
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

// ─── SERVICES SECTION ─────────────────────────────────────────────────────────

const SERVICES_DISPLAY = [
  {
    name: 'AI Audit',
    tagline: "Find what's actually breaking in your workflow.",
    price: '$500',
    note: 'Credited toward implementation',
    features: ['Map your current process', 'Identify errors and bottlenecks', 'Get a clear system plan'],
    deliverable: 'Workflow review, failure-point diagnosis, recommended fixes, and priority next steps.',
    result: 'A clear system plan and a first-fix roadmap.',
    cta: 'Find the break',
    forWho: 'Teams dealing with manual work, handoff issues, duplicate entry, approval delays, or unclear process ownership.',
  },
  {
    name: 'Cash Flow Clarity',
    tagline: 'See what cash is coming in, going out, and where the gaps are.',
    price: 'From $750–$1,500/mo',
    note: 'Not a report. A working decision system.',
    features: ['13-week or 90-day cash forecast', 'Weekly review cadence', 'Inflow, outflow, and runway visibility'],
    deliverable: 'Rolling forecast, weekly review rhythm, inflow/outflow visibility, and runway view.',
    result: 'A practical plan for the next 30, 60, or 90 days and clearer next decisions.',
    cta: 'See my cash flow',
    forWho: 'Owners who need to know whether they can safely hire, spend, pay vendors, or take on new work.',
  },
  {
    name: 'Onshore AP',
    tagline: 'Dallas-based accounts payable with control, visibility, and human review.',
    price: 'From $1,500/mo',
    note: 'No offshore processing. No auto-approvals.',
    features: ['Invoice intake and validation', 'Human approval workflows', 'Full audit trail'],
    deliverable: 'Invoice intake, validation, routing, approval coordination, and audit trail management.',
    result: 'A controlled AP process with visibility, cleaner approvals, and stronger oversight.',
    cta: 'Explore AP workflow',
    forWho: 'Businesses that need AP support without losing oversight.',
  },
  {
    name: 'Automation Setup',
    tagline: 'Turn a broken process into a working system.',
    price: '$1,500–$3,500',
    note: null,
    features: ['Client, vendor, or employee onboarding', 'Intake → rules → approval → routing', 'Built on your existing tools'],
    deliverable: 'Forms, routing logic, approvals, notifications, and reporting tied to your current stack.',
    result: 'A working system that reduces manual work and standardizes delivery.',
    cta: 'Build my system',
    forWho: 'Businesses with repetitive admin, approvals, onboarding, document intake, or disconnected tools.',
  },
  {
    name: 'AI Use Policy',
    tagline: 'Set clear rules for how your business uses AI.',
    price: '$500',
    note: null,
    features: ['Define where AI is allowed', 'Set approval and control rules', 'Simple internal policy'],
    deliverable: 'Allowed-use guidance, review points, and lightweight policy language.',
    result: 'A usable internal AI policy rather than a bloated compliance document.',
    cta: 'Set AI rules',
    forWho: 'Small teams already using AI informally and needing guardrails before usage spreads.',
  },
  {
    name: 'Automated Reporting',
    tagline: 'Stop building the same reports by hand every week.',
    price: '$500–$1,500',
    note: null,
    features: ['Real-time dashboards', 'Scheduled reports', 'Clear operational insights'],
    deliverable: 'Dashboard setup, scheduled report flows, and exception/ops reporting.',
    result: 'Consistent reporting with less manual work and better visibility.',
    cta: 'Automate reporting',
    forWho: 'Teams pulling numbers manually from spreadsheets, inboxes, accounting systems, or ops tools.',
  },
  {
    name: 'Compliance + Training',
    tagline: "Train your team on workflows that don't break under pressure.",
    price: '$750–$2,000',
    note: null,
    features: ['Fraud prevention workflows', 'Approval and verification training', 'Real-world scenarios'],
    deliverable: 'Workflow-specific training, fraud-prevention scenarios, and control guidance.',
    result: 'Fewer mistakes, tighter controls, and more consistent execution.',
    cta: 'Strengthen my controls',
    forWho: 'Businesses worried about fraud, bad approvals, payment changes, or inconsistent internal controls.',
  },
  {
    name: 'AI Bootcamps',
    tagline: 'Learn how to actually use AI in your business without breaking things.',
    price: '$300 (small team) / $750 (1:1)',
    note: null,
    features: ['Real business use cases', 'Workflow-first training, not tool demos', 'Safe AI usage and boundaries'],
    deliverable: 'Live training, workflow examples, use-case guidance, and boundary-setting.',
    result: 'A safer, more useful AI workflow for your team or practice.',
    cta: 'Book a session',
    forWho: 'Small teams or individuals trying to use AI effectively without creating risk or chaos.',
  },
  {
    name: 'Invoice Delta',
    tagline: 'Find pricing inconsistencies and cost leakage across vendor invoices.',
    price: 'Custom',
    note: null,
    features: ['Vendor pricing comparison', 'Invoice pattern analysis', 'Cost optimization'],
    deliverable: 'Price comparison review, pattern analysis, and leakage/opportunity findings.',
    result: 'Clear visibility into pricing drift and where costs can be reduced.',
    cta: 'Learn more',
    forWho: 'Companies that suspect vendor drift, pricing inconsistency, or hidden leakage across repeated purchases.',
  },
];

const ServicesSection: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SectionReveal id="services" className="px-5 py-32 sm:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16">
          <Eyebrow>Services</Eyebrow>
          <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">Make the work visible.</h2>
          <p className="mt-5 text-sm leading-7 text-neutral-400">Every service starts with the actual problem, not the assumed one.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES_DISPLAY.map((service, i) => {
            const isOpen = expanded === service.name;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`rounded-xl border transition-colors duration-200 ${isOpen ? 'border-cyan-300/30 bg-cyan-300/[0.04]' : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.13]'}`}
              >
                <button onClick={() => setExpanded(isOpen ? null : service.name)} className="w-full p-6 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white">{service.name}</p>
                      <p className="mt-1 text-sm text-neutral-400 leading-6">{service.tagline}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-sm font-semibold text-cyan-200 whitespace-nowrap">{service.price}</span>
                      <svg className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/[0.07] pt-5 space-y-4">
                        {service.note && <p className="text-xs font-medium text-cyan-300/70">{service.note}</p>}
                        <ul className="space-y-2">
                          {service.features.map(f => (
                            <li key={f} className="flex items-start gap-2 text-sm text-neutral-300">
                              <span className="mt-0.5 shrink-0 text-cyan-400">✓</span>{f}
                            </li>
                          ))}
                        </ul>
                        <div className="rounded-lg bg-[#0c0c0f]/60 border border-white/[0.06] px-4 py-3">
                          <p className="text-xs text-neutral-600 mb-1">You get</p>
                          <p className="text-sm text-neutral-300 leading-6">{service.deliverable}</p>
                        </div>
                        <div className="rounded-lg bg-[#0c0c0f]/60 border border-white/[0.06] px-4 py-3">
                          <p className="text-xs text-neutral-600 mb-1">The result</p>
                          <p className="text-sm text-neutral-300 leading-6">{service.result}</p>
                        </div>
                        <a href="#contact" className="inline-flex items-center rounded-lg bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-[#071014] transition hover:bg-white">
                          {service.cta} →
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0c0c0f] text-neutral-200 selection:bg-cyan-300/20 selection:text-cyan-100">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.08),transparent_26%),radial-gradient(circle_at_55%_90%,rgba(20,184,166,0.06),transparent_30%)]" />

      <Nav />

      <main className="relative z-10">
        {/* HERO */}
        <section id="hero" className="flex min-h-screen items-center px-5 pb-32 pt-40 sm:pt-48">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }} className="mb-10">
                <HeroSearch />
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.22 }}
                className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-[5.5rem]">
                It&apos;s not you.<br className="hidden sm:block" /> It&apos;s your systems.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.36 }}
                className="mt-7 max-w-lg text-base leading-8 text-neutral-400 sm:text-lg">
                Manual steps. Disconnected tools. Money leaks you cannot see.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }}
                className="mt-10 flex flex-wrap gap-4">
                <a href="#pricing" className="inline-flex min-h-12 items-center rounded-lg bg-cyan-200 px-6 text-sm font-semibold text-[#071014] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40">
                  See pricing
                </a>
                <a href="#products" className="inline-flex min-h-12 items-center rounded-lg border border-white/[0.1] px-6 text-sm font-medium text-neutral-300 transition hover:border-cyan-300/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/20">
                  Start with a product →
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <ServicesSection />

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
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                alt="Connected city lights representing operational systems"
                className="h-72 w-full object-cover opacity-70 lg:h-[460px]" />
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
                className="min-h-14 rounded-lg bg-cyan-200 px-7 text-sm font-semibold text-[#071014] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40">
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
