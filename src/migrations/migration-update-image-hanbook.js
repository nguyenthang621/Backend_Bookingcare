module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Handbooks', 'image', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Handbooks', 'image', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
        ]);
    },
};
