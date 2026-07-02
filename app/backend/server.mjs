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
  try {
    if (!origin || allowedOrigins.length === 0) return true;
    if (exactOrigins.includes('*')) return true;
    return exactOrigins.includes(origin)
      || wildcardOrigins.some((pattern) => pattern.test(origin))
      || defaultPreviewOrigins.some((pattern) => pattern.test(origin));
  } catch (err) {
    console.error('[cors] isOriginAllowed failed', { origin, message: err?.message });
    return true;
  }
}

// Middleware CORS manuel — ne doit JAMAIS jeter (sinon 500 sur le préflight).
app.use((req, res, next) => {
  try {
    const origin = typeof req.headers.origin === 'string'
      ? req.headers.origin.replace(/\/+$/, '')
      : undefined;
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
  } catch (err) {
    console.error('[cors] middleware failed', { message: err?.message, stack: err?.stack });
    // Réponse permissive de secours pour ne pas casser le préflight
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id, Authorization');
    if (req.method === 'OPTIONS') return res.status(204).end();
    return next();
  }
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

// Error handler — expose la vraie cause des 500 dans les logs Vercel
app.use((err, req, res, _next) => {
  console.error('[backend-error]', {
    method: req.method,
    path: req.path,
    message: err?.message,
    stack: err?.stack,
  });

  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error', detail: err?.message || 'Unknown error' });
  }
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`[cv-maker-backend] Listening on port ${port}`);
  });
}

export default app;
