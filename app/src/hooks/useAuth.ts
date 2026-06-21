import { useCallback } from 'react';
import { useSupabaseAuth } from '../supabase/SupabaseProvider';
import type { AuthError } from '../supabase/SupabaseProvider';

interface AuthContextType {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAuthAvailable: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  register: (email?: string, password?: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email?: string) => Promise<void>;
  error: AuthError | null;
  clearError: () => void;
  authLoading: boolean;
}

export function useAuth(): AuthContextType {
  const auth = useSupabaseAuth();

  const login = useCallback(
    async (email?: string, password?: string) => {
      if (email && password) {
        await auth.loginWithCredentials(email, password);
      } else {
        await auth.login();
      }
    },
    [auth]
  );

  const register = useCallback(
    async (email?: string, password?: string, displayName?: string) => {
      if (email && password && displayName) {
        await auth.registerWithCredentials(email, password, displayName);
      } else {
        await auth.register();
      }
    },
    [auth]
  );

  const logout = useCallback(async () => {
    await auth.logout();
  }, [auth]);

  const forgotPassword = useCallback(
    async (email?: string) => {
      if (email) {
        await auth.forgotPasswordWithEmail(email);
      }
    },
    [auth]
  );

  return {
    user: auth.user
      ? {
          uid: auth.user.id,
          email: auth.user.email,
          displayName: auth.user.displayName,
        }
      : null,
    loading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    isAuthAvailable: auth.isInitialized,
    login,
    register,
    logout,
    forgotPassword,
    error: auth.error,
    clearError: auth.clearError,
    authLoading: auth.isLoading,
  };
}

export function useIsLocalMode(): boolean {
  return false;
}
