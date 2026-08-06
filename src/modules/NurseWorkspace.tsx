import React, { useState } from 'react';
import { Patient, VitalSignRecord } from '../types';
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
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

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
      setSelectedPatientId('p-101'); // Select Eleanor Vance
      alert('QR Code Scanned: Matched Wristband MRN-884920 (Eleanor Vance, Bed A-04)');
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Nurse Header & Offline Queue Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Stethoscope className="w-4 h-4" />
            <span>SPEED-OPTIMIZED BEDSIDE NURSE WORKSPACE</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Rapid Vital Signs & qSOFA Intake</h1>
          <p className="text-xs text-slate-400">Minimize Clicks • Hands-Free Voice Entry • Instant Sepsis Screening</p>
        </div>

        <div className="flex items-center gap-3">
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition"
          >
            <QrCode className={`w-4 h-4 ${isScanningQR ? 'animate-spin' : ''}`} />
            <span>{isScanningQR ? 'Scanning Wristband...' : 'Scan Patient QR'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rapid Intake Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-6">
          {/* Patient Selection Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select Patient Bed
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white font-semibold focus:outline-none focus:border-cyan-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ward} — {p.bedNumber}: {p.name} ({p.mrn}) — Risk: {p.riskLevel.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Vital Assistant Trigger */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300 uppercase">Voice Vitals Assistant</span>
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
                <label className="text-xs text-slate-400 font-mono block mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-base text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* AVPU Mental Status Selector */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">AVPU Consciousness Assessment</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Alert', 'Voice', 'Pain', 'Unresponsive'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setAvpu(level)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      avpu === level
                        ? level === 'Alert'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Live qSOFA Score Gauge */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between transition ${
              qSofa >= 2 ? 'bg-red-950/30 border-red-500/50 text-red-300 neon-glow-red' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div className="space-y-0.5">
                <span className="text-xs font-mono uppercase block">Real-time Bedside qSOFA Score</span>
                <span className="text-xl font-extrabold text-white">
                  {qSofa} / 3 — {qSofa >= 2 ? 'HIGH SEPSIS RISK INDICATED' : 'MODERATE / STABLE'}
                </span>
              </div>

              {qSofa >= 2 && <AlertTriangle className="w-8 h-8 text-red-400 heart-beat-anim" />}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition"
            >
              <Save className="w-4 h-4" />
              <span>Record Vitals & Trigger AI Prediction</span>
            </button>

            {submitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Vitals successfully recorded! AI Sepsis Risk score updated in real time.</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Shift Summary & Nurse Guidelines */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Shift Summary (RN Marcus Vance)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-900">
                <span className="text-slate-400">Assigned Patients:</span>
                <span className="font-bold text-white font-mono">4 Beds (ICU)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-900">
                <span className="text-slate-400">Vitals Recorded Shift:</span>
                <span className="font-bold text-cyan-400 font-mono">18 Records</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-900">
                <span className="text-slate-400">High Risk Triggers:</span>
                <span className="font-bold text-red-400 font-mono">2 Active Alerts</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('prediction')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs font-bold transition"
            >
              View Patient Sepsis SHAP Analysis &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
