// Design System - CV Maker Premium
// Colors, shadows, animations constants

import type { Variants } from 'framer-motion';

export const colors = {
  // Primary palette
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main primary
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  // Secondary (accent)
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Main secondary
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  // Success
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main success
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  // Dark/Slate
  dark: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a', // Main dark
  },
  // Gradient
  gradient: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
    primaryHover: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
    subtle: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 100%)',
  },
};

export const shadows = {
  soft: '0 4px 20px -2px rgba(99, 102, 241, 0.15)',
  hover: '0 20px 40px -10px rgba(99, 102, 241, 0.25)',
  card: '0 2px 8px rgba(0, 0, 0, 0.04)',
  elevated: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(99, 102, 241, 0.4)',
};

// Framer Motion variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
};

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  },
};
