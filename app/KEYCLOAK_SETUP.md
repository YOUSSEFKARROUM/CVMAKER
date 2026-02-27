# Configuration Keycloak

Ce guide explique comment configurer Keycloak pour remplacer Firebase Authentication.

## Prérequis

1. Un serveur Keycloak installé et accessible
2. Docker (optionnel, pour une installation locale rapide)

## Installation locale avec Docker

```bash
# Démarrer Keycloak
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

Accédez à la console d'administration : http://localhost:8080/admin
- Username: `admin`
- Password: `admin`

## Configuration

### 1. Créer un Realm

1. Connectez-vous à la console Keycloak
2. Cliquez sur le menu déroulant "master" (en haut à gauche)
3. Cliquez sur "Create Realm"
4. Nom : `cv-maker`
5. Cliquez sur "Create"

### 2. Créer un Client

1. Dans le realm `cv-maker`, allez dans "Clients"
2. Cliquez sur "Create client"
3. Client ID : `cv-maker-client`
4. Cliquez sur "Next"
5. Activez "Client authentication" (ON)
6. Authentication flow : cochez "Standard flow" et "Direct access grants"
7. Cliquez sur "Next"
8. Valid redirect URIs : `http://localhost:5173/*`
9. Web origins : `http://localhost:5173`
10. Cliquez sur "Save"

### 3. Configurer le client

1. Dans l'onglet "Settings" du client :
   - Root URL : `http://localhost:5173`
   - Home URL : `http://localhost:5173`
   - Web Origins : `http://localhost:5173`

2. Dans l'onglet "Authentication" :
   - Authentication flow overrides : activez "Browser flow" → "browser"

### 4. Créer des utilisateurs

1. Allez dans "Users"
2. Cliquez sur "Add user"
3. Remplissez les informations :
   - Username : (ex: john.doe)
   - Email : (ex: john@example.com)
   - First Name : John
   - Last Name : Doe
4. Cliquez sur "Create"
5. Allez dans l'onglet "Credentials"
6. Cliquez sur "Set password"
7. Définissez un mot de passe
8. Décochez "Temporary" si vous ne voulez pas que l'utilisateur change son mot de passe
9. Cliquez sur "Save"

### 5. Configuration des rôles (optionnel)

1. Allez dans "Realm roles"
2. Cliquez sur "Create role"
3. Nom : `user`
4. Cliquez sur "Save"

5. Retournez dans "Users" → sélectionnez un utilisateur → onglet "Role mapping"
6. Cliquez sur "Assign role"
7. Sélectionnez le rôle "user"
8. Cliquez sur "Assign"

## Configuration de l'application

Mettez à jour le fichier `.env` :

```env
# Désactiver le mode local
VITE_LOCAL_MODE=false

# Configuration Keycloak
VITE_KEYCLOAK_URL=http://localhost:8080/auth
VITE_KEYCLOAK_REALM=cv-maker
VITE_KEYCLOAK_CLIENT_ID=cv-maker-client
```

Redémarrez l'application :
```bash
npm run dev
```

## Mode Local (sans Keycloak)

Si vous ne voulez pas utiliser Keycloak, vous pouvez utiliser le mode local :

1. Dans `.env` :
```env
VITE_LOCAL_MODE=true
```

2. L'application fonctionnera avec un utilisateur local fictif
3. Les CV seront stockés dans le localStorage du navigateur

## Production

Pour la production :

1. Utilisez HTTPS pour Keycloak
2. Changez les URLs dans la configuration client Keycloak
3. Utilisez un certificat SSL valide
4. Activez la production mode dans Keycloak (pas start-dev)

```bash
# Exemple avec Docker en production
docker run -p 8443:8443 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -v /path/to/cert:/etc/x509/https \
  quay.io/keycloak/keycloak:latest start \
  --hostname=my-keycloak-server.com \
  --https-certificate-file=/etc/x509/https/tls.crt \
  --https-certificate-key-file=/etc/x509/https/tls.key
```

## Dépannage

### Erreur "Invalid parameter: redirect_uri"
- Vérifiez que l'URL de redirection est correctement configurée dans le client Keycloak
- Assurez-vous que l'URL correspond exactement (y compris le port)

### Erreur "Client not found"
- Vérifiez que le realm est correct
- Vérifiez que le client ID est exact

### Mode local ne fonctionne pas
- Vérifiez que `VITE_LOCAL_MODE=true` est défini
- Videz le localStorage du navigateur
- Rafraîchissez la page

### Problèmes CORS
- Ajoutez l'origine de votre application dans "Web origins" du client Keycloak
- Utilisez `*` uniquement en développement
