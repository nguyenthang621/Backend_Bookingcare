import { reject } from 'lodash';
import db from '../models';
import jwt from 'jsonwebtoken';
require('dotenv').config();

let postHandbookServices = (data, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.authors || !data.contentHtml || !data.image) {
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
                    contentMarkdown: data.contentMarkdown || '',
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
                    include: [
                        {
                            model: db.User,
                            as: 'senderData',
                            attributes: ['id', 'firstName', 'lastName', 'position'],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                let idAdvisers = data?.adviser?.split(',');
                if (idAdvisers) {
                    data.adviserData = await Promise.all(
                        idAdvisers.map(async (item) => {
                            const user = await db.User.findOne({
                                where: { id: item },
                                attributes: ['firstName', 'lastName', 'position'],
                                raw: true,
                                nest: true,
                            });
                            return user;
                        }),
                    );
                }

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
                let statusUpdate = handbook.dataValues.statusId === 'S3' ? 'S2' : 'S3';
                let message = statusUpdate === 'S3' ? 'Xoá bài viết thành công' : 'Đăng lại bài viết thành công';
                if (handbook) {
                    await handbook.update({ statusId: statusUpdate });
                    await handbook.save();
                    resolve({ errorCode: 0, message: message });
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

let PagingHandbookServices = (q) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = [['id', 'DESC']];

            const { count, rows } = await db.Handbook.findAndCountAll({
                where: { statusId: q.statusId },
                order,
                offset: q.offset,
                limit: q.limit,
                raw: true,
                nest: true,
            });
            const totalPage = Math.ceil(Number(count) / Number(q.limit));

            resolve({ errorCode: 0, data: { rows, count, totalPage } });
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
    PagingHandbookServices,
};
