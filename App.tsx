import React from 'react';
import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  {
    q: "Do I need to buy new software?",
    a: "Usually no. Most businesses already have 80% of what they need—they're just not using it effectively."
  },
  {
    q: "How long does this take?",
    a: "Depends on the complexity, but most small business projects take 4-8 weeks from assessment to implementation."
  },
  {
    q: "What if my team resists change?",
    a: "We design for adoption from day one. That means training, documentation, and systems that are genuinely easier than the old way."
  },
  {
    q: "Is this expensive?",
    a: "Less expensive than continuing to lose time, money, and sanity to broken processes. We'll give you transparent pricing after understanding your needs."
  }
];

const SERVICES_CARDS = [
  {
    title: "Business Systems Cleanup",
    benefit: "Less chaos. Fewer dropped balls. A business that doesn't require you to remember everything.",
    details: "We map how work really happens, remove unnecessary steps, and design simple systems that don't rely on constant decision-making."
  },
  {
    title: "Automating the Boring Stuff",
    benefit: "Time back. Fewer errors. Work that happens consistently, without supervision.",
    details: "We automate repetitive admin work so you're not doing the same tasks over and over—or paying someone else to."
  },
  {
    title: "Cash Flow Clarity",
    benefit: "Clear financials. Predictable cash flow. Decisions based on actual numbers, not guesswork.",
    details: "We clean up invoicing, payments, and vendor processes so you actually know what's coming in and going out—without spreadsheets everywhere."
  },
  {
    title: "Using What You Already Pay For",
    benefit: "Value from existing investments. No more half-used tools collecting dust.",
    details: "We help you actually use the tools you already have—without adding more software."
  }
];

const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className, id }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-15%" }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.section>
);

const App: React.FC = () => {
  return (
    <div className="relative w-full bg-[#050505] selection:bg-sky-500/30 selection:text-sky-200 text-neutral-300 font-light">

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center pointer-events-none">
        <h1 className="text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.8em] text-neutral-400 flex items-center gap-4 pointer-events-auto">
          <span className="w-8 h-[1px] bg-neutral-700" />
          Blue Dot Technology
        </h1>
      </nav>

      <SectionReveal id="hero" className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-40">
        <div className="max-w-5xl w-full">
          <motion.span
            className="text-[11px] uppercase tracking-[0.5em] text-sky-500 mb-8 block font-semibold"
          >
            Blue Dot Technology
          </motion.span>
          <h1 className="text-5xl md:text-8xl text-white font-extralight tracking-tight mb-12 leading-[1.1]">
            Make Your Business <br/> <span className="text-neutral-500 font-normal italic">Easier to Run</span>
          </h1>
          <p className="text-2xl md:text-3xl text-neutral-400 font-light leading-relaxed mb-16 max-w-3xl">
            We architect smart systems that replace chaos with clarity, so your business runs smoothly without constant oversight.
          </p>
          <div className="flex flex-wrap gap-8 pt-16 border-t border-neutral-900/50">
            <a href="#contact" className="px-12 py-6 bg-sky-600 hover:bg-sky-500 text-white text-[12px] uppercase tracking-[0.4em] transition-all rounded-sm font-bold shadow-2xl shadow-sky-900/20">
              Get Started
            </a>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-48 bg-neutral-900/10">
        <div className="max-w-5xl w-full">
          <span className="text-[11px] uppercase tracking-[0.5em] text-neutral-600 mb-8 block">The Problem</span>
          <h2 className="text-4xl md:text-6xl text-white font-light tracking-tight mb-20 leading-tight">
            Systems should support <br className="hidden md:block" /> growth, not throttle it.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
            <div className="space-y-10">
              <p className="text-xl text-neutral-400 leading-relaxed">
                Most businesses don't lack talent—they lack design. Work happens differently every time, decisions depend on one person's memory, and friction is accepted as "normal."
              </p>
              <p className="text-xl text-neutral-500">
                When your business relies on individual effort rather than solid systems, you don't own a company—you own a high-stress job.
              </p>
            </div>
            <div className="space-y-8 bg-neutral-900/30 p-12 border border-neutral-800 rounded-sm">
              <p className="text-white font-semibold text-xl mb-4">Sound familiar?</p>
              {[
                "Reactive decision-making as a daily habit",
                "Key processes living only in people's heads",
                "Software tools used at 20% capacity",
                "Operational bottlenecks at the owner level",
                "Growth that feels like 'more work' rather than 'more profit'"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="w-2 h-2 rounded-full bg-sky-700 mt-2.5 group-hover:bg-sky-400 transition-colors" />
                  <span className="text-base text-neutral-300 group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <section className="w-full px-6 py-64">
        <div className="max-w-6xl mx-auto">
          <div className="mb-24">
            <span className="text-[11px] uppercase tracking-[0.5em] text-sky-500 mb-6 block">What We Do</span>
            <h2 className="text-5xl font-light text-white tracking-tight">Our Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-900 border border-neutral-900 overflow-hidden shadow-2xl">
            {SERVICES_CARDS.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="p-12 md:p-20 bg-[#050505] hover:bg-neutral-900/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black text-white select-none pointer-events-none">0{idx+1}</div>
                <h3 className="text-3xl text-white mb-8 group-hover:text-sky-400 transition-colors font-light">{service.title}</h3>
                <p className="text-neutral-400 mb-12 text-lg leading-relaxed">{service.details}</p>
                <div className="pt-10 border-t border-neutral-900">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-sky-600 font-bold mb-4">The Result</p>
                  <p className="text-base text-neutral-200 font-medium leading-relaxed italic">"{service.benefit}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionReveal className="w-full px-6 py-64 bg-neutral-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-white font-light tracking-[0.3em] uppercase mb-24 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-20">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="group border-l border-neutral-800 pl-10 hover:border-sky-500 transition-colors">
                <h4 className="text-neutral-100 mb-6 text-xl font-medium tracking-tight group-hover:text-sky-400 transition-colors leading-snug">{item.q}</h4>
                <p className="text-neutral-500 text-base leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal id="contact" className="w-full px-6 py-80 bg-sky-950/[0.03] border-t border-neutral-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl text-white font-extralight mb-12 tracking-tight leading-tight">Ready to simplify <br/> your business?</h2>
          <p className="text-neutral-400 mb-20 text-xl leading-relaxed">Stop fighting your own systems. Let's build something that works.</p>
          <a href="#contact" className="inline-block px-14 py-7 bg-white text-black text-[12px] uppercase tracking-[0.6em] font-black hover:bg-sky-400 hover:text-white transition-all rounded-sm shadow-2xl">
            Get in Touch
          </a>
        </div>
      </SectionReveal>

      <footer className="w-full px-6 py-20 border-t border-neutral-900 bg-black flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <p className="text-[13px] uppercase tracking-[0.6em] text-white mb-3 font-black">Blue Dot Technology</p>
          <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-600">Smarter systems for growing businesses.</p>
        </div>
        <div className="flex gap-16">
          <span className="text-[11px] uppercase tracking-widest text-neutral-600">&copy; 2025 Blue Dot Technology</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
