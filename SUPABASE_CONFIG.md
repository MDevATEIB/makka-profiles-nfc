# Configuration Supabase

## ⚠️ IMPORTANT : Remplacer les clés Supabase

Avant de lancer l'application, vous devez remplacer les clés Supabase dans le fichier :

📁 **`src/lib/supabase.js`**

### Vos clés Supabase

Vous avez déjà créé le projet Supabase avec :
- ✅ Table `profiles` avec tous les champs
- ✅ Bucket storage `profile-photos`
- ✅ Politiques RLS configurées
- ✅ Fonctions SQL créées

Il vous faut maintenant :

1. Ouvrez votre projet sur https://supabase.com
2. Allez dans **Project Settings** > **API**
3. Copiez les valeurs suivantes :

### À copier depuis Supabase

```
Project URL : https://xxxxxxxxxx.supabase.co
anon public key : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### À modifier dans le code

Ouvrez **`src/lib/supabase.js`** et remplacez :

```javascript
// ❌ AVANT (valeurs par défaut)
const supabaseUrl = 'VOTRE_URL_SUPABASE';
const supabaseAnonKey = 'VOTRE_ANON_KEY_SUPABASE';

// ✅ APRÈS (vos vraies valeurs)
const supabaseUrl = 'https://xxxxxxxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## Vérification de la base de données

Votre base de données Supabase doit avoir :

### Table `profiles`
```sql
- id (uuid, primary key)
- profile_id (text, unique) - ex: DEMO01
- nfc_uid (text, nullable)
- first_name (text)
- last_name (text)
- title (text, nullable)
- company (text, nullable)
- bio (text, nullable)
- email (text, nullable)
- phone (text, nullable)
- website (text, nullable)
- location (text, nullable)
- photo_url (text, nullable)
- socials (jsonb, nullable)
- views_count (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)
```

### Storage Bucket `profile-photos`
- ✅ Public
- ✅ Politiques : lecture, upload, update, delete publiques
- ✅ Formats acceptés : JPG, PNG, WEBP

### Fonctions SQL
- `generate_profile_id()` - Génère un ID unique
- `increment_profile_views(p_profile_id text)` - Incrémente le compteur de vues
- `update_updated_at_column()` - Met à jour le timestamp

### Profil de test
```sql
INSERT INTO profiles (profile_id, first_name, last_name, title, company, email, phone, bio)
VALUES (
  'DEMO01',
  'Ateib',
  'Abakar Bachar',
  'CEO & Fondateur',
  'MakkaDev',
  'contact@makkadev.com',
  '+235 XX XX XX XX',
  'Développeur web/mobile & solutions métiers et Ingénieur logisticien.'
);
```

## Test de la connexion

Une fois les clés configurées, lancez :

```bash
npm start
```

L'application doit :
1. ✅ Se connecter à Supabase
2. ✅ Afficher le profil DEMO01 sur la page d'accueil
3. ✅ Permettre de cliquer et voir le détail du profil
4. ✅ Incrémenter le compteur de vues à chaque visite

## En cas d'erreur

### Erreur : "Invalid API key"
➡️ Vérifiez que vous avez bien copié la **anon public key** (pas la service_role key)

### Erreur : "Table profiles does not exist"
➡️ Exécutez le script SQL de création de table dans l'éditeur SQL Supabase

### Erreur : "permission denied for table profiles"
➡️ Vérifiez que les politiques RLS sont bien configurées (lecture publique activée)

### Aucun profil ne s'affiche
➡️ Vérifiez que le profil DEMO01 est bien inséré dans la table

## Prochaines étapes

Une fois l'application web fonctionnelle :
1. Déployer sur GitHub Pages
2. Créer l'app mobile React Native pour :
   - Créer de nouveaux profils
   - Uploader des photos
   - Écrire les URLs sur les tags NFC
