'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinics extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Clinics.hasMany(models.Doctor_Infor, { foreignKey: 'nameClinic', as: 'clinicData' });
        }
    }
    Clinics.init(
        {
            nameClinic: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            descriptionHtml: DataTypes.TEXT,
            descriptionMarkdown: DataTypes.TEXT,
            imageClinic: DataTypes.TEXT,
            imageLogo: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Clinics',
        },
    );
    return Clinics;
};
