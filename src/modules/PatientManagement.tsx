import React, { useState } from 'react';
import { Patient, ClinicalDocument } from '../types';
import { AddPatientModal } from '../components/patient/AddPatientModal';
import { KaggleDatasetImportModal } from '../components/patient/KaggleDatasetImportModal';
import { RiskGauge } from '../components/common/RiskGauge';
import { AnimatedECG } from '../components/common/AnimatedECG';
import { 
  Users, 
  UserPlus, 
  Database,
  Search, 
  Filter, 
  QrCode, 
  Download, 
  FileText, 
  ShieldAlert, 
  Activity, 
  BrainCircuit, 
  Calendar, 
  Upload, 
  Clock, 
  CheckCircle2, 
  Stethoscope,
  FlaskConical,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PatientManagementProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (module: string) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  patients: initialPatients,
  onSelectPatient,
  onNavigate,
}) => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [selectedPatient, setSelectedPatientState] = useState<Patient>(initialPatients[0] || {} as Patient);
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'labs' | 'shap_ai' | 'documents' | 'timeline'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWard, setFilterWard] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isKaggleModalOpen, setIsKaggleModalOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatientState(newPatient);
  };

  const handleImportKagglePatients = (newPatients: Patient[]) => {
    setPatients((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const filteredNew = newPatients.filter((p) => !existingIds.has(p.id));
      return [...filteredNew, ...prev];
    });
    if (newPatients.length > 0) {
      setSelectedPatientState(newPatients[0]);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ward.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWard = filterWard === 'All' || p.ward === filterWard;
    const matchesRisk = filterRisk === 'All' || p.currentPrediction?.riskLevel === filterRisk.toLowerCase();
    return matchesSearch && matchesWard && matchesRisk;
  });

  const criticalCount = patients.filter((p) => p.currentPrediction?.riskLevel === 'critical').length;
  const highRiskCount = patients.filter((p) => p.currentPrediction?.riskLevel === 'high' || p.currentPrediction?.riskLevel === 'critical').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Main Actions */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <Users className="w-4 h-4" />
            <span>ENTERPRISE ELECTRONIC HEALTH RECORD (EHR) SYSTEM</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Inpatient EHR Directory & Clinical Management</h1>
          <p className="text-xs text-slate-400">Integrated patient admission, longitudinal telemetry, QR wristband generation, and SHAP AI risk monitoring.</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsKaggleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs shadow-lg transition focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Import Kaggle Sepsis Dataset</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            <UserPlus className="w-4 h-4" />
            <span>Admit New Patient (5-Step Wizard)</span>
          </button>
        </div>
      </div>

      {/* Topic-Related Animated Clinical Telemetry Graphic Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-3 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
            <HeartPulse className="w-4 h-4 animate-pulse" />
            <span>REAL-TIME TELEMETRY MONITORING TRAIL</span>
          </div>
          <p className="text-xs text-slate-300">Continuous telemetry waveform & intermittent vitals sync active across ICU & General Wards.</p>
          <div className="pt-1">
            <AnimatedECG bpm={88} height={45} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE TELEMETRY BEDS</div>
          <div className="text-2xl font-black font-mono text-cyan-400">{patients.length} / 16</div>
          <div className="text-[10px] text-emerald-400 font-mono">100% EHR Sync Active</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Inpatients', value: patients.length, color: 'text-cyan-400', icon: Users },
          { label: 'Admitted Today', value: 14, color: 'text-emerald-400', icon: CheckCircle2 },
          { label: 'Critical Sepsis', value: criticalCount, color: 'text-red-400', icon: ShieldAlert },
          { label: 'AI High Risk', value: highRiskCount, color: 'text-amber-400', icon: BrainCircuit },
          { label: 'Discharged', value: 2, color: 'text-slate-400', icon: Calendar },
          { label: 'ICU Occupancy', value: '88%', color: 'text-cyan-300', icon: Activity }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">{kpi.label}</div>
                <div className={`text-xl font-black font-mono mt-1 ${kpi.color}`}>{kpi.value}</div>
              </div>
              <Icon className={`w-5 h-5 ${kpi.color} opacity-80`} />
            </div>
          );
        })}
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter Patient Name, MRN, or Ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Ward:</span>
            <select
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:ring-2 focus:ring-cyan-400"
            >
              <option>All</option>
              <option>ICU-Alpha</option>
              <option>Step-Down 3B</option>
              <option>Emergency Bay</option>
              <option>General Ward 4</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Risk Tier:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:ring-2 focus:ring-cyan-400"
            >
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Moderate</option>
              <option>Stable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Data Table, Right Tabbed EHR Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Enterprise Patient Directory Table (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Active Inpatient Roster ({filteredPatients.length})</span>
          </h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              const isCritical = p.currentPrediction?.riskLevel === 'critical';
              const isHigh = p.currentPrediction?.riskLevel === 'high';

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPatientState(p);
                    onSelectPatient(p);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{p.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({p.mrn})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {p.ward} • {p.bedNumber} | {p.age}y {p.gender}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono">MD: {p.attendingPhysician}</div>
                  </div>

                  <div className="text-right space-y-1">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-red-500/20 border-red-500/40 text-red-400'
                          : isHigh
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      }`}
                    >
                      {p.currentPrediction?.riskLevel}
                    </span>
                    <div className="text-xs font-mono font-bold text-white">
                      {p.currentPrediction?.sepsisProbability}% Risk
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Comprehensive Tabbed Patient EHR Profile Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedPatient && selectedPatient.id ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
              
              {/* EHR Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
                    {selectedPatient.name?.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedPatient.name}</h2>
                    <p className="text-xs text-slate-400">
                      MRN: {selectedPatient.mrn} • {selectedPatient.age}y {selectedPatient.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 focus:ring-2 focus:ring-cyan-400"
                  >
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>QR Tag</span>
                  </button>

                  <button
                    onClick={() => onNavigate('prediction')}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 focus:ring-2 focus:ring-cyan-400"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span>Open SHAP AI</span>
                  </button>
                </div>
              </div>

              {/* Profile Navigation Tabs */}
              <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'vitals', label: 'Telemetry Vitals' },
                  { id: 'labs', label: 'Lab Chemistry' },
                  { id: 'shap_ai', label: 'SHAP AI Risk' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'timeline', label: 'Timeline' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition shrink-0 focus:ring-2 focus:ring-cyan-400 ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Admission Diagnosis</span>
                      <p className="font-bold text-white">{selectedPatient.primaryDiagnosis}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Assigned Care Team</span>
                      <p className="font-bold text-cyan-300">MD: {selectedPatient.attendingPhysician}</p>
                      <p className="text-slate-300">RN: {selectedPatient.primaryNurse}</p>
                    </div>
                  </div>

                  {/* Allergies & Medications */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        Known Allergies
                      </span>
                      {selectedPatient.allergies?.map((alg, idx) => (
                        <div key={idx} className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="font-bold">{alg.substance}</span> — {alg.reaction} ({alg.severity})
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4" />
                        Active Medications
                      </span>
                      {selectedPatient.medications?.map((med, idx) => (
                        <div key={idx} className="text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="font-bold">{med.name}</span> ({med.dosage} {med.frequency})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Telemetry Vitals */}
              {activeTab === 'vitals' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Longitudinal Vital Sign Logs ({selectedPatient.vitalHistory?.length || 0} Cycles)</span>
                    <button onClick={() => onNavigate('nurse_workspace')} className="text-cyan-400 hover:underline">Log New Vitals</button>
                  </div>
                  <div className="space-y-2">
                    {selectedPatient.vitalHistory?.map((v, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
                        <div>
                          <span className="text-slate-400">{v.timestamp}</span>
                          <div className="text-white font-bold mt-0.5">HR: {v.heartRate} bpm | BP: {v.sysBP}/{v.diaBP} mmHg</div>
                        </div>
                        <div className="text-right">
                          <span className="text-cyan-400">Temp: {v.temperature}°C</span>
                          <div className="text-slate-300">SpO₂: {v.spo2}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Lab Chemistry */}
              {activeTab === 'labs' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Laboratory Biomarker Results</span>
                    <button onClick={() => onNavigate('lab_module')} className="text-cyan-400 hover:underline">Add Lab Chemistry</button>
                  </div>
                  {selectedPatient.labHistory?.map((lab, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-2 font-mono">
                      <div>
                        <span className="text-slate-400 text-[10px]">SERUM LACTATE</span>
                        <div className="text-amber-400 font-bold">{lab.lactate} mmol/L</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">WBC COUNT</span>
                        <div className="text-white font-bold">{lab.wbc} x10^9/L</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">CREATININE</span>
                        <div className="text-white font-bold">{lab.creatinine} mg/dL</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: SHAP AI Risk */}
              {activeTab === 'shap_ai' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <span className="text-slate-400 font-mono text-[10px]">AI SEPSIS RISK DIAGNOSIS</span>
                      <div className="text-xl font-bold text-white font-mono mt-0.5">
                        {selectedPatient.currentPrediction?.sepsisProbability}% ({selectedPatient.currentPrediction?.riskLevel.toUpperCase()})
                      </div>
                    </div>
                    <RiskGauge probability={selectedPatient.currentPrediction?.sepsisProbability || 50} riskLevel={selectedPatient.currentPrediction?.riskLevel || 'moderate'} />
                  </div>
                </div>
              )}

              {/* Tab 5: Document Manager */}
              {activeTab === 'documents' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Attached EHR Documents & Lab PDFs</span>
                    <button className="flex items-center gap-1 text-cyan-400 hover:underline">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Document</span>
                    </button>
                  </div>

                  {selectedPatient.clinicalDocuments && selectedPatient.clinicalDocuments.map((doc: ClinicalDocument, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <div>
                          <div className="font-bold text-white">{doc.title}</div>
                          <div className="text-[10px] text-slate-400">{doc.type} • {doc.date} ({doc.fileSize})</div>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg bg-slate-950 text-cyan-400 hover:text-white" aria-label="Download document">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Timeline */}
              {activeTab === 'timeline' && (
                <div className="space-y-3 text-xs pl-2 border-l-2 border-cyan-500/40">
                  <div className="relative pl-4 space-y-1">
                    <div className="absolute -left-[17px] top-1 w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="text-[10px] font-mono text-slate-400">{selectedPatient.admissionDate} • 08:30 AM</span>
                    <div className="font-bold text-white">Inpatient Admission Requisition Signed</div>
                    <p className="text-slate-400">Admitted to {selectedPatient.ward} ({selectedPatient.bedNumber}) by {selectedPatient.attendingPhysician}.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400">
              Select a patient from the roster to view EHR details.
            </div>
          )}
        </div>
      </div>

      {/* 5-Step Admission Wizard Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPatient={handleAddPatient}
      />

      {/* QR Wristband Modal */}
      <AnimatePresence>
        {showQrModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowQrModal(false)}
          >
            <div className="glass-panel bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white">Patient Wristband QR Tag</h3>
              <div className="p-4 bg-white rounded-2xl inline-block shadow-inner">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="text-xs font-mono text-cyan-400 font-bold">{selectedPatient.name} ({selectedPatient.mrn})</div>
              <p className="text-[11px] text-slate-400">Scan via bedside nurse mobile app for quick telemetry sync.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kaggle Sepsis Dataset Import Modal */}
      <KaggleDatasetImportModal
        isOpen={isKaggleModalOpen}
        onClose={() => setIsKaggleModalOpen(false)}
        onImportPatients={handleImportKagglePatients}
      />
    </div>
  );
};
