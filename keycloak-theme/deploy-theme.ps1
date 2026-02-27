# Script PowerShell pour déployer le thème CV Maker dans Keycloak Docker
# Usage: .\deploy-theme.ps1 [nom_du_conteneur]

param(
    [string]$ContainerName = "keycloak"
)

Write-Host "🎨 Déploiement du thème CV Maker dans Keycloak..." -ForegroundColor Cyan
Write-Host ""

# Vérifier si le conteneur existe
$container = docker ps --filter "name=$ContainerName" --format "{{.Names}}"

if (-not $container) {
    Write-Host "❌ Erreur: Conteneur '$ContainerName' non trouvé !" -ForegroundColor Red
    Write-Host ""
    Write-Host "Conteneurs Keycloak disponibles:" -ForegroundColor Yellow
    docker ps --filter "ancestor=keycloak" --format "table {{.Names}}`t{{.Status}}"
    Write-Host ""
    Write-Host "Utilisation: .\deploy-theme.ps1 -ContainerName 'mon-keycloak'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Conteneur trouvé: $container" -ForegroundColor Green
Write-Host ""

# Créer le dossier themes dans le conteneur
docker exec $ContainerName mkdir -p /opt/keycloak/themes/cv-maker/login/resources/css

# Copier les fichiers du thème
Write-Host "📁 Copie des fichiers du thème..." -ForegroundColor Yellow

# Copier theme.properties
docker cp "$PSScriptRoot\cv-maker\login\theme.properties" "$ContainerName`: /opt/keycloak/themes/cv-maker/login/"

# Copier le CSS
docker cp "$PSScriptRoot\cv-maker\login\resources\css\styles.css" "$ContainerName`: /opt/keycloak/themes/cv-maker/login/resources/css/"

# Vérifier que les fichiers sont bien copiés
Write-Host ""
Write-Host "🔍 Vérification..." -ForegroundColor Yellow
$checkFile = docker exec $ContainerName test -f /opt/keycloak/themes/cv-maker/login/theme.properties

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Fichiers copiés avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "   1. Allez dans Keycloak Admin: http://localhost:8080/admin" -ForegroundColor White
    Write-Host "   2. Realm Settings → Themes" -ForegroundColor White
    Write-Host "   3. Login Theme: sélectionnez 'cv-maker'" -ForegroundColor White
    Write-Host "   4. Sauvegardez" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Le thème sera appliqué immédiatement !" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de la copie des fichiers" -ForegroundColor Red
    exit 1
}
