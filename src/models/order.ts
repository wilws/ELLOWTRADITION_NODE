import mongoose, { Schema } from "mongoose";
const schema = mongoose.Schema;

const order = new schema({
    products:[
        {
            productId:{ type: Object, required:true},
            name:{ type:String, required:true},
            quantity:{ type: Number, required:true},
            price:{ type: Number, required:true},
            subTotal:{  type: Number, required:true }
        }
    ],
    total:{
        type:Number,
        required: true
    },
    user:{
        email:{
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    }
    },
    { timestamps: true }
);

export default  mongoose.model("order", order);