"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import MetricCard from "@/components/MetricCard";
import BalanceSheetCard from "@/components/BalanceSheetCard";
import HappinessRadar from "@/components/HappinessRadar";
import WealthChart from "@/components/WealthChart";
import SpendingBreakdown from "@/components/SpendingBreakdown";
import InsurancePanel from "@/components/InsurancePanel";
import InvestmentPanel from "@/components/InvestmentPanel";
import DebtPayoffStrategy from "@/components/DebtPayoffStrategy";
import RetirementReadiness from "@/components/RetirementReadiness";
import EmergencyFundTracker from "@/components/EmergencyFundTracker";
import IncomeBreakdown from "@/components/IncomeBreakdown";
import GoalsTracker from "@/components/GoalsTracker";
import ActionItems from "@/components/ActionItems";
import FinancialHealthScore from "@/components/FinancialHealthScore";
import NetWorthWaterfall from "@/components/NetWorthWaterfall";
import {
  calculateLivingBalanceSheet,
  calculateFutureTimeline,
  calculateInsuranceGap,
  formatCurrency,
} from "@/lib/calculations";
import { LivingBalanceSheet, FutureTimeline } from "@/types";
import {
  TrendingUp,
  Brain,
  Heart,
  Shield,
  DollarSign,
  Compass,
  Users,
  ArrowRight,
  Download,
} from "lucide-react";

// Demo data for when no assessment has been completed
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
  "happiness.dreamLifeDescription": "Waking up in the mountains with my family, spending the morning on creative work, afternoons coaching youth sports, evenings around the dinner table. Complete freedom over my time.",
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

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown>>(DEMO_DATA);
  const [balanceSheet, setBalanceSheet] = useState<LivingBalanceSheet | null>(null);
  const [timeline, setTimeline] = useState<FutureTimeline | null>(null);
  const [insuranceGap, setInsuranceGap] = useState<ReturnType<typeof calculateInsuranceGap> | null>(null);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    // Check for saved assessment data
    const saved = typeof window !== "undefined" ? localStorage.getItem("futurewealth_assessment") : null;
    const assessmentData = saved ? JSON.parse(saved) : DEMO_DATA;
    setIsDemo(!saved);
    setData(assessmentData);

    // Calculate everything
    setBalanceSheet(calculateLivingBalanceSheet(assessmentData));
    setTimeline(calculateFutureTimeline(assessmentData));
    setInsuranceGap(calculateInsuranceGap(assessmentData));
  }, []);

  if (!balanceSheet || !timeline || !insuranceGap) {
    return (
      <>
        <Navigation />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Loading your financial future...</div>
        </div>
      </>
    );
  }

  const firstName = String(data.firstName || "there");
  const age = Number(data["demographics.age"]) || 35;
  const totalIncome = (Number(data["income.primarySalary"]) || 0) +
    (Number(data["income.secondarySalary"]) || 0) +
    (Number(data["income.sideIncome"]) || 0) +
    (Number(data["income.passiveIncome"]) || 0);

  const happinessData = {
    overallScore: Number(data["happiness.overallScore"]) || 5,
    financialPeace: Number(data["happiness.financialPeace"]) || 5,
    relationshipQuality: Number(data["happiness.relationshipQuality"]) || 5,
    careerFulfillment: Number(data["happiness.careerFulfillment"]) || 5,
    healthWellbeing: Number(data["happiness.healthWellbeing"]) || 5,
    purposeMeaning: Number(data["happiness.purposeMeaning"]) || 5,
    freedomAutonomy: Number(data["happiness.freedomAutonomy"]) || 5,
  };

  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Demo banner */}
          {isDemo && (
            <div className="mb-6 p-4 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-between">
              <p className="text-sm text-gold-light">
                Viewing demo data. Complete your assessment to see your personalized plan.
              </p>
              <Link
                href="/assess"
                className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-light transition-colors"
              >
                Start Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="gradient-text">{firstName}</span>
            </h1>
            <p className="text-slate-400">
              Your Living Balance Sheet and financial life overview — updated with the latest data.
            </p>
          </div>

          {/* Top-level metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <MetricCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Net Worth"
              value={formatCurrency(balanceSheet.netTraditionalWealth)}
              subtitle="Traditional"
              color="accent"
              delay={0}
            />
            <MetricCard
              icon={<Brain className="w-4 h-4" />}
              label="Human Capital"
              value={formatCurrency(balanceSheet.humanCapitalAssets.total)}
              subtitle="Future earnings PV"
              color="gold"
              delay={0.05}
            />
            <MetricCard
              icon={<Users className="w-4 h-4" />}
              label="Social Capital"
              value={formatCurrency(balanceSheet.socialCapitalAssets.total)}
              subtitle="Relationships & purpose"
              color="emerald"
              delay={0.1}
            />
            <MetricCard
              icon={<DollarSign className="w-4 h-4" />}
              label="Total Income"
              value={formatCurrency(totalIncome)}
              subtitle="Annual household"
              color="sky"
              delay={0.15}
            />
            <MetricCard
              icon={<Heart className="w-4 h-4" />}
              label="Happiness"
              value={`${happinessData.overallScore}/10`}
              subtitle="Overall score"
              color="rose"
              delay={0.2}
            />
            <MetricCard
              icon={<Shield className="w-4 h-4" />}
              label="Total Wealth"
              value={formatCurrency(balanceSheet.netTotalWealth)}
              subtitle="Happiness-adjusted"
              color="lavender"
              delay={0.25}
            />
          </div>

          {/* Financial Health Score + Wealth Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <FinancialHealthScore data={data} />
            </div>
            <div className="lg:col-span-2">
              <WealthChart timeline={timeline} />
            </div>
          </div>

          {/* Net Worth Waterfall + Happiness */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <NetWorthWaterfall data={data} />
            <HappinessRadar data={happinessData} />
          </div>

          {/* Living Balance Sheet */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-accent to-emerald" />
              Living Balance Sheet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BalanceSheetCard section={balanceSheet.traditionalAssets} color="accent" delay={0} />
              <BalanceSheetCard section={balanceSheet.humanCapitalAssets} color="gold" delay={0.1} />
              <BalanceSheetCard section={balanceSheet.socialCapitalAssets} color="emerald" delay={0.2} />
              <BalanceSheetCard section={balanceSheet.liabilities} color="rose" delay={0.3} />
            </div>

            {/* Net wealth summary */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard
                label="Net Traditional Wealth"
                value={formatCurrency(balanceSheet.netTraditionalWealth)}
                positive={balanceSheet.netTraditionalWealth >= 0}
              />
              <SummaryCard
                label="Net Total Wealth"
                value={formatCurrency(balanceSheet.netTotalWealth)}
                positive={balanceSheet.netTotalWealth >= 0}
                highlight
              />
              <SummaryCard
                label="Happiness-Adjusted Wealth"
                value={formatCurrency(balanceSheet.happinessAdjustedWealth)}
                positive={balanceSheet.happinessAdjustedWealth >= 0}
                subtitle={`${happinessData.overallScore}/10 happiness multiplier`}
              />
            </div>
          </div>

          {/* Income, Emergency Fund, Goals */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald to-sky" />
              Cash Flow & Goals
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <IncomeBreakdown data={data} />
              </div>
              <div className="space-y-6">
                <EmergencyFundTracker data={data} />
                <GoalsTracker data={data} />
              </div>
            </div>
          </div>

          {/* Spending, Insurance, Investments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SpendingBreakdown data={data} />
            <InsurancePanel gap={insuranceGap} data={data} />
          </div>

          {/* Debt + Retirement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DebtPayoffStrategy data={data} />
            <RetirementReadiness data={data} />
          </div>

          <div className="mb-8">
            <InvestmentPanel
              riskTolerance={Number(data["investments.riskTolerance"]) || 3}
              investmentStyle={String(data["investments.investmentStyle"] || "passive")}
              totalPortfolio={
                (Number(data["savings.retirement401k"]) || 0) +
                (Number(data["savings.retirementIRA"]) || 0) +
                (Number(data["savings.rothBalance"]) || 0) +
                (Number(data["savings.brokerageBalance"]) || 0)
              }
            />
          </div>

          {/* Action Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-gold to-rose" />
              Your Action Plan
            </h2>
            <ActionItems data={data} insuranceGap={insuranceGap} />
          </div>

          {/* Dream life section */}
          <div className="mb-8 glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Compass className="w-6 h-6 text-gold" />
              <h2 className="text-xl font-bold text-white">Your Dream Life</h2>
            </div>
            <blockquote className="text-lg text-slate-300 italic leading-relaxed border-l-2 border-gold/50 pl-6">
              &ldquo;{String(data["happiness.dreamLifeDescription"] || "Complete your assessment to paint your dream life.")}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href="/future"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-medium hover:shadow-lg hover:shadow-accent/20 transition-all"
              >
                Explore Your Future Timeline
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-surface hover:text-white transition-all">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function SummaryCard({
  label,
  value,
  positive,
  highlight,
  subtitle,
}: {
  label: string;
  value: string;
  positive: boolean;
  highlight?: boolean;
  subtitle?: string;
}) {
  return (
    <div className={`rounded-xl p-5 ${highlight ? "bg-gradient-to-br from-accent/10 to-emerald/10 border border-accent/20" : "glass"}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${positive ? "text-emerald" : "text-rose"}`}>{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
