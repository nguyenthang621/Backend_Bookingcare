import userController from '../services/userServices';
import userServices from '../services/userServices';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    // if (!email || !password) {
    //     return res.status(500).json({ errorCode: 1, message: 'missing form' });
    // }
    let dataUser = await userController.handleUserLogin(email, password);
    // let data = dataUser.errorCode === 0 ? dataUser : undefined;
    // return res.status(200).json({
    //     errorCode: dataUser.errorCode,
    //     message: dataUser.message,
    //     // token: req.body.token,
    //     data,
    // });
    return dataUser;
};

let handleGetUsers = async (req, res) => {
    let userId = req.query.id; // all or id
    if (!userId) {
        return res.status(200).json({
            errorCode: 1,
            message: 'missing required parameter',
            users: [],
        });
    }
    let users = await userServices.getUserById(userId);

    return res.status(200).json({
        errorCode: 0,
        message: 'get users done',
        users,
    });
};

let handleCreateUser = async (req, res) => {
    let message = await userServices.createUser(req.body);
    console.log(message);
    return res.status(200).json(message);
};

let handleUpdateUser = async (req, res) => {
    let message = await userServices.updateUser(req.body);
    return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
    let message = await userServices.deleteUser(req.body.id);
    return res.status(200).json(message);
};

let getAllCodes = async (req, res) => {
    try {
        let type = req.query.type;
        let data = await userServices.getAllCodesService(type);
        res.status(200).json(data);
    } catch (error) {
        console.log('get all codes failed: ', error);
        res.status(200).json({ errorCode: -1, message: 'get data from database fail' });
    }
};

module.exports = {
    handleLogin,
    handleGetUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    getAllCodes,
};
