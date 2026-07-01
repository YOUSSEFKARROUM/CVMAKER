import type { CVSettings } from '../../types/cv';

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

export type LayoutSectionId =
  | 'profile'
  | 'experience'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'languages';

export const DEFAULT_SECTION_ORDER: LayoutSectionId[] = [
  'profile',
  'experience',
  'education',
  'projects',
  'certifications',
  'languages',
];

export const getOrderedSections = (settings: CVSettings): LayoutSectionId[] => {
  const rawOrder = settings.sectionOrder ?? [];

  const validFromSettings = rawOrder.filter((id): id is LayoutSectionId =>
    (DEFAULT_SECTION_ORDER as string[]).includes(id)
  );

  const remaining = DEFAULT_SECTION_ORDER.filter(
    (id) => !validFromSettings.includes(id)
  );

  return [...validFromSettings, ...remaining];
};

export function isSectionVisible(sectionId: string, settings: CVSettings): boolean {
  if (!settings.hiddenSections) return true;
  return !settings.hiddenSections.includes(sectionId);
}

export function truncateBullets(html: string, maxBullets: number): string {
  // Split on <li> tags or bullet characters
  const parts = html.split(/(?=<li>|(?<=\s)[•·\-])/);
  if (parts.length <= maxBullets) return html;
  return parts.slice(0, maxBullets).join('');
}

export function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

