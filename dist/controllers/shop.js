"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoices = exports.checkOutCancel = exports.checkOutSuccess = exports.checkout = exports.updateCart = exports.getCart = exports.getProduct = exports.getProducts = void 0;
const product_1 = __importDefault(require("../models/product"));
const user_1 = __importDefault(require("../models/user"));
const order_1 = __importDefault(require("../models/order"));
// const stripe = require('stripe')('sk_test_KfraBA0PbL5kXuWLz0ac2CgD00pq5g0wA0');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // let totalItems:number;
    let root = `http://${req.headers.host}`;
    try {
        const totalItems = yield product_1.default.find().countDocuments();
        const products = yield product_1.default.find();
        products.map((product) => {
            product.imageUrl1 = `${root}/image/${product.imageUrl1}`;
            product.imageUrl2 = `${root}/image/${product.imageUrl2}`;
            product.imageUrl3 = `${root}/image/${product.imageUrl3}`;
            product.imageUrl4 = `${root}/image/${product.imageUrl4}`;
            product.imageUrl5 = `${root}/image/${product.imageUrl5}`;
            return product;
        });
        res.status(200).json({
            message: 'Fetch Products successfully.',
            products: products,
            imgPath: req.headers.host,
            totalItems: totalItems
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getProducts = getProducts;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = yield product_1.default.findById(productId);
        res.status(200).json({
            message: `Fetch ${productId} successfully`,
            product: product,
            imgPath: req.headers.host,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getProduct = getProduct;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        res.status(200).json({
            message: `User have not logged in. No Cart deatils can be fetched`,
            cart: []
        });
    }
    try {
        // const user = await User.findById(req.userId).populate('cart.items.productId');
        const user = yield user_1.default.findById(req.userId);
        const cartItems = user.cart.items;
        res.status(200).json({
            message: `Fetch cart successfully`,
            cart: cartItems,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getCart = getCart;
const updateCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        res.status(200).json({
            message: 'User have not logged in. Cart details cannot be stored in Database',
            cart: []
        });
    }
    try {
        if (!req.body.cart) {
            const error = new Error('No cart is received');
            throw error;
        }
        let cart = req.body.cart;
        const user = yield user_1.default.findById(req.userId);
        yield user.updateCart(cart);
        res.status(200).json({
            message: 'Cart updated',
            cart: cart,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.updateCart = updateCart;
const checkout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("enter to checkout ");
    const multiplier = 100;
    const protocol = req.protocol; //get "https" or "http"
    const root = req.headers.host; //get server domain eg: "abc.com"
    const originURL = req.get('origin'); //get client domain eg: "http://clientside.com"
    const success_url = `${protocol}://${root}/checkout/success?originUrl=${originURL}`;
    const cancel_url = `${protocol}://${root}/checkout/cancel?originUrl=${originURL}`;
    const user = yield user_1.default.findById(req.userId).populate('cart.items.productId'); // Get cart details
    const cartItem = user.cart.items;
    const email = user.email; // get user email
    const tax_rates = 0.15; // set tax rate
    const shipping_charge = 50; // set Shipping charge
    let productTotal = 0; // the sum of product ( exclude vat and shipping)
    cartItem.forEach((item) => {
        productTotal += +item.quantity * +item.productId.price * multiplier;
    });
    // Add cart items
    const line_items = cartItem.map((item) => {
        return {
            quantity: item.quantity,
            price_data: {
                currency: "USD",
                product_data: {
                    name: item.productId.name,
                    // description: item.productId.description ,
                    images: [`${protocol}://${root}/image/${item.productId.imageUrl1}`]
                },
                unit_amount_decimal: +item.productId.price * multiplier,
            }
        };
    });
    // Add Shipping
    line_items.push({
        quantity: 1,
        price_data: {
            currency: "USD",
            product_data: { name: "Shipping Charge" },
            unit_amount_decimal: shipping_charge * multiplier
        },
    });
    // Add VAT   
    line_items.push({
        quantity: 1,
        price_data: {
            currency: "USD",
            product_data: { name: "VAT" },
            unit_amount_decimal: productTotal * tax_rates
        }
    });
    try {
        const session = yield stripe.checkout.sessions.create({
            success_url: success_url,
            cancel_url: cancel_url,
            line_items: line_items,
            mode: 'payment',
            customer_email: email,
        });
        res.status(200).json({
            message: "Session Created",
            session: session,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.checkout = checkout;
const checkOutSuccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const originURL = req.query.originUrl; // Get client side URL
    const user = yield user_1.default.findById(req.userId).populate('cart.items.productId'); // Get cart details
    const cartItem = user.cart.items;
    const products = [];
    const tax_rates = 0.15; // set tax rate
    const shipping_charge = 50; // set Shipping charge
    let productTotal = 0; // the sum of product ( exclude vat and shipping)
    cartItem.forEach((item) => {
        const subTotal = item.quantity * +item.productId.price.toString();
        productTotal += subTotal;
        products.push({
            productId: item.productId,
            name: item.productId.name,
            quantity: +item.quantity,
            price: +item.productId.price,
            subTotal: subTotal
        });
    });
    const vat = productTotal * tax_rates;
    const shipping = shipping_charge;
    const total = vat + shipping + productTotal; // Total amount that the customer paid
    try {
        let invoiceId = "";
        const order = yield new order_1.default({
            products: products,
            vat: vat,
            shipping: shipping,
            productTotal: productTotal,
            total: total,
            user: {
                email: user.email,
                userId: user,
            }
        }).save(function (err, invoice) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                }
                else {
                    invoiceId = yield invoice._id.toString();
                    yield user.clearCart();
                    return res.redirect(`${originURL}/invoice/${invoiceId}?checkout=true`);
                }
            });
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.checkOutSuccess = checkOutSuccess;
const checkOutCancel = (req, res, next) => {
    const originURL = req.query.originUrl;
    res.redirect(`${originURL}/cart?checkout=cancel`);
};
exports.checkOutCancel = checkOutCancel;
const getInvoices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoice = yield order_1.default.find({ "user.userId": req.userId }).populate('products');
        res.status(200).json({
            message: 'Fetch Products successfully.',
            products: invoice,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.getInvoices = getInvoices;
