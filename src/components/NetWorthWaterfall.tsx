"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";

interface Props {
  data: Record<string, unknown>;
}

interface WaterfallItem {
  label: string;
  value: number;
  type: "positive" | "negative" | "total";
  color: string;
}

export default function NetWorthWaterfall({ data }: Props) {
  const emergencyFund = Number(data["savings.emergencyFund"]) || 0;
  const r401k = Number(data["savings.retirement401k"]) || 0;
  const ira = Number(data["savings.retirementIRA"]) || 0;
  const roth = Number(data["savings.rothBalance"]) || 0;
  const brokerage = Number(data["savings.brokerageBalance"]) || 0;
  const mortgage = Number(data["debt.mortgage.balance"]) || 0;
  const student = Number(data["debt.studentLoans.balance"]) || 0;
  const auto = Number(data["debt.autoLoans.balance"]) || 0;
  const credit = Number(data["debt.creditCards.balance"]) || 0;
  const other = Number(data["debt.otherDebt.balance"]) || 0;

  const totalAssets = emergencyFund + r401k + ira + roth + brokerage;
  const totalDebt = mortgage + student + auto + credit + other;
  const netWorth = totalAssets - totalDebt;

  const positiveItems: WaterfallItem[] = [
    { label: "Cash Savings", value: emergencyFund, type: "positive", color: "#10b981" },
    { label: "401(k)", value: r401k, type: "positive", color: "#6366f1" },
    { label: "IRA", value: ira, type: "positive", color: "#818cf8" },
    { label: "Roth", value: roth, type: "positive", color: "#0ea5e9" },
    { label: "Brokerage", value: brokerage, type: "positive", color: "#a78bfa" },
  ];
  const negativeItems: WaterfallItem[] = [
    ...(mortgage > 0 ? [{ label: "Mortgage", value: -mortgage, type: "negative" as const, color: "#f43f5e" }] : []),
    ...(student > 0 ? [{ label: "Student Loans", value: -student, type: "negative" as const, color: "#fb7185" }] : []),
    ...(auto > 0 ? [{ label: "Auto Loans", value: -auto, type: "negative" as const, color: "#fda4af" }] : []),
    ...(credit > 0 ? [{ label: "Credit Cards", value: -credit, type: "negative" as const, color: "#fecdd3" }] : []),
    ...(other > 0 ? [{ label: "Other Debt", value: -other, type: "negative" as const, color: "#ffe4e6" }] : []),
  ];
  const items = [...positiveItems, ...negativeItems].filter(item => Math.abs(item.value) > 0);

  // Calculate cumulative positions for waterfall
  const maxAbsValue = Math.max(totalAssets, totalDebt, Math.abs(netWorth));

  let cumulative = 0;
  const barData = items.map((item) => {
    const start = cumulative;
    cumulative += item.value;
    return { ...item, start, end: cumulative };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Layers className="w-5 h-5 text-lavender" />
        <h3 className="font-semibold text-white">Net Worth Breakdown</h3>
        <span className={`ml-auto text-lg font-bold ${netWorth >= 0 ? "text-emerald" : "text-rose"}`}>
          {formatCurrency(netWorth)}
        </span>
      </div>

      <div className="p-6">
        {/* Summary row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-emerald/5 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Assets</p>
            <p className="text-lg font-bold text-emerald">{formatCurrency(totalAssets)}</p>
          </div>
          <div className="bg-rose/5 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Debt</p>
            <p className="text-lg font-bold text-rose">{formatCurrency(totalDebt)}</p>
          </div>
          <div className={`${netWorth >= 0 ? "bg-accent/5" : "bg-rose/5"} rounded-xl p-3 text-center`}>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Net Worth</p>
            <p className={`text-lg font-bold ${netWorth >= 0 ? "text-accent-light" : "text-rose"}`}>
              {formatCurrency(netWorth)}
            </p>
          </div>
        </div>

        {/* Waterfall bars */}
        <div className="space-y-2">
          {barData.map((item, i) => {
            const barWidth = Math.abs(item.value) / maxAbsValue * 100;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs text-slate-400 w-24 text-right shrink-0">{item.label}</span>
                <div className="flex-1 h-6 relative">
                  <motion.div
                    className="absolute top-0 h-full rounded"
                    style={{
                      backgroundColor: item.color,
                      left: item.value >= 0 ? "0%" : undefined,
                      right: item.value < 0 ? "0%" : undefined,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                  />
                </div>
                <span className={`text-xs font-medium tabular-nums w-20 text-right ${item.value >= 0 ? "text-emerald" : "text-rose"}`}>
                  {item.value >= 0 ? "+" : ""}{formatCurrency(Math.abs(item.value))}
                </span>
              </motion.div>
            );
          })}

          {/* Net worth bar */}
          <div className="pt-2 mt-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-white w-24 text-right shrink-0">Net Worth</span>
              <div className="flex-1 h-6 relative">
                <motion.div
                  className={`absolute top-0 h-full rounded ${netWorth >= 0 ? "bg-gradient-to-r from-accent to-emerald" : "bg-rose"}`}
                  style={{ left: netWorth >= 0 ? "0%" : undefined, right: netWorth < 0 ? "0%" : undefined }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.abs(netWorth) / maxAbsValue * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
              <span className={`text-xs font-bold tabular-nums w-20 text-right ${netWorth >= 0 ? "text-emerald" : "text-rose"}`}>
                {formatCurrency(netWorth)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
