'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                email: 'thang621@gmail.com',
                password: '123456',
                firstName: 'nguyen',
                lastName: 'thang',
                address: 'vietNam',
                gender: '1',
                typeRole: 'ROLE',
                keyRole: 'R1',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    },
};
