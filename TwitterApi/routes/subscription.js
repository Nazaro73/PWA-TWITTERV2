const express = require("express");
const router = express.Router();
const checkSubscription = require("../services/checkSubscription");
const subscribeToUser = require("../services/subscribeToUser");
const sendNotifications = require("../services/sendNotifications");
// Vérifier si un utilisateur est abonné
router.get("/check/:userId", checkSubscription);

// S'abonner à un utilisateur
router.post("/subscribe", subscribeToUser);




module.exports = router;