import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.path} - Error: ${err.message || err}`);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      message: 'Input parameter validation failed',
      errors: err.errors
    });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected clinical engine error occurred.',
    timestamp: new Date().toISOString()
  });
};
