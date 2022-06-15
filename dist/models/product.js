"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const productSchema = new Schema({
    // Name of the product
    name: {
        type: String,
        required: true
    },
    // Product Description
    description: {
        type: String,
        required: true
    },
    // Product Price
    price: {
        type: mongodb_1.Decimal128,
        required: true
    },
    // status True = Show the product publicly 
    status: {
        type: Boolean,
        required: true
    },
    imageUrl1: {
        type: String,
        required: true
    },
    imageUrl2: {
        type: String,
        required: true
    },
    imageUrl3: {
        type: String,
        required: true
    },
    imageUrl4: {
        type: String,
        required: true
    },
    imageUrl5: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Product', productSchema);
