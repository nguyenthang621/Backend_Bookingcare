import express from 'express';
import configViewsEngine from './config/viewsEngine';
import initWebRoutes from './routes/router';
import { connectDB } from './config/connectDB';
import cors from 'cors';
import { deleteExpiredSchedules } from './services/autoServices';
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
require('dotenv').config();

let app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//config app:
configViewsEngine(app);
initWebRoutes(app);

connectDB();

cron.schedule('0 0 * * *', deleteExpiredSchedules);

let port = process.env.PORT;
app.listen(port, () => {
    console.log('backend nodejs running on port ' + port);
});
