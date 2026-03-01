import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import Keycloak from 'keycloak-js';
import { keycloakConfig, isKeycloakConfigured, isLocalModeEnabled } from './config';
import i18n from '../i18n';

export interface AuthError {
  code: string;
  message: string;
}

interface KeycloakContextType {
  keycloak: Keycloak | null;
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

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

// Storage local pour les CV quand Keycloak n'est pas configuré
const LOCAL_STORAGE_USER_KEY = 'cv-maker-user';

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<KeycloakContextType['user']>(null);
  const [error, setError] = useState<AuthError | null>(null);

  // Mode local sans Keycloak
  const [localMode, setLocalMode] = useState(false);

  useEffect(() => {
    // Vérifier si on a un utilisateur en localStorage (mode sans Keycloak)
    const localUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    }

    if (!isKeycloakConfigured() || isLocalModeEnabled()) {
      console.log('[Keycloak] Mode local activé (configuré:', isKeycloakConfigured(), ', local forcé:', isLocalModeEnabled(), ')');
      setLocalMode(true);
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    const initKeycloak = async () => {
      try {
        const kc = new Keycloak(keycloakConfig);
        
        kc.onTokenExpired = () => {
          kc.updateToken(30).catch(() => {
            console.error('[Keycloak] Failed to refresh token');
          });
        };

        // Initialisation Keycloak
        // On utilise une init simple sans check-sso pour éviter les erreurs 3rd party cookie/iframe
        let authenticated = false;
        try {
          // Essayer l'init standard sans vérification silencieuse
          authenticated = await kc.init({
            pkceMethod: 'S256',
            // Pas de onLoad: 'check-sso' pour éviter l'iframe timeout
          });
        } catch (initErr: any) {
          // Si ça échoue (ex: 3rd party check), on continue en mode non-authentifié
          console.warn('[Keycloak] Silent init failed, continuing without auth:', initErr.message);
          authenticated = false;
        }

        setKeycloak(kc);
        setIsAuthenticated(authenticated);
        
        if (authenticated && kc.tokenParsed) {
          setUser({
            id: kc.tokenParsed.sub || '',
            email: kc.tokenParsed.email || '',
            displayName: kc.tokenParsed.name || kc.tokenParsed.preferred_username || '',
            token: kc.token,
          });
        }

        setIsInitialized(true);
        console.log('[Keycloak] Initialized, authenticated:', authenticated);
      } catch (err: any) {
        console.error('[Keycloak] Initialization error:', err);
        setError({
          code: 'init-error',
          message: err.message || 'Erreur lors de l\'initialisation de Keycloak',
        });
        // Fallback en mode local
        setLocalMode(true);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = useCallback(async () => {
    if (localMode) {
      // Mode local - créer un utilisateur fictif
      const localUser = {
        id: 'local-user',
        email: 'local@example.com',
        displayName: 'Utilisateur Local',
      };
      setUser(localUser);
      setIsAuthenticated(true);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
      return;
    }

    if (keycloak) {
      try {
        await keycloak.login();
      } catch (err: any) {
        setError({
          code: 'login-error',
          message: err.message || 'Erreur lors de la connexion',
        });
      }
    }
  }, [keycloak, localMode]);

  // Login direct avec credentials (Direct Access Grants)
  // Nécessite VITE_KEYCLOAK_CLIENT_SECRET et Direct Access Grants activé dans Keycloak
  const loginWithCredentials = useCallback(async (email: string, password: string) => {
    if (localMode) {
      // Mode local
      const localUser = {
        id: 'local-user',
        email: email,
        displayName: email.split('@')[0],
      };
      setUser(localUser);
      setIsAuthenticated(true);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('client_id', keycloakConfig.clientId);
      params.append('username', email);
      params.append('password', password);
      if (keycloakConfig.clientSecret) {
        params.append('client_secret', keycloakConfig.clientSecret);
      }

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let description = errorData.error_description || 'Identifiants incorrects';

        // Cas particulier Keycloak : "Account is not fully set up"
        // On reste dans le modal et on affiche un message plus clair,
        // sans rediriger vers l'écran Keycloak externe.
        if (description.includes('Account is not fully set up')) {
          description = i18n.t('auth.accountNotFullySetUp', {
            defaultValue:
              "Votre compte existe mais n'est pas encore complètement configuré côté authentification. Contactez l'administrateur ou réessayez plus tard.",
          });
        }

        throw new Error(description);
      }

      const data = await response.json();
      
      // Décoder le token pour obtenir les infos utilisateur
      const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
      
      setUser({
        id: tokenPayload.sub,
        email: tokenPayload.email || email,
        displayName: tokenPayload.name || tokenPayload.preferred_username || email.split('@')[0],
        token: data.access_token,
      });
      setIsAuthenticated(true);
      
      // Stocker le token pour les requêtes futures
      localStorage.setItem('cv-maker-keycloak-token', data.access_token);
      localStorage.setItem('cv-maker-keycloak-refresh', data.refresh_token);
      
    } catch (err: any) {
      setError({
        code: 'login-error',
        message: err.message || 'Erreur lors de la connexion',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [localMode]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;

  // Register direct via backend proxy (qui appelle Keycloak Admin côté serveur)
  const registerWithCredentials = useCallback(async (email: string, password: string, displayName: string) => {
    if (localMode) {
      const localUser = {
        id: 'local-user',
        email: email,
        displayName: displayName,
      };
      setUser(localUser);
      setIsAuthenticated(true);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (!backendUrl) {
        throw new Error("Le backend d'authentification n'est pas configuré (VITE_BACKEND_URL manquant).");
      }

      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          displayName,
        }),
      });

      if (!response.ok) {
        const isServerError = response.status >= 500;
        const errorData = await response.json().catch(() => ({}));
        const message = isServerError
          ? i18n.t('auth.serviceUnavailable')
          : (errorData.message || 'Erreur lors de la création du compte');
        throw new Error(message);
      }

      // Connecter automatiquement
      await loginWithCredentials(email, password);
      
    } catch (err: any) {
      const isNetworkOrTimeout = err?.name === 'TypeError' || err?.message?.includes('fetch') || err?.message?.includes('network');
      const message = isNetworkOrTimeout
        ? i18n.t('auth.serviceUnavailable')
        : (err?.message || 'Erreur lors de l\'inscription');
      setError({
        code: 'register-error',
        message,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [localMode]);

  // Forgot password - API directe
  const forgotPasswordWithEmail = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!backendUrl) {
        // On ne révèle rien, mais on loggue côté client
        console.warn('[Keycloak] Backend non configuré pour forgot password (VITE_BACKEND_URL manquant)');
        return;
      }

      const response = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.status >= 500) {
        setError({
          code: 'forgot-error',
          message: i18n.t('auth.serviceUnavailable'),
        });
      }
    } catch (err: any) {
      setError({
        code: 'forgot-error',
        message: i18n.t('auth.serviceUnavailable'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  const logout = useCallback(async () => {
    if (localMode) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      return;
    }

    if (keycloak) {
      try {
        await keycloak.logout({ redirectUri: window.location.origin });
      } catch (err: any) {
        setError({
          code: 'logout-error',
          message: err.message || 'Erreur lors de la déconnexion',
        });
      }
    }
  }, [keycloak, localMode]);

  const register = useCallback(async () => {
    if (localMode) {
      // En mode local, login et register font la même chose
      await login();
      return;
    }

    if (keycloak) {
      try {
        await keycloak.register();
      } catch (err: any) {
        setError({
          code: 'register-error',
          message: err.message || 'Erreur lors de l\'inscription',
        });
      }
    }
  }, [keycloak, localMode, login]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: KeycloakContextType = {
    keycloak,
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
  };

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
}

export function useKeycloakAuth() {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error('useKeycloakAuth must be used within a KeycloakProvider');
  }
  return context;
}
