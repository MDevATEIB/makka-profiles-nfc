# ⚡ Quick Start - Test de la fonctionnalité Offline

## 🎯 Objectif : Tester que les profils fonctionnent sans internet

---

## ⏱️ 5 minutes pour tester !

### 📦 Étape 1 : Installer (1 min)

```bash
cd "C:\Users\HP\makka profil web\app-profile"
npm install
```

### 🏗️ Étape 2 : Build l'app (2-5 min)

```bash
# Option rapide (dev)
npx expo run:android

# OU Option production (plus long)
eas build --platform android --profile preview
```

### ✍️ Étape 3 : Programmer un tag (1 min)

1. Ouvrir l'app sur votre téléphone
2. Aller dans "Mes Profils"
3. Sélectionner un profil
4. Cliquer "Programmer NFC"
5. Approcher un tag **NTAG215** ou **NTAG216** (PAS NTAG213 !)
6. ✅ Attendre message : "vCard écrite (mode offline)"

### 🌐 Étape 4 : Tester avec internet (30 sec)

1. Scanner le tag (WiFi/Data activé)
2. ✅ Le profil s'ouvre dans le navigateur
3. ✅ Tout fonctionne normalement

### 📴 Étape 5 : Tester SANS internet (30 sec) ⭐

1. **Activer le Mode Avion** (garder NFC activé)
2. Scanner le tag
3. ✅ **Banner orange** "Mode Hors Ligne" s'affiche
4. ✅ **Profil complet** visible
5. ✅ **Bouton télécharger** fonctionne
6. ✅ Fichier `.vcf` importable dans contacts

---

## ✅ Critères de succès

| Test | Résultat attendu |
|------|------------------|
| Écriture tag | Message "vCard écrite (mode offline)" |
| Scan avec internet | Profil s'affiche, console dit "cached" |
| Scan sans internet | Banner orange + profil complet visible |
| Téléchargement vCard | Fichier .vcf téléchargé |
| Import contact | Contact ajouté dans téléphone |

---

## 🚨 Si ça ne marche pas

### Problème : "vCard n'a pas pu être écrite"
**Cause** : Tag trop petit  
**Solution** : Utiliser NTAG215 ou NTAG216 (pas NTAG213)

### Problème : Profil ne s'affiche pas offline
**Cause** : Pas encore visité avec internet  
**Solution** : Scanner une fois avec internet d'abord

### Problème : App ne build pas
**Cause** : Dépendances manquantes  
**Solution** : `npm install` puis réessayer

---

## 📚 Documentation complète

- **Guide détaillé** : `GUIDE_TEST_OFFLINE.md`
- **Vue d'ensemble** : `README_OFFLINE_FEATURE.md`
- **Résumé** : `RESUME_FINAL.md`
- **Technique** : `OFFLINE_VCARD_IMPLEMENTATION_STATUS.md`

---

## 🎉 C'est tout !

Si vous voyez le profil en mode avion avec le banner orange, **c'est gagné !** 🚀

**Vous avez une fonctionnalité unique sur le marché !** 💪

---

**MakkaDev - Innovation NFC Tchad** 🇹🇩
