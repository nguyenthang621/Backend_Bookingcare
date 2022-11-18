import { createClient } from 'redis';

const client = createClient({
    port: 6379,
    host: '127.0.0.1',
});
client.ping((err, pong) => {
    console.log('pong: ', pong);
});

client.on('error', (err) => console.log('Redis Client Error', err)); // if error
client.on('connect', (err) => console.log('Connected redis')); // if connected
client.on('ready', (err) => console.log('Redis ready')); // if error

// await client.connect();

// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();

module.exports = client;
