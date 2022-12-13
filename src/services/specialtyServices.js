import db from '../models';

let postSpecialtyServices = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.descriptionHtml || !data.descriptionMarkdown || !data.image || !data.specialty) {
                resolve({ errorCode: 1, message: 'Missing parameter' });
            } else {
                await db.Specialty.create({
                    name: data.specialty,
                    descriptionHtml: data.descriptionHtml,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.image,
                });
            }
            resolve({ errorCode: 0, message: 'Save specialty success' });
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

module.exports = {
    postSpecialtyServices,
    getAllSpecialtyServices,
    getSpecialtyByIdServices,
};
