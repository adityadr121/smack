import { Patient, VitalSignRecord, LabResult } from '../types';

const API_BASE = '/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('sepsissense_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Health Check
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (err) {
      return { status: 'OFFLINE', error: err };
    }
  },

  // Patients API
  async getPatients(): Promise<Patient[]> {
    const res = await fetch(`${API_BASE}/patients`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch patients');
    const data = await res.json();
    return data.data;
  },

  async getPatientById(id: string): Promise<Patient> {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch patient ${id}`);
    const data = await res.json();
    return data.data;
  },

  async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(patientData)
    });
    if (!res.ok) throw new Error('Failed to create patient record');
    const data = await res.json();
    return data.data;
  },

  // Vitals API
  async addVitals(vitalsData: Partial<VitalSignRecord> & { patientId: string }) {
    const res = await fetch(`${API_BASE}/vitals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vitalsData)
    });
    if (!res.ok) throw new Error('Failed to add vitals');
    return await res.json();
  },

  async getVitalsHistory(patientId: string) {
    const res = await fetch(`${API_BASE}/vitals/history?patientId=${patientId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch vitals history');
    return await res.json();
  },

  // Lab Results API
  async addLabResult(labData: Partial<LabResult> & { patientId: string }) {
    const res = await fetch(`${API_BASE}/labs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(labData)
    });
    if (!res.ok) throw new Error('Failed to record lab result');
    return await res.json();
  },

  // AI Prediction API
  async runPrediction(predictionInput: Record<string, any>) {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(predictionInput)
    });
    if (!res.ok) throw new Error('AI Sepsis Prediction service error');
    const data = await res.json();
    return data.data;
  },

  // Hospital Analytics API
  async getHospitalAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/hospital`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch hospital metrics');
    const data = await res.json();
    return data.data;
  }
};
