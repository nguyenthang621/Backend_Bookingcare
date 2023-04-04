import jwt from 'jsonwebtoken';
require('dotenv').config();

import _ from 'lodash';
const middlewareController = {
    verifyToken: (req, res, next) => {
        try {
            let accessToken = req.headers.accesstoken;
            if (accessToken) {
                jwt.verify(accessToken, process.env.KEY_SECRET_ACCESS_TOKEN, (err, payload) => {
                    if (err) {
                        return res.status(200).json({ errorCode: 1, message: 'Token is not valid' });
                    }
                    req.payload = payload;
                    next();
                });
            } else {
                return res.status(403).json({ errorCode: 1, message: 'You are not authenticated' });
            }
        } catch (error) {
            return res.status(401).json({ errorCode: 1, message: 'error:You are not authenticated' });
        }
    },

    verifyDoctor: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            try {
                let dataToken = req.payload;
                if (dataToken.roleId === 'R2' || dataToken.roleId === 'R1') {
                    next();
                } else {
                    return res.status(403).json({ errorCode: 1, message: 'You are not doctor or admin' });
                }
            } catch (error) {
                return res.status(401).json({ errorCode: 1, message: 'You are not doctor or admin' });
            }
        });
    },

    verifyAdmin: (req, res, next) => {
        middlewareController.verifyDoctor(req, res, () => {
            try {
                let dataToken = req.payload;

                if (dataToken.roleId === 'R1') {
                    next();
                } else {
                    return res.status(403).json({ errorCode: 1, message: 'You are not admin' });
                }
            } catch (error) {
                return res.status(401).json({ errorCode: 1, message: 'You are not admin' });
            }
        });
    },
};

module.exports = middlewareController;
