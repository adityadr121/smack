import React, { useState } from 'react';
import { Patient, VitalSignRecord } from '../types';
import { TwoHourVitalsModal } from '../components/patient/TwoHourVitalsModal';
import { 
  Stethoscope, 
  QrCode, 
  Mic, 
  MicOff, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  FileText,
  Clock,
  UserCheck,
  RefreshCcw,
  Sparkles,
  AlertCircle,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NurseWorkspaceProps {
  patients: Patient[];
  onAddVitalRecord: (patientId: string, vitals: VitalSignRecord) => void;
  onNavigate: (module: string) => void;
}

export const NurseWorkspace: React.FC<NurseWorkspaceProps> = ({
  patients,
  onAddVitalRecord,
  onNavigate,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'p-101');
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [twoHourModalPatient, setTwoHourModalPatient] = useState<Patient | null>(null);

  // Form State
  const [hr, setHr] = useState(114);
  const [sysBp, setSysBp] = useState(90);
  const [diaBp, setDiaBp] = useState(58);
  const [respRate, setRespRate] = useState(24);
  const [temp, setTemp] = useState(38.9);
  const [spo2, setSpo2] = useState(92);
  const [avpu, setAvpu] = useState<'Alert' | 'Voice' | 'Pain' | 'Unresponsive'>('Voice');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // qSOFA Calculation
  const qSofa = (sysBp <= 100 ? 1 : 0) + (respRate >= 22 ? 1 : 0) + (avpu !== 'Alert' ? 1 : 0);

  // Voice vital parser simulator
  const toggleVoiceInput = () => {
    if (isListeningVoice) {
      setIsListeningVoice(false);
    } else {
      setIsListeningVoice(true);
      setVoiceTranscript('Listening... Speak "Heart rate 118, Blood pressure 84 over 50, Respiration 26, Temp 39.1"');
      setTimeout(() => {
        setHr(118);
        setSysBp(84);
        setDiaBp(50);
        setRespRate(26);
        setTemp(39.1);
        setSpo2(91);
        setAvpu('Voice');
        setVoiceTranscript('Voice Recognized: "HR 118, BP 84/50, RR 26, Temp 39.1, AVPU Voice"');
        setIsListeningVoice(false);
      }, 2500);
    }
  };

  // QR Scanner Simulator
  const handleScanQR = () => {
    setIsScanningQR(true);
    setTimeout(() => {
      setIsScanningQR(false);
      setSelectedPatientId(patients[0]?.id || 'p-101');
      alert(`QR Code Scanned: Matched Wristband MRN-${patients[0]?.mrn} (${patients[0]?.name})`);
    }, 1500);
  };

  const handleSubmitVitals = (e: React.FormEvent) => {
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
      recordedBy: 'RN Marcus Vance'
    };

    onAddVitalRecord(selectedPatientId, newRecord);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const overdueCount = patients.filter((p, idx) => idx % 2 === 0).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Nurse Header & Offline Queue Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <Stethoscope className="w-4 h-4" />
            <span>SPEED-OPTIMIZED BEDSIDE NURSE WORKSPACE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Rapid Vital Signs & 2-Hour Intake Schedule</h1>
          <p className="text-xs text-slate-400">Intermittent 2-Hour Vital Tracking • Hands-Free Voice Entry • Instant Sepsis Screening</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition ${
              isOffline ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? 'OFFLINE MODE (Queue Active)' : 'EHR ONLINE SYNC'}</span>
          </button>

          <button
            onClick={handleScanQR}
            disabled={isScanningQR}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition"
          >
            <QrCode className={`w-4 h-4 ${isScanningQR ? 'animate-spin' : ''}`} />
            <span>{isScanningQR ? 'Scanning Wristband...' : 'Scan Patient QR'}</span>
          </button>
        </div>
      </div>

      {/* 2-HOUR INTERMITTENT VITALS ALERT TRACKER BANNER */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
              2-Hour Intermittent Telemetry Alert Tracker ({overdueCount} Overdue Beds)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 font-bold">
            CLINICAL ICU PROTOCOL: VITALS LOGGED EVERY 120 MINS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {patients.map((p, idx) => {
            const isOverdue = idx % 2 === 0;
            const lastTime = p.vitalHistory?.[p.vitalHistory.length - 1]?.timestamp || '2.5h ago';

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-xl border transition flex flex-col justify-between space-y-2 ${
                  isOverdue
                    ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{p.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isOverdue ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {isOverdue ? '2-HR OVERDUE' : 'OK (1.2h ago)'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {p.ward} • {p.bedNumber} | Last: <span className="font-mono text-slate-200">{lastTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => setTwoHourModalPatient(p)}
                  className="w-full py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Record 2-Hr Vitals</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rapid Intake Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-6">
          {/* Patient Selection Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              Select Patient Bed
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white font-semibold focus:outline-none focus:border-cyan-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ward} — {p.bedNumber}: {p.name} ({p.mrn}) — Sepsis Risk: {(p.currentPrediction?.riskLevel || 'stable').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Vital Assistant Trigger */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300 uppercase font-mono">Voice Vitals Assistant</span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isListeningVoice
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                }`}
              >
                {isListeningVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListeningVoice ? 'Recording Vitals...' : 'Hands-Free Voice Dictation'}</span>
              </button>
            </div>
            {voiceTranscript && (
              <p className="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-cyan-500/20">
                {voiceTranscript}
              </p>
            )}
          </div>

          {/* Rapid Vital Intake Grid Form */}
          <form onSubmit={handleSubmitVitals} className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-base text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={sysBp}
                  onChange={(e) => setSysBp(Number(e.target.value))}
                  className={`w-full bg-slate-900 border rounded-xl p-3 text-base font-mono focus:outline-none ${
                    sysBp <= 100 ? 'border-red-500 text-red-400 font-bold' : 'border-slate-800 text-cyan-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={diaBp}
                  onChange={(e) => setDiaBp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-base text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Respiration Rate (/min)</label>
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(Number(e.target.value))}
                  className={`w-full bg-slate-900 border rounded-xl p-3 text-base font-mono focus:outline-none ${
                    respRate >= 22 ? 'border-red-500 text-red-400 font-bold' : 'border-slate-800 text-cyan-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">Body Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-base text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono block mb-1">SpO₂ (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-base text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* AVPU Consciousness Selection */}
            <div>
              <label className="text-xs text-slate-400 font-mono block mb-2">AVPU Consciousness Scale</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {(['Alert', 'Voice', 'Pain', 'Unresponsive'] as const).map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setAvpu(scale)}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold transition ${
                      avpu === scale
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold ${qSofa >= 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                  Live qSOFA Score: {qSofa} / 3 ({qSofa >= 2 ? 'High Risk Alert' : 'Normal Range'})
                </span>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
              >
                {submitSuccess ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{submitSuccess ? 'Vitals Logged & AI Re-Calculated!' : 'Submit Bedside Vitals (1-Click Log)'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Active Patient Summary & Quick History */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Patient Bed Details ({selectedPatient.bedNumber})
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Patient Name:</span>
                <span className="font-bold text-white">{selectedPatient.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">MRN:</span>
                <span className="font-mono text-cyan-300 font-bold">{selectedPatient.mrn}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Primary Diagnosis:</span>
                <span className="font-bold text-slate-200">{selectedPatient.primaryDiagnosis}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Sepsis Probability:</span>
                <span className="font-mono text-red-400 font-bold">{selectedPatient.currentPrediction?.sepsisProbability}%</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Recent Vital Logs ({selectedPatient.vitalHistory?.length || 0})
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {selectedPatient.vitalHistory?.map((v, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono flex justify-between">
                  <div>
                    <span className="text-slate-400">{v.timestamp}</span>
                    <div className="text-white font-bold">HR {v.heartRate} | BP {v.sysBP}/{v.diaBP}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-400">T {v.temperature}°C</span>
                    <div className="text-slate-400">SpO₂ {v.spo2}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Hour Vitals Intake Modal */}
      {twoHourModalPatient && (
        <TwoHourVitalsModal
          isOpen={!!twoHourModalPatient}
          onClose={() => setTwoHourModalPatient(null)}
          patient={twoHourModalPatient}
          onAddVitalRecord={onAddVitalRecord}
        />
      )}
    </div>
  );
};
