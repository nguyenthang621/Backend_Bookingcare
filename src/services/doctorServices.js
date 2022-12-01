import db from '../models';
import _, { reject } from 'lodash';
require('dotenv').config();
import jwt from 'jsonwebtoken';

import { getAllCodesService } from '../services/userServices';
import { sendEmailRemedyService, sendEmailCancelAppointmentService } from '../services/emailServices';

let getTopDoctorHomeService = async (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                // attributes: { exclude: ['password'] },
                attributes: ['id', 'firstName', 'lastName', 'image', 'email'],
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: ['id', 'doctorId', 'specialtyId', 'nameClinic'],
                    },
                ],
                raw: true,
                nest: true,
            });

            if (!doctors) {
                resolve({
                    errorCode: 1,
                    message: 'cant get top doctor',
                });
            } else {
                if (doctors && doctors.length > 0) {
                    doctors.map((item) => {
                        let imagebase64 = '';
                        imagebase64 = new Buffer.from(item.image, 'base64').toString('binary');
                        item.image = imagebase64;
                        return item;
                    });
                }
                resolve({
                    errorCode: 0,
                    data: doctors,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllDoctorsServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let allDoctor = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: [
                        'email',
                        'createdAt',
                        'address',
                        'image',
                        'password',
                        'phoneNumber',
                        'position',
                        'roleId',
                        'updatedAt',
                    ],
                },
                raw: true,
            });
            if (!allDoctor) {
                resolve({
                    errorCode: 1,
                    message: 'there are no doctors',
                });
            } else {
                resolve({
                    errorCode: 0,
                    data: allDoctor,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let saveDetailDoctorService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listData = [
                'doctorId',
                'contentHTML',
                'contentMarkdown',
                'selectedPrice',
                'selectedPayment',
                'selectedProvince',
                'selectedSpecialty',
                'nameClinic',
                'addressClinic',
                'note',
                'isChange',
            ];
            for (let i = 0; i < listData.length; i++) {
                if (!data[listData[i]]) {
                    resolve({
                        errorCode: 1,
                        message: `missing ${listData[i]}`,
                    });
                }
            }
            if (data.isChange == 'true') {
                let doctor = await db.Markdown.findOne({ where: { doctorId: data.doctorId } });
                if (doctor) {
                    await doctor.update({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    });
                    await doctor.save();
                }
            } else {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                });
            }
            // upsert doctor information:
            let doctorInfor = await db.Doctor_Infor.findOne({
                where: { doctorId: data.doctorId },
            });
            if (doctorInfor) {
                await doctorInfor.update({
                    doctorId: data.doctorId,
                    priceId: data.selectedPrice,
                    paymentId: data.selectedPayment,
                    provinceId: data.selectedProvince,
                    specialtyId: data.selectedSpecialty,
                    nameClinic: data.nameClinic,
                    addressClinic: data.addressClinic,
                    note: data.note,
                });
                await doctorInfor.save();
            } else {
                await db.Doctor_Infor.create({
                    doctorId: data.doctorId,
                    priceId: data.selectedPrice,
                    paymentId: data.selectedPayment,
                    provinceId: data.selectedProvince,
                    specialtyId: data.selectedSpecialty,
                    nameClinic: data.nameClinic,
                    addressClinic: data.addressClinic,
                    note: data.note,
                });
            }
            resolve({
                errorCode: 0,
                message: 'save doctor information done',
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailDoctorByIdServices = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({
                where: { id: id },
                attributes: { exclude: ['password'], include: ['firstName', 'lastName'] },
                include: [
                    { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorId'],
                        },
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['keyMap', 'valueEn', 'valueVi'] },
                            { model: db.Specialty, as: 'specialtyData', attributes: ['id', 'name'] },
                            { model: db.Clinics, as: 'clinicData', attributes: ['id', 'nameClinic'] },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            if (data && data.image) {
                let imagebase64 = '';
                imagebase64 = new Buffer.from(data.image, 'base64').toString('binary');
                data.image = imagebase64;
            }
            resolve({
                errorCode: 0,
                data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let saveScheduleDoctorService = (data, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId) {
                if (accessToken) {
                    jwt.verify(accessToken, process.env.KEY_SECRET_ACCESS_TOKEN, (err, payload) => {
                        if (err) {
                            resolve({ errorCode: 1, message: 'token is not valid' });
                        }
                        data.doctorId = +payload.id;
                    });
                }
            }
            if (!data.doctorId && !data.date && !data.arrSchedule) {
                resolve({
                    errorCode: 1,
                    message: 'Missing information',
                });
            } else {
                let arrSchedule = data.arrSchedule;

                arrSchedule.map((item) => {
                    item.maxNumber = process.env.MAX_NUMBER_SCHEDULE;
                    item.date = item.date.toString();
                    item.doctorId = data.doctorId;
                    return item;
                });

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                });

                let arrTimeTypeExisting = existing.map((item) => item.timeType);
                let arrTimeTypeSchedule = arrSchedule.map((item) => item.timeType);
                let toDelete = arrTimeTypeExisting.filter((item) => {
                    if (!arrTimeTypeSchedule.includes(item)) {
                        return item;
                    }
                });

                let toCreate = _.differenceWith(arrSchedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
                });

                if (toDelete && toDelete.length > 0) {
                    await db.Schedule.destroy({
                        where: {
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: toDelete,
                        },
                    });
                    resolve({
                        errorCode: 0,
                        message: 'Save schedule done',
                    });
                }

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                    resolve({
                        errorCode: 0,
                        message: 'Save schedule done',
                    });
                } else {
                    resolve({
                        errorCode: 1,
                        message: 'You have already created this appointment',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getScheduleDoctorByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId && !date) {
                resolve({ errorCode: 1, message: 'Missing parameter' });
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [{ model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }],
                    raw: true,
                    nest: true,
                });
                if (data && data.length > 0) {
                    resolve({ errorCode: 0, data });
                } else {
                    resolve({ errorCode: 0, message: 'No schedule', data });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAppointmentDoctorByDateService = (doctorId, date, statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId && !date) {
                resolve({ errorCode: 1, message: 'Missing parameter appointment' });
            } else {
                let data = await db.Booking.findAll({
                    where: { doctorId: doctorId, date: date, statusId: statusId },
                    attributes: { exclude: ['uuid'] },
                    include: [
                        { model: db.Allcode, as: 'timeAppointment', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderDT', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'dataAcc', attributes: ['firstName', 'email', 'lastName'] },
                        { model: db.User, as: 'dataAccDoctor', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: true,
                    nest: true,
                });
                if (data && data.length > 0) {
                    resolve({ errorCode: 0, data });
                } else {
                    resolve({ errorCode: 0, message: 'No appointment', data });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

let confirmRemedyServices = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errorCode: 1,
                    message: 'Missing parameter',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2',
                    },
                });
                if (appointment) {
                    if (data && data.isDestroyAppointment) {
                        appointment.statusId = 'S4';
                        await appointment.save();
                        await sendEmailCancelAppointmentService(data, 'http://localhost:5000/home');
                    } else {
                        appointment.statusId = 'S3';
                        await appointment.save();
                        await sendEmailRemedyService(data, 'http://localhost:5000/home');
                    }
                    resolve({
                        errorCode: 0,
                        message: 'Confirm and send email success',
                    });
                } else {
                    resolve({
                        errorCode: 1,
                        message: 'The patient has not confirmed the order or has canceled the order',
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = {
    getTopDoctorHomeService,
    getAllDoctorsServices,
    saveDetailDoctorService,
    getDetailDoctorByIdServices,
    saveScheduleDoctorService,
    getScheduleDoctorByDateService,
    getAppointmentDoctorByDateService,
    confirmRemedyServices,
};
