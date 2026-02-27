import { describe, it, expect } from 'vitest';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

describe('i18n translations', () => {
  it('should have French translations loaded', () => {
    expect(fr).toBeDefined();
    expect(fr.app.name).toBe('CV Maker');
    expect(fr.landing.title).toBeDefined();
  });

  it('should have English translations loaded', () => {
    expect(en).toBeDefined();
    expect(en.app.name).toBe('CV Maker');
    expect(en.landing.title).toBeDefined();
  });

  it('should have matching keys in both languages', () => {
    const getKeys = (obj: any, prefix = ''): string[] => {
      return Object.entries(obj).flatMap(([key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          return getKeys(value, newKey);
        }
        return newKey;
      });
    };

    const frKeys = getKeys(fr).sort();
    const enKeys = getKeys(en).sort();

    // Both should have the same structure
    expect(frKeys).toEqual(enKeys);
  });

  it('should have all required navigation keys', () => {
    const requiredNavKeys = ['home', 'next', 'previous', 'save', 'cancel', 'delete'];
    requiredNavKeys.forEach((key) => {
      expect(fr.nav[key as keyof typeof fr.nav]).toBeDefined();
      expect(en.nav[key as keyof typeof en.nav]).toBeDefined();
    });
  });

  it('should have all required step keys', () => {
    const requiredStepKeys = ['contact', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects', 'interests', 'profile', 'finish'];
    requiredStepKeys.forEach((key) => {
      expect(fr.steps[key as keyof typeof fr.steps]).toBeDefined();
      expect(en.steps[key as keyof typeof en.steps]).toBeDefined();
    });
  });
});
