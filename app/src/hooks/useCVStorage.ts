import { useState, useEffect, useCallback } from 'react';
import type { CVData, CVSettings, Step } from '../types/cv';

const STORAGE_KEY = 'cv-builder-data';
const SETTINGS_KEY = 'cv-builder-settings';
const STEP_KEY = 'cv-builder-step';

interface StorageData {
  cvData: CVData;
  settings: CVSettings;
  currentStep: Step;
  timestamp: number;
}

export function useCVStorage(
  initialCVData: CVData,
  initialSettings: CVSettings,
  initialStep: Step
) {
  const [cvData, setCVData] = useState<CVData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialCVData;
        }
      }
    }
    return initialCVData;
  });

  const [settings, setSettings] = useState<CVSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialSettings;
        }
      }
    }
    return initialSettings;
  });

  const [currentStep, setCurrentStep] = useState<Step>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STEP_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialStep;
        }
      }
    }
    return initialStep;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, JSON.stringify(currentStep));
  }, [currentStep]);

  const exportData = useCallback(() => {
    const data: StorageData = {
      cvData,
      settings,
      currentStep,
      timestamp: Date.now(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [cvData, settings, currentStep]);

  const importData = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data: StorageData = JSON.parse(e.target?.result as string);
          setCVData(data.cvData);
          setSettings(data.settings);
          setCurrentStep(data.currentStep);
          resolve();
        } catch (error) {
          reject(new Error('Invalid file format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const resetData = useCallback(() => {
    setCVData(initialCVData);
    setSettings(initialSettings);
    setCurrentStep('landing');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(STEP_KEY);
  }, [initialCVData, initialSettings]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(STEP_KEY);
  }, []);

  return {
    cvData,
    setCVData,
    settings,
    setSettings,
    currentStep,
    setCurrentStep,
    exportData,
    importData,
    resetData,
    clearStorage,
  };
}
