import React, { useState, useEffect } from 'react';
import { Patient, VitalSignRecord } from '../../types';
import { X, Clock, Stethoscope, CheckCircle, AlertTriangle, Sparkles, Activity, ShieldAlert, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TwoHourVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onAddVitalRecord: (patientId: string, vitals: VitalSignRecord) => void;
}

export const TwoHourVitalsModal: React.FC<TwoHourVitalsModalProps> = ({
  isOpen,
  onClose,
  patient,
  onAddVitalRecord,
}) => {
  const lastVital = patient?.vitalHistory?.[patient?.vitalHistory?.length - 1];

  const [hr, setHr] = useState<number>(lastVital?.heartRate || 112);
  const [sysBp, setSysBp] = useState<number>(lastVital?.sysBP || 94);
  const [diaBp, setDiaBp] = useState<number>(lastVital?.diaBP || 60);
  const [respRate, setRespRate] = useState<number>(lastVital?.respRate || 24);
  const [temp, setTemp] = useState<number>(lastVital?.temperature || 38.8);
  const [spo2, setSpo2] = useState<number>(lastVital?.spo2 || 93);
  const [avpu, setAvpu] = useState<'Alert' | 'Voice' | 'Pain' | 'Unresponsive'>(lastVital?.avpu || 'Voice');
  const [recordedBy, setRecordedBy] = useState('RN Marcus Vance');
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state when patient changes
  useEffect(() => {
    if (patient) {
      const v = patient.vitalHistory?.[patient.vitalHistory.length - 1];
      setHr(v?.heartRate || 112);
      setSysBp(v?.sysBP || 94);
      setDiaBp(v?.diaBP || 60);
      setRespRate(v?.respRate || 24);
      setTemp(v?.temperature || 38.8);
      setSpo2(v?.spo2 || 93);
      setAvpu(v?.avpu || 'Voice');
    }
  }, [patient?.id]);

  if (!isOpen || !patient) return null;

  // Live qSOFA Score
  const qSofa = (sysBp <= 100 ? 1 : 0) + (respRate >= 22 ? 1 : 0) + (avpu !== 'Alert' ? 1 : 0);

  // Apply Quick Clinical Presets
  const applyPreset = (preset: 'stable' | 'febrile' | 'hypotensive') => {
    if (preset === 'stable') {
      setHr(76);
      setSysBp(120);
      setDiaBp(78);
      setRespRate(16);
      setTemp(36.8);
      setSpo2(98);
      setAvpu('Alert');
    } else if (preset === 'febrile') {
      setHr(118);
      setSysBp(106);
      setDiaBp(64);
      setRespRate(24);
      setTemp(39.2);
      setSpo2(94);
      setAvpu('Voice');
    } else if (preset === 'hypotensive') {
      setHr(128);
      setSysBp(82);
      setDiaBp(50);
      setRespRate(28);
      setTemp(38.9);
      setSpo2(91);
      setAvpu('Voice');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: VitalSignRecord = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      heartRate: hr,
      sysBP: sysBp,
      diaBP: diaBp,
      respRate,
      temperature: temp,
      spo2,
      avpu,
      recordedBy
    };

    onAddVitalRecord(patient.id, newRecord);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    2-HOUR INTERMITTENT INTAKE CYCLE
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1">Record 2-Hour Bedside Vitals</h2>
                <p className="text-xs text-slate-400">
                  {patient.name} ({patient.mrn}) • {patient.ward} — {patient.bedNumber}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert Warning Box if Last Vital > 2 Hrs */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Last Vital Intake Logged: <strong>{lastVital?.timestamp || '2.5 Hours Ago'}</strong></span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-amber-500/20 px-2 py-1 rounded text-amber-300">
              STATUS: OVERDUE
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block font-semibold">
              Quick Vital Sign Presets (Click to Auto-fill)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPreset('stable')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-300 font-bold transition text-center"
              >
                🟢 Stable Vitals
              </button>
              <button
                type="button"
                onClick={() => applyPreset('febrile')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 font-bold transition text-center"
              >
                🟡 Febrile (39.2°C)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('hypotensive')}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-red-400 font-bold transition text-center"
              >
                🔴 Severe Sepsis (82/50)
              </button>
            </div>
          </div>

          {/* Vitals Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={sysBp}
                  onChange={(e) => setSysBp(Number(e.target.value))}
                  className={`w-full bg-slate-900 border rounded-xl p-3 text-sm font-bold focus:outline-none ${
                    sysBp <= 100 ? 'border-red-500 text-red-400' : 'border-slate-800 text-cyan-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={diaBp}
                  onChange={(e) => setDiaBp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Resp Rate (/min)</label>
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(Number(e.target.value))}
                  className={`w-full bg-slate-900 border rounded-xl p-3 text-sm font-bold focus:outline-none ${
                    respRate >= 22 ? 'border-red-500 text-red-400' : 'border-slate-800 text-cyan-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Body Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">SpO₂ (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* AVPU Consciousness & Live qSOFA Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">AVPU Consciousness Scale</label>
                <select
                  value={avpu}
                  onChange={(e) => setAvpu(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none"
                >
                  <option value="Alert">Alert (Spontaneous Response)</option>
                  <option value="Voice">Voice (Responds to Verbal Stimulus)</option>
                  <option value="Pain">Pain (Responds to Painful Stimulus)</option>
                  <option value="Unresponsive">Unresponsive</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">LIVE qSOFA CALCULATOR</span>
                  <span className={`text-base font-extrabold font-mono ${qSofa >= 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                    qSOFA Score: {qSofa} / 3 ({qSofa >= 2 ? 'High Risk' : 'Low Risk'})
                  </span>
                </div>
                <Activity className={`w-5 h-5 ${qSofa >= 2 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition"
              >
                {isSuccess ? <CheckCircle className="w-4 h-4 text-white" /> : <Stethoscope className="w-4 h-4" />}
                <span>{isSuccess ? 'Vitals Logged & Timer Reset!' : 'Log 2-Hour Vitals & Reset Alert Timer'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
