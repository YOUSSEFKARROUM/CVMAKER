#!/bin/bash
# Script Bash pour déployer le thème CV Maker dans Keycloak Docker
# Usage: ./deploy-theme.sh [nom_du_conteneur]

CONTAINER_NAME=${1:-keycloak}

echo "🎨 Déploiement du thème CV Maker dans Keycloak..."
echo ""

# Vérifier si le conteneur existe
if ! docker ps --filter "name=$CONTAINER_NAME" --format "{{.Names}}" | grep -q "$CONTAINER_NAME"; then
    echo "❌ Erreur: Conteneur '$CONTAINER_NAME' non trouvé !"
    echo ""
    echo "Conteneurs Keycloak disponibles:"
    docker ps --filter "ancestor=keycloak" --format "table {{.Names}}\t{{.Status}}"
    echo ""
    echo "Utilisation: ./deploy-theme.sh mon-keycloak"
    exit 1
fi

echo "✅ Conteneur trouvé: $CONTAINER_NAME"
echo ""

# Créer le dossier themes dans le conteneur
docker exec "$CONTAINER_NAME" mkdir -p /opt/keycloak/themes/cv-maker/login/resources/css

# Copier les fichiers du thème
echo "📁 Copie des fichiers du thème..."

# Copier theme.properties
docker cp "$(dirname "$0")/cv-maker/login/theme.properties" "$CONTAINER_NAME:/opt/keycloak/themes/cv-maker/login/"

# Copier le CSS
docker cp "$(dirname "$0")/cv-maker/login/resources/css/styles.css" "$CONTAINER_NAME:/opt/keycloak/themes/cv-maker/login/resources/css/"

# Vérifier que les fichiers sont bien copiés
echo ""
echo "🔍 Vérification..."
if docker exec "$CONTAINER_NAME" test -f /opt/keycloak/themes/cv-maker/login/theme.properties; then
    echo "✅ Fichiers copiés avec succès !"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "   1. Allez dans Keycloak Admin: http://localhost:8080/admin"
    echo "   2. Realm Settings → Themes"
    echo "   3. Login Theme: sélectionnez 'cv-maker'"
    echo "   4. Sauvegardez"
    echo ""
    echo "🚀 Le thème sera appliqué immédiatement !"
else
    echo "❌ Erreur lors de la copie des fichiers"
    exit 1
fi
