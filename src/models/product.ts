import { Decimal128 } from 'mongodb';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
    
    // Name of the product
    name: {
        type: String,
        required:true
    },

    // Product Description
    description: {
        type: String,
        required:true
    },

    // Product Price
    price: {
        type: Decimal128,
        required:true
    },

    // status True = Show the product publicly 
    status: {
        type: Boolean,
        required:true
    },

    imageUrl1: {
        type: String,
        required:true
    },

    imageUrl2: {
        type: String,
        required:true
    },


    imageUrl3: {
        type: String,
        required:true
    },

    imageUrl4: {
        type: String,
        required:true
    },

    imageUrl5: {
        type: String,
        required:true
    }
    },
    { timestamps: true }
);


export default  mongoose.model('Product',productSchema);