module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Clinics', 'imageClinic', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
            queryInterface.changeColumn('Clinics', 'imageLogo', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Clinics', 'imageClinic', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
            queryInterface.changeColumn('Clinics', 'imageLogo', {
                type: Sequelize.TEXT,
                allowNull: true,
            }),
        ]);
    },
};
