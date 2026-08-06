import React, { useState } from 'react';
import { Patient, SepsisRiskLevel } from '../../types';
import { X, User, Hospital, HeartPulse, PhoneCall, UserCheck, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAddPatient }) => {
  const [step, setStep] = useState(1);

  // Form State across 5 Steps
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: 'Julian Thorne',
    dob: '1962-05-14',
    age: 64,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    height: 178,
    weight: 81,
    nationalId: 'USA-SSN-9982-10',

    // Step 2: Admission Details
    hospital: 'Johns Hopkins Health System',
    department: 'Intensive Care Unit',
    ward: 'ICU-Alpha',
    bedNumber: 'Bed A-06',
    admissionDate: new Date().toISOString().split('T')[0],
    reason: 'Acute Abdominal Pain & Post-Op High Fever',

    // Step 3: Medical History & Allergies
    diabetes: true,
    hypertension: true,
    heartDisease: false,
    kidneyDisease: false,
    allergies: 'Sulfa Drugs',
    previousSurgeries: 'Appendectomy (2018)',

    // Step 4: Emergency Contact
    contactName: 'Clara Thorne',
    contactRelationship: 'Spouse',
    contactPhone: '+1 (410) 555-0912',
    contactAddress: '742 Evergreen Terrace, Baltimore, MD',

    // Step 5: Assign Staff
    assignedDoctor: 'Dr. Sarah Jenkins, MD',
    assignedNurse: 'RN Marcus Vance'
  });

  if (!isOpen) return null;

  const handleNext = () => setStep((prev) => Math.min(5, prev + 1));
  const handlePrev = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      ward: formData.ward,
      bedNumber: formData.bedNumber,
      admissionDate: formData.admissionDate,
      primaryDiagnosis: formData.reason,
      attendingPhysician: formData.assignedDoctor,
      primaryNurse: formData.assignedNurse,
      riskLevel: 'stable' as SepsisRiskLevel,
      currentPrediction: {
        patientId: `p-${Date.now()}`,
        sepsisProbability: 24.5,
        riskLevel: 'stable' as SepsisRiskLevel,
        confidenceScore: 95.0,
        deteriorationWindowHours: 12.0,
        predictedTime: new Date(Date.now() + 12 * 3600000).toISOString(),
        qSofaScore: 0,
        sofaScore: 1,
        missingDataPenalty: 0.0,
        shapFeatures: [
          {
            featureName: 'Serum Lactate',
            category: 'lab',
            value: '1.4 mmol/L',
            normalRange: '< 2.0 mmol/L',
            impactScore: -0.15,
            direction: 'risk_decrease',
            clinicalDescription: 'Lactate within normal bounds (-15% risk)'
          }
        ],
        nurseActionItems: ['Routine vital monitoring q4h'],
        doctorActionItems: ['Continue current post-op care plan'],
        recommendedObservations: ['Monitor urine output hourly']
      },
      vitalHistory: [
        {
          id: `v-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: 37.2,
          heartRate: 78,
          sysBP: 122,
          diaBP: 78,
          respRate: 16,
          spo2: 98,
          avpu: 'Alert',
          recordedBy: formData.assignedNurse
        }
      ],
      labHistory: [
        {
          id: `l-${Date.now()}`,
          timestamp: new Date().toISOString().split('T')[0],
          wbc: 8.4,
          platelets: 240,
          lactate: 1.4,
          procalcitonin: 0.1,
          creatinine: 0.9,
          bilirubin: 0.8,
          ph: 7.40,
          pao2Fio2: 380,
          bloodCulturePending: false,
          bloodCultureResult: 'Negative'
        }
      ],
      allergies: [{ id: 'alg-1', substance: formData.allergies, reaction: 'Rash', severity: 'Moderate' }],
      medications: [{ id: 'med-1', name: 'Cefazolin 1g IV', dosage: '1g', frequency: 'q8h', route: 'IV', startDate: '2026-08-03', status: 'Active' }],
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      emergencyContacts: [{ name: formData.contactName, relationship: formData.contactRelationship, phone: formData.contactPhone }],
      clinicalDocuments: [{ id: 'doc-1', title: 'Admission Requisition & Consent', type: 'Lab Report', date: '2026-08-03', author: formData.assignedDoctor, fileSize: '1.2 MB' }],
      treatmentBundleStatus: { bloodCultureDrawn: true, broadSpectrumAntibioticsGiven: true, lactateMeasured: true, ivFluidsAdministered: true, vasopressorsStarted: false },
      notes: []
    };

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
              <Hospital className="w-4 h-4" />
              <span>Enterprise Inpatient Admission Wizard</span>
            </div>
            <h2 className="text-xl font-bold text-white">Add New Patient Admission (Step {step} of 5)</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
          {[
            { s: 1, label: 'Demographics', icon: User },
            { s: 2, label: 'Admission', icon: Hospital },
            { s: 3, label: 'History', icon: HeartPulse },
            { s: 4, label: 'Contacts', icon: PhoneCall },
            { s: 5, label: 'Staff Roster', icon: UserCheck }
          ].map((item) => {
            const Icon = item.icon;
            const isDone = step >= item.s;
            return (
              <div
                key={item.s}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                  isDone ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  >
                    <option>O+</option>
                    <option>A+</option>
                    <option>B+</option>
                    <option>AB+</option>
                    <option>O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Admission Details */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Assigned Ward</label>
                  <select
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  >
                    <option>ICU-Alpha</option>
                    <option>Step-Down 3B</option>
                    <option>Emergency Bay</option>
                    <option>Ward 4</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bed Number</label>
                  <input
                    type="text"
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason for Admission / Primary Diagnosis</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 3: Medical History */}
          {step === 3 && (
            <div className="space-y-3">
              <label className="text-slate-400 font-semibold block">Pre-Existing Chronic Conditions</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'diabetes', label: 'Type 2 Diabetes' },
                  { key: 'hypertension', label: 'Hypertension' },
                  { key: 'heartDisease', label: 'Heart Disease' },
                  { key: 'kidneyDisease', label: 'Chronic Kidney Disease' }
                ].map((cond) => (
                  <label key={cond.key} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData as any)[cond.key]}
                      onChange={(e) => setFormData({ ...formData, [cond.key]: e.target.checked })}
                      className="rounded bg-slate-950 text-cyan-500"
                    />
                    <span className="text-slate-200">{cond.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Known Drug Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Emergency Contacts */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Relationship</label>
                  <input
                    type="text"
                    value={formData.contactRelationship}
                    onChange={(e) => setFormData({ ...formData, contactRelationship: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 5: Staff Roster Assignment */}
          {step === 5 && (
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Assigned Attending Physician (MD)</label>
                <select
                  value={formData.assignedDoctor}
                  onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  <option>Dr. Sarah Jenkins, MD</option>
                  <option>Dr. Robert Chen, MD</option>
                  <option>Dr. Michael Vance, MD</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assigned Primary Nurse (RN)</label>
                <select
                  value={formData.assignedNurse}
                  onChange={(e) => setFormData({ ...formData, assignedNurse: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                >
                  <option>RN Marcus Vance</option>
                  <option>RN Elena Rostova</option>
                  <option>RN David Kim</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white font-semibold focus:ring-2 focus:ring-cyan-400"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold focus:ring-2 focus:ring-cyan-400"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold focus:ring-2 focus:ring-cyan-400"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Admit Patient & Generate QR</span>
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
