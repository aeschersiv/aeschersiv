"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Scale, ArrowRight, Clock, DollarSign, Sparkles } from "lucide-react";
import { formatCurrency, formatFullCurrency } from "@/lib/calculations";

interface Props {
  data: Record<string, unknown>;
}

export default function IntertemporalCalculator({ data }: Props) {
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [years, setYears] = useState(20);
  const [scenario, setScenario] = useState<"save" | "spend">("save");

  const age = Number(data["demographics.age"]) || 35;
  const returnRate = 0.07;
  const happinessScore = Number(data["happiness.overallScore"]) || 6;

  const calculations = useMemo(() => {
    const totalSpent = monthlyAmount * 12 * years;

    // Future value if invested
    let futureValue = 0;
    for (let i = 0; i < years * 12; i++) {
      futureValue = (futureValue + monthlyAmount) * (1 + returnRate / 12);
    }

    // What that future value could generate as passive income (4% rule)
    const passiveIncomePerYear = futureValue * 0.04;
    const passiveIncomePerMonth = passiveIncomePerYear / 12;

    // Time value comparison
    const chartData = Array.from({ length: years + 1 }, (_, i) => {
      let invested = 0;
      for (let m = 0; m < i * 12; m++) {
        invested = (invested + monthlyAmount) * (1 + returnRate / 12);
      }
      const spent = monthlyAmount * 12 * i;

      return {
        year: i,
        age: age + i,
        invested: Math.round(invested),
        spent: Math.round(spent),
        difference: Math.round(invested - spent),
      };
    });

    // Happiness trade-off
    const immediateHappinessGain = 0.3; // spending gives small immediate boost
    const deferredHappinessGain = 1.5; // financial security gives larger deferred boost
    const yearsToBreakeven = Math.ceil(immediateHappinessGain / (deferredHappinessGain / years));

    return {
      totalSpent,
      futureValue: Math.round(futureValue),
      passiveIncomePerMonth: Math.round(passiveIncomePerMonth),
      passiveIncomePerYear: Math.round(passiveIncomePerYear),
      growthMultiple: (futureValue / totalSpent).toFixed(1),
      chartData,
      yearsToBreakeven,
      freedomYears: Math.round(futureValue / (monthlyAmount * 12)),
    };
  }, [monthlyAmount, years, age, returnRate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Scale className="w-5 h-5 text-lavender" />
        <h3 className="font-semibold text-white">Intertemporal Trade-Off Calculator</h3>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-400 mb-6">
          Every dollar has two lives: the joy it brings today and the freedom it buys tomorrow.
          See how your choices today ripple across your future.
        </p>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-xs text-slate-500 block mb-2">Monthly Amount</label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <input
                type="range"
                min={100}
                max={3000}
                step={50}
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="flex-1 h-2 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
              />
              <span className="text-sm font-bold text-white w-16 text-right">
                ${monthlyAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-2">Time Horizon</label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="flex-1 h-2 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
              />
              <span className="text-sm font-bold text-white w-16 text-right">
                {years} years
              </span>
            </div>
          </div>
        </div>

        {/* The comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div
            className={`rounded-xl p-5 cursor-pointer transition-all ${
              scenario === "spend"
                ? "bg-gold/10 border-2 border-gold/30"
                : "bg-surface/30 border-2 border-transparent hover:border-white/5"
            }`}
            onClick={() => setScenario("spend")}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-white">Spend Today</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {formatFullCurrency(calculations.totalSpent)}
            </p>
            <p className="text-xs text-slate-500">
              Total spent over {years} years at ${monthlyAmount}/mo
            </p>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-xs text-slate-400">
                Provides immediate enjoyment and lifestyle value. After {years} years:
                ${0} in growth. No passive income generated.
              </p>
            </div>
          </div>

          <div
            className={`rounded-xl p-5 cursor-pointer transition-all ${
              scenario === "save"
                ? "bg-emerald/10 border-2 border-emerald/30"
                : "bg-surface/30 border-2 border-transparent hover:border-white/5"
            }`}
            onClick={() => setScenario("save")}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUpIcon />
              <span className="text-sm font-medium text-white">Invest & Grow</span>
            </div>
            <p className="text-3xl font-bold text-emerald mb-1">
              {formatCurrency(calculations.futureValue)}
            </p>
            <p className="text-xs text-slate-500">
              Future value at 7% annual return ({calculations.growthMultiple}x growth)
            </p>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-xs text-slate-400">
                Generates <strong className="text-emerald">{formatFullCurrency(calculations.passiveIncomePerMonth)}/mo</strong> in
                passive income forever (4% rule). That&apos;s{" "}
                <strong className="text-white">{calculations.freedomYears} years</strong> of freedom
                at current spending.
              </p>
            </div>
          </div>
        </div>

        {/* Arrow showing the difference */}
        <div className="flex items-center justify-center gap-4 py-4 mb-6">
          <div className="text-center">
            <p className="text-xs text-slate-500">You invest</p>
            <p className="text-sm font-bold text-white">{formatCurrency(calculations.totalSpent)}</p>
          </div>
          <ArrowRight className="w-6 h-6 text-accent-light" />
          <div className="text-center">
            <p className="text-xs text-slate-500">It becomes</p>
            <p className="text-sm font-bold text-emerald">{formatCurrency(calculations.futureValue)}</p>
          </div>
          <ArrowRight className="w-6 h-6 text-accent-light" />
          <div className="text-center">
            <p className="text-xs text-slate-500">Generating</p>
            <p className="text-sm font-bold text-gold">{formatFullCurrency(calculations.passiveIncomePerMonth)}/mo</p>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={calculations.chartData}>
            <defs>
              <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload) return null;
                return (
                  <div className="glass rounded-lg px-4 py-3 shadow-xl">
                    <p className="text-xs text-slate-400 mb-1.5">Age {label}</p>
                    {payload.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          {entry.name === "invested" ? "Invested" : "Total Spent"}
                        </span>
                        <span className="font-medium text-white">{formatCurrency(Number(entry.value))}</span>
                      </div>
                    ))}
                    {payload.length >= 2 && (
                      <div className="pt-1.5 mt-1.5 border-t border-white/10 text-xs text-emerald">
                        Growth: +{formatCurrency(Number(payload[0]?.value || 0) - Number(payload[1]?.value || 0))}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="invested" stroke="#10b981" fill="url(#investGrad)" strokeWidth={2} name="invested" />
            <Area type="monotone" dataKey="spent" stroke="#f59e0b" fill="url(#spentGrad)" strokeWidth={1.5} strokeDasharray="4 4" name="spent" />
          </AreaChart>
        </ResponsiveContainer>

        <p className="text-[11px] text-slate-600 text-center mt-3">
          Assumes 7% annual return, compounded monthly. Actual returns may vary. This illustrates the power of compound growth, not a guarantee.
        </p>
      </div>
    </motion.div>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="w-4 h-4 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
