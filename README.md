# Makka NFC Profiles - Web App

Application web React pour afficher les profils professionnels NFC.

## 🚀 Configuration

### 1. Configurer Supabase

Ouvrez le fichier `src/lib/supabase.js` et remplacez les valeurs suivantes par vos vraies clés Supabase :

```javascript
const supabaseUrl = 'VOTRE_URL_SUPABASE';
const supabaseAnonKey = 'VOTRE_ANON_KEY_SUPABASE';
```

### 2. Installer les dépendances

```bash
npm install
npm install -D gh-pages
```

### 3. Lancer en développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Déploiement sur GitHub Pages

### 1. Configurer le repository

Dans `package.json`, remplacez `USERNAME` par votre nom d'utilisateur GitHub :

```json
"homepage": "https://USERNAME.github.io/makka-profiles"
```

### 2. Créer le repository sur GitHub

1. Allez sur GitHub et créez un nouveau repository nommé `makka-profiles`
2. Ne l'initialisez pas avec README, .gitignore ou LICENSE

### 3. Initialiser Git et pousser

```bash
git init
git add .
git commit -m "Initial commit - Makka NFC Profiles Web App"
git branch -M main
git remote add origin https://github.com/USERNAME/makka-profiles.git
git push -u origin main
```

### 4. Déployer sur GitHub Pages

```bash
npm run deploy
```

L'application sera déployée sur `https://USERNAME.github.io/makka-profiles`

## 🎨 Fonctionnalités

### Page d'accueil (`/`)
- Liste de tous les profils
- Recherche par nom, entreprise, titre
- Statistiques des profils
- Design responsive

### Page de profil (`/p/:profileId`)
- Affichage complet du profil
- Photo de profil
- Informations de contact (email, téléphone, site web, localisation)
- Réseaux sociaux
- Compteur de vues
- QR Code dynamique
- Téléchargement vCard (.vcf)
- Partage du profil

## 🛠️ Technologies utilisées

- **React 18** - Framework UI
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Supabase** - Backend (Base de données + Storage)
- **Lucide React** - Icônes
- **qrcode.react** - Génération de QR codes
- **GitHub Pages** - Hébergement

## 📁 Structure du projet

```
makka-profiles-web/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── LoadingSpinner.jsx
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🔗 URLs des profils

Les profils sont accessibles via : `https://USERNAME.github.io/makka-profiles/p/PROFILE_ID`

Exemple : `https://USERNAME.github.io/makka-profiles/p/DEMO01`

## 📱 Intégration avec l'app mobile

L'app mobile React Native permettra de :
1. Créer de nouveaux profils
2. Uploader des photos
3. Écrire l'URL du profil sur les tags NFC
4. Gérer les profils existants

## 👨‍💻 Développé par

**MakkaDev**  
Ateib Abakar Bachar - CEO & Fondateur  
Développeur web/mobile & solutions métiers

## 📄 Licence

ISC © 2024 MakkaDev
