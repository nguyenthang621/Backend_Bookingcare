'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('News', {
            id: {
                allowNull: false,
                // autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            statusId: {
                type: Sequelize.STRING,
            },
            authors: {
                type: Sequelize.STRING,
            },
            senderId: {
                type: Sequelize.INTEGER,
            },
            censor: {
                type: Sequelize.INTEGER,
            },
            adviser: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
            },
            topic: {
                type: Sequelize.TEXT,
            },
            focus: {
                type: Sequelize.TEXT,
            },
            contentHtml: {
                type: Sequelize.TEXT,
            },
            contentMarkdown: {
                type: Sequelize.TEXT,
            },
            image: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('news');
    },
};
