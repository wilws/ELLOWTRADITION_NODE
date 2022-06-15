import mongoose, { Schema } from "mongoose";

const schema = mongoose.Schema;

const userSchema = new Schema({

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
    cart: {
        item: [
            {
                productId:{
                    type: Schema.Types.ObjectId,
                    ref:'Product',
                    required: true
                },
                quantity:{
                    type: Number
                }
            }
        ]
    }

});


export default mongoose.model('User',userSchema);