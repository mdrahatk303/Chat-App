const express=require('express');
const router=express.Router();
const passport=require('passport');
const app=express();
const usercontroller=require('../controllers/user_controller')
// //To prevent going back to unauthorised pages(need to verify whether it is correct or not)
// app.use(function(req, res, next) {
//     console.log("***************HERE*************");
//     if (!req.user)
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     next();
// });
 
//CHECK THIS METHOD TO PREVENT GOING TO PAGES BY CHROME BACK BUTTON
//res.setHeader('Cache-Control', 'no-cache, no-store');

router.get('/',function(req,res)
{
    // res.setHeader('Cache-Control', 'no-cache, no-store');
    if (req.isAuthenticated()){
        {
           
            return res.redirect('/enter');
        }
    }
    return res.render('sign_in');
})

router.get('/sign-up',function(req,res)
{
    //res.setHeader('Cache-Control', 'no-cache, no-store');
    if (req.isAuthenticated()){
        {
           
            return res.redirect('/enter');
        }
    }
    return res.render('sign_up');
})


router.get('/enter', passport.checkAuthentication,function(req,res)
{
    console.log("here in enter section");
    //res.setHeader('Cache-Control', 'no-cache, no-store');
    return res.render('enter');
})


router.get('/chat-room', passport.checkAuthentication,usercontroller.chatRoom)



//user signing in
router.post('/create-session',passport.authenticate('local',{failureRedirect:'/enter'}),usercontroller.create_session);

//registration of user(sign-up)
router.post('/create',usercontroller.create);

//logout
router.get('/sign-out',usercontroller.destroy);

module.exports=router;