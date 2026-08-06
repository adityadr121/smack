import React, { useState } from 'react';
import { Patient, LabResult } from '../types';
import { FlaskConical, AlertTriangle, CheckCircle2, Clock, Plus, TrendingUp, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LaboratoryModuleProps {
  patients: Patient[];
  onAddLabResult?: (patientId: string, lab: LabResult) => void;
}

export const LaboratoryModule: React.FC<LaboratoryModuleProps> = ({ patients, onAddLabResult }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'p-101');
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Lab Entry Form State
  const [wbc, setWbc] = useState(19.8);
  const [lactate, setLactate] = useState(4.2);
  const [procalcitonin, setProcalcitonin] = useState(5.8);
  const [platelets, setPlatelets] = useState(92);
  const [creatinine, setCreatinine] = useState(1.9);
  const [bloodCultureResult, setBloodCultureResult] = useState<'Gram-Negative Rods' | 'Gram-Positive Cocci' | 'Negative' | 'Pending'>('Gram-Negative Rods');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    const newLab: LabResult = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      wbc,
      lactate,
      procalcitonin,
      platelets,
      creatinine,
      bilirubin: 1.2,
      ph: 7.32,
      pao2Fio2: 260,
      bloodCulturePending: bloodCultureResult === 'Pending',
      bloodCultureResult
    };

    if (onAddLabResult) {
      onAddLabResult(selectedPatientId, newLab);
    }
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  // Format lab history for charts
  const labChartData = selectedPatient.labHistory.map((l) => ({
    time: l.timestamp,
    lactate: l.lactate,
    wbc: l.wbc,
    pct: l.procalcitonin,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <FlaskConical className="w-4 h-4" />
            <span>CENTRAL DIAGNOSTIC LABORATORY WORKSTATION</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Clinical Chemistry & Microbiology Panel</h1>
          <p className="text-xs text-slate-400">Stat Lactate, Procalcitonin, WBC, & Blood Culture Tracking</p>
        </div>

        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-cyan-300 font-bold focus:outline-none"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.ward} — {p.bedNumber}: {p.name} ({p.mrn})
            </option>
          ))}
        </select>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stat Lab Entry Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Publish Stat Lab Results</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
              LIS Sync Active
            </span>
          </div>

          <form onSubmit={handleAddLab} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-mono block mb-1">Serum Lactate (mmol/L)</label>
              <input
                type="number"
                step="0.1"
                value={lactate}
                onChange={(e) => setLactate(Number(e.target.value))}
                className={`w-full bg-slate-900 border rounded-xl p-2.5 font-mono text-sm focus:outline-none ${
                  lactate > 2.0 ? 'border-red-500 text-red-400 font-bold' : 'border-slate-800 text-cyan-300'
                }`}
                required
              />
              {lactate > 2.0 && <span className="text-[10px] text-red-400 block mt-1">⚠️ High Risk Threshold (&gt;2.0 mmol/L)</span>}
            </div>

            <div>
              <label className="text-slate-400 font-mono block mb-1">WBC Count (×10⁹/L)</label>
              <input
                type="number"
                step="0.1"
                value={wbc}
                onChange={(e) => setWbc(Number(e.target.value))}
                className={`w-full bg-slate-900 border rounded-xl p-2.5 font-mono text-sm focus:outline-none ${
                  wbc > 11.0 || wbc < 4.5 ? 'border-red-500 text-red-400 font-bold' : 'border-slate-800 text-cyan-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="text-slate-400 font-mono block mb-1">Procalcitonin (ng/mL)</label>
              <input
                type="number"
                step="0.1"
                value={procalcitonin}
                onChange={(e) => setProcalcitonin(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 font-mono text-sm text-cyan-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 font-mono block mb-1">Blood Culture Status</label>
              <select
                value={bloodCultureResult}
                onChange={(e) => setBloodCultureResult(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 font-mono text-sm text-cyan-300 focus:outline-none"
              >
                <option value="Pending">Pending (Incubation Active)</option>
                <option value="Gram-Negative Rods">Gram-Negative Rods (Critical)</option>
                <option value="Gram-Positive Cocci">Gram-Positive Cocci (Critical)</option>
                <option value="Negative">No Growth at 48 Hours (Negative)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Publish Lab Result to Patient EHR</span>
            </button>

            {isSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Lab results published & AI feature vectors updated.</span>
              </div>
            )}
          </form>
        </div>

        {/* Right 2 Columns: Chemistry Trends & Abnormal Value Badges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Lab History Table */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span>Longitudinal Laboratory Panel ({selectedPatient.name})</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Lactate</th>
                    <th className="pb-2">WBC</th>
                    <th className="pb-2">Procalcitonin</th>
                    <th className="pb-2">Platelets</th>
                    <th className="pb-2">Blood Culture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {selectedPatient.labHistory.map((lab) => (
                    <tr key={lab.id} className="hover:bg-slate-900/40 font-mono">
                      <td className="py-3 text-slate-300">{lab.timestamp}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          lab.lactate > 2.0 ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'text-emerald-400'
                        }`}>
                          {lab.lactate} mmol/L
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded ${
                          lab.wbc > 11.0 ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
                        }`}>
                          {lab.wbc} ×10⁹/L
                        </span>
                      </td>
                      <td className="py-3 text-cyan-300">{lab.procalcitonin} ng/mL</td>
                      <td className="py-3 text-slate-300">{lab.platelets} ×10⁹/L</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lab.bloodCultureResult === 'Gram-Negative Rods'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {lab.bloodCultureResult || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chemistry Trend Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Serum Lactate & WBC Kinetics</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={labChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLactate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#090D16', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="lactate" stroke="#EF4444" fillOpacity={1} fill="url(#colorLactate)" name="Lactate (mmol/L)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
