# Propositions d’évolution et analyse de sécurité — CV Maker

## 1. Propositions sur le projet (après analyse)

### 1.1 Fonctionnel

| Proposition | Priorité | Description |
|-------------|----------|-------------|
| **Sauvegarde cloud réelle** | Moyenne | Aujourd’hui `useCloudCV` utilise uniquement le localStorage. Pour une vraie persistance multi‑appareils, brancher un backend (API REST) ou un service (ex. Firestore/Supabase) avec authentification Keycloak (token envoyé au backend). |
| **Limite de taille / validation PDF** | Basse | En cas de CV très long, le PDF est mis à l’échelle sur une page ; informer l’utilisateur (ex. message dans ExportModal) et éventuellement proposer un mode « multi‑pages » ou un avertissement si le contenu dépasse X caractères/sections. |
| **Rate limiting côté backend** | Moyenne | Sur `/auth/register` et `/auth/forgot-password`, ajouter un rate limit (ex. 5 inscriptions / 15 min par IP) pour limiter les abus et l’énumération d’emails. |
| **Validation côté backend** | Moyenne | Le backend reçoit `email`, `password`, `displayName` sans validation stricte. Ajouter : format email, longueur min/max du mot de passe, sanitization de `displayName` (taille, caractères). |

### 1.2 Technique

| Proposition | Priorité | Description |
|-------------|----------|-------------|
| **Variables backend** | Faible | Le backend lit `KEYCLOAK_URL` etc. ; en production, ne pas dépendre de variables vides (ex. refuser de démarrer si `KEYCLOAK_ADMIN_CLIENT_SECRET` manque en prod). |
| **Health check** | Faible | `/health` existe ; l’enrichir éventuellement avec un check Keycloak (token admin récupérable) pour la surveillance. |
| **Logs** | Moyenne | Éviter de logger le corps des requêtes (mots de passe). Les erreurs Keycloak peuvent être loguées en niveau « warn » sans exposer les détails aux clients. |
| **Tests** | Moyenne | Ajouter des tests (Vitest) sur les hooks critiques (`useCVStorage`, validation contact), et des tests e2e sur le flux : landing → auth → formulaire → export PDF. |

### 1.3 UX / Design

| Proposition | Priorité | Description |
|-------------|----------|-------------|
| **Landing i18n** | Basse | Les textes de la landing (titres, témoignages, FAQ) sont en dur en français ; les brancher sur i18next comme le reste de l’app. |
| **Focus visible** | Basse | S’assurer que tous les boutons et champs ont un `focus:ring-2` (ou équivalent) pour la navigation clavier et l’accessibilité. |
| **Messages d’erreur API** | Moyenne | En cas d’erreur 500 ou timeout sur register/forgot-password, afficher un message clair (« Service temporairement indisponible ») sans exposer de détail technique. |

### 1.4 Déploiement / Ops

| Proposition | Priorité | Description |
|-------------|----------|-------------|
| **ALLOWED_ORIGINS en prod** | Haute | En production, **toujours** définir `ALLOWED_ORIGINS` avec les origines exactes (Vercel, Railway, etc.). Ne jamais laisser vide. |
| **HTTPS** | Évident | Keycloak, backend et frontend en HTTPS en production. |
| **Secrets** | Évident | Aucun secret dans le code ; tout via variables d’environnement (déjà le cas). |

---

## 2. Sécurité du projet — analyse

### 2.1 Points positifs

- **Authentification** : Keycloak gère l’auth (OAuth2/OIDC), avec PKCE côté frontend (`pkceMethod: 'S256'`). Les mots de passe ne transitent que vers Keycloak ou le backend (register/forgot-password).
- **Proxy d’inscription** : L’inscription et le « mot de passe oublié » passent par **votre backend** ; les identifiants admin Keycloak (`KEYCLOAK_ADMIN_*`) restent côté serveur, jamais exposés au navigateur.
- **CORS** : Le backend applique une liste d’origines (`ALLOWED_ORIGINS`) ; en la renseignant correctement en prod, on limite les requêtes cross-origin non autorisées.
- **Pas de secrets en dur** : Les secrets sont dans les variables d’environnement (`.env` non versionné, `.env.example` sans valeurs sensibles).
- **Données sensibles** : Les CV sont en localStorage (par utilisateur) ; pas d’envoi systématique à un serveur, ce qui limite l’exposition.

### 2.2 Points d’attention et recommandations

#### 2.2.1 Client Secret Keycloak dans le frontend

- **Constat** : `VITE_KEYCLOAK_CLIENT_SECRET` peut être utilisé en frontend (config Keycloak) pour le « Direct Access Grant » (login par email/mot de passe sans redirection).
- **Risque** : Tout ce qui est préfixé `VITE_` est inclus dans le bundle et visible dans les outils de dev / le code source du client. Un attaquant peut donc récupérer le client secret et l’utiliser pour demander des tokens au nom du client.
- **Recommandation** :
  - **Option A (recommandée)** : Ne pas utiliser le client secret dans le frontend. Désactiver le Direct Access Grant pour le client public et n’utiliser que le flux **redirection + PKCE** (login/register via la page Keycloak). Ainsi, plus besoin de `VITE_KEYCLOAK_CLIENT_SECRET` dans l’app.
  - **Option B** : Si vous gardez le login direct, faire le « Resource Owner Password » côté **backend** : le front envoie email/mot de passe au backend (HTTPS), le backend appelle Keycloak avec le client secret et renvoie les tokens. Le secret ne quitte jamais le serveur.

#### 2.2.2 CORS en production

- **Constat** : Si `ALLOWED_ORIGINS` est vide, le backend accepte **toute** origine (`allowedOrigins.length === 0` → tout autorisé).
- **Recommandation** : En production, **toujours** définir `ALLOWED_ORIGINS` avec les URLs exactes du frontend (ex. `https://votre-app.vercel.app,https://votre-app.up.railway.app`).

#### 2.2.3 Inscription et mot de passe oublié

- **Constat** : Le backend transmet le mot de passe en clair à Keycloak (HTTPS), ce qui est normal pour l’API Keycloak. Pas de stockage du mot de passe dans votre backend.
- **Recommandations** :
  - **Rate limiting** : Limiter le nombre de requêtes par IP sur `/auth/register` et `/auth/forgot-password` pour éviter le spam et l’énumération d’emails.
  - **Validation** : Valider côté backend le format de l’email, la complexité du mot de passe (longueur min, etc.) et la taille de `displayName` avant d’appeler Keycloak.

#### 2.2.4 XSS et contenu utilisateur

- **Constat** : Les données du CV (texte, liens) sont affichées dans le DOM (React). React échappe le contenu par défaut.
- **Recommandation** : Éviter `dangerouslySetInnerHTML` pour le contenu utilisateur. Si des liens ou champs riches sont ajoutés plus tard, valider/sanitiser les URLs et le HTML.

#### 2.2.5 LocalStorage

- **Constat** : Les CV et l’état sont en localStorage, indexés par `userId`. En mode Keycloak, un autre utilisateur sur la même machine pourrait en théorie accéder au storage (accès physique ou XSS).
- **Recommandation** : C’est un compromis acceptable pour une app CV. Pour un niveau de confidentialité plus élevé, stocker les CV côté serveur (avec auth) et ne garder en local que du cache.

#### 2.2.6 Exposition d’informations dans les erreurs

- **Constat** : En cas d’erreur (ex. 409 « email existe déjà »), le backend renvoie des messages explicites. C’est utile pour l’UX mais peut permettre l’énumération de comptes.
- **Recommandation** : Pour `/auth/forgot-password`, vous renvoyez déjà 200 même si l’email n’existe pas (bonne pratique). Pour `/auth/register`, un 409 « email déjà utilisé » est courant ; le rate limiting limite le risque d’énumération massive.

### 2.3 Synthèse sécurité

| Aspect | État | Action recommandée |
|--------|------|---------------------|
| Auth (Keycloak + proxy) | Bon | Optionnel : retirer le client secret du frontend (flux redirection uniquement) ou faire le login direct côté backend. |
| Secrets / env | Bon | Garder la discipline actuelle (pas de secrets en dur). |
| CORS | À sécuriser en prod | Définir `ALLOWED_ORIGINS` en production. |
| Rate limiting | Absent | Ajouter sur register et forgot-password. |
| Validation backend | Minimale | Renforcer validation email / mot de passe / displayName. |
| XSS | Maîtrisé (React) | Éviter `dangerouslySetInnerHTML` sur contenu utilisateur. |
| Données CV | LocalStorage | Acceptable ; pour plus de confidentialité, envisager un stockage serveur authentifié. |

Dans l’ensemble, le projet est **déjà dans une bonne posture** (Keycloak, proxy d’inscription, pas de secrets en dur). Les améliorations les plus utiles sont : **ne pas exposer le client secret dans le frontend** (ou le garder côté backend), **configurer CORS en production** et **ajouter du rate limiting** sur les routes d’auth.
