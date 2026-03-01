import { getSkillLevelWidth } from '../utils';

interface SkillBarProps {
  name: string;
  level?: string;
  color?: string;
  showLevel?: boolean;
  variant?: 'bar' | 'tag' | 'dot';
}

export function SkillBar({ 
  name, 
  level, 
  color,
  showLevel = true,
  variant = 'bar'
}: SkillBarProps) {
  if (variant === 'tag') {
    return (
      <span 
        className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 border border-gray-200/80 bg-gray-50/80"
        style={color ? { borderColor: `${color}40`, color, backgroundColor: `${color}08` } : undefined}
      >
        {name}
      </span>
    );
  }

  if (variant === 'dot') {
    return (
      <div className="flex items-center gap-2.5">
        <div 
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color || '#6b7280' }}
        />
        <span className="text-sm text-gray-700">{name}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-gray-800">{name}</p>
      {showLevel && level && (
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: getSkillLevelWidth(level),
              backgroundColor: color || '#4b5563'
            }}
          />
        </div>
      )}
    </div>
  );
}
