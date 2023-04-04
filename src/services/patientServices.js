import db from '../models';
import { sendEmailService } from '../services/emailServices';
import { getAllCodesService } from '../services/userServices';
// import sequelize from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../config/connectDB.js';
import { Op } from 'sequelize';

let builtURLEmail = (doctorId, uuid) => {
    let URL = '';
    URL = `${process.env.URL_REACT}/verify-booking?uuid=${uuid}&doctorId=${doctorId}`;
    return URL;
};
let patientBookAppointmentServices = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listReq = [
                'email',
                'bookFor',
                'doctorId',
                'date',
                'timeType',
                'gender',
                'namePatient',
                'YearOfBirth',
                'IDNumber',
                'phoneNumber',
                'address',
            ];
            for (let i = 0; i < listReq.length; i++) {
                if (!data[listReq[i]]) {
                    resolve({ errorCode: 1, message: `Missing ${listReq[i]}` });
                }
            }
            let uuid = uuidv4();
            let redirectLink = builtURLEmail(data.doctorId, uuid);
            await sendEmailService(data, redirectLink);
            let [user, created] = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                },
                raw: true,
                nest: true,
            });
            if (!user) {
                resolve({ errorCode: 1, message: 'Lỗi không tìm thấy người dùng.' });
            } else {
                let created = await db.Booking.findOrCreate({
                    where: {
                        namePatient: data.namePatient.trim(),
                        IDNumber: data.IDNumber,
                        doctorId: data.doctorId,
                        date: data.date,
                        patientId: user.id,
                    },
                    defaults: {
                        bookFor: data.bookFor,
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        date: data.date,
                        timeType: data.timeType,
                        IDNumber: data.IDNumber,
                        gender: data.gender,
                        namePatient: data.namePatient.trim(),
                        YearOfBirth: data.YearOfBirth,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                        reason: data.reason,
                        uuid: uuid,
                        patientId: user.id,
                    },
                    raw: true,
                    nest: true,
                });
                if (created[1]) {
                    resolve({ errorCode: 0, message: 'Đặt lịch hẹn thành công vui lòng kiểm tra Email để xác nhận.' });
                } else {
                    resolve({ errorCode: 0, message: 'Bác sĩ đã có lịch hẹn với bệnh nhân này' });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let verifyAppointmentServices = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.uuid) {
                resolve({
                    errorCode: 1,
                    message: 'Missing parameter',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: { doctorId: data.doctorId, uuid: data.uuid, statusId: 'S1' },
                });
                if (appointment) {
                    appointment.update({
                        statusId: 'S2',
                    });
                    await appointment.save();
                    resolve({
                        errorCode: 0,
                        message: 'Update statusId success',
                    });
                } else {
                    resolve({
                        errorCode: 2,
                        message: 'This appointment is not available',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

const matchKey = (key, arr) => {
    for (let item of arr) {
        if (item.keyMap === key) return item.valueVi;
    }
    return 'Bác sĩ';
};

const searchAllServices = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const results = {};
            let doctors = [];
            let clinics = [];
            let specialtys = [];
            if (keyword) {
                doctors = await db.User.findAll({
                    where: {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${keyword}%` }, lastName: { [Op.like]: `%${keyword}%` } },
                        ],
                        [Op.and]: [{ roleId: 'R2' }],
                    },
                    attributes: ['id', 'firstName', 'lastName', 'roleId', 'position'],
                    raw: true,
                    nest: true,
                });
                clinics = await db.Clinics.findAll({
                    where: {
                        [Op.or]: [{ nameClinic: { [Op.like]: `%${keyword}%` } }],
                    },
                    attributes: ['id', 'nameClinic', 'imageClinic'],
                    raw: true,
                    nest: true,
                });
                specialtys = await db.Specialty.findAll({
                    where: {
                        [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }],
                    },
                    attributes: ['id', 'name', 'image'],
                    raw: true,
                    nest: true,
                });
            }
            let arrKeyCodePosition = await getAllCodesService('POSITION');
            doctors = doctors.map((item) => {
                let position = matchKey(item.position, arrKeyCodePosition?.data || []);

                return { id: item.id, name: `${position}, ${item.firstName} ${item.lastName}` };
            });
            clinics = clinics.map((item) => {
                return { id: item.id, name: item.nameClinic, image: item.imageClinic };
            });
            results.doctors = doctors;
            results.clinics = clinics;
            results.specialtys = specialtys;

            if (!results) resolve({ errorCode: 1, message: 'Có lỗi xảy ra vui lòng thử lại.' });
            resolve({ errorCode: 0, results });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    patientBookAppointmentServices,
    verifyAppointmentServices,
    searchAllServices,
};
