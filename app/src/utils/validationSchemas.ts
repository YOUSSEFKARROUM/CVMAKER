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
  id: z.string().uuid(),
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
  id: z.string().uuid(),
  school: z.string(),
  diploma: z.string(),
  city: z.string(),
  graduationDate: z.string(),
  description: z.string(),
  fieldOfStudy: z.string().optional(),
  gpa: z.string().optional(),
});

export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

export const LanguageSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'native']),
});

export const CertificationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  organization: z.string(),
  date: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
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
