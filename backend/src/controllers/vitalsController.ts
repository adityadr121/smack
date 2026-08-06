import { Request, Response } from 'express';
import { vitalSignSchema } from '../validators';
import { AIPredictionService } from '../services/aiPredictionService';

export class VitalsController {
  public static async addVitals(req: Request, res: Response) {
    const validated = vitalSignSchema.parse(req.body);
    const prediction = await AIPredictionService.runPrediction(validated);

    return res.status(201).json({
      success: true,
      message: 'Vital signs logged successfully. AI risk prediction updated.',
      data: {
        vitalRecord: validated,
        prediction
      }
    });
  }

  public static async getHistory(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      data: [
        { id: 'v-1', timestamp: '14:00', heartRate: 98, sysBP: 118, diaBP: 74, respRate: 18, temperature: 37.8, spo2: 97 },
        { id: 'v-2', timestamp: '18:00', heartRate: 124, sysBP: 92, diaBP: 58, respRate: 26, temperature: 38.9, spo2: 93 }
      ]
    });
  }
}
