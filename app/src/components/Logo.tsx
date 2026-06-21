import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { iconH: 22,  gap: 'gap-1.5', text: 'text-base' },
  md: { iconH: 30,  gap: 'gap-2',   text: 'text-xl'   },
  lg: { iconH: 42,  gap: 'gap-2.5', text: 'text-3xl'  },
  xl: { iconH: 56,  gap: 'gap-3',   text: 'text-5xl'  },
};

// Inline SVG — uses currentColor so it adapts to light/dark and colored backgrounds
function CvMakerIcon({ height, className = '' }: { height: number; className?: string }) {
  const width = Math.round(height * 0.82);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 34 42"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Document body — top-right fold */}
      <path d="M5 2h18l9 9v27a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      {/* Fold ear */}
      <polyline points="23,2 23,11 32,11" />
      {/* Content lines */}
      <line x1="9" y1="22" x2="25" y2="22" />
      <line x1="9" y1="28" x2="25" y2="28" />
      <line x1="9" y1="34" x2="18" y2="34" />
    </svg>
  );
}

export function Logo({ size = 'md', animated = true, showText = true, className = '' }: LogoProps) {
  const { iconH, gap, text } = sizes[size];

  const inner = (
    <>
      <CvMakerIcon height={iconH} />
      {showText && (
        <span
          className={`${text} leading-none tracking-tight text-foreground`}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <span className="font-extrabold">cv</span>
          <span className="font-light">maker</span>
        </span>
      )}
    </>
  );

  if (!animated) {
    return (
      <div className={`flex items-center ${gap} ${className}`}>
        {inner}
      </div>
    );
  }

  return (
    <motion.div
      className={`flex items-center ${gap} ${className}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {inner}
    </motion.div>
  );
}

// Pulsing icon for loading states
export function LogoLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const h = { sm: 24, md: 32, lg: 44 }[size];
  return (
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="text-foreground"
    >
      <CvMakerIcon height={h} />
    </motion.div>
  );
}

// Icon-only variant (e.g. inside colored buttons / auth panel)
export function LogoIcon({ className = '' }: { className?: string }) {
  return <CvMakerIcon height={28} className={className} />;
}
