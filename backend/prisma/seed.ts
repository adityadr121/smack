import { PrismaClient, Role, SepsisRiskLevel, BedStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SepsisSense AI Enterprise Database Seed Engine...');

  // 1. Create Hospital
  const hospital = await prisma.hospital.upsert({
    where: { id: 'hosp-001' },
    update: {},
    create: {
      id: 'hosp-001',
      name: 'Johns Hopkins Health System',
      address: '1800 Orleans St',
      city: 'Baltimore',
      state: 'MD',
      country: 'USA',
      phone: '+1 (410) 955-5000',
      bedCapacity: 250,
      wardCapacity: 12
    }
  });

  // 2. Create Departments
  const icuDept = await prisma.department.upsert({
    where: { id: 'dept-icu' },
    update: {},
    create: { id: 'dept-icu', hospitalId: hospital.id, name: 'Intensive Care Unit', code: 'ICU' }
  });

  const stepDownDept = await prisma.department.upsert({
    where: { id: 'dept-stepdown' },
    update: {},
    create: { id: 'dept-stepdown', hospitalId: hospital.id, name: 'Step-Down Unit', code: 'SDU' }
  });

  // 3. Create Wards
  const icuWard = await prisma.ward.upsert({
    where: { id: 'ward-icu-alpha' },
    update: {},
    create: { id: 'ward-icu-alpha', departmentId: icuDept.id, name: 'ICU-Alpha', wardType: 'Critical Care', capacity: 10, currentOccupancy: 4, floorNumber: 3 }
  });

  const stepDownWard = await prisma.ward.upsert({
    where: { id: 'ward-stepdown-3b' },
    update: {},
    create: { id: 'ward-stepdown-3b', departmentId: stepDownDept.id, name: 'Step-Down 3B', wardType: 'Progressive Care', capacity: 15, currentOccupancy: 6, floorNumber: 3 }
  });

  // 4. Create Users (RBAC Roster)
  const doctorUser = await prisma.user.upsert({
    where: { email: 's.jenkins@johns-hopkins-health.org' },
    update: {},
    create: {
      id: 'usr-md-101',
      email: 's.jenkins@johns-hopkins-health.org',
      passwordHash: '$2a$10$w8c4Lg6gL2Xk6X8q8X8q8eX8q8X8q8X8q8X8q8X8q8X8q8X8q8X8q', // hashed 'password123'
      fullName: 'Dr. Sarah Jenkins, MD',
      phone: '+1 (410) 555-0192',
      role: Role.DOCTOR,
      hospitalId: hospital.id,
      departmentId: icuDept.id
    }
  });

  const nurseUser = await prisma.user.upsert({
    where: { email: 'm.vance@johns-hopkins-health.org' },
    update: {},
    create: {
      id: 'usr-rn-201',
      email: 'm.vance@johns-hopkins-health.org',
      passwordHash: '$2a$10$w8c4Lg6gL2Xk6X8q8X8q8eX8q8X8q8X8q8X8q8X8q8X8q8X8q8X8q',
      fullName: 'RN Marcus Vance',
      phone: '+1 (410) 555-0198',
      role: Role.NURSE,
      hospitalId: hospital.id,
      departmentId: icuDept.id
    }
  });

  // 5. Create Patient: Eleanor Vance
  const patientEleanor = await prisma.patient.upsert({
    where: { mrn: 'MRN-884920' },
    update: {},
    create: {
      id: 'p-101',
      hospitalId: hospital.id,
      mrn: 'MRN-884920',
      name: 'Eleanor Vance',
      age: 68,
      gender: 'Female',
      bloodGroup: 'A+',
      height: 165,
      weight: 72,
      primaryDiagnosis: 'Post-op Bowel Resection & Fever',
      riskLevel: SepsisRiskLevel.CRITICAL,
      wardId: icuWard.id,
      bedNumber: 'Bed A-04',
      attendingDoctorId: doctorUser.id,
      primaryNurseId: nurseUser.id,
      medicalHistory: JSON.stringify(['Type 2 Diabetes Mellitus', 'Hypertension', 'Post-Op Bowel Resection']),
      allergiesJson: JSON.stringify([{ substance: 'Penicillin VK', reaction: 'Anaphylaxis', severity: 'Severe' }]),
      emergencyContacts: JSON.stringify([{ name: 'Robert Vance', relationship: 'Spouse', phone: '+1 (555) 234-8910' }])
    }
  });

  // 6. Create Telemetry Vitals
  await prisma.vitalSign.createMany({
    data: [
      { patientId: patientEleanor.id, temperature: 37.8, heartRate: 98, sysBP: 118, diaBP: 74, respRate: 18, spo2: 97, recordedById: nurseUser.id },
      { patientId: patientEleanor.id, temperature: 38.9, heartRate: 124, sysBP: 92, diaBP: 58, respRate: 26, spo2: 93, recordedById: nurseUser.id },
      { patientId: patientEleanor.id, temperature: 39.1, heartRate: 132, sysBP: 84, diaBP: 50, respRate: 28, spo2: 91, recordedById: nurseUser.id }
    ]
  });

  // 7. Create Laboratory Reports
  await prisma.laboratoryReport.create({
    data: {
      patientId: patientEleanor.id,
      wbc: 19.8,
      platelets: 92,
      lactate: 4.2,
      procalcitonin: 5.8,
      creatinine: 1.9,
      bloodCultureResult: 'Gram-Negative Rods'
    }
  });

  // 8. Create AI Prediction
  await prisma.aIPrediction.create({
    data: {
      patientId: patientEleanor.id,
      sepsisProbability: 87.4,
      riskLevel: SepsisRiskLevel.CRITICAL,
      confidenceScore: 94.2,
      deteriorationWindow: 4.5,
      qSofaScore: 3,
      sofaScore: 9,
      shapExplanationJson: JSON.stringify([
        { featureName: 'Serum Lactate', impactScore: 0.32, value: '4.2 mmol/L' },
        { featureName: 'MAP', impactScore: 0.26, value: '58 mmHg' }
      ]),
      recommendedActions: JSON.stringify(['Draw blood cultures × 2', 'Start Meropenem 1g IV', 'IV Fluid Bolus 30 mL/kg'])
    }
  });

  // 9. Create Alert Escalation
  await prisma.alertEscalation.create({
    data: {
      patientId: patientEleanor.id,
      severity: SepsisRiskLevel.CRITICAL,
      title: 'CRITICAL SEPSIS SHOCK ALERT (87.4% Risk)',
      description: 'Lactate 4.2 mmol/L, MAP collapsed to 58 mmHg.',
      status: 'active',
      escalationLevel: 'Doctor'
    }
  });

  console.log('✅ Enterprise SepsisSense AI Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
