// Single source of truth for all template metadata.
// Import from here in DownloadPage, LandingPage, CVPreview, and anywhere
// a template list is needed. Never declare local TEMPLATES arrays in components.

export type TemplateCategory = 'classic' | 'modern' | 'creative' | 'minimal';

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  isRecommended?: boolean;
  isNew?: boolean;
}

export const TEMPLATES: TemplateMeta[] = [
  { id: 'budapest',    name: 'Budapest',    description: 'Sidebar colorée à gauche',       category: 'modern',   isRecommended: true  },
  { id: 'chicago',     name: 'Chicago',     description: 'Header centré classique',         category: 'classic',  isRecommended: true  },
  { id: 'stanford',    name: 'Stanford',    description: 'Sidebar foncée élégante',         category: 'modern',   isNew: true          },
  { id: 'cambridge',   name: 'Cambridge',   description: 'Header bleu classique',           category: 'classic',  isNew: true          },
  { id: 'oxford',      name: 'Oxford',      description: 'Sidebar droite structurée',       category: 'classic',  isNew: true          },
  { id: 'otago',       name: 'Otago',       description: 'Minimaliste professionnel',        category: 'minimal',  isNew: true          },
  { id: 'berkeley',    name: 'Berkeley',    description: 'Design avec icônes',              category: 'modern',   isNew: true          },
  { id: 'harvard',     name: 'Harvard',     description: 'Sidebar bleue avec timeline',     category: 'modern',   isNew: true          },
  { id: 'auckland',    name: 'Auckland',    description: '2 colonnes équilibrées',           category: 'classic',  isNew: true          },
  { id: 'edinburgh',   name: 'Edinburgh',   description: 'Header violet moderne',           category: 'creative', isNew: true          },
  { id: 'princeton',   name: 'Princeton',   description: 'Classique centré',               category: 'classic',  isNew: true          },
  { id: 'brunei',      name: 'Brunei',      description: 'Minimaliste élégant',             category: 'minimal'                       },
  { id: 'vladivostok', name: 'Vladivostok', description: 'Moderne sidebar droite',          category: 'modern'                        },
  { id: 'sydney',      name: 'Sydney',      description: 'Épuré avec timeline',             category: 'minimal',  isNew: true          },
  { id: 'shanghai',    name: 'Shanghai',    description: 'Professionnel corporate',         category: 'classic'                       },
  { id: 'kiev',        name: 'Kiev',        description: 'Créatif avec grande photo',       category: 'creative'                      },
  { id: 'rotterdam',   name: 'Rotterdam',   description: 'Technique compétences visibles',  category: 'modern'                        },
  { id: 'tokyo',       name: 'Tokyo',       description: 'Compact 2 colonnes',              category: 'modern'                        },
  { id: 'modern',      name: 'Modern',      description: 'Design épuré par défaut',         category: 'minimal'                       },
];

export const TEMPLATE_IDS = TEMPLATES.map(t => t.id);
