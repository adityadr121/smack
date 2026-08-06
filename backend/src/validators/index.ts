import { z } from 'zod';

export const vitalSignSchema = z.object({
  patientId: z.string().min(1),
  heartRate: z.number().min(30).max(220),
  sysBP: z.number().min(40).max(240),
  diaBP: z.number().min(20).max(160),
  respRate: z.number().min(6).max(60),
  temperature: z.number().min(33.0).max(43.0),
  spo2: z.number().min(50).max(100),
  avpu: z.enum(['Alert', 'Voice', 'Pain', 'Unresponsive']).default('Alert'),
  recordedBy: z.string().default('Clinical Nurse')
});

export const labResultSchema = z.object({
  patientId: z.string().min(1),
  wbc: z.number().min(0.1).max(100.0),
  lactate: z.number().min(0.1).max(25.0),
  procalcitonin: z.number().min(0.01).max(100.0),
  platelets: z.number().min(1).max(1000),
  creatinine: z.number().min(0.1).max(15.0),
  bloodCultureResult: z.enum(['Pending', 'Gram-Negative Rods', 'Gram-Positive Cocci', 'Negative']).default('Pending')
});

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'DOCTOR', 'NURSE', 'LAB_TECH']).default('DOCTOR')
});
