import { useState, useRef, useEffect } from "react";

const CONFIG = {
  nomCommerce: "Chez JESSIM",
  typeCommerce: "restaurant",
  horaires: "Lun-Sam 12h-14h30 et 19h-22h30",
  adresse: "12 rue de la Paix, 75001 Paris",
  telephone: "0615486760",
  whatsapp: "33615486760",
  services: "Déjeuner, dîner, plats à emporter",
  avatar: "👨‍🍳",
  couleurAccent: "#e94560",
  quickReplies: ["Horaires ?", "Prendre rendez-vous", "Tarifs ?", "📞 Appeler maintenant"],
  heuresOuverture: { lundi: [12, 22], mardi: [12, 22], mercredi: [12, 22], jeudi: [12, 22], vendredi: [12, 22], samedi: [12, 22], dimanche: null },
};

const estOuvert = () => {
  const maintenant = new Date();
  const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const jour = jours[maintenant.getDay()];
  const heure = maintenant.getHours();
  const horaire = CONFIG.heuresOuverture[jour];
  if (!horaire) return false;
  return heure >= horaire[0] && heure < horaire[1];
};

export default function Chatbot() {
  const ouvert = estOuvert();
  const [messages, setMessages] = useState([{ role: "assistant", content: "Bonjour ! Je suis l'assistant de " + CONFIG.nomCommerce + " " + CONFIG.avatar + "\n\n" + (ouvert ? "🟢 Nous sommes actuellement ouverts !" : "🔴 Nous sommes actuellement fermés.") + "\n\nComment puis-je vous aider ?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rdvEtape, setRdvEtape] = useState(null);
  const [rdvData, setRdvData] = useState({});
  const messagesEndRef = useRef(null);
  const accent = CONFIG.couleurAccent;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const ajouterMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const gererRdv = (texte) => {
    if (rdvEtape === "nom") {
      setRdvData(prev => ({ ...prev, nom: texte }));
      setRdvEtape("date");
      ajouterMessage("assistant", `Parfait ${texte} ! 📅 Quelle date vous convient ? (ex: lundi 2 juin)`);
      return true;
    }
    if (rdvEtape === "date") {
      setRdvData(prev => ({ ...prev, date: texte }));
      setRdvEtape("heure");
      ajouterMessage("assistant", `Super ! ⏰ Et à quelle heure ? (ex: 14h30)`);
      return true;
    }
    if (rdvEtape === "heure") {
      const data = { ...rdvData, heure: texte };
      setRdvEtape(null);
      setRdvData({});
      const msgWhatsApp = `Bonjour ! Je voudrais réserver chez ${CONFIG.nomCommerce}.\n\n👤 Nom : ${data.nom}\n📅 Date : ${data.date}\n⏰ Heure : ${data.heure}\n\nMerci !`;
      const urlWhatsApp = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msgWhatsApp)}`;
      ajouterMessage("assistant", `Parfait ! Cliquez sur le bouton ci-dessous pour confirmer votre réservation sur WhatsApp 👇`);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: `__WA__${urlWhatsApp}` }]);
      }, 500);
      return true;
    }
    return false;
  };

  const sendMessage = async (text) => {
    const msgText = text || input;
    if (!msgText.trim() || loading) return;
    setInput("");

    if (msgText === "📞 Appeler maintenant") {
      window.location.href = `tel:${CONFIG.telephone}`;
      return;
    }

    if (msgText === "Prendre rendez-vous") {
      ajouterMessage("user", msgText);
      setRdvEtape("nom");
      ajouterMessage("assistant", "Bien sûr ! 😊 Quel est votre prénom ?");
      return;
    }

    if (rdvEtape) {
      ajouterMessage("user", msgText);
      gererRdv(msgText);
      return;
    }

    const userMsg = { role: "user", content: msgText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, config: CONFIG, estOuvert: ouvert }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "Désolé, réessayez." }]);
    } catch { setMessages([...newMessages, { role: "assistant", content: "Erreur, réessayez !" }]); }
    setLoading(false);
  };

  const fmt = (t) => t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#0f0f1a;font-family:Georgia,serif}input::placeholder{color:#444}.qr:hover{border-color:${accent}!important;color:${accent}!important}@keyframes b{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(-5px);opacity:1}}`}</style>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
        <div style={{width:"100%",maxWidth:"480px",background:"#16162a",borderRadius:"20px",border:"1px solid #2a2a4a",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
          <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",padding:"16px 20px",display:"flex",alignItems:"center",gap:"12px",borderBottom:"1px solid #2a2a4a"}}>
            <div style={{width:"46px",height:"46px",background:accent,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px"}}>{CONFIG.avatar}</div>
            <div>
              <div style={{color:"#fff",fontWeight:"bold",fontSize:"15px"}}>{CONFIG.nomCommerce}</div>
              <div style={{color: ouvert ? "#4ade80" : "#f87171",fontSize:"11px",display:"flex",alignItems:"center",gap:"5px"}}>
                <span style={{width:"6px",height:"6px",background: ouvert ? "#4ade80" : "#f87171",borderRadius:"50%",display:"inline-block"}
