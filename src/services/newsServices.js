import { reject } from 'lodash';
import db from '../models';
import jwt from 'jsonwebtoken';
require('dotenv').config();

let postNewsServices = (data, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.title || !data.authors || !data.image || !data.topic || !data.htmlFocus) {
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
                await db.News.create({
                    senderId: senderId,
                    statusId: 'S1',
                    title: data.title,
                    image: data.image,
                    authors: data.authors,
                    adviser: data.adviser,
                    contentMarkdown: data.contentMarkdown,
                    contentHtml: data.contentHtml,
                    type: data.type,
                    topic: data.topic,
                    focus: data.htmlFocus,
                });
                resolve({ errorCode: 0, message: 'Post success, waiting for approval' });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let confirmNewsServices = (id, accessToken) => {
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
            let news = await db.News.findOne({
                where: { id: id, statusId: 'S1' },
            });
            if (news) {
                await news.update({ censor: censorId, statusId: 'S2' });
                await news.save();
                resolve({ errorCode: 0, message: 'Confirm success' });
            } else {
                resolve({ errorCode: 1, message: 'Not found news' });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getNewsServices = (id, type, statusId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};

            if (!statusId) {
                resolve({
                    errorCode: 1,
                    message: 'Missing parameter',
                });
            }
            //for api detail
            else if ((id && type === 'detail') || id) {
                data = await db.News.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.User,
                            as: 'senderDataNews',
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
                data = await db.News.findAll({
                    where: { statusId: statusId },
                    attributes: ['id', 'title', 'image', 'statusId', 'type', 'topic'],
                    include: [
                        {
                            model: db.User,
                            as: 'senderDataNews',
                            attributes: ['id', 'firstName', 'lastName', 'position'],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
            } else {
                //for api homepage
                data = await db.News.findAll({
                    where: { statusId: 'S2' },
                    attributes: ['id', 'title', 'image', 'type', 'focus'],
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
                    message: 'Not found news',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let deleteNewsServices = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errorCode: 1,
                    message: 'Missing parameter',
                });
            } else {
                let news = await db.News.findOne({
                    where: { id: id },
                });

                let statusUpdate = news.dataValues.statusId === 'S3' ? 'S2' : 'S3';
                let message = statusUpdate === 'S3' ? 'Xoá bài viết thành công' : 'Đăng lại bài viết thành công';
                if (news) {
                    await news.update({ statusId: statusUpdate });
                    await news.save();
                    resolve({ errorCode: 0, message: message });
                } else {
                    resolve({ errorCode: 1, message: 'Not found news' });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};
let checkQueueNewsServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let queueNews = await db.News.findAll({
                where: { statusId: 'S1' },
                attributes: ['id'],
                raw: true,
            });
            resolve({
                errorCode: 0,
                data: queueNews,
                queueNews: queueNews.length,
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postNewsServices,
    getNewsServices,
    confirmNewsServices,
    deleteNewsServices,
    checkQueueNewsServices,
};
