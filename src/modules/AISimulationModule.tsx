import React, { useState } from 'react';
import { Patient } from '../types';
import { Sliders, BrainCircuit, AlertTriangle, RefreshCcw, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AISimulationModuleProps {
  patients: Patient[];
}

export const AISimulationModule: React.FC<AISimulationModuleProps> = ({ patients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'p-101');
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Simulation Sliders State
  const [simHr, setSimHr] = useState<number>(selectedPatient?.vitalHistory?.[selectedPatient?.vitalHistory?.length - 1]?.heartRate || 124);
  const [simSysBp, setSimSysBp] = useState<number>(selectedPatient?.vitalHistory?.[selectedPatient?.vitalHistory?.length - 1]?.sysBP || 90);
  const [simRespRate, setSimRespRate] = useState<number>(selectedPatient?.vitalHistory?.[selectedPatient?.vitalHistory?.length - 1]?.respRate || 26);
  const [simTemp, setSimTemp] = useState<number>(selectedPatient?.vitalHistory?.[selectedPatient?.vitalHistory?.length - 1]?.temperature || 38.9);
  const [simSpo2, setSimSpo2] = useState<number>(selectedPatient?.vitalHistory?.[selectedPatient?.vitalHistory?.length - 1]?.spo2 || 92);
  const [simLactate, setSimLactate] = useState<number>(selectedPatient?.labHistory?.[selectedPatient?.labHistory?.length - 1]?.lactate || 4.2);
  const [simWbc, setSimWbc] = useState<number>(selectedPatient?.labHistory?.[selectedPatient?.labHistory?.length - 1]?.wbc || 19.8);

  // Baseline Risk Calculation
  const baselineRisk = selectedPatient.currentPrediction.sepsisProbability;

  // Real-time Simulated Risk Calculation Engine
  const simulatedRisk = Math.min(
    99.8,
    Math.max(
      3.5,
      Math.round(
        (simHr > 100 ? (simHr - 100) * 0.45 : 0) +
        (simSysBp < 100 ? (100 - simSysBp) * 0.8 : 0) +
        (simRespRate >= 22 ? (simRespRate - 20) * 1.8 : 0) +
        (simTemp > 38.0 ? (simTemp - 37.0) * 8.5 : 0) +
        (simLactate > 2.0 ? simLactate * 11.2 : 0) +
        (simWbc > 11.0 ? (simWbc - 11.0) * 1.4 : 0)
      )
    )
  );

  const riskDelta = Number((simulatedRisk - baselineRisk).toFixed(1));
  const simQSofa = (simSysBp <= 100 ? 1 : 0) + (simRespRate >= 22 ? 1 : 0) + 1;

  const handleResetSliders = () => {
    const lastV = selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1];
    const lastL = selectedPatient.labHistory[selectedPatient.labHistory.length - 1];
    if (lastV) {
      setSimHr(lastV.heartRate);
      setSimSysBp(lastV.sysBP);
      setSimRespRate(lastV.respRate);
      setSimTemp(lastV.temperature);
      setSimSpo2(lastV.spo2);
    }
    if (lastL) {
      setSimLactate(lastL.lactate);
      setSimWbc(lastL.wbc);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sliders className="w-4 h-4" />
            <span>INTERACTIVE CLINICAL INTERVENTION SIMULATION SANDBOX</span>
          </div>
          <h1 className="text-2xl font-bold text-white">What-If Risk Impact Simulator</h1>
          <p className="text-xs text-slate-400">
            Simulate Fluid Resuscitation, Antibiotics, & Oxygen Shifts on Predicted Deterioration
          </p>
        </div>

        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-cyan-300 font-bold focus:outline-none"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.ward} — {p.bedNumber}: {p.name} ({p.currentPrediction.sepsisProbability}% Baseline)
            </option>
          ))}
        </select>
      </div>

      {/* Prominent Clinical Simulation Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong>Decision-Support Simulation Notice:</strong> This sandbox allows clinicians to test hypothetical parameter changes (e.g. MAP response after IV fluids). It simulates mathematical risk trajectory and does NOT guarantee clinical patient outcomes.
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Interactive Parameter Sliders */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Modify Clinical Parameters</span>
            </h3>
            <button
              onClick={handleResetSliders}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset to EHR Baseline</span>
            </button>
          </div>

          <div className="space-y-5 text-xs">
            {/* Slider 1: Systolic BP */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between font-bold text-white">
                <span>Systolic Blood Pressure (mmHg)</span>
                <span className={`font-mono ${simSysBp < 90 ? 'text-red-400 font-extrabold' : 'text-cyan-300'}`}>
                  {simSysBp} mmHg (MAP ~{Math.round(simSysBp * 0.7)} mmHg)
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                value={simSysBp}
                onChange={(e) => setSimSysBp(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50 mmHg (Septic Shock)</span>
                <span>90 mmHg (Target Threshold)</span>
                <span>180 mmHg</span>
              </div>
            </div>

            {/* Slider 2: Serum Lactate */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between font-bold text-white">
                <span>Serum Lactate (mmol/L)</span>
                <span className={`font-mono ${simLactate > 2.0 ? 'text-red-400 font-extrabold' : 'text-emerald-400'}`}>
                  {simLactate} mmol/L
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.1"
                value={simLactate}
                onChange={(e) => setSimLactate(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>&lt;2.0 (Normal Perfusion)</span>
                <span>4.0 (Lactic Acidosis)</span>
                <span>10.0 (Severe Shock)</span>
              </div>
            </div>

            {/* Slider 3: Heart Rate */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between font-bold text-white">
                <span>Heart Rate (bpm)</span>
                <span className="font-mono text-cyan-300">{simHr} bpm</span>
              </div>
              <input
                type="range"
                min="40"
                max="170"
                value={simHr}
                onChange={(e) => setSimHr(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Slider 4: Respiration Rate */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between font-bold text-white">
                <span>Respiration Rate (/min)</span>
                <span className="font-mono text-cyan-300">{simRespRate} /min</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={simRespRate}
                onChange={(e) => setSimRespRate(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Slider 5: Body Temperature */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between font-bold text-white">
                <span>Core Temperature (°C)</span>
                <span className="font-mono text-cyan-300">{simTemp} °C</span>
              </div>
              <input
                type="range"
                min="35.0"
                max="41.0"
                step="0.1"
                value={simTemp}
                onChange={(e) => setSimTemp(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Risk Comparison Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-slate-950/80 space-y-6 text-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Simulated Output Comparison</h3>

            {/* Baseline vs Simulated Risk Comparison */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">EHR Baseline Risk</span>
                <span className="text-2xl font-black text-slate-300 font-mono">{baselineRisk}%</span>
              </div>

              <div className={`p-4 rounded-xl border space-y-1 ${
                simulatedRisk > 70 ? 'bg-red-950/30 border-red-500/50 neon-glow-red' : 'bg-emerald-950/30 border-emerald-500/50'
              }`}>
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Simulated Risk</span>
                <span className={`text-2xl font-black font-mono ${simulatedRisk > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {simulatedRisk}%
                </span>
              </div>
            </div>

            {/* Risk Delta Indicator */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Risk Trajectory Delta:</span>
              <span className={`font-bold ${riskDelta > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {riskDelta > 0 ? `+${riskDelta}% (Worsening)` : `${riskDelta}% (Improving)`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-left space-y-2">
              <span className="font-bold text-white block">Simulated Clinical Impact:</span>
              <p className="text-[11px] leading-relaxed">
                {simSysBp >= 95 && simLactate <= 2.0
                  ? '✓ MAP normalization (≥65 mmHg) & lactate clearance (<2.0 mmol/L) effectively drops sepsis probability into stable range.'
                  : '⚠️ Refractory hypotension or elevated lactate keeps patient at elevated risk tier requiring vasopressors & broad spectrum coverage.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
