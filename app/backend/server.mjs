import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import aiRoutes from './ai-routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });
config();

const app = express();
const port = process.env.PORT || 4000;

// PayPal désactivé — remplacé par virement bancaire (30 DH = 4 téléchargements PDF)

app.use(express.json());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'cv-maker-backend',
    endpoints: ['/health', '/ai/generate'],
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/ai', aiRoutes);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`[cv-maker-backend] Listening on port ${port}`);
  });
}

export default app;
