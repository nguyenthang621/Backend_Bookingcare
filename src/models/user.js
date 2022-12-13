'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Allcode, { foreignKey: 'position', targetKey: 'keyMap', as: 'positionData' });
            User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' });
            User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'keyMap', as: 'roleData' });
            User.hasOne(models.Markdown, { foreignKey: 'doctorId' });
            User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' });
            User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'dataAcc' });
            User.hasMany(models.Booking, { foreignKey: 'doctorId', as: 'dataAccDoctor' });
            User.hasMany(models.Handbook, { foreignKey: 'senderId', as: 'senderData' });
            User.hasMany(models.News, { foreignKey: 'senderId', as: 'senderDataNews' });
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            gender: DataTypes.STRING,
            imageURL: DataTypes.STRING,
            roleId: DataTypes.STRING,
            position: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
