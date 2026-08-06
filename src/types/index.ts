export type UserRole = 'admin' | 'doctor' | 'nurse' | 'lab_tech';

export type SepsisRiskLevel = 'stable' | 'moderate' | 'high' | 'critical';

export interface SHAPFeature {
  featureName: string;
  category: 'vital' | 'lab' | 'demographic' | 'trend';
  value: string | number;
  normalRange: string;
  impactScore: number; // Positive = increases sepsis risk, Negative = decreases risk
  direction: 'risk_increase' | 'risk_decrease';
  clinicalDescription: string;
}

export interface VitalSignRecord {
  id: string;
  timestamp: string;
  heartRate: number; // bpm
  sysBP: number; // mmHg
  diaBP: number; // mmHg
  respRate: number; // breaths/min
  temperature: number; // °C
  spo2: number; // %
  avpu: 'Alert' | 'Voice' | 'Pain' | 'Unresponsive';
  recordedBy: string;
}

export interface LabResult {
  id: string;
  timestamp: string;
  wbc: number; // 10^9/L (Normal 4.5-11)
  lactate: number; // mmol/L (Normal < 2.0)
  procalcitonin: number; // ng/mL (Normal < 0.1)
  platelets: number; // 10^9/L (Normal 150-450)
  creatinine: number; // mg/dL (Normal 0.6-1.2)
  bilirubin: number; // mg/dL (Normal 0.2-1.2)
  ph: number; // (Normal 7.35-7.45)
  pao2Fio2: number; // mmHg ratio
  bloodCulturePending: boolean;
  bloodCultureResult?: 'Negative' | 'Gram-Positive Cocci' | 'Gram-Negative Rods' | 'Pending';
}

export interface AIPrediction {
  patientId: string;
  sepsisProbability: number; // 0 - 100%
  riskLevel: SepsisRiskLevel;
  confidenceScore: number; // 0 - 100%
  deteriorationWindowHours: number; // e.g. 6.5 hours
  predictedTime: string;
  qSofaScore: number; // 0 - 3
  sofaScore: number; // 0 - 24
  shapFeatures: SHAPFeature[];
  nurseActionItems: string[];
  doctorActionItems: string[];
  recommendedObservations: string[];
  missingDataPenalty: number;
}

export interface Allergy {
  id: string;
  substance: string;
  reaction: string;
  severity: 'Severe (Anaphylaxis)' | 'Moderate' | 'Mild';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  status: 'Active' | 'Discontinued';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface ClinicalDocument {
  id: string;
  title: string;
  type: 'Lab Report' | 'Imaging CXR' | 'CT Scan' | 'Discharge Summary' | 'Consult Note';
  date: string;
  author: string;
  fileSize: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  admissionDate: string;
  ward: string;
  bedNumber: string;
  primaryDiagnosis: string;
  attendingPhysician: string;
  primaryNurse: string;
  riskLevel: SepsisRiskLevel;
  currentPrediction: AIPrediction;
  vitalHistory: VitalSignRecord[];
  labHistory: LabResult[];
  allergies: Allergy[];
  medications: Medication[];
  medicalHistory: string[];
  emergencyContacts: EmergencyContact[];
  clinicalDocuments: ClinicalDocument[];
  treatmentBundleStatus: {
    bloodCultureDrawn: boolean;
    broadSpectrumAntibioticsGiven: boolean;
    lactateMeasured: boolean;
    ivFluidsAdministered: boolean;
    vasopressorsStarted: boolean;
    completedWithinHours?: number;
  };
  notes: Array<{
    id: string;
    timestamp: string;
    author: string;
    role: UserRole;
    text: string;
  }>;
}

export interface WardBed {
  bedId: string;
  bedNumber: string;
  wardName: string;
  patient?: Patient;
  isOccupied: boolean;
  equipmentStatus: {
    telemetryConnected: boolean;
    ivPumpActive: boolean;
    ventilatorConnected: boolean;
  };
}

export interface AlertItem {
  id: string;
  patientId: string;
  patientName: string;
  ward: string;
  bedNumber: string;
  severity: SepsisRiskLevel;
  timestamp: string;
  title: string;
  description: string;
  status: 'active' | 'nurse_acknowledged' | 'doctor_notified' | 'resolved';
  escalationLevel: 'Nurse' | 'Doctor' | 'Chief Medical Officer' | 'Admin';
  acknowledgedBy?: string;
  acknowledgedTime?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}
