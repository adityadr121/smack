import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { 
  GitCommit, 
  Calendar, 
  Stethoscope, 
  FlaskConical, 
  BrainCircuit, 
  UserCheck, 
  Syringe, 
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertTriangle,
  FileCheck2,
  Activity,
  HeartPulse,
  Pill,
  Sparkles,
  User,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PatientTimelineProps {
  patient: Patient;
  patients?: Patient[];
  onSelectPatient?: (patient: Patient) => void;
  onNavigate: (module: string) => void;
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ 
  patient, 
  patients = [], 
  onSelectPatient, 
  onNavigate 
}) => {
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  // Safe fallback default patient if patient prop is missing or undefined
  const currentPatient = patient || patients[0] || {
    id: 'p-101',
    mrn: 'MRN-884210',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    ward: 'ICU-Alpha',
    bedNumber: 'Bed-04',
    admissionDate: '2026-08-03 08:30 AM',
    attendingPhysician: 'Dr. Sarah Jenkins, MD',
    primaryNurse: 'RN Marcus Vance',
    primaryDiagnosis: 'Severe Urosepsis with Hypotension',
    allergies: [{ substance: 'Penicillin G', reaction: 'Anaphylaxis', severity: 'severe' }],
    medications: [{ name: 'Norepinephrine IV', dosage: '0.1 mcg/kg/min', frequency: 'Continuous' }],
    vitalHistory: [{ timestamp: '10 mins ago', heartRate: 118, sysBP: 92, diaBP: 58, respRate: 24, temperature: 38.8, spo2: 94 }],
    labHistory: [{ timestamp: '20 mins ago', lactate: 4.2, wbc: 19.8, procalcitonin: 5.8, creatinine: 2.1 }],
    currentPrediction: {
      sepsisProbability: 87.4,
      riskLevel: 'critical',
      confidenceScore: 94.2,
      deteriorationWindowHours: 4.5,
      predictedTime: '2026-08-03 21:00',
      qSofaScore: 3,
      sofaScore: 9,
      missingDataPenalty: 2.1,
      shapFeatures: [{ featureName: 'Serum Lactate', impact: 0.32, value: '4.2 mmol/L', description: 'Elevated lactate' }],
      nurseActionItems: ['Draw blood cultures x 2'],
      doctorActionItems: ['Order broad spectrum IV antibiotics'],
      recommendedObservations: ['Hourly SpO2']
    },
    riskLevel: 'critical',
    treatmentBundleStatus: {
      lactateMeasured: true,
      bloodCultureDrawn: true,
      broadSpectrumAntibioticsGiven: false,
      ivFluidsAdministered: true,
      vasopressorsApplied: false
    }
  };

  const defaultBundleStatus = currentPatient.treatmentBundleStatus || {
    lactateMeasured: true,
    bloodCultureDrawn: true,
    broadSpectrumAntibioticsGiven: false,
    ivFluidsAdministered: true,
    vasopressorsApplied: false
  };

  const [bundleStatus, setBundleStatus] = useState(defaultBundleStatus);

  useEffect(() => {
    if (currentPatient && currentPatient.treatmentBundleStatus) {
      setBundleStatus(currentPatient.treatmentBundleStatus);
    }
  }, [currentPatient.id]);

  const toggleBundleItem = (itemKey: keyof typeof bundleStatus) => {
    setBundleStatus(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const lastVital = currentPatient.vitalHistory?.[currentPatient.vitalHistory.length - 1];
  const lastLab = currentPatient.labHistory?.[currentPatient.labHistory.length - 1];

  const steps = [
    {
      id: 'admission',
      title: 'Hospital Admission & ER Triage',
      time: currentPatient.admissionDate || '2026-08-03 08:30 AM',
      actor: 'ER Triage Staff',
      icon: Calendar,
      status: 'completed',
      category: 'Admission',
      details: `Admitted to ${currentPatient.ward || 'ICU'} (${currentPatient.bedNumber || 'Bed-01'}) for ${currentPatient.primaryDiagnosis || 'Sepsis Evaluation'}. Assigned attending physician: ${currentPatient.attendingPhysician || 'Dr. Jenkins'}, primary RN: ${currentPatient.primaryNurse || 'RN Marcus'}.`
    },
    {
      id: 'vitals',
      title: 'Intermittent Nurse Vital Intake',
      time: lastVital?.timestamp || 'Recent Cycle',
      actor: currentPatient.primaryNurse || 'Primary RN',
      icon: Stethoscope,
      status: 'completed',
      category: 'Telemetry',
      details: `Latest vitals logged: HR ${lastVital?.heartRate || 112} bpm, BP ${lastVital?.sysBP || 90}/${lastVital?.diaBP || 60} mmHg, Temp ${lastVital?.temperature || 38.8}°C, SpO₂ ${lastVital?.spo2 || 94}%.`
    },
    {
      id: 'labs',
      title: 'Stat Laboratory Panel Processing',
      time: lastLab?.timestamp || 'Recent Cycle',
      actor: 'Central Clinical Lab',
      icon: FlaskConical,
      status: 'completed',
      category: 'Biomarkers',
      details: `Serum Lactate: ${lastLab?.lactate || 4.2} mmol/L (High Alert), WBC: ${lastLab?.wbc || 19.8}k, Procalcitonin: ${lastLab?.procalcitonin || 5.8} ng/mL.`
    },
    {
      id: 'ai_prediction',
      title: 'CureLink AI Sepsis Risk Trigger',
      time: `Lead Time: ${currentPatient.currentPrediction?.deteriorationWindowHours || 4.5}h`,
      actor: 'CureLink AI Engine',
      icon: BrainCircuit,
      status: 'active',
      category: 'Predictive AI',
      details: `Sepsis Risk calculated at ${currentPatient.currentPrediction?.sepsisProbability || 85}% (${(currentPatient.riskLevel || 'critical').toUpperCase()}). SHAP feature attribution highlights elevated Serum Lactate (+32%) and Heart Rate (+24%) as top deterioration drivers.`
    },
    {
      id: 'doctor_review',
      title: 'Attending MD Protocol Approval',
      time: 'In Progress',
      actor: currentPatient.attendingPhysician || 'Attending Physician',
      icon: UserCheck,
      status: bundleStatus.broadSpectrumAntibioticsGiven ? 'completed' : 'pending',
      category: 'Physician Order',
      details: 'Attending MD reviewed explainable AI recommendations. Orders issued for stat blood cultures × 2 sets and broad-spectrum IV antibiotic administration.'
    },
    {
      id: 'treatment',
      title: '3-Hour Surviving Sepsis Bundle Execution',
      time: 'Active Bundle Execution',
      actor: 'ICU Care Team',
      icon: Syringe,
      status: bundleStatus.bloodCultureDrawn && bundleStatus.broadSpectrumAntibioticsGiven ? 'completed' : 'pending',
      category: 'Bundle Protocol',
      details: `Blood Cultures: ${bundleStatus.bloodCultureDrawn ? '✓ Drawn' : 'Pending'}, IV Antibiotics: ${bundleStatus.broadSpectrumAntibioticsGiven ? '✓ Administered' : 'Pending'}, IV Fluids (30mL/kg): ${bundleStatus.ivFluidsAdministered ? '✓ In Progress' : 'Pending'}.`
    },
    {
      id: 'recovery',
      title: 'Hemodynamic Stabilization & Recovery Target',
      time: 'Expected +12h Target',
      actor: 'ICU / Ward Staff',
      icon: CheckCircle2,
      status: 'future',
      category: 'Stabilization',
      details: 'Continuous monitoring to verify lactate clearance (<2.0 mmol/L), MAP stabilization (≥65 mmHg), and resolution of systemic inflammatory response.'
    }
  ];

  const completedStepsCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedStepsCount / steps.length) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner & Patient Selector */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
              <GitCommit className="w-4 h-4" />
              <span>LONGITUDINAL CLINICAL JOURNEY & CARETRAIL</span>
            </div>

            {/* Patient Selector & Info */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white">{currentPatient.name} ({currentPatient.mrn})</h1>
              
              {/* Patient Selector Dropdown */}
              {patients.length > 0 && onSelectPatient && (
                <div className="relative">
                  <select
                    value={currentPatient.id}
                    onChange={(e) => {
                      const selected = patients.find(p => p.id === e.target.value);
                      if (selected && onSelectPatient) onSelectPatient(selected);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-bold focus:ring-2 focus:ring-cyan-400 focus:outline-none cursor-pointer"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.ward} • Bed {p.bedNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Ward: <span className="text-cyan-300 font-semibold">{currentPatient.ward}</span> • Bed: <span className="text-cyan-300 font-semibold">{currentPatient.bedNumber}</span> • Attending: <span className="text-slate-200">{currentPatient.attendingPhysician}</span> • Primary RN: <span className="text-slate-200">{currentPatient.primaryNurse}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('prediction')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>View SHAP Explainable AI &rarr;</span>
            </button>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Care Bundle Clinical Progress
            </span>
            <span className="font-mono font-bold text-cyan-400">{completedStepsCount} of {steps.length} Milestones Reached ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full shadow-sm shadow-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Vertical Care Trail + Clinical Visual Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Animated Clinical Timeline Nodes (8 Cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-6 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[39px] top-12 bottom-12 w-0.5 bg-slate-800" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            const isPending = step.status === 'pending';
            const isExpanded = activeStepId === step.id;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative flex items-start gap-4 group"
              >
                {/* Step Node Icon Badge */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-md shadow-emerald-500/10'
                      : isActive
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 heart-beat-anim shadow-lg shadow-cyan-500/30'
                      : isPending
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Step Content Box */}
                <div 
                  onClick={() => setActiveStepId(isExpanded ? null : step.id)}
                  className={`flex-1 glass-panel p-5 rounded-2xl border transition duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/20 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">{step.title}</h3>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {step.category}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {step.time}
                    </span>
                  </div>

                  <div className="text-[11px] font-medium text-cyan-400 mt-1">
                    Care Provider: <span className="text-slate-200 font-semibold">{step.actor}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-2 mt-2 border-t border-slate-800/80">
                    {step.details}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Interactive 3-Hour Sepsis Care Bundle Protocol Card & Visual Graphic (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Animated Medical Graphic Box */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 text-center space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/20 heart-beat-anim">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-white">Live Patient Monitoring Trail</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Real-time synchronization of nurse vitals, lab biomarker panels, and SHAP explainable AI triggers.
              </p>
            </div>

            {/* Interactive Vital Sign Quick Status */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left">
                <span className="text-[10px] text-slate-400 block">Sepsis Probability</span>
                <span className="text-lg font-extrabold text-cyan-400">{currentPatient.currentPrediction?.sepsisProbability || 85}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left">
                <span className="text-[10px] text-slate-400 block">qSOFA Score</span>
                <span className="text-lg font-extrabold text-amber-400">{currentPatient.currentPrediction?.qSofaScore || 2} / 3</span>
              </div>
            </div>
          </div>

          {/* Interactive 3-Hour Sepsis Care Bundle Protocol Manager */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span>3-Hour Sepsis Bundle Checklist</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                CLINICAL PROTOCOL
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'lactateMeasured', label: 'Measure Serum Lactate', desc: 'Re-measure if initial lactate > 2 mmol/L' },
                { key: 'bloodCultureDrawn', label: 'Blood Cultures × 2 Sets', desc: 'Obtain prior to antibiotic administration' },
                { key: 'broadSpectrumAntibioticsGiven', label: 'Broad-Spectrum IV Antibiotics', desc: 'Administer empiric broad-spectrum coverage' },
                { key: 'ivFluidsAdministered', label: '30 mL/kg Rapid Crystalloid Fluid', desc: 'For hypotension or lactate ≥ 4 mmol/L' },
                { key: 'vasopressorsApplied', label: 'Apply Vasopressors (Norepinephrine)', desc: 'Maintain MAP ≥ 65 mmHg if fluids insufficient' }
              ].map((item) => {
                const isChecked = bundleStatus[item.key as keyof typeof bundleStatus];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleBundleItem(item.key as keyof typeof bundleStatus)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                      isChecked ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className={`font-bold ${isChecked ? 'text-white' : 'text-slate-300'}`}>{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
