"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { getMockPortfolioModels } from "@/lib/api-integrations";

interface Props {
  riskTolerance: number;
  investmentStyle: string;
  totalPortfolio: number;
}

const COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#a78bfa", "#94a3b8"];

export default function InvestmentPanel({ riskTolerance, totalPortfolio }: Props) {
  const models = getMockPortfolioModels();
  const recommended = models.find((m) => m.riskLevel === riskTolerance) || models[1];

  const allocationData = Object.entries(recommended.allocation).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-sky" />
        <h3 className="font-semibold text-white">Investment Strategy</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-sky/10 text-sky">
          Powered by Altruist
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Recommended allocation */}
          <div>
            <div className="mb-4">
              <h4 className="text-white font-medium">{recommended.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{recommended.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400">Risk Level:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-4 h-1.5 rounded-full ${
                        level <= recommended.riskLevel ? "bg-accent" : "bg-surface"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {allocationData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    return (
                      <div className="glass rounded-lg px-3 py-2 text-xs">
                        <span className="text-white">{payload[0].name}: {payload[0].value}%</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400">Target Allocation</h4>
            {allocationData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-slate-300 flex-1">{item.name}</span>
                <span className="text-sm font-medium text-white tabular-nums">{item.value}%</span>
                {totalPortfolio > 0 && (
                  <span className="text-xs text-slate-500 tabular-nums w-20 text-right">
                    ${Math.round(totalPortfolio * (item.value / 100)).toLocaleString()}
                  </span>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Expense Ratio</span>
                <span className="text-white font-medium">{recommended.expenseRatio}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Other models */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <h4 className="text-sm font-medium text-slate-400 mb-3">All Model Portfolios</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {models.map((model) => (
              <div
                key={model.id}
                className={`rounded-xl p-3 text-center cursor-pointer transition-all ${
                  model.id === recommended.id
                    ? "bg-accent/20 border border-accent/30"
                    : "bg-surface/50 hover:bg-surface-light/50"
                }`}
              >
                <div className="flex justify-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((l) => (
                    <div
                      key={l}
                      className={`w-2 h-1 rounded-full ${
                        l <= model.riskLevel ? "bg-accent" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-medium text-white">{model.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{model.expenseRatio}% ER</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-600 text-center mt-4">
          Model portfolios provided via Altruist. Past performance does not guarantee future results.
        </p>
      </div>
    </motion.div>
  );
}
