import {
    postSpecialtyServices,
    getAllSpecialtyServices,
    getSpecialtyByIdServices,
    getDetailSpecialtyByIdServices,
} from '../services/specialtyServices';

let postSpecialty = async (req, res) => {
    try {
        let response = await postSpecialtyServices(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(402).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};
let getAllSpecialty = async (req, res) => {
    try {
        let response = await getAllSpecialtyServices();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(402).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};
let getSpecialtyById = async (req, res) => {
    try {
        let response = await getSpecialtyByIdServices(req.query.id, req.query.location);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(402).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    postSpecialty,
    getAllSpecialty,
    getSpecialtyById,
};
