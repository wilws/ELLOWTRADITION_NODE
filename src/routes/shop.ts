import { Router } from "express";

const shopController = require("../controllers/shop");
import isAuth from "../middleware/is-auth";


const router = Router();



// GET /get-products
router.get('/get-products', shopController.getProducts);

// GET /get-product/{productId}
// router.get('/get-product/:productId',  shopController.getProduct);

// POST /add-cart/{productId}
// router.post('/add-cart/:productId');

// GET / get-cart
router.get('/get-cart/',isAuth, shopController.getCart);

// PUT / update-cart
router.put('/update-cart/',isAuth,shopController.updateCart);

// POST /checkout
router.post('/checkout',isAuth,shopController.checkout);

// GET / checkout/success
router.get('/checkout/success',isAuth,shopController.checkOutSuccess);

// GET / checkout/cancel
router.get('/checkout/cancel',isAuth,shopController.checkOutCancel);

// GET /create-invoice
router.get('/get-invoices',isAuth,shopController.getInvoices);

// POST /create-invoice
// router.get('/create-invoice',isAuth,shopController.getInvoice);


export default router;