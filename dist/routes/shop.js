"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shopController = require("../controllers/shop");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const router = (0, express_1.Router)();
// GET /get-products
router.get('/get-products', shopController.getProducts);
// GET /get-product/{productId}
// router.get('/get-product/:productId',  shopController.getProduct);
// POST /add-cart/{productId}
// router.post('/add-cart/:productId');
// GET / get-cart
router.get('/get-cart/', is_auth_1.default, shopController.getCart);
// PUT / update-cart
router.put('/update-cart/', is_auth_1.default, shopController.updateCart);
// POST /checkout
router.post('/checkout', is_auth_1.default, shopController.checkout);
// GET / checkout/success
router.get('/checkout/success', is_auth_1.default, shopController.checkOutSuccess);
// GET / checkout/cancel
router.get('/checkout/cancel', is_auth_1.default, shopController.checkOutCancel);
// GET /create-invoice
router.get('/get-invoices', is_auth_1.default, shopController.getInvoices);
// POST /create-invoice
// router.get('/create-invoice',isAuth,shopController.getInvoice);
exports.default = router;
