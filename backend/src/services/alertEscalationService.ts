import { logger } from '../utils/logger';

export class AlertEscalationService {
  public static async createAlert(patientId: string, patientName: string, ward: string, probability: number) {
    const severity = probability >= 80 ? 'critical' : 'high';
    const alert = {
      id: `alt-${Date.now()}`,
      patientId,
      patientName,
      ward,
      severity,
      timestamp: new Date().toISOString(),
      title: `${severity.toUpperCase()} SEPSIS SHOCK ALERT (${probability}% Probability)`,
      description: `Arterial lactate and MAP parameters exceed safety threshold. Lead-time window active.`,
      status: 'active',
      escalationLevel: 'Nurse'
    };

    logger.info(`CREATED ALERT: ${alert.title} for Patient ${patientName}`);
    return alert;
  }
}
