import type { Skill } from '../../types/cv';

export const getInitials = (firstName: string, lastName: string): string => {
  if (!firstName || !lastName) return 'CV';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const getSkillLevelWidth = (level: string): string => {
  switch (level) {
    case 'expert': return '100%';
    case 'advanced': return '75%';
    case 'intermediate': return '50%';
    case 'beginner': return '25%';
    default: return '100%';
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
};

// Reusable skill bar component
interface SkillBarProps {
  skill: Skill;
  color: string;
  showLevel?: boolean;
}

export const SkillBar = ({ skill, color, showLevel = true }: SkillBarProps) => (
  <div>
    <p className="text-sm mb-1">{skill.name}</p>
    {showLevel && (
      <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full"
          style={{ 
            width: getSkillLevelWidth(skill.level),
            backgroundColor: color === 'white' ? 'white' : color
          }}
        />
      </div>
    )}
  </div>
);
