module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.STRING,
                allowNull: true,
            }),
        ]);
    },
};
