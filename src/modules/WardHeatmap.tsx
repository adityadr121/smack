import React, { useState } from 'react';
import { WardBed, Patient, SepsisRiskLevel } from '../types';
import { Bed, MapPin, Search, Filter, AlertTriangle, ShieldCheck, Activity, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WardHeatmapProps {
  beds: WardBed[];
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (module: string) => void;
}

export const WardHeatmap: React.FC<WardHeatmapProps> = ({
  beds,
  onSelectPatient,
  onNavigate,
}) => {
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectBed, setInspectBed] = useState<WardBed | null>(null);

  const wards = ['all', 'ICU-Alpha', 'Step-Down 3B', 'Emergency Bay', 'General Ward 4'];

  const filteredBeds = beds.filter((bed) => {
    if (selectedWard !== 'all' && bed.wardName !== selectedWard) return false;
    if (riskFilter !== 'all') {
      if (!bed.patient) return false;
      if (bed.patient.riskLevel !== riskFilter) return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const pName = bed.patient?.name.toLowerCase() || '';
      const bNum = bed.bedNumber.toLowerCase();
      const mrn = bed.patient?.mrn.toLowerCase() || '';
      return pName.includes(q) || bNum.includes(q) || mrn.includes(q);
    }
    return true;
  });

  const getBedColor = (bed: WardBed) => {
    if (!bed.isOccupied || !bed.patient) return 'bg-slate-900/60 border-slate-800 text-slate-500';
    switch (bed.patient.riskLevel) {
      case 'critical':
        return 'bg-red-950/40 border-red-500/60 text-red-300 neon-glow-red';
      case 'high':
        return 'bg-amber-950/40 border-amber-500/60 text-amber-300 neon-glow-amber';
      case 'moderate':
        return 'bg-yellow-950/30 border-yellow-500/40 text-yellow-300';
      case 'stable':
        return 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300';
      default:
        return 'bg-slate-900 border-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <MapPin className="w-4 h-4" />
              <span>INTERACTIVE HOSPITAL BED HEATMAP</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Spatial Ward Risk Monitoring</h1>
            <p className="text-xs text-slate-400">Real-time Sepsis Risk Mapping Across Inpatient Wards</p>
          </div>

          {/* Ward Selector Tabs */}
          <div className="flex flex-wrap bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {wards.map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWard(w)}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${
                  selectedWard === w ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {w === 'all' ? 'All Hospital Wards' : w}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Bed, Patient Name, or MRN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Risk Filter:</span>
            {['all', 'critical', 'high', 'moderate', 'stable'].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition ${
                  riskFilter === r ? 'bg-slate-800 text-cyan-300 border border-slate-700' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bed Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="text-slate-300 font-semibold">Critical (&gt;80% Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-slate-300 font-semibold">High Risk (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-slate-300 font-semibold">Moderate (30-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-semibold">Stable (&lt;30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="text-slate-400">Unoccupied Bed</span>
          </div>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">Showing {filteredBeds.length} Total Beds</span>
      </div>

      {/* Ward Beds Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredBeds.map((bed) => {
          const isCritical = bed.patient?.riskLevel === 'critical';

          return (
            <motion.div
              key={bed.bedId}
              whileHover={{ scale: 1.03 }}
              className={`glass-panel p-4 rounded-xl border flex flex-col justify-between h-36 cursor-pointer transition relative ${getBedColor(
                bed
              )}`}
              onClick={() => setInspectBed(bed)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold">{bed.bedNumber}</span>
                {isCritical && <AlertTriangle className="w-4 h-4 text-red-400 heart-beat-anim" />}
              </div>

              {bed.isOccupied && bed.patient ? (
                <div className="space-y-1">
                  <div className="font-bold text-xs truncate text-white">{bed.patient.name}</div>
                  <div className="text-[10px] opacity-80">{bed.patient.age}y • {bed.patient.gender}</div>
                  <div className="text-[11px] font-mono font-extrabold flex items-center justify-between pt-1 border-t border-white/10">
                    <span>Sepsis Risk:</span>
                    <span>{bed.patient.currentPrediction.sepsisProbability}%</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center opacity-40">
                  <Bed className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-mono">VACANT BED</span>
                </div>
              )}

              <div className="text-[9px] font-mono opacity-60 text-right">
                {bed.wardName}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Quick-Peek Modal Drawer on Bed Click */}
      <AnimatePresence>
        {inspectBed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setInspectBed(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setInspectBed(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Bed className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{inspectBed.bedNumber} — {inspectBed.wardName}</h3>
                  <span className="text-xs text-slate-400">
                    {inspectBed.isOccupied ? 'Patient Occupied' : 'Vacant Bed'}
                  </span>
                </div>
              </div>

              {inspectBed.patient ? (
                <div className="space-y-4 text-xs pt-2">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-sm font-bold text-white">
                      <span>{inspectBed.patient.name} ({inspectBed.patient.mrn})</span>
                      <span className="text-cyan-400 font-mono">
                        {inspectBed.patient.currentPrediction.sepsisProbability}% Risk
                      </span>
                    </div>
                    <p className="text-slate-300">{inspectBed.patient.primaryDiagnosis}</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                      <div>Attending MD: <strong>{inspectBed.patient.attendingPhysician}</strong></div>
                      <div>Lead Nurse: <strong>{inspectBed.patient.primaryNurse}</strong></div>
                      <div>Deterioration Lead Time: <strong className="text-cyan-400">{inspectBed.patient.currentPrediction.deteriorationWindowHours} hrs</strong></div>
                      <div>qSOFA Score: <strong>{inspectBed.patient.currentPrediction.qSofaScore}/3</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        onSelectPatient(inspectBed.patient!);
                        onNavigate('prediction');
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Open SHAP AI Prediction Screen</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectPatient(inspectBed.patient!);
                        onNavigate('timeline');
                      }}
                      className="px-4 py-3 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      Patient Timeline
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 space-y-3">
                  <p>This bed is currently unassigned.</p>
                  <button
                    onClick={() => onNavigate('nurse_workspace')}
                    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-medium"
                  >
                    Assign Patient from Admission List
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
