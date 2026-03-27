"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FutureTimeline } from "@/types";
import { formatCurrency } from "@/lib/calculations";

interface Props {
  timeline: FutureTimeline;
}

type ViewMode = "networth" | "income-spending" | "happiness" | "scenarios";

export default function WealthChart({ timeline }: Props) {
  const [view, setView] = useState<ViewMode>("networth");

  const chartData = timeline.years.map((y) => ({
    year: y.year,
    age: y.age,
    netWorth: y.projectedNetWorth,
    income: y.projectedIncome,
    spending: y.projectedSpending,
    happiness: y.projectedHappiness,
    bestCase: timeline.scenarios[0]?.timeline.find((s) => s.year === y.year)?.projectedNetWorth || y.projectedNetWorth * 1.3,
    conservative: timeline.scenarios[1]?.timeline.find((s) => s.year === y.year)?.projectedNetWorth || y.projectedNetWorth * 0.7,
    disruption: timeline.scenarios[2]?.timeline.find((s) => s.year === y.year)?.projectedNetWorth || y.projectedNetWorth * 0.5,
  }));

  const tabs: { id: ViewMode; label: string }[] = [
    { id: "networth", label: "Net Worth" },
    { id: "income-spending", label: "Cash Flow" },
    { id: "happiness", label: "Happiness" },
    { id: "scenarios", label: "Scenarios" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white text-lg">Financial Trajectory</h3>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === tab.id
                  ? "bg-accent text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        {view === "networth" ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="networthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="age"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="#6366f1"
              fill="url(#networthGrad)"
              strokeWidth={2}
              name="Net Worth"
            />
          </AreaChart>
        ) : view === "income-spending" ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="age" stroke="rgba(255,255,255,0.2)" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
            <Area type="monotone" dataKey="spending" stroke="#f43f5e" fill="url(#spendGrad)" strokeWidth={2} name="Spending" />
          </AreaChart>
        ) : view === "happiness" ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="happyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="age" stroke="rgba(255,255,255,0.2)" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.2)" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="happiness" stroke="#f59e0b" fill="url(#happyGrad)" strokeWidth={2} name="Happiness Score" />
          </AreaChart>
        ) : (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="bestGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="age" stroke="rgba(255,255,255,0.2)" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="bestCase" stroke="#10b981" fill="url(#bestGrad)" strokeWidth={1.5} name="Best Case" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="netWorth" stroke="#6366f1" fill="url(#baseGrad)" strokeWidth={2} name="Base Case" />
            <Area type="monotone" dataKey="conservative" stroke="#f59e0b" fill="url(#consGrad)" strokeWidth={1.5} name="Conservative" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="disruption" stroke="#f43f5e" fill="none" strokeWidth={1} name="Disruption" strokeDasharray="2 4" />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: number }) {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-lg px-4 py-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-2">Age {label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-medium text-white tabular-nums">
            {entry.name === "Happiness Score" ? entry.value.toFixed(1) : formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
