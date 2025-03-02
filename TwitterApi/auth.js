const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Récupérer l'en-tête Authorization
  const authHeader = req.headers['authorization'];

  // Vérifier si l'en-tête existe et commence par "Bearer "
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extraire le token (en supprimant "Bearer ")
    const token = authHeader.split(' ')[1];

    // Vérifier le token
    jwt.verify(token, 'secretkey', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token invalide.' });
      } else {
        req.userId = decoded.id; // Ajouter l'ID de l'utilisateur à la requête
        next();
      }
    });
  } else {
    res.status(403).json({ message: 'Aucun token fourni.' });
  }
};