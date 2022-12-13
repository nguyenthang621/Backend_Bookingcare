import { reject } from 'lodash';
import db from '../models';
import jwt from 'jsonwebtoken';
require('dotenv').config();

let postHandbookServices = (data, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.authors || !data.contentMarkdown || !data.image) {
                resolve({
                    errorCode: 1,
                    message: 'Missing parameter',
                });
            } else {
                let senderId = '';
                if (accessToken) {
                    jwt.verify(accessToken, process.env.KEY_SECRET_ACCESS_TOKEN, (err, payload) => {
                        if (err) {
                            resolve({ errorCode: 1, message: 'token is not valid' });
                        }
                        senderId = payload.id;
                    });
                } else {
                    resolve({ errorCode: 1, message: 'You are not authenticated' });
                }
                await db.Handbook.create({
                    senderId: senderId,
                    statusId: 'S1',
                    title: data.title,
                    image: data.image,
                    authors: data.authors,
                    adviser: data.adviser,
                    contentMarkdown: data.contentMarkdown,
                    contentHtml: data.contentHtml,
                });
                resolve({ errorCode: 0, message: 'Post success, waiting for approval' });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let confirmHandbookServices = (id, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            let censorId = '';
            if (accessToken) {
                jwt.verify(accessToken, process.env.KEY_SECRET_ACCESS_TOKEN, (err, payload) => {
                    if (err) {
                        resolve({ errorCode: 1, message: 'Token is not valid' });
                    }
                    censorId = payload.id;
                });
            } else {
                resolve({ errorCode: 1, message: 'You are not authenticated' });
            }
            let handbook = await db.Handbook.findOne({
                where: { id: id, statusId: 'S1' },
            });
            if (handbook) {
                await handbook.update({ censor: censorId, statusId: 'S2' });
                await handbook.save();
                resolve({ errorCode: 0, message: 'Confirm success' });
            } else {
                resolve({ errorCode: 1, message: 'Not found handbook' });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getHandbookServices = (id, type, statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            let dataAdviser = [];
            if (!statusId) {
                resolve({
                    errorCode: 1,
                    message: 'Missing parameter',
                });
            }
            //for api detail
            else if ((id && type === 'detail') || id) {
                data = await db.Handbook.findOne({
                    where: { id: id },
                });

                // for api manage
            } else if (type === 'manage' && statusId) {
                data = await db.Handbook.findAll({
                    where: { statusId: statusId },
                    attributes: ['id', 'title', 'image', 'statusId'],
                    include: [
                        { model: db.User, as: 'senderData', attributes: ['id', 'firstName', 'lastName', 'position'] },
                    ],
                    raw: true,
                    nest: true,
                });
            } else {
                //for api homepage
                data = await db.Handbook.findAll({
                    where: { statusId: 'S2' },
                    attributes: ['id', 'title', 'image'],
                    raw: true,
                });
            }
            if (data) {
                resolve({
                    errorCode: 0,
                    data: data,
                });
            } else {
                resolve({
                    errorCode: 1,
                    message: 'not found handbook',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let deleteHandbookServices = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errorCode: 1,
                    message: 'Missing parameter',
                });
            } else {
                let handbook = await db.Handbook.findOne({
                    where: { id: id },
                });
                if (handbook) {
                    await handbook.update({ statusId: 'S3' });
                    await handbook.save();
                    resolve({ errorCode: 0, message: 'Not accept handbook success' });
                } else {
                    resolve({ errorCode: 1, message: 'Not found handbook' });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let checkQueueHandbookServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let queueNews = await db.Handbook.findAll({
                where: { statusId: 'S1' },
                attributes: ['id'],
                raw: true,
            });
            resolve({
                errorCode: 0,
                data: queueNews,
                queueHandbooks: queueNews.length,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postHandbookServices,
    getHandbookServices,
    confirmHandbookServices,
    deleteHandbookServices,
    checkQueueHandbookServices,
};
