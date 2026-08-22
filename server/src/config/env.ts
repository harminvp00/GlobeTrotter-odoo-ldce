import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  PORT: z.coerce.number().default(5000),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required').default(
    process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || 'supersecretkey'
  ),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default(
    process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173'
  ),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables. Please check your .env file.');
}

export const env = _env.data;
