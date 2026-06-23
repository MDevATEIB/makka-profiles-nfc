# Guide de déploiement - Makka NFC Profiles

## 📋 Prérequis

- ✅ Node.js et npm installés
- ✅ Compte GitHub
- ✅ Projet Supabase configuré avec la base de données
- ✅ Git installé

## 🔧 Étape 1 : Configuration Supabase

### 1.1 Récupérer vos clés Supabase

1. Connectez-vous sur https://supabase.com
2. Ouvrez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** (ex: `https://xxxxxxxxxx.supabase.co`)
   - **anon public key** (commence par `eyJhbGciOi...`)

### 1.2 Modifier le fichier de configuration

Ouvrez `src/lib/supabase.js` et remplacez :

```javascript
const supabaseUrl = 'VOTRE_URL_SUPABASE';
const supabaseAnonKey = 'VOTRE_ANON_KEY_SUPABASE';
```

Par vos vraies valeurs :

```javascript
const supabaseUrl = 'https://xxxxxxxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 🚀 Étape 2 : Installation des dépendances

Ouvrez un terminal dans le dossier `makka-profiles-web` :

```bash
cd "C:\Users\HP\Makka NFC Studio\makka-profiles-web"
npm install
npm install -D gh-pages
```

## 🧪 Étape 3 : Test en local

Lancez l'application en mode développement :

```bash
npm start
```

L'application s'ouvrira sur `http://localhost:3000`

**Vérifiez que :**
- ✅ La page d'accueil s'affiche
- ✅ Le profil DEMO01 est visible
- ✅ Vous pouvez cliquer sur le profil et voir les détails
- ✅ Le compteur de vues s'incrémente

Si tout fonctionne, passez à l'étape suivante. Sinon, vérifiez la configuration Supabase.

## 📦 Étape 4 : Préparation pour GitHub Pages

### 4.1 Créer un repository sur GitHub

1. Allez sur https://github.com
2. Cliquez sur **New repository**
3. Nom du repository : `makka-profiles`
4. Sélectionnez **Public**
5. **NE COCHEZ PAS** "Initialize with README"
6. Cliquez sur **Create repository**

### 4.2 Configurer le package.json

Ouvrez `package.json` et remplacez `USERNAME` par votre nom d'utilisateur GitHub :

```json
"homepage": "https://VOTRE_USERNAME_GITHUB.github.io/makka-profiles"
```

Exemple : Si votre username est `ateibdev`, mettez :
```json
"homepage": "https://ateibdev.github.io/makka-profiles"
```

## 🌐 Étape 5 : Déploiement sur GitHub Pages

### 5.1 Initialiser Git

Dans le terminal (toujours dans le dossier `makka-profiles-web`) :

```bash
git init
git add .
git commit -m "Initial commit - Makka NFC Profiles Web App"
```

### 5.2 Connecter au repository GitHub

Remplacez `VOTRE_USERNAME_GITHUB` par votre vrai username :

```bash
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME_GITHUB/makka-profiles.git
git push -u origin main
```

Si GitHub vous demande de vous authentifier, suivez les instructions.

### 5.3 Déployer sur GitHub Pages

```bash
npm run deploy
```

Cette commande va :
1. Compiler l'application (build)
2. Créer une branche `gh-pages`
3. Pousser le build sur cette branche
4. GitHub Pages va automatiquement déployer

**Patience :** Le déploiement peut prendre 1-2 minutes.

### 5.4 Activer GitHub Pages (si nécessaire)

Si le site ne s'affiche pas après quelques minutes :

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings**
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous **Source**, sélectionnez la branche `gh-pages`
5. Cliquez sur **Save**

## ✅ Étape 6 : Vérification

Votre site est maintenant en ligne sur :

```
https://VOTRE_USERNAME_GITHUB.github.io/makka-profiles/
```

**Testez :**
- Page d'accueil : `https://VOTRE_USERNAME_GITHUB.github.io/makka-profiles/`
- Profil DEMO01 : `https://VOTRE_USERNAME_GITHUB.github.io/makka-profiles/p/DEMO01`

## 🔄 Mises à jour futures

Chaque fois que vous modifiez le code :

```bash
# 1. Commiter les changements
git add .
git commit -m "Description des changements"
git push

# 2. Redéployer
npm run deploy
```

## 📱 Étape 7 : Prochaine étape - App Mobile

Maintenant que l'application web est déployée, vous pouvez créer l'app mobile React Native pour :

1. **Créer de nouveaux profils**
   - Formulaire avec tous les champs
   - Upload de photo vers Supabase Storage
   - Génération automatique du `profile_id`

2. **Écrire sur les tags NFC**
   - Lire le NFC UID du tag
   - Écrire l'URL du profil : `https://USERNAME.github.io/makka-profiles/p/PROFILE_ID`
   - Stocker le NFC UID dans la base de données

3. **Gérer les profils**
   - Liste des profils créés
   - Édition des informations
   - Statistiques de vues

## 🐛 Résolution de problèmes

### Erreur : "gh-pages: command not found"
```bash
npm install -D gh-pages
```

### Erreur : "Failed to get remote.origin.url"
```bash
git remote add origin https://github.com/USERNAME/makka-profiles.git
```

### Erreur 404 sur GitHub Pages
- Vérifiez que `homepage` dans `package.json` correspond à l'URL GitHub Pages
- Attendez 2-3 minutes après le déploiement
- Videz le cache du navigateur (Ctrl + Shift + R)

### Les profils ne s'affichent pas
- Vérifiez que les clés Supabase sont correctes dans `src/lib/supabase.js`
- Vérifiez que la table `profiles` contient des données
- Vérifiez les politiques RLS dans Supabase (lecture publique activée)

## 📧 Support

Pour toute question, contactez :
**Ateib Abakar Bachar** - MakkaDev
