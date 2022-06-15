
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
// import multer from 'multer';
import fs from 'fs'
import path from 'path';
import express from "express";
import adminRoute from "./routes/admin";
import authRoute from "./routes/auth";
import cookieParser from "cookie-parser";

const app = express();

// To parse json format transmission
app.use(bodyParser.json())
app.use(cookieParser());

// For the access of RESTful API
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})





//  Routes 
app.use('/admin',adminRoute);
app.use('/auth',authRoute);



// Connect Database


mongoose
    .connect(
        'mongodb+srv://Wil:123321@cluster0.mnfhs.mongodb.net/EllowTradition?retryWrites=true'
    ).then(result =>{
        app.listen(8080);
    }).catch(
        err =>{console.log(err)
    });



