exports.handler = async (event) => {
  // 1. Sécurité : On vérifie que c'est bien une soumission de formulaire
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée" };
  }

  try {
    // 2. On récupère les données
    const data = JSON.parse(event.body);
    const nom = data.name || "Lecteur";
    const email = data.email || "Non renseigné";
    const phone = data.phone || "Non renseigné";

    // 3. Configuration de base
    const BREVO_API_KEY = process.env.BREVO_API_KEY; 
    const SENDER_EMAIL = "yaoakoe.ovb@gmail.com"; // Assurez-vous qu'elle est validée sur Brevo
    const LIEN_DU_GUIDE = "https://guidefin.netlify.app/guide-2026.html";

    if (!BREVO_API_KEY) {
      console.error("Clé API manquante");
      return { statusCode: 500, body: JSON.stringify({ message: "Configuration manquante" }) };
    }

    // -----------------------------------------------------------------
    // E-MAIL N°1 : LE GUIDE POUR LE PROSPECT
    // -----------------------------------------------------------------
    const emailToProspect = {
      sender: { name: "Cabinet Conseil Assurance", email: SENDER_EMAIL },
      to: [{ email: email, name: nom }],
      subject: "Voici votre Guide d'Optimisation Fiscale 2026 🎁",
      htmlContent: `
        <div style="font-family: sans-serif; color: #1a1a2e; padding: 20px;">
          <h2>Bonjour ${nom},</h2>
          <p>Merci pour votre demande. Comme promis, voici votre guide pratique pour protéger votre avenir financier.</p>
          <p><a href="${LIEN_DU_GUIDE}" style="background-color: #0B1F3A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">📥 Télécharger le guide</a></p>
          <p>Bonne lecture ! Si vous avez des questions, n'hésitez pas à répondre directement à cet e-mail.</p>
          <p>À très bientôt,</p>
          <p><strong>L'équipe Cabinet Conseil Assurance</strong></p>
        </div>
      `
    };

    // -----------------------------------------------------------------
    // E-MAIL N°2 : LA NOTIFICATION POUR VOUS
    // -----------------------------------------------------------------
    const emailToAdmin = {
      sender: { name: "Bot d'Acquisition", email: SENDER_EMAIL }, 
      to: [{ email: "yaoakoe.ovb@gmail.com", name: "Boris" }],
      replyTo: { email: email, name: nom },
      subject: `🚨 NOUVEAU PROSPECT : ${nom.toUpperCase()}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e1e2d;">
          <div style="background-color: #2a2a3e; border-radius: 10px; padding: 20px; max-width: 500px; margin: 0 auto; color: white;">
            <h2 style="color: #ffffff; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Nouveau téléchargement du guide !</h2>
            <div style="background-color: #1e1e2d; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 10px 0; font-size: 16px;"><strong>Nom :</strong> ${nom}</p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>Email :</strong> <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>GSM :</strong> ${phone}</p>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">
              Pense à ajouter ce contact dans ton téléphone. Tu peux lui envoyer un message WhatsApp directement.
            </p>
          </div>
        </div>
      `
    };

    // -----------------------------------------------------------------
    // ENVOI PARALLÈLE (OPTIMISATION)
    // -----------------------------------------------------------------
    const sendToBrevo = (payload) => {
      return fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY
        },
        body: JSON.stringify(payload)
      });
    };

    // On lance les deux envois en même temps pour que ce soit instantané
    const [resProspect, resAdmin] = await Promise.all([
      sendToBrevo(emailToProspect),
      sendToBrevo(emailToAdmin)
    ]);

    if (resProspect.ok && resAdmin.ok) {
      console.log("Succès : Guide envoyé et Alerte reçue !");
      return { statusCode: 200, body: JSON.stringify({ message: "Automatisation 100% réussie" }) };
    } else {
      console.error("Erreur partielle lors de l'envoi d'un des e-mails.");
      return { statusCode: 500, body: JSON.stringify({ message: "Erreur API Brevo" }) };
    }

  } catch (error) {
    console.error("Erreur serveur :", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Erreur serveur globale" }) };
  }
};
