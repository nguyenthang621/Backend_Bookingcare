'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Bookings', {
            id: {
                allowNull: false,
                // autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            bookFor: {
                type: Sequelize.STRING,
            },
            statusId: {
                type: Sequelize.STRING,
            },
            uuid: {
                type: Sequelize.STRING,
            },
            doctorId: {
                type: Sequelize.INTEGER,
            },
            patientId: {
                type: Sequelize.INTEGER,
            },
            date: {
                type: Sequelize.STRING,
            },
            timeType: {
                type: Sequelize.STRING,
            },
            IDNumber: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.STRING,
            },
            namePatient: {
                type: Sequelize.STRING,
            },
            YearOfBirth: {
                type: Sequelize.INTEGER,
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            reason: {
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
        await queryInterface.dropTable('bookings');
    },
};
