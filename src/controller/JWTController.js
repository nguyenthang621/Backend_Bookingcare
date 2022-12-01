import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/jwt_Services';
import _ from 'lodash';
import client from '../config/connectRedis';
var createError = require('http-errors');

let requestRefreshToken = async (req, res) => {
    try {
        let refreshToken = req.cookies?.refreshToken;

        if (!refreshToken || _.isEmpty(refreshToken)) {
            return res.status(200).json({ errorCode: 1, message: 'You are not authenticated' });
        }

        let payload = await verifyRefreshToken(refreshToken);
        // create newAccessToken and newRefreshToken:
        if (payload && payload?.iat && payload?.exp && !_.isEmpty(payload)) {
            delete payload.iat;
            delete payload.exp;
        }
        const newAccessToken = await signAccessToken(payload);
        const newRefreshToken = await signRefreshToken(payload);

        res.cookie('refreshToken', newRefreshToken, {
            // httpOnly:true,
            secure: false,
            path: '/',
            sameSite: 'strict',
        });
        return res.status(200).json({
            errorCode: 0,
            accessToken: newAccessToken,
        });
    } catch (error) {
        return res.status(200).json({ errorCode: 1, message: 'Error from server' });
    }
};

let logoutUser = async (req, res) => {
    try {
        let refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(200).json({
                errorCode: 1,
                message: 'Missing refreshToken',
            });
        }
        let payload = await verifyRefreshToken(refreshToken);
        let userId = payload.id;
        client.del(userId.toString(), (err, reply) => {
            if (err)
                return res.status(402).json({
                    errorCode: 1,
                    message: 'you are not a user please try again',
                });
            return res.status(200).json({
                errorCode: 0,
                message: 'Logout done',
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            errorCode: 1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    requestRefreshToken,
    logoutUser,
};
