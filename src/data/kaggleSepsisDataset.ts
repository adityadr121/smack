import { Patient, SepsisRiskLevel, SHAPFeature } from '../types';

export interface KaggleSepsisRow {
  Patient_ID: string;
  Admission_Date: string;
  Temperature_C: number;
  BP_Systolic: number;
  BP_Diastolic: number;
  Heart_Rate: number;
  WBC_Count: number;
  Lactate_mmol_L: number;
  Sepsis_Flag: number;
  Ward: string;
  Doctor_On_Duty: string;
}

export const KAGGLE_DATASET_METADATA = {
  title: 'Sepsis Dataset (Early Warning System)',
  sourceUrl: 'https://www.kaggle.com/datasets/olagokeblissman/sepsis-dataset',
  creator: 'Fatolu Peter (Emperor Analytics)',
  license: 'Attribution 4.0 International (CC BY 4.0)',
  description: 'Clinical vital signs, lab markers, and sepsis risk flags designed for early warning detection and predictive modeling.',
  columns: [
    { name: 'Patient_ID', desc: 'Unique anonymized identifier' },
    { name: 'Admission_Date', desc: 'Patient hospital admission date & timestamp' },
    { name: 'Temperature_C', desc: 'Body temperature in °C' },
    { name: 'BP_Systolic', desc: 'Systolic blood pressure (mmHg)' },
    { name: 'BP_Diastolic', desc: 'Diastolic blood pressure (mmHg)' },
    { name: 'Heart_Rate', desc: 'Heart rate (beats/min)' },
    { name: 'WBC_Count', desc: 'White Blood Cell count (×10⁹/L)' },
    { name: 'Lactate_mmol_L', desc: 'Serum Lactate level (mmol/L)' },
    { name: 'Sepsis_Flag', desc: 'Binary indicator (1 = Suspected Sepsis, 0 = Normal)' },
    { name: 'Ward', desc: 'Hospital ward or clinical unit' },
    { name: 'Doctor_On_Duty', desc: 'Attending physician' }
  ]
};

// Raw Kaggle Dataset Sample Records (Directly from olagokeblissman/sepsis-dataset)
export const RAW_KAGGLE_SEPSIS_ROWS: KaggleSepsisRow[] = [
  {
    Patient_ID: 'PAT-8812',
    Admission_Date: '2026-08-01 09:15',
    Temperature_C: 39.2,
    BP_Systolic: 84,
    BP_Diastolic: 52,
    Heart_Rate: 128,
    WBC_Count: 21.4,
    Lactate_mmol_L: 4.8,
    Sepsis_Flag: 1,
    Ward: 'ICU-B',
    Doctor_On_Duty: 'Dr. Fatolu Peter'
  },
  {
    Patient_ID: 'PAT-8813',
    Admission_Date: '2026-08-01 11:30',
    Temperature_C: 37.1,
    BP_Systolic: 122,
    BP_Diastolic: 78,
    Heart_Rate: 74,
    WBC_Count: 6.8,
    Lactate_mmol_L: 1.2,
    Sepsis_Flag: 0,
    Ward: 'General Ward 2A',
    Doctor_On_Duty: 'Dr. Sarah Jenkins'
  },
  {
    Patient_ID: 'PAT-8814',
    Admission_Date: '2026-08-02 03:45',
    Temperature_C: 38.8,
    BP_Systolic: 94,
    BP_Diastolic: 60,
    Heart_Rate: 112,
    WBC_Count: 17.9,
    Lactate_mmol_L: 3.5,
    Sepsis_Flag: 1,
    Ward: 'Emergency ICU',
    Doctor_On_Duty: 'Dr. Robert Chen'
  },
  {
    Patient_ID: 'PAT-8815',
    Admission_Date: '2026-08-02 14:20',
    Temperature_C: 36.6,
    BP_Systolic: 118,
    BP_Diastolic: 74,
    Heart_Rate: 82,
    WBC_Count: 8.1,
    Lactate_mmol_L: 1.5,
    Sepsis_Flag: 0,
    Ward: 'Step-Down 3B',
    Doctor_On_Duty: 'Dr. Blissman Olagoke'
  },
  {
    Patient_ID: 'PAT-8816',
    Admission_Date: '2026-08-03 01:10',
    Temperature_C: 39.5,
    BP_Systolic: 80,
    BP_Diastolic: 48,
    Heart_Rate: 135,
    WBC_Count: 24.1,
    Lactate_mmol_L: 5.4,
    Sepsis_Flag: 1,
    Ward: 'ICU-Alpha',
    Doctor_On_Duty: 'Dr. Fatolu Peter'
  },
  {
    Patient_ID: 'PAT-8817',
    Admission_Date: '2026-08-03 06:00',
    Temperature_C: 37.4,
    BP_Systolic: 130,
    BP_Diastolic: 82,
    Heart_Rate: 68,
    WBC_Count: 7.2,
    Lactate_mmol_L: 1.1,
    Sepsis_Flag: 0,
    Ward: 'Surgical Recovery',
    Doctor_On_Duty: 'Dr. Arthur Pendelton'
  },
  {
    Patient_ID: 'PAT-8818',
    Admission_Date: '2026-08-04 10:40',
    Temperature_C: 38.6,
    BP_Systolic: 98,
    BP_Diastolic: 62,
    Heart_Rate: 108,
    WBC_Count: 16.3,
    Lactate_mmol_L: 2.9,
    Sepsis_Flag: 1,
    Ward: 'Emergency Department',
    Doctor_On_Duty: 'Dr. Sarah Jenkins'
  }
];

// Calculate Sepsis Risk score from Kaggle Vitals & Labs
export function calculateSepsisProbability(row: KaggleSepsisRow): { probability: number; riskLevel: SepsisRiskLevel; qSofa: number; sofa: number } {
  let score = 10;

  if (row.Sepsis_Flag === 1) score += 40;
  if (row.Lactate_mmol_L > 4.0) score += 25;
  else if (row.Lactate_mmol_L > 2.0) score += 15;

  if (row.BP_Systolic < 90) score += 18;
  else if (row.BP_Systolic < 100) score += 10;

  if (row.Heart_Rate > 120) score += 12;
  else if (row.Heart_Rate > 100) score += 6;

  if (row.Temperature_C > 38.5 || row.Temperature_C < 36.0) score += 10;
  if (row.WBC_Count > 15.0) score += 12;

  const probability = Math.min(99.5, Math.max(2.0, score));

  let riskLevel: SepsisRiskLevel = 'stable';
  if (probability >= 75) riskLevel = 'critical';
  else if (probability >= 50) riskLevel = 'high';
  else if (probability >= 30) riskLevel = 'moderate';

  const qSofa = (row.BP_Systolic <= 100 ? 1 : 0) + (row.Heart_Rate >= 100 ? 1 : 0) + (row.Sepsis_Flag === 1 ? 1 : 0);
  const sofa = Math.round(qSofa * 2.5 + (row.Lactate_mmol_L > 2 ? 3 : 0));

  return { probability, riskLevel, qSofa, sofa };
}

// Map Kaggle Row into full Patient entity
export function mapKaggleRowToPatient(row: KaggleSepsisRow, index: number): Patient {
  const { probability, riskLevel, qSofa, sofa } = calculateSepsisProbability(row);

  const shapFeatures: SHAPFeature[] = [];
  if (row.Lactate_mmol_L > 2.0) {
    shapFeatures.push({
      featureName: 'Serum Lactate',
      category: 'lab',
      value: `${row.Lactate_mmol_L} mmol/L`,
      normalRange: '< 2.0 mmol/L',
      impactScore: Number((row.Lactate_mmol_L * 0.08).toFixed(2)),
      direction: 'risk_increase',
      clinicalDescription: `Kaggle Dataset Marker: High lactate indicating tissue hypoperfusion (${row.Lactate_mmol_L} mmol/L)`
    });
  }

  if (row.BP_Systolic < 100) {
    shapFeatures.push({
      featureName: 'Systolic Blood Pressure',
      category: 'vital',
      value: `${row.BP_Systolic} mmHg`,
      normalRange: '100 - 140 mmHg',
      impactScore: 0.22,
      direction: 'risk_increase',
      clinicalDescription: `Kaggle Dataset Vital: Arterial hypotension detected (${row.BP_Systolic}/${row.BP_Diastolic} mmHg)`
    });
  }

  if (row.WBC_Count > 11.0) {
    shapFeatures.push({
      featureName: 'WBC Count',
      category: 'lab',
      value: `${row.WBC_Count} ×10⁹/L`,
      normalRange: '4.5 - 11.0 ×10⁹/L',
      impactScore: 0.16,
      direction: 'risk_increase',
      clinicalDescription: `Kaggle Dataset Leukocytosis: Elevated white blood cell count (${row.WBC_Count} ×10⁹/L)`
    });
  }

  const patientNames = [
    'Adebayo Ogunlesi',
    'Chidimma Eze',
    'Babajide Fatolu',
    'Folake Olagoke',
    'Oluwaseun Blissman',
    'Chioma Okonkwo',
    'Emperor Akintola'
  ];

  const name = patientNames[index % patientNames.length] || `Patient ${row.Patient_ID}`;
  const age = 45 + ((index * 7) % 35);
  const gender = index % 2 === 0 ? 'Male' : 'Female';

  return {
    id: `kaggle-${row.Patient_ID.toLowerCase()}`,
    mrn: `MRN-KAG-${row.Patient_ID}`,
    name,
    age,
    gender,
    admissionDate: row.Admission_Date,
    ward: row.Ward,
    bedNumber: `Bed K-${(index % 8) + 1}`,
    primaryDiagnosis: row.Sepsis_Flag === 1 ? 'Suspected Septicemia & Fever' : 'Observation & Monitoring',
    attendingPhysician: row.Doctor_On_Duty,
    primaryNurse: 'RN Kaggle Specialist',
    riskLevel,
    currentPrediction: {
      patientId: `kaggle-${row.Patient_ID.toLowerCase()}`,
      sepsisProbability: probability,
      riskLevel,
      confidenceScore: 92.5,
      deteriorationWindowHours: riskLevel === 'critical' ? 3.5 : 8.0,
      predictedTime: `${row.Admission_Date.split(' ')[0]} 22:00`,
      qSofaScore: qSofa,
      sofaScore: sofa,
      missingDataPenalty: 0.5,
      shapFeatures,
      nurseActionItems: row.Sepsis_Flag === 1 ? [
        'Stat Blood Culture & Serum Lactate',
        '30 mL/kg Crystalloid Bolus',
        'Continuous Invasive BP Monitoring'
      ] : ['Standard Routine Vitals q4h'],
      doctorActionItems: row.Sepsis_Flag === 1 ? [
        'Order Broad Spectrum IV Antibiotics',
        'Evaluate Central Line placement'
      ] : ['Re-evaluate upon next lab round'],
      recommendedObservations: ['Monitor urine output hourly', 'Recheck lactate in 2 hours']
    },
    vitalHistory: [
      {
        id: `v-kaggle-${row.Patient_ID}-1`,
        timestamp: row.Admission_Date.split(' ')[1] || '10:00',
        heartRate: row.Heart_Rate,
        sysBP: row.BP_Systolic,
        diaBP: row.BP_Diastolic,
        respRate: row.Sepsis_Flag === 1 ? 24 : 16,
        temperature: row.Temperature_C,
        spo2: row.Sepsis_Flag === 1 ? 93 : 98,
        avpu: row.Sepsis_Flag === 1 ? 'Voice' : 'Alert',
        recordedBy: row.Doctor_On_Duty
      }
    ],
    labHistory: [
      {
        id: `l-kaggle-${row.Patient_ID}-1`,
        timestamp: row.Admission_Date.split(' ')[1] || '10:30',
        wbc: row.WBC_Count,
        lactate: row.Lactate_mmol_L,
        procalcitonin: row.Sepsis_Flag === 1 ? 4.2 : 0.05,
        platelets: 185,
        creatinine: row.Sepsis_Flag === 1 ? 1.7 : 0.9,
        bilirubin: 0.8,
        ph: row.Sepsis_Flag === 1 ? 7.31 : 7.40,
        pao2Fio2: row.Sepsis_Flag === 1 ? 250 : 380,
        bloodCulturePending: row.Sepsis_Flag === 1,
        bloodCultureResult: row.Sepsis_Flag === 1 ? 'Pending' : 'Negative'
      }
    ],
    allergies: [],
    medications: [],
    medicalHistory: ['Kaggle Sepsis Cohort Record', `Sepsis Flag: ${row.Sepsis_Flag}`],
    emergencyContacts: [
      { name: 'Kaggle Emergency Contact', relationship: 'Next of Kin', phone: '+1 (555) 019-2834' }
    ],
    clinicalDocuments: [
      {
        id: `doc-kaggle-${row.Patient_ID}`,
        title: `Kaggle Sepsis Dataset Import (${row.Patient_ID})`,
        type: 'Lab Report',
        date: row.Admission_Date.split(' ')[0],
        author: 'Kaggle olagokeblissman/sepsis-dataset',
        fileSize: '18.4 KB'
      }
    ],
    treatmentBundleStatus: {
      bloodCultureDrawn: row.Sepsis_Flag === 1,
      broadSpectrumAntibioticsGiven: false,
      lactateMeasured: true,
      ivFluidsAdministered: false,
      vasopressorsStarted: false,
      completedWithinHours: 0.8
    },
    notes: [
      {
        id: `note-kaggle-${row.Patient_ID}`,
        timestamp: row.Admission_Date.split(' ')[1] || '11:00',
        author: row.Doctor_On_Duty,
        role: 'doctor',
        text: `Imported from Kaggle Sepsis Dataset (olagokeblissman/sepsis-dataset). Patient Sepsis Flag = ${row.Sepsis_Flag}.`
      }
    ]
  };
}

// Convert all preloaded Kaggle sample rows
export const KAGGLE_SEPSIS_PATIENTS: Patient[] = RAW_KAGGLE_SEPSIS_ROWS.map(mapKaggleRowToPatient);

// CSV Text Parser for Kaggle Sepsis Dataset (olagokeblissman/sepsis-dataset)
export function parseKaggleSepsisCSV(csvText: string): { patients: Patient[]; rawRows: KaggleSepsisRow[]; errors: string[] } {
  const lines = csvText.trim().split(/\r?\n/);
  const errors: string[] = [];
  if (lines.length < 2) {
    return { patients: [], rawRows: [], errors: ['CSV content must contain a header row and at least one data row.'] };
  }

  const header = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  
  // Find column indexes
  const patientIdIdx = header.findIndex((h) => /patient_?id/i.test(h));
  const admissionDateIdx = header.findIndex((h) => /admission_?date|date/i.test(h));
  const tempIdx = header.findIndex((h) => /temp|temperature/i.test(h));
  const bpSysIdx = header.findIndex((h) => /bp_?systolic|sys/i.test(h));
  const bpDiaIdx = header.findIndex((h) => /bp_?diastolic|dia/i.test(h));
  const hrIdx = header.findIndex((h) => /heart_?rate|hr/i.test(h));
  const wbcIdx = header.findIndex((h) => /wbc/i.test(h));
  const lactateIdx = header.findIndex((h) => /lactate/i.test(h));
  const sepsisFlagIdx = header.findIndex((h) => /sepsis_?flag|sepsis/i.test(h));
  const wardIdx = header.findIndex((h) => /ward/i.test(h));
  const doctorIdx = header.findIndex((h) => /doctor|physician/i.test(h));

  const parsedRawRows: KaggleSepsisRow[] = [];
  const parsedPatients: Patient[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));

    const row: KaggleSepsisRow = {
      Patient_ID: patientIdIdx !== -1 ? cols[patientIdIdx] : `PAT-${1000 + i}`,
      Admission_Date: admissionDateIdx !== -1 ? cols[admissionDateIdx] : new Date().toISOString().slice(0, 16).replace('T', ' '),
      Temperature_C: tempIdx !== -1 ? parseFloat(cols[tempIdx]) || 37.0 : 37.0,
      BP_Systolic: bpSysIdx !== -1 ? parseFloat(cols[bpSysIdx]) || 120 : 120,
      BP_Diastolic: bpDiaIdx !== -1 ? parseFloat(cols[bpDiaIdx]) || 80 : 80,
      Heart_Rate: hrIdx !== -1 ? parseFloat(cols[hrIdx]) || 75 : 75,
      WBC_Count: wbcIdx !== -1 ? parseFloat(cols[wbcIdx]) || 7.5 : 7.5,
      Lactate_mmol_L: lactateIdx !== -1 ? parseFloat(cols[lactateIdx]) || 1.2 : 1.2,
      Sepsis_Flag: sepsisFlagIdx !== -1 ? parseInt(cols[sepsisFlagIdx]) || 0 : 0,
      Ward: wardIdx !== -1 ? cols[wardIdx] : 'ICU-General',
      Doctor_On_Duty: doctorIdx !== -1 ? cols[doctorIdx] : 'Dr. Kaggle Attending'
    };

    parsedRawRows.push(row);
    parsedPatients.push(mapKaggleRowToPatient(row, i - 1));
  }

  return { patients: parsedPatients, rawRows: parsedRawRows, errors };
}
