// backend/services/subscription/sendNotifications.js
const webPush = require("web-push");
const db = require('../models');
const User = require("../models/user");

module.exports = async (postContent, userId) => {
  try {
    // Récupère l'auteur du post
    const user = await User.findByPk(userId, {
      attributes: ["username"],
    });

    if (!user) {
      console.error("❌ Utilisateur introuvable, notification annulée.");
      return;
    }

    // Récupère les abonnés qui ont activé les notifications push
    const subscriptions = await db.userSubscription.findAll({
      where: { subscribedToId: userId },
      attributes: ["pushEndpoint", "pushAuth", "pushP256dh"],
    });

    if (subscriptions.length === 0) {
      console.log("⚠️ Aucun abonnement trouvé, pas de notification envoyée.");
      return;
    }

    const notificationPayload = JSON.stringify({
      title: `Nouveau post de ${user.username} !`,
      body: postContent.length > 100 ? `${postContent.substring(0, 100)}...` : postContent,
      icon: "/icons/notification-icon.png",
      url: `http://localhost:4173/user/${user.username}`,
    });

    // Envoie des notifications à tous les abonnés
    subscriptions.forEach((sub) => {
      if (!sub.pushEndpoint || !sub.pushAuth || !sub.pushP256dh) return;

      const pushSubscription = {
        endpoint: sub.pushEndpoint,
        keys: {
          auth: sub.pushAuth,
          p256dh: sub.pushP256dh,
        },
      };

      webPush.sendNotification(pushSubscription, notificationPayload).catch((err) => {
        console.error("❌ Erreur d'envoi de la notification :", err);
      });
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi des notifications :", error);
  }
};