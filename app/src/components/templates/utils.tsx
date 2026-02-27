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

export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
};
