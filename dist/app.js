"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("./routes/admin"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// To parse json format transmission
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// For the access of RESTful API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
//  Routes 
app.use('/admin', admin_1.default);
app.use('/auth', auth_1.default);
// Connect Database
mongoose_1.default
    .connect('mongodb+srv://Wil:123321@cluster0.mnfhs.mongodb.net/EllowTradition?retryWrites=true').then(result => {
    app.listen(8080);
}).catch(err => {
    console.log(err);
});
