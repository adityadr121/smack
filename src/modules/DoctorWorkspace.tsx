import React, { useState } from 'react';
import { Patient } from '../types';
import { 
  UserCheck, 
  BrainCircuit, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Clock, 
  Activity, 
  TrendingUp, 
  FileText, 
  ChevronRight,
  Send,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DoctorWorkspaceProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (module: string) => void;
}

export const DoctorWorkspace: React.FC<DoctorWorkspaceProps> = ({
  patients,
  onSelectPatient,
  onNavigate,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'p-101');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const highRiskPatients = patients.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high');

  const handleApproveOrders = () => {
    setOrderSubmitted(true);
    setTimeout(() => setOrderSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <UserCheck className="w-4 h-4" />
            <span>ATTENDING PHYSICIAN DECISION SUPPORT SYSTEM</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Doctor Clinical Intervention Workspace</h1>
          <p className="text-xs text-slate-400">Surviving Sepsis Campaign (SSC) Protocol • SHAP Feature Attribution • Stat Orders</p>
        </div>

        <button
          onClick={() => {
            onSelectPatient(selectedPatient);
            onNavigate('prediction');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Launch Full SHAP AI Prediction Screen</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority Patient Selector */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Priority Sepsis Patients ({highRiskPatients.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Sorted by Lead-Time</span>
          </div>

          <div className="space-y-3">
            {patients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              const isCritical = p.riskLevel === 'critical';

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md'
                      : isCritical
                      ? 'bg-red-950/20 border-red-500/40 text-slate-300 hover:border-red-500/60'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">{p.name}</span>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                      isCritical ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {p.currentPrediction.sepsisProbability}% RISK
                    </span>
                  </div>
                  <div className="text-[11px] opacity-80">{p.ward} • {p.bedNumber}</div>
                  <div className="text-[10px] text-cyan-400 font-mono pt-1">
                    Predicted Deterioration: {p.currentPrediction.deteriorationWindowHours} hrs
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Explainable AI & Intervention Order Set */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Overview Header */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedPatient.name}</h2>
                <p className="text-xs text-slate-400">
                  MRN: {selectedPatient.mrn} • Age: {selectedPatient.age}y • Primary Nurse: {selectedPatient.primaryNurse}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">qSOFA / SOFA Score</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">
                  qSOFA: {selectedPatient.currentPrediction.qSofaScore}/3 | SOFA: {selectedPatient.currentPrediction.sofaScore}/24
                </span>
              </div>
            </div>

            {/* AI Top SHAP Feature Contributors */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                Top SHAP Biomarker Drivers for Early Risk Detection:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedPatient.currentPrediction.shapFeatures.slice(0, 4).map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{feat.featureName}</span>
                      <span className="text-red-400 font-mono">+{Math.round(feat.impactScore * 100)}%</span>
                    </div>
                    <div className="text-[11px] text-cyan-300 font-mono">Value: {feat.value}</div>
                    <p className="text-[10px] text-slate-400">{feat.clinicalDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Surviving Sepsis 3-Hour Bundle Quick Order Set */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-slate-950/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Surviving Sepsis 3-Hour Care Bundle Orders
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                SSC Guideline Compliant
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {selectedPatient.currentPrediction.doctorActionItems.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-cyan-500" />
                  <span className="text-slate-200 font-medium">{action}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleApproveOrders}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Sign & Authorize Clinical Orders Immediately</span>
              </button>
            </div>

            {orderSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                ✓ Orders signed and transmitted to Pharmacy, Central Lab, and Nursing EHR Station.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
