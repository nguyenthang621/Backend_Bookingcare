require('dotenv').config();
import { createClient } from 'redis';

const client = createClient({
    // port: process.env.REDIS_PORT,
    // host: process.env.REDIS_HOST,
    // username: process.env.REDIS_USERNAME,
    // password: process.env.REDIS_PASSWORD,
    // url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});
client.ping((err, pong) => {
    console.log('ping: ', pong);
});

client.on('error', (err) => console.log('Redis Client Error', err)); // if error
client.on('connect', (err) => console.log('Connected redis')); // if connected
client.on('ready', (err) => console.log('Redis ready')); // if error

module.exports = client;
