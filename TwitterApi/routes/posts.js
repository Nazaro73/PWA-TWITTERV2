const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../auth');

router.get('/', async (req, res) => {
    try {
      const posts = await db.post.findAll({
        include: [{
          model: db.user,
          attributes: ['pseudo'] // Inclure uniquement le pseudo de l'utilisateur
        }]
      });
  
      // Formater la réponse pour inclure directement le pseudo
      const formattedPosts = posts.map(post => ({
        ...post.toJSON(),
        pseudo: post.user.pseudo // Ajouter le pseudo directement dans l'objet post
      }));
  
      res.json(formattedPosts);
    } catch (err) {
      console.error("Erreur lors de la récupération des posts :", err);
      res.status(500).json({ message: "Erreur lors de la récupération des posts." });
    }
  });

  router.post('/', auth, async (req, res) => {
    try {
      const { titre, texte, url_image } = req.body;
  
      // Vérifier que les champs obligatoires sont présents
      if (!titre || !texte) {
        return res.status(400).json({ message: "Les champs 'titre' et 'texte' sont obligatoires." });
      }
  
      // Créer le post avec l'ID de l'utilisateur authentifié
      const post = await db.post.create({
        titre,
        texte,
        url_image,
        userId: req.userId // Assigner le post à l'utilisateur authentifié
      });
  
      // Récupérer le pseudo de l'utilisateur pour l'inclure dans la réponse
      const user = await db.user.findByPk(req.userId, {
        attributes: ['pseudo'] // Inclure uniquement le pseudo
      });
  
      // Envoyez des notifications aux abonnés
        await sendNotifications(texte, req.userId);
      // Ajouter le pseudo de l'utilisateur à la réponse
      const response = {
        ...post.toJSON(),
        user: {
          pseudo: user.pseudo
        }
      };
  
      res.status(201).json(response);
    } catch (err) {
      console.error("Erreur lors de la création du post :", err);
      res.status(500).json({ message: "Erreur lors de la création du post." });
    }
  });

  router.get('/user/:id', async (req, res) => {
    try {
      const posts = await db.post.findAll({
        where: { userId: req.params.id },
        include: [{
          model: db.user,
          attributes: ['pseudo'] // Inclure uniquement le pseudo de l'utilisateur
        }]
      });
  
      if (posts.length > 0) {
        // Formater la réponse pour inclure directement le pseudo
        const formattedPosts = posts.map(post => ({
          ...post.toJSON(),
          pseudo: post.user.pseudo // Ajouter le pseudo directement dans l'objet post
        }));
  
        res.json(formattedPosts);
      } else {
        res.status(404).json({ message: "Aucun post trouvé pour cet utilisateur." });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des posts de l'utilisateur :", err);
      res.status(500).json({ message: "Erreur lors de la récupération des posts de l'utilisateur." });
    }
  });

module.exports = router;