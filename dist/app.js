"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import bodyParser from 'body-parser';
require("dotenv").config({ path: `${__dirname}/../.env` });
const mongoose_1 = __importDefault(require("mongoose"));
// import multer from 'multer';
// import fs from 'fs'
// import path from 'path';
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("./routes/admin"));
const auth_1 = __importDefault(require("./routes/auth"));
const shop_1 = __importDefault(require("./routes/shop"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// To parse json format transmission
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// For the access of RESTful API
const AllowOrigin = process.env.Access_Control_Allow_Origin;
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', AllowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// set image path
app.use('/image', // The file directory in the app/    			
express_1.default.static(__dirname + '/image') // when URL = root/image, point to the above directory
);
//  Routes 
console.log('in app.js');
app.use('/', shop_1.default);
app.use('/admin', admin_1.default);
app.use('/auth', auth_1.default);
// Global Error Handler 
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data });
});
// Connect Database
const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mnfhs.mongodb.net/EllowTradition?retryWrites=true`;
mongoose_1.default
    .connect(MONGODB_URL)
    .then(result => {
    app.listen(process.env.PORT || 8080);
}).catch(err => {
    console.log(err);
});
