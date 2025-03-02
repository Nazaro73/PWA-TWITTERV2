const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const user = await db.user.create(req.body);
  res.json(user);
});


router.post('/login', async (req, res) => {
  const user = await db.user.findOne({ where: { pseudo: req.body.pseudo } });
  if (user && user.password === req.body.password) {
    const token = jwt.sign({ id: user.id }, 'secretkey');
    res.json({ token , user});
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Récupérer un utilisateur par son ID
router.get('/:id', async (req, res) => {
    try {
        const user = await db.user.findByPk(req.params.id);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur." });
    }
  });

module.exports = router;