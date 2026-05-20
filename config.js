// config.js — Modifie ce fichier pour chaque client 🎯

const CONFIG = {
  // ── INFOS DU COMMERCE ──────────────────────────────────
  nomCommerce:   "Chez les DERROUICHE",
  typeCommerce:  "restaurant",
  ville:         "Paris",
  horaires:      "Lun-Sam 12h-14h30 et 19h-22h30, Dimanche fermé",
  adresse:       "12 rue de la Paix, 75001 Paris",
  telephone:     "01 23 45 67 89",
  email:         "contact@chezmarcel.fr",
  services:      "Déjeuner, dîner, plats à emporter, privatisation de salle",

  // ── PERSONNALISATION VISUELLE ──────────────────────────
  avatar:        "👨‍🍳",           // Emoji du bot
  couleurAccent: "#e94560",        // Couleur principale (hex)
  nomBot:        "Marcel",         // Prénom du bot

  // ── RACCOURCIS (boutons rapides) ──────────────────────
  quickReplies: [
    "Horaires ?",
    "Réserver une table",
    "Carte & menus",
    "Livraison ?",
  ],

  // ── MESSAGE D'ACCUEIL ─────────────────────────────────
  messageAccueil: "Bonjour ! Je suis Marcel, l'assistant de Chez Marcel 👨‍🍳\n\nComment puis-je vous aider aujourd'hui ?",
};

export default CONFIG;
