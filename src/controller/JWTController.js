import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/jwt_Services';
import _ from 'lodash';
import client from '../config/connectRedis';

// refresh AT và RT
let requestRefreshToken = async (req, res) => {
    try {
        let refreshToken = req.cookies?.refreshToken;
        if (!refreshToken || _.isEmpty(refreshToken)) {
            return res.status(403).json({ errorCode: 1, message: 'You are not authenticated' });
            // return res.redirect('/login');
        }
        let payload = await verifyRefreshToken(refreshToken);
        if (!payload || _.isEmpty(payload)) {
            return res.status(403).json({ errorCode: 1, message: 'Token không đúng hoặc đã hết hạn.' });
        }

        if (payload && payload?.iat && payload?.exp && !_.isEmpty(payload)) {
            delete payload.iat;
            delete payload.exp;
        }
        const newAccessToken = await signAccessToken(payload);
        const newRefreshToken = await signRefreshToken(payload);

        // res.cookie('refreshToken', newRefreshToken, {
        //     httpOnly: true,
        //     secure: false,
        //     path: '/',
        //     sameSite: 'strict',
        // });
        return res.status(200).json({
            errorCode: 0,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        return res.status(500).json({ errorCode: 1, message: 'Error from server' });
    }
};

let logoutUser = async (req, res) => {
    try {
        let refreshToken = req.cookies?.refreshToken;
        console.log(refreshToken);
        if (!refreshToken) {
            return res.clearCookie('accessToken').status(400).json({
                errorCode: 0,
                message: 'Missing refreshToken',
            });
        }
        let payload = await verifyRefreshToken(refreshToken);
        let userId = payload?.id;
        if (!userId) {
            return res.status(400).json({
                errorCode: 0,
                message: 'Bạn không phải chính chủ',
            });
        }
        client.del(userId.toString(), (err, reply) => {
            if (err)
                return res.status(402).json({
                    errorCode: 1,
                    message: 'you are not a user please try again',
                });
            return res.clearCookie('accessToken').status(200).json({
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
