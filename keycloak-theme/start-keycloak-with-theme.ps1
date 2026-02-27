# Script pour démarrer Keycloak avec le thème CV Maker directement monté
# Usage: .\start-keycloak-with-theme.ps1

param(
    [string]$ContainerName = "keycloak",
    [int]$Port = 8080
)

Write-Host "🚀 Démarrage de Keycloak avec le thème CV Maker..." -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est installé
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker n'est pas installé !" -ForegroundColor Red
    exit 1
}

# Arrêter et supprimer l'ancien conteneur s'il existe
$existingContainer = docker ps -a --filter "name=$ContainerName" --format "{{.Names}}"
if ($existingContainer) {
    Write-Host "🛑 Arrêt du conteneur existant..." -ForegroundColor Yellow
    docker stop $ContainerName 2>$null | Out-Null
    docker rm $ContainerName 2>$null | Out-Null
}

# Obtenir le chemin absolu du dossier du thème
$themePath = Resolve-Path "$PSScriptRoot\cv-maker"

Write-Host "📁 Chemin du thème: $themePath" -ForegroundColor Gray
Write-Host "🌐 Port: $Port" -ForegroundColor Gray
Write-Host ""

# Démarrer Keycloak avec le thème monté
Write-Host "⏳ Démarrage de Keycloak (cela peut prendre 30-60 secondes)..." -ForegroundColor Yellow
Write-Host ""

docker run -d `
    --name $ContainerName `
    -p ${Port}:8080 `
    -e KEYCLOAK_ADMIN=admin `
    -e KEYCLOAK_ADMIN_PASSWORD=admin `
    -v "${themePath}:/opt/keycloak/themes/cv-maker:ro" `
    quay.io/keycloak/keycloak:26.0 `
    start-dev

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du démarrage de Keycloak" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Conteneur démarré !" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Attente du démarrage complet..." -ForegroundColor Yellow

# Attendre que Keycloak soit prêt
$maxAttempts = 30
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    Start-Sleep -Seconds 2
    $attempt++
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port/health/ready" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        Write-Host "   Tentative $attempt/$maxAttempts..." -ForegroundColor Gray
    }
}

if ($ready) {
    Write-Host ""
    Write-Host "✅ Keycloak est prêt !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 URLs importantes:" -ForegroundColor Cyan
    Write-Host "   - Admin Console: http://localhost:$Port/admin" -ForegroundColor White
    Write-Host "   - Login: http://localhost:$Port/realms/master/protocol/openid-connect/auth" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 Identifiants admin:" -ForegroundColor Cyan
    Write-Host "   - Username: admin" -ForegroundColor White
    Write-Host "   - Password: admin" -ForegroundColor White
    Write-Host ""
    Write-Host "🎨 Le thème CV Maker est déjà disponible !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "   1. Créez le realm 'cv-maker'" -ForegroundColor White
    Write-Host "   2. Créez le client 'cv-maker-client'" -ForegroundColor White
    Write-Host "   3. Dans Realm Settings → Themes → Login Theme: sélectionnez 'cv-maker'" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Documentation complète: KEYCLOAK_SETUP.md" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "⚠️  Keycloak met du temps à démarrer..." -ForegroundColor Yellow
    Write-Host "   Vérifiez les logs: docker logs $ContainerName" -ForegroundColor White
}
