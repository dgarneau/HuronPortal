# Azure Configuration Script for HuronPortal
# This script configures the Azure App Service for proper Next.js standalone deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$AppName = "huronportal-app",
    
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup = "huronportal-rg"
)

Write-Host "Configuring Azure App Service: $AppName" -ForegroundColor Cyan

# Set the startup command
Write-Host "`nSetting startup command..." -ForegroundColor Yellow
az webapp config set `
    --name $AppName `
    --resource-group $ResourceGroup `
    --startup-file "node server.js"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Startup command set successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to set startup command" -ForegroundColor Red
    exit 1
}

# Verify environment variables
Write-Host "`nVerifying environment variables..." -ForegroundColor Yellow
$settings = az webapp config appsettings list `
    --name $AppName `
    --resource-group $ResourceGroup | ConvertFrom-Json

$requiredVars = @(
    "COSMOS_ENDPOINT",
    "COSMOS_KEY",
    "COSMOS_DATABASE",
    "SESSION_SECRET",
    "NODE_ENV"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    $found = $settings | Where-Object { $_.name -eq $var }
    if ($found) {
        Write-Host "  ✓ $var is set" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $var is MISSING" -ForegroundColor Red
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "`nWARNING: Missing environment variables:" -ForegroundColor Red
    $missingVars | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "`nPlease set them using:" -ForegroundColor Yellow
    Write-Host "az webapp config appsettings set --name $AppName --resource-group $ResourceGroup --settings VARIABLE_NAME=value" -ForegroundColor Cyan
}

# Restart the app
Write-Host "`nRestarting app service..." -ForegroundColor Yellow
az webapp restart --name $AppName --resource-group $ResourceGroup

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ App service restarted successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to restart app service" -ForegroundColor Red
    exit 1
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Configuration complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Deploy your code: git push origin main" -ForegroundColor White
Write-Host "2. Monitor logs: az webapp log tail --name $AppName --resource-group $ResourceGroup" -ForegroundColor White
Write-Host "3. Open your app: https://$AppName.azurewebsites.net" -ForegroundColor White
