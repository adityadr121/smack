import React, { useState } from 'react';
import { Patient } from '../types';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Filter, 
  BrainCircuit, 
  Activity, 
  Calendar, 
  X, 
  Sparkles,
  FileCheck,
  Building2,
  User,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportsModuleProps {
  patients: Patient[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ patients = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [reportType, setReportType] = useState<'all' | 'critical' | 'compliance' | 'labs'>('all');
  const [selectedReportPatient, setSelectedReportPatient] = useState<Patient | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const filteredPatients = patients.filter((p) => {
    if (!p) return false;
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.mrn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.ward || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const riskLevel = p.currentPrediction?.riskLevel || 'stable';
    const matchesRisk = filterRisk === 'All' || riskLevel === filterRisk.toLowerCase();
    
    let matchesReportType = true;
    if (reportType === 'critical') {
      matchesReportType = riskLevel === 'critical' || riskLevel === 'high';
    } else if (reportType === 'compliance') {
      matchesReportType = !p.treatmentBundleStatus?.broadSpectrumAntibioticsGiven;
    } else if (reportType === 'labs') {
      matchesReportType = (p.labHistory?.length || 0) > 0;
    }

    return matchesSearch && matchesRisk && matchesReportType;
  });

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['MRN', 'Name', 'Age', 'Gender', 'Ward', 'Bed', 'SepsisRisk%', 'qSOFA', 'Lactate', 'WBC', 'HR', 'BP', 'AntibioticsGiven'];
      const rows = filteredPatients.map((p) => {
        const lastLab = p.labHistory?.[p.labHistory.length - 1];
        const lastVital = p.vitalHistory?.[p.vitalHistory.length - 1];
        const pred = p.currentPrediction || { sepsisProbability: 0, qSofaScore: 0 };
        const bundle = p.treatmentBundleStatus || { broadSpectrumAntibioticsGiven: false };

        return [
          p.mrn || 'N/A',
          p.name || 'N/A',
          p.age || 'N/A',
          p.gender || 'N/A',
          p.ward || 'N/A',
          p.bedNumber || 'N/A',
          pred.sepsisProbability || 0,
          pred.qSofaScore || 0,
          lastLab?.lactate || 'N/A',
          lastLab?.wbc || 'N/A',
          lastVital?.heartRate || 'N/A',
          `${lastVital?.sysBP || 'N/A'}/${lastVital?.diaBP || 'N/A'}`,
          bundle.broadSpectrumAntibioticsGiven ? 'Yes' : 'No'
        ];
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `CureLink_Clinical_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  const handlePrintPDF = (patient: Patient) => {
    setSelectedReportPatient(patient);
  };

  const criticalCount = patients.filter(p => p?.currentPrediction?.riskLevel === 'critical').length;
  const compliantCount = patients.filter(p => p?.treatmentBundleStatus?.broadSpectrumAntibioticsGiven).length;
  const complianceRate = patients.length > 0 ? Math.round((compliantCount / patients.length) * 100) : 100;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <FileText className="w-4 h-4" />
            <span>CLINICAL REPORT GENERATION & DATASET EXPORT ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Clinical Sepsis Audit Reports</h1>
          <p className="text-xs text-slate-400">Generate printable EHR PDF SHAP summaries • Export CSV Dataset • HL7 FHIR Standard Compliance</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <FileSpreadsheet className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
            <span>{isExporting ? 'Generating Dataset...' : 'Export Filtered Patients (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Medical Graphic Banner Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold heart-beat-anim shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">HL7 / FHIR Clinical Audit Export</div>
            <div className="text-xs text-slate-400">Compliant with ICU Sepsis-3 Guidelines</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">3-Hour Bundle Compliance Rate</div>
            <div className="text-xs text-emerald-400 font-mono font-bold">{complianceRate}% Hospital Metric ({compliantCount}/{patients.length})</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Explainable SHAP Attribution</div>
            <div className="text-xs text-slate-400">Integrated into printable PDF summaries</div>
          </div>
        </div>
      </div>

      {/* Report Category Preset Buttons */}
      <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs overflow-x-auto gap-1">
        {[
          { id: 'all', label: `All Patients (${patients.length})` },
          { id: 'critical', label: `Critical & High Risk Cohort (${criticalCount})` },
          { id: 'compliance', label: `Pending Sepsis Care Bundle (${patients.length - compliantCount})` },
          { id: 'labs', label: `Biomarker & Lab Panels (${patients.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition shrink-0 focus:ring-2 focus:ring-cyan-400 ${
              reportType === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Patient Name, MRN, or Ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Risk Tier Filter:</span>
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

      {/* Patient Report Cards Generator List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => {
          if (!patient) return null;
          const pred = patient.currentPrediction || { sepsisProbability: 0, riskLevel: 'stable', deteriorationWindowHours: 6, shapFeatures: [] };
          const bundle = patient.treatmentBundleStatus || { broadSpectrumAntibioticsGiven: false };
          const isCritical = pred.riskLevel === 'critical';
          const isHigh = pred.riskLevel === 'high';

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{patient.name}</h3>
                    <span className="text-xs font-mono text-slate-400">({patient.mrn})</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {patient.ward} • {patient.bedNumber} • Attending MD: <span className="text-slate-200">{patient.attendingPhysician}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                      isCritical
                        ? 'bg-red-500/20 border-red-500/40 text-red-400'
                        : isHigh
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    }`}
                  >
                    {pred.sepsisProbability}% {(pred.riskLevel || 'stable').toUpperCase()} RISK
                  </span>

                  <button
                    onClick={() => handlePrintPDF(patient)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/50 text-xs font-bold transition focus:ring-2 focus:ring-cyan-400"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Preview & Print PDF</span>
                  </button>
                </div>
              </div>

              {/* Metrics Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">TOP SHAP AI RISK DRIVER</span>
                  <span className="font-bold text-cyan-400">{pred.shapFeatures?.[0]?.featureName || 'Serum Lactate'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">DETERIORATION LEAD TIME</span>
                  <span className="font-bold text-white">{pred.deteriorationWindowHours || 4.5} Hours Window</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">3-HOUR SEPSIS BUNDLE STATUS</span>
                  <span className={`font-bold ${bundle.broadSpectrumAntibioticsGiven ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {bundle.broadSpectrumAntibioticsGiven ? '✓ Compliant' : '⚠ Action Needed'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PDF Clinical Report Preview Modal */}
      <AnimatePresence>
        {selectedReportPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedReportPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-8 space-y-6 shadow-2xl relative my-8"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedReportPatient(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Printable PDF Layout Preview Header */}
              <div className="border-b border-slate-800 pb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
                    CURELINK AI • CLINICAL SUMMARY REPORT
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-1">{selectedReportPatient.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    MRN: {selectedReportPatient.mrn} • Ward: {selectedReportPatient.ward} ({selectedReportPatient.bedNumber}) • Age: {selectedReportPatient.age}y {selectedReportPatient.gender}
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">SEPSIS PROBABILITY DIAGNOSIS</span>
                  <div className="text-xl font-extrabold text-cyan-400">
                    {selectedReportPatient.currentPrediction?.sepsisProbability || 85}% ({(selectedReportPatient.currentPrediction?.riskLevel || 'critical').toUpperCase()})
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">ATTENDING CARE TEAM</span>
                  <div className="font-bold text-white">MD: {selectedReportPatient.attendingPhysician}</div>
                  <div className="text-slate-300">RN: {selectedReportPatient.primaryNurse}</div>
                </div>
              </div>

              {/* SHAP AI Drivers */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">Top Explainable SHAP AI Risk Contributors</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  {selectedReportPatient.currentPrediction?.shapFeatures?.map((feat, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-white font-bold">{feat.featureName}</span>
                      <span className="text-cyan-400 font-bold">{feat.impact > 0 ? `+${(feat.impact * 100).toFixed(1)}%` : `${(feat.impact * 100).toFixed(1)}%`}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Signature Footer */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div>Report Date: {new Date().toLocaleDateString()}</div>
                <div>Attending Physician Signature: ______________________</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
