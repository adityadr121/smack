import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { RiskGauge } from '../components/common/RiskGauge';
import { 
  BrainCircuit, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  FlaskConical, 
  CheckCircle2, 
  FileSpreadsheet,
  Stethoscope,
  UserCheck,
  Zap,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

interface AIPredictionScreenProps {
  patient: Patient;
  onNavigate: (module: string) => void;
}

export const AIPredictionScreen: React.FC<AIPredictionScreenProps> = ({ patient, onNavigate }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(1);

  const prediction = patient?.currentPrediction || {
    patientId: patient?.id || 'p-101',
    sepsisProbability: 87.4,
    riskLevel: 'critical',
    confidenceScore: 94.2,
    deteriorationWindowHours: 4.5,
    predictedTime: '2026-08-03 21:00',
    qSofaScore: 3,
    sofaScore: 9,
    missingDataPenalty: 2.1,
    shapFeatures: [],
    nurseActionItems: ['Draw blood cultures × 2 sets'],
    doctorActionItems: ['Order broad-spectrum IV antibiotics'],
    recommendedObservations: ['Continuous invasive blood pressure']
  };
  const isCritical = prediction?.riskLevel === 'critical';

  // Multi-step AI scanning animation pipeline
  useEffect(() => {
    setIsScanning(true);
    setScanStep(1);

    const t1 = setTimeout(() => setScanStep(2), 500);
    const t2 = setTimeout(() => setScanStep(3), 1000);
    const t3 = setTimeout(() => setScanStep(4), 1500);
    const t4 = setTimeout(() => setIsScanning(false), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [patient.id]);

  const shapData = prediction.shapFeatures.map((f) => ({
    name: f.featureName,
    impact: Math.round(f.impactScore * 100),
    value: f.value,
    description: f.clinicalDescription,
  }));

  const vitalChartData = patient.vitalHistory.map((v) => ({
    time: v.timestamp,
    hr: v.heartRate,
    sysBP: v.sysBP,
    temp: v.temperature,
    spo2: v.spo2,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <BrainCircuit className="w-4 h-4" />
            <span>EXPLAINABLE AI CLINICAL SEPSIS PREDICTION ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {patient.name} — Risk Diagnosis & SHAP Feature Attribution
          </h1>
          <p className="text-xs text-slate-400">
            MRN: {patient.mrn} • Ward: {patient.ward} ({patient.bedNumber}) • Model: XGBoost + SHAP v3.2
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsScanning(true);
              setScanStep(1);
              setTimeout(() => setScanStep(2), 500);
              setTimeout(() => setScanStep(3), 1000);
              setTimeout(() => setScanStep(4), 1500);
              setTimeout(() => setIsScanning(false), 2000);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            aria-label="Re-run AI Telemetry Scan"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isScanning ? 'Scanning Telemetry...' : 'Re-Run AI Model Scan'}</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            aria-label="Generate PDF SHAP Report"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Generate PDF SHAP Report</span>
          </button>
        </div>
      </div>

      {/* Multi-Step AI Scan Progress Banner */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-slate-950/90 scan-beam space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
              <span className="flex items-center gap-2 font-bold uppercase">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                AI Model Scanning Pipeline Active
              </span>
              <span>Step {scanStep} of 4</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className={`p-2 rounded-lg border ${scanStep >= 1 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                1. Intake Telemetry
              </div>
              <div className={`p-2 rounded-lg border ${scanStep >= 2 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                2. Lab Chemistry
              </div>
              <div className={`p-2 rounded-lg border ${scanStep >= 3 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                3. SHAP Feature Matrix
              </div>
              <div className={`p-2 rounded-lg border ${scanStep >= 4 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                4. Protocol Guidance
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top KPI Cards with Radial Risk Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Radial Risk Gauge */}
        <div className={`glass-panel rounded-2xl border flex flex-col items-center justify-center ${
          isCritical ? 'border-red-500/50 bg-red-950/20 neon-glow-red' : 'border-amber-500/40 bg-amber-950/20'
        }`}>
          <RiskGauge
            probability={prediction.sepsisProbability}
            riskLevel={prediction.riskLevel}
            confidenceScore={prediction.confidenceScore}
          />
        </div>

        {/* Deterioration Lead Time Window */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Predicted Deterioration Window</span>
          <div className="my-2 flex items-center gap-2 text-cyan-400 font-mono">
            <Clock className="w-6 h-6" />
            <span className="text-3xl font-extrabold">{prediction.deteriorationWindowHours} Hours</span>
          </div>
          <span className="text-[11px] text-slate-400">Forecasted onset around {prediction.predictedTime}</span>
        </div>

        {/* Model Confidence & Data Penalty */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Model Confidence & Penalty</span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-white font-mono">{prediction.confidenceScore}%</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            Missing Data Penalty: -{prediction.missingDataPenalty}%
          </div>
        </div>

        {/* qSOFA & SOFA Organ Failure Score */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Organ Failure Scores</span>
          <div className="my-2 font-mono">
            <span className="text-2xl font-bold text-white">qSOFA: {prediction.qSofaScore}/3</span>
            <div className="text-xs text-cyan-400">SOFA Score: {prediction.sofaScore} / 24</div>
          </div>
          <span className="text-[11px] text-slate-400">Multiple Organ Dysfunction Evaluated</span>
        </div>
      </div>

      {/* Main Section 1: SHAP Feature Importance Waterfall Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              <span>SHAP Explainable Feature Attribution (Biomarker Impact)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Quantifying exact contribution percentage of each clinical variable to predicted sepsis risk.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
            Shapley Value Attribution Active
          </span>
        </div>

        {/* Horizontal Bar Chart for SHAP */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={shapData} margin={{ top: 10, right: 30, left: 120, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} unit="%" />
              <YAxis dataKey="name" type="category" stroke="#E2E8F0" fontSize={12} width={140} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="impact" radius={[0, 8, 8, 0]}>
                {shapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impact > 20 ? '#EF4444' : '#F59E0B'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SHAP Explanations Breakdown Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {prediction.shapFeatures.map((feat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-white">
                <span>{feat.featureName}</span>
                <span className="text-red-400 font-mono">+{Math.round(feat.impactScore * 100)}%</span>
              </div>
              <div className="text-[11px] text-cyan-400 font-mono">Measured: {feat.value} (Normal {feat.normalRange})</div>
              <p className="text-[10px] text-slate-400 leading-tight">{feat.clinicalDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Section 2: Longitudinal Telemetry Trends */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>Longitudinal Vital Sign Telemetry Trends</span>
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vitalChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <Tooltip contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="hr" stroke="#EF4444" fillOpacity={1} fill="url(#colorHr)" name="Heart Rate (bpm)" />
              <Area type="monotone" dataKey="sysBP" stroke="#38BDF8" fillOpacity={1} fill="url(#colorBp)" name="Systolic BP (mmHg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Section 3: Actionable Clinical Protocol Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nurse Immediate Actions */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-slate-950/80 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <Stethoscope className="w-5 h-5" />
            <span>Nurse Bedside Immediate Protocol</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {prediction.nurseActionItems.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 font-medium">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Care Orders */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-slate-950/80 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <UserCheck className="w-5 h-5" />
            <span>Doctor Care Orders & Interventions</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {prediction.doctorActionItems.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 font-medium">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
