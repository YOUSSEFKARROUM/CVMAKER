import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../supabase/client';
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
  refreshCVs: (force?: boolean) => Promise<void>;
  shareCVLink: (cvId: string) => Promise<string>;
  isCloudEnabled: boolean;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const LS_KEY = 'cv-maker-cvs'; // pour la migration one-shot

function rowToSavedCV(r: Record<string, unknown>): SavedCV {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    name: r.name as string,
    cvData: r.cv_data as CVData,
    settings: r.settings as CVSettings,
    createdAt: new Date(r.created_at as string),
    updatedAt: new Date(r.updated_at as string),
  };
}

export function useCloudCV(): UseCloudCVReturn {
  const { user, isAuthenticated } = useAuth();
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<{ data: SavedCV[]; ts: number } | null>(null);
  const isRefreshing = useRef(false);

  const isCloudEnabled = true;

  const refreshCVs = useCallback(async (force = false) => {
    if (!isAuthenticated || !user?.uid) {
      setCvs([]);
      return;
    }
    if (isRefreshing.current) return;
    if (!force && cacheRef.current && Date.now() - cacheRef.current.ts < CACHE_TTL) {
      setCvs(cacheRef.current.data);
      return;
    }

    isRefreshing.current = true;
    setLoading(true);
    setError(null);
    try {
      const { data, error: supaErr } = await supabase
        .from('saved_cvs')
        .select('*')
        .eq('user_id', user.uid)
        .order('updated_at', { ascending: false });

      if (supaErr) throw supaErr;

      const loaded = (data ?? []).map(rowToSavedCV);
      setCvs(loaded);
      cacheRef.current = { data: loaded, ts: Date.now() };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des CV';
      console.error('useCloudCV refreshCVs:', err);
      setError(msg);
      // fallback lecture localStorage
      try {
        const stored = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
        const local: SavedCV[] = (stored[user.uid] || []).map((cv: SavedCV) => ({
          ...cv,
          createdAt: new Date(cv.createdAt),
          updatedAt: new Date(cv.updatedAt),
        }));
        setCvs(local);
      } catch {}
    } finally {
      setLoading(false);
      isRefreshing.current = false;
    }
  }, [isAuthenticated, user?.uid]);

  // Migration one-shot localStorage → Supabase
  const migrateLocalStorage = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const stored = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      const local: SavedCV[] = stored[user.uid];
      if (!local?.length) return;

      const { data: existing } = await supabase
        .from('saved_cvs')
        .select('id')
        .eq('user_id', user.uid)
        .limit(1);

      if (existing?.length) return; // déjà migré

      for (const cv of local) {
        await supabase.from('saved_cvs').insert({
          user_id: user.uid,
          name: cv.name || 'CV importé',
          cv_data: cv.cvData,
          settings: cv.settings,
        });
      }
      console.info(`[useCloudCV] Migrated ${local.length} CVs from localStorage to Supabase`);
      cacheRef.current = null;
      await refreshCVs(true);
    } catch (err) {
      console.warn('[useCloudCV] Migration failed (non-fatal):', err);
    }
  }, [user?.uid, refreshCVs]);

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      refreshCVs().then(() => migrateLocalStorage());
    } else {
      setCvs([]);
      cacheRef.current = null;
    }
  }, [isAuthenticated, user?.uid]);

  const saveToCloud = useCallback(async (
    name: string,
    cvData: CVData,
    settings: CVSettings,
    cvId?: string,
  ): Promise<string> => {
    if (!isAuthenticated || !user?.uid) throw new Error('Vous devez être connecté pour sauvegarder');

    setLoading(true);
    setError(null);
    try {
      if (cvId) {
        const { error: upErr } = await supabase
          .from('saved_cvs')
          .update({ name, cv_data: cvData, settings, updated_at: new Date().toISOString() })
          .eq('id', cvId)
          .eq('user_id', user.uid);
        if (upErr) throw upErr;
        cacheRef.current = null;
        await refreshCVs(true);
        return cvId;
      } else {
        const { data, error: insErr } = await supabase
          .from('saved_cvs')
          .insert({ user_id: user.uid, name, cv_data: cvData, settings })
          .select()
          .single();
        if (insErr) throw insErr;

        cacheRef.current = null;
        await refreshCVs(true);

        // Incrémenter compteur profil (non-bloquant)
        void (async () => {
          try {
            const { data: p } = await supabase
              .from('profiles')
              .select('total_cvs_created')
              .eq('id', user.uid)
              .single();
            await supabase.from('profiles').update({
              total_cvs_created: (p?.total_cvs_created ?? 0) + 1,
              updated_at: new Date().toISOString(),
            }).eq('id', user.uid);
          } catch (err) {
            console.warn('Counter update failed (non-fatal):', err);
          }
        })();

        return data.id as string;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.uid, refreshCVs]);

  const loadFromCloud = useCallback(async (cvId: string): Promise<SavedCV | null> => {
    const cached = cacheRef.current?.data.find((cv) => cv.id === cvId);
    if (cached) return cached;

    setLoading(true);
    setError(null);
    try {
      const { data, error: selErr } = await supabase
        .from('saved_cvs')
        .select('*')
        .eq('id', cvId)
        .eq('user_id', user?.uid)
        .single();
      if (selErr) throw selErr;
      return data ? rowToSavedCV(data) : null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement du CV';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const deleteFromCloud = useCallback(async (cvId: string): Promise<void> => {
    if (!user?.uid) return;
    setLoading(true);
    setError(null);
    try {
      const { error: delErr } = await supabase
        .from('saved_cvs')
        .delete()
        .eq('id', cvId)
        .eq('user_id', user.uid);
      if (delErr) throw delErr;

      setCvs((prev) => prev.filter((cv) => cv.id !== cvId));
      cacheRef.current = null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const shareCVLink = useCallback(async (cvId: string): Promise<string> => {
    const shareId = btoa(cvId).replace(/=/g, '');
    return `${window.location.origin}/share/${shareId}`;
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
