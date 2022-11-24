import db from '../models';
import { sendEmailService } from '../services/emailServices';
import { v4 as uuidv4 } from 'uuid';
import { reject } from 'lodash';

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
                    resolve({ errorCode: 0, message: `Missing ${listReq[i]}` });
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
                resolve({ errorCode: 1, message: 'Booing a appointment FAIL' });
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
                    resolve({ errorCode: 0, message: 'Booing a appointment SUCCESS' });
                } else {
                    resolve({ errorCode: 0, message: 'Bác si đã có lịch hẹn với bệnh nhân này' });
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

module.exports = {
    patientBookAppointmentServices,
    verifyAppointmentServices,
};
