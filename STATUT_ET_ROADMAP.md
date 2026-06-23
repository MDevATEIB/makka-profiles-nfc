# 📊 STATUT ACTUEL & ROADMAP - Makka NFC Profiles

**Date**: 23 juin 2026  
**Développeur**: Ateib Abakar Bachar - MakkaDev  
**Projet**: Makka NFC Profiles (Web App + Mobile App)

---

## 🎯 VISION DU PROJET

Créer un système complet de cartes de visite numériques NFC avec :
- **App Web** : Affichage public des profils professionnels (hébergé sur GitHub Pages)
- **App Mobile** : Création de profils et programmation de tags NFC (Android)
- **Backend** : Supabase (base de données + storage)
- **Tags NFC** : MIFARE Classic 13.56 MHz avec URL NDEF

---

## ✅ PHASE 1 : WEB APP - **EN COURS (95% COMPLÉTÉ)**

### 🟢 Réalisations
1. ✅ **Projet React créé** (`makka-profiles-web`)
2. ✅ **Architecture complète**
   - React 18.2.0
   - React Router DOM 7.18.0
   - Tailwind CSS 3.4.1 (downgrade depuis v4 pour éviter erreur PostCSS)
   - Lucide React 1.21.0 (icônes)
   - qrcode.react 4.2.0 (QR codes)
   
3. ✅ **Backend Supabase configuré**
   - Projet créé avec clés récupérées
   - Table `profiles` créée avec tous les champs
   - Storage bucket `profile-photos` (public)
   - Fonctions SQL : `generate_profile_id()`, `increment_profile_views()`, `update_updated_at_column()`
   - Row Level Security avec politiques publiques
   - Profil de test DEMO01 créé (Ateib Abakar Bachar)

4. ✅ **Pages développées**
   - `HomePage.jsx` : Liste des profils + recherche
   - `ProfilePage.jsx` : Affichage détaillé + QR code + vCard + partage
   - `NotFoundPage.jsx` : Page 404
   - `LoadingSpinner.jsx` : Composant de chargement
   - `ProfileCard.jsx` : Carte de profil réutilisable

5. ✅ **Fonctionnalités implémentées**
   - Affichage de tous les profils
   - Recherche par nom/entreprise/titre
   - Page de profil complète avec toutes les infos
   - Génération de QR Code (URL du profil)
   - Téléchargement vCard (.vcf)
   - Partage de profil (Web Share API + fallback)
   - Compteur de vues (incrémentation automatique)
   - Liens réseaux sociaux avec icônes SVG personnalisées
   - Design responsive moderne

6. ✅ **Corrections appliquées**
   - Import QRCode corrigé : `import { QRCodeSVG } from 'qrcode.react'`
   - Icônes réseaux sociaux (Facebook, LinkedIn, Twitter, Instagram, GitHub) remplacées par SVG personnalisés (lucide-react ne les contient pas)
   - Configuration Tailwind CSS v3 stable

### 🟡 Configuration en attente
- ⚠️ **Vérifier les clés Supabase** dans `src/lib/supabase.js`
  - URL actuelle : `https://vfztcqpiehtdiycnwgsq.supabase.co`
  - Anon key actuelle : `sb_publishable_AAeM8hZe2mcFX1XaDJ59QQ_iu4qAQ_f`
  - À confirmer depuis le dashboard Supabase

### 🔴 Tests à effectuer
1. **Démarrer l'app localement**
   ```bash
   cd "c:\Users\HP\Makka NFC Studio\makka-profiles-web"
   npm start
   ```

2. **Tester HomePage** (http://localhost:3000)
   - [ ] Liste des profils s'affiche
   - [ ] Profil DEMO01 visible
   - [ ] Recherche fonctionne
   - [ ] Clic sur profil redirige correctement

3. **Tester ProfilePage** (http://localhost:3000/p/DEMO01)
   - [ ] Profil s'affiche
   - [ ] Photo, nom, titre, entreprise visibles
   - [ ] Icônes contact (email, téléphone, site web, localisation)
   - [ ] Icônes réseaux sociaux SVG
   - [ ] Bouton "Télécharger vCard" → Download .vcf
   - [ ] Bouton "Partager" → Copie URL ou Web Share
   - [ ] Bouton "Afficher QR Code" → QR Code SVG
   - [ ] Compteur de vues s'incrémente

4. **Tester les imports corrigés**
   - [ ] Aucune erreur de compilation
   - [ ] QRCodeSVG s'affiche correctement
   - [ ] Icônes réseaux sociaux SVG s'affichent

### 🚀 Déploiement (à faire après tests)
1. Créer repository GitHub `makka-profiles`
2. Modifier `package.json` → `"homepage": "https://USERNAME.github.io/makka-profiles"`
3. Initialiser Git et pousser
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Makka NFC Profiles Web"
   git branch -M main
   git remote add origin https://github.com/USERNAME/makka-profiles.git
   git push -u origin main
   ```
4. Déployer sur GitHub Pages
   ```bash
   npm run deploy
   ```
5. Attendre 2-3 minutes et visiter `https://USERNAME.github.io/makka-profiles`

---

## 🔵 PHASE 2 : APP MOBILE - **À DÉMARRER**

### 📱 Spécifications techniques

#### Stack
```json
{
  "framework": "React Native (Expo SDK 51)",
  "language": "TypeScript",
  "routing": "Expo Router (file-based)",
  "nfc": "react-native-nfc-manager@3.17.2",
  "backend": "Supabase (même instance que web)",
  "image-picker": "expo-image-picker",
  "icons": "@expo/vector-icons (Ionicons)",
  "platform": "Android uniquement (NFC MIFARE Classic)"
}
```

#### Architecture
```
makka-nfc-mobile-profiles/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # 🏠 Home (liste profils)
│   │   ├── scan.tsx            # 📡 Scan NFC
│   │   ├── stats.tsx           # 📊 Statistiques
│   │   └── settings.tsx        # ⚙️ Paramètres
│   ├── profile/
│   │   ├── [id].tsx            # 📄 Détail profil
│   │   └── edit/[id].tsx       # ✏️ Edition
│   ├── create.tsx              # ➕ Créer profil
│   └── write-nfc/[id].tsx      # 📡 Écrire NFC
├── components/
├── lib/
└── constants/
```

### 🎨 Écrans à développer

#### 1. 🏠 HomeScreen (index.tsx)
**Fonctionnalités :**
- Liste de tous les profils créés (FlatList)
- Recherche de profils
- Tri par date/vues
- FAB "+" pour créer un nouveau profil
- Badge NFC sur profils programmés

**Composants :**
```tsx
<FlatList
  data={profiles}
  renderItem={({ item }) => <ProfileCard profile={item} />}
  ListEmptyComponent={<EmptyState />}
/>
```

#### 2. ➕ CreateProfileScreen (create.tsx)
**Formulaire complet :**
- Photo (expo-image-picker)
- Prénom * (obligatoire)
- Nom * (obligatoire)
- Titre professionnel
- Entreprise
- Email (validation format)
- Téléphone (validation format)
- Site web (validation URL)
- Localisation
- Biographie (textarea)
- Réseaux sociaux (Facebook, LinkedIn, Twitter, Instagram, GitHub)

**Actions :**
1. Validation des champs
2. Upload photo → Supabase Storage
3. Génération `profile_id` automatique
4. Insert dans table `profiles`
5. Retour à HomeScreen
6. (Option) Redirection vers WriteNFCScreen

#### 3. 📄 ProfileDetailScreen (profile/[id].tsx)
**Affichage :**
- Photo en plein écran
- Toutes les informations
- QR Code du profil web
- Stats : vues, date création, tag NFC

**Actions :**
- ✏️ Éditer → EditProfileScreen
- 📡 Programmer NFC → WriteNFCScreen
- 🌐 Voir en ligne → Browser
- 🔗 Partager → Share API
- 🗑️ Supprimer → Confirmation

#### 4. ✏️ EditProfileScreen (profile/edit/[id].tsx)
- Même formulaire que CreateProfileScreen
- Champs pré-remplis
- Possibilité de changer photo
- Mise à jour dans Supabase
- Retour à ProfileDetailScreen

#### 5. 📡 WriteNFCScreen (write-nfc/[id].tsx)
**Processus NFC :**
1. Vérifier NFC activé
2. Démarrer session NFC (`NfcManager.requestTechnology`)
3. Attendre détection tag
4. Lire NFC UID
5. Créer message NDEF avec URL
   ```javascript
   const url = `https://USERNAME.github.io/makka-profiles/p/${profileId}`;
   const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
   ```
6. Écrire sur tag (`writeNdefMessage`)
7. Associer `nfc_uid` au profil dans Supabase
8. Message de succès
9. Retour à ProfileDetailScreen

**UI :**
```
┌─────────────────────────────────┐
│       [NFC Icon Animation]      │
│                                 │
│   Approchez le tag NFC du       │
│   dos de votre téléphone        │
│                                 │
│   Profil : Jean Dupont          │
│   URL : github.io/.../PROF001   │
│                                 │
│   [Animation d'attente...]      │
│                                 │
│   [  Annuler  ]                 │
└─────────────────────────────────┘
```

#### 6. 📡 ScanNFCScreen (scan.tsx)
**Fonctionnalités :**
- Démarrer scan NFC
- Lire tag NFC NDEF
- Extraire URL du profil
- Afficher aperçu du profil
- Boutons : Voir profil, Partager

**Processus :**
1. `NfcManager.requestTechnology(NfcTech.Ndef)`
2. `NfcManager.getTag()`
3. `Ndef.uri.decodePayload(record.payload)`
4. Extraire `profile_id` de l'URL
5. Fetch profil depuis Supabase
6. Afficher ou ouvrir dans browser

#### 7. 📊 StatsScreen (stats.tsx)
**Métriques :**
- Nombre total de profils créés
- Total de vues (sum de tous les profils)
- Profil le plus vu
- Graphique vues/semaine (optionnel)
- Liste profils triés par vues

**Requête Supabase :**
```javascript
const { data } = await supabase
  .from('profiles')
  .select('profile_id, first_name, last_name, views_count')
  .order('views_count', { ascending: false });
```

#### 8. ⚙️ SettingsScreen (settings.tsx)
**Options :**
- Vérifier permissions NFC
- À propos
- Version de l'app
- Conditions d'utilisation
- Politique de confidentialité
- Support / Contact

### 🛠️ Intégrations techniques

#### Supabase (lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'MÊME_URL_QUE_WEB';
const supabaseAnonKey = 'MÊME_KEY_QUE_WEB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction upload photo
export async function uploadPhoto(file: any, profileId: string) {
  const fileName = `${profileId}-${Date.now()}.jpg`;
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file);
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName);
  
  return urlData.publicUrl;
}
```

#### NFC Manager (lib/nfc.ts)
```typescript
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Initialisation
export async function initNFC() {
  await NfcManager.start();
}

// Écrire sur tag
export async function writeNFC(profileId: string) {
  const url = `https://USERNAME.github.io/makka-profiles/p/${profileId}`;
  
  await NfcManager.requestTechnology(NfcTech.Ndef);
  
  const tag = await NfcManager.getTag();
  const nfcUid = tag.id;
  
  const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);
  await NfcManager.ndefHandler.writeNdefMessage(bytes);
  
  NfcManager.cancelTechnologyRequest();
  
  return nfcUid;
}

// Lire tag
export async function readNFC() {
  await NfcManager.requestTechnology(NfcTech.Ndef);
  
  const tag = await NfcManager.getTag();
  const ndefMessage = tag.ndefMessage;
  
  if (ndefMessage && ndefMessage[0]) {
    const record = ndefMessage[0];
    const url = Ndef.uri.decodePayload(record.payload);
    const profileId = url.split('/').pop();
    
    NfcManager.cancelTechnologyRequest();
    return profileId;
  }
}
```

#### Image Picker
```typescript
import * as ImagePicker from 'expo-image-picker';

export async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission refusée');
    return null;
  }
  
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  
  if (!result.canceled) {
    return result.assets[0];
  }
  
  return null;
}
```

### 📋 Configuration Android

#### AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.NFC" />
<uses-feature android:name="android.hardware.nfc" android:required="true" />

<intent-filter>
  <action android:name="android.nfc.action.NDEF_DISCOVERED"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <data android:scheme="https"/>
</intent-filter>
```

#### app.json
```json
{
  "expo": {
    "name": "Makka NFC Profiles",
    "slug": "makka-nfc-profiles",
    "version": "1.0.0",
    "platforms": ["android"],
    "android": {
      "package": "com.makkadev.nfcprofiles",
      "permissions": [
        "android.permission.NFC",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon-foreground.png",
        "backgroundImage": "./assets/adaptive-icon-background.png",
        "monochromeImage": "./assets/adaptive-icon-monochrome.png",
        "backgroundColor": "#1e40af"
      }
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "L'application a besoin d'accéder à vos photos.",
          "cameraPermission": "L'application a besoin d'accéder à votre caméra."
        }
      ]
    ]
  }
}
```

### 🎨 Design System

#### Couleurs (constants/colors.ts)
```typescript
export const colors = {
  primary: '#1e40af',      // blue-800
  secondary: '#3b82f6',    // blue-500
  accent: '#10b981',       // green-500
  warning: '#f59e0b',      // orange-500
  error: '#ef4444',        // red-500
  background: '#f3f4f6',   // gray-50
  surface: '#ffffff',      // white
  text: '#111827',         // gray-900
  textSecondary: '#6b7280' // gray-600
};
```

#### Composants UI (à créer)
- `Button.tsx` (primaire, secondaire, outline)
- `Input.tsx` (text, email, phone, url)
- `Card.tsx` (profil, stats)
- `Avatar.tsx` (photo profil)
- `Badge.tsx` (NFC, vues)
- `LoadingSpinner.tsx`
- `EmptyState.tsx`

---

## 🚀 ROADMAP DÉTAILLÉE

### 🟢 Semaine 1 : Finaliser Web App + Setup Mobile
**Web App :**
- [x] Corriger toutes les erreurs d'import
- [ ] Tester localement (all features)
- [ ] Configurer GitHub repository
- [ ] Déployer sur GitHub Pages
- [ ] Tester le profil DEMO01 en production

**Mobile App :**
- [ ] Créer projet Expo SDK 51
  ```bash
  cd "C:\Users\HP\Makka NFC Studio"
  npx create-expo-app makka-nfc-mobile-profiles --template blank-typescript
  ```
- [ ] Installer dépendances
  ```bash
  npm install @supabase/supabase-js react-native-nfc-manager
  npx expo install expo-image-picker expo-router
  ```
- [ ] Configurer Supabase (même clés que web)
- [ ] Configurer NFC (AndroidManifest.xml)
- [ ] Créer structure de navigation (Expo Router)
- [ ] Créer constants/colors.ts
- [ ] Setup design system

### 🟡 Semaine 2 : CRUD Profils (Mobile)
- [ ] HomeScreen : Liste des profils
- [ ] ProfileCard component
- [ ] CreateProfileScreen : Formulaire complet
- [ ] Validation des champs
- [ ] Image Picker : Sélection photo
- [ ] Upload photo vers Supabase Storage
- [ ] Insertion profil dans base de données
- [ ] ProfileDetailScreen : Affichage complet
- [ ] EditProfileScreen : Édition profil
- [ ] Suppression de profil (avec confirmation)

### 🟠 Semaine 3 : NFC (Mobile)
- [ ] InitNFC dans App.tsx
- [ ] WriteNFCScreen : Interface
- [ ] Écriture NDEF sur tag
- [ ] Lecture NFC UID
- [ ] Association NFC UID ↔ Profil (Supabase)
- [ ] ScanNFCScreen : Interface
- [ ] Lecture tag NFC
- [ ] Extraction URL et profil_id
- [ ] Affichage profil scanné
- [ ] Gestion erreurs NFC (désactivé, tag RO, etc.)

### 🔵 Semaine 4 : Features Avancées + Tests
**Features :**
- [ ] StatsScreen : Métriques et graphiques
- [ ] SettingsScreen : Paramètres
- [ ] Partage de profils (Share API)
- [ ] QR Code dans app mobile
- [ ] Recherche dans HomeScreen
- [ ] Tri des profils (date, vues)
- [ ] Animations et transitions
- [ ] Empty states
- [ ] Loading states

**Tests :**
- [ ] Tests création profil complet
- [ ] Tests upload photo
- [ ] Tests écriture NFC sur tags physiques
- [ ] Tests lecture NFC
- [ ] Tests scan → web → affichage profil
- [ ] Tests incrémentation compteur vues
- [ ] Tests édition/suppression

### 🟣 Semaine 5 : Build + Documentation
- [ ] Build APK de test
  ```bash
  eas build --platform android --profile preview
  ```
- [ ] Tests sur appareil physique réel
- [ ] Corrections bugs
- [ ] Build APK de production
- [ ] Documentation utilisateur (FR)
- [ ] Documentation technique
- [ ] Vidéo de démonstration
- [ ] Publication (Play Store optionnel)

---

## 📊 RÉCAPITULATIF DES TECHNOLOGIES

### Web App (makka-profiles-web)
| Composant | Technologie | Version | Statut |
|-----------|-------------|---------|--------|
| Framework | React | 18.2.0 | ✅ |
| Routing | React Router DOM | 7.18.0 | ✅ |
| Styling | Tailwind CSS | 3.4.1 | ✅ |
| Icons | Lucide React | 1.21.0 | ✅ |
| QR Code | qrcode.react | 4.2.0 | ✅ |
| Backend | Supabase | 2.108.2 | ✅ |
| Hosting | GitHub Pages | - | 🔴 À faire |

### Mobile App (makka-nfc-mobile-profiles)
| Composant | Technologie | Version | Statut |
|-----------|-------------|---------|--------|
| Framework | React Native | 0.74.5 | 🔴 À créer |
| Platform | Expo | SDK 51 | 🔴 À créer |
| Language | TypeScript | 5.x | 🔴 À créer |
| Routing | Expo Router | latest | 🔴 À créer |
| NFC | react-native-nfc-manager | 3.17.2 | 🔴 À créer |
| Image | expo-image-picker | ~15.0.7 | 🔴 À créer |
| Icons | @expo/vector-icons | latest | 🔴 À créer |
| Backend | Supabase | 2.108.2 | 🔴 À créer |
| Build | EAS Build | latest | 🔴 À faire |

### Backend (Supabase)
| Composant | Statut |
|-----------|--------|
| Projet créé | ✅ |
| Table `profiles` | ✅ |
| Storage `profile-photos` | ✅ |
| Row Level Security | ✅ |
| Fonctions SQL | ✅ |
| Profil test DEMO01 | ✅ |

---

## 🎯 OBJECTIFS MESURABLES

### Court terme (2 semaines)
- [ ] Web app déployée sur GitHub Pages
- [ ] Mobile app avec CRUD profils fonctionnel
- [ ] 1er profil créé depuis mobile app
- [ ] 1ère photo uploadée vers Supabase

### Moyen terme (1 mois)
- [ ] Mobile app avec NFC fonctionnel
- [ ] 10 profils créés et testés
- [ ] 10 tags NFC programmés
- [ ] Tests complets : scan NFC → web
- [ ] Build APK de production

### Long terme (2 mois)
- [ ] 100+ profils actifs
- [ ] App mobile sur Play Store (optionnel)
- [ ] Statistiques d'usage collectées
- [ ] Feedback utilisateurs
- [ ] V2 avec features avancées

---

## 🐛 PROBLÈMES CONNUS ET RÉSOLUS

### ✅ Résolus
1. **Erreur PostCSS avec Tailwind v4**
   - Problème : `tailwindcss` v4 nécessite `@tailwindcss/postcss`
   - Solution : Downgrade vers v3.4.1

2. **Import QRCode incorrect**
   - Problème : `import QRCode from 'qrcode.react'` (export default inexistant)
   - Solution : `import { QRCodeSVG } from 'qrcode.react'`

3. **Icônes réseaux sociaux manquantes**
   - Problème : Facebook, Twitter, LinkedIn, Instagram, GitHub n'existent pas dans lucide-react
   - Solution : Créer des SVG personnalisés dans `getSocialIcon()`

### 🔴 À surveiller
1. **Clés Supabase**
   - Vérifier que les clés dans `src/lib/supabase.js` sont correctes
   - Tester la connexion à Supabase lors du 1er démarrage

2. **Compatibilité NFC**
   - Vérifier que les tags MIFARE Classic sont bien supportés
   - Tester sur plusieurs modèles de smartphones Android

3. **Permissions Android**
   - Vérifier que toutes les permissions sont accordées
   - Gérer les refus de permissions avec UX appropriée

---

## 📞 CONTACTS ET RESSOURCES

### Développeur
- **Nom** : Ateib Abakar Bachar
- **Entreprise** : MakkaDev
- **Rôle** : CEO & Fondateur, Développeur web/mobile & solutions métiers

### Liens utiles
- **Supabase** : https://supabase.com
- **GitHub Pages** : https://pages.github.com
- **Expo Documentation** : https://docs.expo.dev
- **React Native NFC Manager** : https://github.com/revtel/react-native-nfc-manager
- **NFC NDEF Format** : https://learn.adafruit.com/adafruit-pn532-rfid-nfc/ndef

### Fichiers de documentation
- `README.md` : Vue d'ensemble du projet web
- `QUICK_START.md` : Démarrage rapide (5 étapes)
- `DEPLOYMENT.md` : Guide de déploiement complet
- `MOBILE_APP_PLAN.md` : Plan détaillé de l'app mobile
- `FIXES_APPLIED.md` : Corrections appliquées
- `STATUT_ET_ROADMAP.md` : Ce fichier (statut + roadmap)

---

## ✨ PROCHAINE ACTION IMMÉDIATE

### 🚀 À FAIRE MAINTENANT :

1. **Tester la web app localement**
   ```bash
   cd "c:\Users\HP\Makka NFC Studio\makka-profiles-web"
   npm start
   ```

2. **Vérifier que tout fonctionne**
   - HomePage s'affiche
   - Profil DEMO01 visible
   - Clic sur profil → ProfilePage
   - QR Code fonctionne
   - vCard download fonctionne
   - Partage fonctionne

3. **Si tout OK → Déployer sur GitHub Pages**
   - Créer repo `makka-profiles`
   - Modifier `homepage` dans package.json
   - `npm run deploy`

4. **Une fois web app déployée → Démarrer app mobile**
   ```bash
   cd "C:\Users\HP\Makka NFC Studio"
   npx create-expo-app makka-nfc-mobile-profiles --template blank-typescript
   ```

---

**Status Global** : 🟢 WEB APP 95% | 🔴 MOBILE APP 0% | 🟢 BACKEND 100%

**Prêt à tester la web app et démarrer le développement mobile !** 🚀

