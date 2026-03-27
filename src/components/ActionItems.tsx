"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Lightbulb,
  CheckCircle,
  Circle,
  ChevronRight,
  Shield,
  TrendingUp,
  CreditCard,
  Heart,
  Clock,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { formatFullCurrency } from "@/lib/calculations";

interface ActionItem {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
  timeframe: string;
}

interface Props {
  data: Record<string, unknown>;
  insuranceGap: {
    lifeInsuranceGap: number;
    disabilityGap: boolean;
    recommendations: string[];
  };
}

export default function ActionItems({ data, insuranceGap }: Props) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const actions: ActionItem[] = generateActions(data, insuranceGap);

  const toggleComplete = (id: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const completedCount = completedItems.size;
  const totalCount = actions.length;

  const priorityColors = {
    critical: { bg: "bg-rose/10", border: "border-rose/20", text: "text-rose", badge: "Critical" },
    high: { bg: "bg-gold/10", border: "border-gold/20", text: "text-gold", badge: "High" },
    medium: { bg: "bg-accent/10", border: "border-accent/20", text: "text-accent-light", badge: "Medium" },
    low: { bg: "bg-emerald/10", border: "border-emerald/20", text: "text-emerald", badge: "Nice to Have" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-white">Personalized Action Plan</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {completedCount}/{totalCount} complete
          </span>
          <div className="w-20 h-1.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {actions.map((action, i) => {
          const isCompleted = completedItems.has(action.id);
          const pc = priorityColors[action.priority];

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`px-6 py-4 flex gap-4 hover:bg-surface-light/20 transition-colors cursor-pointer ${
                isCompleted ? "opacity-60" : ""
              }`}
              onClick={() => toggleComplete(action.id)}
            >
              {/* Checkbox */}
              <button className="shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-emerald" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`${pc.text}`}>{action.icon}</span>
                  <h4 className={`text-sm font-medium ${isCompleted ? "line-through text-slate-500" : "text-white"}`}>
                    {action.title}
                  </h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${pc.bg} ${pc.text}`}>
                    {pc.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1.5">{action.description}</p>
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="text-emerald flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {action.impact}
                  </span>
                  <span className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {action.timeframe}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-700 shrink-0 mt-1" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function generateActions(data: Record<string, unknown>, insuranceGap: Props["insuranceGap"]): ActionItem[] {
  const actions: ActionItem[] = [];

  const emergencyFund = Number(data["savings.emergencyFund"]) || 0;
  const monthlySpending =
    (Number(data["spending.housing"]) || 0) + (Number(data["spending.transportation"]) || 0) +
    (Number(data["spending.food"]) || 0) + (Number(data["spending.healthcare"]) || 0) +
    (Number(data["spending.entertainment"]) || 0) + (Number(data["spending.subscriptions"]) || 0) +
    (Number(data["spending.giving"]) || 0) + (Number(data["spending.other"]) || 0);

  const sixMonthTarget = monthlySpending * 6;
  const creditCardDebt = Number(data["debt.creditCards.balance"]) || 0;
  const savingsRate = Number(data["savings.savingsRate"]) || 0;
  const totalIncome = (Number(data["income.primarySalary"]) || 0) + (Number(data["income.secondarySalary"]) || 0);

  // Critical: Credit card debt
  if (creditCardDebt > 0) {
    actions.push({
      id: "cc-debt",
      priority: "critical",
      category: "Debt",
      icon: <CreditCard className="w-4 h-4" />,
      title: `Pay off ${formatFullCurrency(creditCardDebt)} in credit card debt`,
      description: "Credit card debt at ~22% interest is the biggest drag on your wealth. Prioritize elimination using the avalanche or snowball method.",
      impact: `Save ~${formatFullCurrency(creditCardDebt * 0.22)}/yr in interest`,
      timeframe: "Next 6-12 months",
    });
  }

  // Critical: No emergency fund
  if (emergencyFund < monthlySpending * 3) {
    actions.push({
      id: "emergency-fund",
      priority: "critical",
      category: "Safety Net",
      icon: <ShieldCheck className="w-4 h-4" />,
      title: `Build emergency fund to ${formatFullCurrency(sixMonthTarget)}`,
      description: `You have ${formatFullCurrency(emergencyFund)} saved. Target 6 months of expenses for true financial peace.`,
      impact: "+2 points on financial peace score",
      timeframe: "Next 12-18 months",
    });
  }

  // High: Insurance gaps
  if (insuranceGap.lifeInsuranceGap > 0) {
    actions.push({
      id: "life-insurance",
      priority: "high",
      category: "Protection",
      icon: <Shield className="w-4 h-4" />,
      title: `Get ${formatFullCurrency(insuranceGap.lifeInsuranceGap)} more life insurance`,
      description: "Your current coverage doesn't fully protect your family's future income needs. Get quotes through Backn9ne.",
      impact: "Protect your family's financial future",
      timeframe: "This month",
    });
  }

  if (insuranceGap.disabilityGap) {
    actions.push({
      id: "disability-insurance",
      priority: "high",
      category: "Protection",
      icon: <Shield className="w-4 h-4" />,
      title: "Get disability insurance",
      description: "Your ability to earn is your most valuable asset. A disability could devastate your financial plan without coverage.",
      impact: "Protect your human capital",
      timeframe: "This month",
    });
  }

  // High: Low savings rate
  if (savingsRate < 15) {
    actions.push({
      id: "increase-savings",
      priority: "high",
      category: "Savings",
      icon: <Wallet className="w-4 h-4" />,
      title: `Increase savings rate from ${savingsRate}% to 15%+`,
      description: "The difference between saving 10% and 20% over 30 years can be over $1M. Automate increases by 1% every quarter.",
      impact: `+${formatFullCurrency((totalIncome * 0.05))} more saved per year`,
      timeframe: "Next 12 months",
    });
  }

  // Medium: Diversify income
  if (!data["income.passiveIncome"] || Number(data["income.passiveIncome"]) < 1000) {
    actions.push({
      id: "passive-income",
      priority: "medium",
      category: "Income",
      icon: <TrendingUp className="w-4 h-4" />,
      title: "Build passive income streams",
      description: "Dividend investing, rental income, or digital products can create income that grows without trading your time.",
      impact: "Increase financial independence",
      timeframe: "Next 1-3 years",
    });
  }

  // Medium: Happiness improvement
  const financialPeace = Number(data["happiness.financialPeace"]) || 5;
  if (financialPeace <= 5) {
    actions.push({
      id: "financial-peace",
      priority: "medium",
      category: "Happiness",
      icon: <Heart className="w-4 h-4" />,
      title: "Boost your financial peace score",
      description: `Your financial peace is ${financialPeace}/10. Automating savings, eliminating debt, and having a clear plan can dramatically improve this.`,
      impact: "Higher overall life satisfaction",
      timeframe: "Ongoing",
    });
  }

  // Low: Optimize investments
  const freedomScore = Number(data["happiness.freedomAutonomy"]) || 5;
  if (freedomScore <= 5) {
    actions.push({
      id: "increase-freedom",
      priority: "low",
      category: "Lifestyle",
      icon: <Heart className="w-4 h-4" />,
      title: "Increase your freedom and autonomy",
      description: "Your freedom score is low. Consider negotiating flexible work, reducing obligations, or building toward partial financial independence.",
      impact: "Better work-life balance",
      timeframe: "Next 6-12 months",
    });
  }

  return actions;
}
