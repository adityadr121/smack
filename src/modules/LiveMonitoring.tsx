import React, { useState, useEffect } from 'react';
import { Patient, AlertItem } from '../types';
import { AnimatedECG } from '../components/common/AnimatedECG';
import { Radio, Activity, Bell, RefreshCw, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveMonitoringProps {
  patients: Patient[];
  alerts: AlertItem[];
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (module: string) => void;
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({
  patients,
  alerts,
  onSelectPatient,
  onNavigate,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'p-101');
  const [liveLog, setLiveLog] = useState<string[]>([
    '20:17:42 — Telemetry Sync OK for ICU Bed A-04 (Eleanor Vance)',
    '20:17:28 — Pulse Oximetry waveform stabilized (91% SpO2)',
    '20:17:10 — Arterial blood pressure telemetry updated: 84/50 mmHg',
    '20:16:45 — Central lab uploaded stat serum lactate: 4.2 mmol/L'
  ]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Periodic live pulse simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString();
      const newMsg = `${timeStr} — Heart rate pulse sample recorded: ${selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1]?.heartRate || 118} bpm (Normal Sinus Rhythm)`;
      setLiveLog((prev) => [newMsg, ...prev.slice(0, 8)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedPatient]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>REAL-TIME PATIENT TELEMETRY MONITORING</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Live Patient Waveform & Notification Stream</h1>
          <p className="text-xs text-slate-400">Continuous 100Hz Telemetry Feed • Smart Bedside Alerts</p>
        </div>

        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-cyan-300 font-bold focus:outline-none"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.ward} — {p.bedNumber}: {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Waveform Display */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-white">Continuous ECG Lead II Telemetry</h3>
              <p className="text-xs text-slate-400">{selectedPatient.name} ({selectedPatient.mrn})</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
            HR: {selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1]?.heartRate || 118} BPM
          </span>
        </div>

        <AnimatedECG
          bpm={selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1]?.heartRate || 118}
          height={140}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Blood Pressure</span>
            <span className="text-sm font-bold text-white font-mono">
              {selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1]?.sysBP || 84} / {selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1]?.diaBP || 50} mmHg
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Body Temperature</span>
            <span className="text-sm font-bold text-red-400 font-mono">
              {selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1]?.temperature || 39.1} °C
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Pulse Oximetry (SpO2)</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">
              {selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1]?.spo2 || 91} %
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-mono text-[10px]">Respiration Rate</span>
            <span className="text-sm font-bold text-amber-300 font-mono">
              {selectedPatient.vitalHistory[selectedPatient.vitalHistory.length - 1]?.respRate || 28} /min
            </span>
          </div>
        </div>
      </div>

      {/* Live Activity Stream & Log */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Real-time Telemetry Data Stream Log</span>
        </h3>

        <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
          {liveLog.map((logItem, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-cyan-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span>{logItem}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
