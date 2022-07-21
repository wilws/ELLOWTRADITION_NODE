import { RequestHandler } from "express";
import Product from '../models/product';
import User from "../models/user";
import Order from "../models/order";

const stripe = require('stripe')('sk_test_KfraBA0PbL5kXuWLz0ac2CgD00pq5g0wA0');


interface cartObj {
    productId:String,
    quantity:Number
}


export const getProducts:RequestHandler = async (req, res, next) =>{
    let totalItems:number;
    let root = `http://${req.headers.host}`;
 
    try {
      const totalItems = await Product.find().countDocuments();
      const products = await Product.find();

      products.map((product)=>{
        product.imageUrl1 = `${root}/image/${product.imageUrl1}`;
        product.imageUrl2 = `${root}/image/${product.imageUrl2}`;
        product.imageUrl3 = `${root}/image/${product.imageUrl3}`;
        product.imageUrl4 = `${root}/image/${product.imageUrl4}`;
        product.imageUrl5 = `${root}/image/${product.imageUrl5}`;
        return product
      });

      res.status(200).json({
          message: 'Fetch Products successfully.',
          products: products,
          imgPath : req.headers.host,
          totalItems:totalItems
      })
  
    } catch(err:any) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}



export const getProduct:RequestHandler = async(req, res, next) =>{
    const productId = req.params.productId;

    try{
        const product = await Product.findById(productId);
        res.status(200).json({
            message: `Fetch ${productId} successfully`,
            product:product,
            imgPath : req.headers.host,
        });
    } catch(err:any){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}


export const getCart:RequestHandler = async(req,res, next) =>{

    if(!req.userId){
        res.status(200).json({
            message: `User have not logged in. No Cart deatils can be fetched`,
            cart:[]
        });
    }

    try {

        // const user = await User.findById(req.userId).populate('cart.items.productId');
        const user = await User.findById(req.userId);
        const cartItems = user.cart.items

        res.status(200).json({
            message: `Fetch cart successfully`,
            cart : cartItems,
        });

    } catch(err:any){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}


export const updateCart:RequestHandler = async(req,res, next) =>{
    
    if(!req.userId){
        res.status(200).json({
            message: 'User have not logged in. Cart details cannot be stored in Database',
            cart:[]
        });
    }

    try {
        if (!req.body.cart){
            const error = new Error('No cart is received');
            throw error;
        } 
        let cart:cartObj[] = req.body.cart;
        const user = await User.findById(req.userId);

        await user.updateCart(cart);
        res.status(200).json({
            message: 'Cart updated',
            cart : cart,
        });

    } catch(err:any){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}




// export const createInvoice:RequestHandler = (req, res, next) =>{

// }

export const checkout:RequestHandler = async (req, res, next) =>{

    console.log("enter to checkout ")
    let total = 0;
    const user = await User.findById(req.userId).populate('cart.items.productId');
    const cartItem = user.cart.items;

    cartItem.forEach((item:any) => {
        total += +item.quantity * +item.productId.price
    });


    const line_items = cartItem.map((item:any) => {
        return { 
            quantity: item.quantity,
            price_data:{
                currency:"USD",
                product_data:{
                    name: item.productId.name,
                    description: item.productId.description ,
                    images: [item.productId.image1],
                },
                unit_amount_decimal:+item.productId.price,
            }
        };
      })

    try{
        const session = await stripe.checkout.sessions.create({
            success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
            line_items: line_items,
            mode: 'payment',
        });
        
        res.status(200).json({
            message : "Session Created",
            session : session,
        })
    
    } catch (err:any){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

export const checkOutSuccess:RequestHandler = async (req,res,next) => {

    let total = 0;
    const user = await User.findById(req.userId).populate('cart.items.productId');
    const cartItem = user.cart.items;

    const products:any = [];

    cartItem.forEach((item:any) => {

        let subTotal = +item.quantity * +item.productId.price;
        total += subTotal;

        products.push( {
            productId:item.productId,
            name: item.productId.name,
            price : +item.productId.price,
            quantity : +item.quantity,
            subTotal : subTotal
        })
    });

    try{

      
        let invoiceId:String = "";

        const order = await new Order({
            user:{
                email: user.email,
                userId: user,
            },
            products: products,
            total:total,
     
        }).save(async function(err:any,invoice:any){
        
            if (err) {
                console.log(err)
            } else{
                invoiceId = await invoice._id.toString();
                await user.clearCart();
                return res.redirect(`http://localhost:3000/invoice/${invoiceId}?checkout=true`)
            }
        })
         
    
    } catch(err:any){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

export const checkOutCancel:RequestHandler = (req,res,next) => {

    console.log("in checkout cancel page")


    const resData = req.body;




    // res.setHeader('Content-Type','text/html');                                                       // 收到request 後， 回應返 HTML lanaguage我
    // res.write('<html>');
    // res.write('<header><title>Checkout Cancel Page</title></head>');
    // res.write('<body><h1>Hello from my Node.js Server</h1></body>');
    // res.write('</html>');

    res.status(401).json({
        message : "Checkout Cancel",
        session : resData,
    })

    // res.end()
}





export const getInvoices:RequestHandler = async (req, res, next) =>{

    try{
        const invoice = await Order.find({"user.userId" : req.userId}).populate('products');
        res.status(200).json({
            message: 'Fetch Products successfully.',
            products: invoice,
        })

    } catch(err:any) {
        if(!err.statusCode){
            err.statusCode = 500;
    }
    
    next(err);
  }
}