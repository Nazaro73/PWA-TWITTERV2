// backend/services/subscription/subscribeToUser.js
const db = require('../models');

module.exports = async (req, res) => {
  try {
    const { subscribedToId, pushEndpoint, pushAuth, pushP256dh } = req.body;
    const subscriberId = req.userId; // ID de l'utilisateur connecté

    if (!subscribedToId) {
      return res.status(400).json({ error: "L'ID de l'utilisateur à suivre est requis." });
    }

    // Vérifie si l'utilisateur est déjà abonné
    const existingSubscription = await db.userSubscription.findOne({
      where: { subscriberId, subscribedToId },
    });

    if (existingSubscription) {
      return res.status(400).json({ error: "Déjà abonné à cet utilisateur." });
    }

    // Enregistre l'abonnement avec les informations Web Push
    const newSubscription = await UserSubscription.create({
      subscriberId,
      subscribedToId,
      pushEndpoint,
      pushAuth,
      pushP256dh,
    });

    res.status(201).json({ message: "Abonnement réussi", subscription: newSubscription });
  } catch (error) {
    console.error("❌ Erreur lors de l'abonnement :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};