import express from 'express';
// import homeController from '../controller/homeController';
import userController from '../controller/userController';
import doctorController from '../controller/doctorController';
import handbookController from '../controller/handbookController';
import newsController from '../controller/newsController';
import patientController from '../controller/patientController';
import specialtyController from '../controller/specialtyController';
import clinicController from '../controller/clinicController';
import JWTController from '../controller/JWTController';

import middlewareController from '../middleware/middlewareController';

let router = express.Router();

let initWebRoutes = (app) => {
    // api user:
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-users', middlewareController.verifyToken, userController.handleGetUsers);
    router.post('/api/create-user', middlewareController.verifyAdmin, userController.handleCreateUser);
    router.put('/api/update-user', middlewareController.verifyAdmin, userController.handleUpdateUser);
    router.delete('/api/delete-user', middlewareController.verifyAdmin, userController.handleDeleteUser);

    router.post('/api/register', userController.register);

    router.post('/api/refresh-token', JWTController.requestRefreshToken);
    router.post('/api/logout', JWTController.logoutUser);
    router.get('/api/get-detail-users/:id', userController.handleGetDetailUsers);
    router.get('/api/filter-user', middlewareController.verifyToken, userController.handleFilterUser);

    router.post('/api/upload-image', userController.uploadImage);
    // delete schedule expired
    // router.post('/api/delete-schedule', middlewareController.verifyDoctor, doctorController.deleteSchedule);

    //doctor
    router.get('/api/allcode', userController.getAllCodes);
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor', doctorController.getAllDoctors);
    router.post('/api/save-detail-doctor', middlewareController.verifyAdmin, doctorController.saveDetailDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/save-schedule-doctor', middlewareController.verifyDoctor, doctorController.saveScheduleDoctor);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);
    router.get(
        '/api/get-appointment-doctor',
        middlewareController.verifyDoctor,
        doctorController.getAppointmentDoctorByDate,
    );
    router.post('/api/confirm-remedy', doctorController.confirmRemedy);
    router.get('/api/filter-doctor', doctorController.filterAndPaging);

    //patient
    router.post('/api/patient-booking-appointment', patientController.postBookAppointment);
    router.post('/api/verify-appointment', patientController.verifyBookAppointment);
    router.get('/api/search-all', patientController.searchAll);
    router.get('/api/search-all', patientController.searchAll);

    // specialty
    router.post('/api/post-specialty', specialtyController.postSpecialty);
    router.get('/api/all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-specialty-by-id', specialtyController.getSpecialtyById);
    router.get('/api/filter-paging-specialty', specialtyController.filterAndPagingSpecialty);
    router.delete('/api/specialty/:id', middlewareController.verifyAdmin, specialtyController.deleteSpecialtyById);

    // clinic
    router.post('/api/post-detail-clinic', clinicController.postDetailClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.get('/api/filter-paging-clinic', clinicController.filterAndPagingClinic);
    router.delete('/api/clinic/:id', middlewareController.verifyAdmin, clinicController.deleteClinicById);

    // handbook:
    router.post('/api/post-handbook', middlewareController.verifyDoctor, handbookController.postHandbook);
    router.get('/api/get-handbook', handbookController.getHandbook);
    router.post('/api/confirm-handbook', middlewareController.verifyAdmin, handbookController.confirmHandbook);
    router.post('/api/delete-handbook', middlewareController.verifyAdmin, handbookController.deleteHandbook);
    router.get('/api/check-queue-handbook', middlewareController.verifyDoctor, handbookController.checkQueueHandbook);
    router.get('/api/paging-handbook', handbookController.pagingHandbook);

    // news:
    router.post('/api/post-news', middlewareController.verifyDoctor, newsController.postNews);
    router.get('/api/get-news', newsController.getNews);
    router.post('/api/confirm-news', middlewareController.verifyAdmin, newsController.confirmNews);
    router.post('/api/delete-news', middlewareController.verifyAdmin, newsController.deleteNews);
    router.get('/api/check-queue-news', middlewareController.verifyDoctor, newsController.checkQueueNews);

    return app.use('/', router);
};

module.exports = initWebRoutes;
