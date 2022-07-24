import { RequestHandler } from "express";
import jwt from "jsonwebtoken";


declare module "express-serve-static-core" {
    interface Request {
      userId?: any;
    }
  }

const auth:RequestHandler = (req, res, next) =>{

    if (!req.cookies.jwt){
        const error:any = new Error('Not authenticated');
        error.statusCode = 401;
        error.message = "No Token is found"
        throw error;
    }

    const token = req.cookies.jwt;
    let decodedToken:any;

    try{
        decodedToken = jwt.verify(token, 'Secret')
    }catch(err:any){
        const error:any = new Error('Token Invalid. May be expired');
        error.statusCode = 401;
        error.message = "Token expired"
        throw error;
    }

    if(!decodedToken){
        const error:any = new Error('Not authenticated.');
        error.statusCode = 401;
        error.message = "Token verification failed"
        throw error;
    }

    req.userId = decodedToken.userId;
    next()
}


export default auth