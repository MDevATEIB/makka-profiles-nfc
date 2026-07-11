# 🧪 Guide de Test - Fonctionnalité Offline vCard

## 🎯 Objectif
Tester la fonctionnalité qui permet d'accéder aux profils **même sans connexion internet**.

---

## ⚙️ Préparation

### 1. Matériel nécessaire
- ✅ Smartphone Android avec NFC
- ✅ Tags NFC **NTAG215** ou **NTAG216** (PAS NTAG213 !)
- ✅ Connexion internet (pour la phase de préparation)

### 2. Installation

```bash
# Aller dans le dossier app
cd "C:\Users\HP\makka profil web\app-profile"

# Installer les dépendances
npm install

# Vérifier que ces packages sont installés :
# - @react-native-community/netinfo
# - @react-native-async-storage/async-storage
# - expo-sharing
```

### 3. Build de l'application

**Option A : Development Build (recommandé pour tester)**
```bash
npx expo run:android
```

**Option B : EAS Build**
```bash
eas build --platform android --profile preview
```

---

## 📝 Test 1 : Écriture du Tag avec vCard

### Étapes :
1. Ouvrir l'application MakkaNFC sur votre téléphone
2. Aller dans "Mes Profils"
3. Sélectionner un profil (ou en créer un nouveau)
4. Cliquer sur "Programmer NFC"
5. Approcher votre tag NFC du dos du téléphone
6. **Attendre le message de confirmation**

### ✅ Résultat attendu :
```
Tag NFC programmé avec succès !

UID: 04XXXXXXXXXXXXX
Technologie: android.nfc.tech.MifareUltralight

Processus:
1. ✅ Tag détecté
2. ✅ Tag formaté
3. ✅ URL écrite
4. ✅ vCard écrite (mode offline)
5. ✅ UID enregistré

📴 Ce tag fonctionne maintenant même sans connexion internet !
```

### ❌ Problèmes possibles :

#### Problème 1 : "Tag trop petit"
```
⚠️ La vCard n'a pas pu être écrite (tag trop petit).
Utilisez un tag NTAG215 ou NTAG216.
```
**Solution** : Votre tag est un NTAG213. Utilisez un NTAG215 ou NTAG216.

#### Problème 2 : "Tag déjà utilisé"
```
Ce tag NFC est déjà associé à un autre profil.
```
**Solution** : 
- Formater le tag via l'app (onglet "Scan" → bouton "Formater")
- OU utiliser un nouveau tag

---

## 📱 Test 2 : Scan AVEC Internet

### Étapes :
1. **Vérifier que votre téléphone a internet** (WiFi ou Data)
2. Approcher le tag du téléphone (comme pour un paiement NFC)
3. Le navigateur s'ouvre automatiquement
4. Le profil s'affiche

### ✅ Résultat attendu :
- Le profil s'affiche normalement
- **PAS de banner orange en haut**
- Tous les boutons fonctionnent (appel, email, réseaux sociaux)
- Bouton "Enregistrer dans les contacts" télécharge la vCard

### 🔍 Vérification technique (optionnel) :
1. Ouvrir les DevTools du navigateur (mode développeur)
2. Aller dans "Console"
3. Voir : `✅ Profile cached for offline access`
4. Aller dans "Application" → "Local Storage"
5. Voir la clé : `profile_cache_ABC123` (avec votre ID)

---

## 📴 Test 3 : Scan SANS Internet (Test Principal !)

### Étapes :
1. **Activer le Mode Avion** sur votre téléphone
   - ⚠️ Garder le NFC activé (désactiver uniquement WiFi et Data)
2. Approcher le tag du téléphone
3. Le navigateur tente de s'ouvrir
4. Observer le résultat

### ✅ Résultat attendu :

**Si le profil a déjà été vu avec internet (cache existant) :**
```
📱 Le profil s'affiche !

Différences visibles :
- Banner ORANGE en haut : "📴 Mode Hors Ligne - Affichage depuis le cache"
- Toutes les infos du profil visibles
- Photo, nom, titre, email, téléphone, réseaux sociaux
- Bouton "Enregistrer dans les contacts" FONCTIONNE
- Télécharge un fichier .vcf
```

**Si le profil n'a JAMAIS été vu avec internet (pas de cache) :**
```
📱 Page d'erreur offline

Message :
"Aucune données en cache pour ce profil.
Connectez-vous à internet pour voir ce profil."

Bouton : "Réessayer la connexion"
```

### 🎯 C'est quoi le succès ?
✅ **Voir le profil complet même en Mode Avion si on l'a déjà ouvert une fois avec internet !**

---

## 💾 Test 4 : Téléchargement vCard Offline

### Étapes :
1. En Mode Avion (sans internet)
2. Scanner le tag
3. Le profil s'affiche depuis le cache
4. Cliquer sur **"Enregistrer dans les contacts"**
5. Un fichier `.vcf` est téléchargé

### ✅ Résultat attendu :
- Fichier téléchargé : `Ateib_Abakar.vcf` (avec le nom du profil)
- Ouvrir le fichier → Les contacts du téléphone s'ouvrent
- Option "Ajouter le contact"
- Toutes les infos sont là : nom, email, téléphone, entreprise, etc.

---

## 🔄 Test 5 : Retour en ligne

### Étapes :
1. Toujours sur la page du profil (en mode offline)
2. **Désactiver le Mode Avion**
3. Attendre 2-3 secondes
4. Observer

### ✅ Résultat attendu :
- La banner orange "📴 Mode Hors Ligne" DISPARAÎT automatiquement
- Le profil reste affiché (pas de rechargement forcé)
- Si vous rechargez la page (F5), elle charge depuis le serveur

---

## 🧹 Test 6 : Sans Cache (Situation d'échec)

### Étapes :
1. Ouvrir le navigateur en **mode navigation privée** (incognito)
2. Activer le Mode Avion
3. Scanner le tag

### ✅ Résultat attendu :
```
Page d'erreur générique du navigateur
"Impossible de se connecter à internet"
OU
Page offline personnalisée avec message :
"Aucune donnée en cache"
```

**C'est normal !** Sans avoir visité le profil une fois avec internet, impossible de l'afficher offline.

---

## 📊 Tableau récapitulatif

| Scénario | Internet | Cache | Résultat attendu |
|----------|----------|-------|------------------|
| 1ère visite | ✅ Oui | ❌ Non | ✅ Profil affiché + mise en cache |
| 2ème visite | ✅ Oui | ✅ Oui | ✅ Profil affiché (depuis serveur) |
| Offline après visite | ❌ Non | ✅ Oui | ✅ Profil affiché (depuis cache) avec banner |
| Offline sans visite | ❌ Non | ❌ Non | ❌ Erreur : "Pas de cache" |
| Navigation privée offline | ❌ Non | ❌ Non | ❌ Erreur navigateur |

---

## 🐛 Problèmes courants et solutions

### Problème 1 : Le profil ne s'affiche pas en mode offline
**Causes possibles :**
- Cache pas créé → Vérifier DevTools localStorage
- Navigation privée → Utiliser mode normal
- Cache effacé → Revisiter le profil avec internet

**Solution :**
```bash
# 1. Avec internet, ouvrir :
https://mdevateib.github.io/makka-profiles-nfc/p/ABC123

# 2. Vérifier console : "✅ Profile cached"

# 3. Réessayer en mode avion
```

### Problème 2 : vCard pas écrite sur le tag
**Message :** "⚠️ La vCard n'a pas pu être écrite (tag trop petit)"

**Solutions :**
1. Vérifier le type de tag avec "NFC Tools" app
2. Si NTAG213 (144 bytes) → Remplacer par NTAG215 (504 bytes)
3. Si NTAG215/216 → Vérifier les logs pour l'erreur exacte

### Problème 3 : Banner offline ne disparaît pas
**Cause :** Connexion internet pas vraiment rétablie

**Solution :**
1. Vérifier que WiFi/Data est bien réactivé
2. Tester : ouvrir google.com dans un autre onglet
3. Recharger la page (F5)

### Problème 4 : Fichier .vcf ne contient pas tout
**Vérification :**
```bash
# Ouvrir le fichier .vcf avec un éditeur de texte
# Devrait contenir :
BEGIN:VCARD
VERSION:3.0
N:Nom;Prénom;;;
FN:Prénom Nom
EMAIL:email@example.com
TEL;TYPE=CELL:+221XXXXXXXXX
URL:https://site.com
X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/...
END:VCARD
```

Si des champs manquent → Vérifier que le profil Supabase est complet

---

## 📸 Captures d'écran à prendre

Pour documenter vos tests :

1. **Écriture du tag** : Message de succès avec "✅ vCard écrite"
2. **Mode online** : Profil sans banner orange
3. **Mode offline** : Profil avec banner "📴 Mode Hors Ligne"
4. **Fichier vCard** : Nom du fichier téléchargé
5. **Import contact** : Contact ajouté dans le téléphone

---

## ✅ Validation finale

Cochez ces points pour confirmer que tout fonctionne :

- [ ] Tag écrit avec succès (message "vCard écrite")
- [ ] Profil affiché correctement avec internet
- [ ] Cache créé (visible dans DevTools)
- [ ] Profil affiché en mode avion (avec banner orange)
- [ ] Fichier .vcf téléchargeable offline
- [ ] Contact importable dans le téléphone
- [ ] Banner disparaît quand internet revient
- [ ] Erreur claire si pas de cache

---

## 🚀 Prochaines étapes après validation

Une fois les tests réussis :

1. **Production** : Construire l'APK final avec `eas build --platform android --profile production`
2. **Commander des tags** : Acheter des NTAG215 ou NTAG216 en gros
3. **Documentation utilisateur** : Créer un guide pour les clients
4. **Marketing** : Mettre en avant la fonctionnalité offline (différenciation !)

---

## 📞 Besoin d'aide ?

Si un test échoue :

1. **Vérifier les logs** :
   ```bash
   # Android
   npx react-native log-android
   
   # OU dans Android Studio > Logcat
   ```

2. **Partager les détails** :
   - Type de tag utilisé (NTAG213/215/216)
   - Message d'erreur exact
   - Captures d'écran

3. **Tester avec NFC Tools** :
   - Installer l'app "NFC Tools"
   - Lire le tag
   - Vérifier les enregistrements NDEF

---

**Bon courage pour les tests ! 🎉**

Si tout fonctionne, vous avez une fonctionnalité unique que peu de concurrents offrent ! 🚀

---

**MakkaDev - Innovation NFC Tchad** 🇹🇩
