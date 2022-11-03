import bcrypt from 'bcryptjs';
import db from '../models';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    let hashPassword = await handleHashPassword(data.password);
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            });
            resolve('create new user done!');
        } catch (error) {
            reject(error);
        }
    });
};

let handleHashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allUsers = await db.User.findAll({ raw: true });
            resolve(allUsers);
        } catch (error) {
            reject(error);
        }
    });
};

let getUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: userId }, raw: true });
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserById = async (dataUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: dataUser.userId } });
            if (user) {
                user.update({
                    email: dataUser.email,
                    firstName: dataUser.firstName,
                    lastName: dataUser.lastName,
                    address: dataUser.address,
                    phoneNumber: dataUser.phoneNumber,
                    gender: dataUser.gender,
                    roleId: dataUser.roleId,
                });
                await user.save();
                resolve('update done');
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: userId } });
            if (user) {
                await user.destroy();
                resolve('delete done');
            }
            resolve('not find user');
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};
