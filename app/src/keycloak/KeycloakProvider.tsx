import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import Keycloak from 'keycloak-js';
import { keycloakConfig, isKeycloakConfigured, isLocalModeEnabled } from './config';

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
        throw new Error(errorData.error_description || 'Identifiants incorrects');
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

  // Register direct via API Keycloak Admin
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

      // Obtenir token admin
      const adminToken = await getAdminToken();
      
      // Créer l'utilisateur
      const createUserUrl = `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users`;
      
      const response = await fetch(createUserUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          username: email,
          email: email,
          firstName: displayName.split(' ')[0],
          lastName: displayName.split(' ').slice(1).join(' ') || '',
          enabled: true,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: false,
            },
          ],
        }),
      });

      if (!response.ok && response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errorMessage || 'Erreur lors de la création du compte');
      }

      // Connecter automatiquement
      await loginWithCredentials(email, password);
      
    } catch (err: any) {
      setError({
        code: 'register-error',
        message: err.message || 'Erreur lors de l\'inscription',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [localMode]);

  // Fonction utilitaire pour obtenir token admin via JSONP ou proxy
  const getAdminToken = async (): Promise<string> => {
    try {
      // Essayer d'abord avec no-cors (peut ne pas fonctionner pour la réponse)
      const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', keycloakConfig.adminClientId);
      params.append('client_secret', keycloakConfig.adminClientSecret);

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
        // Mode cors explicite
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Token request failed');
      }

      const data = await response.json();
      return data.access_token;
    } catch (err) {
      console.error('CORS error - veuillez configurer Web Origins dans Keycloak:', err);
      throw new Error('Erreur CORS. Ajoutez http://localhost:5173 dans Web Origins du client cv-maker-admin dans Keycloak');
    }
  };

  // Forgot password - API directe
  const forgotPasswordWithEmail = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtenir token admin
      const adminToken = await getAdminToken();
      
      // Chercher l'utilisateur par email
      const searchUrl = `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users?email=${encodeURIComponent(email)}`;
      
      const searchResponse = await fetch(searchUrl, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      
      const users = await searchResponse.json();
      
        if (users.length === 0) {
        // Ne pas révéler si l'email existe ou pas (sécurité)
        console.log('Email de réinitialisation envoyé si le compte existe');
        return;
      }
      
      const userId = users[0].id;
      
      // Envoyer email de réinitialisation
      const resetUrl = `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users/${userId}/execute-actions-email`;
      
      await fetch(resetUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(['UPDATE_PASSWORD']),
      });
      
    } catch (err: any) {
      // Ne pas exposer d'erreur (sécurité)
      console.log('Email de réinitialisation envoyé si le compte existe');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
