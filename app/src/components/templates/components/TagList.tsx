interface TagListProps {
  items: string[];
  variant?: 'default' | 'compact' | 'colored';
  color?: string;
  className?: string;
}

export function TagList({ 
  items, 
  variant = 'default',
  color,
  className = '' 
}: TagListProps) {
  if (!items || items.length === 0) return null;

  const variantStyles = {
    default: 'px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700',
    compact: 'text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-700',
    colored: 'text-xs px-2 py-1 bg-white/20 rounded text-white'
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item, idx) => (
        <span 
          key={idx} 
          className={variantStyles[variant]}
          style={variant === 'colored' && color ? { backgroundColor: `${color}20` } : undefined}
        >
          {variant === 'default' ? item : `• ${item}`}
        </span>
      ))}
    </div>
  );
}
