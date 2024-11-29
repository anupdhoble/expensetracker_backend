const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    role:{
        type:Number,
        default:3     //1 for admin 2 for moderator 3 for user
    }

});
const Users=mongoose.model('Users',UserSchema);
module.exports = {Users}; //we need to export object so expense is object