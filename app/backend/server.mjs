import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import express from 'express';
import aiRoutes from './ai-routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });
config();

const app = express();
const port = process.env.PORT || 4000;

// PayPal désactivé — remplacé par virement bancaire (30 DH = 4 téléchargements PDF)

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .map((o) => o.replace(/\/+$/, ''))
  .filter(Boolean);

const wildcardOrigins = allowedOrigins
  .filter((origin) => origin.includes('*'))
  .map((origin) => new RegExp(`^${origin.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`));

const exactOrigins = allowedOrigins.filter((origin) => !origin.includes('*'));

const defaultPreviewOrigins = [
  /^https:\/\/cvmaker-[a-z0-9-]+\.vercel\.app$/i,
  /^http:\/\/localhost:\d+$/i,
  /^http:\/\/127\.0\.0\.1:\d+$/i,
];

function isOriginAllowed(origin) {
  if (!origin || allowedOrigins.length === 0) return true;
  if (exactOrigins.includes('*')) return true;
  return exactOrigins.includes(origin)
    || wildcardOrigins.some((pattern) => pattern.test(origin))
    || defaultPreviewOrigins.some((pattern) => pattern.test(origin));
}

app.use((req, res, next) => {
  const origin = req.headers.origin?.replace(/\/+$/, '');
  const isAllowed = isOriginAllowed(origin);

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] || 'Content-Type, X-User-Id, Authorization'
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(isAllowed ? 204 : 403).end();
  }

  return next();
});

app.use(express.json());

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
