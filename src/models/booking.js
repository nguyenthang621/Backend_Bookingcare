'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Booking.init(
        {
            bookFor: DataTypes.STRING,
            uuid: DataTypes.STRING,
            statusId: DataTypes.STRING,
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            date: DataTypes.STRING,
            timeType: DataTypes.STRING,
            IDNumber: DataTypes.STRING,
            gender: DataTypes.STRING,
            namePatient: DataTypes.STRING,
            YearOfBirth: DataTypes.INTEGER,
            phoneNumber: DataTypes.STRING,
            address: DataTypes.STRING,
            reason: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Booking',
        },
    );
    return Booking;
};
