export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const { messages, config } = req.body;

  const systemPrompt = `Tu es l'assistant virtuel de ${config.nomCommerce}, un(e) ${config.typeCommerce}.
Horaires : ${config.horaires}
Adresse : ${config.adresse}
Téléphone : ${config.telephone}
Services : ${config.services}
Réponds en français, de façon chaleureuse et concise (2-3 phrases max).`;

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 400,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu répondre.";
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
