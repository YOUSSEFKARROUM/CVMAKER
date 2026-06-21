import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 4000;

// PayPal configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox';
const PAYPAL_BASE_URL =
  PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

const CV_PRICE = process.env.CV_PRICE || '2.00';
const CV_CURRENCY = process.env.CV_CURRENCY || 'EUR';

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn(
    '[cv-maker-backend] Missing PayPal configuration (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET). Payment routes will be disabled.'
  );
}

app.use(express.json());

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'too_many_requests', message: 'Trop de tentatives de paiement. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

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

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal configuration is incomplete on the backend');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to obtain PayPal access token (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}

app.post('/payments/create-order', paymentLimiter, async (req, res) => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return res.status(503).json({
        error: 'payments_disabled',
        message: "Le paiement PayPal n'est pas configuré sur le serveur.",
      });
    }

    const accessToken = await getPayPalAccessToken();
    const { cvTitle } = req.body || {};

    const orderBody = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: CV_CURRENCY, value: CV_PRICE },
          description: cvTitle || 'CV Maker - Téléchargement de CV',
        },
      ],
      application_context: {
        brand_name: 'CV Maker',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderBody),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('[cv-maker-backend] PayPal create-order error:', response.status, text);
      return res.status(500).json({
        error: 'paypal_create_order_failed',
        message: 'Erreur lors de la création de la commande PayPal.',
      });
    }

    const data = await response.json();
    return res.status(200).json({ id: data.id, status: data.status });
  } catch (err) {
    console.error('[cv-maker-backend] /payments/create-order error:', err);
    return res.status(500).json({
      error: 'unexpected_error',
      message: 'Erreur interne lors de la création de la commande PayPal.',
    });
  }
});

app.post('/payments/capture-order', paymentLimiter, async (req, res) => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return res.status(503).json({
        error: 'payments_disabled',
        message: "Le paiement PayPal n'est pas configuré sur le serveur.",
      });
    }

    const { orderId } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ error: 'missing_order_id', message: 'orderId est requis.' });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[cv-maker-backend] PayPal capture-order error:', response.status, JSON.stringify(data));
      return res.status(500).json({
        error: 'paypal_capture_failed',
        message: 'Erreur lors de la confirmation du paiement PayPal.',
        details: data,
      });
    }

    const status =
      data.status ||
      (data.purchase_units && data.purchase_units[0]?.payments?.captures?.[0]?.status);

    return res.status(200).json({ ok: true, status, id: data.id });
  } catch (err) {
    console.error('[cv-maker-backend] /payments/capture-order error:', err);
    return res.status(500).json({
      error: 'unexpected_error',
      message: 'Erreur interne lors de la confirmation du paiement PayPal.',
    });
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`[cv-maker-backend] Listening on port ${port}`);
});
