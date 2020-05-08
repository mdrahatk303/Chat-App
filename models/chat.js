const mongoose=require('mongoose');
const chatSchema=mongoose.Schema({
    room:{
        type:String,
        
    },
    user:{
        type:String,
        
    },
    msg:{
        type:String
    },
    time:{
        type:String
    }
},
{
    timestamps:true
});

const Chat=mongoose.model('chatschema',chatSchema);
module.exports=Chat;