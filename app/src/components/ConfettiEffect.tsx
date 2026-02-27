import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const fireConfetti = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        onComplete?.();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6']
      });
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6']
      });
    }, 250);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
  }, [trigger, fireConfetti]);

  return null;
}

// Fireworks effect for special celebrations
export function fireworkConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'],
      disableForReducedMotion: true,
    });
  }, 400);
}

// Simple success pop
export function successConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#ec4899', '#10b981'],
    disableForReducedMotion: true,
  });
}
