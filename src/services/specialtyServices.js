import db from '../models';
import { Op } from 'sequelize';

let postSpecialtyServices = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            if (!data.descriptionHtml || !data.image || !data.specialty) {
                resolve({ errorCode: 1, message: 'Missing parameter' });
            } else {
                await db.Specialty.create({
                    name: data.specialty,
                    descriptionHtml: data.descriptionHtml,
                    descriptionMarkdown: data.descriptionMarkdown || '',
                    image: data.image,
                });
            }
            resolve({ errorCode: 0, message: 'Lưu chuyên khoa thành công.' });
        } catch (error) {
            reject(error);
        }
    });
};
let getAllSpecialtyServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                attributes: ['id', 'name', 'image'],
            });

            resolve({ errorCode: 0, data });
        } catch (error) {
            reject(error);
        }
    });
};
let getSpecialtyByIdServices = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let doctorsInfor = {};
            data = await db.Specialty.findOne({
                where: { id: id },
                raw: true,
                nest: true,
            });

            if (data) {
                if (location === 'ALL') {
                    doctorsInfor = await db.Doctor_Infor.findAll({
                        where: { specialtyId: id },
                        attributes: ['doctorId', 'provinceId'],
                        raw: true,
                        nest: true,
                    });
                } else {
                    doctorsInfor = await db.Doctor_Infor.findAll({
                        where: { provinceId: location, specialtyId: id },
                        // include: [{ model: db.Markdown, attributes: ['description'] }],
                        attributes: ['doctorId', 'provinceId'],
                        raw: true,
                        nest: true,
                    });
                }
                if (doctorsInfor) {
                    data.doctor_infor = doctorsInfor;
                }
            }
            resolve({ errorCode: 0, data });
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
                [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }],
            };

            const order = [['id', 'DESC']];
            const attributes = { exclude: ['descriptionHtml', 'descriptionMarkdown'] };
            const { count, rows } = await db.Specialty.findAndCountAll({
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

const deleteSpecialtyByIdServices = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) resolve({ errorCode: 1, message: 'Thiếu id chuyên khoa, vui lòng thử lại.' });
            let specialty = await db.Specialty.findOne({ where: { id: id } });
            if (specialty) {
                await specialty.destroy();
                resolve({ errorCode: 0, message: 'Xoá chuyên khoa thành công' });
            }
            resolve({ errorCode: 1, message: 'Không tìm thấy chuyên khoa, vui lòng load lại trang.' });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postSpecialtyServices,
    getAllSpecialtyServices,
    getSpecialtyByIdServices,
    filterAndPagingServices,
    deleteSpecialtyByIdServices,
};
