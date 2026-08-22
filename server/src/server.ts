import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import apiRouter from './routes';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', database: 'CONNECTED' });
  } catch (error: any) {
    res.status(500).json({ status: 'ERROR', database: 'DISCONNECTED', error: error?.message || String(error) });
  }
});

// Central API Routes
app.use('/api', apiRouter);

// 404 Route Handler
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`🚀 GlobeTrotter Backend Server running on port ${env.PORT}`);
  });
}

export default app;
