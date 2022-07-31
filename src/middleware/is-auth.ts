// This middleware is non-cookie approach

import { RequestHandler } from "express";
import Token from "../models/token";
import jwt from "jsonwebtoken";




declare module "express-serve-static-core" {
    interface Request {
      userId?: any;
    }
  }

const auth:RequestHandler = async (req, res, next) =>{

    try{
        // Check 1 - Check if jwt attached.
        if (!req.header('authorization')){
            const error:any = new Error();
            error.statusCode = 401;
            error.message = "No Token is found"
            throw error;
        }

        const authHeader:any = req.header('authorization');
        const token = authHeader.split(' ')[1];   

        // Check 2 - Check if jwt is in blacklist.
        const invalidToken = await Token.findOne({token:token});
        if (invalidToken) {
            const error:any = new Error();
            error.statusCode = 401;
            error.message = "Token Invalid"
            throw error;
        }

        // Check 3 - Check if jwt valid.
        const secret:any = process.env.JWT_SECRET;
        let decodedToken:any;
        decodedToken = jwt.verify(token, secret);    // return true is the token valid
        
        if(!decodedToken){
            console.log('!decodedToken')
            const error:any = new Error();
            error.statusCode = 401;
            error.message = "Token verification failed"
            throw error;
        }

        req.userId = decodedToken.userId;
        
        next()

    } catch(err:any) {
        const error:any = err;
        error.statusCode = err.statusCode;
        if (err.name == "TokenExpiredError"){
            error.statusCode = 401;
        }
 

        error.message = err.message;
        next(error);
    }  
    
}


export default auth