const mongoose=require('mongoose');
const path=require('path');
const multer=require('multer');
const AVATAR_PATH=path.join('/uploads/images');
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
    },
    img:{
        type:String
    }
},
{
    timestamps:true
});


//For uploading
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //  console.log("in userschema");
      cb(null, path.join(__dirname,'..',AVATAR_PATH))//dirname means corrent directory name that is "models"
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

//static function
chatSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');//only file will be uplaoded for fieldname avatar
chatSchema.statics.avatarPath=AVATAR_PATH;


const Chat=mongoose.model('chatschema',chatSchema);
module.exports=Chat;

