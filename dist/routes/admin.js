"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = require("../controllers/admin");
const authController = require("../controllers/auth");
const is_authAdmin_1 = __importDefault(require("../middleware/is-authAdmin"));
const router = (0, express_1.Router)();
// ***  API about the admin's role  *** //
// POST /admin/create
router.post('/create', is_authAdmin_1.default, adminController.createAdmin);
// POST /admin/login
router.post('/login', adminController.login);
// POST /admin/logout
router.post('/logout', is_authAdmin_1.default, authController.logout);
// POST /admin/reset
// router.post('reset',adminController.reset)
// ***  API about the admin's function  *** //
// POST /admin/add-product
router.post('/add-product', adminController.addProduct);
// GET /admin/get-products
router.get('/get-products', is_authAdmin_1.default, adminController.getProducts);
// GET /admin/get-product/{productId}
router.get('/get-product/:productId', is_authAdmin_1.default, adminController.getProduct);
// PUT /admin/edit-product/{productId}
router.put('/edit-product/:productId', is_authAdmin_1.default, adminController.editProduct);
// DELETE /admin/delete-product/{productId}
router.delete('/delete-product/:productId', is_authAdmin_1.default, adminController.deleteProduct);
exports.default = router;
