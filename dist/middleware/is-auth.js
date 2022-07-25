"use strict";
// This middleware is non-cookie approach
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../models/token"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check 1 - Check if jwt attached.
        if (!req.header('authorization')) {
            const error = new Error();
            error.statusCode = 401;
            error.message = "No Token is found";
            throw error;
        }
        const authHeader = req.header('authorization');
        const token = authHeader.split(' ')[1];
        // Check 2 - Check if jwt is in blacklist.
        const invalidToken = yield token_1.default.findOne({ token: token });
        if (invalidToken) {
            console.log('blacklisted token!');
            const error = new Error();
            error.statusCode = 401;
            error.message = "Token Invalid";
            throw error;
        }
        // Check 3 - Check if jwt valid.
        const secret = process.env.JWT_SECRET;
        let decodedToken;
        decodedToken = jsonwebtoken_1.default.verify(token, secret); // return true is the token valid
        if (!decodedToken) {
            const error = new Error();
            error.statusCode = 401;
            error.message = "Token verification failed";
            throw error;
        }
        req.userId = decodedToken.userId;
        next();
    }
    catch (err) {
        const error = err;
        error.statusCode = err.statusCode;
        error.message = err.message;
        next(error);
    }
});
exports.default = auth;
