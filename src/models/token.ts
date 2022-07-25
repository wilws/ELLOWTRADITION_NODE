import mongoose from 'mongoose';


const schema = mongoose.Schema;

const tokenSchema = new schema({
    token: {
        type: String,
        required:true
    }
});

export default mongoose.model('Token',tokenSchema);