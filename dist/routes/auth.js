"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const authController = require("../controllers/auth");
const router = (0, express_1.Router)();
// POST /auth/signup
router.post('/signup', authController.createUser);
// POST /auth/login
router.post('/login', authController.login);
// POST /auth/logout
router.post('/logout', is_auth_1.default, authController.logout);
// // POST /auth/reset
// router.post('/rest', authController.reset);
exports.default = router;
