import mongoose, { SchemaTypes } from "mongoose";

const schema = mongoose.Schema;

const adminSchema =  new schema({
    adminName :{
        type: String,
        required:true,
    },
    password :{
        type: String,
        required:true,
    }


});


export default mongoose.model('Admin',adminSchema);




