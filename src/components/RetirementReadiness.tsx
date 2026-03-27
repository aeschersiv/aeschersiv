"use client";

import { motion } from "framer-motion";
import { Clock, Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { formatCurrency, formatFullCurrency } from "@/lib/calculations";

interface Props {
  data: Record<string, unknown>;
}

export default function RetirementReadiness({ data }: Props) {
  const age = Number(data["demographics.age"]) || 35;
  const retirementAge = Number(data["demographics.retirementAge"]) || 65;
  const yearsToRetirement = Math.max(0, retirementAge - age);

  const totalIncome =
    (Number(data["income.primarySalary"]) || 0) +
    (Number(data["income.secondarySalary"]) || 0);

  const monthlySpending =
    (Number(data["spending.housing"]) || 0) +
    (Number(data["spending.transportation"]) || 0) +
    (Number(data["spending.food"]) || 0) +
    (Number(data["spending.healthcare"]) || 0) +
    (Number(data["spending.entertainment"]) || 0) +
    (Number(data["spending.subscriptions"]) || 0) +
    (Number(data["spending.giving"]) || 0) +
    (Number(data["spending.other"]) || 0);

  const annualSpending = monthlySpending * 12;
  const retirementSpending = annualSpending * 0.8; // 80% rule
  const retirementNeed = retirementSpending * 25; // 4% rule

  const currentRetirementSavings =
    (Number(data["savings.retirement401k"]) || 0) +
    (Number(data["savings.retirementIRA"]) || 0) +
    (Number(data["savings.rothBalance"]) || 0) +
    (Number(data["savings.brokerageBalance"]) || 0);

  const savingsRate = Number(data["savings.savingsRate"]) || 10;
  const annualContribution = totalIncome * (savingsRate / 100);
  const growthRate = 0.07;

  // Project future value of current savings + contributions
  let projectedValue = currentRetirementSavings;
  for (let i = 0; i < yearsToRetirement; i++) {
    projectedValue = projectedValue * (1 + growthRate) + annualContribution;
  }

  const readinessPercent = Math.min(100, Math.round((projectedValue / retirementNeed) * 100));
  const gap = Math.max(0, retirementNeed - projectedValue);
  const onTrack = readinessPercent >= 90;

  // Required additional monthly savings to close gap
  const fvAnnuity = ((Math.pow(1 + growthRate, yearsToRetirement) - 1) / growthRate);
  const additionalAnnual = gap > 0 ? gap / fvAnnuity : 0;
  const additionalMonthly = additionalAnnual / 12;

  // Social Security estimate (rough)
  const ssEstimate = Math.min(45000, totalIncome * 0.35);

  const statusColor = readinessPercent >= 90 ? "emerald" : readinessPercent >= 60 ? "gold" : "rose";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Clock className="w-5 h-5 text-accent-light" />
        <h3 className="font-semibold text-white">Retirement Readiness</h3>
        <span className={`ml-auto text-xs px-2.5 py-1 rounded-full bg-${statusColor}/10 text-${statusColor}`}>
          {onTrack ? "On Track" : readinessPercent >= 60 ? "Needs Attention" : "Action Required"}
        </span>
      </div>

      <div className="p-6">
        {/* Readiness gauge */}
        <div className="relative mb-8">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Retirement Readiness</p>
              <p className={`text-4xl font-bold text-${statusColor}`}>{readinessPercent}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">{yearsToRetirement} years to go</p>
              <p className="text-sm text-slate-400">Age {retirementAge}</p>
            </div>
          </div>
          <div className="h-3 bg-surface rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                onTrack ? "from-emerald to-emerald-light" : readinessPercent >= 60 ? "from-gold to-gold-light" : "from-rose to-rose"
              } rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${readinessPercent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </div>
          {/* 100% marker */}
          <div className="absolute right-0 top-[calc(100%-6px)] w-px h-5 bg-white/20" />
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <NumberCard
            icon={<Target className="w-4 h-4 text-accent-light" />}
            label="Retirement Need"
            value={formatCurrency(retirementNeed)}
            sublabel="Based on 4% rule"
          />
          <NumberCard
            icon={<TrendingUp className="w-4 h-4 text-emerald" />}
            label="Projected Value"
            value={formatCurrency(projectedValue)}
            sublabel={`At age ${retirementAge}`}
          />
          <NumberCard
            icon={<Clock className="w-4 h-4 text-gold" />}
            label="Current Savings"
            value={formatCurrency(currentRetirementSavings)}
            sublabel={`${formatFullCurrency(annualContribution)}/yr contributing`}
          />
          <NumberCard
            icon={<Target className="w-4 h-4 text-sky" />}
            label="Est. Social Security"
            value={formatCurrency(ssEstimate)}
            sublabel="Annual benefit"
          />
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          {gap > 0 && (
            <Recommendation
              type="warning"
              text={`Gap of ${formatCurrency(gap)}. Adding ${formatFullCurrency(additionalMonthly)}/month would close it.`}
            />
          )}
          {savingsRate < 15 && (
            <Recommendation
              type="warning"
              text={`Your ${savingsRate}% savings rate is below the recommended 15-20%. Consider increasing contributions.`}
            />
          )}
          {currentRetirementSavings > 0 && savingsRate >= 15 && (
            <Recommendation
              type="success"
              text="Your savings rate and current balances are strong. Keep compounding working in your favor."
            />
          )}
          <Recommendation
            type="info"
            text={`Annual retirement spending estimate: ${formatFullCurrency(retirementSpending)} (80% of current spending, adjusted for no mortgage).`}
          />
        </div>
      </div>
    </motion.div>
  );
}

function NumberCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="bg-surface/50 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-slate-500">{sublabel}</p>
    </div>
  );
}

function Recommendation({ type, text }: { type: "warning" | "success" | "info"; text: string }) {
  const config = {
    warning: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-gold", bg: "bg-gold/5" },
    success: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-emerald", bg: "bg-emerald/5" },
    info: { icon: <Target className="w-3.5 h-3.5" />, color: "text-sky", bg: "bg-sky/5" },
  };
  const c = config[type];

  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-lg ${c.bg}`}>
      <span className={`${c.color} shrink-0 mt-0.5`}>{c.icon}</span>
      <p className="text-xs text-slate-400">{text}</p>
    </div>
  );
}
