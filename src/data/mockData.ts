import { Patient, WardBed, AlertItem, AuditLog } from '../types';
import { KAGGLE_SEPSIS_PATIENTS } from './kaggleSepsisDataset';

export const INITIAL_PATIENTS: Patient[] = [
  ...KAGGLE_SEPSIS_PATIENTS,
  {
    id: 'p-101',
    mrn: 'MRN-884920',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    admissionDate: '2026-08-01 14:30',
    ward: 'ICU-Alpha',
    bedNumber: 'Bed A-04',
    primaryDiagnosis: 'Post-op Bowel Resection & Fever',
    attendingPhysician: 'Dr. Sarah Jenkins, MD',
    primaryNurse: 'RN Marcus Vance',
    riskLevel: 'critical',
    currentPrediction: {
      patientId: 'p-101',
      sepsisProbability: 87.4,
      riskLevel: 'critical',
      confidenceScore: 94.2,
      deteriorationWindowHours: 4.5,
      predictedTime: '2026-08-03 21:00',
      qSofaScore: 3,
      sofaScore: 9,
      missingDataPenalty: 2.1,
      shapFeatures: [
        {
          featureName: 'Serum Lactate',
          category: 'lab',
          value: '4.2 mmol/L',
          normalRange: '< 2.0 mmol/L',
          impactScore: 0.32,
          direction: 'risk_increase',
          clinicalDescription: 'Severe systemic hypoperfusion & cellular hypoxia indicator (+32% sepsis risk)'
        },
        {
          featureName: 'Mean Arterial Pressure (MAP)',
          category: 'vital',
          value: '58 mmHg',
          normalRange: '70 - 100 mmHg',
          impactScore: 0.26,
          direction: 'risk_increase',
          clinicalDescription: 'Refractory arterial hypotension despite initial fluid bolus (+26% sepsis risk)'
        },
        {
          featureName: 'WBC Count (Leukocytosis)',
          category: 'lab',
          value: '19.8 × 10⁹/L',
          normalRange: '4.5 - 11.0 × 10⁹/L',
          impactScore: 0.18,
          direction: 'risk_increase',
          clinicalDescription: 'Marked leukocytosis with 14% immature bandemia (+18% sepsis risk)'
        },
        {
          featureName: 'Core Temperature',
          category: 'vital',
          value: '39.1 °C',
          normalRange: '36.5 - 37.5 °C',
          impactScore: 0.12,
          direction: 'risk_increase',
          clinicalDescription: 'Sustained hyperthermia meeting SIRS criteria (+12% risk)'
        }
      ],
      nurseActionItems: [
        'Draw blood cultures × 2 sets immediately before IV antibiotic administration',
        'Initiate 30 mL/kg IV crystalloid fluid bolus for MAP < 65 mmHg',
        'Re-check vital signs & arterial blood gas every 15 minutes',
        'Notify attending physician & ICU outreach team'
      ],
      doctorActionItems: [
        'Order broad-spectrum IV antibiotics (Meropenem 1g + Vancomycin 1.5g)',
        'Evaluate Central Venous Pressure (CVP) & arterial line placement',
        'Prepare Norepinephrine infusion if MAP remains < 65 mmHg after fluids',
        'Obtain bedside echocardiogram & repeat serum lactate in 2 hours'
      ],
      recommendedObservations: [
        'Continuous invasive blood pressure arterial monitoring',
        'Hourly urine output tracking (Target > 0.5 mL/kg/hr)',
        'Repeat Lactate & Procalcitonin at 22:00'
      ]
    },
    vitalHistory: [
      { id: 'v-101-1', timestamp: '14:00', heartRate: 98, sysBP: 118, diaBP: 74, respRate: 18, temperature: 37.8, spo2: 97, avpu: 'Alert', recordedBy: 'RN Marcus' },
      { id: 'v-101-2', timestamp: '16:00', heartRate: 110, sysBP: 104, diaBP: 66, respRate: 22, temperature: 38.4, spo2: 95, avpu: 'Alert', recordedBy: 'RN Marcus' },
      { id: 'v-101-3', timestamp: '18:00', heartRate: 124, sysBP: 92, diaBP: 58, respRate: 26, temperature: 38.9, spo2: 93, avpu: 'Voice', recordedBy: 'RN Marcus' },
      { id: 'v-101-4', timestamp: '20:00', heartRate: 132, sysBP: 84, diaBP: 50, respRate: 28, temperature: 39.1, spo2: 91, avpu: 'Voice', recordedBy: 'RN Marcus' }
    ],
    labHistory: [
      {
        id: 'l-101-1',
        timestamp: '15:00',
        wbc: 12.4,
        lactate: 1.8,
        procalcitonin: 0.8,
        platelets: 165,
        creatinine: 1.1,
        bilirubin: 0.8,
        ph: 7.38,
        pao2Fio2: 320,
        bloodCulturePending: true,
        bloodCultureResult: 'Pending'
      },
      {
        id: 'l-101-2',
        timestamp: '19:30',
        wbc: 19.8,
        lactate: 4.2,
        procalcitonin: 5.8,
        platelets: 92,
        creatinine: 1.9,
        bilirubin: 1.6,
        ph: 7.28,
        pao2Fio2: 240,
        bloodCulturePending: false,
        bloodCultureResult: 'Gram-Negative Rods'
      }
    ],
    allergies: [
      { id: 'alg-1', substance: 'Penicillin VK', reaction: 'Anaphylaxis & Bronchospasm', severity: 'Severe (Anaphylaxis)' },
      { id: 'alg-2', substance: 'Sulfa Drugs (TMP-SMX)', reaction: 'Generalized Urticarial Rash', severity: 'Moderate' }
    ],
    medications: [
      { id: 'med-1', name: 'Meropenem IV', dosage: '1g', frequency: 'q8h', route: 'IV Infusion', startDate: '2026-08-03', status: 'Active' },
      { id: 'med-2', name: 'Norepinephrine', dosage: '0.15 mcg/kg/min', frequency: 'Continuous', route: 'Central IV Line', startDate: '2026-08-03', status: 'Active' },
      { id: 'med-3', name: 'Pantoprazole', dosage: '40mg', frequency: 'Daily', route: 'IV Push', startDate: '2026-08-01', status: 'Active' }
    ],
    medicalHistory: ['Type 2 Diabetes Mellitus (12 yrs)', 'Hypertension', 'Post-Op Sigmoid Resection (Day 2)'],
    emergencyContacts: [
      { name: 'Robert Vance', relationship: 'Spouse', phone: '+1 (555) 234-8910' },
      { name: 'Emily Vance', relationship: 'Daughter', phone: '+1 (555) 987-6543' }
    ],
    clinicalDocuments: [
      { id: 'doc-1', title: 'Post-Op Operative Report (Bowel Resection)', type: 'Consult Note', date: '2026-08-01', author: 'Dr. Arthur Pendelton, MD', fileSize: '1.4 MB' },
      { id: 'doc-2', title: 'Portable Chest X-Ray (CXR - Atelectasis vs Pneumonia)', type: 'Imaging CXR', date: '2026-08-03', author: 'Dr. Radiology Specialist', fileSize: '4.8 MB' },
      { id: 'doc-3', title: 'Gram Negative Blood Culture Lab Report', type: 'Lab Report', date: '2026-08-03', author: 'Central Microbiology Lab', fileSize: '850 KB' }
    ],
    treatmentBundleStatus: {
      bloodCultureDrawn: true,
      broadSpectrumAntibioticsGiven: true,
      lactateMeasured: true,
      ivFluidsAdministered: false,
      vasopressorsStarted: false,
      completedWithinHours: 1.2
    },
    notes: [
      { id: 'n-1', timestamp: '19:45', author: 'Dr. Sarah Jenkins', role: 'doctor', text: 'Sepsis alert triggered. Patient exhibiting septic shock signs. Administered IV Cefepime and ordered stat fluid challenge.' }
    ]
  },
  {
    id: 'p-102',
    mrn: 'MRN-449102',
    name: 'Arthur Pendelton',
    age: 74,
    gender: 'Male',
    admissionDate: '2026-08-02 08:15',
    ward: 'Step-Down 3B',
    bedNumber: 'Bed B-12',
    primaryDiagnosis: 'Severe Pneumonia & COPD Exacerbation',
    attendingPhysician: 'Dr. Robert Chen, MD',
    primaryNurse: 'RN Elena Rostova',
    riskLevel: 'high',
    currentPrediction: {
      patientId: 'p-102',
      sepsisProbability: 68.2,
      riskLevel: 'high',
      confidenceScore: 91.0,
      deteriorationWindowHours: 7.2,
      predictedTime: '2026-08-04 03:30',
      qSofaScore: 2,
      sofaScore: 5,
      missingDataPenalty: 1.5,
      shapFeatures: [
        {
          featureName: 'Respiration Rate',
          category: 'vital',
          value: '26 /min',
          normalRange: '12 - 20 /min',
          impactScore: 0.24,
          direction: 'risk_increase',
          clinicalDescription: 'Tachypnea indicating compensatory respiratory alkalosis for metabolic acidosis (+24%)'
        },
        {
          featureName: 'Procalcitonin',
          category: 'lab',
          value: '2.4 ng/mL',
          normalRange: '< 0.1 ng/mL',
          impactScore: 0.19,
          direction: 'risk_increase',
          clinicalDescription: 'Elevated biomarkers confirming bacterial etiology over viral (+19%)'
        }
      ],
      nurseActionItems: ['Increase nasal cannula O2 to maintain SpO2 ≥ 92%', 'Perform arterial blood gas (ABG) sampling'],
      doctorActionItems: ['Consider transfer to ICU if O2 requirements exceed 6L/min'],
      recommendedObservations: ['Check vitals q30m', 'Repeat lactate in 4h']
    },
    vitalHistory: [
      { id: 'v-102-1', timestamp: '12:00', heartRate: 88, sysBP: 126, diaBP: 80, respRate: 20, temperature: 37.4, spo2: 95, avpu: 'Alert', recordedBy: 'RN Elena' },
      { id: 'v-102-2', timestamp: '16:00', heartRate: 102, sysBP: 114, diaBP: 72, respRate: 24, temperature: 38.2, spo2: 92, avpu: 'Alert', recordedBy: 'RN Elena' }
    ],
    labHistory: [
      {
        id: 'l-102-1',
        timestamp: '17:00',
        wbc: 15.2,
        lactate: 2.6,
        procalcitonin: 2.4,
        platelets: 210,
        creatinine: 1.3,
        bilirubin: 0.9,
        ph: 7.34,
        pao2Fio2: 280,
        bloodCulturePending: true,
        bloodCultureResult: 'Pending'
      }
    ],
    allergies: [
      { id: 'alg-3', substance: 'Codeine', reaction: 'Severe Nausea & Vomiting', severity: 'Moderate' }
    ],
    medications: [
      { id: 'med-4', name: 'Levofloxacin', dosage: '750mg', frequency: 'Daily', route: 'Oral', startDate: '2026-08-02', status: 'Active' },
      { id: 'med-5', name: 'Tiotropium Inhaler', dosage: '18mcg', frequency: 'Daily', route: 'Inhalation', startDate: '2026-08-02', status: 'Active' }
    ],
    medicalHistory: ['COPD Gold Stage III', 'Coronary Artery Disease', 'Ex-smoker (45 pack-years)'],
    emergencyContacts: [
      { name: 'Margaret Pendelton', relationship: 'Spouse', phone: '+1 (555) 345-6789' }
    ],
    clinicalDocuments: [
      { id: 'doc-4', title: 'Chest CT Angiogram Report', type: 'CT Scan', date: '2026-08-02', author: 'Dr. Radiology Specialist', fileSize: '12.1 MB' }
    ],
    treatmentBundleStatus: {
      bloodCultureDrawn: true,
      broadSpectrumAntibioticsGiven: true,
      lactateMeasured: true,
      ivFluidsAdministered: true,
      vasopressorsStarted: false,
      completedWithinHours: 2.5
    },
    notes: [
      { id: 'n-3', timestamp: '20:10', author: 'RN Elena Rostova', role: 'nurse', text: 'Oxygen requirement increased. Notified Dr. Chen.' }
    ]
  }
];

export const INITIAL_BEDS: WardBed[] = [
  { bedId: 'b-1', bedNumber: 'Bed A-01', wardName: 'ICU-Alpha', isOccupied: false, equipmentStatus: { telemetryConnected: true, ivPumpActive: false, ventilatorConnected: true } },
  { bedId: 'b-2', bedNumber: 'Bed A-04', wardName: 'ICU-Alpha', isOccupied: true, patient: INITIAL_PATIENTS[0], equipmentStatus: { telemetryConnected: true, ivPumpActive: true, ventilatorConnected: false } },
  { bedId: 'b-3', bedNumber: 'Bed B-12', wardName: 'Step-Down 3B', isOccupied: true, patient: INITIAL_PATIENTS[1], equipmentStatus: { telemetryConnected: true, ivPumpActive: true, ventilatorConnected: false } }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    patientId: 'p-101',
    patientName: 'Eleanor Vance',
    ward: 'ICU-Alpha',
    bedNumber: 'Bed A-04',
    severity: 'critical',
    timestamp: '10 mins ago',
    title: 'CRITICAL SEPSIS SHOCK ALERT (87.4% Risk)',
    description: 'Arterial Lactate 4.2 mmol/L; MAP collapsed to 58 mmHg.',
    status: 'active',
    escalationLevel: 'Doctor'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-08-03 20:10:14', user: 'Dr. Sarah Jenkins', role: 'doctor', action: 'INTERVENTION_ORDER', details: 'Ordered Stat Meropenem 1g IV for Eleanor Vance', ipAddress: '10.204.12.88' }
];
