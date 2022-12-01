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
                return res.status(200).json({
                    errorCode: 1,
                    message: `Missing ${dataInput[i]}`,
                });
            }
        }
        let message = await clinicServices.postDetailClinicServices(data);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

let getAllClinic = async (req, res) => {
    try {
        let response = await clinicServices.getAllClinicServices(req.query.isGetImageClinic);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

let getDetailClinicById = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errorCode: 1,
                message: 'Missing parameter',
            });
        } else {
            let response = await clinicServices.getDetailClinicByIdServices(id);
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};
module.exports = {
    postDetailClinic,
    getAllClinic,
    getDetailClinicById,
};
