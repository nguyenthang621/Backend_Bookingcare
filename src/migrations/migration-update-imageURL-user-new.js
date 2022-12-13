module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.removeColumn('Users', 'image')]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([queryInterface.removeColumn('Users', 'imageURL')]);
    },
};
