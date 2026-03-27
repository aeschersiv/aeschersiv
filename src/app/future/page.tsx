"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import WealthChart from "@/components/WealthChart";
import {
  calculateFutureTimeline,
  calculateInsuranceGap,
  formatCurrency,
  formatFullCurrency,
} from "@/lib/calculations";
import { FutureTimeline, Milestone, Scenario } from "@/types";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Heart,
  Briefcase,
  Shield,
  Award,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";

// Re-use the same demo data
const DEMO_DATA: Record<string, unknown> = {
  firstName: "Alex",
  "demographics.age": 35,
  "demographics.retirementAge": 62,
  "demographics.filingStatus": "married-joint",
  "demographics.dependents": 2,
  "demographics.state": "Colorado",
  "happiness.overallScore": 6,
  "happiness.financialPeace": 4,
  "happiness.relationshipQuality": 8,
  "happiness.careerFulfillment": 7,
  "happiness.healthWellbeing": 6,
  "happiness.purposeMeaning": 7,
  "happiness.freedomAutonomy": 5,
  "happiness.communityBelonging": 6,
  "happiness.topValues": ["family", "freedom", "health", "growth", "legacy"],
  "happiness.biggestFinancialStress": "retirement",
  "happiness.dreamLifeDescription": "Waking up in the mountains, spending mornings on creative work, afternoons coaching youth sports, evenings with family.",
  "income.primarySalary": 125000,
  "income.secondarySalary": 85000,
  "income.sideIncome": 15000,
  "income.passiveIncome": 3000,
  "income.expectedGrowthRate": 4,
  "spending.housing": 2800,
  "spending.transportation": 650,
  "spending.food": 1200,
  "spending.healthcare": 450,
  "spending.entertainment": 400,
  "spending.subscriptions": 200,
  "spending.giving": 500,
  "spending.other": 300,
  "savings.emergencyFund": 25000,
  "savings.savingsRate": 18,
  "savings.retirement401k": 180000,
  "savings.retirementIRA": 45000,
  "savings.rothBalance": 62000,
  "savings.brokerageBalance": 35000,
  "debt.mortgage.balance": 380000,
  "debt.mortgage.interestRate": 6.5,
  "debt.studentLoans.balance": 22000,
  "debt.autoLoans.balance": 18000,
  "debt.creditCards.balance": 4500,
  "debt.otherDebt.balance": 0,
  "insurance.hasLifeInsurance": "yes",
  "insurance.lifeCoverage": 500000,
  "insurance.hasDisabilityInsurance": "no",
  "insurance.healthInsuranceType": "employer",
  "investments.riskTolerance": 4,
  "investments.investmentStyle": "passive",
  "humanCapital.educationLevel": "bachelors",
  "humanCapital.careerTrajectory": "ascending",
  "humanCapital.skillsInventory": ["leadership", "technical", "analytical", "communication"],
  "humanCapital.riskOfDisplacement": "low",
  "goals.primary.category": "freedom",
  "goals.primary.targetAmount": 2500000,
  "goals.primary.yearsToGoal": 15,
  "goals.primary.happinessImpact": 9,
  "goals.secondary.category": "education",
  "goals.secondary.targetAmount": 200000,
};

const milestoneIcons: Record<string, React.ReactNode> = {
  financial: <TrendingUp className="w-4 h-4" />,
  personal: <Heart className="w-4 h-4" />,
  career: <Briefcase className="w-4 h-4" />,
  health: <Shield className="w-4 h-4" />,
  legacy: <Award className="w-4 h-4" />,
};

export default function FuturePage() {
  const [data, setData] = useState<Record<string, unknown>>(DEMO_DATA);
  const [timeline, setTimeline] = useState<FutureTimeline | null>(null);
  const [insuranceGap, setInsuranceGap] = useState<ReturnType<typeof calculateInsuranceGap> | null>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("futurewealth_assessment") : null;
    const assessmentData = saved ? JSON.parse(saved) : DEMO_DATA;
    setData(assessmentData);
    setTimeline(calculateFutureTimeline(assessmentData));
    setInsuranceGap(calculateInsuranceGap(assessmentData));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [timeline]);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  if (!timeline || !insuranceGap) {
    return (
      <>
        <Navigation />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Generating your future...</div>
        </div>
      </>
    );
  }

  const firstName = String(data.firstName || "Friend");
  const age = Number(data["demographics.age"]) || 35;
  const retirementAge = Number(data["demographics.retirementAge"]) || 65;
  const currentYear = new Date().getFullYear();
  const retirementYear = timeline.years.find((y) => y.age === retirementAge);
  const yearTen = timeline.years.find((y) => y.age === age + 10);
  const yearTwenty = timeline.years.find((y) => y.age === age + 20);
  const finalYear = timeline.years[timeline.years.length - 1];

  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold/6 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-sm text-gold font-medium">Your Personalized Future</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              The story of <span className="gradient-text">{firstName}&apos;s</span> financial future
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From age {age} to {finalYear?.age || age + 40} — every milestone, every decision, every moment of growth
              that leads to the life you described.
            </p>
          </div>
        </section>

        {/* Narrative Timeline */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          {/* Wealth chart at the top */}
          <div ref={addRef} className="narrative-section mb-16">
            <WealthChart timeline={timeline} />
          </div>

          {/* Opening narrative */}
          <div ref={addRef} className="narrative-section mb-20">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-accent-light" />
                <span className="text-sm font-medium text-accent-light">Today — Age {age}</span>
              </div>
              <p className="text-lg text-slate-300 leading-relaxed mb-4">
                Right now, {firstName}, your household earns{" "}
                <strong className="text-white">{formatFullCurrency(
                  (Number(data["income.primarySalary"]) || 0) + (Number(data["income.secondarySalary"]) || 0) +
                  (Number(data["income.sideIncome"]) || 0) + (Number(data["income.passiveIncome"]) || 0)
                )}</strong> per year.
                Your traditional net worth is{" "}
                <strong className="text-white">{formatCurrency(timeline.years[0]?.projectedNetWorth || 0)}</strong>,
                but when we include your human capital — the present value of everything you&apos;ll earn over your career —
                your total wealth picture is dramatically larger.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed mb-4">
                Your happiness score is{" "}
                <strong className="text-white">{String(data["happiness.overallScore"] || 5)}/10</strong>.
                Your biggest financial stress is{" "}
                <strong className="text-white">{String(data["happiness.biggestFinancialStress"] || "financial security").replace("-", " ")}</strong>.
                That&apos;s about to change.
              </p>
              {insuranceGap.recommendations.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-gold/5 border border-gold/10">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Immediate Priority</span>
                  </div>
                  <p className="text-sm text-slate-400">{insuranceGap.recommendations[0]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Milestone Timeline */}
          <div ref={addRef} className="narrative-section mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Target className="w-6 h-6 text-accent-light" />
              Key Milestones
            </h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-gold to-emerald" />

              <div className="space-y-8">
                {timeline.milestones.map((milestone, i) => (
                  <motion.div
                    key={`${milestone.year}-${milestone.title}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative flex gap-6 pl-2"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      milestone.impact === "positive" ? "bg-emerald/20 text-emerald" :
                      milestone.impact === "negative" ? "bg-rose/20 text-rose" :
                      "bg-surface-light text-slate-400"
                    }`}>
                      {milestoneIcons[milestone.type] || <Star className="w-4 h-4" />}
                    </div>
                    <div className="glass rounded-xl p-5 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{milestone.title}</h3>
                        <span className="text-xs text-slate-500">
                          {milestone.year} · Age {milestone.year - currentYear + age}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Decade snapshots */}
          {yearTen && (
            <div ref={addRef} className="narrative-section mb-16">
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gold">10 Years from Now</span>
                    <span className="text-xs text-slate-500 ml-2">Age {yearTen.age} · {yearTen.year}</span>
                  </div>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  At age {yearTen.age}, your projected net worth reaches{" "}
                  <strong className="text-white">{formatCurrency(yearTen.projectedNetWorth)}</strong>.
                  Your income has grown to{" "}
                  <strong className="text-white">{formatCurrency(yearTen.projectedIncome)}/year</strong>,
                  and your happiness score has climbed to{" "}
                  <strong className="text-gold">{yearTen.projectedHappiness}/10</strong>.
                </p>
                {yearTen.events.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {yearTen.events.map((event) => (
                      <span key={event} className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold-light">
                        {event}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {yearTwenty && (
            <div ref={addRef} className="narrative-section mb-16">
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-emerald" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-light">20 Years from Now</span>
                    <span className="text-xs text-slate-500 ml-2">Age {yearTwenty.age} · {yearTwenty.year}</span>
                  </div>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed">
                  By {yearTwenty.year}, your wealth has compounded significantly to{" "}
                  <strong className="text-white">{formatCurrency(yearTwenty.projectedNetWorth)}</strong>.
                  {yearTwenty.age >= retirementAge
                    ? " You've already achieved financial independence. Work is now optional — every day is a choice."
                    : ` You're ${retirementAge - yearTwenty.age} years from your financial independence target. The compounding is accelerating.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Scenarios */}
          <div ref={addRef} className="narrative-section mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-lavender" />
              Scenario Planning
            </h2>
            <p className="text-slate-400 mb-6">
              The future isn&apos;t certain. Here&apos;s how your plan holds up under different conditions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {timeline.scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  isActive={activeScenario === scenario.id}
                  onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
                  age={age}
                />
              ))}
            </div>

            {activeScenario && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 glass rounded-2xl p-6"
              >
                {(() => {
                  const scenario = timeline.scenarios.find((s) => s.id === activeScenario);
                  if (!scenario) return null;
                  return (
                    <>
                      <h3 className="font-semibold text-white mb-3">Required Actions: {scenario.name}</h3>
                      <div className="space-y-2">
                        {scenario.requiredActions.map((action, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="w-4 h-4 text-accent-light shrink-0" />
                            <span className="text-slate-300">{action}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </div>

          {/* Closing narrative */}
          <div ref={addRef} className="narrative-section mb-16">
            <div className="glass rounded-2xl p-8 bg-gradient-to-br from-accent/5 to-gold/5 border border-accent/10">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-gold" />
                <span className="text-gold font-medium">Your Positive Future</span>
              </div>
              <p className="text-xl text-white leading-relaxed mb-6 font-medium">
                By age {finalYear?.age || retirementAge}, with consistent effort and smart decisions,
                you&apos;re projected to have a net worth of{" "}
                <span className="gradient-text font-bold">{formatCurrency(finalYear?.projectedNetWorth || 0)}</span>{" "}
                and a happiness score of{" "}
                <span className="text-gold font-bold">{finalYear?.projectedHappiness || 8}/10</span>.
              </p>
              <blockquote className="text-lg text-slate-300 italic border-l-2 border-gold/50 pl-6 mb-6">
                &ldquo;{String(data["happiness.dreamLifeDescription"] || "A life of freedom and purpose.")}&rdquo;
              </blockquote>
              <p className="text-slate-400">
                This isn&apos;t just a projection — it&apos;s a plan. Every insurance policy protects your human capital.
                Every investment grows your traditional wealth. Every relationship deepens your social capital.
                And every decision is weighted by what actually makes you happy.
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div ref={addRef} className="narrative-section text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to make this real?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Connect with Backn9ne for insurance protection and Altruist for portfolio management
              to put your plan into action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/assess"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-semibold hover:shadow-xl hover:shadow-accent/25 transition-all"
              >
                Retake Assessment
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-slate-300 hover:bg-surface hover:text-white transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function ScenarioCard({
  scenario,
  isActive,
  onClick,
  age,
}: {
  scenario: Scenario;
  isActive: boolean;
  onClick: () => void;
  age: number;
}) {
  const tenYearValue = scenario.timeline.find((y) => y.age === age + 10)?.projectedNetWorth || 0;
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    optimistic: { bg: "bg-emerald/5", border: "border-emerald/20", text: "text-emerald" },
    conservative: { bg: "bg-gold/5", border: "border-gold/20", text: "text-gold" },
    disruption: { bg: "bg-rose/5", border: "border-rose/20", text: "text-rose" },
  };
  const c = colors[scenario.id] || colors.conservative;

  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl p-5 transition-all ${c.bg} border ${
        isActive ? c.border : "border-transparent"
      } hover:${c.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${c.text}`}>{scenario.name}</span>
        <span className="text-xs text-slate-500">{Math.round(scenario.probability * 100)}% prob</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">{scenario.description}</p>
      <div>
        <p className="text-xs text-slate-500">10-Year Net Worth</p>
        <p className="text-lg font-bold text-white">{formatCurrency(tenYearValue)}</p>
      </div>
    </button>
  );
}
