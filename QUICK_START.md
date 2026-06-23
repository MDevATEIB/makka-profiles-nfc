# ⚡ Quick Start - Makka NFC Profiles Web

## 🚀 Démarrage rapide en 5 étapes

### 1️⃣ Configurer Supabase (2 minutes)

Ouvrez `src/lib/supabase.js` et remplacez :

```javascript
const supabaseUrl = 'VOTRE_URL_SUPABASE';
const supabaseAnonKey = 'VOTRE_ANON_KEY_SUPABASE';
```

Par vos clés depuis https://supabase.com → Settings → API

---

### 2️⃣ Installer gh-pages (1 minute)

```bash
cd "C:\Users\HP\Makka NFC Studio\makka-profiles-web"
npm install -D gh-pages
```

---

### 3️⃣ Tester en local (1 minute)

```bash
npm start
```

Ouvrez http://localhost:3000
Vérifiez que le profil DEMO01 s'affiche

---

### 4️⃣ Créer repo GitHub (2 minutes)

1. https://github.com → New repository
2. Nom : `makka-profiles`
3. Public
4. Create repository

Dans `package.json`, ligne 5, remplacez `USERNAME` :
```json
"homepage": "https://VOTRE_USERNAME.github.io/makka-profiles"
```

---

### 5️⃣ Déployer (3 minutes)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/makka-profiles.git
git push -u origin main
npm run deploy
```

Attendez 1-2 minutes puis visitez :
```
https://VOTRE_USERNAME.github.io/makka-profiles/
```

---

## ✅ C'est tout !

Votre app est en ligne ! 🎉

**Profil de test disponible :**
```
https://VOTRE_USERNAME.github.io/makka-profiles/p/DEMO01
```

---

## 📚 Plus d'infos

- **Configuration détaillée** → `SUPABASE_CONFIG.md`
- **Guide complet** → `DEPLOYMENT.md`
- **Prochaines étapes** → `NEXT_STEPS.md`
- **Résumé technique** → `PROJECT_SUMMARY.md`

---

## 🆘 Problème ?

**L'app ne démarre pas en local ?**
→ Vérifiez les clés Supabase dans `src/lib/supabase.js`

**Aucun profil ne s'affiche ?**
→ Vérifiez que le profil DEMO01 existe dans Supabase

**Erreur au déploiement ?**
→ Vérifiez que `homepage` dans `package.json` est correct

**404 sur GitHub Pages ?**
→ Attendez 2-3 minutes, puis videz le cache (Ctrl+Shift+R)

---

**MakkaDev** - Ateib Abakar Bachar
