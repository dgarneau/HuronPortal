# Configuration automatique des secrets GitHub

## Instructions pas à pas

### Étape 1 : Ouvrir votre repository GitHub
1. Ouvrez votre navigateur
2. Allez sur : https://github.com/VOTRE-USERNAME/VOTRE-REPO
3. Cliquez sur **Settings** (onglet en haut)
4. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**

### Étape 2 : Ajouter les secrets

Pour chaque secret ci-dessous, cliquez sur **New repository secret**, entrez le nom et la valeur, puis cliquez sur **Add secret**.

---

## Secret #1
**Name:** `AZURE_WEBAPP_PUBLISH_PROFILE`

**Value:** Ouvrez le fichier `publish-profile.xml` dans ce projet et copiez TOUT son contenu.

---

## Secret #2
**Name:** `COSMOS_ENDPOINT`

**Value:**
```
https://huronportal-cosmosdb.documents.azure.com:443/
```

---

## Secret #3
**Name:** `COSMOS_KEY`

**Value:**
```
Utilisez: az cosmosdb keys list --name huronportal-cosmosdb --resource-group huronportal-rg --query primaryMasterKey -o tsv
```

---

## Secret #4
**Name:** `COSMOS_DATABASE`

**Value:**
```
huronportal-db
```

---

## Secret #5
**Name:** `JWT_SECRET`

**Value:**
```
V2lBN3pZbVIwWEx3MkRTQ2d0ajFReUp2ZXh1bGRzRTY=
```

---

## Vérification

Une fois tous les secrets ajoutés, vous devriez voir ces 5 secrets dans la liste :
- ✅ AZURE_WEBAPP_PUBLISH_PROFILE
- ✅ COSMOS_ENDPOINT
- ✅ COSMOS_KEY
- ✅ COSMOS_DATABASE
- ✅ JWT_SECRET

## Prêt à déployer !

Maintenant, exécutez ces commandes pour pousser vers GitHub :

```bash
git add .
git commit -m "Add Azure deployment configuration"
git push origin main
```

Le déploiement démarrera automatiquement dans l'onglet **Actions** de votre repository !
