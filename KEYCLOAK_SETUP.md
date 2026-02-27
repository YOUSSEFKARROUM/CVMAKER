# Configuration Keycloak pour CV Maker

## Est-ce pratique d'utiliser la redirection Keycloak ?

**Oui, c'est la méthode recommandée !**

### Avantages de la redirection Keycloak

| Avantage | Description |
|----------|-------------|
| **Sécurité maximale** | PKCE, tokens sécurisés, gestion des sessions côté serveur |
| **Pas de code sensible** | Le client secret n'est pas exposé dans votre SPA |
| **Single Sign-On (SSO)** | Connecté une fois, accès à toutes les apps |
| **2FA/MFA** | Support natif de l'authentification à deux facteurs |
| **Mot de passe oublié** | Workflow complet géré par Keycloak |
| **Social Login** | Google, GitHub, etc. facilement intégrables |
| **Mises à jour de sécurité** | Gérées automatiquement par Keycloak |

### Peut-on personnaliser le design ?

**Oui !** Voici les 3 approches possibles :

## Prérequis

1. **Keycloak installé et démarré** sur `http://localhost:8080`
2. **Un realm créé** (par défaut: `cv-maker`)
3. **Un client configuré** (par défaut: `cv-maker-client`)

## Étapes de configuration

### 1. Démarrer Keycloak

```bash
# Avec Docker
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.0 start-dev

# Ou téléchargez Keycloak et démarrez:
# bin/kc.sh start-dev
```

### 2. Accéder à la console d'administration

- URL: http://localhost:8080/admin
- Username: `admin`
- Password: `admin`

### 3. Créer un Realm

1. Cliquez sur le menu déroulant en haut à gauche (où il est écrit "master")
2. Cliquez sur **"Create Realm"**
3. Nom du realm: `cv-maker`
4. Cliquez sur **"Create"**

### 3b. Activer l'inscription utilisateur

1. Dans le menu de gauche, cliquez sur **"Realm Settings"**
2. Allez dans l'onglet **"Login"**
3. Activez: ✅ **"User registration"**
4. Cliquez sur **"Save"**

### 4. Créer un Client

1. Dans le menu de gauche, cliquez sur **"Clients"**
2. Cliquez sur **"Create client"**
3. Remplissez:
   - **Client ID**: `cv-maker-client`
   - **Name**: CV Maker Client (optionnel)
4. Cliquez sur **"Next"**
5. **Client authentication**: ❌ **OFF** (désactivé - important pour une SPA)
6. Cliquez sur **"Next"**
7. Dans **"Valid redirect URIs"**, ajoutez:
   ```
   http://localhost:5173/*
   http://localhost:4173/*
   ```
8. Dans **"Web origins"**, ajoutez:
   ```
   http://localhost:5173
   http://localhost:4173
   ```
9. Cliquez sur **"Save"**

### 5. Configurer le client (IMPORTANT)

#### Option A: Redirection vers Keycloak (Recommandé - Plus sécurisé)

Dans l'onglet **"Settings"** du client:

1. **"Proof Key for Code Exchange Code Challenge Method"**: Sélectionnez **"S256"**
2. **"Authentication flow"**:
   - ✅ Standard flow (obligatoire)
   - ❌ Direct access grants (désactivé)
   - ❌ Implicit flow (désactivé - obsolète)

#### Option B: Formulaire personnalisé intégré (Direct Access Grants)

Si vous voulez garder votre propre interface de login sans redirection vers Keycloak:

1. Dans l'onglet **"Settings"**:
   - **"Authentication flow"**:
     - ✅ Standard flow (obligatoire)
     - ✅ **Direct access grants** (ACTIVÉ)
     - ❌ Implicit flow (désactivé)
2. Allez dans l'onglet **"Credentials"**:
   - Copiez le **Client secret** (vous en aurez besoin dans l'app)

⚠️ **Avertissement**: Cette méthode est moins sécurisée car votre application voit les credentials utilisateur. À utiliser uniquement si nécessaire.

Dans l'onglet **"Advanced"**:

1. Scrollez jusqu'à **"Advanced Settings"**
2. **"Access Token Lifespan"**: `5 minutes` (ou selon vos besoins)
3. **"Client Session Idle"**: `30 minutes`

### 6. Créer un utilisateur de test

1. Menu de gauche: **"Users"**
2. Cliquez sur **"Add user"**
3. Remplissez:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **First name**: `Test`
   - **Last name**: `User`
4. Cliquez sur **"Create"**
5. Allez dans l'onglet **"Credentials"**
6. Cliquez sur **"Set password"**
7. Entrez un mot de passe et désactivez **"Temporary"**
8. Cliquez sur **"Save"**

### 7. Configurer les mappages de tokens (Token Claims)

Pour que l'application reçoive l'email et le nom:

1. Dans le client `cv-maker-client`, allez dans l'onglet **"Client scopes"**
2. Cliquez sur **"cv-maker-client-dedicated"**
3. Cliquez sur **"Add mapper"** > **"By configuration"**
4. Sélectionnez **"User Property"**:
   - **Name**: `email`
   - **User Attribute**: `email`
   - **Token Claim Name**: `email`
   - ✅ Add to ID token
   - ✅ Add to access token
5. Répétez pour `name`:
   - **Name**: `name`
   - **User Attribute**: `firstName`
   - **Token Claim Name**: `name`
   - ✅ Add to ID token
   - ✅ Add to access token

## Configuration de l'application

### Fichier `.env`

Créez/modifiez le fichier `app/.env`:

```env
# Mode local (désactive Keycloak)
# VITE_LOCAL_MODE=true

# Configuration Keycloak
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=cv-maker
VITE_KEYCLOAK_CLIENT_ID=cv-maker-client
```

### Mode Local (sans Keycloak)

Si vous voulez tester sans Keycloak:

```env
VITE_LOCAL_MODE=true
```

Dans ce mode, un utilisateur fictif sera créé automatiquement.

## Dépannage

### "Initialization error"

Vérifiez dans la console du navigateur (F12):

1. **CORS errors**: Ajoutez les bonnes origines dans Web origins
2. **404 sur le realm**: Vérifiez que le realm existe
3. **Client not found**: Vérifiez le Client ID

### "POST .../token 401 (Unauthorized)"

Cette erreur indique que **"Client authentication"** est activé dans Keycloak. Pour une SPA (React app), vous devez :

1. Aller dans Keycloak Admin → Clients → `cv-maker-client` → Settings
2. Désactiver **"Client authentication"** (mettre sur OFF)
3. Désactiver **"Direct access grants"**
4. Sauvegarder

### "Registration not allowed"

L'inscription utilisateur n'est pas activée dans le realm. Pour l'activer :

1. Aller dans Keycloak Admin → Sélectionner le realm `cv-maker`
2. Cliquer sur **"Realm Settings"** dans le menu gauche
3. Aller dans l'onglet **"Login"**
4. Activer ✅ **"User registration"**
5. Cliquer sur **"Save"**

### "Silent SSO check failed"

C'est normal si vous n'êtes pas déjà authentifié. L'application réessaiera sans silent check.

### Boucle de redirection infinie

1. Vérifiez les **Valid redirect URIs**
2. Assurez-vous qu'ils se terminent par `/*`
3. Vérifiez que l'URL de l'app correspond (port 5173 pour dev, 4173 pour preview)

### Problèmes de tokens

Dans la console Keycloak:
1. Vérifiez que **"Client authentication"** est activé
2. Vérifiez que **"Standard flow"** est activé
3. Vérifiez les mappages de claims

## URLs importantes

- **Console admin**: http://localhost:8080/admin
- **Well-known config**: http://localhost:8080/realms/cv-maker/.well-known/openid-configuration
- **Authorization**: http://localhost:8080/realms/cv-maker/protocol/openid-connect/auth
- **Token**: http://localhost:8080/realms/cv-maker/protocol/openid-connect/token

## Vérification

Pour tester que Keycloak fonctionne:

```bash
curl http://localhost:8080/realms/cv-maker/.well-known/openid-configuration
```

Vous devriez voir un JSON avec les endpoints OIDC.

---

## Configuration Optionnelle: Formulaires Personnalisés (Login Direct)

Utilisez votre interface React (AuthModal) pour **login, register et forgot password** sans redirection vers Keycloak.

### ✅ Avantages
- **100% React** : Votre design, vos animations
- **Pas de redirection** : Expérience fluide
- **3 fonctionnalités** : Login + Register + Forgot Password en mode direct

### ⚠️ Configuration requise

#### 1. Activer Direct Access Grants

1. Keycloak Admin → Clients → `cv-maker-client` → Settings
2. Dans **"Authentication flow"** :
   - ✅ **Direct access grants** (ACTIVÉ)
3. Sauvegardez

#### 2. Créer un client Admin (pour l'inscription)

Pour permettre l'inscription directe depuis React :

1. Keycloak Admin → Clients → **Create client**
   - **Client ID** : `cv-maker-admin`
   - **Client authentication** : ON
   - **Service accounts roles** : ON
2. Dans l'onglet **Credentials** : Notez le **Client secret**
3. Dans l'onglet **Service accounts roles** :
   - Cliquez sur **Assign role**
   - Filtrez par "realm-management"
   - Sélectionnez **"manage-users"** et **"view-users"**
   - Cliquez sur **Assign**

#### 3. Configurer l'application

Dans `app/.env` :

```env
# Pour login et register
VITE_KEYCLOAK_CLIENT_SECRET=votre-client-secret-cv-maker-client

# Pour l'inscription (client admin)
VITE_KEYCLOAK_ADMIN_CLIENT_SECRET=votre-client-secret-cv-maker-admin
```

#### 4. Fonctionnement

Votre `AuthModal` fonctionne maintenant **sans redirection** :

```typescript
// Login direct
const { login } = useAuth();
await login(email, password); // ✅ Pas de redirection

// Register direct  
const { register } = useAuth();
await register(email, password, displayName); // ✅ Compte créé + connecté

// Forgot password direct
const { forgotPassword } = useAuth();
await forgotPassword(email); // ✅ Email envoyé
```

### Désactiver le mode direct

Pour revenir aux redirections Keycloak :

```env
# VITE_KEYCLOAK_CLIENT_SECRET=...
# VITE_KEYCLOAK_ADMIN_CLIENT_SECRET=...
```

Et désactivez **"Direct access grants"** dans Keycloak.

---

## Personnaliser le design de Keycloak (Thème personnalisé)

Si vous voulez garder la redirection Keycloak mais avec un design qui correspond à votre application, voici les 3 solutions :

### Solution 1: Thème CV Maker Prêt à l'emploi (Recommandé - 5 min) ✅

Un thème personnalisé est déjà créé dans le dossier `keycloak-theme/` !

#### Déploiement rapide

**Windows :**
```powershell
cd keycloak-theme
.\deploy-theme.ps1
```

**Linux/Mac :**
```bash
cd keycloak-theme
chmod +x deploy-theme.sh
./deploy-theme.sh
```

**Manuel (Docker) :**
```bash
docker exec keycloak mkdir -p /opt/keycloak/themes/cv-maker/login/resources/css
docker cp keycloak-theme/cv-maker/login/theme.properties keycloak:/opt/keycloak/themes/cv-maker/login/
docker cp keycloak-theme/cv-maker/login/resources/css/styles.css keycloak:/opt/keycloak/themes/cv-maker/login/resources/css/
```

#### Activation

1. Allez dans **Keycloak Admin** → Realm Settings → Themes
2. **Login Theme** : sélectionnez `cv-maker`
3. **Save**

C'est tout ! 🎉 Le thème est appliqué immédiatement.

#### Caractéristiques du thème

- ✅ Dégradé violet/indigo identique à l'app
- ✅ Carte arrondie avec ombre moderne
- ✅ Boutons avec effet hover
- ✅ Champs de saisie arrondis
- ✅ Responsive (mobile-friendly)
- ✅ Animations d'entrée

#### Personnalisation

**Modifier les couleurs :**  
Éditez `keycloak-theme/cv-maker/login/resources/css/styles.css` :

```css
.login-pf body {
  background: linear-gradient(135deg, #VOTRE_COULEUR1 0%, #VOTRE_COULEUR2 100%);
}
```

**Ajouter un logo :**  
1. Placez votre logo dans `keycloak-theme/cv-maker/login/resources/img/logo.png`
2. Modifiez le CSS pour l'afficher

Redéployez après chaque modification :
```bash
.\deploy-theme.ps1  # Windows
./deploy-theme.sh    # Linux/Mac
```

---

### Solution 2: Keycloakify (Design pixel-perfect - Avancé)

[Keycloakify](https://keycloakify.dev/) permet de créer un thème React identique à votre `AuthModal`.

```bash
npx create-keycloakify-app@latest cv-maker-keycloak-theme
cd cv-maker-keycloak-theme
npm install
npm run dev
```

**Avantages :** Design 100% identique, hot reload  
**Inconvénients :** Nécessite un build séparé

---

### Solution 3: Thème natif Keycloak (FreeMarker)

Créez un thème from scratch avec les templates FreeMarker de Keycloak.

Voir la documentation officielle : https://www.keycloak.org/docs/latest/server_development/#_themes
