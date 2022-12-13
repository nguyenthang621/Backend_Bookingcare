import _, { reject } from 'lodash';
import db from '../models';

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
                message: 'Create clinic success',
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllClinicServices = async (isGetImageClinic) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (isGetImageClinic) {
                data = await db.Clinics.findAll({
                    attributes: ['id', 'nameClinic', 'imageClinic'],
                    raw: true,
                });
            } else {
                data = await db.Clinics.findAll({
                    attributes: ['id', 'nameClinic'],
                    raw: true,
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

module.exports = {
    postDetailClinicServices,
    getAllClinicServices,
    getDetailClinicByIdServices,
};
