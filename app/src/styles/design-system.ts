// Design System — CV Maker
// Aesthetic: Linear / Vercel / Raycast — fast, precise, no bounce

import type { Variants } from 'framer-motion';

// ─── Color palette (reference values — use CSS vars in components) ─────────

export const accent = {
  50:  '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb', // light mode CTA
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
};

export const neutral = {
  0:   '#ffffff',
  50:  '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0a0a0a',
};

export const semantic = {
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  info:    'hsl(var(--info))',
  destructive: 'hsl(var(--destructive))',
};

// ─── Framer Motion variants ────────────────────────────────────────────────
// Rules: short (0.2–0.25s), easeOut, subtle movement (y≤8, scale≥0.96)
// Import these in components instead of redefining inline.

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

// Backward-compat alias — prefer slideInLeft in new code
export const slideIn = slideInLeft;

// ─── Layout tokens ─────────────────────────────────────────────────────────

export const CARD_STYLES = {
  compact:   'p-4',   // cartes de formulaire (items liste)
  standard:  'p-6',   // cartes de section principale
  marketing: 'p-8',   // cartes landing page
} as const;

export const RADIUS = {
  sm: 'rounded-md',   // 6px — badges, chips
  md: 'rounded-lg',   // 8px — boutons, inputs, cartes compactes
  lg: 'rounded-xl',   // 12px — modales, cartes marketing
} as const;

// ─── Shadow tokens (CSS counterparts in tailwind.config.js) ───────────────

export const shadows = {
  card:     '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
  elevated: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.05)',
  overlay:  '0 8px 24px -4px rgb(0 0 0 / 0.12), 0 4px 8px -2px rgb(0 0 0 / 0.06)',
};

// ─── CV theme colors — single source used by FinishForm + DownloadPage ───────

export const THEME_COLORS = [
  { name: 'Charcoal',      value: '#1a1a1a' },
  { name: 'Navy',          value: '#2c3e50' },
  { name: 'Bleu royal',    value: '#1e3a8a' },
  { name: 'Violet',        value: '#6b2c91' },
  { name: 'Rouge vif',     value: '#c62828' },
  { name: 'Orange foncé',  value: '#d84315' },
  { name: 'Orange',        value: '#f57c00' },
  { name: 'Ambre',         value: '#f9a825' },
  { name: 'Vert',          value: '#4CAF50' },
  { name: 'Teal',          value: '#00897b' },
  { name: 'Cyan',          value: '#00acc1' },
  { name: 'Bleu clair',    value: '#0288d1' },
] as const;

// ─── Typography — shared font lists ───────────────────────────────────────────

export const TITLE_FONTS = [
  { name: 'Bebas Neue',     value: 'Bebas Neue'     },
  { name: 'Roboto',         value: 'Roboto'         },
  { name: 'Arial',          value: 'Arial'          },
  { name: 'Roboto Mono',    value: 'Roboto Mono'    },
  { name: 'Bebas Kai',      value: 'Bebas Kai'      },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  { name: 'Ubuntu',         value: 'Ubuntu'         },
  { name: 'Open Sans',      value: 'Open Sans'      },
  { name: 'Cabin',          value: 'Cabin'          },
] as const;

export const BODY_FONTS = [
  { name: 'Lato',           value: 'Lato'           },
  { name: 'Open Sans',      value: 'Open Sans'      },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Arial',          value: 'Arial'          },
  { name: 'Roboto',         value: 'Roboto'         },
  { name: 'Roboto Mono',    value: 'Roboto Mono'    },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  { name: 'Butler',         value: 'Butler'         },
] as const;

// ─── Label style — shared across form sections ─────────────────────────────

export const LABEL_CLASS = 'block text-xs font-medium uppercase tracking-wider text-muted-foreground';

// ─── Legacy export — kept for ExportModal and any remaining consumers ──────

export const colors = {
  primary: {
    50:  accent[50],
    100: accent[100],
    200: accent[200],
    300: accent[300],
    400: accent[400],
    500: accent[500],
    600: accent[600],
    700: accent[700],
    800: accent[800],
    900: accent[900],
  },
  dark: {
    50:  neutral[50],
    100: neutral[100],
    200: neutral[200],
    300: neutral[300],
    400: neutral[400],
    500: neutral[500],
    600: neutral[600],
    700: neutral[700],
    800: neutral[800],
    900: neutral[950],
  },
  gradient: {
    primary:      `linear-gradient(135deg, ${accent[500]} 0%, ${accent[600]} 100%)`,
    primaryHover: `linear-gradient(135deg, ${accent[600]} 0%, ${accent[700]} 100%)`,
    subtle:       `linear-gradient(135deg, ${neutral[50]} 0%, ${accent[50]} 100%)`,
  },
};
