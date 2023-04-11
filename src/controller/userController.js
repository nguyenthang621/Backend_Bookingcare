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

        // res.cookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     secure: false,
        //     path: '/',
        //     sameSite: 'strict',
        // });
        return res.status(200).json({ errorCode: 0, accessToken, refreshToken });
    } else {
        return res.status(400).json(dataUser);
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
        let id = req.params.id;
        let response = await userServices.handleGetDetailUsersServices(accessToken, id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
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
        res.status(500).json({ errorCode: 1, message: 'create fail, pls again' });
    }
};

let handleUpdateUser = async (req, res) => {
    try {
        let message = await userServices.updateUser(req.body);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json(message);
    }
};

let handleDeleteUser = async (req, res) => {
    try {
        let message = await userServices.deleteUser(req.body.id);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json(message);
    }
};

let getAllCodes = async (req, res) => {
    try {
        let type = req.query.type;
        let data = await userServices.getAllCodesService(type.toUpperCase());
        if (data && data.data.length > 0) return res.status(200).json(data);
        return res.status(400).json({ errorCode: 1, message: 'get data from database fail' });
    } catch (error) {
        console.log('get all codes failed: ', error);
        return res.status(500).json({ errorCode: 1, message: 'get data from database fail' });
    }
};

let register = async (req, res) => {
    try {
        let data = req.body;
        let response = await userServices.registerServices(data);
        res.status(200).json(response);
    } catch (error) {
        console.log('register fail ', error);
        res.status(400).json({ errorCode: 1, message: 'Register fail, pls again' });
    }
};

let handleFilterUser = async (req, res) => {
    try {
        let { page, limit, keyword, roleId } = req.query;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;
        limit = +limit || 10;
        roleId = roleId || '';
        let response = await userServices.filterAndPagingServices({ offset, limit, keyword, roleId });
        if (response && response.errorCode === 0) return res.status(200).json(response);
        else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ errorCode: 1, message: 'Có lỗi xảy ra ở server' });
    }
};

const uploadImage = async (req, res) => {
    try {
        console.log(req.body);
        return res
            .status(200)
            .json(
                'https://firebasestorage.googleapis.com/v0/b/bookingcare-6a74c.appspot.com/o/files%2Fuser%2Fimg6.jpg?alt=media&token=4433d646-f44d-4ae2-84a9-364b91c484c3',
            );
    } catch (error) {
        console.log(error);
        res.status(500).json({ errorCode: 1, message: 'Có lỗi xảy ra ở server' });
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
    handleFilterUser,
    uploadImage,
};
