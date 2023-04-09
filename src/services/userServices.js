import db from '../models';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

const salt = bcrypt.genSaltSync(10);

let handleUserLoginServices = (email, password) => {
    console.log(email, password);
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
            console.log('error:', error);
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
                        message: 'Mật khẩu sai.',
                    });
                }
            } else {
                resolve({
                    errorCode: 1,
                    message: 'Không tìm thấy người dùng này.',
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
                    message: 'Email này đã được đăng kí.',
                });
            } else {
                if (!data.email || !data.password || !data.firstName || !data.lastName || !data.address) {
                    resolve({
                        errorCode: 1,
                        message: 'Điền đầy thủ thông tin.',
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
                        imageURL: data.fileURL,
                    });

                    resolve({
                        errorCode: 0,
                        message: 'Tạo người dùng thành công.',
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
                    message: 'Email này đã được sử dụng.',
                });
            } else {
                let arrValidate = [
                    { value: 'firstName', text: 'Họ' },
                    { value: 'lastName', text: 'Tên' },
                    { value: 'email', text: 'email' },
                    { value: 'phoneNumber', text: 'số điện thoại' },
                    { value: 'password', text: 'mật khẩu' },
                    { value: 'confirmPassword', text: 'xác nhận mật khẩu' },
                ];
                for (let item of arrValidate) {
                    if (!data[item.value]) {
                        resolve({
                            errorCode: 1,
                            message: `Vui lòng nhập đầy đủ thông tin, thiếu ${item.text}`,
                        });
                    }
                }
                // if (!data.firstName || !data.lastName ||!data.email || !data.password || !data.confirmPassword) {
                //     resolve({
                //         errorCode: 1,
                //         message: 'Fill in the missing user information, please fill in all the information',
                //     });
                // } else
                if (data.password !== data.confirmPassword) {
                    resolve({
                        errorCode: 1,
                        message: 'Vui lòng xác nhận lại mật khẩu.',
                    });
                } else {
                    await db.User.create({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber,
                        email: data.email,
                        password: hashPassword,
                        roleId: 'R3',
                    });
                    resolve({
                        errorCode: 0,
                        message: 'Đăng kí thành công',
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
            if (!userId) resolve({ errorCode: 1, message: 'Không tìm thấy ID người dùng, hoặc người dùng đã bị xoá' });
            let user = await db.User.findOne({ where: { id: userId } });
            let doctorInfor = await db.Doctor_Infor.findOne({ where: { doctorId: userId } });
            if (user) {
                await user.destroy();
                if (doctorInfor) {
                    await doctorInfor.destroy();
                    resolve({ errorCode: 0, message: 'Xoá bác sĩ thành công.' });
                }
                resolve({ errorCode: 0, message: 'Xoá người dùng thành công.' });
            }
            resolve({ errorCode: 1, message: 'Không tìm thấy người dùng trong hệ thống' });
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
                    message: 'Missing parameter',
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
                    imageURL: dataUserNew.fileURL,
                });
                await user.save();
                resolve({ errorCode: 0, message: 'Cập nhật thông tin thành công.' });
            }
            resolve({ errorCode: 1, message: 'Cập nhật thông tin thất bại' });
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
                    message: "Missing parameter 'type'",
                });
            } else {
                let res = {};
                let allcodes = await db.Allcode.findAll({ where: { type: typeInput }, raw: true });
                res.errorCode = 0;
                res.data = allcodes;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    });
};
let handleGetDetailUsersServices = (accessToken, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userId = id;
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

                resolve({ errorCode: 0, data: dataUser });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let filterAndPagingServices = (q) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { offset, limit, keyword, roleId } = q;
            keyword = keyword ? keyword.trim() : '';
            const where = {};
            if (keyword) {
                where[Op.or] = [
                    { firstName: { [Op.like]: `%${keyword}%` } },
                    { lastName: { [Op.like]: `%${keyword}%` } },
                    { email: { [Op.like]: `%${keyword}%` } },
                ];
            }

            if (roleId) {
                where[Op.and] = [{ roleId: { [Op.like]: `${roleId}` } }];
            }

            const order = [['id', 'DESC']];
            const attributes = { exclude: ['password'] };
            const { count, rows } = await db.User.findAndCountAll({
                where,
                order,
                offset: offset,
                limit: limit,
                attributes,
                raw: true,
                nest: true,
            });
            const totalPage = Math.ceil(Number(count) / Number(limit));

            resolve({ errorCode: 0, data: { rows, count, totalPage } });
        } catch (error) {
            reject({ errorCode: 1, message: error });
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
    filterAndPagingServices,
};
