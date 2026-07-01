import { useCallback, useState } from 'react';
import { useAuth } from './useAuth';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000')
  .replace(/\/+$/, '');

export type AIAction =
  | 'generate-profile'
  | 'improve-experience'
  | 'optimize-ats'
  | 'suggest-skills'
  | 'translate-cv'
  | 'generate-cover-letter'
  | 'improve-languages'
  | 'polish-all';

interface UseAIReturn {
  generate: (action: AIAction, data: Record<string, unknown>) => Promise<unknown>;
  loading: boolean;
  error: string | null;
}

export function useAI(): UseAIReturn {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (action: AIAction, data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.uid ? { 'X-User-Id': user.uid } : {}),
        },
        body: JSON.stringify({
          action,
          data,
          language: data.language || 'fr',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(err.error || `Erreur ${res.status}`);
      }

      const { result } = await res.json();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la generation IA';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  return { generate, loading, error };
}
