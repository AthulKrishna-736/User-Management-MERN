import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:false
    },
    profileImage:{
        type:String,
        required:false
    }
}) 


const userCollection = mongoose.model('user', userSchema)

export default userCollection;

