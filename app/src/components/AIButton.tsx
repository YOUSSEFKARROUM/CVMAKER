import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIButtonProps {
  onClick: () => Promise<void>;
  label?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline' | 'blue';
  className?: string;
  disabled?: boolean;
}

export default function AIButton({
  onClick,
  label = 'IA',
  size = 'sm',
  variant = 'outline',
  className,
  disabled,
}: AIButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await onClick();
    } catch (err) {
      console.error('AI error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        'gap-1.5 text-blue-600 border-blue-500/30 hover:bg-blue-500/10',
        loading && 'opacity-70',
        className,
      )}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      {label}
    </Button>
  );
}
