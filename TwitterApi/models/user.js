module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      pseudo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
    return User;
  };