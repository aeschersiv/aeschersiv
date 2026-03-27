"use client";

import { motion } from "framer-motion";
import { Receipt, ArrowRight, CheckCircle, Info } from "lucide-react";
import { formatFullCurrency } from "@/lib/calculations";

interface Props {
  data: Record<string, unknown>;
}

interface TaxStrategy {
  title: string;
  description: string;
  estimatedSavings: number;
  category: "retirement" | "deduction" | "investment" | "planning";
  applicable: boolean;
}

export default function TaxOptimization({ data }: Props) {
  const totalIncome =
    (Number(data["income.primarySalary"]) || 0) +
    (Number(data["income.secondarySalary"]) || 0) +
    (Number(data["income.sideIncome"]) || 0) +
    (Number(data["income.passiveIncome"]) || 0);

  const filingStatus = String(data["demographics.filingStatus"] || "single");
  const dependents = Number(data["demographics.dependents"]) || 0;
  const r401k = Number(data["savings.retirement401k"]) || 0;
  const ira = Number(data["savings.retirementIRA"]) || 0;
  const roth = Number(data["savings.rothBalance"]) || 0;
  const giving = Number(data["spending.giving"]) || 0;
  const healthType = String(data["insurance.healthInsuranceType"] || "employer");

  // Estimate marginal tax rate
  const marginalRate =
    totalIncome > 578125 ? 0.37 :
    totalIncome > 231250 ? 0.35 :
    totalIncome > 182100 ? 0.32 :
    totalIncome > 95375 ? 0.24 :
    totalIncome > 44725 ? 0.22 :
    totalIncome > 11000 ? 0.12 : 0.10;

  const allStrategies: TaxStrategy[] = [
    {
      title: "Max out 401(k) contributions",
      description: `Contributing the max ($23,500 in 2026) reduces taxable income by that amount. You're saving at a ${(marginalRate * 100).toFixed(0)}% marginal rate.`,
      estimatedSavings: Math.round(23500 * marginalRate),
      category: "retirement" as const,
      applicable: r401k < 500000,
    },
    {
      title: "Roth conversion ladder strategy",
      description: "If you expect to be in a lower bracket in retirement, consider converting traditional to Roth during low-income years.",
      estimatedSavings: Math.round(totalIncome * 0.02),
      category: "retirement" as const,
      applicable: ira > 50000 || r401k > 200000,
    },
    {
      title: "HSA triple tax advantage",
      description: "Health Savings Accounts offer tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses.",
      estimatedSavings: Math.round(4150 * marginalRate),
      category: "deduction" as const,
      applicable: healthType === "employer",
    },
    {
      title: "Charitable giving optimization",
      description: giving > 0
        ? `Your $${(giving * 12).toLocaleString()}/yr in giving could be bunched into alternate years with a donor-advised fund for larger deductions.`
        : "Donor-advised funds allow you to bunch charitable deductions for maximum tax benefit.",
      estimatedSavings: Math.round(giving * 12 * marginalRate),
      category: "deduction" as const,
      applicable: giving > 200,
    },
    {
      title: "Tax-loss harvesting",
      description: "Selling investments at a loss to offset capital gains can save significant taxes. Altruist can automate this.",
      estimatedSavings: Math.round(3000 * marginalRate),
      category: "investment" as const,
      applicable: (Number(data["savings.brokerageBalance"]) || 0) > 10000,
    },
    {
      title: "Dependent care FSA",
      description: `With ${dependents} dependent(s), a dependent care FSA saves up to $5,000 in pre-tax childcare expenses.`,
      estimatedSavings: Math.round(5000 * marginalRate),
      category: "deduction" as const,
      applicable: dependents > 0,
    },
    {
      title: "Backdoor Roth IRA",
      description: "If your income is too high for direct Roth contributions, a backdoor Roth lets you still benefit from tax-free growth.",
      estimatedSavings: Math.round(7000 * 0.07 * 20 * marginalRate / 20),
      category: "retirement" as const,
      applicable: totalIncome > 161000,
    },
    {
      title: "Business expense deductions",
      description: "Side income opens up deductions for home office, equipment, education, and other business expenses.",
      estimatedSavings: Math.round((Number(data["income.sideIncome"]) || 0) * 0.15 * marginalRate),
      category: "planning" as const,
      applicable: (Number(data["income.sideIncome"]) || 0) > 5000,
    },
  ];
  const strategies = allStrategies.filter((s) => s.applicable);

  const totalPotentialSavings = strategies.reduce((sum, s) => sum + s.estimatedSavings, 0);

  const categoryColors: Record<string, string> = {
    retirement: "text-accent-light",
    deduction: "text-emerald",
    investment: "text-sky",
    planning: "text-gold",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5 text-emerald" />
          <h3 className="font-semibold text-white">Tax Optimization Strategies</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Potential annual savings</p>
          <p className="text-lg font-bold text-emerald">{formatFullCurrency(totalPotentialSavings)}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Tax bracket info */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-surface/50 mb-6">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <p className="text-xs text-slate-400">
            Estimated marginal tax rate: <strong className="text-white">{(marginalRate * 100).toFixed(0)}%</strong>
            {filingStatus === "married-joint" && " (Married Filing Jointly)"}
            {filingStatus === "single" && " (Single)"}
            . Income: {formatFullCurrency(totalIncome)}/yr.
          </p>
        </div>

        {/* Strategies */}
        <div className="space-y-3">
          {strategies.map((strategy, i) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-surface/30 hover:bg-surface-light/30 transition-colors"
            >
              <CheckCircle className={`w-4 h-4 ${categoryColors[strategy.category]} shrink-0 mt-0.5`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white">{strategy.title}</h4>
                  <span className="text-sm font-bold text-emerald">{formatFullCurrency(strategy.estimatedSavings)}</span>
                </div>
                <p className="text-xs text-slate-500">{strategy.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-slate-600 text-center mt-4">
          Estimates are approximate. Consult a tax professional for personalized advice. Tax laws change annually.
        </p>
      </div>
    </motion.div>
  );
}
