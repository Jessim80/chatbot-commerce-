import { useState, useRef, useEffect } from "react";

const CONFIG = {
  nomCommerce: "Chez JESSIM",
  typeCommerce: "restaurant",
  horaires: "Lun-Sam 12h-14h30 et 19h-22h30",
  adresse: "12 rue de la Paix, 75001 Paris",
  telephone: "0615486760",
  services: "Déjeuner, dîner, plats à emporter",
  avatar: "👨‍🍳",
  couleurAccent: "#e94560",
  quickReplies: ["Horaires ?", "Prendre rendez-vous", "Tarifs ?", "📞 Appeler maintenant"],
};

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Bonjour ! Je suis l'assistant de " + CONFIG.nomCommerce + " " + CONFIG.avatar + "\n\nComment puis-je vous aider ?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const accent = CONFIG.couleurAccent;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

const sendMessage = async (text) => {
    const msgText = text || input;
    if (!msgText.trim() || loading) return;
    if (msgText === "📞 Appeler maintenant") {
      window.location.href = `tel:${CONFIG.telephone}`;
      return;
      }
    const userMsg = { role: "user", content: msgText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, config: CONFIG }),
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
              <div style={{color:"#4ade80",fontSize:"11px",display:"flex",alignItems:"center",gap:"5px"}}><span style={{width:"6px",height:"6px",background:"#4ade80",borderRadius:"50%",display:"inline-block"}}/>En ligne · Répond instantanément</div>
            </div>
          </div>
          <div style={{height:"360px",overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:"12px"}}>
            {messages.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:"8px"}}>
                {m.role==="assistant"&&<div style={{width:"28px",height:"28px",background:accent,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",flexShrink:0}}>{CONFIG.avatar}</div>}
                <div style={{maxWidth:"78%",padding:"10px 14px",lineHeight:"1.55",fontSize:"13.5px",color:"#f0f0f0",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?accent:"#1e1e3a",border:m.role==="assistant"?"1px solid #2a2a4a":"none"}} dangerouslySetInnerHTML={{__html:fmt(m.content)}}/>
              </div>
            ))}
            {loading&&<div style={{display:"flex",alignItems:"flex-end",gap:"8px"}}><div style={{width:"28px",height:"28px",background:accent,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px"}}>{CONFIG.avatar}</div><div style={{background:"#1e1e3a",border:"1px solid #2a2a4a",padding:"12px 16px",borderRadius:"18px 18px 18px 4px",display:"flex",gap:"5px"}}>{[0,1,2].map(j=><div key={j} style={{width:"6px",height:"6px",background:accent,borderRadius:"50%",animation:`b 1.2s ${j*0.2}s infinite ease-in-out`}}/>)}</div></div>}
            <div ref={messagesEndRef}/>
          </div>
          <div style={{padding:"8px 16px",display:"flex",gap:"6px",flexWrap:"wrap",borderTop:"1px solid #1a1a2e"}}>
            {CONFIG.quickReplies.map(q=><button key={q} className="qr" onClick={()=>sendMessage(q)} style={{background:"none",border:"1px solid #2a2a4a",color:"#777",padding:"4px 11px",borderRadius:"20px",cursor:"pointer",fontSize:"11px",transition:"all 0.2s"}}>{q}</button>)}
          </div>
          <div style={{padding:"12px 16px",display:"flex",gap:"10px",borderTop:"1px solid #2a2a4a"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder="Écrivez votre message..." style={{flex:1,background:"#0f0f1a",border:"1px solid #2a2a4a",borderRadius:"12px",padding:"10px 14px",color:"#f0f0f0",fontSize:"13px",outline:"none"}}/>
            <button onClick={()=>sendMessage()} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?"#1e1e2e":accent,border:"none",borderRadius:"12px",width:"44px",height:"44px",cursor:loading?"not-allowed":"pointer",fontSize:"18px",color:"white"}}> ➤ </button>
          </div>
        </div>
      </div>
    </>
  );
}
