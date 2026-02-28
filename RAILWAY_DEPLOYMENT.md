# Guide de déploiement Railway (Docker)

## Résumé des fichiers créés

| Fichier | Rôle |
|---------|------|
| `Dockerfile` (racine) | Build Vite + nginx pour Railway |
| `.dockerignore` (racine) | Optimise le build Docker |
| `app/Dockerfile` | Version alternative (build depuis `app/`) |
| `app/.dockerignore` | Exclusions pour build depuis `app/` |
| `app/.env.example` | Template des variables sans secrets |

---

## Prérequis

- Compte [Railway](https://railway.app)
- Repo GitHub/GitLab avec le projet CV_Maker
- Variables d'environnement Keycloak prêtes

---

## ⚠️ Vérification importante : `.env` et VITE_KEYCLOAK_URL

### Problème détecté dans ton `.env` actuel

```
VITE_KEYCLOAK_URL=https://cvmaker-6fnp0289z-youssefkarroums-projects.vercel.app/
```

**Cette URL est celle de ton application Vercel, pas celle de Keycloak.**

- `VITE_KEYCLOAK_URL` doit pointer vers **le serveur Keycloak** (là où tourne l’authentification)
- Exemples corrects :
  - `https://auth.tondomaine.com`
  - `https://keycloak.tondomaine.com/auth`
  - `https://ton-instance-keycloak.railway.app` (si Keycloak est hébergé sur Railway)

### À faire

1. Corriger `VITE_KEYCLOAK_URL` dans `.env` avec l’URL réelle de ton serveur Keycloak.
2. Configurer dans Keycloak Admin → Clients → cv-maker-client :
   - **Valid Redirect URIs** : `https://ton-app.vercel.app/*` et `https://ton-app.railway.app/*`
   - **Web Origins** : `https://ton-app.vercel.app` et `https://ton-app.railway.app`

---

## Étapes de déploiement sur Railway

### 1. Connecter le projet

1. Va sur [railway.app](https://railway.app) et connecte ton compte GitHub.
2. Clique sur **New Project** → **Deploy from GitHub repo**.
3. Sélectionne le repo `CV_Maker` (ou le nom de ton repo).
4. Railway détecte automatiquement le `Dockerfile`.

### 2. Répertoire racine

Le `Dockerfile` est à la **racine du repo** (`CV_Maker/Dockerfile`). Tu n’as pas besoin de modifier le Root Directory : Railway utilise automatiquement le repo entier.

### 3. Ajouter les variables d'environnement

Railway → ton service → **Variables** → ajoute les variables suivantes (en utilisant les vraies valeurs) :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_KEYCLOAK_URL` | URL du serveur Keycloak | `https://auth.tondomaine.com` |
| `VITE_KEYCLOAK_REALM` | Nom du realm | `cv-maker` |
| `VITE_KEYCLOAK_CLIENT_ID` | ID du client | `cv-maker-client` |
| `VITE_KEYCLOAK_CLIENT_SECRET` | Secret du client | *(depuis Keycloak Admin)* |
| `VITE_KEYCLOAK_ADMIN_CLIENT_ID` | Client admin (optionnel) | `cv-maker-admin` |
| `VITE_KEYCLOAK_ADMIN_CLIENT_SECRET` | Secret admin (optionnel) | *(depuis Keycloak Admin)* |
| `VITE_LOCAL_MODE` | Mode sans Keycloak | `false` |
| `VITE_DISABLE_FIRESTORE` | Désactiver Firestore | `true` |

### 4. Lancer le déploiement

1. Clique sur **Deploy** (ou fais un push sur la branche connectée).
2. Railway va :
   - Lancer `docker build` (avec les variables passées en `ARG`)
   - Exécuter `npm run build` dans le container
   - Servir les fichiers statiques via nginx sur le port 80.

### 5. Obtenir l’URL et mettre à jour Keycloak

1. Une fois le déploiement réussi, Railway t’attribue une URL du type :
   - `https://cvmaker-production-xxxx.up.railway.app`
2. Dans Keycloak Admin, ajoute cette URL dans :
   - **Valid Redirect URIs** : `https://xxx.up.railway.app/*`
   - **Web Origins** : `https://xxx.up.railway.app`

---

## Test du build Docker en local

```bash
# À la racine du repo (CV_Maker/)
docker build \
  --build-arg VITE_KEYCLOAK_URL=https://ton-keycloak.com \
  --build-arg VITE_KEYCLOAK_REALM=cv-maker \
  --build-arg VITE_KEYCLOAK_CLIENT_ID=cv-maker-client \
  -t cv-maker .
docker run -p 8080:80 cv-maker
```

Puis ouvre `http://localhost:8080`.

---

## Fichiers créés pour toi

- `app/Dockerfile` : build Vite + nginx pour servir le site
- `app/.dockerignore` : exclusion des fichiers non nécessaires au build
- `app/.env.example` : modèle de variables sans secrets
