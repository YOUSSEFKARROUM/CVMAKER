# Rapport de correction - CORS IA CV Maker

## Objectif

Corriger definitivement le blocage CORS entre le frontend Vercel et le backend IA Vercel.

## Corrections appliquees

### 1. Middleware CORS manuel

Le backend ne depend plus du package `cors` pour le preflight IA.

Un middleware manuel a ete place avant `express.json()` et avant les routes :

- normalise l'origin
- autorise les origins exactes de `ALLOWED_ORIGINS`
- autorise les wildcards de type `https://cvmaker-*.vercel.app`
- autorise par defaut les previews Vercel du projet `cvmaker-*`
- autorise localhost en developpement
- repond directement aux requetes `OPTIONS`

### 2. Reponse preflight explicite

Pour toute requete `OPTIONS`, le backend repond maintenant avant d'atteindre les routes IA :

```text
204 No Content
Access-Control-Allow-Origin: <origin autorisee>
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: content-type,x-user-id
Access-Control-Max-Age: 86400
```

Si l'origin n'est pas autorisee, le backend renvoie :

```text
403 Forbidden
```

Au lieu d'une erreur Express 500.

### 3. Suppression de la dependance `cors`

Le package `cors` a ete retire de `app/backend/package.json`, car le serveur utilise maintenant un middleware dedie.

## Fichiers modifies

```text
app/backend/server.mjs
app/backend/package.json
```

## Variables Vercel recommandees

Backend :

```env
ALLOWED_ORIGINS=https://cvmaker-*.vercel.app
GROQ_API_KEY=...
GROQ_MODEL=llama-3.3-70b-versatile
AI_MODEL=llama-3.3-70b-versatile
AI_MAX_TOKENS=2000
```

Frontend :

```env
VITE_BACKEND_URL=https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app
```

Important : `VITE_BACKEND_URL` ne doit pas finir par `/`.

## Verification apres redeploy

Tester le backend :

```bash
curl -i "https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app/health"
```

Resultat attendu :

```text
HTTP/1.1 200 OK
```

Tester le preflight :

```bash
curl -i -X OPTIONS "https://cvmaker-bjmp-9nk7ou5pa-youssefkarroums-projects.vercel.app/ai/generate" \
  -H "Origin: https://cvmaker-nine-tau.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,x-user-id"
```

Resultat attendu :

```text
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://cvmaker-nine-tau.vercel.app
```

Tester ensuite le bouton IA dans l'application.

## Note securite

La cle Groq ne doit jamais etre mise dans le frontend.
Elle doit rester uniquement dans les variables d'environnement du backend Vercel.

