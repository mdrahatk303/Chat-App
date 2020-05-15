const User=require('../models/users');
const Chat=require('../models/chat');
const moment=require('moment');

//user login
module.exports.create_session= async function(req,res)
{
    req.flash('success','Welcome '+req.user.email);
    
    return  res.redirect('/enter')//{user:req.user});

    // //Manual Authentication
    // try {
    //     let user=await User.findOne({email:req.body.email});
    //     if(user)
    //     {
    //         if(user.password==req.body.password)
    //         {
    //             console.log("Enetred");
    //             req.flash('success','Welcome'+user.email+'!!');
    //             return res.render('enter',{user});
    //         }
    //         else
    //         {
    //             console.log("Password does not match");
    //             req.flash('error','Invalid Password!!')
    //             return res.redirect('back');
    //         }
    //     }
    //     else
    //     {
    //         console.log("user not found");
    //         req.flash('error','User not found!!')
    //         return res.render('sign_up');
    //     }
    // } 
    // catch (error) {
    //     console.log("******Error",error);
    //     req.flash('error','Some internal error!!')
    //     return res.redirect('back');
        
    // }
    
}

//user registering
module.exports.create=async function(req,res)
{
    try 
    {
        if(req.body.password!=req.body.confirmPassword)
        {
            console.log("confirm password did not match");
            req.flash('error','Passwords do not match!!')
            return res.redirect('back');
        }
       let user=await User.findOne({email:req.body.email});
        
            
            if(user)
            {
                console.log("User already exists");
                req.flash('error',user.email+'is already registered!!')
                return res.redirect('back');
            }
            else
            {
                let newuser=await User.create(req.body);
                console.log(newuser);
                req.flash('success','Successfully Registered!!')
                return res.redirect('/');
            }
       
        
    }
    catch (error)
    {
        console.log(error);
        req.flash('error','Some internal error!!')
        return res.redirect('/');
    }
}

//destroy session
module.exports.destroy=function(req,res)
{
    if(req.user)
    req.flash('success','See you soon '+req.user.email+"!!");
    req.logout();
    return res.redirect('/');
}


module.exports.chatRoom=async function(req,res)
{
    //console.log(req.query.room);
    try 
    {
        let chats=await Chat.find({room:req.query.room});
        // for(chat of chats)
        // console.log(chat.user_);

        //SETTING ROOM VALUE GLOBALLY SO THAT IT CAN BE USED IN TEXTING FUNCTION TO CREATE CHAT SCHEMA
        global.room=req.query.room;
        
        return res.render('chat_room',{chats});
        
    } 
    catch (error) 
    {
        req.flash('error','Some internal error!!')
        console.log("**************ERROR***************",error);
        return res.redirect('back');
    }
   
}


//texting
//This not possible for me to this right now many bugs
module.exports.texted=function(req,res)
{
   // console.log(global.room+" hhfh");
   //entering chat data to db
   //console.log(req.body);
   Chat.create({
        room:global.room,
        user:req.user.email,
        time: moment().format('h:mm a')
    },function(err,chat_data)
    {
        if(err){console.log("Error in creating chat schema",err); return;}
        Chat.uploadedAvatar(req,res,function(err)
        {
            if(err)
            {
                console.log("Multer error",err);
                req.flash('error','Multer Error')
                return res.redirect('back');

            }
           
            // console.log(req.file);
            
            chat_data.msg=JSON.parse(JSON.stringify(req.body)).text;
            //console.log(msg);
            if(req.file)
            {
                chat_data.img=Chat.avatarPath+'/'+req.file.filename;
            }
            chat_data.save();
        }); 
        
        //return res.redirect('back');

    });

   
    //return res.redirect('back');
}