#!/usr/bin/env pwsh

# Script pour faciliter la configuration des secrets GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepo
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Configuration GitHub Actions Secrets" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Ouvrir la page des secrets GitHub
$secretsUrl = "https://github.com/$GitHubRepo/settings/secrets/actions"
Write-Host "Ouverture de la page des secrets GitHub..." -ForegroundColor Green
Start-Process $secretsUrl

Write-Host "`nAppuyez sur ENTREE pour continuer avec chaque secret..." -ForegroundColor Yellow
Read-Host

# Secret 1: AZURE_WEBAPP_PUBLISH_PROFILE
Write-Host "`n--- Secret 1/5: AZURE_WEBAPP_PUBLISH_PROFILE ---" -ForegroundColor Cyan
Write-Host "Copie du contenu dans le presse-papier..." -ForegroundColor Green
Get-Content "publish-profile.xml" -Raw | Set-Clipboard
Write-Host "OK - Contenu copie!" -ForegroundColor Green
Write-Host "`nDans GitHub:" -ForegroundColor Yellow
Write-Host "1. Cliquez sur 'New repository secret'" -ForegroundColor White
Write-Host "2. Name: AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor White
Write-Host "3. Value: Collez (Ctrl+V)" -ForegroundColor White
Write-Host "4. Cliquez sur 'Add secret'" -ForegroundColor White
Read-Host "`nAppuyez sur ENTREE quand termine"

# Secret 2: COSMOS_ENDPOINT
Write-Host "`n--- Secret 2/5: COSMOS_ENDPOINT ---" -ForegroundColor Cyan
$cosmosEndpoint = "https://huronportal-cosmosdb.documents.azure.com:443/"
$cosmosEndpoint | Set-Clipboard
Write-Host "OK - Valeur copiee: $cosmosEndpoint" -ForegroundColor Green
Write-Host "`nDans GitHub:" -ForegroundColor Yellow
Write-Host "1. Cliquez sur 'New repository secret'" -ForegroundColor White
Write-Host "2. Name: COSMOS_ENDPOINT" -ForegroundColor White
Write-Host "3. Value: Collez (Ctrl+V)" -ForegroundColor White
Write-Host "4. Cliquez sur 'Add secret'" -ForegroundColor White
Read-Host "`nAppuyez sur ENTREE quand termine"

# Secret 3: COSMOS_KEY
Write-Host "`n--- Secret 3/5: COSMOS_KEY ---" -ForegroundColor Cyan
Write-Host "Recuperation de la cle Cosmos DB..." -ForegroundColor Green
$cosmosKey = az cosmosdb keys list --name huronportal-cosmosdb --resource-group huronportal-rg --query primaryMasterKey -o tsv
$cosmosKey | Set-Clipboard
Write-Host "OK - Cle copiee dans le presse-papier" -ForegroundColor Green
Write-Host "`nDans GitHub:" -ForegroundColor Yellow
Write-Host "1. Cliquez sur 'New repository secret'" -ForegroundColor White
Write-Host "2. Name: COSMOS_KEY" -ForegroundColor White
Write-Host "3. Value: Collez (Ctrl+V)" -ForegroundColor White
Write-Host "4. Cliquez sur 'Add secret'" -ForegroundColor White
Read-Host "`nAppuyez sur ENTREE quand termine"

# Secret 4: COSMOS_DATABASE
Write-Host "`n--- Secret 4/5: COSMOS_DATABASE ---" -ForegroundColor Cyan
$cosmosDb = "huronportal-db"
$cosmosDb | Set-Clipboard
Write-Host "OK - Valeur copiee: $cosmosDb" -ForegroundColor Green
Write-Host "`nDans GitHub:" -ForegroundColor Yellow
Write-Host "1. Cliquez sur 'New repository secret'" -ForegroundColor White
Write-Host "2. Name: COSMOS_DATABASE" -ForegroundColor White
Write-Host "3. Value: Collez (Ctrl+V)" -ForegroundColor White
Write-Host "4. Cliquez sur 'Add secret'" -ForegroundColor White
Read-Host "`nAppuyez sur ENTREE quand termine"

# Secret 5: JWT_SECRET
Write-Host "`n--- Secret 5/5: JWT_SECRET ---" -ForegroundColor Cyan
$jwtSecret = "V2lBN3pZbVIwWEx3MkRTQ2d0ajFReUp2ZXh1bGRzRTY="
$jwtSecret | Set-Clipboard
Write-Host "OK - Valeur copiee: $jwtSecret" -ForegroundColor Green
Write-Host "`nDans GitHub:" -ForegroundColor Yellow
Write-Host "1. Cliquez sur 'New repository secret'" -ForegroundColor White
Write-Host "2. Name: JWT_SECRET" -ForegroundColor White
Write-Host "3. Value: Collez (Ctrl+V)" -ForegroundColor White
Write-Host "4. Cliquez sur 'Add secret'" -ForegroundColor White
Read-Host "`nAppuyez sur ENTREE quand termine"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Configuration terminee!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Voulez-vous pousser vers GitHub maintenant? (o/n): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq "o" -or $response -eq "O") {
    Write-Host "`nPreparation du commit..." -ForegroundColor Green
    git add .
    git commit -m "Add Azure deployment configuration with GitHub Actions"
    Write-Host "`nPush vers GitHub..." -ForegroundColor Green
    git push origin main
    Write-Host "`nDeploiement lance! Verifiez l'onglet Actions sur GitHub." -ForegroundColor Green
    
    # Ouvrir la page Actions
    $actionsUrl = "https://github.com/$GitHubRepo/actions"
    Start-Process $actionsUrl
} else {
    Write-Host "`nPour deployer plus tard, executez:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'Add Azure deployment configuration'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
}

Write-Host "`nURL de l'application: https://huronportal-app.azurewebsites.net`n" -ForegroundColor Cyan
