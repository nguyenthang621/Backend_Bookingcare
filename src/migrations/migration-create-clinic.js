'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('clinics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nameClinic: {
                type: Sequelize.TEXT,
            },
            addressClinic: {
                type: Sequelize.TEXT,
            },
            descriptionHtml: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT,
            },
            imageClinic: {
                type: Sequelize.BLOB('long'),
            },
            imageLogo: {
                type: Sequelize.BLOB('long'),
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
        await queryInterface.dropTable('clinics');
    },
};
