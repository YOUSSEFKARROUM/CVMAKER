export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native';

export interface ContactInfo {
  firstName: string;
  lastName: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  nationality?: string;
  birthDate?: string;
  country?: string;
  address?: string;
  jobTitle?: string;
  photo?: string;
  visaStatus?: string;
  maritalStatus?: string;
  drivingLicense?: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  hideMonths: boolean;
  showDuration: boolean;
}

export interface Education {
  id: string;
  school: string;
  diploma: string;
  city: string;
  graduationDate: string;
  description: string;
  fieldOfStudy?: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: Exclude<ProficiencyLevel, 'native'>;
}

export interface Language {
  id: string;
  name: string;
  level: ProficiencyLevel;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  technologies: string[];
}

export interface SocialLink {
  id: string;
  platform: 'linkedin' | 'github' | 'portfolio' | 'twitter' | 'other';
  url: string;
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  position: string;
  email?: string;
  phone?: string;
}

export interface CVData {
  contact: ContactInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  profile: string;
  socialLinks: SocialLink[];
  interests: string[];
  references: Reference[];
  internships: Experience[];
  publications: string[];
  extracurricular: string[];
}

export interface CVTemplate {
  id: string;
  name: string;
  thumbnail: string;
  isNew?: boolean;
  isRecommended?: boolean;
  description?: string;
}

export interface CVSettings {
  template: string;
  primaryColor: string;
  secondaryColor?: string;
  titleFont: string;
  bodyFont: string;
  language: string;
  showSkillLevels: boolean;
  showSkillsAsTags: boolean;
  sectionOrder?: string[];
  hiddenSections?: string[];
}

export type Step = 'landing' | 'contact' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'projects' | 'interests' | 'profile' | 'finish' | 'download';

export interface CVStats {
  completeness: number;
  sectionsCompleted: number;
  totalSections: number;
  suggestions: string[];
}
