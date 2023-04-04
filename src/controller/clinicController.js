import clinicServices from '../services/clinicServices';

let postDetailClinic = async (req, res) => {
    try {
        let data = req.body;
        let dataInput = [
            // 'descriptionHtml',
            // 'descriptionMarkdown',
            'imageClinic',
            'imageLogo',
            'nameClinic',
            'addressClinic',
        ];
        for (let i = 0; i < dataInput.length; i++) {
            if (!data[dataInput[i]]) {
                return res.status(400).json({
                    errorCode: 1,
                    message: `Missing ${dataInput[i]}`,
                });
            }
        }
        let message = await clinicServices.postDetailClinicServices(data);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

let getAllClinic = async (req, res) => {
    try {
        let isGetImageClinic = req.query.isGetImageClinic || false;
        let limit = +req.query.limit || 'ALL';
        let response = await clinicServices.getAllClinicServices(isGetImageClinic, limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

let filterAndPagingClinic = async (req, res) => {
    try {
        let { page, limit, keyword } = req.query;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;
        limit = +limit || 5;
        let response = await clinicServices.filterAndPagingServices({ offset, limit, keyword });
        if (response && response.errorCode === 0) return res.status(200).json(response);
        else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errorCode: 1, message: 'Có lỗi xảy ra!' });
    }
};

let getDetailClinicById = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Missing parameter',
            });
        } else {
            let response = await clinicServices.getDetailClinicByIdServices(id);
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
let deleteClinicById = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(200).json({
                errorCode: 1,
                message: 'Missing parameter',
            });
        } else {
            let response = await clinicServices.deleteClinicByIdServices(id);
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
    postDetailClinic,
    getAllClinic,
    getDetailClinicById,
    filterAndPagingClinic,
    deleteClinicById,
};
