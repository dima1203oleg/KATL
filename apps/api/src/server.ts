import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;

app.use(express.json());

// Observability and health
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: '@katl/api',
    version: '1.0.0-monorepo',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    database: {
      engine: 'PostgreSQL',
      status: 'CONFIGURED',
    },
    redis: {
      engine: 'Redis',
      status: 'CONFIGURED',
    },
  });
});

app.listen(PORT, () => {
  console.log(`[@katl/api] Modular REST API listening on port ${PORT}`);
});

export default app;
