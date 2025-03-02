
const db = require('../models');

module.exports = async (req, res) => {
  try {
    const { userId } = req.params; // ID de l'utilisateur cible
    const subscriberId = userId; // ID de l'utilisateur connecté

    // Vérifie si l'utilisateur est déjà abonné
    const isSubscribed = await db.userSubscription.findOne({
      where: { subscriberId, subscribedToId: userId },
    });

    res.status(200).json({ isSubscribed: !!isSubscribed });
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de l'abonnement :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};