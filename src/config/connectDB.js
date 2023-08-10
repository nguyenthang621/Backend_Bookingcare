const { Sequelize } = require('sequelize');
require('dotenv').config();

// Option 2: Passing parameters separately (other dialects)
// const sequelize = new Sequelize(process.env.DB_DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: process.env.DB_DIALECT,
//     logging: false,
//     dialectOptions:
//         process.env.DB_SSL === 'true'
//             ? {
//                   ssl: {
//                       require: true,
//                       rejectUnauthorized: false,
//                   },
//               }
//             : {},
//     query: {
//         raw: true,
//     },
//     timezone: '+07:00',
// });

const sequelize = new Sequelize('MISA.TEST', 'nvmanh', '12345678', {
    host: '18.179.16.166',
    port: 3306,
    dialect: 'mysql',
    // dialectModule: mysql2, // Use mysql2 driver
    logging: false,
    timezone: '+07:00',
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
module.exports = { connectDB, sequelize };
