import jwt from 'jsonwebtoken';
require('dotenv').config();
import userController from '../services/userServices';

const middlewareController = {
    createToken: async (req, res, next) => {
        let accessToken = null;
        let refreshToken = null;
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

                accessToken = jwt.sign(payload, key, { expiresIn: '30d' });
                refreshToken = jwt.sign(payload, key, { expiresIn: '365d' });
                // req.body.accessToken = accessToken;
                res.cookie('token', refreshToken, {
                    // httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'Strict',
                });
                return res.status(200).json({ errorCode: 0, token: refreshToken, user: payload });
                // next();
            } else {
                return res.status(200).json({ errorCode: 1, message: 'Wrong email or password' });
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    requestRefreshToken: async (req, res) => {
        let refreshToken = req.cookies.refreshToken;
        return res.status.json({ errorCode: 0, refreshToken: refreshToken });
    },

    verifyToken: (req, res, next) => {
        try {
            let token = req.headers.cookie.split('=')[1];
            // let token = req.headers.token;
            if (token) {
                jwt.verify(token, process.env.KEY_SECRET_TOKEN, (err, user) => {
                    if (err) {
                        return res.status(401).json({ errorCode: -1, message: 'token is not valid' });
                    }
                    next();
                });
            } else {
                return res.status(401).json({ errorCode: -1, message: 'You are not authenticated ko co token' });
            }
        } catch (error) {
            return res.status(401).json({ errorCode: -1, message: 'error:You are not authenticated' });
        }
    },

    verifyDoctor: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            try {
                let token = req.headers.cookie.split('=')[1];

                let dataToken = jwt.verify(token, process.env.KEY_SECRET_TOKEN);
                if (dataToken.roleId === 'R2' || dataToken.roleId === 'R1') {
                    next();
                } else {
                    return res.status(401).json({ errorCode: -1, message: 'You are not doctor or admin' });
                }
            } catch (error) {
                return res.status(401).json({ errorCode: -1, message: 'You are not doctor or admin' });
            }
        });
    },

    verifyAdmin: (req, res, next) => {
        middlewareController.verifyDoctor(req, res, () => {
            try {
                let token = req.headers.cookie.split('=')[1];

                let dataToken = jwt.verify(token, process.env.KEY_SECRET_TOKEN);
                if (dataToken.roleId === 'R1') {
                    next();
                } else {
                    return res.status(401).json({ errorCode: -1, message: 'You are not admin' });
                }
            } catch (error) {
                return res.status(401).json({ errorCode: -1, message: 'You are not admin' });
            }
        });
    },
};

module.exports = middlewareController;
