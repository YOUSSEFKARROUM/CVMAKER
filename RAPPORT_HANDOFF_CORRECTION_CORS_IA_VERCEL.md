# Rapport handoff - Correction definitive CORS IA Vercel

## Objectif du rapport

Ce document est destine a etre donne a un autre outil IA ou a un developpeur pour corriger definitivement le blocage CORS entre le frontend CV Maker et le backend IA deployes sur Vercel.

## Resume rapide

Le frontend appelle :

```text
POST https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app/ai/generate
```

Depuis :

```text
https://cvmaker-nine-tau.vercel.app
```

Le navigateur bloque la requete car le preflight CORS :

```text
OPTIONS /ai/generate
```

ne recoit pas :

```text
Access-Control-Allow-Origin
```

Erreur navigateur :

```text
Access to fetch at 'https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app/ai/generate'
from origin 'https://cvmaker-nine-tau.vercel.app' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Etat actuel verifie le 2026-07-02

### Test backend health

Commande :

```bash
curl -i -sS "https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app/health"
```

Resultat :

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Vary: Origin
X-Powered-By: Express

{"ok":true}
```

Conclusion :

- Le backend est accessible.
- La protection Vercel SSO / Deployment Protection n'est plus le probleme principal.
- Express est bien atteint.

### Test preflight CORS

Commande :

```bash
curl -i -sS -X OPTIONS "https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app/ai/generate" \
  -H "Origin: https://cvmaker-nine-tau.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,x-user-id"
```

Resultat actuel :

```text
HTTP/1.1 500 Internal Server Error
Content-Type: text/html; charset=utf-8
X-Powered-By: Express

Internal Server Error
```

Conclusion :

- Le preflight atteint Express.
- Le backend renvoie une erreur 500 sur `OPTIONS /ai/generate`.
- Aucun header `Access-Control-Allow-Origin` n'est renvoye.
- Le frontend ne pourra jamais appeler l'IA tant que ce preflight echoue.

## Historique des corrections deja tentees

### 1. Correction du double slash frontend

Ancienne URL :

```text
https://backend.vercel.app//ai/generate
```

Correction dans :

```text
app/src/hooks/useAI.ts
```

Le frontend normalise maintenant `VITE_BACKEND_URL` :

```ts
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000')
  .replace(/\/+$/, '');
```

### 2. Desactivation de la protection Vercel

Avant, le backend repondait :

```text
HTTP/1.1 302 Found
Location: https://vercel.com/sso-api?url=...
```

Maintenant `/health` repond `200`, donc cette partie semble corrigee.

### 3. Middleware CORS manuel ajoute

Dernier commit local pousse :

```text
d2aeaff fix(backend): handle AI CORS preflight manually
```

Code actuel attendu dans :

```text
app/backend/server.mjs
```

Le middleware manuel doit repondre avant `express.json()` :

```js
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
```

## Hypotheses les plus probables

### Hypothese A - Le backend Vercel n'est pas redeploye sur `d2aeaff`

Le code actuel local devrait retourner :

```text
204 No Content
Access-Control-Allow-Origin: https://cvmaker-nine-tau.vercel.app
```

Mais l'URL distante retourne encore :

```text
500 Internal Server Error
```

Cela indique fortement que Vercel execute encore un ancien build, probablement avant le middleware manuel.

Verification a faire dans Vercel :

- Aller dans le projet backend.
- Ouvrir l'onglet Deployments.
- Verifier que le dernier deployment utilise le commit :

```text
d2aeaff
```

Si ce n'est pas le cas, redeployer explicitement ce commit.

### Hypothese B - Mauvais projet Vercel ou mauvaise URL backend

Le frontend utilise :

```text
https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app
```

Il faut verifier que cette URL correspond bien au projet backend qui contient :

```text
Root Directory: app/backend
```

et non au projet frontend ou a un ancien projet backend.

### Hypothese C - Vercel route vers un ancien fichier ou mauvais build

Verifier dans :

```text
app/backend/vercel.json
```

Contenu attendu :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.mjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.mjs"
    }
  ]
}
```

Verifier aussi que le projet backend Vercel a :

```text
Root Directory: app/backend
```

### Hypothese D - ALLOWED_ORIGINS mal configure, mais ne devrait plus casser les previews

Le code actuel autorise par defaut :

```text
https://cvmaker-*.vercel.app
localhost
127.0.0.1
```

Donc meme si `ALLOWED_ORIGINS` est mal configure, l'origin suivante devrait passer :

```text
https://cvmaker-nine-tau.vercel.app
```

Variable recommandee cote backend :

```env
ALLOWED_ORIGINS=https://cvmaker-*.vercel.app
```

## Correction technique recommandee

### Etape 1 - Ajouter une route de debug non sensible

Ajouter temporairement dans `app/backend/server.mjs` :

```js
app.get('/debug-cors', (req, res) => {
  const origin = req.headers.origin?.replace(/\/+$/, '');
  res.json({
    ok: true,
    origin,
    allowedOrigins,
    isAllowed: isOriginAllowed(origin),
    vercel: Boolean(process.env.VERCEL),
    nodeEnv: process.env.NODE_ENV || null,
  });
});
```

Ne jamais renvoyer `GROQ_API_KEY`.

Tester ensuite :

```bash
curl -i "https://BACKEND_URL/debug-cors" \
  -H "Origin: https://cvmaker-nine-tau.vercel.app"
```

### Etape 2 - Ajouter un error handler Express

Ajouter a la fin de `server.mjs`, avant `export default app` :

```js
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
```

Objectif : obtenir le vrai message d'erreur dans les logs Vercel au lieu d'un HTML generique.

### Etape 3 - Garder le CORS manuel avant toutes les routes

Ordre obligatoire dans `server.mjs` :

```js
const app = express();

// 1. Middleware CORS manuel
app.use((req, res, next) => { ... });

// 2. Parser JSON
app.use(express.json());

// 3. Routes health/debug
app.get('/health', ...);
app.get('/debug-cors', ...);

// 4. Routes IA
app.use('/ai', aiRoutes);

// 5. Error handler
app.use((err, req, res, next) => { ... });
```

### Etape 4 - Redeployer et verifier

Backend :

```bash
curl -i "https://BACKEND_URL/health"
```

Attendu :

```text
HTTP/1.1 200 OK
```

Preflight :

```bash
curl -i -X OPTIONS "https://BACKEND_URL/ai/generate" \
  -H "Origin: https://cvmaker-nine-tau.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,x-user-id"
```

Attendu :

```text
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://cvmaker-nine-tau.vercel.app
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: content-type,x-user-id
```

### Etape 5 - Tester POST IA avec payload minimal

```bash
curl -i -X POST "https://BACKEND_URL/ai/generate" \
  -H "Origin: https://cvmaker-nine-tau.vercel.app" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"generate-profile\",\"language\":\"fr\",\"data\":{\"firstName\":\"Test\",\"lastName\":\"User\",\"jobTitle\":\"Developpeur\",\"experiences\":[],\"skills\":[],\"educations\":[]}}"
```

Reponses possibles :

- Si `GROQ_API_KEY` est bonne :

```text
HTTP/1.1 200 OK
```

- Si la cle manque :

```text
HTTP/1.1 503 Service Unavailable
{"error":"Service IA non configure."}
```

Le 503 est acceptable pour le diagnostic CORS : il prouve que CORS passe et que le probleme suivant est seulement la config Groq.

## Checklist Vercel

### Backend Vercel

Projet backend :

```text
Root Directory: app/backend
```

Variables :

```env
GROQ_API_KEY=...
GROQ_MODEL=llama-3.3-70b-versatile
AI_MODEL=llama-3.3-70b-versatile
AI_MAX_TOKENS=2000
ALLOWED_ORIGINS=https://cvmaker-*.vercel.app
```

Protection :

```text
Deployment Protection: Off
Vercel Authentication: Off
Password Protection: Off
```

Dernier commit deploye :

```text
d2aeaff ou plus recent
```

### Frontend Vercel

Variable :

```env
VITE_BACKEND_URL=https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app
```

Important : pas de slash final.

## Prompt pret a donner a un autre outil IA

```text
Tu dois corriger un bug CORS sur un projet React/Vite + backend Express deploye sur Vercel.

Contexte :
- Frontend : https://cvmaker-nine-tau.vercel.app
- Backend : https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app
- Route IA : POST /ai/generate
- Backend root directory Vercel attendu : app/backend

Symptome :
Le navigateur bloque l'appel IA :
"No Access-Control-Allow-Origin header is present".

Preuves :
- GET /health retourne 200 OK.
- OPTIONS /ai/generate avec Origin https://cvmaker-nine-tau.vercel.app retourne 500 Internal Server Error.

Objectif :
Corriger le backend pour que OPTIONS /ai/generate retourne :
204 No Content
Access-Control-Allow-Origin: https://cvmaker-nine-tau.vercel.app
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: content-type,x-user-id

Fichiers importants :
- app/backend/server.mjs
- app/backend/ai-routes.mjs
- app/backend/vercel.json
- app/src/hooks/useAI.ts

Contraintes :
- Ne jamais exposer GROQ_API_KEY.
- Garder la cle Groq uniquement cote backend.
- Ne pas casser /health.
- Ajouter une route /debug-cors temporaire sans secrets si necessaire.
- Ajouter un error handler Express pour voir la cause des 500 dans Vercel logs.
- Verifier que le middleware CORS s'execute avant express.json() et avant app.use('/ai', aiRoutes).

Tests obligatoires :
1. node --check app/backend/server.mjs
2. npm run build dans app
3. curl -i GET /health
4. curl -i OPTIONS /ai/generate avec Origin frontend
5. curl -i POST /ai/generate avec payload minimal

Apres correction, donner les variables Vercel backend/frontend exactes et les commandes curl de verification.
```

