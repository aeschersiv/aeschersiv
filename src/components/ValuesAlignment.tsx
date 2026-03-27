"use client";

import { motion } from "framer-motion";
import { Compass, Heart, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  data: Record<string, unknown>;
}

interface AlignmentItem {
  value: string;
  label: string;
  aligned: boolean;
  insight: string;
  recommendation?: string;
}

const valueLabels: Record<string, string> = {
  family: "Family & Relationships",
  freedom: "Freedom & Independence",
  security: "Security & Stability",
  adventure: "Adventure & Experiences",
  growth: "Personal Growth",
  creativity: "Creativity & Expression",
  service: "Service & Giving Back",
  health: "Health & Vitality",
  legacy: "Legacy & Impact",
  community: "Community & Belonging",
  spirituality: "Spirituality & Faith",
  achievement: "Achievement & Recognition",
};

export default function ValuesAlignment({ data }: Props) {
  const topValues = (data["happiness.topValues"] as string[]) || [];
  const items = analyzeAlignment(topValues, data);

  const alignedCount = items.filter((i) => i.aligned).length;
  const alignmentScore = items.length > 0 ? Math.round((alignedCount / items.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Compass className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-white">Values Alignment</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${alignmentScore >= 70 ? "text-emerald" : alignmentScore >= 40 ? "text-gold" : "text-rose"}`}>
            {alignmentScore}%
          </span>
          <span className="text-xs text-slate-500">aligned</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-slate-400 mb-6">
          How well does your financial plan support what you value most? Here&apos;s the alignment
          between your stated values and your actual financial behavior.
        </p>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`rounded-xl p-4 ${item.aligned ? "bg-emerald/5 border border-emerald/10" : "bg-gold/5 border border-gold/10"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {item.aligned ? (
                  <CheckCircle className="w-4 h-4 text-emerald shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gold shrink-0" />
                )}
                <div className="flex items-center gap-2 flex-1">
                  <Heart className="w-3 h-3 text-rose" />
                  <span className="text-sm font-medium text-white">{item.label}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.aligned ? "bg-emerald/20 text-emerald" : "bg-gold/20 text-gold"}`}>
                  {item.aligned ? "Aligned" : "Gap"}
                </span>
              </div>
              <p className="text-xs text-slate-400 ml-7">{item.insight}</p>
              {item.recommendation && (
                <p className="text-xs text-accent-light ml-7 mt-1">{item.recommendation}</p>
              )}
            </motion.div>
          ))}
        </div>

        {alignmentScore < 70 && (
          <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/10">
            <p className="text-sm text-slate-300">
              <strong className="text-white">Closing the gap:</strong> When your money flows toward what
              you truly value, both your financial outcomes and happiness improve. Focus on the
              misaligned areas above for the biggest impact on your wellbeing.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function analyzeAlignment(values: string[], data: Record<string, unknown>): AlignmentItem[] {
  const items: AlignmentItem[] = [];

  const giving = Number(data["spending.giving"]) || 0;
  const emergencyFund = Number(data["savings.emergencyFund"]) || 0;
  const monthlySpending = (Number(data["spending.housing"]) || 0) + (Number(data["spending.transportation"]) || 0) +
    (Number(data["spending.food"]) || 0) + (Number(data["spending.healthcare"]) || 0) +
    (Number(data["spending.entertainment"]) || 0) + (Number(data["spending.subscriptions"]) || 0) +
    (Number(data["spending.giving"]) || 0) + (Number(data["spending.other"]) || 0);
  const savingsRate = Number(data["savings.savingsRate"]) || 0;
  const freedomScore = Number(data["happiness.freedomAutonomy"]) || 5;
  const relationshipScore = Number(data["happiness.relationshipQuality"]) || 5;
  const healthScore = Number(data["happiness.healthWellbeing"]) || 5;
  const purposeScore = Number(data["happiness.purposeMeaning"]) || 5;
  const hasLifeInsurance = data["insurance.hasLifeInsurance"] === "yes";
  const entertainment = Number(data["spending.entertainment"]) || 0;

  for (const value of values) {
    switch (value) {
      case "family":
        items.push({
          value,
          label: valueLabels[value],
          aligned: hasLifeInsurance && relationshipScore >= 7,
          insight: hasLifeInsurance
            ? `You have life insurance protecting your family. Relationship quality: ${relationshipScore}/10.`
            : "Your family isn't financially protected without life insurance.",
          recommendation: !hasLifeInsurance ? "Get life insurance through Backn9ne to protect your family's future." : undefined,
        });
        break;
      case "freedom":
        items.push({
          value,
          label: valueLabels[value],
          aligned: savingsRate >= 20 && freedomScore >= 6,
          insight: `Freedom score: ${freedomScore}/10. Savings rate: ${savingsRate}%. ${savingsRate >= 20 ? "You're actively building toward financial independence." : "A higher savings rate accelerates your path to freedom."}`,
          recommendation: savingsRate < 20 ? "Increase savings rate to 20%+ to accelerate financial independence." : undefined,
        });
        break;
      case "security":
        items.push({
          value,
          label: valueLabels[value],
          aligned: emergencyFund >= monthlySpending * 6 && hasLifeInsurance,
          insight: emergencyFund >= monthlySpending * 6
            ? "Strong emergency fund and insurance coverage. Your security foundation is solid."
            : `Emergency fund covers ${monthlySpending > 0 ? (emergencyFund / monthlySpending).toFixed(1) : 0} months. Target: 6 months.`,
          recommendation: emergencyFund < monthlySpending * 6 ? "Build your emergency fund to 6 months of expenses." : undefined,
        });
        break;
      case "adventure":
        items.push({
          value,
          label: valueLabels[value],
          aligned: entertainment >= 300,
          insight: entertainment >= 300
            ? `You're allocating $${entertainment}/mo to experiences and entertainment. Keep balancing adventure with savings.`
            : "Your entertainment spending is low. Consider budgeting for meaningful experiences.",
          recommendation: entertainment < 300 ? "Earmark specific funds for experiences — they create lasting happiness." : undefined,
        });
        break;
      case "growth":
        items.push({
          value,
          label: valueLabels[value],
          aligned: (data["humanCapital.careerTrajectory"] === "ascending"),
          insight: data["humanCapital.careerTrajectory"] === "ascending"
            ? "Your career is on an upward trajectory. Continue investing in skills and education."
            : "Consider investing in education or skill development to reignite growth.",
          recommendation: data["humanCapital.careerTrajectory"] !== "ascending" ? "Allocate a learning budget for courses, certifications, or coaching." : undefined,
        });
        break;
      case "service":
        items.push({
          value,
          label: valueLabels[value],
          aligned: giving >= 200,
          insight: giving >= 200
            ? `You're giving $${giving}/month — your financial plan supports your service values.`
            : "Your giving doesn't yet reflect this as a top value.",
          recommendation: giving < 200 ? "Start with 1-2% of income and grow. Consider a donor-advised fund for tax efficiency." : undefined,
        });
        break;
      case "health":
        items.push({
          value,
          label: valueLabels[value],
          aligned: healthScore >= 7 && data["insurance.healthInsuranceType"] !== "none",
          insight: `Health score: ${healthScore}/10. Health insurance: ${data["insurance.healthInsuranceType"] !== "none" ? "covered" : "uncovered"}.`,
          recommendation: healthScore < 7 ? "Investing in health is the highest-ROI decision. Consider budgeting for fitness, nutrition, and preventive care." : undefined,
        });
        break;
      case "legacy":
        items.push({
          value,
          label: valueLabels[value],
          aligned: hasLifeInsurance && savingsRate >= 15,
          insight: hasLifeInsurance && savingsRate >= 15
            ? "You're building wealth that can outlast you and creating a financial legacy."
            : "Building a legacy requires both protection (insurance) and accumulation (savings).",
          recommendation: !hasLifeInsurance || savingsRate < 15 ? "Ensure life insurance covers your legacy goals and increase wealth accumulation." : undefined,
        });
        break;
      case "community":
        items.push({
          value,
          label: valueLabels[value],
          aligned: giving >= 100 && purposeScore >= 6,
          insight: `Purpose score: ${purposeScore}/10. Community engagement often correlates with giving and volunteer time.`,
          recommendation: giving < 100 ? "Financial giving and community investment go hand in hand. Start small but consistent." : undefined,
        });
        break;
      default:
        items.push({
          value,
          label: valueLabels[value] || value,
          aligned: true,
          insight: "Continue aligning your financial decisions with this value.",
        });
    }
  }

  return items;
}
