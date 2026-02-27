// Keycloak Configuration
// Remplacez ces valeurs par vos informations Keycloak

// VITE_LOCAL_MODE=true force le mode local sans Keycloak
const forceLocalMode = import.meta.env.VITE_LOCAL_MODE === 'true';

// Configuration pour keycloak-js v26+
export const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'cv-maker',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'cv-maker-client',
  // Client secret - requis uniquement pour Direct Access Grants (login direct)
  // Laissez vide ou commenté si vous utilisez le flow Standard (redirection)
  clientSecret: import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET || '',
  // Client admin - requis pour l'inscription directe (register)
  // Créez un client 'cv-maker-admin' avec les droits 'manage-users'
  adminClientId: import.meta.env.VITE_KEYCLOAK_ADMIN_CLIENT_ID || 'cv-maker-admin',
  adminClientSecret: import.meta.env.VITE_KEYCLOAK_ADMIN_CLIENT_SECRET || '',
};

// Vérifier si la configuration est valide
export const isKeycloakConfigured = (): boolean => {
  if (forceLocalMode) {
    console.log('[Keycloak] Mode local forcé par VITE_LOCAL_MODE=true');
    return false;
  }
  return !!(
    keycloakConfig.url &&
    keycloakConfig.realm &&
    keycloakConfig.clientId
  );
};

// Vérifier si on est en mode local
export const isLocalModeEnabled = (): boolean => {
  return forceLocalMode || !isKeycloakConfigured();
};

console.log('[Keycloak] Configuration:', {
  url: keycloakConfig.url,
  realm: keycloakConfig.realm,
  clientId: keycloakConfig.clientId,
  localMode: forceLocalMode,
  configured: isKeycloakConfigured(),
});
