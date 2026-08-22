import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    // Basic database connection check
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', database: 'CONNECTED' });
  } catch (error: any) {
    res.status(500).json({ status: 'ERROR', database: 'DISCONNECTED', error: error?.message || String(error) });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export default app;
