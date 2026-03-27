"use client";

import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { formatFullCurrency } from "@/lib/calculations";

interface Props {
  data: Record<string, unknown>;
}

export default function EmergencyFundTracker({ data }: Props) {
  const emergencyFund = Number(data["savings.emergencyFund"]) || 0;

  const monthlySpending =
    (Number(data["spending.housing"]) || 0) +
    (Number(data["spending.transportation"]) || 0) +
    (Number(data["spending.food"]) || 0) +
    (Number(data["spending.healthcare"]) || 0) +
    (Number(data["spending.entertainment"]) || 0) +
    (Number(data["spending.subscriptions"]) || 0) +
    (Number(data["spending.giving"]) || 0) +
    (Number(data["spending.other"]) || 0);

  const threeMonthTarget = monthlySpending * 3;
  const sixMonthTarget = monthlySpending * 6;

  const monthsCovered = monthlySpending > 0 ? emergencyFund / monthlySpending : 0;
  const progressPercent = Math.min(100, (emergencyFund / sixMonthTarget) * 100);
  const threeMonthPercent = (threeMonthTarget / sixMonthTarget) * 100;

  const status = monthsCovered >= 6 ? "excellent" : monthsCovered >= 3 ? "good" : monthsCovered >= 1 ? "building" : "critical";
  const statusLabels = {
    excellent: { label: "Fully Funded", color: "emerald" },
    good: { label: "Good Progress", color: "gold" },
    building: { label: "Building", color: "gold" },
    critical: { label: "Priority", color: "rose" },
  };
  const s = statusLabels[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald" />
          <h3 className="font-semibold text-white">Emergency Fund</h3>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full bg-${s.color}/10 text-${s.color}`}>
          {s.label}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <p className="text-2xl font-bold text-white">{formatFullCurrency(emergencyFund)}</p>
          <p className="text-xs text-slate-500">{monthsCovered.toFixed(1)} months covered</p>
        </div>

        {/* Progress bar */}
        <div className="relative h-4 bg-surface rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              status === "excellent"
                ? "bg-gradient-to-r from-emerald to-emerald-light"
                : status === "good"
                ? "bg-gradient-to-r from-gold to-gold-light"
                : "bg-gradient-to-r from-rose to-gold"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          />
          {/* 3 month marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/30"
            style={{ left: `${threeMonthPercent}%` }}
          />
        </div>

        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-600">$0</span>
          <span className="text-[10px] text-slate-500" style={{ marginLeft: `${threeMonthPercent - 10}%` }}>
            3 months
          </span>
          <span className="text-[10px] text-slate-500">6 months</span>
        </div>
      </div>

      {/* Targets */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-lg p-3 ${emergencyFund >= threeMonthTarget ? "bg-emerald/5" : "bg-surface/50"}`}>
          <div className="flex items-center gap-1.5 mb-1">
            {emergencyFund >= threeMonthTarget ? (
              <ShieldCheck className="w-3 h-3 text-emerald" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-gold" />
            )}
            <span className="text-[10px] text-slate-400">3-Month Target</span>
          </div>
          <p className="text-sm font-bold text-white">{formatFullCurrency(threeMonthTarget)}</p>
        </div>
        <div className={`rounded-lg p-3 ${emergencyFund >= sixMonthTarget ? "bg-emerald/5" : "bg-surface/50"}`}>
          <div className="flex items-center gap-1.5 mb-1">
            {emergencyFund >= sixMonthTarget ? (
              <ShieldCheck className="w-3 h-3 text-emerald" />
            ) : (
              <TrendingUp className="w-3 h-3 text-accent-light" />
            )}
            <span className="text-[10px] text-slate-400">6-Month Target</span>
          </div>
          <p className="text-sm font-bold text-white">{formatFullCurrency(sixMonthTarget)}</p>
        </div>
      </div>

      {emergencyFund < sixMonthTarget && (
        <p className="text-[11px] text-slate-500 mt-3">
          Need {formatFullCurrency(sixMonthTarget - emergencyFund)} more. At $500/month,
          that&apos;s ~{Math.ceil((sixMonthTarget - emergencyFund) / 500)} months to fully fund.
        </p>
      )}
    </motion.div>
  );
}
