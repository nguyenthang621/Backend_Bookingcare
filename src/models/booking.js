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
            Booking.belongsTo(models.Allcode, {
                foreignKey: 'timeType',
                targetKey: 'keyMap',
                as: 'timeAppointment',
            });
            Booking.belongsTo(models.Allcode, {
                foreignKey: 'gender',
                targetKey: 'keyMap',
                as: 'genderDT',
            });
            Booking.belongsTo(models.User, {
                foreignKey: 'patientId',
                targetKey: 'id',
                as: 'dataAcc',
            });
            Booking.belongsTo(models.User, {
                foreignKey: 'doctorId',
                targetKey: 'id',
                as: 'dataAccDoctor',
            });
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
