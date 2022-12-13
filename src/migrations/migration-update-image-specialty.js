module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Specialties', 'image', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Specialties', 'image', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
        ]);
    },
};
