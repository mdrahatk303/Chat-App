const User=require('../models/users');
const Chat=require('../models/chat');
//user login
module.exports.create_session= async function(req,res)
{
    try {
        let user=await User.findOne({email:req.body.email});
        if(user)
        {
            if(user.password==req.body.password)
            {
                console.log("Enetred");
                return res.render('enter',{user});
            }
            else
            {
                console.log("Password does not match");
                return res.redirect('back');
            }
        }
        else
        {
            console.log("user not found");
            return res.render('sign_up');
        }
    } 
    catch (error) {
        console.log("******Error",error);
        return res.redirect('back');
        
    }
    
}

//user registering
module.exports.create=async function(req,res)
{
    try 
    {
        if(req.body.password!=req.body.confirmPassword)
        {
            console.log("confirm password did not match");
            return res.redirect('back');
        }
        let user=await User.create(req.body);
        console.log(user);
        return res.redirect('/sign-in');
    }
    catch (error)
    {
        console.log(error);
        return res.redirect('/');
    }
}

//destroy session
module.exports.destroy=function(req,res)
{
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
        return res.render('chat_room',{chats});
        
    } 
    catch (error) 
    {
        console.log("**************ERROR***************",error);
    }
   
}

