import { Router } from "express";
import isAuth from "../middleware/is-auth";
const shopController = require("../controllers/shop");
const router = Router();

// GET /get-products
router.get('/get-products', shopController.getProducts);

// GET / get-cart
router.get('/get-cart/',isAuth, shopController.getCart);   


// PUT / update-cart
router.put('/update-cart/',isAuth,shopController.updateCart);

// POST /checkout
router.post('/checkout/',isAuth,shopController.checkout);

// GET / checkout/success
router.get('/checkout/success',shopController.checkOutSuccess);

// GET / checkout/cancel
router.get('/checkout/cancel',shopController.checkOutCancel);

// GET /create-invoice
router.get('/get-invoices',isAuth,shopController.getInvoices);


export default router;