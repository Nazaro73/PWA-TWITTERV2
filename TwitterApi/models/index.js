const dbConfig = require("../config.js");
const Sequelize = require("sequelize");

// Configuration de la connexion Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,       // Nombre maximum de connexions dans le pool
    min: dbConfig.pool.min,       // Nombre minimum de connexions dans le pool
    acquire: dbConfig.pool.acquire, // Temps maximum (en ms) pour acquérir une connexion
    idle: dbConfig.pool.idle       // Temps maximum (en ms) pendant lequel une connexion peut être inactive
  },
  define: {
    timestamps: true, // Active les champs `createdAt` et `updatedAt` automatiquement
    freezeTableName: true // Empêche Sequelize de pluraliser les noms de tables
  }
});

// Objet pour exporter les modules
const db = {};

db.Sequelize = Sequelize; // Exporte la bibliothèque Sequelize
db.sequelize = sequelize; // Exporte l'instance de connexion

// Importation des modèles
db.user = require("./user.js")(sequelize, Sequelize); // Modèle User
db.post = require("./post.js")(sequelize, Sequelize); // Modèle Post
db.userSubscription = require("./userSubscription.js")(sequelize, Sequelize); // Modèle UserSubscription

// Associations entre les modèles (si nécessaire)
db.user.hasMany(db.post, { foreignKey: 'userId' }); // Un utilisateur peut avoir plusieurs posts
db.post.belongsTo(db.user, { foreignKey: 'userId' }); // Un post appartient à un utilisateur


sequelize.sync({ force: false }) // `force: true` supprime et recrée les tables
  .then(() => {
    console.log("Base de données synchronisée.");
  })
  .catch((err) => {
    console.error("Erreur lors de la synchronisation de la base de données :", err);
  });

module.exports = db;