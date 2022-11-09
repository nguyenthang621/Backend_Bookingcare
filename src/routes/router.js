import express from 'express';
import homeController from '../controller/homeController';
import userController from '../controller/userController';
import doctorController from '../controller/doctorController';
import patientController from '../controller/patientController';
import specialtyController from '../controller/specialtyController';
import clinicController from '../controller/clinicController';
import middlewareController from '../middleware/middlewareController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.createCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.getCRUD);
    router.get('/get-user-edit/:id', homeController.getUserEdit);
    router.post('/update-user', homeController.updateUser);
    router.get('/delete-user/:id', homeController.deleteUser);

    // api user:
    router.post('/api/login', middlewareController.createToken);
    router.get('/api/get-users', middlewareController.verifyDoctor, userController.handleGetUsers);
    router.post('/api/create-user', middlewareController.verifyAdmin, userController.handleCreateUser);
    router.put('/api/update-user', middlewareController.verifyAdmin, userController.handleUpdateUser);
    router.delete('/api/delete-user', middlewareController.verifyAdmin, userController.handleDeleteUser);

    // delete schedule expired
    // router.post('/api/delete-schedule', middlewareController.verifyDoctor, doctorController.deleteSchedule);

    //doctor
    router.get('/api/allcode', userController.getAllCodes);
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor', doctorController.getAllDoctors);
    router.post('/api/save-detail-doctor', doctorController.saveDetailDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/save-schedule-doctor', middlewareController.verifyDoctor, doctorController.saveScheduleDoctor);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);

    //patient
    router.post('/api/patient-booking-appointment', patientController.postBookAppointment);
    router.post('/api/verify-appointment', patientController.verifyBookAppointment);
    // specialty
    router.post('/api/post-specialty', specialtyController.postSpecialty);
    router.get('/api/all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-specialty-by-id', specialtyController.getSpecialtyById);
    // detail clinic
    router.post('/api/post-detail-clinic', clinicController.postDetailClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    return app.use('/', router);
};

module.exports = initWebRoutes;
