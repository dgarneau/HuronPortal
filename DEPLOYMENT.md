# Guide de déploiement Azure avec GitHub Actions

## Prérequis
- Compte Azure actif
- Repository GitHub
- Azure CLI installé localement

## Étape 1 : Créer les ressources Azure

### 1.1 Créer le groupe de ressources (si pas déjà fait)
```bash
az group create --name huronportal-rg --location canadacentral
```

### 1.2 Créer Azure Cosmos DB (si pas déjà fait)
```bash
az cosmosdb create \
  --name huronportal-cosmosdb \
  --resource-group huronportal-rg \
  --locations regionName=canadacentral failoverPriority=0 \
  --default-consistency-level Session \
  --enable-free-tier true
```

### 1.3 Créer l'App Service Plan
```bash
az appservice plan create \
  --name huronportal-plan \
  --resource-group huronportal-rg \
  --location canadacentral \
  --sku B1 \
  --is-linux
```

### 1.4 Créer l'App Service (Web App)
```bash
az webapp create \
  --name huronportal-app \
  --resource-group huronportal-rg \
  --plan huronportal-plan \
  --runtime "NODE:20-lts"
```

### 1.5 Configurer la commande de démarrage
```bash
az webapp config set \
  --name huronportal-app \
  --resource-group huronportal-rg \
  --startup-file "node server.js"
```

### 1.6 Configurer les variables d'environnement sur Azure
```bash
# Récupérer les informations Cosmos DB
COSMOS_ENDPOINT=$(az cosmosdb show --name huronportal-cosmosdb --resource-group huronportal-rg --query documentEndpoint -o tsv)
COSMOS_KEY=$(az cosmosdb keys list --name huronportal-cosmosdb --resource-group huronportal-rg --query primaryMasterKey -o tsv)

# Configurer les variables d'environnement
az webapp config appsettings set \
  --name huronportal-app \
  --resource-group huronportal-rg \
  --settings \
    COSMOS_ENDPOINT="$COSMOS_ENDPOINT" \
    COSMOS_KEY="$COSMOS_KEY" \
    COSMOS_DATABASE="huronportal-db" \
    SESSION_SECRET="$(openssl rand -base64 32)" \
    SESSION_DURATION="3600" \
    NODE_ENV="production" \
    WEBSITE_NODE_DEFAULT_VERSION="20-lts"
```

### 1.7 Télécharger le profil de publication
```bash
az webapp deployment list-publishing-profiles \
  --name huronportal-app \
  --resource-group huronportal-rg \
  --xml > publish-profile.xml
```

## Étape 2 : Configurer les secrets GitHub

Allez dans votre repository GitHub :
1. **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **New repository secret**
3. Ajoutez les secrets suivants :

### Secrets requis :

#### `AZURE_WEBAPP_PUBLISH_PROFILE`
- Copiez tout le contenu du fichier `publish-profile.xml` téléchargé à l'étape 1.6

#### `COSMOS_ENDPOINT`
```bash
az cosmosdb show --name huronportal-cosmosdb --resource-group huronportal-rg --query documentEndpoint -o tsv
```

#### `COSMOS_KEY`
```bash
az cosmosdb keys list --name huronportal-cosmosdb --resource-group huronportal-rg --query primaryMasterKey -o tsv
```

#### `COSMOS_DATABASE`
```
huronportal-db
```

#### `SESSION_SECRET`
```bash
# Générer un secret sécurisé
openssl rand -base64 32
```

## Étape 3 : Initialiser la base de données

### 3.1 Configurer les variables d'environnement localement
Créez un fichier `.env.local` avec les valeurs Azure :
```bash
COSMOS_ENDPOINT=<votre_endpoint>
COSMOS_KEY=<votre_key>
COSMOS_DATABASE=huronportal-db
SESSION_SECRET=<votre_secret>
```

### 3.2 Exécuter les scripts de seed
```bash
npm run db:seed:admin
npm run db:seed:demo
```

## Étape 4 : Déployer via GitHub Actions

1. **Commitez et pushez vos changements** :
```bash
git add .
git commit -m "Configure Azure deployment with GitHub Actions"
git push origin main
```

2. **Surveillez le déploiement** :
   - Allez dans l'onglet **Actions** de votre repository GitHub
   - Le workflow `Deploy to Azure App Service` devrait démarrer automatiquement
   - Attendez que le déploiement soit terminé (🟢 vert)

3. **Accédez à votre application** :
```
https://huronportal-app.azurewebsites.net
```

## Étape 5 : Vérification

### 5.1 Vérifier les logs Azure
```bash
az webapp log tail --name huronportal-app --resource-group huronportal-rg
```

### 5.2 Tester l'application
1. Ouvrez `https://huronportal-app.azurewebsites.net/login`
2. Connectez-vous avec :
   - **Username/Email** : `admin` ou `admin@huronportal.com`
   - **Password** : `Admin123!` (ou celui défini dans `.env.local`)

## Commandes utiles

### Redémarrer l'application
```bash
az webapp restart --name huronportal-app --resource-group huronportal-rg
```

### Voir les logs en temps réel
```bash
az webapp log tail --name huronportal-app --resource-group huronportal-rg
```

### Mettre à jour une variable d'environnement
```bash
az webapp config appsettings set \
  --name huronportal-app \
  --resource-group huronportal-rg \
  --settings VARIABLE_NAME="nouvelle_valeur"
```

### Supprimer toutes les ressources
```bash
az group delete --name huronportal-rg --yes --no-wait
```

## Déploiements futurs

Une fois configuré, chaque push sur la branche `main` déclenchera automatiquement un déploiement sur Azure via GitHub Actions.

Pour déclencher un déploiement manuel :
1. Allez dans **Actions** sur GitHub
2. Sélectionnez **Deploy to Azure App Service**
3. Cliquez sur **Run workflow**
4. Choisissez la branche `main`
5. Cliquez sur **Run workflow**

## Troubleshooting

### L'application ne démarre pas
- Vérifiez les logs : `az webapp log tail --name huronportal-app --resource-group huronportal-rg`
- Vérifiez les variables d'environnement dans le portail Azure
- Assurez-vous que `NODE_ENV=production`

### Erreurs Cosmos DB
- Vérifiez que l'endpoint et la clé sont corrects
- Vérifiez que le firewall Cosmos DB autorise les connexions Azure
- Dans le portail Azure, allez dans Cosmos DB → Firewalls and virtual networks → Cochez "Allow access from Azure services"

### Erreurs de build
- Vérifiez que toutes les dépendances sont dans `package.json`
- Assurez-vous que le build local fonctionne : `npm run build`
- Vérifiez les logs GitHub Actions pour les messages d'erreur détaillés
