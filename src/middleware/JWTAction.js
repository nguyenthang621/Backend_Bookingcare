import jwt from 'jsonwebtoken';
require('dotenv').config();
// import db from '../models';
import userController from '../services/userServices';

const createToken = async (req, res, next) => {
    let token = null;
    try {
        let email = req.body.email;
        let password = req.body.password;
        if (!email || !password) {
            return res.status(500).json({ errorCode: 1, message: 'missing form' });
        }
        let dataUser = await userController.handleUserLogin(email, password);
        if (dataUser && dataUser.errorCode === 0) {
            let payload = dataUser.user;
            let key = process.env.KEY_SECRET_TOKEN;

            token = jwt.sign(payload, key, { expiresIn: '1h' });
            req.body.token = token;
            res.cookie('token', token, {
                // httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'Strict',
            });
            next();
        } else {
            return res.status(200).json({ errorCode: 1, message: 'Wrong email or password' });
        }
    } catch (error) {
        console.log(error);
        return error;
    }
    return token;
};

module.exports = { createToken };
