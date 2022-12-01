'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Handbook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Handbook.belongsTo(models.User, { foreignKey: 'senderId', targetKey: 'id', as: 'senderData' });
        }
    }
    Handbook.init(
        {
            title: DataTypes.STRING,
            authors: DataTypes.STRING,
            statusId: DataTypes.STRING,
            senderId: DataTypes.INTEGER,
            censor: DataTypes.INTEGER,
            adviser: DataTypes.STRING,
            contentHtml: DataTypes.TEXT,
            contentMarkdown: DataTypes.TEXT,
            image: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Handbook',
        },
    );
    return Handbook;
};
