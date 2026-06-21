import { z } from 'zod';

// Schémas pour les types de base
export const ContactInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  city: z.string(),
  postalCode: z.string(),
  phone: z.string(),
  email: z.string().email(),
  nationality: z.string().optional(),
  birthDate: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  jobTitle: z.string().optional(),
  visaStatus: z.string().optional(),
  maritalStatus: z.string().optional(),
  drivingLicense: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  github: z.string().optional(),
  photo: z.string().optional(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  employer: z.string(),
  city: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  currentlyWorking: z.boolean(),
  description: z.string(),
  hideMonths: z.boolean(),
  showDuration: z.boolean(),
});

export const EducationSchema = z.object({
  id: z.string(),
  school: z.string(),
  diploma: z.string(),
  city: z.string(),
  graduationDate: z.string(),
  description: z.string(),
  fieldOfStudy: z.string().optional(),
  gpa: z.string().optional(),
});

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'native']),
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  organization: z.string(),
  date: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  link: z.string().optional(),
  technologies: z.array(z.string()),
});

export const CVSettingsSchema = z.object({
  template: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string().optional(),
  titleFont: z.string(),
  bodyFont: z.string(),
  language: z.string(),
  showSkillLevels: z.boolean(),
  showSkillsAsTags: z.boolean(),
  sectionOrder: z.array(z.string()).optional(),
  hiddenSections: z.array(z.string()).optional(),
});

export const CVDataSchema = z.object({
  contact: ContactInfoSchema,
  experiences: z.array(ExperienceSchema),
  educations: z.array(EducationSchema),
  skills: z.array(SkillSchema),
  languages: z.array(LanguageSchema),
  certifications: z.array(CertificationSchema),
  projects: z.array(ProjectSchema),
  profile: z.string(),
  socialLinks: z.array(z.any()),
  interests: z.array(z.string()),
  references: z.array(z.any()),
  internships: z.array(z.any()),
  publications: z.array(z.string()),
  extracurricular: z.array(z.string()),
});

export const StorageDataSchema = z.object({
  cvData: CVDataSchema,
  settings: CVSettingsSchema,
  currentStep: z.string(),
  timestamp: z.number(),
});

// ─── Normalisation des données importées ──────────────────────────────────────
// Permet d'importer des CVs depuis d'autres outils ou des formats légèrement différents.

const SKILL_LEVEL_MAP: Record<string | number, 'beginner' | 'intermediate' | 'advanced' | 'expert'> = {
  1: 'beginner', 2: 'beginner',
  3: 'intermediate',
  4: 'advanced',
  5: 'expert',
  beginner: 'beginner', débutant: 'beginner', debutant: 'beginner',
  intermediate: 'intermediate', intermédiaire: 'intermediate', intermediaire: 'intermediate',
  advanced: 'advanced', avancé: 'advanced', avance: 'advanced',
  expert: 'expert',
};

const LANGUAGE_LEVEL_MAP: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native'> = {
  natif: 'native', native: 'native', 'langue maternelle': 'native',
  courant: 'expert', fluent: 'expert', bilingue: 'native', bilingual: 'native',
  avancé: 'advanced', avance: 'advanced', advanced: 'advanced',
  intermédiaire: 'intermediate', intermediaire: 'intermediate', intermediate: 'intermediate',
  technique: 'advanced',
  débutant: 'beginner', debutant: 'beginner', beginner: 'beginner', basic: 'beginner',
  expert: 'expert',
};

let _idCounter = 0;
function genId(): string {
  _idCounter++;
  return `imported-${Date.now()}-${_idCounter}`;
}

function safeId(id: unknown): string {
  if (typeof id === 'string' && id.trim()) return id;
  return genId();
}

function normalizeSkillLevel(level: unknown): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (typeof level === 'number') {
    return SKILL_LEVEL_MAP[level] ?? 'intermediate';
  }
  if (typeof level === 'string') {
    return SKILL_LEVEL_MAP[level.toLowerCase().trim()] ?? 'intermediate';
  }
  return 'intermediate';
}

function normalizeLanguageLevel(level: unknown): 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native' {
  if (typeof level === 'string') {
    return LANGUAGE_LEVEL_MAP[level.toLowerCase().trim()] ?? 'intermediate';
  }
  return 'intermediate';
}

function normalizeExperience(exp: unknown): unknown {
  if (!exp || typeof exp !== 'object') return exp;
  const e = exp as Record<string, unknown>;
  return {
    id: safeId(e.id),
    jobTitle: e.jobTitle ?? e.title ?? e.position ?? '',
    employer: e.employer ?? e.company ?? e.organization ?? '',
    city: e.city ?? e.location ?? '',
    startDate: e.startDate ?? '',
    endDate: e.endDate ?? '',
    currentlyWorking: Boolean(e.currentlyWorking ?? e.current ?? false),
    description: e.description ?? '',
    hideMonths: Boolean(e.hideMonths ?? false),
    showDuration: Boolean(e.showDuration ?? false),
  };
}

function normalizeEducation(edu: unknown): unknown {
  if (!edu || typeof edu !== 'object') return edu;
  const e = edu as Record<string, unknown>;
  // Support both `graduationDate` and `endDate`
  const graduationDate =
    (e.graduationDate as string | undefined) ??
    (e.endDate as string | undefined) ??
    (e.startDate as string | undefined) ??
    '';
  return {
    id: safeId(e.id),
    school: e.school ?? e.institution ?? '',
    diploma: e.diploma ?? e.degree ?? e.title ?? '',
    city: e.city ?? e.location ?? '',
    graduationDate,
    description: e.description ?? '',
    fieldOfStudy: e.fieldOfStudy ?? e.field ?? undefined,
    gpa: e.gpa ?? undefined,
  };
}

function normalizeSkill(skill: unknown): unknown {
  if (!skill || typeof skill !== 'object') return skill;
  const s = skill as Record<string, unknown>;
  return {
    id: safeId(s.id),
    name: s.name ?? '',
    level: normalizeSkillLevel(s.level),
  };
}

function normalizeLanguage(lang: unknown): unknown {
  if (!lang || typeof lang !== 'object') return lang;
  const l = lang as Record<string, unknown>;
  return {
    id: safeId(l.id),
    name: l.name ?? '',
    level: normalizeLanguageLevel(l.level),
  };
}

function normalizeCertification(cert: unknown): unknown {
  if (!cert || typeof cert !== 'object') return cert;
  const c = cert as Record<string, unknown>;
  return {
    id: safeId(c.id),
    name: c.name ?? '',
    organization: c.organization ?? c.issuer ?? '',
    date: c.date ?? c.issueDate ?? '',
    expiryDate: c.expiryDate ?? undefined,
    credentialId: c.credentialId ?? undefined,
  };
}

function normalizeProject(proj: unknown): unknown {
  if (!proj || typeof proj !== 'object') return proj;
  const p = proj as Record<string, unknown>;
  return {
    id: safeId(p.id),
    name: p.name ?? p.title ?? '',
    description: p.description ?? '',
    link: p.link ?? p.url ?? undefined,
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
  };
}

function normalizeExtracurricular(items: unknown[]): string[] {
  return items.map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      const parts = [obj.title, obj.description].filter(Boolean);
      return parts.join(' — ');
    }
    return String(item);
  });
}

export function normalizeForImport(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  const d = { ...(data as Record<string, unknown>) };

  if (!d.cvData || typeof d.cvData !== 'object') return d;
  const cvData = { ...(d.cvData as Record<string, unknown>) };

  if (Array.isArray(cvData.experiences)) {
    cvData.experiences = cvData.experiences.map(normalizeExperience);
  }
  if (Array.isArray(cvData.educations)) {
    cvData.educations = cvData.educations.map(normalizeEducation);
  }
  if (Array.isArray(cvData.skills)) {
    cvData.skills = cvData.skills.map(normalizeSkill);
  }
  if (Array.isArray(cvData.languages)) {
    cvData.languages = cvData.languages.map(normalizeLanguage);
  }
  if (Array.isArray(cvData.certifications)) {
    cvData.certifications = cvData.certifications.map(normalizeCertification);
  }
  if (Array.isArray(cvData.projects)) {
    cvData.projects = cvData.projects.map(normalizeProject);
  }
  if (Array.isArray(cvData.extracurricular)) {
    cvData.extracurricular = normalizeExtracurricular(cvData.extracurricular);
  }

  // Champs requis absents → valeurs par défaut
  if (!Array.isArray(cvData.socialLinks))    cvData.socialLinks    = [];
  if (!Array.isArray(cvData.interests))      cvData.interests      = [];
  if (!Array.isArray(cvData.references))     cvData.references     = [];
  if (!Array.isArray(cvData.internships))    cvData.internships    = [];
  if (!Array.isArray(cvData.publications))   cvData.publications   = [];
  if (!Array.isArray(cvData.extracurricular)) cvData.extracurricular = [];
  if (!Array.isArray(cvData.certifications)) cvData.certifications = [];
  if (!cvData.profile) cvData.profile = '';

  // Settings par défaut si absents
  const settings = (d.settings && typeof d.settings === 'object')
    ? d.settings as Record<string, unknown>
    : {};

  const normalizedSettings = {
    template:       settings.template       ?? 'budapest',
    primaryColor:   settings.primaryColor   ?? '#1a1a1a',
    titleFont:      settings.titleFont      ?? 'Bebas Neue',
    bodyFont:       settings.bodyFont       ?? 'Lato',
    language:       settings.language       ?? 'fr',
    showSkillLevels: settings.showSkillLevels !== undefined ? settings.showSkillLevels : true,
    showSkillsAsTags: settings.showSkillsAsTags !== undefined ? settings.showSkillsAsTags : false,
    ...settings,
  };

  return {
    ...d,
    cvData,
    settings: normalizedSettings,
    currentStep: d.currentStep ?? 'contact',
    timestamp: d.timestamp ?? Date.now(),
  };
}

// Fonction de validation
export function validateImportedData(data: unknown): { valid: boolean; error?: string } {
  try {
    StorageDataSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
      return { valid: false, error: `Format invalide: ${issues}` };
    }
    return { valid: false, error: 'Format de fichier inconnu' };
  }
}
