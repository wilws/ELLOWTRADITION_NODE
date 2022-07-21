
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
// import multer from 'multer';
import fs from 'fs'
import path from 'path';
import express from "express";
import adminRoute from "./routes/admin";
import authRoute from "./routes/auth";
import shopRoute from "./routes/shop";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from 'express';


const app = express();

// To parse json format transmission
app.use(bodyParser.json())
app.use(cookieParser());




// For the access of RESTful API
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    // res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
    next();
})

// set image path
// app.use(express.static(path.join(__dirname, 'public')));
app.use(
	'/image',                                  			// point to ‘root/image’ folder
    express.static(__dirname + '/image')
);



//  Routes 
app.use('/',shopRoute);
app.use('/admin',adminRoute);
app.use('/auth',authRoute);

interface Error {
    name: string;
    message: string;
    statusCode:number;
    data:any;
}


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("Error Handling Middleware called")
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data });
  });


// Connect Database
mongoose
    .connect(
        'mongodb+srv://Wil:123321@cluster0.mnfhs.mongodb.net/EllowTradition?retryWrites=true'
    ).then(result =>{
        app.listen(8080);
    }).catch(
        err =>{console.log(err)
    });


    