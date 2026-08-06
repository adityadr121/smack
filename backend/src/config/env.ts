import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  JWT_SECRET: z.string().default('sepsissense_jwt_secret_key_3.2_production_2026'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/sepsissensedb?schema=public'),
  AI_FASTAPI_SERVICE_URL: z.string().default('http://localhost:8000')
});

export const env = envSchema.parse(process.env);
