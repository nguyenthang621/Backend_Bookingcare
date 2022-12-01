'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class News extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            News.belongsTo(models.User, { foreignKey: 'senderId', targetKey: 'id', as: 'senderDataNews' });
        }
    }
    News.init(
        {
            title: DataTypes.STRING,
            authors: DataTypes.STRING,
            statusId: DataTypes.STRING,
            senderId: DataTypes.INTEGER,
            censor: DataTypes.INTEGER,
            adviser: DataTypes.STRING,
            type: DataTypes.STRING,
            contentHtml: DataTypes.TEXT,
            contentMarkdown: DataTypes.TEXT,
            image: DataTypes.TEXT,
            topic: DataTypes.TEXT,
            focus: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'News',
        },
    );
    return News;
};
