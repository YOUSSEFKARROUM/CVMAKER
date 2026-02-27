# Migration Firebase → Keycloak

Ce document résume les changements effectués pour migrer de Firebase à Keycloak.

## 📋 Résumé des changements

### Supprimé
- ✅ Firebase Authentication
- ✅ Firebase Firestore (base de données)
- ✅ Erreurs "Database '(default)' not found"
- ✅ Dépendances Firebase

### Ajouté
- ✅ Keycloak pour l'authentification
- ✅ Stockage local (localStorage) pour les CV
- ✅ Mode local sans serveur d'authentification
- ✅ Documentation complète

## 🏗️ Architecture

```
Avant:                    Après:
┌─────────────┐          ┌─────────────┐
│  Firebase   │          │  Keycloak   │
│   Auth      │    →     │    Auth     │
└─────────────┘          └─────────────┘
       │                        │
┌─────────────┐          ┌─────────────┐
│  Firestore  │          │ localStorage│
│   (Cloud)   │    →     │   (Local)   │
└─────────────┘          └─────────────┘
```

## 📁 Fichiers modifiés/créés

### Nouveaux fichiers
```
src/keycloak/
├── config.ts              # Configuration Keycloak
├── KeycloakProvider.tsx   # Provider React Keycloak
└── useKeycloakAuth.ts     # Hook d'authentification

public/
└── silent-check-sso.html  # Page pour silent SSO

KEYCLOAK_SETUP.md          # Guide configuration Keycloak
MIGRATION_FIREBASE_TO_KEYCLOAK.md  # Ce fichier
```

### Fichiers modifiés
```
src/hooks/
├── useAuth.ts             # Adaptateur pour compatibilité
└── useCloudCV.ts          # Utilise localStorage au lieu de Firestore

src/main.tsx               # Utilise KeycloakProvider
.env                       # Configuration Keycloak
```

### Fichiers supprimés
```
src/firebase/
├── config.ts
├── auth.ts
└── cv.ts

src/hooks/useAuth.tsx      # Ancien provider Firebase
```

## ⚙️ Configuration

### Mode Local (par défaut)

Aucune configuration nécessaire ! L'application fonctionne avec un utilisateur local fictif.

```env
VITE_LOCAL_MODE=true
```

### Avec Keycloak

1. Installez et configurez Keycloak (voir `KEYCLOAK_SETUP.md`)
2. Mettez à jour `.env` :

```env
VITE_LOCAL_MODE=false
VITE_KEYCLOAK_URL=http://localhost:8080/auth
VITE_KEYCLOAK_REALM=cv-maker
VITE_KEYCLOAK_CLIENT_ID=cv-maker-client
```

## 🔒 Authentification

### Flux de connexion Keycloak

1. L'utilisateur clique sur "Connexion"
2. Redirection vers Keycloak
3. L'utilisateur s'authentifie
4. Redirection vers l'application avec token
5. Token rafraîchi automatiquement

### Mode Local

1. L'utilisateur clique sur "Connexion"
2. Utilisateur local créé automatiquement
3. Données stockées dans localStorage
4. Aucun serveur externe requis

## 💾 Stockage des données

### Avant (Firebase)
- CVs stockés dans Firestore (cloud)
- Synchronisation temps réel
- Accessible de n'importe où

### Après (localStorage)
- CVs stockés dans le navigateur
- Pas de synchronisation cloud
- Limité au navigateur actuel

### Avantages
- ✅ Fonctionne offline
- ✅ Aucune erreur de connexion
- ✅ Instantané
- ✅ Gratuit

### Inconvénients
- ❌ Données perdues si cache vidé
- ❌ Pas de synchronisation multi-appareils
- ❌ Limitation de taille (~5-10 MB)

## 🚀 Pour aller plus loin

### Ajouter une vraie base de données

Pour remplacer Firestore par une vraie base de données :

1. **Option 1: Backend Node.js + MongoDB/PostgreSQL**
   - Créer une API REST
   - Stocker les CVs côté serveur
   - Avantages: Contrôle total, sécurité

2. **Option 2: Supabase**
   - Alternative open-source à Firebase
   - PostgreSQL + Auth intégré
   - Migration facile depuis Firestore

3. **Option 3: Continuer avec Firebase mais proprement**
   - Créer la base de données Firestore
   - Configurer les règles de sécurité
   - Réactiver le code Firebase original

## 🔄 Rollback (Revenir à Firebase)

Si vous voulez revenir à Firebase :

1. Restaurez les fichiers depuis git :
```bash
git checkout src/firebase/
git checkout src/hooks/useAuth.tsx
git checkout src/hooks/useCloudCV.ts.backup
git checkout src/main.tsx.backup
```

2. Réinstallez Firebase :
```bash
npm install firebase
```

3. Configurez Firebase dans `.env`

## 📝 Notes techniques

### Compatibilité API

Le hook `useAuth` conserve la même API pour ne pas casser les composants :

```typescript
// Avant (Firebase)
const { user, login, logout, isAuthenticated } = useAuth();

// Après (Keycloak)
const { user, login, logout, isAuthenticated } = useAuth();
// Même API !
```

### Gestion des tokens

- Token stocké en mémoire par Keycloak
- Rafraîchissement automatique
- Pas de stockage local pour la sécurité

### Stockage local sécurisé

Les CVs sont stockés par utilisateur :
```json
{
  "user-id-1": [{...cvs...}],
  "user-id-2": [{...cvs...}]
}
```

## ❓ FAQ

**Q: Pourquoi Keycloak et pas Auth0/Clerk/etc ?**
R: Keycloak est open-source et gratuit, peut être auto-hébergé.

**Q: Puis-je utiliser les deux (Keycloak + local) ?**
R: Oui ! Le mode local est un fallback automatique.

**Q: Les données sont-elles sécurisées ?**
R: En mode local, les données restent dans le navigateur. Avec Keycloak, l'authentification est sécurisée mais les CVs restent locaux.

**Q: Puis-je exporter mes CVs ?**
R: Oui, utilisez la fonctionnalité "Export JSON" dans l'application.

## 🆘 Support

En cas de problème :
1. Vérifiez la console du navigateur
2. Vérifiez que Keycloak est bien configuré
3. Essayez le mode local : `VITE_LOCAL_MODE=true`
4. Consultez `KEYCLOAK_SETUP.md`
