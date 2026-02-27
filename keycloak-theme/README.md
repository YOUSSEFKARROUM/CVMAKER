# Thème CV Maker pour Keycloak

Thème personnalisé pour Keycloak avec le design de l'application CV Maker.

## 🎨 Aperçu

- **Dégradé de fond** : Violet/Indigo (identique à l'app)
- **Carte arrondie** : Bordures 24px, ombre portée
- **Boutons modernes** : Dégradé avec effet hover
- **Champs de saisie** : Bordures arrondies, focus visible
- **Animations** : Entrée en fondu

## 🚀 Déploiement rapide

### Méthode 1 : Script automatisé (Recommandé)

#### Windows (PowerShell)
```powershell
cd keycloak-theme
.\deploy-theme.ps1
```

#### Linux/Mac (Bash)
```bash
cd keycloak-theme
chmod +x deploy-theme.sh
./deploy-theme.sh
```

### Méthode 2 : Manuel avec Docker

```bash
# Créer le dossier dans le conteneur
docker exec keycloak mkdir -p /opt/keycloak/themes/cv-maker/login/resources/css

# Copier les fichiers
docker cp cv-maker/login/theme.properties keycloak:/opt/keycloak/themes/cv-maker/login/
docker cp cv-maker/login/resources/css/styles.css keycloak:/opt/keycloak/themes/cv-maker/login/resources/css/
```

### Méthode 3 : Keycloak local (sans Docker)

```bash
# Copier le dossier cv-maker dans le répertoire themes de Keycloak
cp -r cv-maker /opt/keycloak/themes/
```

## ⚙️ Activation dans Keycloak

1. Allez dans **Keycloak Admin Console** : http://localhost:8080/admin
2. Sélectionnez votre realm (**cv-maker**)
3. Allez dans **Realm Settings** → **Themes**
4. Dans **Login Theme**, sélectionnez : **cv-maker**
5. Cliquez sur **Save**

Le thème est immédiatement appliqué ! 🎉

## 🎨 Personnalisation

### Modifier les couleurs

Éditez `cv-maker/login/resources/css/styles.css` :

```css
/* Dégradé de fond */
.login-pf body {
  background: linear-gradient(135deg, #VOTRE_COULEUR1 0%, #VOTRE_COULEUR2 100%);
}

/* Bouton */
.btn-primary {
  background: linear-gradient(135deg, #VOTRE_COULEUR1 0%, #VOTRE_COULEUR2 100%);
}
```

### Ajouter un logo

1. Placez votre logo dans : `cv-maker/login/resources/img/logo.png`
2. Modifiez le CSS :

```css
.login-pf-header::before {
  content: "";
  background: url('../img/logo.png') center/contain no-repeat;
  /* ... autres styles ... */
}
```

### Modifier le titre

Par défaut, le titre est masqué et remplacé par une icône. Pour changer :

```css
/* Dans styles.css */
#kc-page-title::before {
  content: "Mon Titre";
}
```

## 📁 Structure

```
keycloak-theme/
├── README.md
├── deploy-theme.ps1      # Script Windows
├── deploy-theme.sh       # Script Linux/Mac
└── cv-maker/
    └── login/
        ├── theme.properties
        └── resources/
            └── css/
                └── styles.css
```

## 🔧 Dépannage

### Le thème n'apparaît pas dans la liste
- Vérifiez que les fichiers sont bien copiés dans le conteneur
- Redémarrez Keycloak si nécessaire : `docker restart keycloak`

### Les styles ne s'appliquent pas
- Videz le cache du navigateur (Ctrl+F5)
- Vérifiez que le fichier `styles.css` est bien dans le conteneur :
  ```bash
  docker exec keycloak cat /opt/keycloak/themes/cv-maker/login/resources/css/styles.css
  ```

### Retourner au thème par défaut
Dans Keycloak Admin → Realm Settings → Themes → Login Theme : sélectionnez **keycloak**

## 📝 Notes

- Ce thème est compatible avec Keycloak 20+
- Les formulaires de login, register, forgot password sont stylisés
- Support responsive (mobile-friendly)
