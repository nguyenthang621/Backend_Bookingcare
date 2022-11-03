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
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map((item) => {
                    let imagebase64 = '';
                    imagebase64 = new Buffer.from(item.image, 'base64').toString('binary');
                    item.image = imagebase64;
                    return item;
                });
            }
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
                let imagebase64 = '';
                imagebase64 = new Buffer.from(data.image, 'base64').toString('binary');
                data.image = imagebase64;
            }
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
