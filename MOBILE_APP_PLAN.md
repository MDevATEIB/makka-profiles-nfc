# 📱 Plan de l'Application Mobile - Makka NFC Profiles

## 🎯 Objectif

Créer une application mobile React Native (Expo) permettant de :
1. **Créer** des profils professionnels
2. **Gérer** les profils existants
3. **Programmer** des tags NFC avec les URLs des profils
4. **Scanner** des tags NFC pour ouvrir les profils

---

## 🏗️ Architecture technique

### Stack technologique
```
- Framework: React Native 0.74.5
- Platform: Expo SDK 51
- Backend: Supabase (même que l'app web)
- NFC: react-native-nfc-manager@3.17.2
- Navigation: react-navigation/native
- Upload: expo-image-picker
- Icons: @expo/vector-icons (Ionicons)
- Forms: react-hook-form (optionnel)
```

### Compatibilité
- ✅ **Android** : NFC fonctionnel avec tags MIFARE Classic 13.56MHz
- ❌ **iOS** : NFC limité (lecture seule depuis iOS 13, écriture depuis iOS 13+)
- 🎯 **Focus** : Android uniquement dans un premier temps

---

## 📱 Écrans de l'application

### 1. 🏠 Écran d'accueil (HomeScreen)
**Route** : `/`

**Fonctionnalités :**
- Liste de tous les profils créés depuis ce téléphone
- Recherche de profils
- Carte pour chaque profil avec :
  - Photo miniature
  - Nom complet
  - Entreprise
  - Nombre de vues
  - Tag NFC associé (icône)
- Bouton flottant "+" pour créer un nouveau profil
- Menu de navigation en bas

**Composants :**
- `FlatList` pour la liste
- `ProfileCard` (composant réutilisable)
- `FAB` (Floating Action Button)

---

### 2. ➕ Écran de création (CreateProfileScreen)
**Route** : `/create`

**Formulaire :**
```
┌─────────────────────────────────┐
│  [Photo] (tap to add)           │
├─────────────────────────────────┤
│  Prénom *                       │
│  [____________]                 │
│                                 │
│  Nom *                          │
│  [____________]                 │
│                                 │
│  Titre professionnel            │
│  [____________]                 │
│                                 │
│  Entreprise                     │
│  [____________]                 │
│                                 │
│  Email                          │
│  [____________]                 │
│                                 │
│  Téléphone                      │
│  [____________]                 │
│                                 │
│  Site web                       │
│  [____________]                 │
│                                 │
│  Localisation                   │
│  [____________]                 │
│                                 │
│  Biographie                     │
│  [____________________         │
│   ____________________]        │
│                                 │
│  ═══ Réseaux sociaux ═══       │
│  Facebook URL                   │
│  [____________]                 │
│                                 │
│  LinkedIn URL                   │
│  [____________]                 │
│                                 │
│  Twitter URL                    │
│  [____________]                 │
│                                 │
│  Instagram URL                  │
│  [____________]                 │
│                                 │
│  GitHub URL                     │
│  [____________]                 │
│                                 │
│  [  Créer le profil  ]          │
└─────────────────────────────────┘
```

**Actions :**
1. Sélection/prise de photo → `expo-image-picker`
2. Validation du formulaire
3. Upload de la photo vers Supabase Storage
4. Génération du `profile_id` (ex: PRO001, PRO002...)
5. Insertion dans la table `profiles`
6. Retour à l'écran d'accueil
7. (Optionnel) Proposition d'écrire sur un tag NFC

**Validation :**
- Prénom et Nom obligatoires
- Email : format email valide
- URLs : format URL valide
- Taille photo : max 5MB

---

### 3. ✏️ Écran d'édition (EditProfileScreen)
**Route** : `/edit/:profileId`

**Fonctionnalités :**
- Formulaire pré-rempli avec les données existantes
- Possibilité de changer la photo
- Mise à jour dans Supabase
- Bouton "Enregistrer"
- Bouton "Annuler"

**Note :** Même formulaire que CreateProfileScreen mais mode "édition"

---

### 4. 📄 Écran de détail (ProfileDetailScreen)
**Route** : `/profile/:profileId`

**Affichage :**
- Photo en plein écran en haut
- Toutes les informations du profil
- QR Code du profil web
- Statistiques :
  - Nombre de vues
  - Date de création
  - Tag NFC associé (si programmé)

**Actions :**
- **Éditer** → Aller vers EditProfileScreen
- **Programmer NFC** → Aller vers WriteNFCScreen
- **Partager** → Partager l'URL du profil web
- **Voir en ligne** → Ouvrir l'URL web dans le navigateur
- **Supprimer** → Confirmation puis suppression

---

### 5. 📡 Écran d'écriture NFC (WriteNFCScreen)
**Route** : `/write-nfc/:profileId`

**Interface :**
```
┌─────────────────────────────────┐
│                                 │
│       [NFC Icon Animation]      │
│                                 │
│   Approchez le tag NFC du       │
│   dos de votre téléphone        │
│                                 │
│   Profil : [Nom du profil]      │
│   URL : [URL raccourcie]        │
│                                 │
│   [Animation d'attente...]      │
│                                 │
│   [  Annuler  ]                 │
└─────────────────────────────────┘
```

**Processus :**
1. Vérifier que le NFC est activé sur le téléphone
2. Démarrer la session NFC
3. Attendre qu'un tag soit détecté
4. Lire le NFC UID du tag
5. Écrire l'URL du profil sur le tag (NDEF format)
6. Mettre à jour le champ `nfc_uid` dans Supabase
7. Afficher un message de succès
8. Retour à ProfileDetailScreen

**Format NDEF :**
```javascript
const url = `https://USERNAME.github.io/makka-profiles/p/${profileId}`;

// NDEF Record
{
  type: 'U', // URL
  payload: url
}
```

**Gestion d'erreurs :**
- NFC désactivé → Message + lien vers paramètres
- Tag en lecture seule → Message d'erreur
- Tag incompatible → Message d'erreur
- Échec d'écriture → Réessayer

---

### 6. 🔍 Écran de scan NFC (ScanNFCScreen)
**Route** : `/scan-nfc`

**Fonctionnalités :**
- Scanner un tag NFC
- Lire l'URL stockée
- Afficher les infos du profil associé
- Ouvrir le profil web
- Option : Ouvrir dans l'app si le profil existe localement

**Interface :**
```
┌─────────────────────────────────┐
│                                 │
│       [NFC Icon Animation]      │
│                                 │
│   Approchez un tag NFC pour     │
│   découvrir le profil           │
│                                 │
│   [Animation de scan...]        │
│                                 │
│   [  Annuler  ]                 │
└─────────────────────────────────┘
```

**Après détection :**
```
┌─────────────────────────────────┐
│  ✅ Tag détecté !                │
│                                 │
│  [Photo du profil]              │
│  [Nom complet]                  │
│  [Titre]                        │
│  [Entreprise]                   │
│                                 │
│  [  Voir le profil  ]           │
│  [  Partager  ]                 │
└─────────────────────────────────┘
```

---

### 7. 📊 Écran des statistiques (StatsScreen)
**Route** : `/stats`

**Affichage :**
- Nombre total de profils créés
- Nombre total de vues (tous profils)
- Profil le plus vu
- Graphique des vues par jour/semaine
- Liste des profils triés par vues

**Données depuis Supabase :**
```sql
-- Total vues
SELECT SUM(views_count) FROM profiles;

-- Profil le plus vu
SELECT * FROM profiles ORDER BY views_count DESC LIMIT 1;

-- Vues par profil
SELECT profile_id, first_name, last_name, views_count 
FROM profiles 
ORDER BY views_count DESC;
```

---

### 8. ⚙️ Écran des paramètres (SettingsScreen)
**Route** : `/settings`

**Options :**
- Compte Supabase (déconnexion si authentification ajoutée)
- Vérifier les permissions NFC
- Activer/désactiver les notifications
- À propos de l'application
- Version de l'application
- Conditions d'utilisation
- Politique de confidentialité

---

## 🧭 Navigation

### Bottom Tab Navigator (Principal)
```
┌────────┬────────┬────────┬────────┐
│  Home  │  Scan  │  Stats │ Params │
│   🏠   │   📡   │   📊   │   ⚙️   │
└────────┴────────┴────────┴────────┘
```

### Stack Navigator (Secondaire)
```
Home
  └─> CreateProfile
  └─> ProfileDetail
       └─> EditProfile
       └─> WriteNFC
```

---

## 🗄️ Intégration Supabase

### Configuration identique au web
```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'MEME_URL_QUE_WEB';
const supabaseAnonKey = 'MEME_KEY_QUE_WEB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Opérations CRUD

#### Créer un profil
```javascript
async function createProfile(profileData, photoFile) {
  // 1. Générer un profile_id unique
  const profileId = await generateProfileId();
  
  // 2. Upload photo si présente
  let photoUrl = null;
  if (photoFile) {
    photoUrl = await uploadPhoto(photoFile, profileId);
  }
  
  // 3. Insérer le profil
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      profile_id: profileId,
      ...profileData,
      photo_url: photoUrl
    })
    .select()
    .single();
    
  return data;
}
```

#### Lire les profils
```javascript
async function getMyProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
    
  return data;
}
```

#### Mettre à jour un profil
```javascript
async function updateProfile(profileId, updates, newPhoto) {
  // 1. Upload nouvelle photo si changée
  if (newPhoto) {
    updates.photo_url = await uploadPhoto(newPhoto, profileId);
  }
  
  // 2. Mise à jour
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('profile_id', profileId)
    .select()
    .single();
    
  return data;
}
```

#### Associer un tag NFC
```javascript
async function linkNFCTag(profileId, nfcUid) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ nfc_uid: nfcUid })
    .eq('profile_id', profileId)
    .select()
    .single();
    
  return data;
}
```

---

## 📡 Gestion du NFC

### Installation
```bash
npm install react-native-nfc-manager@3.17.2
```

### Configuration Android
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.NFC" />
<uses-feature android:name="android.hardware.nfc" android:required="true" />

<intent-filter>
  <action android:name="android.nfc.action.NDEF_DISCOVERED"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <data android:scheme="https"/>
</intent-filter>
```

### Initialisation
```javascript
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

// Dans App.js
async function initNFC() {
  try {
    await NfcManager.start();
    console.log('NFC activé');
  } catch (ex) {
    console.warn('NFC non supporté', ex);
  }
}
```

### Écrire sur un tag
```javascript
async function writeNFC(profileId) {
  try {
    // URL à écrire
    const url = `https://USERNAME.github.io/makka-profiles/p/${profileId}`;
    
    // Demander le NFC
    await NfcManager.requestTechnology(NfcTech.Ndef);
    
    // Lire le tag pour obtenir l'UID
    const tag = await NfcManager.getTag();
    const nfcUid = tag.id;
    
    // Créer le message NDEF
    const bytes = Ndef.encodeMessage([
      Ndef.uriRecord(url)
    ]);
    
    // Écrire sur le tag
    await NfcManager.ndefHandler.writeNdefMessage(bytes);
    
    // Mettre à jour Supabase
    await linkNFCTag(profileId, nfcUid);
    
    Alert.alert('Succès', 'Tag NFC programmé !');
    
  } catch (ex) {
    Alert.alert('Erreur', 'Impossible d\'écrire sur le tag');
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}
```

### Lire un tag
```javascript
async function readNFC() {
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    
    const tag = await NfcManager.getTag();
    const ndefMessage = tag.ndefMessage;
    
    if (ndefMessage && ndefMessage[0]) {
      const record = ndefMessage[0];
      const url = Ndef.uri.decodePayload(record.payload);
      
      // Extraire le profile_id de l'URL
      const profileId = url.split('/').pop();
      
      // Ouvrir le profil
      navigation.navigate('ProfileDetail', { profileId });
    }
    
  } catch (ex) {
    console.warn('Erreur lecture NFC', ex);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}
```

---

## 📸 Upload de photos

### Installation
```bash
npx expo install expo-image-picker
```

### Permissions (Android)
```json
// app.json
{
  "expo": {
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

### Utilisation
```javascript
import * as ImagePicker from 'expo-image-picker';

async function pickImage() {
  // Demander la permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert('Permission refusée');
    return;
  }
  
  // Choisir une image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  
  if (!result.canceled) {
    return result.assets[0];
  }
}

async function uploadPhoto(photo, profileId) {
  const fileName = `${profileId}-${Date.now()}.jpg`;
  
  // Créer FormData
  const formData = new FormData();
  formData.append('file', {
    uri: photo.uri,
    name: fileName,
    type: 'image/jpeg'
  });
  
  // Upload vers Supabase
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, formData);
    
  if (error) throw error;
  
  // Récupérer l'URL publique
  const { data: urlData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName);
    
  return urlData.publicUrl;
}
```

---

## 🎨 Design et UX

### Palette de couleurs (identique au web)
```javascript
// colors.js
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

### Composants UI réutilisables
- `Button` (primaire, secondaire, outline)
- `Input` (texte, email, téléphone, URL)
- `Card` (profil, stats)
- `Avatar` (photo profil)
- `Badge` (statut NFC, vues)
- `LoadingSpinner`
- `EmptyState`

---

## 🔐 Sécurité

### Permissions Android
```xml
<uses-permission android:name="android.permission.NFC" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

### Validation des données
- Validation côté client avant envoi
- Validation côté serveur (Supabase RLS)
- Sanitization des URLs
- Vérification des formats (email, téléphone, URL)
- Taille maximale des photos : 5MB

---

## 📦 Structure du projet mobile

```
makka-nfc-mobile-profiles/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # HomeScreen
│   │   ├── scan.tsx            # ScanNFCScreen
│   │   ├── stats.tsx           # StatsScreen
│   │   └── settings.tsx        # SettingsScreen
│   ├── profile/
│   │   ├── [id].tsx            # ProfileDetailScreen
│   │   └── edit/[id].tsx       # EditProfileScreen
│   ├── create.tsx              # CreateProfileScreen
│   └── write-nfc/[id].tsx      # WriteNFCScreen
├── components/
│   ├── ProfileCard.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Avatar.tsx
│   └── LoadingSpinner.tsx
├── lib/
│   ├── supabase.ts
│   ├── nfc.ts
│   └── utils.ts
├── constants/
│   └── colors.ts
├── app.json
└── package.json
```

---

## ✅ Checklist de développement

### Phase 1 : Setup
- [ ] Créer le projet Expo
- [ ] Installer les dépendances
- [ ] Configurer Supabase
- [ ] Configurer NFC
- [ ] Créer la structure de navigation

### Phase 2 : CRUD Profils
- [ ] Écran de liste (HomeScreen)
- [ ] Écran de création (CreateProfileScreen)
- [ ] Écran de détail (ProfileDetailScreen)
- [ ] Écran d'édition (EditProfileScreen)
- [ ] Upload de photos
- [ ] Suppression de profils

### Phase 3 : NFC
- [ ] Écriture sur tags NFC
- [ ] Lecture de tags NFC
- [ ] Gestion des erreurs NFC
- [ ] Association tag ↔ profil

### Phase 4 : Fonctionnalités avancées
- [ ] Statistiques
- [ ] Partage de profils
- [ ] QR Code
- [ ] Paramètres

### Phase 5 : Polish
- [ ] Design final
- [ ] Animations
- [ ] Tests avec vrais tags NFC
- [ ] Build APK
- [ ] Documentation

---

## 🚀 Commandes de démarrage

```bash
# Créer le projet
cd "C:\Users\HP\Makka NFC Studio"
npx create-expo-app makka-nfc-mobile-profiles --template blank-typescript

# Installer les dépendances
cd makka-nfc-mobile-profiles
npm install @supabase/supabase-js react-native-nfc-manager
npx expo install expo-image-picker expo-router @react-navigation/native

# Lancer en développement
npx expo start

# Build Android
npx expo run:android
```

---

**Prêt à développer l'app mobile !** 📱🚀

---

**MakkaDev** - Ateib Abakar Bachar
