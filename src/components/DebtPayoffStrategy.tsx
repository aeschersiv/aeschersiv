"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CreditCard, Zap, Snowflake, ArrowRight, CheckCircle } from "lucide-react";
import { formatFullCurrency } from "@/lib/calculations";

interface DebtItem {
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

interface Props {
  data: Record<string, unknown>;
}

export default function DebtPayoffStrategy({ data }: Props) {
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">("avalanche");

  const debts: DebtItem[] = [
    ...(Number(data["debt.creditCards.balance"]) > 0
      ? [{ name: "Credit Cards", balance: Number(data["debt.creditCards.balance"]), rate: 22.0, minPayment: Math.max(50, Number(data["debt.creditCards.balance"]) * 0.02) }]
      : []),
    ...(Number(data["debt.studentLoans.balance"]) > 0
      ? [{ name: "Student Loans", balance: Number(data["debt.studentLoans.balance"]), rate: 5.5, minPayment: Math.max(100, Number(data["debt.studentLoans.balance"]) * 0.01) }]
      : []),
    ...(Number(data["debt.autoLoans.balance"]) > 0
      ? [{ name: "Auto Loans", balance: Number(data["debt.autoLoans.balance"]), rate: 6.5, minPayment: Math.max(200, Number(data["debt.autoLoans.balance"]) * 0.02) }]
      : []),
    ...(Number(data["debt.otherDebt.balance"]) > 0
      ? [{ name: "Other Debt", balance: Number(data["debt.otherDebt.balance"]), rate: 8.0, minPayment: Math.max(50, Number(data["debt.otherDebt.balance"]) * 0.02) }]
      : []),
  ];

  if (debts.length === 0) return null;

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minPayment, 0);
  const extraMonthly = 300; // suggested extra payment

  const sorted = [...debts].sort((a, b) =>
    strategy === "avalanche" ? b.rate - a.rate : a.balance - b.balance
  );

  // Calculate payoff timeline
  const calculatePayoffMonths = (debtList: DebtItem[], extra: number): number => {
    const remaining = debtList.map((d) => ({ ...d }));
    let months = 0;
    let availableExtra = extra;

    while (remaining.some((d) => d.balance > 0) && months < 360) {
      months++;
      for (const debt of remaining) {
        if (debt.balance <= 0) continue;
        const interest = (debt.rate / 100 / 12) * debt.balance;
        const payment = debt === remaining.find((d) => d.balance > 0)
          ? debt.minPayment + availableExtra
          : debt.minPayment;
        debt.balance = Math.max(0, debt.balance + interest - payment);
      }
      // When a debt is paid off, its min payment becomes available
      const paidOff = remaining.filter((d) => d.balance <= 0);
      availableExtra = extra + paidOff.reduce((sum, d) => sum + d.minPayment, 0) - paidOff.reduce((sum, d) => sum + d.minPayment, 0);
    }
    return months;
  };

  const payoffMonths = calculatePayoffMonths(sorted, extraMonthly);
  const payoffYears = Math.ceil(payoffMonths / 12);

  // Weighted average interest rate
  const weightedRate = debts.reduce((sum, d) => sum + d.rate * d.balance, 0) / totalDebt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <CreditCard className="w-5 h-5 text-rose" />
        <h3 className="font-semibold text-white">Debt Payoff Strategy</h3>
        <span className="ml-auto text-sm font-bold text-rose">{formatFullCurrency(totalDebt)}</span>
      </div>

      <div className="p-6">
        {/* Strategy toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setStrategy("avalanche")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              strategy === "avalanche"
                ? "bg-accent/20 border border-accent/30 text-accent-light"
                : "bg-surface/50 text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            Avalanche
            <span className="text-[10px] opacity-60">(Highest rate first)</span>
          </button>
          <button
            onClick={() => setStrategy("snowball")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              strategy === "snowball"
                ? "bg-accent/20 border border-accent/30 text-accent-light"
                : "bg-surface/50 text-slate-400 hover:text-white"
            }`}
          >
            <Snowflake className="w-4 h-4" />
            Snowball
            <span className="text-[10px] opacity-60">(Smallest balance first)</span>
          </button>
        </div>

        {/* Payoff order */}
        <div className="space-y-3 mb-6">
          {sorted.map((debt, i) => (
            <div key={debt.name} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-xs font-bold text-accent-light">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{debt.name}</span>
                  <span className="text-sm text-white tabular-nums">{formatFullCurrency(debt.balance)}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-slate-500">{debt.rate}% APR</span>
                  <span className="text-xs text-slate-500">{formatFullCurrency(debt.minPayment)}/mo min</span>
                </div>
                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose to-gold rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (debt.balance / totalDebt) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-surface/50">
          <div className="text-center">
            <p className="text-xs text-slate-500">Min Payments</p>
            <p className="text-sm font-bold text-white">{formatFullCurrency(totalMinPayment)}/mo</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Avg Rate</p>
            <p className="text-sm font-bold text-gold">{weightedRate.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">Est. Payoff</p>
            <p className="text-sm font-bold text-emerald">~{payoffYears} years</p>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-emerald/5 border border-emerald/10">
          <CheckCircle className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            Adding just {formatFullCurrency(extraMonthly)}/month extra toward the{" "}
            {strategy === "avalanche" ? "highest-rate" : "smallest"} debt first can save you thousands in
            interest and months of payments.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
