import doctorServices from '../services/doctorServices';

let getTopDoctorHome = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!limit) limit = 10;
        let response = await doctorServices.getTopDoctorHomeService(+limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            message: 'Error in server...',
        });
    }
};

let getAllDoctors = async (req, res) => {
    try {
        let response = await doctorServices.getAllDoctorsServices();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errorCode: 1, message: 'get all doctor fail' });
    }
};

let saveDetailDoctor = async (req, res) => {
    try {
        let data = req.body;
        let response = await doctorServices.saveDetailDoctorService(data);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errorCode: 1, message: 'Save detail doctor fail' });
    }
};

let getDetailDoctorById = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(400).json({ errorCode: 1, message: 'Missing parameter id' });
        } else {
            let data = await doctorServices.getDetailDoctorByIdServices(id);
            return res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errorCode: 1, message: 'Get detail doctor fail' });
    }
};

let saveScheduleDoctor = async (req, res) => {
    try {
        let arrSchedule = req.body;
        let accessToken = req.headers.accesstoken;
        let response = await doctorServices.saveScheduleDoctorService(arrSchedule, accessToken);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errorCode: 1, message: 'save schedule doctor fail' });
    }
};
// let deleteSchedule = async (req, res) => {
//     try {
//         let arrSchedule = req.body;
//         let response = await doctorServices.deleteScheduleService(arrSchedule);
//         return res.status(200).json(response);
//     } catch (error) {
//         console.log(error);
//         return res.status(200).json({ errorCode: 1, message: 'delete schedule fail' });
//     }
// };

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        let date = req.query.date;
        let response = await doctorServices.getScheduleDoctorByDateService(doctorId, date);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errorCode: 1, message: 'get schedule doctor fail' });
    }
};
let getAppointmentDoctorByDate = async (req, res) => {
    try {
        let { doctorId, date, statusId } = req.query;
        if (!statusId) {
            statusId = 'S3';
        }
        let response = await doctorServices.getAppointmentDoctorByDateService(doctorId, date, statusId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errorCode: 1, message: 'get appointment doctor fail' });
    }
};
let confirmRemedy = async (req, res) => {
    try {
        let data = req.body;
        let response = await doctorServices.confirmRemedyServices(data);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ errorCode: 1, message: 'Confirm remedy and send mail fail, pls again' });
    }
};

let filterAndPaging = async (req, res) => {
    try {
        let { page, limit, keyword, roleId } = req.query;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;
        limit = +limit || 10;
        roleId = roleId || 'R2';
        let response = await doctorServices.filterAndPagingServices({ offset, limit, keyword, roleId });
        if (response && response.errorCode === 0) return res.status(200).json(response);
        else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ errorCode: 1, message: 'Có lỗi xảy ra ở server' });
    }
};

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailDoctor,
    getDetailDoctorById,
    saveScheduleDoctor,
    getScheduleDoctorByDate,
    getAppointmentDoctorByDate,
    confirmRemedy,
    filterAndPaging,
    // deleteSchedule
};
