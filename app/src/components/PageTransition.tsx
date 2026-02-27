import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type TransitionType = 'fade' | 'slide' | 'scale' | 'slideUp' | 'slideDown';

interface PageTransitionProps {
  children: ReactNode;
  isActive: boolean;
  type?: TransitionType;
  delay?: number;
  duration?: number;
  className?: string;
}

const transitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
} as const;

export function PageTransition({
  children,
  isActive,
  type = 'slideUp',
  delay = 0,
  duration = 0.3,
  className = '',
}: PageTransitionProps) {
  const transition = transitions[type];

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={transition.initial}
          animate={transition.animate}
          exit={transition.exit}
          transition={{
            duration,
            delay,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Composant pour animer les éléments enfants avec stagger
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0.1,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Composant pour animer un élément enfant
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Transition spécifique pour les formulaires
export function FormTransition({
  children,
  isActive,
  direction = 'next',
}: {
  children: ReactNode;
  isActive: boolean;
  direction?: 'next' | 'prev';
}) {
  const xOffset = direction === 'next' ? 50 : -50;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isActive && (
        <motion.div
          key={isActive ? 'active' : 'inactive'}
          initial={{ opacity: 0, x: xOffset }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -xOffset }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
