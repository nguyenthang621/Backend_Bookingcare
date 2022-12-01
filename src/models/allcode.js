'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Allcode.hasMany(models.User, { foreignKey: 'position', as: 'positionData' });
            Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' });
            Allcode.hasMany(models.User, { foreignKey: 'roleId', as: 'roleData' });
            Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' });

            Allcode.hasMany(models.Booking, { foreignKey: 'timeType', as: 'timeAppointment' });
            Allcode.hasMany(models.Booking, { foreignKey: 'gender', as: 'genderDT' });

            Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'priceId', as: 'priceData' });
            Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'provinceId', as: 'provinceData' });
            Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'paymentId', as: 'paymentData' });
        }
    }
    Allcode.init(
        {
            keyMap: DataTypes.STRING,
            type: DataTypes.STRING,
            valueEn: DataTypes.STRING,
            valueVi: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Allcode',
        },
    );
    return Allcode;
};
