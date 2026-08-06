import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Initial In-Memory Patients Store matching frontend clinical types
let PATIENTS_STORE: any[] = [
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
        bloodCultureStatus: 'pending',
        orderedBy: 'Dr. Sarah'
      },
      {
        id: 'l-101-2',
        timestamp: '19:30',
        wbc: 19.8,
        lactate: 4.2,
        procalcitonin: 4.5,
        platelets: 112,
        creatinine: 1.9,
        bilirubin: 1.6,
        ph: 7.28,
        pao2Fio2: 240,
        bloodCultureStatus: 'positive',
        orderedBy: 'Dr. Sarah'
      }
    ]
  },
  {
    id: 'p-102',
    mrn: 'MRN-492011',
    name: 'Arthur Pendelton',
    age: 74,
    gender: 'Male',
    admissionDate: '2026-08-02 09:15',
    ward: 'ICU-Alpha',
    bedNumber: 'Bed A-02',
    primaryDiagnosis: 'Community-Acquired Pneumonia & COPD',
    attendingPhysician: 'Dr. Chen Wei, MD',
    primaryNurse: 'RN Elena Rostova',
    riskLevel: 'high',
    currentPrediction: {
      patientId: 'p-102',
      sepsisProbability: 64.2,
      riskLevel: 'high',
      confidenceScore: 89.5,
      deteriorationWindowHours: 7.2,
      predictedTime: '2026-08-04 03:00',
      qSofaScore: 2,
      sofaScore: 5,
      missingDataPenalty: 1.0,
      shapFeatures: [
        { featureName: 'Respiratory Rate', category: 'vital', value: '24 /min', normalRange: '12 - 20 /min', impactScore: 0.24, direction: 'risk_increase', clinicalDescription: 'Tachypnea (+24%)' },
        { featureName: 'Serum Lactate', category: 'lab', value: '2.8 mmol/L', normalRange: '< 2.0 mmol/L', impactScore: 0.21, direction: 'risk_increase', clinicalDescription: 'Elevated lactate (+21%)' }
      ],
      nurseActionItems: ['Maintain O2 saturation > 92%', 'Hourly vitals monitoring'],
      doctorActionItems: ['Consider ABG analysis', 'Review antibiotic coverage'],
      recommendedObservations: ['SpO2 trend', 'Lactate re-check']
    },
    vitalHistory: [
      { id: 'v-102-1', timestamp: '16:00', heartRate: 92, sysBP: 110, diaBP: 70, respRate: 20, temperature: 38.0, spo2: 94, avpu: 'Alert', recordedBy: 'RN Elena' },
      { id: 'v-102-2', timestamp: '20:00', heartRate: 104, sysBP: 102, diaBP: 64, respRate: 24, temperature: 38.5, spo2: 92, avpu: 'Alert', recordedBy: 'RN Elena' }
    ],
    labHistory: [
      { id: 'l-102-1', timestamp: '17:00', wbc: 15.2, lactate: 2.8, procalcitonin: 1.4, platelets: 190, creatinine: 1.3, bilirubin: 0.9, ph: 7.34, pao2Fio2: 280, bloodCultureStatus: 'pending', orderedBy: 'Dr. Chen' }
    ]
  }
];

export class PatientController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    logger.info(`Fetching all patient EHR records. Total: ${PATIENTS_STORE.length}`);
    res.status(200).json({
      success: true,
      count: PATIENTS_STORE.length,
      data: PATIENTS_STORE
    });
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    logger.info(`Fetching EHR detail for patient ${id}`);
    const patient = PATIENTS_STORE.find((p) => p.id === id);

    if (!patient) {
      res.status(404).json({ success: false, message: `Patient with ID ${id} not found` });
      return;
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  }

  public static async create(req: Request, res: Response): Promise<void> {
    const patientData = req.body;
    const newId = `p-${Date.now()}`;
    logger.info(`Admitting new patient: ${patientData.name || 'New Patient'}`);

    const newPatient = {
      id: newId,
      mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      admissionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      vitalHistory: [],
      labHistory: [],
      riskLevel: 'moderate',
      currentPrediction: {
        patientId: newId,
        sepsisProbability: 25.0,
        riskLevel: 'moderate',
        confidenceScore: 85.0,
        deteriorationWindowHours: 12.0,
        predictedTime: new Date().toISOString(),
        qSofaScore: 1,
        sofaScore: 2,
        missingDataPenalty: 0.5,
        shapFeatures: [],
        nurseActionItems: ['Routine vital sign checks'],
        doctorActionItems: ['Review admission lab panel'],
        recommendedObservations: ['Standard ward observation']
      },
      ...patientData,
      status: 'Admitted'
    };

    PATIENTS_STORE.unshift(newPatient);

    res.status(201).json({
      success: true,
      message: 'Inpatient admission requisition created successfully',
      data: newPatient
    });
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    logger.info(`Soft deleting patient EHR ${id}`);
    PATIENTS_STORE = PATIENTS_STORE.filter((p) => p.id !== id);
    res.status(200).json({ success: true, message: `Patient EHR ${id} soft deleted` });
  }
}
