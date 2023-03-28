import {
    postSpecialtyServices,
    getAllSpecialtyServices,
    getSpecialtyByIdServices,
    getDetailSpecialtyByIdServices,
    filterAndPagingServices,
    deleteSpecialtyByIdServices,
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
        let { id, location } = req.query;
        location = location || 'ALL';
        let response = await getSpecialtyByIdServices(id, location);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(402).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

let filterAndPagingSpecialty = async (req, res) => {
    try {
        let { page, limit, keyword } = req.query;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;
        limit = +limit || 5;
        let response = await filterAndPagingServices({ offset, limit, keyword });
        if (response && response.errorCode === 0) return res.status(200).json(response);
        else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errorCode: 1, message: 'Có lỗi xảy ra!' });
    }
};

let deleteSpecialtyById = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(200).json({
                errorCode: 1,
                message: 'Missing parameter',
            });
        } else {
            let response = await deleteSpecialtyByIdServices(id);
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    postSpecialty,
    getAllSpecialty,
    getSpecialtyById,
    filterAndPagingSpecialty,
    deleteSpecialtyById,
};
