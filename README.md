# 🤖 Chatbot IA pour Commerces — Guide de déploiement

## ⚡ Déployer un nouveau client en 10 minutes

---

### ÉTAPE 1 — Personnaliser pour le client

Ouvre `config.js` et modifie :

```js
nomCommerce:   "Nom du restaurant / salon / boutique"
typeCommerce:  "restaurant" | "coiffeur" | "boutique" | ...
horaires:      "Lun-Ven 9h-18h, Sam 10h-17h"
adresse:       "Adresse complète"
telephone:     "Numéro"
services:      "Liste des services"
avatar:        "💇" // emoji adapté
couleurAccent: "#e94560" // couleur de la marque
quickReplies:  ["Question 1", "Question 2", ...] // max 4
```

---

### ÉTAPE 2 — Mettre sur GitHub

```bash
git init
git add .
git commit -m "Chatbot [NOM CLIENT]"
git remote add origin https://github.com/TON_USER/chatbot-[client].git
git push -u origin main
```

---

### ÉTAPE 3 — Déployer sur Vercel (GRATUIT)

1. Va sur **vercel.com** → "Add New Project"
2. Importe ton repo GitHub
3. Dans **Settings > Environment Variables**, ajoute :
   - Key : `MISTRAL_API_KEY`
   - Value : ta clé Mistral
4. Clique **Deploy** → tu obtiens une URL en 2 min ✅

---

### ÉTAPE 4 — Intégrer sur le site du client (optionnel)

Ajoute ce code sur n'importe quel site :

```html
<!-- Widget chatbot flottant -->
<script>
  const iframe = document.createElement('iframe');
  iframe.src = "https://TON-PROJET.vercel.app";
  iframe.style = "position:fixed;bottom:20px;right:20px;width:380px;height:560px;border:none;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.3);z-index:9999";
  document.body.appendChild(iframe);
</script>
```

---

## 💶 Grille tarifaire suggérée

| Service | Prix |
|---|---|
| Setup chatbot (config + déploiement) | 400€ |
| Maintenance mensuelle | 100-150€/mois |
| Intégration site existant | +100€ |
| **Pack complet 1 an** | **900€** |

---

## 🔧 Changer de client = 5 minutes

1. Modifier `config.js`
2. `git add . && git commit -m "Client: Nouveau Nom" && git push`
3. Vercel redéploie automatiquement ✅

---

## 📁 Structure du projet

```
chatbot-commerce/
├── config.js          ← À modifier pour chaque client
├── pages/
│   ├── index.js       ← Interface du chatbot
│   └── api/
│       └── chat.js    ← Proxy sécurisé vers Mistral
├── .env.example       ← Template des variables d'env
└── package.json
```
