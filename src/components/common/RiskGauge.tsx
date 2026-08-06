import React from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  probability: number; // 0 to 100
  riskLevel: 'stable' | 'moderate' | 'high' | 'critical';
  confidenceScore?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  probability,
  riskLevel,
  confidenceScore = 94.2,
}) => {
  const radius = 70;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  const getColor = () => {
    switch (riskLevel) {
      case 'critical':
        return '#EF4444'; // Red
      case 'high':
        return '#F59E0B'; // Amber
      case 'moderate':
        return '#EAB308'; // Yellow
      case 'stable':
        return '#10B981'; // Emerald
      default:
        return '#38BDF8';
    }
  };

  const strokeColor = getColor();

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <svg className="w-48 h-28" viewBox="0 0 160 90">
        {/* Background Arc */}
        <path
          d="M 10 80 A 70 70 0 0 1 150 80"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Animated Risk Arc */}
        <motion.path
          d="M 10 80 A 70 70 0 0 1 150 80"
          fill="none"
          stroke={strokeColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0px 0px 8px ${strokeColor})` }}
        />
      </svg>

      {/* Central Number Display */}
      <div className="absolute top-12 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-black font-mono tracking-tight"
          style={{ color: strokeColor }}
        >
          {probability}%
        </motion.div>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block -mt-1">
          Sepsis Risk
        </span>
      </div>

      <div className="mt-1 text-center">
        <span
          className="text-xs font-extrabold uppercase px-3 py-1 rounded-full border shadow-sm"
          style={{
            backgroundColor: `${strokeColor}20`,
            borderColor: `${strokeColor}50`,
            color: strokeColor,
          }}
        >
          {riskLevel} RISK TIER
        </span>
        <span className="text-[10px] font-mono text-slate-400 block mt-1">
          Clinical Confidence: {confidenceScore}%
        </span>
      </div>
    </div>
  );
};
