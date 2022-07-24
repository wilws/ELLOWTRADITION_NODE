
import { Router } from "express";
import { body } from "express-validator";
const adminController = require( "../controllers/admin" );
const authController = require("../controllers/auth");
import isAuthAdmin from "../middleware/is-authAdmin";

const router = Router();

// ***  API about the admin's auth  *** //

// POST /admin/create
router.post('/create',isAuthAdmin, adminController.createAdmin);

// POST /admin/login
router.post('/login', adminController.login);

// POST /admin/logout
router.post('/logout',isAuthAdmin,authController.logout);

// POST /admin/reset
// router.post('reset',adminController.reset)



// ***  API about the admin's function  *** //

// POST /admin/add-product
router.post('/add-product', adminController.addProduct);

// GET /admin/get-products
router.get('/get-products', isAuthAdmin, adminController.getProducts);

// GET /admin/get-product/{productId}
router.get('/get-product/:productId',isAuthAdmin,  adminController.getProduct);

// PUT /admin/edit-product/{productId}
router.put('/edit-product/:productId', isAuthAdmin, adminController.editProduct);

// DELETE /admin/delete-product/{productId}
router.delete('/delete-product/:productId',isAuthAdmin, adminController.deleteProduct);




export default router;