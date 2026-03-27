"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { useState } from "react";

interface Props {
  data: Record<string, unknown>;
}

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  status: "excellent" | "good" | "fair" | "needs-work";
}

export default function FinancialHealthScore({ data }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const categories = calculateHealthCategories(data);
  const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
  const maxScore = categories.reduce((sum, c) => sum + c.maxScore, 0);
  const percentScore = Math.round((totalScore / maxScore) * 100);

  const grade =
    percentScore >= 90 ? "A+" :
    percentScore >= 85 ? "A" :
    percentScore >= 80 ? "A-" :
    percentScore >= 75 ? "B+" :
    percentScore >= 70 ? "B" :
    percentScore >= 65 ? "B-" :
    percentScore >= 60 ? "C+" :
    percentScore >= 55 ? "C" :
    percentScore >= 50 ? "C-" :
    percentScore >= 40 ? "D" : "F";

  const gradeColor =
    percentScore >= 80 ? "text-emerald" :
    percentScore >= 60 ? "text-gold" :
    "text-rose";

  const ringColor =
    percentScore >= 80 ? "#10b981" :
    percentScore >= 60 ? "#f59e0b" :
    "#f43f5e";

  // SVG circle parameters
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Activity className="w-5 h-5 text-accent-light" />
        <h3 className="font-semibold text-white">Financial Health Score</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="ml-auto text-slate-500 hover:text-white transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-8">
          {/* Score ring */}
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={strokeWidth}
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${gradeColor}`}>{grade}</span>
              <span className="text-xs text-slate-500">{percentScore}/100</span>
            </div>
          </div>

          {/* Category bars */}
          <div className="flex-1 space-y-3">
            {categories.map((cat) => {
              const pct = Math.round((cat.score / cat.maxScore) * 100);
              const barColor =
                cat.status === "excellent" ? "bg-emerald" :
                cat.status === "good" ? "bg-sky" :
                cat.status === "fair" ? "bg-gold" :
                "bg-rose";

              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">{cat.name}</span>
                    <span className="text-xs font-medium text-white">{cat.score}/{cat.maxScore}</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed breakdown */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 pt-6 border-t border-white/5 space-y-3"
          >
            {categories.map((cat) => {
              const statusConfig = {
                excellent: { color: "text-emerald", icon: <TrendingUp className="w-3.5 h-3.5" />, label: "Excellent" },
                good: { color: "text-sky", icon: <TrendingUp className="w-3.5 h-3.5" />, label: "Good" },
                fair: { color: "text-gold", icon: <Minus className="w-3.5 h-3.5" />, label: "Fair" },
                "needs-work": { color: "text-rose", icon: <TrendingDown className="w-3.5 h-3.5" />, label: "Needs Work" },
              };
              const sc = statusConfig[cat.status];

              return (
                <div key={cat.name} className="flex items-start gap-3 p-3 rounded-lg bg-surface/30">
                  <span className={`${sc.color} mt-0.5`}>{sc.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{cat.name}</span>
                      <span className={`text-xs ${sc.color}`}>{sc.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function calculateHealthCategories(data: Record<string, unknown>): ScoreCategory[] {
  const categories: ScoreCategory[] = [];

  // 1. Emergency Fund (0-15 points)
  const emergencyFund = Number(data["savings.emergencyFund"]) || 0;
  const monthlySpending =
    (Number(data["spending.housing"]) || 0) + (Number(data["spending.transportation"]) || 0) +
    (Number(data["spending.food"]) || 0) + (Number(data["spending.healthcare"]) || 0) +
    (Number(data["spending.entertainment"]) || 0) + (Number(data["spending.subscriptions"]) || 0) +
    (Number(data["spending.giving"]) || 0) + (Number(data["spending.other"]) || 0);
  const monthsCovered = monthlySpending > 0 ? emergencyFund / monthlySpending : 0;
  const efScore = Math.min(15, Math.round(monthsCovered * 2.5));
  categories.push({
    name: "Emergency Fund",
    score: efScore,
    maxScore: 15,
    description: monthsCovered >= 6 ? "Fully funded with 6+ months of expenses" : `${monthsCovered.toFixed(1)} months covered — target 6 months`,
    status: efScore >= 13 ? "excellent" : efScore >= 8 ? "good" : efScore >= 4 ? "fair" : "needs-work",
  });

  // 2. Savings Rate (0-20 points)
  const savingsRate = Number(data["savings.savingsRate"]) || 0;
  const srScore = Math.min(20, Math.round(savingsRate));
  categories.push({
    name: "Savings Rate",
    score: srScore,
    maxScore: 20,
    description: savingsRate >= 20 ? `Excellent ${savingsRate}% rate — well above the 15% target` : `${savingsRate}% — target 15-20% for strong long-term growth`,
    status: srScore >= 18 ? "excellent" : srScore >= 12 ? "good" : srScore >= 8 ? "fair" : "needs-work",
  });

  // 3. Debt Management (0-20 points)
  const creditCards = Number(data["debt.creditCards.balance"]) || 0;
  const totalIncome = (Number(data["income.primarySalary"]) || 0) + (Number(data["income.secondarySalary"]) || 0);
  const totalDebt = (Number(data["debt.mortgage.balance"]) || 0) + (Number(data["debt.studentLoans.balance"]) || 0) +
    (Number(data["debt.autoLoans.balance"]) || 0) + creditCards + (Number(data["debt.otherDebt.balance"]) || 0);
  const dti = totalIncome > 0 ? (totalDebt / totalIncome) : 0;
  let debtScore = 20;
  if (creditCards > 0) debtScore -= 8;
  if (dti > 3) debtScore -= 6;
  else if (dti > 2) debtScore -= 3;
  debtScore = Math.max(0, debtScore);
  categories.push({
    name: "Debt Management",
    score: debtScore,
    maxScore: 20,
    description: creditCards > 0 ? "Credit card debt is significantly impacting your score" : dti > 2 ? "Debt-to-income ratio is elevated" : "Debt is well managed",
    status: debtScore >= 18 ? "excellent" : debtScore >= 12 ? "good" : debtScore >= 8 ? "fair" : "needs-work",
  });

  // 4. Insurance Protection (0-15 points)
  const hasLife = data["insurance.hasLifeInsurance"] === "yes";
  const hasDisability = data["insurance.hasDisabilityInsurance"] === "yes";
  const hasHealth = data["insurance.healthInsuranceType"] !== "none";
  let insScore = 0;
  if (hasHealth) insScore += 5;
  if (hasLife) insScore += 5;
  if (hasDisability) insScore += 5;
  categories.push({
    name: "Insurance Protection",
    score: insScore,
    maxScore: 15,
    description: insScore >= 15 ? "All major insurance categories covered" : `Missing: ${!hasLife ? "life " : ""}${!hasDisability ? "disability " : ""}${!hasHealth ? "health" : ""}`.trim(),
    status: insScore >= 13 ? "excellent" : insScore >= 10 ? "good" : insScore >= 5 ? "fair" : "needs-work",
  });

  // 5. Retirement Readiness (0-15 points)
  const retirementSavings = (Number(data["savings.retirement401k"]) || 0) + (Number(data["savings.retirementIRA"]) || 0) +
    (Number(data["savings.rothBalance"]) || 0) + (Number(data["savings.brokerageBalance"]) || 0);
  const age = Number(data["demographics.age"]) || 35;
  const retirementTarget = totalIncome * (age < 30 ? 1 : age < 40 ? 3 : age < 50 ? 6 : 10);
  const retPct = retirementTarget > 0 ? retirementSavings / retirementTarget : 0;
  const retScore = Math.min(15, Math.round(retPct * 15));
  categories.push({
    name: "Retirement Readiness",
    score: retScore,
    maxScore: 15,
    description: retPct >= 1 ? "On track for your age-based savings target" : `At ${Math.round(retPct * 100)}% of age-appropriate savings target`,
    status: retScore >= 13 ? "excellent" : retScore >= 8 ? "good" : retScore >= 4 ? "fair" : "needs-work",
  });

  // 6. Happiness & Wellbeing (0-15 points)
  const happiness = Number(data["happiness.overallScore"]) || 5;
  const financialPeace = Number(data["happiness.financialPeace"]) || 5;
  const avgHappiness = (happiness + financialPeace) / 2;
  const happyScore = Math.min(15, Math.round(avgHappiness * 1.5));
  categories.push({
    name: "Life Satisfaction",
    score: happyScore,
    maxScore: 15,
    description: avgHappiness >= 8 ? "High satisfaction across happiness dimensions" : `Happiness: ${happiness}/10, Financial peace: ${financialPeace}/10`,
    status: happyScore >= 13 ? "excellent" : happyScore >= 9 ? "good" : happyScore >= 5 ? "fair" : "needs-work",
  });

  return categories;
}
