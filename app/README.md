# CV Maker

Application de création de CV moderne et professionnelle.

## ✨ Fonctionnalités

- 🎨 **10+ Templates professionnels**
- 📝 **Éditeur intuitif** avec sections modulaires
- 🌍 **Multilingue** (Français/Anglais)
- 💾 **Stockage local** (fonctionne offline)
- 🔐 **Authentification** via Keycloak (optionnel)
- 📱 **Responsive** (mobile/desktop)
- 🎯 **Export PDF** haute qualité

## 🚀 Démarrage rapide

### Mode Local (Recommandé pour tester)

Aucune configuration requise !

```bash
npm install
npm run dev
```

L'application fonctionne immédiatement avec un utilisateur local.

### Avec Keycloak

1. Configurez Keycloak (voir `KEYCLOAK_SETUP.md`)
2. Mettez à jour `.env` :
```env
VITE_LOCAL_MODE=false
VITE_KEYCLOAK_URL=http://localhost:8080/auth
VITE_KEYCLOAK_REALM=cv-maker
VITE_KEYCLOAK_CLIENT_ID=cv-maker-client
```
3. Redémarrez :
```bash
npm run dev
```

## 📖 Documentation

- [Configuration Keycloak](KEYCLOAK_SETUP.md) - Guide complet Keycloak
- [Migration Firebase → Keycloak](MIGRATION_FIREBASE_TO_KEYCLOAK.md) - Historique des changements
- [Configuration Firebase (obsolète)](FIREBASE_SETUP.md) - Ancienne config Firebase

## 🏗️ Technologies

- **Frontend**: React 19 + TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: Keycloak (optionnel) ou Mode Local
- **Storage**: localStorage
- **PDF**: jsPDF + html2canvas
- **i18n**: i18next

## 📂 Structure du projet

```
src/
├── components/        # Composants React
│   ├── ui/           # Composants UI (shadcn)
│   ├── templates/    # Templates de CV
│   └── ...
├── hooks/            # Custom hooks
│   ├── useAuth.ts    # Authentification (Keycloak)
│   ├── useCloudCV.ts # CV sauvegardés (localStorage par utilisateur)
│   └── ...
├── keycloak/         # Configuration Keycloak
│   ├── config.ts
│   └── KeycloakProvider.tsx
├── sections/         # Sections du formulaire
├── i18n/            # Traductions
└── types/           # Types TypeScript
```

## 🛠️ Scripts disponibles

```bash
npm run dev      # Développement
npm run build    # Build production
npm run preview  # Preview production
npm test         # Tests
```

## 🌐 Variables d'environnement

Voir **`.env.example`** pour la liste complète. Résumé :

- **Frontend** (préfixe `VITE_`) : `VITE_LOCAL_MODE`, `VITE_KEYCLOAK_*`, `VITE_BACKEND_URL`, etc.
- **Backend** (dans `app/backend`) : `KEYCLOAK_URL`, `KEYCLOAK_ADMIN_CLIENT_ID`, `KEYCLOAK_ADMIN_CLIENT_SECRET`, `ALLOWED_ORIGINS`. Voir la section Backend dans `.env.example`.

Pour lancer le **backend** (proxy Keycloak) en local :
```bash
cd app/backend
npm install
# Définir KEYCLOAK_URL, KEYCLOAK_ADMIN_CLIENT_ID, KEYCLOAK_ADMIN_CLIENT_SECRET, ALLOWED_ORIGINS (ou .env)
npm start
```

## 🔄 Migration depuis Firebase

Le projet a migré de Firebase à Keycloak + localStorage. Voir :
- [MIGRATION_FIREBASE_TO_KEYCLOAK.md](MIGRATION_FIREBASE_TO_KEYCLOAK.md)

## 📝 License

MIT

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request
