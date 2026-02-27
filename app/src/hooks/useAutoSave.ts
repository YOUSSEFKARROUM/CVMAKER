import { useEffect, useRef, useCallback, useState } from 'react';

interface AutoSaveOptions {
  key: string;
  interval?: number; // ms
  onSave?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

interface SaveVersion {
  id: string;
  timestamp: Date;
  data: unknown;
  changes: string;
}

export function useAutoSave<T>(data: T, options: AutoSaveOptions) {
  const { key, interval = 3000, onSave, onError } = options;
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [versions, setVersions] = useState<SaveVersion[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDataRef = useRef<T>(data);

  // Charger les versions depuis localStorage au montage
  useEffect(() => {
    const savedVersions = localStorage.getItem(`${key}_versions`);
    if (savedVersions) {
      try {
        const parsed = JSON.parse(savedVersions);
        setVersions(parsed.map((v: SaveVersion) => ({
          ...v,
          timestamp: new Date(v.timestamp),
        })));
      } catch {
        // Ignorer les erreurs de parsing
      }
    }

    const lastSavedTime = localStorage.getItem(`${key}_lastSaved`);
    if (lastSavedTime) {
      setLastSaved(new Date(lastSavedTime));
    }
  }, [key]);

  // Sauvegarder automatiquement quand les données changent
  useEffect(() => {
    // Ne pas sauvegarder si les données n'ont pas changé
    if (JSON.stringify(data) === JSON.stringify(lastDataRef.current)) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSaving(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        // Sauvegarder dans localStorage
        localStorage.setItem(key, JSON.stringify(data));
        const now = new Date();
        localStorage.setItem(`${key}_lastSaved`, now.toISOString());
        
        setLastSaved(now);
        setIsSaving(false);
        lastDataRef.current = data;

        // Créer une nouvelle version si changement significatif
        if (versions.length === 0 || 
            now.getTime() - versions[0].timestamp.getTime() > 60000) { // 1 minute
          const newVersion: SaveVersion = {
            id: crypto.randomUUID(),
            timestamp: now,
            data: JSON.parse(JSON.stringify(data)),
            changes: generateChangeSummary(data, lastDataRef.current),
          };
          
          const updatedVersions = [newVersion, ...versions].slice(0, 10); // Garder 10 versions max
          setVersions(updatedVersions);
          localStorage.setItem(`${key}_versions`, JSON.stringify(updatedVersions));
        }

        onSave?.(data);
      } catch (err) {
        setIsSaving(false);
        onError?.(err as Error);
      }
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, interval, onSave, onError, versions]);

  // Restaurer une version
  const restoreVersion = useCallback((version: SaveVersion): T => {
    return version.data as T;
  }, []);

  // Effacer toutes les versions
  const clearVersions = useCallback(() => {
    setVersions([]);
    localStorage.removeItem(`${key}_versions`);
  }, [key]);

  // Sauvegarde manuelle immédiate
  const saveNow = useCallback(async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(key, JSON.stringify(data));
      const now = new Date();
      localStorage.setItem(`${key}_lastSaved`, now.toISOString());
      setLastSaved(now);
      lastDataRef.current = data;
      onSave?.(data);
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsSaving(false);
    }
  }, [data, key, onSave, onError]);

  return {
    isSaving,
    lastSaved,
    versions,
    restoreVersion,
    clearVersions,
    saveNow,
  };
}

// Fonction utilitaire pour générer un résumé des changements
function generateChangeSummary<T>(current: T, previous: T): string {
  if (typeof current !== 'object' || current === null) {
    return 'Modification';
  }

  const changes: string[] = [];
  const currentObj = current as Record<string, unknown>;
  const previousObj = previous as Record<string, unknown>;

  for (const key of Object.keys(currentObj)) {
    if (JSON.stringify(currentObj[key]) !== JSON.stringify(previousObj?.[key])) {
      // Traduire les clés courantes
      const keyTranslations: Record<string, string> = {
        contact: 'Contact',
        experiences: 'Expériences',
        educations: 'Formation',
        skills: 'Compétences',
        languages: 'Langues',
        certifications: 'Certifications',
        projects: 'Projets',
        interests: 'Intérêts',
        profile: 'Profil',
      };
      changes.push(keyTranslations[key] || key);
    }
  }

  if (changes.length === 0) return 'Modification';
  if (changes.length === 1) return changes[0];
  if (changes.length <= 3) return changes.join(', ');
  return `${changes.slice(0, 3).join(', ')} +${changes.length - 3}`;
}
