# Prompt : Amélioration Design, UI & UX - CV Maker

## Contexte
Application React de création de CV avec les caractéristiques suivantes :
- **Stack** : React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **10 templates de CV** : Budapest, Chicago, Brunei, Vladivostok, Sydney, Shanghai, Kiev, Rotterdam, Tokyo, Modern
- **Fonctionnalités** : Auth Firebase, sauvegarde cloud, export PDF, i18n (FR/EN)
- **10 étapes** : Contact → Expérience → Formation → Compétences → Langues → Certifications → Projets → Intérêts → Profil → Finaliser

---

## 🎨 OBJECTIF GLOBAL

Transformer l'application en une expérience **premium, moderne et delight** qui donne envie de créer un CV. L'utilisateur doit se sentir guidé, confiant et impressionné par la qualité.

---

## 📐 PARTIE 1 : DESIGN SYSTEM & IDENTITÉ VISUELLE

### 1.1 Nouvelle Identité Visuelle

**Palette de couleurs (remplacer le bleu #2196F3 basic)** :
```
Primary : #6366F1 (Indigo 500) - Moderne, professionnel, confiance
Secondary : #EC4899 (Pink 500) - Accent créatif, énergie
Tertiary : #10B981 (Emerald 500) - Succès, validation
Dark : #0F172A (Slate 900) - Textes, titres
Light : #F8FAFC (Slate 50) - Fonds
Gradient : linear-gradient(135deg, #6366F1 0%, #EC4899 100%) - Hero, CTAs
```

**Typographie** :
- Titres : "Plus Jakarta Sans" ou "Inter" - Poids 700-800
- Corps : "Inter" - Poids 400-500
- Monospace (code/dates) : "JetBrains Mono"

**Rayons de bordure** :
- Cards : `rounded-2xl` (16px)
- Boutons : `rounded-full` (pill) pour CTAs, `rounded-xl` pour secondaires
- Inputs : `rounded-xl` avec focus ring indigo

**Ombres (depth)** :
```css
shadow-soft: 0 4px 20px -2px rgba(99, 102, 241, 0.15)
shadow-hover: 0 20px 40px -10px rgba(99, 102, 241, 0.25)
shadow-card: 0 2px 8px rgba(0, 0, 0, 0.04)
```

---

## 🏠 PARTIE 2 : LANDING PAGE (Première impression)

### 2.1 Hero Section (Immersion immédiate)

**Layout** : Split-screen asymétrique
- **Gauche (60%)** : Headline + CTA + compteur social proof
- **Droite (40%)** : Carousel auto-play des templates CV (3D perspective)

**Animations** :
```
- Entrée : Texte stagger depuis la gauche (0.1s delay par élément)
- CV Preview : Float animation subtile (translateY ±10px, 4s infinite)
- Background : Gradient mesh animé (blob morphing CSS)
- CTA : Pulse glow effect au hover
```

**Contenu** :
```
Headline : "Créez un CV qui démarque"
Subheadline : "En 10 minutes. Sans effort. Gratuit."
Social Proof : "Rejoint par +10 000 candidats"
CTA Primary : "Créer mon CV gratuitement" (gradient + glow)
CTA Secondary : "Voir les templates" (scroll vers gallery)
```

### 2.2 Section Templates Gallery

**Layout** : Masonry grid ou horizontal scroll avec snap
**Interaction** :
- Hover : Zoom 1.05 + overlay "Aperçu rapide"
- Click : Expand modal avec preview fullscreen
- Badge "Populaire" sur Budapest & Chicago

**Filtres** :
- Tabs : Tous | Créatifs | Professionnels | Minimalistes
- Toggle : Voir avec/sans photo

### 2.3 Section Fonctionnalités (Iconographie animée)

**Layout** : 3 colonnes avec illustrations Lottie ou SVG animées

| Feature | Icon Animation | Description |
|---------|---------------|-------------|
| Édition temps réel | Pencil writing | Changes instantanément reflétés |
| IA Assistant | Sparkles sparkle | Suggestions intelligentes |
| Export PDF | Download bounce | Téléchargement instantané |

### 2.4 Section Témoignages / Social Proof

**Carousel infini** : Logos entreprises + citations utilisateurs
```
"J'ai décroché 3 entretiens en 1 semaine !"
— Marie L., Marketing Manager ★★★★★
```

### 2.5 Footer Premium

**Layout** : 4 colonnes (Produit, Ressources, Légal, Newsletter)
**Newsletter** : Input inline avec bouton gradient

---

## 🔐 PARTIE 3 : AUTHENTIFICATION (Onboarding fluide)

### 3.1 Landing avec Auth Intégrée

**Layout** : Split screen
- **Gauche** : Visuel créatif (illustration personnage créant un CV)
- **Droite** : Card flottante avec tabs Login/Register

**UX Improvements** :
- **Auto-focus** sur premier champ
- **Validation en temps réel** (pas d'erreur après submit)
- **Password strength indicator** (barre colorée + critères)
- **Social login** : Google, LinkedIn (boutons secondaires)
- **Magic link option** : "Recevoir un lien de connexion"

### 3.2 Micro-interactions

```
- Input focus : Border indigo + shadow glow
- Validation ok : Checkmark vert qui apparaît
- Erreur : Shake animation + message inline
- Submit loading : Bouton devient spinner morphing
- Succès : Confetti particles + redirect smooth
```

---

## 📋 PARTIE 4 : FORMULAIRES (Édition CV)

### 4.1 Layout Global

**Structure** :
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  Stepper progressif                    [User]   │  ← Header sticky
├──────────────────────┬──────────────────────────────────┤
│                      │                                  │
│   FORMULAIRE         │    PREVIEW CV                    │
│   (60%)              │    (40%)                         │
│                      │    ┌─────────────┐               │
│   [Section title]    │    │             │               │
│   [Sous-titre]       │    │   CV A4     │               │
│                      │    │   preview   │               │
│   [Champ]            │    │   scale     │               │
│   [Champ]            │    │             │               │
│   [Champ]            │    └─────────────┘               │
│                      │                                  │
│   [+ Ajouter]        │                                  │
│                      │                                  │
├──────────────────────┴──────────────────────────────────┤
│  [← Précédent]              [Continuer →]               │  ← Footer sticky
└─────────────────────────────────────────────────────────┘
```

### 4.2 Stepper Progressif (Navigation)

**Design** :
- Timeline verticale gauche (desktop) / horizontale compacte (mobile)
- Étape active : Cercle indigo plein + label visible
- Étape complétée : Checkmark vert + ligne verte
- Étape future : Cercle gris outline

**Tooltip au hover** : Nom de l'étape + mini preview

### 4.3 Champs de Formulaire (Premium)

**Input Design** :
```
┌─────────────────────────────────────┐
│ Label flottant                      │  ← Animé (placeholder → label)
│ ┌───────────────────────────────┐   │
│ │ Valeur saisie          [icon] │   │  ← Icon contextuel (mail, phone...)
│ └───────────────────────────────┘   │
│ Hint text / Error message             │  ← Gris ou rouge
└─────────────────────────────────────┘
```

**Types de champs améliorés** :

1. **Date Picker** : Calendar overlay au lieu de input natif
2. **Téléphone** : Formatage auto (+33 6 12 34 56 78)
3. **Adresse** : Autocomplete Google Places
4. **Photo** : Drag & drop zone avec preview circulaire
5. **Rich Text** : Éditeur léger pour descriptions (bold, bullet points)

### 4.4 Gestion des Expériences/Formations (Drag & Drop)

**Card Item** :
```
┌─────────────────────────────────────────────────────────┐
│ ⠿  [Icon métier]  Titre du poste              [⋯] [🗑️] │  ← Handle drag
│                   Entreprise | Lieu                     │
│                   Date début → Date fin                 │
│                   Description...                        │
└─────────────────────────────────────────────────────────┘
```

**Interactions** :
- **Drag** : Ghost card semi-transparente
- **Hover** : Actions apparaissent (edit, delete, duplicate)
- **Expand** : Click pour éditer inline (pas de modal)
- **Add** : Bouton "+ Ajouter une expérience" sticky bottom

### 4.5 Skills (Tag Input moderne)

**Design** :
```
┌─────────────────────────────────────────┐
│ Ajoutez vos compétences...              │
├─────────────────────────────────────────┤
│ [JavaScript] [React] [TypeScript] [x]   │  ← Tags closables
│ [Node.js] [+]                           │
└─────────────────────────────────────────┘
```

**Features** :
- Suggestions auto (base de compétences populaires)
- Niveau sélectionnable par tag (débutant → expert)
- Animation d'entrée (scale + fade)

### 4.6 Feedback & Validation

**Toast Notifications** (Top-right) :
```
┌────────────────────────────┐
│ ✅  Expérience ajoutée      │
│     2 minutes              │
└────────────────────────────┘
```
- Success : Vert avec checkmark
- Error : Rouge avec animation shake
- Info : Indigo avec icône info

**Auto-save indicator** :
```
Enregistrement... → Enregistré ✓  (dans la topbar)
```

---

## 👁️ PARTIE 5 : PREVIEW CV (Temps réel)

### 5.1 Aperçu Live

**Position** : Sticky right panel (40% width desktop)
**Features** :
- **Zoom controls** : 50% | 75% | 100% | Fit
- **Template switcher** : Mini-thumbnails en haut
- **Color picker** : Palette rapide (5 couleurs prédéfinies)
- **Font switcher** : Dropdown avec preview
- **Page counter** : "Page 1 / 2" si multi-pages

### 5.2 Mode Fullscreen

**Bouton expand** : Preview prend tout l'écran
**Navigation** : Flèches latérales pour changer template
**Compare mode** : Côte-à-côte 2 templates

---

## ✅ PARTIE 6 : PAGE FINALISER (Download)

### 6.1 Success State

**Animation** : 
- Checkmark qui se dessine (SVG stroke animation)
- Confetti explosion
- CV qui "pop" en 3D

**Layout** :
```
┌─────────────────────────────────────────┐
│                                         │
│      ✓                                  │
│   Votre CV est prêt !                   │
│                                         │
│   [Preview CV]                          │
│                                         │
│   [Télécharger PDF]  [Partager]         │
│   [Modifier]  [Nouveau CV]              │
│                                         │
│   ─────────────────────────────         │
│   Vos CV sauvegardés :                  │
│   [CV 1] [CV 2] [CV 3]                  │
│                                         │
└─────────────────────────────────────────┘
```

### 6.2 Options de Partage

- **Lien public** : Toggle on/off + copy link
- **QR Code** : Généré pour mobile
- **Email** : Envoyer à soi-même

---

## 📱 PARTIE 7 : RESPONSIVE & MOBILE

### 7.1 Breakpoints

```
Mobile First :
- sm : 640px  → Cards full width
- md : 768px  → 2 colonnes pour formulaires
- lg : 1024px → Split screen formulaire/preview
- xl : 1280px → Max-width container + margins
```

### 7.2 Mobile Experience

**Navigation** : Bottom tab bar (pas de hamburger)
```
[Éditer] [Aperçu] [Télécharger]
```

**Preview** : Swipeable carousel entre formulaire et preview
**Input** : Keyboard-friendly (pas de bottom fixed qui cache)

---

## 🎭 PARTIE 8 : ANIMATIONS & MICRO-INTERACTIONS

### 8.1 Page Transitions

```css
/* Entrée de page */
@keyframes pageEnter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
duration: 400ms
easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### 8.2 List Animations

```css
/* Ajout d'élément */
@keyframes itemEnter {
  from { opacity: 0; transform: scale(0.95) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Suppression */
@keyframes itemLeave {
  to { opacity: 0; transform: translateX(100%); height: 0; }
}
```

### 8.3 Hover Effects

```css
/* Cards */
transform: translateY(-4px);
box-shadow: var(--shadow-hover);
transition: all 0.3s ease;

/* Buttons */
background-size: 200% auto;
background-position: right center;
/* Gradient shift on hover */

/* Icons */
transform: scale(1.1) rotate(5deg);
```

### 8.4 Loading States

**Skeleton Screens** : Pas de spinner, placeholder gris animé
**Button loading** : Spinner dans le bouton + texte "Chargement..."
**Progress** : Barre fluide avec pourcentage

---

## 🌙 PARTIE 9 : DARK MODE (Optionnel)

**Toggle** : Sun/Moon icon dans header
**Palette** :
```
Background : #0F172A (Slate 900)
Surface : #1E293B (Slate 800)
Text : #F8FAFC (Slate 50)
Muted : #94A3B8 (Slate 400)
```

---

## 🎯 PARTIE 10 : ACCESSIBILITÉ (A11Y)

- **Contraste** : Ratio minimum 4.5:1
- **Focus rings** : Visible sur tous les éléments interactifs
- **ARIA labels** : Pour icônes et boutons
- **Keyboard nav** : Tab order logique, Esc pour fermer modals
- **Reduced motion** : Respecter `prefers-reduced-motion`
- **Screen reader** : Headings hierarchiques, landmarks

---

## 📦 PARTIE 11 : Ressources Recommandées

### Librairies à ajouter
```bash
# Animations
npm install framer-motion

# Icônes (plus riches)
npm install @heroicons/react

# Date picker
npm install react-datepicker

# Rich text editor (léger)
npm install react-simple-wysiwyg

# Confetti
npm install canvas-confetti
```

### Assets à générer/générer
- Illustration Hero (3D ou flat design)
- Mockups CV templates
- Logo animé (SVG)
- Pattern de fond subtil

---

## ✅ CHECKLIST DE LIVRAISON

### Priorité Haute (MVP Design)
- [ ] Nouvelle palette couleurs appliquée globalement
- [ ] Landing page hero redesign
- [ ] Auth modal redesign
- [ ] Formulaires avec floating labels
- [ ] Preview sticky amélioré
- [ ] Animations page transitions

### Priorité Moyenne
- [ ] Dark mode
- [ ] Template gallery masonry
- [ ] Rich text editor descriptions
- [ ] Confetti animations

### Priorité Basse (Polish)
- [ ] 3D CV preview
- [ ] Sound effects (optionnel)
- [ ] Advanced micro-interactions

---

## 🎨 INSPIRATIONS VISUELLES

- **Notion** : Simplicité, interactions fluides
- **Linear** : Design sombre premium, animations
- **Canva** : Édition visuelle intuitive
- **Framer** : Site marketing, animations
- **TailwindUI** : Composants référence

---

**Résultat attendu** : Une application qui ne ressemble plus à un "formulaire web" mais à un **outil professionnel premium** que les utilisateurs adorent utiliser et recommandent.
