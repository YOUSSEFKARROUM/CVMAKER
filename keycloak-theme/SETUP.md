# Configuration du Thème CV Maker dans Keycloak

## Vérification du déploiement

### 1. Vérifier que les fichiers sont copiés
```bash
docker exec charming_morse ls -la /opt/keycloak/themes/cv-maker/login/
```

Vous devriez voir :
```
theme.properties
resources/
```

### 2. Vérifier le CSS
```bash
docker exec charming_morse cat /opt/keycloak/themes/cv-maker/login/resources/css/styles.css | head -20
```

## Activation du thème

### Étape 1 : Accéder à Keycloak Admin
- URL : http://localhost:8080/admin
- Username : admin
- Password : admin

### Étape 2 : Sélectionner le realm
- Cliquez sur le menu déroulant en haut à gauche
- Sélectionnez **cv-maker**

### Étape 3 : Configurer le thème
1. Dans le menu de gauche, cliquez sur **Realm Settings**
2. Allez dans l'onglet **Themes**
3. Dans **Login Theme**, sélectionnez **cv-maker**
4. Cliquez sur **Save**

### Étape 4 : Vider le cache
1. Allez dans **Realm Settings** → **Cache**
2. Cliquez sur **Clear Cache**

### Étape 5 : Tester
- Ouvrez une fenêtre de navigation privée
- Allez sur : http://localhost:8080/realms/cv-maker/account
- Vous devriez voir le nouveau design

## Dépannage

### Le thème n'apparaît pas dans la liste
```bash
# Redémarrer Keycloak
docker restart charming_morse

# Attendre 30 secondes
# Rafraîchir la page Keycloak Admin
```

### Les styles ne s'appliquent pas
1. Vider le cache navigateur (Ctrl+Shift+R)
2. Ou ouvrir en navigation privée (Ctrl+Shift+N)
3. Vérifier que `theme.properties` contient :
   ```
   parent=keycloak
   import=common/keycloak
   styles=css/styles.css
   ```

### Retourner au thème par défaut
Dans Realm Settings → Themes → Login Theme : sélectionnez **keycloak**

## Structure du thème

```
/opt/keycloak/themes/cv-maker/
└── login/
    ├── theme.properties
    └── resources/
        └── css/
            └── styles.css
```

## Personnalisation

### Modifier les couleurs
Éditez `styles.css` et changez :
```css
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
```

### Redéployer après modification
```powershell
powershell -ExecutionPolicy Bypass -File deploy.ps1
docker restart charming_morse
```
