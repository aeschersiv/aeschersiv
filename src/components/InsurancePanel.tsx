"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { formatFullCurrency } from "@/lib/calculations";
import { getMockInsuranceQuotes } from "@/lib/api-integrations";

interface Props {
  gap: {
    lifeInsuranceGap: number;
    disabilityGap: boolean;
    recommendations: string[];
  };
  data: Record<string, unknown>;
}

export default function InsurancePanel({ gap, data }: Props) {
  const quotes = gap.lifeInsuranceGap > 0 ? getMockInsuranceQuotes(gap.lifeInsuranceGap) : null;
  const hasLifeInsurance = data["insurance.hasLifeInsurance"] === "yes";
  const hasDisability = data["insurance.hasDisabilityInsurance"] === "yes";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Shield className="w-5 h-5 text-accent-light" />
        <h3 className="font-semibold text-white">Protection Analysis</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent-light">
          Powered by Backn9ne
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatusCard
            label="Life Insurance"
            status={hasLifeInsurance ? (gap.lifeInsuranceGap > 0 ? "warning" : "good") : "critical"}
            detail={
              hasLifeInsurance
                ? gap.lifeInsuranceGap > 0
                  ? `Gap: ${formatFullCurrency(gap.lifeInsuranceGap)}`
                  : "Adequate coverage"
                : "No coverage"
            }
          />
          <StatusCard
            label="Disability Insurance"
            status={hasDisability ? "good" : "critical"}
            detail={hasDisability ? "Coverage in place" : "Income at risk"}
          />
          <StatusCard
            label="Health Insurance"
            status={data["insurance.healthInsuranceType"] !== "none" ? "good" : "critical"}
            detail={String(data["insurance.healthInsuranceType"] || "None").replace("-", " ")}
          />
        </div>

        {/* Recommendations */}
        {gap.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400">Recommendations</h4>
            {gap.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-surface/50">
                <AlertTriangle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{rec}</p>
              </div>
            ))}
          </div>
        )}

        {/* Insurance quotes */}
        {quotes && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400">
              Available Quotes — {formatFullCurrency(gap.lifeInsuranceGap)} Coverage
            </h4>
            {quotes.quotes.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-surface/50 hover:bg-surface-light/50 transition-colors group cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-white">{q.carrier}</p>
                  <p className="text-xs text-slate-500">{q.productName} · {q.rating} rated</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-lg font-bold text-white">${q.monthlyPremium}/mo</p>
                    <p className="text-xs text-slate-500">${q.annualPremium}/yr</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-accent-light transition-colors" />
                </div>
              </motion.div>
            ))}
            <p className="text-[11px] text-slate-600 text-center mt-2">
              Quotes are illustrative. Final rates depend on underwriting. Provided via Backn9ne Insurance API.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatusCard({
  label,
  status,
  detail,
}: {
  label: string;
  status: "good" | "warning" | "critical";
  detail: string;
}) {
  const colors = {
    good: { bg: "bg-emerald/10", text: "text-emerald", icon: <CheckCircle className="w-4 h-4" /> },
    warning: { bg: "bg-gold/10", text: "text-gold", icon: <AlertTriangle className="w-4 h-4" /> },
    critical: { bg: "bg-rose/10", text: "text-rose", icon: <AlertTriangle className="w-4 h-4" /> },
  };
  const c = colors[status];

  return (
    <div className={`rounded-xl p-4 ${c.bg}`}>
      <div className={`flex items-center gap-2 ${c.text} mb-1`}>
        {c.icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-white font-medium capitalize">{detail}</p>
    </div>
  );
}
