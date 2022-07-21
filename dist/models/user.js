"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const schema = mongoose_1.default.Schema;
const userSchema = new schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
}, { timestamps: true });
userSchema.methods.updateCart = function (cart) {
    let updatedCartItem = [];
    cart.forEach((item) => {
        updatedCartItem.push({
            productId: new Object(item.productId),
            quantity: item.quantity
        });
    });
    this.cart = { items: updatedCartItem };
    return this.save();
};
userSchema.methods.addToCart = function (product) {
    const updatedCartItem = [...this.cart.items];
    updatedCartItem.push(new Object(product._Id));
    this.cart = { items: updatedCartItem };
    return this.save();
};
userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItem = this.cart.items.filter((item) => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart = { items: updatedCartItem };
    return this.save();
};
userSchema.methods.clearCart = function (productId) {
    this.cart = { items: [] };
    return this.save();
};
exports.default = mongoose_1.default.model('User', userSchema);
