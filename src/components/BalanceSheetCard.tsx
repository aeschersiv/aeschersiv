"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BalanceSheetSection } from "@/types";
import { formatCurrency } from "@/lib/calculations";

interface Props {
  section: BalanceSheetSection;
  color: string;
  delay?: number;
}

const trendIcons = {
  up: <TrendingUp className="w-3.5 h-3.5 text-emerald" />,
  down: <TrendingDown className="w-3.5 h-3.5 text-rose" />,
  stable: <Minus className="w-3.5 h-3.5 text-slate-500" />,
};

export default function BalanceSheetCard({ section, color, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className={`px-6 py-4 border-b border-white/5 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full bg-${color}`} />
          <h3 className="font-semibold text-white">{section.label}</h3>
        </div>
        <span className="text-lg font-bold text-white">{formatCurrency(section.total)}</span>
      </div>
      <div className="divide-y divide-white/5">
        {section.items.map((item) => (
          <div key={item.label} className="px-6 py-3 flex items-center justify-between hover:bg-surface-light/30 transition-colors">
            <div className="flex items-center gap-3">
              {trendIcons[item.trend]}
              <span className="text-sm text-slate-300">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.happinessWeight >= 0.8 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold-light">
                  High happiness impact
                </span>
              )}
              <span className="text-sm font-medium text-white tabular-nums">
                {formatCurrency(item.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
