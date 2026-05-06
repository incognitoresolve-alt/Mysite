exports.handler = async (event) => {
  // 1. Netlify récupère les informations du formulaire
  const data = JSON.parse(event.body);
  const userEmail = data.email;
  const userName = data.name || "Lecteur";

  console.log("Nouveau prospect reçu :", data.email);

  // 2. VOTRE CONFIGURATION (CORRIGÉE)
  const BREVO_API_KEY = "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"; 
  const SENDER_EMAIL = "yaoakoe.ovb@gmail.com"; 
  const LIEN_DU_GUIDE = "https://guidefin.netlify.app/guide-2026.html";

  // 3. Le contenu de l'e-mail à envoyer au client
  const emailPayload = {
    sender: { name: "Cabinet Conseil Assurance", email: SENDER_EMAIL },
    to: [{ email: userEmail, name: userName }],
    subject: "Voici votre Guide d'Optimisation Fiscale 2026 🎁",
    htmlContent: `
      <div style="font-family: sans-serif; color: #1a1a2e; padding: 20px;">
        <h2>Bonjour ${userName},</h2>
        <p>Merci pour votre demande. Comme promis, voici votre guide pratique pour protéger votre avenir financier.</p>
        <p><a href="${LIEN_DU_GUIDE}" style="background-color: #0B1F3A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">📥 Télécharger le guide</a></p>
        <p>Bonne lecture ! Si vous avez des questions, n'hésitez pas à répondre directement à cet e-mail.</p>
        <p>À très bientôt,</p>
        <p><strong>L'équipe Cabinet Conseil Assurance</strong></p>
      </div>
    `
  };

  try {
    // 4. On demande au "facteur" Brevo de livrer l'e-mail
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify(emailPayload)
    });

    if (response.ok) {
      console.log("E-mail envoyé avec succès !");
      return { statusCode: 200, body: JSON.stringify({ message: "Email envoyé" }) };
    } else {
      const errorData = await response.text();
      console.error("Erreur de la part de Brevo :", errorData);
      return { statusCode: 500, body: JSON.stringify({ message: "Erreur d'envoi Brevo" }) };
    }
  } catch (error) {
    console.error("Erreur de connexion :", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Erreur serveur" }) };
  }
};
