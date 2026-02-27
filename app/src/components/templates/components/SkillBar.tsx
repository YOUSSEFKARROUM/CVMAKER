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
      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
        {name}
      </span>
    );
  }

  if (variant === 'dot') {
    return (
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-700">{name}</span>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium mb-1">{name}</p>
      {showLevel && level && (
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full"
            style={{ 
              width: getSkillLevelWidth(level),
              backgroundColor: color 
            }}
          />
        </div>
      )}
    </div>
  );
}
