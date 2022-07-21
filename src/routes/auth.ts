
import { Router } from "express";
import { body } from "express-validator";
import isAuth from "../middleware/is-auth";
import user from "../models/user";


const authController = require( "../controllers/auth" );


const router = Router();

// POST /auth/signup
router.post('/signup',[
    body('email')
    .normalizeEmail()
        .escape()
        .notEmpty()
        .withMessage('Email Should not be empty')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, {req})=>{
            return user.findOne({email:value}).then(user=>{
                if(user){
                    return Promise.reject('E-mail is already in use')
                }
            });
        }),
        
    body('password').trim().not().isEmpty().isLength({min:6,max:30}),
    body('username').trim().not().isEmpty().isLength({max:30}),

],authController.createUser);

// POST /auth/login
router.post('/login',[
    body('password').trim().not().isEmpty().isLength({min:6,max:30}),
    body('email')
    .normalizeEmail()
    .escape()
    .notEmpty()
    .withMessage('Email Should not be empty')
    .isEmail()
    .withMessage('Please Enter a Valid Email')
    .custom((value, {req})=>{
        return user.findOne({email:value}).then(user=>{
            if(!user){
                return Promise.reject('No such E-mail is found')
            }
        });
    })
], authController.login);

// POST /auth/logout
router.post('/logout', authController.logout);

// POST /auth/is-login
router.post('/is-login', isAuth, authController.isLogin);

// // POST /auth/reset
// router.post('/rest', authController.reset);



export default router;