import handbookServices from '../services/handbookServices';

let postHandbook = async (req, res) => {
    try {
        let data = req.body;
        let accessToken = req.headers.accesstoken;
        let response = await handbookServices.postHandbookServices(data, accessToken);
        if (response) {
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            message: 'Error in server...',
        });
    }
};
let getHandbook = async (req, res) => {
    try {
        let { id, type, statusId } = req.query;

        let response = await handbookServices.getHandbookServices(id, type, statusId);
        if (response) {
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            message: 'Error in server...',
        });
    }
};
let confirmHandbook = async (req, res) => {
    try {
        let accessToken = req.headers.accesstoken;
        let id = req.query.id;
        let response = await handbookServices.confirmHandbookServices(id, accessToken);
        if (response) {
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            message: 'Error in server...',
        });
    }
};
let deleteHandbook = async (req, res) => {
    try {
        let id = req.query.id;
        let response = await handbookServices.deleteHandbookServices(id);
        if (response) {
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            message: 'Error in server...',
        });
    }
};
let checkQueueHandbook = async (req, res) => {
    try {
        let response = await handbookServices.checkQueueHandbookServices();
        if (response) {
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: 1,
            message: 'Error in server...',
        });
    }
};
let pagingHandbook = async (req, res) => {
    try {
        let { page, limit, statusId } = req.query;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;
        limit = +limit || 5;

        let response = await handbookServices.PagingHandbookServices({ offset, limit, statusId });
        if (response && response.errorCode === 0) return res.status(200).json(response);
        else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errorCode: 1, message: 'Có lỗi xảy ra!' });
    }
};

module.exports = {
    postHandbook,
    getHandbook,
    confirmHandbook,
    deleteHandbook,
    checkQueueHandbook,
    pagingHandbook,
};
