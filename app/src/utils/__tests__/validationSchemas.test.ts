import { describe, it, expect } from 'vitest';
import { validateImportedData, CVDataSchema } from '../validationSchemas';

describe('validationSchemas', () => {
  const validCVData = {
    contact: {
      firstName: 'Jean',
      lastName: 'Dupont',
      city: 'Paris',
      postalCode: '75001',
      phone: '+33 6 12 34 56 78',
      email: 'jean.dupont@email.com',
    },
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    profile: '',
    socialLinks: [],
    interests: [],
    references: [],
    internships: [],
    publications: [],
    extracurricular: [],
  };

  const validSettings = {
    template: 'budapest',
    primaryColor: '#1a1a1a',
    titleFont: 'Bebas Neue',
    bodyFont: 'Lato',
    language: 'fr',
    showSkillLevels: true,
    showSkillsAsTags: false,
  };

  const validStorageData = {
    cvData: validCVData,
    settings: validSettings,
    currentStep: 'contact',
    timestamp: Date.now(),
  };

  describe('validateImportedData', () => {
    it('should validate correct data', () => {
      const result = validateImportedData(validStorageData);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid data with missing fields', () => {
      const invalidData = {
        cvData: { contact: {} },
        settings: {},
      };
      const result = validateImportedData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject null data', () => {
      const result = validateImportedData(null);
      expect(result.valid).toBe(false);
    });

    it('should reject data with wrong email format', () => {
      const invalidData = {
        ...validStorageData,
        cvData: {
          ...validCVData,
          contact: {
            ...validCVData.contact,
            email: 'invalid-email',
          },
        },
      };
      const result = validateImportedData(invalidData);
      expect(result.valid).toBe(false);
    });
  });

  describe('CVDataSchema', () => {
    it('should validate complete CV data', () => {
      const result = CVDataSchema.safeParse(validCVData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required contact fields', () => {
      const invalidData = {
        ...validCVData,
        contact: {
          firstName: 'Jean',
          // missing lastName
        },
      };
      const result = CVDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
