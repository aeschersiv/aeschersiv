"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import {
  TrendingUp,
  Heart,
  Shield,
  Brain,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Clock,
  Target,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <>
      <Navigation />
      <main>
        {/* === HERO === */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Ambient background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/8 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-sm mb-8 animate-fade-up">
              <Sparkles className="w-4 h-4" />
              Financial Planning Reimagined
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Your wealth is more than
              <br />
              <span className="gradient-text">a number.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              FutureWealth measures what traditional planning misses — your human capital,
              your happiness, your relationships — and writes a financial future built
              around the life you actually want.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/assess"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-semibold text-lg hover:shadow-xl hover:shadow-accent/25 transition-all duration-300 animate-pulse-glow"
              >
                Begin Your Assessment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-slate-300 hover:bg-surface hover:text-white transition-all duration-300"
              >
                See How It Works
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <Stat value="$2.4M" label="Avg. Human Capital" />
              <Stat value="7.8" label="Avg. Happiness Gain" />
              <Stat value="12 min" label="Full Assessment" />
            </div>
          </div>

          <Link href="#narrative" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-slate-500" />
          </Link>
        </section>

        {/* === NARRATIVE SCROLL — AI-2027 STYLE === */}
        <section id="narrative" className="py-32 relative">
          <div className="max-w-3xl mx-auto px-4 space-y-32">
            <div ref={addRef} className="narrative-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-accent-light" />
                </div>
                <span className="text-accent-light font-medium">The Problem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Traditional financial planning is <span className="text-rose">broken.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Most financial plans treat you like a spreadsheet. They obsess over rates of return
                and withdrawal strategies while ignoring the single most valuable asset you own:
                <strong className="text-white"> your ability to earn, grow, and adapt.</strong> They
                never ask whether the plan leads to a life you actually want to live.
              </p>
            </div>

            <div ref={addRef} className="narrative-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-gold-light" />
                </div>
                <span className="text-gold-light font-medium">The Insight</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Happiness is the <span className="gradient-text">real return.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                Research shows that above a certain income threshold, more money doesn&apos;t mean
                more happiness. What matters is <em>how</em> you use money: to buy time, deepen
                relationships, pursue meaning, and protect against catastrophe.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                FutureWealth builds your plan around these pillars. We measure your happiness
                across eight dimensions and weight every financial decision against what will
                actually move the needle on your wellbeing.
              </p>
            </div>

            <div ref={addRef} className="narrative-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-light" />
                </div>
                <span className="text-emerald-light font-medium">The Living Balance Sheet</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Your <span className="text-emerald-light">total</span> wealth picture.
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                Inspired by the Living Balance Sheet concept, we go further. Your balance sheet
                includes three layers of wealth:
              </p>
              <div className="space-y-4">
                <WealthLayer
                  color="accent"
                  title="Traditional Assets"
                  description="Savings, investments, retirement accounts, property — the numbers on your statements."
                />
                <WealthLayer
                  color="gold"
                  title="Human Capital"
                  description="The present value of your future earnings. For most people under 50, this is their largest asset — often worth millions."
                />
                <WealthLayer
                  color="emerald"
                  title="Social & Relationship Capital"
                  description="Your network, community, relationships, and sense of purpose. The wealth that money can't buy but that makes everything else worthwhile."
                />
              </div>
            </div>

            <div ref={addRef} className="narrative-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-sky" />
                </div>
                <span className="text-sky font-medium">The Intertemporal View</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Your future self is <span className="text-sky">counting on you.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                Every dollar you spend today has an opportunity cost measured in future freedom.
                Every dollar you save is a gift to your future self. We model this tension
                explicitly — showing you the <strong className="text-white">intertemporal tradeoffs</strong> of
                every major financial decision.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                Should you pay off debt or invest? Take the vacation or boost your emergency fund?
                We don&apos;t just calculate — we show you how each choice ripples across
                your timeline and impacts your happiness trajectory.
              </p>
            </div>

            <div ref={addRef} className="narrative-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-rose" />
                </div>
                <span className="text-rose font-medium">Protection & Integration</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Powered by <span className="text-white">Backn9ne</span> &{" "}
                <span className="text-white">Altruist.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                Your plan connects to real products and real portfolios. Backn9ne Insurance
                provides instant quotes to protect your human capital — life, disability, and
                beyond. Altruist powers your investment management with institutional-quality
                portfolios at a fraction of the cost.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IntegrationCard
                  name="Backn9ne Insurance"
                  features={["Instant life insurance quotes", "Disability coverage analysis", "Gap identification", "Application tracking"]}
                />
                <IntegrationCard
                  name="Altruist"
                  features={["Model portfolio management", "Tax-loss harvesting", "Performance tracking", "Automated rebalancing"]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* === HOW IT WORKS === */}
        <section id="how-it-works" className="py-32 bg-deep/50">
          <div className="max-w-6xl mx-auto px-4">
            <div ref={addRef} className="narrative-section text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">How it works</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                A conversational assessment that goes deep — then builds your complete financial life plan.
              </p>
            </div>

            <div ref={addRef} className="narrative-section grid grid-cols-1 md:grid-cols-4 gap-6">
              <Step
                number={1}
                icon={<MessageCircle />}
                title="Chat"
                description="A guided conversation about your money, your life, and what makes you happy."
              />
              <Step
                number={2}
                icon={<BarChart3 />}
                title="Analyze"
                description="We build your Living Balance Sheet — traditional assets, human capital, and social wealth."
              />
              <Step
                number={3}
                icon={<Target />}
                title="Project"
                description="See your financial future across multiple scenarios with happiness-weighted projections."
              />
              <Step
                number={4}
                icon={<Sparkles />}
                title="Act"
                description="Get personalized recommendations connected to real products via Backn9ne and Altruist."
              />
            </div>
          </div>
        </section>

        {/* === CTA === */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-gold/8 rounded-full blur-3xl" />
          </div>
          <div ref={addRef} className="narrative-section relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to write your <span className="gradient-text">positive future?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              It takes about 12 minutes. You&apos;ll walk away with a complete financial life plan
              that&apos;s built around what truly matters to you.
            </p>
            <Link
              href="/assess"
              className="group inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-semibold text-xl hover:shadow-xl hover:shadow-accent/25 transition-all duration-300"
            >
              Start My Assessment
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="border-t border-white/5 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-accent to-gold flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">FutureWealth</span>
              </div>
              <p className="text-sm text-slate-500">
                Powered by Backn9ne Insurance & Altruist. Not financial advice. For educational and planning purposes.
              </p>
              <div className="flex gap-6 text-sm text-slate-500">
                <Link href="/assess" className="hover:text-white transition-colors">Assessment</Link>
                <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                <Link href="/future" className="hover:text-white transition-colors">My Future</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

// --- Sub-components ---

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function WealthLayer({ color, title, description }: { color: string; title: string; description: string }) {
  return (
    <div className={`flex gap-4 p-4 rounded-xl bg-${color}/5 border border-${color}/10`}>
      <div className={`w-1.5 rounded-full bg-${color} shrink-0`} />
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function IntegrationCard({ name, features }: { name: string; features: string[] }) {
  return (
    <div className="glass rounded-xl p-6">
      <h4 className="font-semibold text-white mb-3">{name}</h4>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessageCircle() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  );
}

function Step({ number, icon, title, description }: { number: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="text-6xl font-black text-white/5 absolute -top-4 -left-2">{number}</div>
      <div className="relative glass rounded-xl p-6 h-full">
        <div className="w-10 h-10 rounded-lg bg-accent/20 text-accent-light flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}
