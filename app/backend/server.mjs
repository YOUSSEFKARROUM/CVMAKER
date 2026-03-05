import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

const KEYCLOAK_URL = process.env.KEYCLOAK_URL;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'cv-maker';
const KEYCLOAK_ADMIN_CLIENT_ID = process.env.KEYCLOAK_ADMIN_CLIENT_ID;
const KEYCLOAK_ADMIN_CLIENT_SECRET = process.env.KEYCLOAK_ADMIN_CLIENT_SECRET;

// PayPal configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox'; // 'sandbox' or 'live'
const PAYPAL_BASE_URL =
  PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

// Fixed CV price configuration (server-side, client input is ignored)
const CV_PRICE = process.env.CV_PRICE || '2.00'; // 2 EUR ≈ 20 DH
const CV_CURRENCY = process.env.CV_CURRENCY || 'EUR';

if (!KEYCLOAK_URL || !KEYCLOAK_ADMIN_CLIENT_ID || !KEYCLOAK_ADMIN_CLIENT_SECRET) {
  console.warn(
    '[cv-maker-backend] Missing one or more Keycloak env vars (KEYCLOAK_URL, KEYCLOAK_ADMIN_CLIENT_ID, KEYCLOAK_ADMIN_CLIENT_SECRET).'
  );
}

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn(
    '[cv-maker-backend] Missing PayPal configuration (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET). Payment routes will be disabled.'
  );
}

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

async function getAdminToken() {
  if (!KEYCLOAK_URL || !KEYCLOAK_ADMIN_CLIENT_ID || !KEYCLOAK_ADMIN_CLIENT_SECRET) {
    throw new Error('Keycloak admin configuration is incomplete on the backend');
  }

  const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', KEYCLOAK_ADMIN_CLIENT_ID);
  params.append('client_secret', KEYCLOAK_ADMIN_CLIENT_SECRET);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to obtain admin token (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Create PayPal order for CV download
app.post('/payments/create-order', async (req, res) => {
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
          amount: {
            currency_code: CV_CURRENCY,
            value: CV_PRICE,
          },
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

    return res.status(200).json({
      id: data.id,
      status: data.status,
    });
  } catch (err) {
    console.error('[cv-maker-backend] /payments/create-order error:', err);
    return res.status(500).json({
      error: 'unexpected_error',
      message: 'Erreur interne lors de la création de la commande PayPal.',
    });
  }
});

// Capture PayPal order after approval
app.post('/payments/capture-order', async (req, res) => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return res.status(503).json({
        error: 'payments_disabled',
        message: "Le paiement PayPal n'est pas configuré sur le serveur.",
      });
    }

    const { orderId } = req.body || {};

    if (!orderId) {
      return res.status(400).json({
        error: 'missing_order_id',
        message: 'orderId est requis.',
      });
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
      console.error(
        '[cv-maker-backend] PayPal capture-order error:',
        response.status,
        JSON.stringify(data)
      );
      return res.status(500).json({
        error: 'paypal_capture_failed',
        message: 'Erreur lors de la confirmation du paiement PayPal.',
        details: data,
      });
    }

    const status =
      data.status ||
      (data.purchase_units &&
        data.purchase_units[0]?.payments?.captures?.[0]?.status);

    return res.status(200).json({
      ok: true,
      status,
      id: data.id,
    });
  } catch (err) {
    console.error('[cv-maker-backend] /payments/capture-order error:', err);
    return res.status(500).json({
      error: 'unexpected_error',
      message: 'Erreur interne lors de la confirmation du paiement PayPal.',
    });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body || {};

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'missing_fields', message: 'email, password et displayName sont requis.' });
    }

    const adminToken = await getAdminToken();

    const createUserUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`;

    const response = await fetch(createUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        username: email,
        email,
        emailVerified: true,
        firstName: displayName.split(' ')[0],
        lastName: displayName.split(' ').slice(1).join(' ') || '',
        enabled: true,
        requiredActions: [],
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      }),
    });

    if (response.status !== 201 && !response.ok) {
      const text = await response.text().catch(() => '');

      let httpStatus = 400;
      let errorCode = 'user_create_failed';
      let message = 'Erreur lors de la création du compte';
      let details = text;

      try {
        const parsed = JSON.parse(text);
        details = parsed;

        if (parsed.errorMessage && parsed.errorMessage.includes('User exists with same email')) {
          httpStatus = 409;
          errorCode = 'email_already_exists';
          message = 'Un compte avec cet email existe déjà.';
        }
      } catch {
        // texte brut, on laisse les valeurs par défaut
      }

      return res.status(httpStatus).json({
        error: errorCode,
        message,
        details,
      });
    }

    // Récupérer l'ID du nouvel utilisateur et forcer requiredActions à vide pour éviter "Account is not fully set up"
    const location = response.headers.get('Location');
    const userId = location ? location.split('/').filter(Boolean).pop() : null;

    if (userId) {
      const userUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`;
      // Mise à jour minimale : uniquement les champs nécessaires pour que le compte soit "fully set up"
      const updatePayload = {
        username: email,
        email,
        emailVerified: true,
        firstName: displayName.split(' ')[0] || '',
        lastName: displayName.split(' ').slice(1).join(' ') || '',
        enabled: true,
        requiredActions: [],
      };
      const putRes = await fetch(userUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updatePayload),
      });
      if (!putRes.ok) {
        const putBody = await putRes.text().catch(() => '');
        console.warn('[cv-maker-backend] User update (requiredActions) failed:', putRes.status, putBody);
      }
    } else {
      console.warn('[cv-maker-backend] No Location header, cannot clear requiredActions for new user');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[cv-maker-backend] /auth/register error:', err);
    return res.status(500).json({
      error: 'unexpected_error',
      message: 'Erreur interne lors de la création du compte',
    });
  }
});

app.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'missing_email', message: 'email est requis.' });
    }

    const adminToken = await getAdminToken();

    const searchUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users?email=${encodeURIComponent(email)}`;

    const searchResponse = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const users = await searchResponse.json();

    if (!Array.isArray(users) || users.length === 0) {
      // Ne pas révéler si l'utilisateur existe ou non
      return res.status(200).json({ ok: true });
    }

    const userId = users[0].id;

    const resetUrl = `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}/execute-actions-email`;

    await fetch(resetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(['UPDATE_PASSWORD']),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[cv-maker-backend] /auth/forgot-password error:', err);
    // Ne pas exposer d'informations sur l'existence de l'utilisateur
    return res.status(200).json({ ok: true });
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`[cv-maker-backend] Listening on port ${port}`);
});

