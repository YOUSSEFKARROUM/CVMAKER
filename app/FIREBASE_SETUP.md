# Configuration Firebase - Résolution des erreurs

## Erreur : "Database '(default)' not found"

Cette erreur signifie que votre base de données Firestore n'a pas été créée dans la console Firebase.

## Étapes pour créer la base de données

### 1. Accéder à la console Firebase
- Allez sur https://console.firebase.google.com/
- Connectez-vous avec votre compte Google
- Sélectionnez votre projet : `cvmaker-9fd0f`

### 2. Créer la base de données Firestore
1. Dans le menu de gauche, cliquez sur **"Firestore Database"**
2. Cliquez sur **"Créer une base de données"**
3. Choisissez **"Démarrer en mode production"** (recommandé) ou **"Mode test"**
4. Sélectionnez une région proche de vos utilisateurs (ex: `europe-west`)
5. Cliquez sur **"Activer"**

### 3. Créer les index (optionnel mais recommandé)
Dans l'onglet **"Index"**, créez un index composite pour optimiser les requêtes :
- Collection : `cvs`
- Champ 1 : `userId` (Croissant)
- Champ 2 : `updatedAt` (Décroissant)

### 4. Vérifier les règles de sécurité
Dans l'onglet **"Règles"**, assurez-vous d'avoir :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cvs/{cvId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /shares/{shareId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Redémarrer l'application
Après avoir créé la base de données, redémarrez votre application locale :
```bash
npm run dev
```

## Mode développement sans Firebase

Si vous ne voulez pas utiliser Firebase pour le moment, vous pouvez utiliser uniquement le stockage local. Le CV sera sauvegardé dans le localStorage du navigateur.

Les fonctionnalités suivantes nécessitent Firebase :
- Sauvegarde des CV dans le cloud
- Partage de CV
- Synchronisation entre appareils

## Variables d'environnement

Assurez-vous que votre fichier `.env` contient toutes ces variables :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

## Vérification

Après configuration, ouvrez l'application et essayez de :
1. Créer un CV
2. Cliquer sur "Save" dans le menu utilisateur
3. Vérifier que le CV apparaît dans "Mes CVs"

Si vous voyez toujours des erreurs, vérifiez la console du navigateur pour plus de détails.
