'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_Infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Doctor_Infor.belongsTo(models.User, { foreignKey: 'doctorId' });

            Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceData' });
            Doctor_Infor.belongsTo(models.Allcode, {
                foreignKey: 'provinceId',
                targetKey: 'keyMap',
                as: 'provinceData',
            });
            Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentData' });
            Doctor_Infor.belongsTo(models.Specialty, {
                foreignKey: 'specialtyId',
                targetKey: 'id',
                as: 'specialtyData',
            });
            Doctor_Infor.hasOne(models.Markdown, {
                foreignKey: 'doctorId',
            });
            Doctor_Infor.belongsTo(models.Clinics, {
                foreignKey: 'nameClinic',// id clinic
                targetKey: 'id',
                as: 'clinicData',
            });
        }
    }
    Doctor_Infor.init(
        {
            doctorId: DataTypes.INTEGER,
            specialtyId: DataTypes.INTEGER,
            priceId: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            nameClinic: DataTypes.STRING,
            note: DataTypes.STRING,
            count: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Doctor_Infor',
            freezeTableName: true,
        },
    );
    return Doctor_Infor;
};
