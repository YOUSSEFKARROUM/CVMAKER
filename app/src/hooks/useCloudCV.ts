import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import type { CVData, CVSettings } from '../types/cv';

export interface SavedCV {
  id: string;
  userId: string;
  name: string;
  cvData: CVData;
  settings: CVSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface UseCloudCVReturn {
  cvs: SavedCV[];
  loading: boolean;
  error: string | null;
  saveToCloud: (name: string, cvData: CVData, settings: CVSettings, cvId?: string) => Promise<string>;
  loadFromCloud: (cvId: string) => Promise<SavedCV | null>;
  deleteFromCloud: (cvId: string) => Promise<void>;
  refreshCVs: () => Promise<void>;
  shareCVLink: (cvId: string) => Promise<string>;
  isCloudEnabled: boolean;
}

// Clé pour le stockage local
const STORAGE_KEY = 'cv-maker-cvs';

// Cache pour éviter les requêtes excessives
const cache = new Map<string, { data: SavedCV[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Sauvegarder les CVs dans le localStorage
const saveToStorage = (userId: string, cvs: SavedCV[]) => {
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allData[userId] = cvs;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
};

// Charger les CVs depuis le localStorage
const loadFromStorage = (userId: string): SavedCV[] => {
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const userCVs = allData[userId] || [];
    // Reconvertir les dates string en objets Date
    return userCVs.map((cv: SavedCV) => ({
      ...cv,
      createdAt: new Date(cv.createdAt),
      updatedAt: new Date(cv.updatedAt),
    }));
  } catch (e) {
    console.error('Error loading from storage:', e);
    return [];
  }
};

export function useCloudCV(): UseCloudCVReturn {
  const { user, isAuthenticated } = useAuth();
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRefreshing = useRef(false);
  const lastRefresh = useRef<number>(0);

  // Le cloud est toujours "enabled" mais utilise le localStorage
  const isCloudEnabled = true;

  const refreshCVs = useCallback(async (force = false) => {
    if (!isAuthenticated || !user) {
      setCvs([]);
      setLoading(false);
      return;
    }

    // Éviter les refresh multiples simultanés
    if (isRefreshing.current) return;
    
    // Vérifier le cache
    const cacheKey = user.uid;
    const cached = cache.get(cacheKey);
    const now = Date.now();
    
    if (!force && cached && (now - cached.timestamp) < CACHE_DURATION) {
      setCvs(cached.data);
      setLoading(false);
      return;
    }

    // Éviter les refresh trop fréquents
    if (!force && now - lastRefresh.current < 2000) return;

    isRefreshing.current = true;
    setLoading(true);
    setError(null);
    
    try {
      // Charger depuis le localStorage au lieu de Firestore
      const userCVs = loadFromStorage(user.uid);
      setCvs(userCVs);
      cache.set(cacheKey, { data: userCVs, timestamp: now });
      lastRefresh.current = now;
    } catch (err: any) {
      console.error('Error refreshing CVs:', err);
      setError(err.message || 'Erreur lors du chargement des CV');
    } finally {
      setLoading(false);
      isRefreshing.current = false;
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshCVs();
  }, [refreshCVs]);

  const saveToCloud = useCallback(async (
    name: string,
    cvData: CVData,
    settings: CVSettings,
    cvId?: string
  ): Promise<string> => {
    if (!isAuthenticated || !user) {
      throw new Error('Vous devez être connecté pour sauvegarder');
    }

    setLoading(true);
    setError(null);

    try {
      const id = cvId || crypto.randomUUID();
      const now = new Date();
      
      const existingCVs = loadFromStorage(user.uid);
      const existingIndex = existingCVs.findIndex(cv => cv.id === id);
      
      const newCV: SavedCV = {
        id,
        userId: user.uid,
        name,
        cvData,
        settings,
        createdAt: existingIndex >= 0 ? existingCVs[existingIndex].createdAt : now,
        updatedAt: now,
      };

      if (existingIndex >= 0) {
        existingCVs[existingIndex] = newCV;
      } else {
        existingCVs.push(newCV);
      }

      // Sauvegarder dans le localStorage
      saveToStorage(user.uid, existingCVs);
      
      // Invalider le cache
      cache.delete(user.uid);
      await refreshCVs(true);
      return id;
    } catch (err: any) {
      console.error('Error saving CV:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, refreshCVs]);

  const loadFromCloud = useCallback(async (cvId: string): Promise<SavedCV | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) return null;
      const userCVs = loadFromStorage(user.uid);
      const cv = userCVs.find(c => c.id === cvId);
      return cv || null;
    } catch (err: any) {
      console.error('Error loading CV:', err);
      setError(err.message || 'Erreur lors du chargement du CV');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteFromCloud = useCallback(async (cvId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (!user) return;
      const userCVs = loadFromStorage(user.uid);
      const filtered = userCVs.filter(cv => cv.id !== cvId);
      saveToStorage(user.uid, filtered);
      
      // Invalider le cache
      cache.delete(user.uid);
      await refreshCVs(true);
    } catch (err: any) {
      console.error('Error deleting CV:', err);
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCVs, user]);

  const shareCVLink = useCallback(async (cvId: string): Promise<string> => {
    try {
      // En mode local, on crée juste un lien avec l'ID
      // Note: En production avec Keycloak, vous pourriez vouloir une vraie logique de partage
      const shareId = btoa(cvId).replace(/=/g, '');
      return `${window.location.origin}/share/${shareId}`;
    } catch (err: any) {
      console.error('Error sharing CV:', err);
      setError(err.message || 'Erreur lors du partage');
      throw err;
    }
  }, []);

  return {
    cvs,
    loading,
    error,
    saveToCloud,
    loadFromCloud,
    deleteFromCloud,
    refreshCVs,
    shareCVLink,
    isCloudEnabled,
  };
}
