import { patientBookAppointmentServices, verifyAppointmentServices } from '../services/patientServices';

let postBookAppointment = async (req, res) => {
    try {
        let response = await patientBookAppointmentServices(req.body);
        if (response && response.errorCode === 0) {
            return res.status(200).json(response);
        } else {
            return res.status(200).json(response);
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: 1,
            message: 'Post book appointment FAIL',
        });
    }
};

let verifyBookAppointment = async (req, res) => {
    try {
        let response = await verifyAppointmentServices(req.body);
        if (response && response.errorCode === 0) {
            return res.status(200).json(response);
        } else {
            return res.status(200).json(response);
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    postBookAppointment,
    verifyBookAppointment,
};
