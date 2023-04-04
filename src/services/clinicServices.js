import _, { reject } from 'lodash';
import db from '../models';
import { Op } from 'sequelize';

let postDetailClinicServices = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Clinics.create({
                nameClinic: data.nameClinic,
                addressClinic: data.addressClinic,
                descriptionHtml: data.descriptionHtml,
                descriptionMarkdown: data.descriptionMarkdown,
                imageClinic: data.imageClinic,
                imageLogo: data.imageLogo,
            });
            resolve({
                errorCode: 0,
                message: 'Tạo phòng khám thành công.',
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllClinicServices = async (isGetImageClinic, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (limit === 'ALL') limit = null;
            console.log(isGetImageClinic);
            if (!isGetImageClinic || isGetImageClinic === 'undefined') {
                data = await db.Clinics.findAll({
                    attributes: ['id', 'nameClinic'],
                    raw: true,
                });
            } else {
                data = await db.Clinics.findAll({
                    limit,
                    order: [['createdAt', 'DESC']],
                    attributes: { exclude: ['descriptionHtml', 'descriptionMarkdown'] },
                    raw: true,
                    nest: true,
                });
            }

            if (data && !_.isEmpty(data)) {
                resolve({
                    errorCode: 0,
                    data: data,
                });
            } else {
                resolve({
                    errorCode: 0,
                    data: data,
                    message: 'Not found',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailClinicByIdServices = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinics.findOne({
                where: { id: id },
                raw: true,
                attributes: ['id', 'nameClinic', 'addressClinic', 'descriptionHtml', 'imageClinic', 'imageLogo'],
            });
            let doctors = await db.Doctor_Infor.findAll({
                where: { nameClinic: `${id}` },
                raw: true,
                attributes: ['id', 'doctorId'],
            });

            if (data && !_.isEmpty(data)) {
                if (doctors && !_.isEmpty(doctors)) {
                    data.doctors = doctors;
                }

                resolve({
                    errorCode: 0,
                    data: data,
                });
            } else {
                resolve({
                    errorCode: 1,
                    data: {},
                    message: 'Not found clinic',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let filterAndPagingServices = (q) => {
    return new Promise(async (resolve, reject) => {
        try {
            const keyword = q.keyword ? q.keyword.trim() : '';
            const where = {
                [Op.or]: [
                    { nameClinic: { [Op.like]: `%${keyword}%` } },
                    { addressClinic: { [Op.like]: `%${keyword}%` } },
                ],
            };

            const order = [['id', 'DESC']];
            const attributes = { exclude: ['descriptionHtml', 'descriptionMarkdown'] };
            const { count, rows } = await db.Clinics.findAndCountAll({
                where,
                order,
                offset: q.offset,
                limit: q.limit,
                attributes,
                raw: true,
                nest: true,
            });
            const totalPage = Math.ceil(Number(count) / Number(q.limit));

            resolve({ errorCode: 0, data: { rows, count, totalPage } });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteClinicByIdServices = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) resolve({ errorCode: 1, message: 'Thiếu id phòng khám, vui lòng thử lại.' });
            let clinic = await db.Clinics.findOne({ where: { id: id } });
            if (clinic) {
                await clinic.destroy();
                resolve({ errorCode: 0, message: 'Xoá phòng khám thành công' });
            }
            resolve({ errorCode: 1, message: 'Không tìm thấy phòng khám, vui lòng load lại trang.' });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postDetailClinicServices,
    getAllClinicServices,
    getDetailClinicByIdServices,
    filterAndPagingServices,
    deleteClinicByIdServices,
};
