import { validationResult } from "express-validator";
import { RequestHandler } from 'express';
import { IntegerType } from "mongoose/node_modules/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import User from '../models/user';


export const createUser:RequestHandler = async (req, res, next) =>{

    
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const hashedPw = await bcrypt.hash(password,12);

    const newUser = new User ({
        username:username,
        email:email,
        password:hashedPw
    })

    try{

        await newUser.save()
        res.status(200).json({
            message: "user created"
        })

    } catch(err:any) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }


}

export const login:RequestHandler = async (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;
    try {
        const loadedUser = await User.findOne({email:email});
        
        if (!loadedUser){
            const error:any = new Error('No such admin');
            error.statusCode = 401;
            throw error;
        } 
        const hashedPw = await bcrypt.compare(password,loadedUser.password);
        
        if(!hashedPw){
            const error:any = new Error('Wrong Password');
            error.statusCode = 401;
            throw error;
        } 

        const token = jwt.sign(
            {
                email:email,
                userId: loadedUser._id.toString()
            },
            'Secret',
            {expiresIn: '1h'}
        );

        res.cookie('jwt',token,{httpOnly: true, maxAge: 86400000});

        res.status(200).json({
            token:token,
            username: loadedUser.username,
            message:"Login Successful"
        })

    } catch(err:any) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


export const logout:RequestHandler = (req, res, next) =>{

    if(!req.cookies.jwt){
        const error:any = new Error('LogOut Error');
        error.statusCode = 406;
        throw error;
    }
 
    try{
        res.cookie('jwt','',{maxAge:1});
        res.status(200).json({
            message:"Logout Successful"
        })

    } catch(err:any) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}