module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
      titre: {
        type: Sequelize.STRING,
        allowNull: false // Ce champ est obligatoire
      },
      url_image: {
        type: Sequelize.TEXT,
        allowNull: true // Ce champ est facultatif
      },
      texte: {
        type: Sequelize.TEXT,
        allowNull: false // Ce champ est obligatoire
      }
    });
    return Post;
  };