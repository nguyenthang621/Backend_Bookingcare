import db from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const salt = bcrypt.genSaltSync(10);

let handleUserLoginServices = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserEmail(email);
            let userData = {};
            if (isExist) {
                let data = handleComparePassword(email, password);
                resolve(data);
            } else {
                userData.errorCode = 1;
                userData.message = 'user is not found';
                resolve({ ...userData });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { email: email }, raw: true });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let handleComparePassword = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                // attributes: ['email', 'firstName', 'lastName', 'roleId', 'password'],
                attributes: ['id', 'firstName', 'lastName', 'roleId', 'password'],
                where: { email: email },
                raw: true,
            });
            if (user) {
                let check = await bcrypt.compare(password, user.password);
                if (check) {
                    delete user.password; // remove password
                    resolve({
                        errorCode: 0,
                        message: 'check password done',
                        user: user,
                    });
                } else {
                    resolve({
                        errorCode: 1,
                        message: 'password wrong',
                    });
                }
            } else {
                resolve({
                    errorCode: 1,
                    message: 'user is not found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userId === 'ALL') {
                let users = await db.User.findAll({
                    attributes: {
                        exclude: ['password', 'image'],
                    },
                });
                resolve(users);
            }
            if (userId !== 'ALL' && userId) {
                let user = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password', 'image'],
                    },
                });
                user ? resolve(user) : resolve('');
            }
        } catch (error) {
            reject(error);
        }
    });
};

let createUser = async (data) => {
    let hashPassword = await handleHashPassword(data.password);
    return new Promise(async (resolve, reject) => {
        try {
            // check user email is exist??
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail) {
                resolve({
                    errorCode: 1,
                    message: 'your email is already in used, please try another email',
                });
            } else {
                if (!data.email || !data.password || !data.firstName || !data.lastName || !data.address) {
                    resolve({
                        errorCode: 1,
                        message: 'Fill in the missing user information, please fill in all the information',
                    });
                } else {
                    await db.User.create({
                        email: data.email,
                        password: hashPassword,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        gender: data.gender,
                        position: data.position,
                        roleId: data.roleId,
                        image: data.avatar,
                    });
                    resolve({
                        errorCode: 0,
                        message: 'create user done',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};
let registerServices = async (data) => {
    let hashPassword = await handleHashPassword(data.password);
    return new Promise(async (resolve, reject) => {
        try {
            // check user email is exist??
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail) {
                resolve({
                    errorCode: 1,
                    message: 'your email is already in used, please try another email',
                });
            } else {
                if (!data.email || !data.password || !data.confirmPassword) {
                    resolve({
                        errorCode: 1,
                        message: 'Fill in the missing user information, please fill in all the information',
                    });
                } else if (data.password !== data.confirmPassword) {
                    resolve({
                        errorCode: 1,
                        message: 'Confirm password wrong',
                    });
                } else {
                    await db.User.create({
                        email: data.email,
                        password: hashPassword,
                        roleId: 'R3',
                    });
                    resolve({
                        errorCode: 0,
                        message: 'Register done',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};
let handleHashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: userId } });
            if (user) {
                await user.destroy();
                resolve({ errorCode: 0, message: 'delete user done!' });
            }
            resolve({ errorCode: 1, message: 'user is not found' });
        } catch (error) {
            reject(error);
        }
    });
};

let updateUser = async (dataUserNew) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataUserNew.id || !dataUserNew.roleId || !dataUserNew.position || !dataUserNew.gender) {
                resolve({
                    errorCode: 1,
                    message: 'missing parameter',
                });
            }
            let user = await db.User.findOne({ where: { id: dataUserNew.id } });
            if (user) {
                await user.update({
                    email: dataUserNew.email,
                    firstName: dataUserNew.firstName,
                    lastName: dataUserNew.lastName,
                    address: dataUserNew.address,
                    roleId: dataUserNew.roleId,
                    position: dataUserNew.position,
                    phoneNumber: dataUserNew.phoneNumber,
                    gender: dataUserNew.gender,
                    image: dataUserNew.avatar,
                });
                await user.save();
                resolve({ errorCode: 0, message: 'update user done' });
            }
            resolve({ errorCode: 1, message: 'update user FAIL' });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllCodesService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errorCode: 1,
                    message: "missing parameter 'type'",
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({ where: { type: typeInput }, raw: true });
                res.errorCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    });
};
let handleGetDetailUsersServices = (accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userId = '';
            if (accessToken) {
                jwt.verify(accessToken, process.env.KEY_SECRET_ACCESS_TOKEN, (err, payload) => {
                    if (err) {
                        resolve({ errorCode: 1, message: 'token is not valid' });
                    }
                    userId = payload.id;
                });
            } else {
                resolve({ errorCode: 1, message: 'You are not authenticated' });
            }
            if (userId) {
                let dataUser = await db.User.findOne({
                    where: { id: userId },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Booking, as: 'dataAcc' },
                    ],
                    attributes: { exclude: ['password'] },
                });
                if (dataUser && dataUser.image) {
                    let imagebase64 = '';
                    imagebase64 = new Buffer.from(dataUser.image, 'base64').toString('binary');
                    dataUser.image = imagebase64;
                }
                resolve({ errorCode: 0, data: dataUser });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLoginServices,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    getAllCodesService,
    registerServices,
    handleGetDetailUsersServices,
};
