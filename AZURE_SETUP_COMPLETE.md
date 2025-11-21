# Configuration finale pour GitHub Actions

## ✅ Ressources Azure créées avec succès !

- **Resource Group** : huronportal-rg
- **Cosmos DB** : huronportal-cosmosdb
- **App Service Plan** : huronportal-plan (Basic B1)
- **Web App** : huronportal-app
- **URL** : https://huronportal-app.azurewebsites.net

## 📋 Prochaines étapes

### 1. Configurer les secrets GitHub

Allez dans votre repository GitHub :
1. **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **New repository secret**
3. Ajoutez ces secrets :

#### Secret 1 : AZURE_WEBAPP_PUBLISH_PROFILE
```
Copiez TOUT le contenu du fichier publish-profile.xml
(le fichier a été créé dans le répertoire du projet)
```

#### Secret 2 : COSMOS_ENDPOINT
```
https://huronportal-cosmosdb.documents.azure.com:443/
```

#### Secret 3 : COSMOS_KEY
```
<Votre clé Cosmos DB - récupérez-la avec: az cosmosdb keys list --name huronportal-cosmosdb --resource-group huronportal-rg --query primaryMasterKey -o tsv>
```

#### Secret 4 : COSMOS_DATABASE
```
huronportal-db
```

#### Secret 5 : JWT_SECRET
```
V2lBN3pZbVIwWEx3MkRTQ2d0ajFReUp2ZXh1bGRzRTY=
```

### 2. Initialiser la base de données

Créez un fichier `.env.local` avec ces valeurs :
```env
COSMOS_ENDPOINT=https://huronportal-cosmosdb.documents.azure.com:443/
COSMOS_KEY=<votre_cle_cosmos_db>
COSMOS_DATABASE=huronportal-db
JWT_SECRET=<votre_jwt_secret>
```

Puis exécutez :
```bash
npm run db:seed:admin
npm run db:seed:demo
```

### 3. Activer le firewall Cosmos DB pour Azure

Pour permettre à votre App Service d'accéder à Cosmos DB :
```bash
az cosmosdb update --name huronportal-cosmosdb --resource-group huronportal-rg --enable-public-network true
```

Ou via le portail Azure :
1. Allez dans **Cosmos DB** → **huronportal-cosmosdb**
2. **Settings** → **Networking**
3. Cochez **Allow access from Azure services**

### 4. Pousser vers GitHub

```bash
git add .
git commit -m "Configure Azure deployment with GitHub Actions"
git push origin main
```

Le déploiement démarrera automatiquement via GitHub Actions !

### 5. Vérifier le déploiement

- Surveillez dans **Actions** sur GitHub
- Accédez à : https://huronportal-app.azurewebsites.net
- Connectez-vous avec :
  - **Username** : admin
  - **Password** : Admin123!

## 🔧 Commandes utiles

### Voir les logs en temps réel
```bash
az webapp log tail --name huronportal-app --resource-group huronportal-rg
```

### Redémarrer l'application
```bash
az webapp restart --name huronportal-app --resource-group huronportal-rg
```

### Ouvrir dans le navigateur
```bash
az webapp browse --name huronportal-app --resource-group huronportal-rg
```

## 📝 Notes importantes

- Le profil de publication contient des informations sensibles - **NE PAS** le commiter dans Git
- Le fichier `.env.local` est déjà dans `.gitignore`
- Les secrets GitHub sont chiffrés et sécurisés
- Le plan Basic B1 coûte environ 13 CAD/mois
- Cosmos DB Free Tier (400 RU/s) est gratuit

## 🆘 Dépannage

Si l'application ne démarre pas :
1. Vérifiez les logs : `az webapp log tail --name huronportal-app --resource-group huronportal-rg`
2. Vérifiez que Cosmos DB autorise les connexions Azure
3. Redémarrez l'app : `az webapp restart --name huronportal-app --resource-group huronportal-rg`

Pour plus d'aide, consultez DEPLOYMENT.md
