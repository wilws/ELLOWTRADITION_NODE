import { validationResult } from "express-validator";
import { RequestHandler } from 'express';
import { IntegerType } from "mongoose/node_modules/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Product from '../models/product';
import Admin from '../models/admin';

export const addProduct:RequestHandler = async (req, res, next) => {

    console.log('in create user');
    
    const imageUrl1 = "pic_path_1.jpg";
    const imageUrl2 = "pic_path_2.jpg";
    const imageUrl3 = "pic_path_3.jpg";
    const imageUrl4 = "pic_path_4.jpg";
    const imageUrl5 = "pic_path_5.jpg";
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const status = req.body.status;

    const product = new Product({
        imageUrl1:imageUrl1,
        imageUrl2:imageUrl2,
        imageUrl3:imageUrl3,
        imageUrl4:imageUrl4,
        imageUrl5:imageUrl5,
        name:name,
        description:description,
        price:price,
        status:status
    })

    try {
        await product.save();
        res.status(201).json({
            message: 'Product created successfully!',
            product: product,
        });

    } catch(err:any) {
            if (err.statusCode == undefined) {
                err.statusCode = 500;
            }
        
        next(err);
    }
};






export const getProducts:RequestHandler = async (req, res, next) => {

//   const currentPage = req.query.page || 1;
//   const perPage = 10;
  let totalItems:number;

  try {
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find();

    res.status(200).json({
        message: 'Fetch Products successfully.',
        products: products,
        totalItems:totalItems
    })

  } catch(err:any) {
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
  }
};



export const getProduct:RequestHandler = async (req,res,next) => {
   const productId = req.params.productId;

   try{
       const product = await Product.findById(productId);
       res.status(200).json({
           message: `Fetch ${productId} successfully`,
           product:product
       });
   } catch(err:any){
       if(!err.statusCode){
           err.statusCode = 500;
       }
       next(err);
   }
}


export const editProduct:RequestHandler = async (req, res, next) => {

    const productId = req.params.productId;
    const imageUrl1 = "pic_path_1.jpg";
    const imageUrl2 = "pic_path_2.jpg";
    const imageUrl3 = "pic_path_3.jpg";
    const imageUrl4 = "pic_path_4.jpg";
    const imageUrl5 = "pic_path_5.jpg";
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const status = req.body.status;

    try{
        const product = await Product.findById(productId)

        product.imageUrl1 = imageUrl1,
        product.imageUrl2 = imageUrl2,
        product.imageUrl3 = imageUrl3,
        product.imageUrl4 = imageUrl4,
        product.imageUrl5 = imageUrl5,
        product.name = name,
        product.description = description,
        product.price = price,
        product.status = status

        await product.save()
        res.status(200).json({ 
            message: 'Product update successfully', 
            product: product 
        });
        
    } catch(err:any) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


export const deleteProduct:RequestHandler = async (req, res, next) => {

    const productId = req.params.productId;

    try {
        await Product.findByIdAndRemove(productId);
        res.status(200).json({
            message: `Product ${productId} delete successfully`
        })
    } catch(err:any) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}





export const createAdmin:RequestHandler = async (req, res, next) =>{
    
    const name = req.body.adminName;
    const password = req.body.password;

    const hashedPw = await bcrypt.hash(password,12);

    const newAdmin = new Admin ({
        adminName:name,
        password:hashedPw
    })

    try{

        await newAdmin.save()
        res.status(200).json({
            message: `admin ${name} is created.`
        })

    } catch(err:any) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }


}

export const login:RequestHandler = async (req, res, next) =>{

    console.log('in admin login ')

    const adminName = req.body.adminName;
    const password = req.body.password;
    try {
        const loadedUser = await Admin.findOne({adminName:adminName});
        
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
                adminName:adminName,
                userId: loadedUser._id.toString()
            },
            'AdminSecret',
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

export const reset:RequestHandler = (req, res, next) =>{
    next()
}
