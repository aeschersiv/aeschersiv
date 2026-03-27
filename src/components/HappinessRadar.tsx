"use client";

import { motion } from "framer-motion";

interface Props {
  data: {
    overallScore: number;
    financialPeace: number;
    relationshipQuality: number;
    careerFulfillment: number;
    healthWellbeing: number;
    purposeMeaning: number;
    freedomAutonomy: number;
  };
}

const dimensions = [
  { key: "financialPeace", label: "Financial Peace", angle: 0 },
  { key: "relationshipQuality", label: "Relationships", angle: 51.4 },
  { key: "careerFulfillment", label: "Career", angle: 102.9 },
  { key: "healthWellbeing", label: "Health", angle: 154.3 },
  { key: "purposeMeaning", label: "Purpose", angle: 205.7 },
  { key: "freedomAutonomy", label: "Freedom", angle: 257.1 },
  { key: "overallScore", label: "Overall", angle: 308.6 },
];

export default function HappinessRadar({ data }: Props) {
  const cx = 150;
  const cy = 150;
  const maxR = 110;

  const getPoint = (angle: number, value: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const r = (value / 10) * maxR;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const dataPoints = dimensions.map((d) => {
    const value = Number(data[d.key as keyof typeof data]) || 0;
    return getPoint(d.angle, value);
  });

  const pathData = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="font-semibold text-white mb-4">Happiness Profile</h3>
      <div className="flex justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Grid rings */}
          {[2, 4, 6, 8, 10].map((level) => (
            <circle
              key={level}
              cx={cx}
              cy={cy}
              r={(level / 10) * maxR}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {dimensions.map((d) => {
            const end = getPoint(d.angle, 10);
            return (
              <line
                key={d.key}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <motion.path
            d={pathData}
            fill="rgba(99, 102, 241, 0.15)"
            stroke="rgba(99, 102, 241, 0.6)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Data points */}
          {dataPoints.map((p, i) => (
            <motion.circle
              key={dimensions[i].key}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#6366f1"
              stroke="white"
              strokeWidth="1.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            />
          ))}

          {/* Labels */}
          {dimensions.map((d) => {
            const labelPoint = getPoint(d.angle, 12.5);
            const value = Number(data[d.key as keyof typeof data]) || 0;
            return (
              <g key={`label-${d.key}`}>
                <text
                  x={labelPoint.x}
                  y={labelPoint.y - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400"
                >
                  {d.label}
                </text>
                <text
                  x={labelPoint.x}
                  y={labelPoint.y + 8}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-white"
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Average score */}
      <div className="text-center mt-4">
        <div className="text-3xl font-bold gradient-text">
          {(Object.values(data).reduce((sum, v) => sum + Number(v), 0) / Object.values(data).length).toFixed(1)}
        </div>
        <div className="text-xs text-slate-500 mt-1">Average Happiness Score</div>
      </div>
    </motion.div>
  );
}
