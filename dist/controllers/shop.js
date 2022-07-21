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
const stripe = require('stripe')('sk_test_KfraBA0PbL5kXuWLz0ac2CgD00pq5g0wA0');
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let totalItems;
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
// export const createInvoice:RequestHandler = (req, res, next) =>{
// }
const checkout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("enter to checkout ");
    let total = 0;
    const user = yield user_1.default.findById(req.userId).populate('cart.items.productId');
    const cartItem = user.cart.items;
    cartItem.forEach((item) => {
        total += +item.quantity * +item.productId.price;
    });
    const line_items = cartItem.map((item) => {
        return {
            quantity: item.quantity,
            price_data: {
                currency: "USD",
                product_data: {
                    name: item.productId.name,
                    description: item.productId.description,
                    images: [item.productId.image1],
                },
                unit_amount_decimal: +item.productId.price,
            }
        };
    });
    try {
        const session = yield stripe.checkout.sessions.create({
            success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
            line_items: line_items,
            mode: 'payment',
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
    let total = 0;
    const user = yield user_1.default.findById(req.userId).populate('cart.items.productId');
    const cartItem = user.cart.items;
    const products = [];
    cartItem.forEach((item) => {
        let subTotal = +item.quantity * +item.productId.price;
        total += subTotal;
        products.push({
            productId: item.productId,
            name: item.productId.name,
            price: +item.productId.price,
            quantity: +item.quantity,
            subTotal: subTotal
        });
    });
    try {
        let invoiceId = "";
        const order = yield new order_1.default({
            user: {
                email: user.email,
                userId: user,
            },
            products: products,
            total: total,
        }).save(function (err, invoice) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                }
                else {
                    invoiceId = yield invoice._id.toString();
                    yield user.clearCart();
                    return res.redirect(`http://localhost:3000/invoice/${invoiceId}?checkout=true`);
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
    console.log("in checkout cancel page");
    const resData = req.body;
    // res.setHeader('Content-Type','text/html');                                                       // 收到request 後， 回應返 HTML lanaguage我
    // res.write('<html>');
    // res.write('<header><title>Checkout Cancel Page</title></head>');
    // res.write('<body><h1>Hello from my Node.js Server</h1></body>');
    // res.write('</html>');
    res.status(401).json({
        message: "Checkout Cancel",
        session: resData,
    });
    // res.end()
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
