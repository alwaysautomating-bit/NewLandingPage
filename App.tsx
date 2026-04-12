import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const SEARCH_PHRASES = [
  'how do I get more customers',
  'why is my cash flow always tight',
  'how do I get more local visibility',
  'how do I automate this without hiring more people',
  'how do I use AI in my business without breaking everything',
  'where is all my money actually going'
];

const FINAL_SEARCH = 'something in my business is broken';

const SERVICES = [
  {
    title: 'Invoice Intelligence',
    copy: 'Capture, route, and review invoices without inbox chaos.'
  },
  {
    title: 'Fraud Detection',
    copy: 'Spot duplicate charges, odd patterns, and vendor drift early.'
  },
  {
    title: 'Workflow Automation',
    copy: 'Move repeat work out of inboxes, texts, and memory.'
  },
  {
    title: 'Quick Capture',
    copy: 'Collect receipts, notes, and approvals when work happens.'
  }
];

const WORKFLOW_STEPS = [
  {
    title: 'Map the bottleneck',
    copy: 'Find where time, money, or trust gets stuck.'
  },
  {
    title: 'Structure the inputs',
    copy: 'Clean up the forms, files, approvals, and handoffs.'
  },
  {
    title: 'Build the workflow',
    copy: 'Automate the repeatable parts. Keep judgment where it belongs.'
  }
];

const PRINCIPLES = [
  {
    rule: 'Ambiguity',
    action: 'HOLD',
    copy: 'Incomplete inputs stop before they create rework.'
  },
  {
    rule: 'Uncertainty',
    action: 'VERIFY',
    copy: 'High-stakes steps get checked.'
  },
  {
    rule: 'Conflict',
    action: 'ESCALATE',
    copy: 'Conflicting records go to the right person.'
  }
];

type Diagnosis = {
  id: string;
  title: string;
  keywords: string[];
  rootIssue: string;
  help: string[];
  firstStep: string;
};

type DiagnosisResult = Diagnosis & {
  userProblem: string;
  isFallback?: boolean;
};

const DIAGNOSES: Diagnosis[] = [
  {
    id: 'cash-flow',
    title: 'Cash flow visibility issue',
    keywords: ['cash flow', 'cashflow', 'money tight', 'cash', 'receivable', 'receivables', 'expenses', 'invoicing delay', 'payment delay', 'where is my money', 'profit'],
    rootIssue: 'Poor visibility into timing, receivables, expenses, or invoice delays.',
    help: [
      'cash visibility dashboards',
      'invoicing cleanup',
      'payment tracking workflows',
      'expense pattern review'
    ],
    firstStep: 'Find where money is delayed, leaking, or hidden.'
  },
  {
    id: 'invoice-volume',
    title: 'Invoice intake and approval issue',
    keywords: ['too many invoices', 'invoices', 'invoice', 'bills', 'vendor bills', 'approval', 'approvals', 'duplicate invoice', 'payables'],
    rootIssue: 'Scattered intake, manual review, and unclear approvals.',
    help: [
      'invoice capture and organization',
      'approval workflow setup',
      'duplicate and anomaly detection',
      'bookkeeping visibility'
    ],
    firstStep: 'Create one intake and review path.'
  },
  {
    id: 'bookkeeping-behind',
    title: 'Delayed bookkeeping workflow',
    keywords: ['bookkeeping always behind', 'bookkeeping', 'books behind', 'month end', 'receipts', 'categorization', 'reconciliation', 'reports late'],
    rootIssue: 'Inputs arrive from too many places, too late.',
    help: [
      'receipt and invoice capture',
      'categorization workflow',
      'month-end cleanup process',
      'reporting visibility'
    ],
    firstStep: 'Centralize intake and set review checkpoints.'
  },
  {
    id: 'manual-admin',
    title: 'Manual admin drag',
    keywords: ['manual admin', 'admin taking too long', 'too much admin', 'repetitive work', 'inbox', 'texts', 'memory', 'paperwork', 'data entry', 'busywork', 'automate'],
    rootIssue: 'Repeat work is stuck in inboxes, texts, and memory.',
    help: [
      'workflow automation',
      'intake systems',
      'AI-assisted sorting',
      'task routing'
    ],
    firstStep: 'Route repeat admin through one process.'
  },
  {
    id: 'lead-growth',
    title: 'Lead capture and follow-up issue',
    keywords: ['need more customers', 'more customers', 'customers', 'leads', 'lead capture', 'follow up', 'follow-up', 'local visibility', 'visibility', 'crm', 'sales'],
    rootIssue: 'Inconsistent capture, follow-up, and visibility.',
    help: [
      'lead intake workflow',
      'follow-up automation',
      'CRM process setup',
      'visibility and conversion support'
    ],
    firstStep: 'Capture, track, and follow up every lead.'
  }
];

const FALLBACK_DIAGNOSIS: Diagnosis = {
  id: 'operations',
  title: 'Operations workflow issue',
  keywords: [],
  rootIssue: 'This sounds like an operations issue: unclear steps, scattered tools, or too much memory work.',
  help: [
    'workflow mapping',
    'bottleneck identification',
    'intake and routing cleanup',
    'first-system recommendation'
  ],
  firstStep: 'Map the workflow and choose the first system to fix.'
};

const normalizeQuery = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

const findDiagnosis = (query: string): DiagnosisResult => {
  const normalized = normalizeQuery(query);

  const ranked = DIAGNOSES.map((diagnosis) => {
    const score = diagnosis.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalizeQuery(keyword);

      if (normalized === normalizedKeyword) {
        return total + 8;
      }

      if (normalized.includes(normalizedKeyword)) {
        return total + 5;
      }

      const keywordWords = normalizedKeyword.split(' ').filter(Boolean);
      const wordScore = keywordWords.filter((word) => normalized.includes(word)).length;
      return total + wordScore;
    }, 0);

    return { diagnosis, score };
  }).sort((a, b) => b.score - a.score);

  const bestMatch = ranked[0];
  const diagnosis = bestMatch && bestMatch.score > 0 ? bestMatch.diagnosis : FALLBACK_DIAGNOSIS;

  return {
    ...diagnosis,
    userProblem: query,
    isFallback: diagnosis.id === FALLBACK_DIAGNOSIS.id
  };
};

const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({
  children,
  className = '',
  id
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-18%' }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.section>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-4 text-sm font-medium uppercase tracking-normal text-cyan-300/80">{children}</p>
);

const TypingSearch: React.FC = () => {
  const sequence = useMemo(() => [...SEARCH_PHRASES, FINAL_SEARCH], []);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const current = sequence[phraseIndex];

    if (!deleting && typed === current) {
      if (current === FINAL_SEARCH) {
        setHasRevealed(true);
      }

      const pauseTimer = window.setTimeout(() => setDeleting(true), 720);
      return () => window.clearTimeout(pauseTimer);
    }

    if (deleting && typed.length === 0) {
      setDeleting(false);
      setPhraseIndex((index) => (index + 1) % sequence.length);
      return;
    }

    const speed = deleting ? 24 : 44;
    const timer = window.setTimeout(() => {
      setTyped((value) =>
        deleting ? value.slice(0, -1) : current.slice(0, value.length + 1)
      );
    }, speed);

    return () => window.clearTimeout(timer);
  }, [deleting, phraseIndex, sequence, typed]);

  return (
    <div className="w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-cyan-500/10 backdrop-blur"
      >
        <div className="absolute inset-x-8 top-0 h-px bg-cyan-300/60" />
        <label htmlFor="hero-search" className="sr-only">
          Business systems search
        </label>
        <div className="flex min-h-16 items-center gap-3 rounded-md border border-white/10 bg-[#0c0c0f]/90 px-4 text-left sm:px-5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
          <input
            id="hero-search"
            readOnly
            value={typed}
            aria-label="Animated search phrase"
            className="min-w-0 flex-1 bg-transparent text-base text-white outline-none sm:text-xl"
          />
          <span aria-hidden="true" className="h-6 w-px animate-pulse bg-cyan-200" />
        </div>
      </motion.div>

      {hasRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 max-w-3xl"
        >
          <h2 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">
            It&apos;s not you. It&apos;s your systems.
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-300 sm:text-xl">
            Manual steps. Disconnected tools. Money leaks you cannot see.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const ProblemTranslator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setResult(findDiagnosis(trimmedQuery));
  };

  return (
    <div className="w-full max-w-5xl">
      <form
        onSubmit={handleSubmit}
        className="relative mt-8 overflow-hidden rounded-lg border border-cyan-300/20 bg-[#0c0c0f]/90 p-3 shadow-2xl shadow-cyan-500/10 backdrop-blur"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="problem-search" className="sr-only">
            Search what is breaking in your business
          </label>
          <input
            id="problem-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search what’s breaking in your business"
            className="min-h-14 flex-1 rounded-md border border-white/10 bg-white/[0.05] px-5 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
          />
          <button
            type="submit"
            className="min-h-14 rounded-md bg-cyan-200 px-6 font-semibold text-[#071014] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:ring-offset-2 focus:ring-offset-[#0c0c0f]"
          >
            Translate problem
          </button>
        </div>
      </form>

      {result && (
        <motion.div
          key={`${result.id}-${result.userProblem}`}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-2xl shadow-cyan-500/10"
        >
          <div className="border-b border-white/10 bg-cyan-300/[0.06] p-7 sm:p-9">
            <p className="mb-4 text-sm font-medium uppercase tracking-normal text-cyan-200">
              Problem translation
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {result.title}
            </h2>
            <p className="mt-5 text-sm text-neutral-400">
              Problem: <span className="text-neutral-200">{result.userProblem}</span>
            </p>
          </div>

          <div className="grid gap-10 p-7 sm:p-9 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-medium text-cyan-200">Root issue</p>
              <p className="mt-4 leading-8 text-neutral-300">{result.rootIssue}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-cyan-200">Blue Dot can help with</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {result.help.map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-white/10 bg-[#0c0c0f]/65 p-4 text-sm leading-6 text-neutral-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-7 sm:p-9">
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
              <p className="text-sm font-medium text-cyan-200">Best first step</p>
              <p className="mt-3 leading-7 text-neutral-200">{result.firstStep}</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-cyan-200 px-5 font-semibold text-[#071014] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:ring-offset-2 focus:ring-offset-[#0c0c0f]"
              >
                {result.isFallback ? 'Talk through this problem' : 'Map this workflow'}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0c0c0f] text-neutral-200 selection:bg-cyan-300/20 selection:text-cyan-100">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.11),transparent_26%),radial-gradient(circle_at_55%_90%,rgba(20,184,166,0.08),transparent_30%)]" />

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0c0c0f]/70 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#hero" className="flex items-center gap-3 text-sm font-semibold text-white" aria-label="Blue Dot Technology home">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
            </span>
            Blue Dot Technology
          </a>
          <div className="hidden items-center gap-7 text-sm text-neutral-400 md:flex">
            <a className="transition hover:text-white" href="#services">Services</a>
            <a className="transition hover:text-white" href="#process">Process</a>
            <a className="transition hover:text-white" href="#contact">Contact</a>
          </div>
          <a
            href="#contact"
            className="rounded-md border border-cyan-300/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            Start with the leak
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        <section id="hero" className="flex min-h-screen items-center px-5 pb-32 pt-36 sm:pt-44">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-4xl">
              <div className="mb-12">
                <TypingSearch />
              </div>
              <ProblemTranslator />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 mt-20 text-sm font-medium text-cyan-300"
              >
                AI, automation, and financial workflow systems.
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08 }}
                className="max-w-4xl text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl"
              >
                Find the break in the system before it breaks the business.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.16 }}
                className="mt-8 max-w-xl text-lg leading-8 text-neutral-300"
              >
                Blue Dot Technology turns operational drag into clear workflows.
              </motion.p>
            </div>

          </div>
        </section>

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
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="group min-h-72 rounded-lg border border-white/10 bg-white/[0.035] p-8 shadow-xl shadow-black/20 transition hover:border-cyan-300/40 hover:bg-white/[0.055]"
                >
                  <div className="mb-12 flex items-center justify-between">
                    <span className="text-sm text-neutral-500">0{index + 1}</span>
                    <span className="h-2 w-2 rounded-full bg-cyan-300/70 transition group-hover:shadow-[0_0_20px_rgba(103,232,249,0.8)]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-6 leading-8 text-neutral-400">{service.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="process" className="border-y border-white/10 bg-white/[0.025] px-5 py-32 sm:py-44">
          <div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                From messy to reliable.
              </h2>
            </div>
            <div className="space-y-6">
              {WORKFLOW_STEPS.map((step, index) => (
                <div key={step.title} className="rounded-lg border border-white/10 bg-[#0c0c0f]/80 p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-cyan-300/10 text-sm font-semibold text-cyan-200">
                      {index + 1}
                    </span>
                    <h3 className="text-2xl font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="leading-7 text-neutral-400">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="px-5 py-32 sm:py-44">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Eyebrow>Failure has a workflow</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Good systems know when to stop.
              </h2>
            </div>
            <div className="mt-20 grid gap-6 md:grid-cols-3">
              {PRINCIPLES.map((principle) => (
                <article key={principle.action} className="rounded-lg border border-white/10 bg-white/[0.035] p-8">
                  <p className="text-lg text-neutral-400">{principle.rule}</p>
                  <h3 className="mt-3 text-4xl font-semibold text-cyan-200">{principle.action}</h3>
                  <p className="mt-6 leading-7 text-neutral-400">{principle.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="px-5 py-32 sm:py-44">
          <div className="mx-auto grid max-w-7xl gap-16 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-cyan-500/10 md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                alt="Abstract view of connected city lights representing operational systems"
                className="h-80 w-full object-cover opacity-80 lg:h-[520px]"
              />
            </div>
            <div className="pb-4 lg:p-6">
              <Eyebrow>Practical AI for high-stakes admin</Eyebrow>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                AI where mistakes are expensive.
              </h2>
              <p className="mt-8 max-w-xl leading-8 text-neutral-300">
                Read. Classify. Compare. Route. Verify.
              </p>
              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {['Invoices', 'Approvals', 'Receipts', 'Follow-ups'].map((item) => (
                  <div key={item} className="rounded-md border border-white/10 bg-[#0c0c0f]/70 px-4 py-3 text-sm text-neutral-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="contact" className="px-5 py-32 sm:py-44">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Bring the mess.
            </h2>
            <p className="mx-auto mt-8 max-w-xl leading-8 text-neutral-400">
              We will find the workflow inside it.
            </p>
            <form className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="owner@business.com"
                className="min-h-14 flex-1 rounded-md border border-white/10 bg-white/[0.05] px-5 text-white outline-none transition placeholder:text-neutral-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
              />
              <button
                type="submit"
                className="min-h-14 rounded-md bg-cyan-200 px-7 font-semibold text-[#071014] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:ring-offset-2 focus:ring-offset-[#0c0c0f]"
              >
                Request a systems review
              </button>
            </form>
          </div>
        </SectionReveal>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-neutral-300">Blue Dot Technology</p>
          <p>&copy; {currentYear} Blue Dot Technology. Systems over guesswork.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
