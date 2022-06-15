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
exports.reset = exports.logout = exports.login = exports.createAdmin = exports.deleteProduct = exports.editProduct = exports.getProduct = exports.getProducts = exports.addProduct = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const product_1 = __importDefault(require("../models/product"));
const admin_1 = __importDefault(require("../models/admin"));
const addProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrl1 = "pic_path_1.jpg";
    const imageUrl2 = "pic_path_2.jpg";
    const imageUrl3 = "pic_path_3.jpg";
    const imageUrl4 = "pic_path_4.jpg";
    const imageUrl5 = "pic_path_5.jpg";
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const status = req.body.status;
    const product = new product_1.default({
        imageUrl1: imageUrl1,
        imageUrl2: imageUrl2,
        imageUrl3: imageUrl3,
        imageUrl4: imageUrl4,
        imageUrl5: imageUrl5,
        name: name,
        description: description,
        price: price,
        status: status
    });
    try {
        yield product.save();
        res.status(201).json({
            message: 'Product created successfully!',
            product: product,
        });
    }
    catch (err) {
        if (err.statusCode == undefined) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.addProduct = addProduct;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //   const currentPage = req.query.page || 1;
    //   const perPage = 10;
    let totalItems;
    try {
        const totalItems = yield product_1.default.find().countDocuments();
        const products = yield product_1.default.find();
        res.status(200).json({
            message: 'Fetch Products successfully.',
            products: products,
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
            product: product
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
const editProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    try {
        const product = yield product_1.default.findById(productId);
        product.imageUrl1 = imageUrl1,
            product.imageUrl2 = imageUrl2,
            product.imageUrl3 = imageUrl3,
            product.imageUrl4 = imageUrl4,
            product.imageUrl5 = imageUrl5,
            product.name = name,
            product.description = description,
            product.price = price,
            product.status = status;
        yield product.save();
        res.status(200).json({
            message: 'Product update successfully',
            product: product
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.editProduct = editProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        yield product_1.default.findByIdAndRemove(productId);
        res.status(200).json({
            message: `Product ${productId} delete successfully`
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.deleteProduct = deleteProduct;
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.adminName;
    const password = req.body.password;
    const hashedPw = yield bcryptjs_1.default.hash(password, 12);
    const newAdmin = new admin_1.default({
        adminName: name,
        password: hashedPw
    });
    try {
        yield newAdmin.save();
        res.status(200).json({
            message: `admin ${name} is created.`
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.createAdmin = createAdmin;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('in admin login ');
    const adminName = req.body.adminName;
    const password = req.body.password;
    try {
        const loadedUser = yield admin_1.default.findOne({ adminName: adminName });
        if (!loadedUser) {
            const error = new Error('No such admin');
            error.statusCode = 401;
            throw error;
        }
        const hashedPw = yield bcryptjs_1.default.compare(password, loadedUser.password);
        if (!hashedPw) {
            const error = new Error('Wrong Password');
            error.statusCode = 401;
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            adminName: adminName,
            userId: loadedUser._id.toString()
        }, 'AdminSecret', { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000 });
        res.status(200).json({
            token: token,
            username: loadedUser.username,
            message: "Login Successful"
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
});
exports.login = login;
const logout = (req, res, next) => {
    if (!req.cookies.jwt) {
        const error = new Error('LogOut Error');
        error.statusCode = 406;
        throw error;
    }
    try {
        res.cookie('jwt', '', { maxAge: 1 });
        res.status(200).json({
            message: "Logout Successful"
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.logout = logout;
const reset = (req, res, next) => {
    next();
};
exports.reset = reset;
