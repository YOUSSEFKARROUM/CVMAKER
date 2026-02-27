declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    disableForReducedMotion?: boolean;
    zIndex?: number;
    scalar?: number;
    startVelocity?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    shapes?: ('square' | 'circle')[];
    [key: string]: any;
  }

  function confetti(options?: ConfettiOptions): Promise<void>;

  export default confetti;
}
