import { Request, Response } from 'express';
import { AIPredictionService } from '../services/aiPredictionService';

export class PredictionController {
  public static async predict(req: Request, res: Response) {
    const { patientId, heartRate, sysBP, diaBP, respRate, temperature, spo2, lactate, wbc } = req.body;

    const prediction = await AIPredictionService.runPrediction({
      patientId: patientId || 'p-101',
      heartRate: Number(heartRate) || 124,
      sysBP: Number(sysBP) || 90,
      diaBP: Number(diaBP) || 58,
      respRate: Number(respRate) || 26,
      temperature: Number(temperature) || 38.9,
      spo2: Number(spo2) || 92,
      lactate: Number(lactate) || 4.2,
      wbc: Number(wbc) || 19.8
    });

    return res.status(200).json({
      success: true,
      message: 'AI Sepsis Prediction & SHAP feature attributions calculated successfully',
      data: prediction
    });
  }
}
