// Hook useAuth compatible avec l'ancienne API Firebase
// Maintenant utilisant Keycloak en arrière-plan

import { useCallback } from 'react';
import { useKeycloakAuth } from '../keycloak/KeycloakProvider';
import type { AuthError } from '../keycloak/KeycloakProvider';

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
  const keycloakAuth = useKeycloakAuth();

  // Adapter l'API Keycloak à l'ancienne API Firebase
  const login = useCallback(
    async (email?: string, password?: string) => {
      // Si email et password sont fournis, utiliser le login direct (sans redirection)
      if (email && password) {
        await keycloakAuth.loginWithCredentials(email, password);
      } else {
        // Sinon, redirection vers Keycloak
        await keycloakAuth.login();
      }
    },
    [keycloakAuth]
  );

  const register = useCallback(
    async (email?: string, password?: string, displayName?: string) => {
      // Si tous les champs sont fournis, essayer l'inscription directe
      if (email && password && displayName) {
        await keycloakAuth.registerWithCredentials(email, password, displayName);
      } else {
        // Sinon, redirection vers Keycloak
        await keycloakAuth.register();
      }
    },
    [keycloakAuth]
  );

  const logout = useCallback(async () => {
    await keycloakAuth.logout();
  }, [keycloakAuth]);

  const forgotPassword = useCallback(
    async (email?: string) => {
      // Utiliser l'API directe si email fourni
      if (email) {
        await keycloakAuth.forgotPasswordWithEmail(email);
      } else if (keycloakAuth.keycloak) {
        // Sinon redirection Keycloak
        keycloakAuth.keycloak.login({ action: 'forgot_password' });
      }
    },
    [keycloakAuth]
  );

  return {
    user: keycloakAuth.user
      ? {
          uid: keycloakAuth.user.id,
          email: keycloakAuth.user.email,
          displayName: keycloakAuth.user.displayName,
        }
      : null,
    loading: keycloakAuth.isLoading,
    isAuthenticated: keycloakAuth.isAuthenticated,
    isAuthAvailable: keycloakAuth.isInitialized,
    login,
    register,
    logout,
    forgotPassword,
    error: keycloakAuth.error,
    clearError: keycloakAuth.clearError,
    authLoading: keycloakAuth.isLoading,
  };
}

// Hook pour vérifier si on est en mode local (sans Keycloak)
export function useIsLocalMode(): boolean {
  const keycloakAuth = useKeycloakAuth();
  return !keycloakAuth.keycloak && keycloakAuth.isInitialized;
}
