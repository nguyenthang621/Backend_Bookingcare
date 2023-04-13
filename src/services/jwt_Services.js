import jwt from 'jsonwebtoken';
var createError = require('http-errors');
import client from '../config/connectRedis';

require('dotenv').config();

const signAccessToken = async (payload) => {
    return new Promise(async (resolve, reject) => {
        const key = process.env.KEY_SECRET_ACCESS_TOKEN;
        const options = {
            expiresIn: '300s',
        };
        jwt.sign(payload, key, options, (err, accessToken) => {
            if (err) {
                console.log('error: ', err);
                reject(createError.InternalServerError());
            }

            resolve(accessToken);
        });
    });
};
const signRefreshToken = async (payload) => {
    return new Promise(async (resolve, reject) => {
        const key = process.env.KEY_SECRET_REFRESH_TOKEN;
        const options = {
            expiresIn: '30d',
        };
        jwt.sign(payload, key, options, (err, refreshToken) => {
            if (err) reject(err);
            client.set(payload.id.toString(), refreshToken, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                if (err) return reject(err);
                resolve(refreshToken);
            });
            resolve(refreshToken);
        });
    });
};

// const verifyRefreshToken = async (refreshToken) => {
//     return new Promise(async (resolve, reject) => {
//         jwt.verify(refreshToken.toString(), process.env.KEY_SECRET_REFRESH_TOKEN, (err, payload) => {
//             if (err) {
//                 console.log('err in verify token:', err);
//                 reject(err);
//             } else {
//                 const currentTimestamp = Math.floor(Date.now() / 1000);
//                 if (currentTimestamp > payload.exp) {
//                     // refreshToken hết hạn
//                     resolve({});
//                 } else {
//                     // refreshToken hợp lệ
//                     client.get(payload?.id.toString(), (err, reply) => {
//                         if (err) {
//                             console.log('err in get token in redis token:', err);
//                             reject(err);
//                         }

//                         if (refreshToken === reply) {
//                             resolve(payload);
//                         }
//                         resolve({});
//                     });
//                 }
//             }
//         });
//     });
// };
const verifyRefreshToken = async (refreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payload = jwt.verify(refreshToken, process.env.KEY_SECRET_REFRESH_TOKEN);
            // nếu RefreshToken còn hạn, decoded sẽ chứa thông tin về payload
            client.get(payload?.id.toString(), (err, reply) => {
                if (err) {
                    console.log('err in get token in redis token:', err);
                    reject(err);
                }

                if (refreshToken === reply) {
                    resolve(payload);
                }
                resolve({});
            });
        } catch (err) {
            // nếu RefreshToken hết hạn hoặc không hợp lệ, lỗi sẽ được ném ra
            console.error(err);
            if (err.name === 'TokenExpiredError') {
                console.log('RefreshToken has expired');
                resolve({});
            } else {
                // nếu có lỗi khác, phản hồi về cho client báo lỗi
                console.log('Invalid RefreshToken');
                resolve({});
            }
        }
    });
};

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken };
