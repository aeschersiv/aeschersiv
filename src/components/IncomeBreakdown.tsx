"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Wallet, TrendingUp } from "lucide-react";
import { formatFullCurrency, formatCurrency } from "@/lib/calculations";

interface Props {
  data: Record<string, unknown>;
}

const INCOME_SOURCES = [
  { key: "income.primarySalary", label: "Primary Salary", color: "#6366f1" },
  { key: "income.secondarySalary", label: "Secondary Salary", color: "#0ea5e9" },
  { key: "income.sideIncome", label: "Side Income", color: "#10b981" },
  { key: "income.passiveIncome", label: "Passive Income", color: "#f59e0b" },
];

export default function IncomeBreakdown({ data }: Props) {
  const sources = INCOME_SOURCES.map((s) => ({
    name: s.label,
    value: Number(data[s.key]) || 0,
    color: s.color,
  })).filter((s) => s.value > 0);

  const totalIncome = sources.reduce((sum, s) => sum + s.value, 0);
  const passiveRatio = totalIncome > 0
    ? ((Number(data["income.passiveIncome"]) || 0) / totalIncome) * 100
    : 0;

  const growthRate = Number(data["income.expectedGrowthRate"]) || 3;

  // Project income for next 5 years
  const projections = Array.from({ length: 6 }, (_, i) => ({
    year: `Year ${i}`,
    income: Math.round(totalIncome * Math.pow(1 + growthRate / 100, i)),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Wallet className="w-5 h-5 text-emerald" />
        <h3 className="font-semibold text-white">Income Overview</h3>
        <span className="ml-auto text-lg font-bold text-emerald">{formatCurrency(totalIncome)}/yr</span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Source breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider">Income Sources</h4>
            {sources.map((source) => (
              <div key={source.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-sm text-slate-300">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white tabular-nums">
                    {formatFullCurrency(source.value)}
                  </span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(source.value / totalIncome) * 100}%`,
                      backgroundColor: source.color,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Monthly Take-Home (est.)</span>
                <span className="text-white font-medium">{formatFullCurrency(totalIncome * 0.72 / 12)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Passive Income Ratio</span>
                <span className={`font-medium ${passiveRatio >= 20 ? "text-emerald" : "text-slate-300"}`}>
                  {passiveRatio.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Expected Growth</span>
                <span className="text-accent-light font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {growthRate}%/yr
                </span>
              </div>
            </div>
          </div>

          {/* 5-year projection */}
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">5-Year Projection</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={projections}>
                <XAxis
                  dataKey="year"
                  stroke="rgba(255,255,255,0.1)"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    return (
                      <div className="glass rounded-lg px-3 py-2 text-xs">
                        <span className="text-white">{formatFullCurrency(Number(payload[0].value))}</span>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="income" radius={[4, 4, 0, 0]}>
                  {projections.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#6366f1" : `rgba(99, 102, 241, ${0.3 + (index / projections.length) * 0.7})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-slate-600 text-center">
              Projected at {growthRate}% annual growth
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
