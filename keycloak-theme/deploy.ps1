# Deploy CV Maker theme to Keycloak
param([string]$ContainerName = "charming_morse")

Write-Host "Deploying CV Maker theme to Keycloak..."

# Check container
$container = docker ps --filter "name=$ContainerName" --format "{{.Names}}"
if (-not $container) {
    Write-Host "Error: Container '$ContainerName' not found!"
    Write-Host "Available containers:"
    docker ps --format "table {{.Names}}"
    exit 1
}

Write-Host "Found container: $container"

# Create directory
docker exec $ContainerName mkdir -p /opt/keycloak/themes/cv-maker/login/resources/css

# Copy files
Write-Host "Copying theme files..."
docker cp "$PSScriptRoot/cv-maker/login/theme.properties" "$ContainerName`:/opt/keycloak/themes/cv-maker/login/"
docker cp "$PSScriptRoot/cv-maker/login/resources/css/styles.css" "$ContainerName`:/opt/keycloak/themes/cv-maker/login/resources/css/"

# Verify
$test = docker exec $ContainerName test -f /opt/keycloak/themes/cv-maker/login/theme.properties
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Theme deployed." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Open http://localhost:8080/admin" -ForegroundColor White
    Write-Host "  2. Go to Realm Settings -> Themes" -ForegroundColor White
    Write-Host "  3. Select 'cv-maker' as Login Theme" -ForegroundColor White
    Write-Host "  4. Save" -ForegroundColor White
    Write-Host ""
    Write-Host "The theme will be applied immediately!" -ForegroundColor Green
} else {
    Write-Host "Error: Failed to copy files" -ForegroundColor Red
    exit 1
}
