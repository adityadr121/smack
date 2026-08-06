import React, { useState } from 'react';
import { Patient } from '../../types';
import { 
  KAGGLE_DATASET_METADATA, 
  KAGGLE_SEPSIS_PATIENTS, 
  RAW_KAGGLE_SEPSIS_ROWS, 
  parseKaggleSepsisCSV,
  KaggleSepsisRow 
} from '../../data/kaggleSepsisDataset';
import { 
  Database, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  X, 
  Sparkles, 
  Table, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface KaggleDatasetImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPatients: (newPatients: Patient[]) => void;
}

export const KaggleDatasetImportModal: React.FC<KaggleDatasetImportModalProps> = ({
  isOpen,
  onClose,
  onImportPatients,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'raw_csv'>('preset');
  const [customCsv, setCustomCsv] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewRows, setPreviewRows] = useState<KaggleSepsisRow[]>(RAW_KAGGLE_SEPSIS_ROWS);
  const [parsedPreviewPatients, setParsedPreviewPatients] = useState<Patient[]>(KAGGLE_SEPSIS_PATIENTS);

  if (!isOpen) return null;

  const handleImportPreset = () => {
    onImportPatients(KAGGLE_SEPSIS_PATIENTS);
    setStatusMessage({
      type: 'success',
      message: `Successfully imported ${KAGGLE_SEPSIS_PATIENTS.length} patient records from Kaggle olagokeblissman/sepsis-dataset!`
    });
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCustomCsv(text);
        const { patients, rawRows, errors } = parseKaggleSepsisCSV(text);
        if (errors.length > 0) {
          setStatusMessage({ type: 'error', message: errors.join(' ') });
        } else {
          setPreviewRows(rawRows);
          setParsedPreviewPatients(patients);
          setStatusMessage({
            type: 'success',
            message: `Parsed ${patients.length} records from uploaded CSV file!`
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleImportCustomCsv = () => {
    if (!customCsv.trim()) {
      setStatusMessage({ type: 'error', message: 'Please paste CSV content or upload a CSV file.' });
      return;
    }

    const { patients, errors } = parseKaggleSepsisCSV(customCsv);
    if (errors.length > 0 || patients.length === 0) {
      setStatusMessage({ type: 'error', message: errors[0] || 'Failed to parse dataset CSV.' });
      return;
    }

    onImportPatients(patients);
    setStatusMessage({
      type: 'success',
      message: `Successfully imported ${patients.length} custom dataset records into EHR system!`
    });
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  KAGGLE DATASET INTEGRATOR
                </span>
                <a
                  href={KAGGLE_DATASET_METADATA.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
                >
                  <span>olagokeblissman/sepsis-dataset</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Import Sepsis Clinical Dataset</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Metadata Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{KAGGLE_DATASET_METADATA.title}</span>
              </div>
              <p className="text-slate-400">{KAGGLE_DATASET_METADATA.description}</p>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                <span>Creator: <strong className="text-slate-200">{KAGGLE_DATASET_METADATA.creator}</strong></span>
                <span>License: <strong className="text-slate-200">{KAGGLE_DATASET_METADATA.license}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start">
              <a
                href={KAGGLE_DATASET_METADATA.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
              >
                <span>View on Kaggle</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.message}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('preset')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === 'preset'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Pre-loaded Kaggle Dataset ({RAW_KAGGLE_SEPSIS_ROWS.length} Records)</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV File</span>
            </button>
            <button
              onClick={() => setActiveTab('raw_csv')}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                activeTab === 'raw_csv'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Raw CSV</span>
            </button>
          </div>

          {/* Tab 1: Pre-loaded Dataset */}
          {activeTab === 'preset' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  <span>Kaggle Dataset Sample Preview</span>
                </h4>
                <button
                  onClick={handleImportPreset}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Import All {RAW_KAGGLE_SEPSIS_ROWS.length} Patients into EHR</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-900 text-slate-300 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Patient_ID</th>
                      <th className="p-3">Temp (°C)</th>
                      <th className="p-3">BP (Sys/Dia)</th>
                      <th className="p-3">HR (bpm)</th>
                      <th className="p-3">WBC (10⁹/L)</th>
                      <th className="p-3">Lactate</th>
                      <th className="p-3">Sepsis Flag</th>
                      <th className="p-3">Ward</th>
                      <th className="p-3">Physician</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {previewRows.map((row) => (
                      <tr key={row.Patient_ID} className="hover:bg-slate-900/50">
                        <td className="p-3 text-cyan-300 font-bold">{row.Patient_ID}</td>
                        <td className={`p-3 ${row.Temperature_C > 38.5 ? 'text-red-400 font-bold' : ''}`}>
                          {row.Temperature_C} °C
                        </td>
                        <td className={`p-3 ${row.BP_Systolic < 90 ? 'text-red-400 font-bold' : ''}`}>
                          {row.BP_Systolic}/{row.BP_Diastolic}
                        </td>
                        <td className={`p-3 ${row.Heart_Rate > 100 ? 'text-amber-400 font-bold' : ''}`}>
                          {row.Heart_Rate}
                        </td>
                        <td className={`p-3 ${row.WBC_Count > 15 ? 'text-amber-400 font-bold' : ''}`}>
                          {row.WBC_Count}
                        </td>
                        <td className={`p-3 ${row.Lactate_mmol_L > 2.0 ? 'text-red-400 font-bold' : ''}`}>
                          {row.Lactate_mmol_L}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              row.Sepsis_Flag === 1
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {row.Sepsis_Flag === 1 ? '1 (Sepsis)' : '0 (Normal)'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{row.Ward}</td>
                        <td className="p-3 text-slate-400">{row.Doctor_On_Duty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Upload Kaggle Sepsis Dataset CSV</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Select a CSV downloaded from kaggle.com/datasets/olagokeblissman/sepsis-dataset
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-white hover:file:bg-cyan-400 cursor-pointer"
                />
              </div>

              {parsedPreviewPatients.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={handleImportCustomCsv}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Import {parsedPreviewPatients.length} Parsed Records</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Raw CSV */}
          {activeTab === 'raw_csv' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Paste CSV Content</label>
                <textarea
                  rows={8}
                  value={customCsv}
                  onChange={(e) => setCustomCsv(e.target.value)}
                  placeholder={`Patient_ID,Admission_Date,Temperature_C,BP_Systolic,BP_Diastolic,Heart_Rate,WBC_Count,Lactate_mmol_L,Sepsis_Flag,Ward,Doctor_On_Duty
PAT-9001,2026-08-05 10:00,39.1,88,54,124,19.2,4.1,1,ICU-Alpha,Dr. Sarah Jenkins`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleImportCustomCsv}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Parse & Import CSV Data</span>
                </button>
              </div>
            </div>
          )}

          {/* Schema Description Table */}
          <div className="pt-4 border-t border-slate-800">
            <h5 className="font-bold text-slate-300 text-xs mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Supported Kaggle Dataset CSV Schema Mapping:</span>
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {KAGGLE_DATASET_METADATA.columns.map((col) => (
                <div key={col.name} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-mono text-cyan-300 font-bold">{col.name}</div>
                  <div className="text-[10px] text-slate-400">{col.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
