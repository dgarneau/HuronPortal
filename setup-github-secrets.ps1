#!/usr/bin/env pwsh

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Configuration des secrets GitHub" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si le fichier de profil existe
if (-not (Test-Path "publish-profile.xml")) {
    Write-Host "❌ Le fichier publish-profile.xml n'existe pas!" -ForegroundColor Red
    Write-Host "   Exécutez d'abord la commande de téléchargement du profil." -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Voici les valeurs à configurer dans GitHub:" -ForegroundColor Green
Write-Host ""

Write-Host "1️⃣  AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor Yellow
Write-Host "   Copiez le contenu de publish-profile.xml" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  COSMOS_ENDPOINT" -ForegroundColor Yellow
Write-Host "   https://huronportal-cosmosdb.documents.azure.com:443/" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣  COSMOS_KEY" -ForegroundColor Yellow
$cosmosKey = az cosmosdb keys list --name huronportal-cosmosdb --resource-group huronportal-rg --query primaryMasterKey -o tsv
Write-Host "   $cosmosKey" -ForegroundColor White
Write-Host ""

Write-Host "4️⃣  COSMOS_DATABASE" -ForegroundColor Yellow
Write-Host "   huronportal-db" -ForegroundColor White
Write-Host ""

Write-Host "5️⃣  JWT_SECRET" -ForegroundColor Yellow
Write-Host "   V2lBN3pZbVIwWEx3MkRTQ2d0ajFReUp2ZXh1bGRzRTY=" -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Instructions:" -ForegroundColor Green
Write-Host "1. Allez dans votre repository GitHub" -ForegroundColor White
Write-Host "2. Settings → Secrets and variables → Actions" -ForegroundColor White
Write-Host "3. Cliquez sur 'New repository secret'" -ForegroundColor White
Write-Host "4. Ajoutez chacun des secrets ci-dessus" -ForegroundColor White
Write-Host ""

Write-Host "💾 Création du fichier .env.local..." -ForegroundColor Green

$envContent = @"
COSMOS_ENDPOINT=https://huronportal-cosmosdb.documents.azure.com:443/
COSMOS_KEY=$cosmosKey
COSMOS_DATABASE=huronportal-db
JWT_SECRET=V2lBN3pZbVIwWEx3MkRTQ2d0ajFReUp2ZXh1bGRzRTY=
"@

$envContent | Out-File -FilePath ".env.local" -Encoding utf8

Write-Host "✅ Fichier .env.local créé!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Prochaines étapes:" -ForegroundColor Green
Write-Host "1. Exécutez: npm run db:seed:admin" -ForegroundColor White
Write-Host "2. Exécutez: npm run db:seed:demo" -ForegroundColor White
Write-Host "3. Configurez les secrets GitHub (voir ci-dessus)" -ForegroundColor White
Write-Host "4. Poussez vers GitHub: git push origin main" -ForegroundColor White
Write-Host ""
