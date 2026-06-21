# CV Maker — Documentation Projet (CLAUDE.md)

> Lis ce fichier en entier avant toute intervention. Il contient tout ce qu'il faut savoir pour travailler sur ce projet sans re-explication.

---

## Vue d'ensemble

Application web de création de CV professionnel en mode wizard (étape par étape). L'utilisateur remplit ses informations, choisit un template, et télécharge son CV en PDF. Les CVs sont sauvegardés par utilisateur dans le localStorage.

**Repo local** : `C:\Users\hp\Desktop\CV_Maker`  
**Dev** : `cd app && npm run dev` → http://localhost:5173  
**Backend** : `cd app/backend && node server.mjs` → http://localhost:4000

---

## Stack Technique

| Couche | Technologie | Version |
|--------|------------|---------|
| UI Framework | React | ^19.2.0 |
| Build | Vite | ^7.2.4 |
| Language | TypeScript | ~5.9.3 |
| Styling | Tailwind CSS | ^3.4.19 |
| Animations | Framer Motion | ^12.34.2 |
| UI Primitives | Radix UI | ^1.x |
| Auth | Supabase JS | ^2.x |
| PDF | jsPDF + html2canvas | ^4.1.0, ^1.4.1 |
| Drag & Drop | @dnd-kit | ^6-10.x |
| Forms | React Hook Form + Zod | ^7.x, ^4.x |
| i18n | i18next + react-i18next | ^25.x, ^16.x |
| Icons | lucide-react | ^0.562.0 |
| Toasts | sonner | ^2.0.7 |
| Backend | Express + cors + express-rate-limit | ^4.21.2 |

---

## Structure du Projet

```
CV_Maker/
├── app/
│   ├── src/
│   │   ├── App.tsx              ← Routing principal + tout l'état global
│   │   ├── main.tsx             ← Entry point React (providers: SupabaseProvider, ThemeProvider)
│   │   ├── supabase/
│   │   │   ├── client.ts        ← Création du client Supabase
│   │   │   └── SupabaseProvider.tsx ← Context auth (login/register/logout/forgotPassword)
│   │   ├── keycloak/            ← Ancien système auth (Keycloak - DÉSACTIVÉ, ne pas toucher)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts       ← Hook principal auth (wrapper de useSupabaseAuth)
│   │   │   ├── useCVStorage.ts  ← Persistance localStorage du CV en cours
│   │   │   ├── useCloudCV.ts    ← CRUD des CVs sauvegardés (multi-CV par user)
│   │   │   ├── useAutoSave.ts   ← Auto-save avec historique de versions
│   │   │   ├── useHistory.ts    ← Undo/Redo (max 50 états)
│   │   │   ├── useToast.ts      ← Notifications toast
│   │   │   ├── useTheme.tsx     ← Light/Dark mode
│   │   │   └── useKeyboardShortcuts.ts ← Raccourcis clavier globaux
│   │   ├── sections/            ← Pages du wizard (une par étape)
│   │   │   ├── LandingPage.tsx
│   │   │   ├── CVGalleryPage.tsx ← Page "Mes CVs" (galerie après login)
│   │   │   ├── ContactForm.tsx
│   │   │   ├── ExperienceForm.tsx
│   │   │   ├── EducationForm.tsx
│   │   │   ├── SkillsForm.tsx
│   │   │   ├── LanguagesForm.tsx
│   │   │   ├── CertificationsForm.tsx
│   │   │   ├── ProjectsForm.tsx
│   │   │   ├── InterestsForm.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── FinishForm.tsx
│   │   │   └── DownloadPage.tsx
│   │   ├── components/
│   │   │   ├── CVPreview.tsx    ← Rendu memoïsé du template sélectionné
│   │   │   ├── CVDashboard.tsx  ← Modal de gestion des CVs sauvegardés
│   │   │   ├── AuthModal.tsx    ← Modale login/register/forgot-password
│   │   │   ├── UserMenu.tsx     ← Menu utilisateur (avatar + logout)
│   │   │   ├── ExportModal.tsx  ← Dialogue d'export PDF
│   │   │   ├── ProgressBar.tsx  ← Barre de progression en haut
│   │   │   ├── VerticalStepper.tsx ← Sidebar avec étapes
│   │   │   ├── ZenMode.tsx      ← Mode plein écran sans distraction
│   │   │   ├── AutoSaveIndicator.tsx
│   │   │   ├── FloatingActions.tsx ← Boutons flottants undo/redo/export
│   │   │   ├── templates/       ← 19 templates de CV
│   │   │   │   ├── budapest.tsx, chicago.tsx, stanford.tsx, cambridge.tsx
│   │   │   │   ├── oxford.tsx, otago.tsx, berkeley.tsx, harvard.tsx
│   │   │   │   ├── auckland.tsx, edinburgh.tsx, princeton.tsx
│   │   │   │   ├── brunei.tsx, vladivostok.tsx, sydney.tsx, shanghai.tsx
│   │   │   │   ├── kiev.tsx, rotterdam.tsx, tokyo.tsx, modern.tsx
│   │   │   │   ├── utils.tsx    ← getInitials, formatDate, getSkillLevelWidth, getOrderedSections
│   │   │   │   ├── types.ts     ← TemplateProps interface
│   │   │   │   └── components/  ← SectionTitle, ContactItem, TimelineItem, SkillBar, TagList
│   │   │   └── ui/              ← Composants Radix UI stylés (button, input, dialog, etc.)
│   │   ├── types/
│   │   │   └── cv.ts            ← TOUTES les interfaces TypeScript du projet
│   │   ├── utils/
│   │   │   ├── pdfExport.ts     ← Logique export PDF (jsPDF + html2canvas)
│   │   │   └── validation.ts    ← Validation des champs de formulaire
│   │   ├── styles/
│   │   │   └── design-system.ts ← Palettes de couleurs, shadows, Framer Motion variants
│   │   └── i18n/
│   │       ├── index.ts         ← Config i18next (FR par défaut, détection auto)
│   │       └── locales/
│   │           ├── fr.json      ← Traductions françaises
│   │           └── en.json      ← Traductions anglaises
│   ├── backend/
│   │   └── server.mjs           ← Express : PayPal routes uniquement
│   ├── .env                     ← Variables d'environnement (voir section dédiée)
│   └── package.json
└── CLAUDE.md                    ← CE FICHIER
```

---

## Flux de Navigation (Steps)

```
landing → my-cvs → contact → experience → education → skills
→ languages → certifications → projects → interests → profile
→ finish → download
```

**Règles importantes dans App.tsx** :
- Si `!isAuthenticated` → forcer `landing`
- Si `isAuthenticated && currentStep === 'landing'` → aller à `my-cvs`
- `showPreview` et `showProgress` = `false` pour `landing`, `my-cvs`, `download`
- Le type `Step` est dans `src/types/cv.ts` — toujours l'étendre là quand on ajoute une étape

---

## Types TypeScript Essentiels

```typescript
// src/types/cv.ts

type Step = 'landing' | 'my-cvs' | 'contact' | 'experience' | 'education'
          | 'skills' | 'languages' | 'certifications' | 'projects'
          | 'interests' | 'profile' | 'finish' | 'download';

interface CVData {
  contact: ContactInfo;       // Nom, email, téléphone, photo, titre...
  experiences: Experience[];  // id, jobTitle, employer, city, startDate, endDate, currentlyWorking, description
  educations: Education[];    // id, school, diploma, city, graduationDate, fieldOfStudy, gpa
  skills: Skill[];            // id, name, level ('beginner'|'intermediate'|'advanced'|'expert')
  languages: Language[];      // id, name, level (+ 'native')
  certifications: Certification[]; // id, name, organization, date, expiryDate, credentialId
  projects: Project[];        // id, name, description, link, technologies[]
  profile: string;            // Résumé professionnel
  interests: string[];
  socialLinks: SocialLink[];
  references: Reference[];
  internships: Experience[];
  publications: string[];
  extracurricular: string[];
}

interface CVSettings {
  template: string;           // Nom du template ('budapest', 'chicago', etc.)
  primaryColor: string;       // '#1a1a1a' par défaut
  secondaryColor?: string;
  titleFont: string;          // 'Bebas Neue' par défaut
  bodyFont: string;           // 'Lato' par défaut
  language: string;           // 'fr' | 'en'
  showSkillLevels: boolean;
  showSkillsAsTags: boolean;
  sectionOrder?: string[];
  hiddenSections?: string[];
}

// CV sauvegardé (useCloudCV)
interface SavedCV {
  id: string;
  userId: string;
  name: string;
  cvData: CVData;
  settings: CVSettings;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Authentification (Supabase)

**Provider** : `src/supabase/SupabaseProvider.tsx` — wraps toute l'app dans `main.tsx`  
**Client** : `src/supabase/client.ts` — `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)`  
**Hook** : `useAuth()` depuis `src/hooks/useAuth.ts`

```typescript
// Ce que retourne useAuth()
{
  user: { uid, email, displayName } | null,
  isAuthenticated: boolean,
  loading: boolean,
  login(email?, password?): Promise<void>,
  register(email?, password?, displayName?): Promise<void>,
  logout(): Promise<void>,
  forgotPassword(email?): Promise<void>,
  error: { code, message } | null,
  clearError(): void,
}
```

**Règle** : Ne jamais importer `useSupabaseAuth` directement dans les composants. Toujours passer par `useAuth()`.

---

## Stockage des CVs

### CV en cours d'édition — `useCVStorage`
- Clés localStorage : `cv-builder-data-{userId}`, `cv-builder-settings-{userId}`, `cv-builder-step-{userId}`
- Auto-save debounced 500ms à chaque changement
- Export/Import JSON via `exportData()` / `importData(file)`

### Multi-CVs sauvegardés — `useCloudCV`
- Clé localStorage : `cv-maker-cvs` (objet `{ [userId]: SavedCV[] }`)
- API : `saveToCloud(name, cvData, settings)`, `loadFromCloud(id)`, `deleteFromCloud(id)`
- Cache 5 minutes en mémoire pour éviter les re-reads excessifs
- Toutes les opérations nécessitent `isAuthenticated === true`

---

## Templates Disponibles (19)

| Nom | Style |
|-----|-------|
| budapest | Sidebar colorée gauche |
| chicago | Header centré classique |
| stanford | Sidebar foncée élégante |
| cambridge | Header bleu classique |
| oxford | Sidebar droite structurée |
| otago | Minimaliste professionnel |
| berkeley | Design avec icônes |
| harvard | Sidebar bleue avec timeline |
| auckland | 2 colonnes équilibrées |
| edinburgh | Header violet moderne |
| princeton | Classique centré |
| brunei | Minimaliste élégant |
| vladivostok | Moderne sidebar droite |
| sydney | Épuré avec timeline |
| shanghai | Corporate professionnel |
| kiev | Créatif grande photo |
| rotterdam | Technique compétences |
| tokyo | Compact 2 colonnes |
| modern | Fallback par défaut |

**Ajouter un template** : créer `src/components/templates/montemplate.tsx`, exporter depuis `templates/index.ts`, ajouter dans `CVPreview.tsx` et dans la liste de `DownloadPage.tsx`.

---

## Backend Express (PayPal uniquement)

**Fichier** : `app/backend/server.mjs` | **Port** : 4000

| Route | Méthode | Description | Rate Limit |
|-------|---------|-------------|-----------|
| `/payments/create-order` | POST | Créer commande PayPal | 10/15min |
| `/payments/capture-order` | POST | Capturer paiement PayPal | 10/15min |
| `/health` | GET | Health check | - |

**Note** : L'auth (register/forgot-password) est gérée 100% côté client via Supabase SDK. Le backend ne fait que PayPal.

---

## Variables d'Environnement

**Fichier** : `app/.env`

```env
# Supabase (OBLIGATOIRE)
VITE_SUPABASE_URL=https://bzznfruonutxlrgwyyhi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...

# PayPal Frontend
VITE_PAYPAL_CLIENT_ID=Ab28DGQ...
VITE_BACKEND_URL=http://localhost:4000

# PayPal Backend
PAYPAL_CLIENT_ID=Ab28DGQ...
PAYPAL_CLIENT_SECRET=EOpQAr...
PAYPAL_ENV=sandbox
CV_PRICE=2.00
CV_CURRENCY=EUR

# CORS Backend
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

---

## Internationalisation

- FR par défaut, EN disponible
- Fichiers : `src/i18n/locales/fr.json`, `src/i18n/locales/en.json`
- Usage : `const { t } = useTranslation(); t('clé.de.traduction')`
- Langue synchronisée entre `i18n.language` et `settings.language`

---

## Design & Conventions

- **Tailwind CSS** avec dark mode class-based (`dark:...`)
- **Gradient principal** : `from-indigo-500 to-purple-600` (boutons, hero)
- **Animations** : Framer Motion — `motion.div`, `AnimatePresence` pour les transitions
- **Variants réutilisables** dans `src/styles/design-system.ts`
- **Rounded** : `rounded-xl` ou `rounded-2xl` pour les cartes/modales
- **Composants UI** : toujours utiliser `src/components/ui/button`, `input`, etc.
- **Toasts** : `const { success, error } = useToast()` — jamais `alert()`
- **Confirmation destructive** : utiliser `ConfirmationModal`, jamais `window.confirm`

---

## Patterns à Respecter

### Ajouter une nouvelle section de formulaire
1. Créer `src/sections/MaSectionForm.tsx`
2. Ajouter le type dans `src/types/cv.ts` (si nouveau type de données)
3. Ajouter la clé dans `CVData`
4. Ajouter les handlers dans `App.tsx` (`addX`, `updateX`, `deleteX`, `reorderX`)
5. Ajouter le `case` dans `renderContent()` dans `App.tsx`
6. Ajouter l'étape dans `Step` type et dans le tableau `steps` dans `App.tsx`
7. Ajouter les traductions dans `fr.json` et `en.json`

### Ajouter une nouvelle étape de navigation
1. Ajouter dans `Step` type (`src/types/cv.ts`)
2. Ajouter dans le tableau `steps` dans `App.tsx` si elle doit apparaître dans le stepper
3. Ajouter `case` dans `renderContent()`
4. Mettre à jour `showPreview` et `showProgress` si besoin

### Modifier le style global
- Couleurs CSS vars : `app/src/index.css`
- Config Tailwind : `app/tailwind.config.js`
- Design tokens : `app/src/styles/design-system.ts`

---

## Comportements Importants à Connaître

- **Après login** → automatiquement redirigé vers `my-cvs` (CVGalleryPage)
- **Logout** → retour à `landing`
- **Import JSON** : fonctionne via `importData(file)` de `useCVStorage` + redirect vers `contact`
- **Export PDF** : `src/utils/pdfExport.ts` utilise html2canvas sur le `CVPreview` puis jsPDF
- **Undo/Redo** : Ctrl+Z / Ctrl+Y — limité à 50 états via `useHistory`
- **Zen Mode** : icône en bas à droite, cache tout sauf le contenu du formulaire
- **Mobile** : preview CV accessible via bouton flottant en bas de page
- **Auto-save** : s'exécute toutes les 5 secondes si des changements ont eu lieu
- **CVPreview** : memoïsé avec `areEqual()` custom pour éviter les re-renders inutiles

---

## Commandes Utiles

```bash
# Lancer tout le projet
cd app && npm run dev           # Frontend → localhost:5173
cd app/backend && node server.mjs # Backend → localhost:4000

# TypeScript check (toujours vérifier avant de dire "c'est bon")
cd app && npx tsc --noEmit

# Tests
cd app && npm test

# Build prod
cd app && npm run build
```
