const express=require('express');
const port=8000;

//(the current version of express-session reads and writes cookies directly).
//so no need go cookie parser
const session=require('express-session');

const app=express();
const http=require('http');
const socketio=require('socket.io');
const server=http.createServer(app);
const io=socketio(server);
const path=require('path');
const db=require('./config/mongoose');
app.use(express.urlencoded());


//passport auth
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);


//For date-time
const moment=require('moment');
app.use(express.static('./assets'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'chat',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 2 )
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//To prevent going back to unauthorised pages(need to verify whether it is correct or not)
app.use(function(req, res, next) 
{
    //console.log("************here in inde.js(server side)**************");
    //if(!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.use('/',require('./routes'));

//list of users with room
const userList=[];

const Chat=require('./models/chat');

var clienthandler=function(socket)
{
    var chatbot="Chatbot"
    //user.push(socket.id);
    socket.on("joinroom",function({username,room}){
        var id=socket.id;
       const user={username,room,id}
        userList.push(user);
        //console.log(user);
        socket.join(room);

        var obj1={
            msg:`${username} has joined`,
            user_:chatbot,
            user:username,
            time: moment().format('h:mm a')
        }
        //When new user join
        socket.broadcast.to(room).emit('newUser',obj1);

        //messages between users
        socket.on("chats",function(text)
        {
            console.log(text+ " "+username);
            //sending message to all clients
            var obj={
                msg:text,
                user_:username,
                time: moment().format('h:mm a')
            }
            //entering chat data to db
            Chat.create({
                room:room,
                user:username,
                msg:text,
                time:obj.time
            },function(err,chat_data)
            {
                if(err){console.log("Error in creating chat schema",err); return;}
                console.log(chat_data);
      
            })
            io.to(room).emit(room).emit('message',obj);
        })
 
        //When a user disconnects
        socket.on('disconnect', () => {

            const index = userList.findIndex(user => user.id === id);
            if (index !== -1) {
                userList.splice(index, 1)[0];
            }

            var obj={
                msg:`${username} has left`,
                user_:chatbot,
                time: moment().format('h:mm a')
            }
            socket.broadcast.to(room).emit('left',obj);
             //send userlist to html..had to emit updated userlist from here too as user section was not updated properly in frontend
            io.to(room).emit("userList",userList);
            //console.log("in disconnectsection"+" "+userList.length);
        })

        //send userlist to html
        io.to(room).emit("userList",userList);
    })


    
    
   
    console.log(userList.length);

   
}

io.on('connection',clienthandler);  

server.listen(port,function(err)
{
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
}) 