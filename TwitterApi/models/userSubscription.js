module.exports = (sequelize, Sequelize) => { 
    const userSubscription = sequelize.define("userSubscription", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        subscriberId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        subscribedToId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        pushEndpoint: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        pushAuth: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        pushP256dh: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      { timestamps: true }
    );
  
    return userSubscription;
  };