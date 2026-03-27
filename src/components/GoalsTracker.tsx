"use client";

import { motion } from "framer-motion";
import { Target, Star, Heart } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";

interface Props {
  data: Record<string, unknown>;
}

const goalIcons: Record<string, string> = {
  retirement: "clock",
  home: "home",
  freedom: "sparkles",
  education: "book",
  business: "briefcase",
  travel: "plane",
  giving: "heart",
  legacy: "award",
};

const goalColors: Record<string, string> = {
  retirement: "#6366f1",
  home: "#0ea5e9",
  freedom: "#10b981",
  education: "#f59e0b",
  business: "#a78bfa",
  travel: "#f43f5e",
  giving: "#34d399",
  legacy: "#fbbf24",
};

export default function GoalsTracker({ data }: Props) {
  const goals = [];

  const primaryCategory = String(data["goals.primary.category"] || "");
  if (primaryCategory) {
    goals.push({
      category: primaryCategory,
      targetAmount: Number(data["goals.primary.targetAmount"]) || 0,
      yearsToGoal: Number(data["goals.primary.yearsToGoal"]) || 10,
      happinessImpact: Number(data["goals.primary.happinessImpact"]) || 5,
      priority: 1,
    });
  }

  const secondaryCategory = String(data["goals.secondary.category"] || "");
  if (secondaryCategory && secondaryCategory !== "none") {
    goals.push({
      category: secondaryCategory,
      targetAmount: Number(data["goals.secondary.targetAmount"]) || 0,
      yearsToGoal: Number(data["goals.primary.yearsToGoal"]) || 15,
      happinessImpact: 7,
      priority: 2,
    });
  }

  if (goals.length === 0) return null;

  // Estimate monthly savings needed
  const totalIncome =
    (Number(data["income.primarySalary"]) || 0) +
    (Number(data["income.secondarySalary"]) || 0) +
    (Number(data["income.sideIncome"]) || 0) +
    (Number(data["income.passiveIncome"]) || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Target className="w-5 h-5 text-gold" />
        <h3 className="font-semibold text-white">Financial Goals</h3>
      </div>

      <div className="p-6 space-y-4">
        {goals.map((goal, i) => {
          const color = goalColors[goal.category] || "#6366f1";
          const monthlySavingsNeeded = goal.targetAmount / (goal.yearsToGoal * 12);
          const currentYear = new Date().getFullYear();
          const targetYear = currentYear + goal.yearsToGoal;

          // Rough estimate of current progress based on savings
          const currentSavings =
            (Number(data["savings.retirement401k"]) || 0) +
            (Number(data["savings.retirementIRA"]) || 0) +
            (Number(data["savings.rothBalance"]) || 0) +
            (Number(data["savings.brokerageBalance"]) || 0);

          const progressPercent = Math.min(100, Math.round((currentSavings / goal.targetAmount) * 100 * (i === 0 ? 1 : 0.3)));

          return (
            <motion.div
              key={goal.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="rounded-xl p-4 bg-surface/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Star className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white capitalize">{goal.category}</h4>
                    <p className="text-xs text-slate-500">
                      Priority #{goal.priority} · Target: {targetYear}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(goal.targetAmount)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Heart className="w-3 h-3 text-rose" />
                    <span className="text-[10px] text-slate-500">{goal.happinessImpact}/10 impact</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-slate-500">{progressPercent}% progress</span>
                  <span className="text-[10px] text-slate-500">
                    {formatCurrency(monthlySavingsNeeded)}/mo needed
                  </span>
                </div>
              </div>

              {/* Feasibility check */}
              {monthlySavingsNeeded > totalIncome / 12 * 0.3 && (
                <p className="text-[10px] text-gold mt-1">
                  This requires &gt;30% of monthly income. Consider extending the timeline or adjusting the target.
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
