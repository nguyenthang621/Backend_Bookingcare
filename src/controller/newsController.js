import newsServices from '../services/newsServices';

let postNews = async (req, res) => {
    try {
        let data = req.body;
        let accessToken = req.headers.accesstoken;
        let response = await newsServices.postNewsServices(data, accessToken);
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
let getNews = async (req, res) => {
    try {
        let { id, type, statusId } = req.query;

        let response = await newsServices.getNewsServices(id, type, statusId);
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
let confirmNews = async (req, res) => {
    try {
        let accessToken = req.headers.accesstoken;
        let id = req.query.id;
        let response = await newsServices.confirmNewsServices(id, accessToken);
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
let deleteNews = async (req, res) => {
    try {
        let id = req.query.id;
        let response = await newsServices.deleteNewsServices(id);
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
let checkQueueNews = async (req, res) => {
    try {
        let response = await newsServices.checkQueueNewsServices();
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

module.exports = {
    postNews,
    getNews,
    confirmNews,
    deleteNews,
    checkQueueNews,
};
