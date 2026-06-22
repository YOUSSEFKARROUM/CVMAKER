import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './client';

export interface AuthError {
  code: string;
  message: string;
}

interface SupabaseContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: {
    id: string;
    email: string;
    displayName: string;
    token?: string;
  } | null;
  login: () => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: () => Promise<void>;
  registerWithCredentials: (email: string, password: string, displayName: string) => Promise<void>;
  forgotPasswordWithEmail: (email: string) => Promise<void>;
  error: AuthError | null;
  clearError: () => void;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

function sessionToUser(session: Session | null) {
  if (!session) return null;
  const u = session.user;
  return {
    id: u.id,
    email: u.email ?? '',
    displayName: (u.user_metadata?.display_name as string) || u.email?.split('@')[0] || '',
    token: session.access_token,
  };
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<SupabaseContextType['user']>(null);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(sessionToUser(session));
      setIsAuthenticated(!!session);
      setIsLoading(false);
      setIsInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(sessionToUser(session));
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async () => {
    // With Supabase, login is handled via loginWithCredentials in the modal
  }, []);

  const loginWithCredentials = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_banned, ban_reason')
          .eq('id', data.user.id)
          .single();

        if (profile?.is_banned) {
          await supabase.auth.signOut();
          const reason = profile.ban_reason ? ` : ${profile.ban_reason}` : '';
          throw new Error(`Compte suspendu${reason}`);
        }

        await supabase
          .from('profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', data.user.id);
      }
    } catch (err: any) {
      let message: string = err.message || 'Identifiants incorrects';
      if (message.includes('Invalid login credentials')) message = 'Email ou mot de passe incorrect';
      if (message.includes('Email not confirmed')) message = 'Veuillez confirmer votre email avant de vous connecter';
      setError({ code: 'login-error', message });
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async () => {
    // With Supabase, register is handled via registerWithCredentials in the modal
  }, []);

  const registerWithCredentials = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (authError) throw authError;

      // If no session after signUp, email confirmation is required
      if (!data.session) {
        setError({
          code: 'email-confirmation',
          message: `Un email de confirmation a été envoyé à ${email}. Vérifiez votre boîte mail puis connectez-vous.`,
        });
      }
    } catch (err: any) {
      let message: string = err.message || 'Erreur lors de la création du compte';
      if (message.includes('already registered') || message.includes('User already registered')) {
        message = 'Un compte avec cet email existe déjà';
      }
      if (message.includes('Password should be at least')) {
        message = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      setError({ code: 'register-error', message });
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPasswordWithEmail = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (authError) throw authError;
    } catch {
      setError({ code: 'forgot-error', message: "Erreur lors de l'envoi de l'email de réinitialisation" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      setError({ code: 'logout-error', message: err.message || 'Erreur lors de la déconnexion' });
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <SupabaseContext.Provider value={{
      isAuthenticated,
      isLoading,
      isInitialized,
      user,
      login,
      loginWithCredentials,
      logout,
      register,
      registerWithCredentials,
      forgotPasswordWithEmail,
      error,
      clearError,
    }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseProvider');
  }
  return context;
}
