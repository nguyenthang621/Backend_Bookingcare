import jwt from 'jsonwebtoken';
var createError = require('http-errors');
import _, { reject } from 'lodash';
import client from '../config/connectRedis';

require('dotenv').config();

const signAccessToken = async (payload) => {
    return new Promise(async (resolve, reject) => {
        const key = process.env.KEY_SECRET_ACCESS_TOKEN;
        const options = {
            expiresIn: '1h',
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
            expiresIn: '1y',
        };
        jwt.sign(payload, key, options, (err, refreshToken) => {
            if (err) reject(err);
            client.set(payload.id.toString(), refreshToken, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                if (err) return reject(createError.InternalServerError());
                resolve(refreshToken);
            });
            resolve(refreshToken);
        });
    });
};

const verifyRefreshToken = async (refreshToken) => {
    return new Promise(async (resolve, reject) => {
        jwt.verify(refreshToken.toString(), process.env.KEY_SECRET_REFRESH_TOKEN, (err, payload) => {
            if (err) {
                console.log('err in verify token:', err);
                reject(err);
            }
            client.get(payload.id.toString(), (err, reply) => {
                if (err) {
                    console.log('err in get token in redis token:', err);
                    reject(err);
                }
                if (refreshToken === reply) {
                    resolve(payload);
                }
            });
        });
    });
};

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken };
