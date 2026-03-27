"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";
import { formatFullCurrency } from "@/lib/calculations";

interface Props {
  data: Record<string, unknown>;
}

const CATEGORIES = [
  { key: "spending.housing", label: "Housing", color: "#6366f1" },
  { key: "spending.transportation", label: "Transportation", color: "#0ea5e9" },
  { key: "spending.food", label: "Food", color: "#10b981" },
  { key: "spending.healthcare", label: "Healthcare", color: "#f43f5e" },
  { key: "spending.entertainment", label: "Entertainment", color: "#f59e0b" },
  { key: "spending.subscriptions", label: "Subscriptions", color: "#a78bfa" },
  { key: "spending.giving", label: "Giving", color: "#34d399" },
  { key: "spending.other", label: "Other", color: "#94a3b8" },
];

export default function SpendingBreakdown({ data }: Props) {
  const items = CATEGORIES.map((cat) => ({
    name: cat.label,
    value: Number(data[cat.key]) || 0,
    color: cat.color,
  })).filter((item) => item.value > 0);

  const totalMonthly = items.reduce((sum, item) => sum + item.value, 0);
  const totalAnnual = totalMonthly * 12;

  const income = (Number(data["income.primarySalary"]) || 0) +
    (Number(data["income.secondarySalary"]) || 0) +
    (Number(data["income.sideIncome"]) || 0) +
    (Number(data["income.passiveIncome"]) || 0);

  const savingsRate = income > 0 ? ((income - totalAnnual) / income * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <DollarSign className="w-5 h-5 text-gold" />
        <h3 className="font-semibold text-white">Monthly Spending</h3>
        <span className="ml-auto text-lg font-bold text-white">{formatFullCurrency(totalMonthly)}/mo</span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={items}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {items.map((item, index) => (
                  <Cell key={`cell-${index}`} fill={item.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  return (
                    <div className="glass rounded-lg px-3 py-2 text-xs">
                      <span className="text-white">
                        {payload[0].name}: {formatFullCurrency(Number(payload[0].value))}/mo
                      </span>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-400 flex-1">{item.name}</span>
                <span className="text-sm text-white tabular-nums">{formatFullCurrency(item.value)}</span>
                <span className="text-xs text-slate-600 tabular-nums w-10 text-right">
                  {totalMonthly > 0 ? Math.round((item.value / totalMonthly) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/5">
          <MetricCard label="Annual Spending" value={formatFullCurrency(totalAnnual)} />
          <MetricCard
            label="Savings Rate"
            value={`${savingsRate.toFixed(1)}%`}
            color={savingsRate >= 20 ? "text-emerald" : savingsRate >= 10 ? "text-gold" : "text-rose"}
          />
          <MetricCard
            label="50/30/20 Status"
            value={
              items.find((i) => i.name === "Housing")
                ? `${Math.round(((items.find((i) => i.name === "Housing")?.value || 0) / (income / 12)) * 100)}% housing`
                : "N/A"
            }
          />
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-surface/50 rounded-xl p-3 text-center">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-sm font-bold ${color || "text-white"}`}>{value}</p>
    </div>
  );
}
