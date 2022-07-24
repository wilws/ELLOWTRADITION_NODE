import mongoose, { Schema } from "mongoose";
import Product from "./product";

const schema = mongoose.Schema;

const userSchema = new schema(
    {
        email:{
            type: String,
            required: true
        },
        username:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        cart: {
            items: [
                {
                    productId:{
                        type: Schema.Types.ObjectId,
                        ref:'Product',
                        required: true
                    },
                    quantity:{
                        type: Number,
                        required: true
                    }
                }
            ]
        }

    },
    { timestamps: true }
);



interface cartObj {
    productId:String,
    quantity:Number
}


userSchema.methods.updateCart = function(cart:Array<cartObj>){
    let updatedCartItem:any = [];
    cart.forEach((item:cartObj) => {
        updatedCartItem.push({
            productId : new Object(item.productId),
            quantity:item.quantity 
        });
    })
    this.cart = { items : updatedCartItem };
    return this.save()
}

// userSchema.methods.addToCart = function(product:any){
//     const updatedCartItem = [...this.cart.items];
//     updatedCartItem.push(new Object(product._Id));

//     this.cart = { items : updatedCartItem };
//     return this.save()
// }

// userSchema.methods.removeFromCart = function(productId:String){
//     const updatedCartItem = this.cart.items.filter((item:any) => {
//         return item.productId.toString() !== productId.toString();
//     } );

//     this.cart = { items : updatedCartItem };
//     return this.save()
// }

userSchema.methods.clearCart = function(productId:any){
    this.cart = { items: [] };
    return this.save();
}


export default mongoose.model('User',userSchema);