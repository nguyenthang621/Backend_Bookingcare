import userController from '../services/userServices';
import userServices from '../services/userServices';
import { signAccessToken, signRefreshToken } from '../services/jwt_Services';

let handleLogin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(200).json({ errorCode: 1, message: 'Missing form' });
    }
    let dataUser = await userController.handleUserLoginServices(email, password);
    if (dataUser && dataUser.errorCode === 0) {
        let payload = dataUser.user;
        const accessToken = await signAccessToken(payload);
        const refreshToken = await signRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            // httpOnly:true,
            secure: false,
            path: '/',
            sameSite: 'strict',
        });
        return res.status(200).json({ errorCode: 0, accessToken });
    } else {
        return res.status(200).json(dataUser);
    }
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
let handleGetDetailUsers = async (req, res) => {
    try {
        let accessToken = req.headers.accesstoken;
        let response = await userServices.handleGetDetailUsersServices(accessToken);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

let handleCreateUser = async (req, res) => {
    try {
        let message = await userServices.createUser(req.body);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(200).json({ errorCode: 1, message: 'create fail, pls again' });
    }
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
        res.status(200).json({ errorCode: 1, message: 'get data from database fail' });
    }
};
let register = async (req, res) => {
    try {
        let data = req.body;
        let response = await userServices.registerServices(data);
        res.status(200).json(response);
    } catch (error) {
        console.log('register fail ', error);
        res.status(200).json({ errorCode: 1, message: 'Register fail, pls again' });
    }
};

module.exports = {
    handleLogin,
    handleGetUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    getAllCodes,
    register,
    handleGetDetailUsers,
};
