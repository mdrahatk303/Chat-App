const mongoose=require('mongoose');

const User_Schema=mongoose.Schema({
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
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ChatSchema'
    }
},
{
    timestamps:true
});

const UserSchema=mongoose.model('userschema',User_Schema);
module.exports=UserSchema;