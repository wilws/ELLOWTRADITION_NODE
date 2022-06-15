
import { Router } from "express";
import { body } from "express-validator";
import isAuth from "../middleware/is-auth";


const authController = require( "../controllers/auth" );


const router = Router();

// POST /auth/signup
router.post('/signup', authController.createUser);

// POST /auth/login
router.post('/login', authController.login);

// POST /auth/logout
router.post('/logout', isAuth, authController.logout);

// // POST /auth/reset
// router.post('/rest', authController.reset);



export default router;