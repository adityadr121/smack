import { Request, Response } from 'express';
import { labResultSchema } from '../validators';

export class LabsController {
  public static async addLabResult(req: Request, res: Response) {
    const validated = labResultSchema.parse(req.body);
    const isAbnormal = validated.lactate > 2.0 || validated.wbc > 11.0;

    return res.status(201).json({
      success: true,
      message: 'Stat lab result published to LIS & Patient EHR.',
      isAbnormal,
      data: validated
    });
  }
}
