import React, { useState, useEffect } from 'react';
import { Patient, AlertItem, UserRole } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Bed, 
  TrendingUp, 
  Clock, 
  BrainCircuit, 
  ShieldAlert, 
  ArrowUpRight, 
  RefreshCw,
  Search,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  Flame,
  BarChart2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CommandCenterProps {
  patients: Patient[];
  alerts: AlertItem[];
  currentRole: UserRole;
  onNavigate: (module: string) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  patients,
  alerts,
  currentRole,
  onNavigate,
  onSelectPatient,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'high'>('all');

  const criticalCount = patients.filter((p) => p.riskLevel === 'critical').length;
  const highCount = patients.filter((p) => p.riskLevel === 'high').length;
  const moderateCount = patients.filter((p) => p.riskLevel === 'moderate').length;
  const stableCount = patients.filter((p) => p.riskLevel === 'stable').length;

  // Auto scanning trigger simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredPatients = patients.filter((p) => {
    if (activeTab === 'critical') return p.riskLevel === 'critical';
    if (activeTab === 'high') return p.riskLevel === 'high' || p.riskLevel === 'critical';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Mission Control Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                HOSPITAL MISSION CONTROL CENTER • REAL-TIME AI PREDICTION ENGINE
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              CureLink Command Center
            </h1>
            <p className="text-xs text-slate-400">
              Monitoring 4 Ward Zones • 16 Active Telemetry Beds • AI Lead-time Window: 6-12h
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsScanning(true);
                setTimeout(() => setIsScanning(false), 1500);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isScanning ? 'Scanning EHR Vitals...' : 'Force AI Re-scan'}</span>
            </button>

            <button
              onClick={() => onNavigate('ward_heatmap')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <Bed className="w-4 h-4" />
              <span>Launch Ward Heatmap</span>
            </button>
          </div>
        </div>

        {/* AI Scan Beam Effect */}
        {isScanning && <div className="scan-beam" />}
      </div>

      {/* Hospital Metrics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Total Inpatients</span>
            <span className="text-2xl font-black text-white font-mono">{patients.length}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">100% Vitals Tracked</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-4 rounded-xl border border-red-500/30 bg-red-950/20 flex items-center justify-between neon-glow-red">
          <div>
            <span className="text-[11px] text-red-300 font-medium block">Critical Sepsis Alerts</span>
            <span className="text-2xl font-black text-red-400 font-mono">{criticalCount}</span>
            <span className="text-[10px] text-red-300 block mt-0.5">Immediate Protocol Active</span>
          </div>
          <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
            <AlertTriangle className="w-6 h-6 heart-beat-anim" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-300 font-medium block">High-Risk Patients</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{highCount}</span>
            <span className="text-[10px] text-amber-300 block mt-0.5">Deterioration Window &lt; 8h</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">ICU Bed Occupancy</span>
            <span className="text-2xl font-black text-white font-mono">85%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">3 Beds Available</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 5 */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Hospital Health Index</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">94 / 100</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Optimal Response Time</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live AI Sepsis Deterioration Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live AI Predictions & Risk Priority List
                </h3>
              </div>

              {/* Filter Pills */}
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-md transition ${activeTab === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                >
                  All ({patients.length})
                </button>
                <button
                  onClick={() => setActiveTab('critical')}
                  className={`px-3 py-1 rounded-md transition ${activeTab === 'critical' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-slate-400'}`}
                >
                  Critical ({criticalCount})
                </button>
                <button
                  onClick={() => setActiveTab('high')}
                  className={`px-3 py-1 rounded-md transition ${activeTab === 'high' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'}`}
                >
                  High Risk ({highCount})
                </button>
              </div>
            </div>

            {/* Patient Risk Cards Stack */}
            <div className="space-y-3">
              {filteredPatients.map((patient) => {
                const isCritical = patient.riskLevel === 'critical';
                const isHigh = patient.riskLevel === 'high';
                const isModerate = patient.riskLevel === 'moderate';

                return (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass-panel p-4 rounded-xl border transition cursor-pointer hover:border-cyan-500/50 ${
                      isCritical
                        ? 'border-red-500/40 bg-red-950/20'
                        : isHigh
                        ? 'border-amber-500/30 bg-amber-950/10'
                        : 'border-slate-800 bg-slate-900/50'
                    }`}
                    onClick={() => {
                      onSelectPatient(patient);
                      onNavigate('prediction');
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{patient.name}</span>
                          <span className="text-xs font-mono text-slate-400">({patient.mrn})</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                            {patient.ward} • {patient.bedNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{patient.primaryDiagnosis}</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span>Attending: <strong>{patient.attendingPhysician}</strong></span>
                          <span>Nurse: <strong>{patient.primaryNurse}</strong></span>
                        </div>
                      </div>

                      {/* Right AI Stats */}
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block font-mono">Deterioration Window</span>
                          <span className="text-xs font-bold text-cyan-400 font-mono flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" />
                            {patient.currentPrediction.deteriorationWindowHours} hrs
                          </span>
                        </div>

                        <div className="min-w-[100px]">
                          <span className="text-[10px] text-slate-400 uppercase block font-mono">Sepsis Probability</span>
                          <div className={`text-xl font-black font-mono ${
                            isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : isModerate ? 'text-yellow-400' : 'text-emerald-400'
                          }`}>
                            {patient.currentPrediction.sepsisProbability}%
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Hospital Operations & Emergency Escalation Queue */}
        <div className="space-y-6">
          {/* Active Smart Alerts Queue */}
          <div className="glass-panel p-5 rounded-2xl border border-red-500/30 bg-slate-950/80">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Active Smart Escalation Queue</span>
              </div>
              <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30">
                {alerts.filter(a => a.status === 'active').length} PENDING
              </span>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-400">{alert.patientName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-tight">{alert.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Escalated to: <strong className="text-cyan-300">{alert.escalationLevel}</strong></span>
                    <button
                      onClick={() => onNavigate('smart_alerts')}
                      className="text-cyan-400 underline font-semibold"
                    >
                      Acknowledge &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Staff Workload & Availability */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <span>Shift Staff Availability</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900">
                <span className="text-slate-300">RN Marcus Vance (ICU)</span>
                <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Active (4 Patients)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900">
                <span className="text-slate-300">Dr. Sarah Jenkins, MD</span>
                <span className="text-cyan-400 font-mono text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  On Call (ICU Outreach)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900">
                <span className="text-slate-300">RN Elena Rostova (Step-Down)</span>
                <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Active (5 Patients)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
