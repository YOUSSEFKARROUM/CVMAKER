// AI-powered content suggestions (Mock implementation)
// In production, replace these with actual API calls to an AI service

export interface AISuggestion {
  text: string;
  confidence: number;
}

// Common job titles for autocomplete
export const commonJobTitles = [
  'Développeur Web',
  'Développeur Full Stack',
  'Développeur Frontend',
  'Développeur Backend',
  'Ingénieur Logiciel',
  'Chef de Projet',
  'Product Manager',
  'Designer UX/UI',
  'Analyste Données',
  'Consultant',
  'Responsable Marketing',
  'Commercial',
  'Assistant Administratif',
  'Comptable',
  'Ressources Humaines',
  'Directeur Général',
  'Responsable IT',
  'Technicien Support',
  'Architecte Logiciel',
  'DevOps Engineer',
];

// Common skills for autocomplete
export const commonSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'PHP',
  'HTML/CSS',
  'SQL',
  'MongoDB',
  'Git',
  'Docker',
  'AWS',
  'Azure',
  'Linux',
  'Agile/Scrum',
  'Gestion de Projet',
  'Communication',
  'Leadership',
  'Résolution de Problèmes',
  'Travail en Équipe',
  'Anglais',
  'Français',
  'Espagnol',
  'Allemand',
];

// Common schools for autocomplete
export const commonSchools = [
  'Université Hassan II',
  'Université Mohammed V',
  'Université Cadi Ayyad',
  'Université Ibn Tofail',
  'INSEA',
  'EMI',
  'HEC Paris',
  'ESSEC',
  'Sorbonne Université',
  'Université Paris-Saclay',
  'Polytechnique',
  'CentraleSupélec',
  'Mines Paris',
  'EPFL',
  'ETH Zurich',
  'MIT',
  'Stanford',
  'Harvard',
];

// Profile description templates
const profileTemplates: Record<string, string[]> = {
  developer: [
    'Développeur passionné avec plus de {years} ans d\'expérience dans le développement {type}. Spécialisé en {technologies}, j\'ai contribué à la création d\'applications robustes et évolutives. Rigoureux et créatif, je recherche de nouveaux défis pour mettre mes compétences au service de projets innovants.',
    'Ingénieur logiciel avec une solide expérience en {technologies}. Capable de mener des projets de A à Z, de la conception au déploiement. Passionné par les bonnes pratiques de développement et l\'amélioration continue.',
  ],
  manager: [
    'Chef de projet expérimenté avec {years} ans de gestion d\'équipes multidisciplinaires. Expert en méthodologies Agile et en gestion de stakeholders. J\'ai piloté avec succès des projets d\'envergure avec des budgets importants.',
    'Manager opérationnel avec un fort sens de l\'organisation et du leadership. J\'ai démontré ma capacité à motiver les équipes et à atteindre les objectifs fixés dans des délais contraints.',
  ],
  designer: [
    'Designer UX/UI créatif avec une approche centrée sur l\'utilisateur. J\'ai conçu des interfaces intuitives pour divers produits digitaux, en veillant à l\'équilibre entre esthétique et fonctionnalité.',
    'Designer passionné par l\'innovation et l\'expérience utilisateur. Ma méthodologie combine recherche utilisateur, prototypage rapide et itérations basées sur les feedbacks.',
  ],
  marketing: [
    'Responsable marketing digital avec une expertise en acquisition et rétention clients. J\'ai développé et exécuté des stratégies multicanales générant une croissance significative.',
    'Expert en marketing opérationnel avec une approche data-driven. J\'optimise les campagnes grâce à l\'analyse des KPIs et aux tests A/B pour maximiser le ROI.',
  ],
  default: [
    'Professionnel dynamique avec {years} ans d\'expérience dans le secteur {sector}. Reconnu pour ma rigueur, mon sens de l\'organisation et ma capacité à mener à bien les projets qui me sont confiés.',
    'Profil polyvalent avec une expérience diversifiée. J\'apporte une approche proactive et une volonté constante d\'apprendre et de progresser dans mon domaine d\'expertise.',
  ],
};

// Experience description templates
const experienceTemplates: Record<string, string[]> = {
  developer: [
    'Développement et maintenance d\'applications {type} utilisées par {users} utilisateurs',
    'Conception et implémentation de nouvelles fonctionnalités selon les spécifications métier',
    'Optimisation des performances et refactorisation du code legacy',
    'Collaboration étroite avec les équipes produit et design',
    'Mise en place de tests automatisés et revue de code',
    'Participation aux cérémonies Agile (daily, sprint planning, rétrospectives)',
  ],
  manager: [
    'Gestion d\'une équipe de {teamSize} personnes avec suivi des objectifs individuels',
    'Pilotage de projets avec des budgets allant jusqu\'à {budget}',
    'Coordination des différents stakeholders et gestion des attentes',
    'Mise en place et amélioration des processus internes',
    'Reporting régulier auprès de la direction sur l\'avancement des projets',
  ],
  default: [
    'Gestion des tâches quotidiennes et respect des délais',
    'Collaboration avec les équipes internes et externes',
    'Participation à l\'amélioration continue des processus',
    'Formation et accompagnement des nouveaux collaborateurs',
    'Reporting et suivi des indicateurs de performance',
  ],
};

export function generateProfileSuggestion(
  jobTitle: string,
  years: number = 3,
  technologies: string[] = []
): string {
  const category = getCategoryFromJobTitle(jobTitle);
  const templates = profileTemplates[category] || profileTemplates.default;
  const template = templates[Math.floor(Math.random() * templates.length)];

  return template
    .replace('{years}', years.toString())
    .replace('{type}', getJobType(jobTitle))
    .replace('{technologies}', technologies.slice(0, 3).join(', '))
    .replace('{sector}', getSector(jobTitle));
}

export function generateExperienceSuggestions(
  jobTitle: string,
  teamSize?: number,
  budget?: string
): string[] {
  const category = getCategoryFromJobTitle(jobTitle);
  const templates = experienceTemplates[category] || experienceTemplates.default;

  return templates.slice(0, 4).map(template =>
    template
      .replace('{type}', getJobType(jobTitle))
      .replace('{users}', '10 000+')
      .replace('{teamSize}', (teamSize || 5).toString())
      .replace('{budget}', budget || '500K€')
  );
}

export function improveDescription(description: string): string {
  // Simple improvements (in production, use actual AI)
  let improved = description;

  // Add action verbs if missing
  const actionVerbs = ['Développé', 'Conçu', 'Géré', 'Piloté', 'Optimisé', 'Créé'];
  const hasActionVerb = actionVerbs.some(verb => 
    improved.toLowerCase().includes(verb.toLowerCase())
  );

  if (!hasActionVerb && improved.length > 0) {
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
  }

  // Ensure proper punctuation
  if (improved.length > 0 && !improved.endsWith('.') && !improved.endsWith('!') && !improved.endsWith('?')) {
    improved += '.';
  }

  return improved;
}

export function getJobSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return commonJobTitles
    .filter(title => title.toLowerCase().includes(lowerQuery))
    .slice(0, 5);
}

export function getSkillSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return commonSkills
    .filter(skill => skill.toLowerCase().includes(lowerQuery))
    .slice(0, 5);
}

export function getSchoolSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return commonSchools
    .filter(school => school.toLowerCase().includes(lowerQuery))
    .slice(0, 5);
}

// Helper functions
function getCategoryFromJobTitle(jobTitle: string): string {
  const lower = jobTitle.toLowerCase();
  if (lower.includes('développeur') || lower.includes('developer') || lower.includes('ingénieur')) {
    return 'developer';
  }
  if (lower.includes('chef') || lower.includes('manager') || lower.includes('directeur')) {
    return 'manager';
  }
  if (lower.includes('designer') || lower.includes('design') || lower.includes('ux') || lower.includes('ui')) {
    return 'designer';
  }
  if (lower.includes('marketing') || lower.includes('commercial')) {
    return 'marketing';
  }
  return 'default';
}

function getJobType(jobTitle: string): string {
  const lower = jobTitle.toLowerCase();
  if (lower.includes('web')) return 'web';
  if (lower.includes('mobile')) return 'mobile';
  if (lower.includes('full stack') || lower.includes('fullstack')) return 'full stack';
  if (lower.includes('frontend') || lower.includes('front-end')) return 'frontend';
  if (lower.includes('backend') || lower.includes('back-end')) return 'backend';
  return 'logiciel';
}

function getSector(jobTitle: string): string {
  const lower = jobTitle.toLowerCase();
  if (lower.includes('tech') || lower.includes('it') || lower.includes('informatique')) {
    return 'technologique';
  }
  if (lower.includes('finance') || lower.includes('banque')) {
    return 'financier';
  }
  if (lower.includes('santé') || lower.includes('médical')) {
    return 'de la santé';
  }
  return 'industriel';
}
