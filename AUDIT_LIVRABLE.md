# Audit et amélioration du projet CV Maker — Livrable

## 1. Fichiers / dépendances à supprimer (avec justification)

### Dépendances (package.json frontend)

| Élément | Raison |
|--------|--------|
| **firebase** | Non importé dans le code source. Le projet a migré vers Keycloak + localStorage (voir MIGRATION_FIREBASE_TO_KEYCLOAK.md). useCloudCV utilise uniquement le localStorage. |

### Fichiers

Aucun fichier mort identifié : tous les composants listés dans l’exploration (CVDashboard, useCloudCV, etc.) sont référencés. Pas de doublons, backups ou anciennes versions trouvés.

### À ne pas supprimer

- **FIREBASE_SETUP.md**, **MIGRATION_FIREBASE_TO_KEYCLOAK.md** : documentation utile pour l’historique et la migration.
- **keycloak-theme/** : thème Keycloak utilisé en production.

---

## 2. Améliorations de design proposées (par zone)

### Landing

- **Cohérence couleurs** : La landing utilise `emerald`, `violet`, `slate`. C’est cohérent ; le design-system (primary indigo/pink) n’est pas utilisé ici — choix assumé « marketing » vs « app ». Option : réutiliser `colors.primary` / `colors.gradient` du design-system pour unifier avec l’app.
- **Contraste / accessibilité** : Vérifier ratio texte blanc sur emerald-500 (hero). Les boutons ont des états hover/scale ; s’assurer d’un focus visible (ring) pour la navigation au clavier.
- **Espacements** : Déjà homogènes (Tailwind). Pas de changement requis.

### Formulaire (étapes)

- **Cohérence** : Les sections utilisent les composants `ui/` (Button, Input, Label). Les couleurs d’erreur (red-500, border-red-300) sont cohérentes.
- **Focus** : S’assurer que tous les champs et boutons ont un `focus:ring-2` ou équivalent pour l’accessibilité.
- **Messages d’erreur** : Déjà présents (ContactForm, AuthModal). Les toasts (useToast) couvrent les retours globaux.

### Templates CV

- **Lisibilité** : Bonne hiérarchie (SectionTitle, polices title/body). Les templates ont déjà `min-w-0 overflow-hidden` et `break-words` / `overflowWrap: 'anywhere'` sur les descriptions de projets pour limiter l’overflow.
- **PDF** : La classe `pdf-export-mode` et les styles dans pdfExport.ts (width 210mm, overflow visible) sont corrects. Aucune régression visuelle identifiée.

### Page Téléchargement (DownloadPage)

- **Cohérence** : Remplacer les couleurs en dur `#2196F3`, `gray-*` par les tokens du design-system (primary, slate) pour alignement avec le reste de l’app et le dark mode.
- **Onglets** : Utiliser la couleur primaire du thème au lieu du bleu fixe.

### Modales (Auth, Export)

- **AuthModal** : Déjà alignée sur le design-system (gradient primary, colors). Corriger l’année en pied de page (2024 → 2026).
- **ExportModal** : Remplacer `#2196F3` / `#1976D2` par les couleurs du design-system pour cohérence et support du thème sombre.

---

## 3. Compléments (manques identifiés et corrections)

### Fonctionnel

- **Erreurs utilisateur** : Les messages d’erreur API/auth sont affichés (AuthModal `error`, toasts). L’import JSON en erreur affiche un toast générique — suffisant.
- **États de chargement** : Export PDF/Image ont `isExporting` + Loader2. Auth a `authLoading`. Pas de manque majeur.
- **Validation** : Contact (firstName, lastName, email) validé dans App.tsx. AuthModal valide email, password, displayName. Les autres étapes n’ont pas de blocage de navigation — comportement volontaire (étapes optionnelles).

### Technique

- **Variables d’environnement** :  
  - **.env.example** : Actuellement uniquement côté frontend (VITE_*). Le backend (server.mjs) utilise `KEYCLOAK_URL`, `KEYCLOAK_ADMIN_CLIENT_ID`, `KEYCLOAK_ADMIN_CLIENT_SECRET`, `ALLOWED_ORIGINS`. À documenter dans .env.example (section Backend) et dans RAILWAY_DEPLOYMENT.md pour le service backend.
- **Typage / lint** : Aucune erreur de typage ou de lint évidente constatée sur les fichiers parcourus.

### Documentation

- **README (app/)** :  
  - Mettre à jour « React 18 » → « React 19 ».  
  - Préciser comment lancer le backend (npm run start dans app/backend).  
  - Structure : retirer la référence à useCloudCV comme « Gestion des CVs » si on veut refléter que le cloud = localStorage, ou laisser et préciser « Stockage local par utilisateur ».
- **KEYCLOAK_SETUP.md** : Déjà cohérent avec KeycloakProvider et config (realm, client, redirect URIs).
- **RAILWAY_DEPLOYMENT.md** : Ajouter une section « Backend (Node/Express) » avec les variables KEYCLOAK_* et ALLOWED_ORIGINS pour le déploiement du backend sur Railway.

### Sécurité / bonnes pratiques

- **Secrets** : Aucun secret en dur dans le code. Les secrets viennent de .env (non versionné).
- **CORS** : Backend utilise `ALLOWED_ORIGINS` (liste d’origines autorisées). Si vide, tout est accepté (à éviter en production) — documenter qu’en production il faut définir ALLOWED_ORIGINS (ex. URL Vercel + URL Railway front si différente).

---

## 4. Modifications concrètes appliquées

Les modifications suivantes ont été effectuées dans le dépôt :

1. **.env.example**  
   - Ajout d’une section Backend avec `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_ADMIN_CLIENT_ID`, `KEYCLOAK_ADMIN_CLIENT_SECRET`, `ALLOWED_ORIGINS`.  
   - Commentaire indiquant que le backend lit ces variables (sans préfixe VITE_).

2. **ExportModal.tsx**  
   - Remplacement des couleurs en dur (`#2196F3`, `#1976D2`, gray) par le design-system (`colors.primary`) pour les onglets/icônes et Tailwind indigo/slate pour boutons et fonds ; support du dark mode (slate, bordures).

3. **DownloadPage.tsx**  
   - Alignement des onglets (Template, Couleurs, Polices), sélections et bouton d’export sur Tailwind indigo/slate et support du dark mode, cohérent avec le design-system.

4. **AuthModal.tsx**  
   - Année du footer mise à jour : « © 2024 » → « © 2026 ».

5. **app/README.md**  
   - React 18 → React 19.  
   - Ajout des instructions pour lancer le backend (depuis app/backend).  
   - Section Variables d’environnement : renvoi à .env.example et mention des variables backend.

6. **RAILWAY_DEPLOYMENT.md**  
   - Nouvelle section « Backend (service Express) » : variables KEYCLOAK_* et ALLOWED_ORIGINS, et rappel que le frontend et le backend peuvent être deux services Railway distincts.

7. **Suppression de la dépendance firebase**  
   - Retrait du package `firebase` dans `app/package.json` (inutilisé après migration Keycloak).

---

## 5. Récapitulatif des contraintes respectées

- **Build** : Aucune modification de la logique métier (auth, sauvegarde, export). Les changements sont limités au style, à la doc et au nettoyage des dépendances.
- **Auth** : Aucun changement sur KeycloakProvider, useAuth, ni les routes backend (register, forgot-password).
- **Export PDF** : Aucune modification de pdfExport.ts ni des templates (déjà `break-words` / overflow géré).
- **Fichiers supprimés** : Uniquement la dépendance `firebase` dans package.json ; aucun fichier source supprimé sans vérification des références.
