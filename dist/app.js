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
const shop_1 = __importDefault(require("./routes/shop"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// To parse json format transmission
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// For the access of RESTful API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// set image path
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', // point to ‘root/image’ folder
express_1.default.static(__dirname + '/image'));
//  Routes 
app.use('/', shop_1.default);
app.use('/admin', admin_1.default);
app.use('/auth', auth_1.default);
app.use((err, req, res, next) => {
    console.log("Error Handling Middleware called");
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data });
});
// Connect Database
mongoose_1.default
    .connect('mongodb+srv://Wil:123321@cluster0.mnfhs.mongodb.net/EllowTradition?retryWrites=true').then(result => {
    app.listen(8080);
}).catch(err => {
    console.log(err);
});
