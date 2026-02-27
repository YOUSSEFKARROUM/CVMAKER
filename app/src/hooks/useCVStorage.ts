import { useState, useEffect, useCallback, useRef } from 'react';
import { validateImportedData } from '../utils/validationSchemas';
import type { CVData, CVSettings, Step } from '../types/cv';

// Clés de stockage dynamiques basées sur l'ID utilisateur
const getStorageKeys = (userId?: string) => {
  const suffix = userId ? `-${userId}` : '';
  return {
    data: `cv-builder-data${suffix}`,
    settings: `cv-builder-settings${suffix}`,
    step: `cv-builder-step${suffix}`,
  };
};

interface StorageData {
  cvData: CVData;
  settings: CVSettings;
  currentStep: Step;
  timestamp: number;
}

// Debounce utility
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
}

export function useCVStorage(
  initialCVData: CVData,
  initialSettings: CVSettings,
  initialStep: Step,
  userId?: string
) {
  // Clés de stockage basées sur l'utilisateur
  const storageKeys = getStorageKeys(userId);

  // Fonction pour charger les données depuis localStorage
  const loadData = useCallback(() => {
    if (typeof window === 'undefined') {
      return { cvData: initialCVData, settings: initialSettings, currentStep: initialStep };
    }
    
    let cvData = initialCVData;
    let settings = initialSettings;
    let currentStep = initialStep;
    
    const savedCV = localStorage.getItem(storageKeys.data);
    if (savedCV) {
      try {
        const parsed = JSON.parse(savedCV);
        if (parsed && typeof parsed === 'object' && 'contact' in parsed) {
          cvData = parsed;
        }
      } catch { /* ignore */ }
    }
    
    const savedSettings = localStorage.getItem(storageKeys.settings);
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch { /* ignore */ }
    }
    
    const savedStep = localStorage.getItem(storageKeys.step);
    if (savedStep) {
      try {
        currentStep = JSON.parse(savedStep);
      } catch { /* ignore */ }
    }
    
    return { cvData, settings, currentStep };
  }, [storageKeys.data, storageKeys.settings, storageKeys.step, initialCVData, initialSettings, initialStep]);

  // État initial
  const initialData = loadData();
  const [cvData, setCVData] = useState<CVData>(initialData.cvData);
  const [settings, setSettings] = useState<CVSettings>(initialData.settings);
  const [currentStep, setCurrentStep] = useState<Step>(initialData.currentStep);

  // Recharger les données quand l'utilisateur change
  useEffect(() => {
    const data = loadData();
    setCVData(data.cvData);
    setSettings(data.settings);
    setCurrentStep(data.currentStep);
  }, [userId, loadData]);

  // Nettoyer les anciennes données globales (migration)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Supprimer les anciennes clés globales si elles existent
    // (données avant l'isolation par utilisateur)
    const oldKeys = ['cv-builder-data', 'cv-builder-settings', 'cv-builder-step'];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`[useCVStorage] Cleaned up old key: ${key}`);
      }
    });
  }, []);

  // Debounced save to localStorage pour éviter les écritures excessives
  const debouncedSaveCVData = useDebouncedCallback((data: CVData) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKeys.data, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to save CV data to localStorage:', e);
      }
    }
  }, 500);

  const debouncedSaveSettings = useDebouncedCallback((data: CVSettings) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKeys.settings, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to save settings to localStorage:', e);
      }
    }
  }, 500);

  // Save to localStorage avec debounce
  useEffect(() => {
    debouncedSaveCVData(cvData);
  }, [cvData, debouncedSaveCVData]);

  useEffect(() => {
    debouncedSaveSettings(settings);
  }, [settings, debouncedSaveSettings]);

  // Save step immediately (pas besoin de debounce pour l'étape)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKeys.step, JSON.stringify(currentStep));
    }
  }, [currentStep, storageKeys.step]);

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
          const parsed = JSON.parse(e.target?.result as string);
          
          // Validation avec Zod
          const validation = validateImportedData(parsed);
          if (!validation.valid) {
            reject(new Error(validation.error || 'Format de fichier invalide'));
            return;
          }
          
          const data = parsed as StorageData;
          setCVData(data.cvData);
          setSettings(data.settings);
          setCurrentStep(data.currentStep);
          resolve();
        } catch (error) {
          if (error instanceof Error) {
            reject(error);
          } else {
            reject(new Error('Invalid file format'));
          }
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
    localStorage.removeItem(storageKeys.data);
    localStorage.removeItem(storageKeys.settings);
    localStorage.removeItem(storageKeys.step);
  }, [initialCVData, initialSettings, storageKeys]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(storageKeys.data);
    localStorage.removeItem(storageKeys.settings);
    localStorage.removeItem(storageKeys.step);
  }, [storageKeys]);

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
