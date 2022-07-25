import { RequestHandler } from "express";
import Product from '../models/product';
import User from "../models/user";
import Order from "../models/order";


// const stripe = require('stripe')('sk_test_KfraBA0PbL5kXuWLz0ac2CgD00pq5g0wA0');
const stripe = require('stripe')(process.env.STRIPE_KEY);


interface cartObj {
    productId:String,
    quantity:Number
}


export const getProducts:RequestHandler = async (req, res, next) =>{
    // let totalItems:number;
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


// ** function not in use **
// export const getProduct:RequestHandler = async(req, res, next) =>{
//     const productId = req.params.productId;

//     try{
//         const product = await Product.findById(productId);
//         res.status(200).json({
//             message: `Fetch ${productId} successfully`,
//             product:product,
//             imgPath : req.headers.host,
//         });
//     } catch(err:any){
//         if(!err.statusCode){
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// }


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




export const checkout:RequestHandler = async (req, res, next) =>{

    const multiplier = 100;
    const protocol = req.protocol;               //get "https" or "http"
    const root = req.headers.host;               //get server domain eg: "abc.com"
    const originURL = req.get('origin');         //get client domain eg: "http://clientside.com"
    const success_url = `${protocol}://${root}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${protocol}://${root}/checkout/cancel`;


    const user = await User.findById(req.userId).populate('cart.items.productId');   // Get cart details
    const cartItem = user.cart.items;  

    const email = user.email;           // get user email
    const tax_rates = 0.15;             // set tax rate
    const shipping_charge = 50;         // set Shipping charge
    
    let productTotal = 0;               // the sum of product ( exclude vat and shipping)
    cartItem.forEach((item:any) => {
        productTotal += +item.quantity * +item.productId.price  * multiplier
    });


    // Add cart items
    const line_items = cartItem.map((item:any) => {
        return { 
            quantity: item.quantity,
            price_data:{
                currency:"USD",
                product_data:{
                    name: item.productId.name,
                    // description: item.productId.description ,
                    images: [`${protocol}://${root}/image/${item.productId.imageUrl1}`]
                },
                unit_amount_decimal:+item.productId.price * multiplier,
            }
        };
      })

    

      // Add Shipping
      line_items.push({
            quantity: 1,
            price_data:{
                currency:"USD",
                product_data:{ name: "Shipping Charge"},
                unit_amount_decimal:shipping_charge * multiplier
            },
      });

      // Add VAT   
      line_items.push({
            quantity: 1,
            price_data:{
                currency:"USD",
                product_data:{name: "VAT"},
                unit_amount_decimal:productTotal * tax_rates 
            }
        });

    try{
        const session = await stripe.checkout.sessions.create({
            success_url : success_url,
            cancel_url : cancel_url ,
            line_items: line_items,
            mode: 'payment',
            customer_email:email,
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

    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    // const customer = await stripe.customers.retrieve(session.customer);

    const email = session.customer_email;
    const user:any = await User.findOne({email:email}).populate('cart.items.productId');   // Get cart details
    const cartItem = user.cart.items;
    const originURL = process.env.Access_Control_Allow_Origin;                                          // Get client side URL
    const products:any = [];
    const tax_rates = 0.15;             // set tax rate
    const shipping_charge = 50;         // set Shipping charge
    
    let productTotal = 0;               // the sum of product ( exclude vat and shipping)
    cartItem.forEach((item:any) => {

        const subTotal = item.quantity * +item.productId.price.toString();
        productTotal += subTotal;      
        products.push( {
            productId:item.productId,
            name: item.productId.name,
            quantity : +item.quantity,
            price : +item.productId.price,
            subTotal : subTotal
        })
    });


    const vat = productTotal * tax_rates;
    const shipping = shipping_charge;
    const total = vat + shipping + productTotal;    // Total amount that the customer paid

    try{

        let invoiceId:String = "";
        const order = await new Order({
            products: products,
            vat:vat,
            shipping:shipping,
            productTotal:productTotal,
            total:total,
            user:{
                email: user.email,
                userId: user,
            }
        }).save(async function(err:any,invoice:any){
        
            if (err) {
                console.log(err)
            } else{
                invoiceId = await invoice._id.toString();
                await user.clearCart();
                return res.redirect(`${originURL}/invoice/${invoiceId}?checkout=true`);
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
    const originURL = process.env.Access_Control_Allow_Origin; 
    res.redirect(`${originURL}/cart?checkout=cancel`);
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