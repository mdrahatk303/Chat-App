const express=require('express');
const port=8000;

const app=express();
const http=require('http');
const socketio=require('socket.io');
const server=http.createServer(app);
const io=socketio(server);
const path=require('path');
app.use(express.static('./assets'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/',require('./routes'));

//list of users with room
const userList=[]
  

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
            user:username
        }
        socket.broadcast.to(room).emit('ne  wUser',obj1);
        socket.on("tweet",function(tweet)
        {
            console.log(tweet+ " "+username);
            //sending message to all clients
            var obj={
                msg:tweet,
                user_:username
            }
            io.to(room).emit('message',obj);
        
        })

        socket.on('disconnect', () => {

            const index = userList.findIndex(user => user.id === id);
            if (index !== -1) {
                userList.splice(index, 1)[0];
            }

            var obj={
                msg:`${username} has left`,
                user_:chatbot
            }
            socket.broadcast.to(room).emit('left',obj);
            //console.log(userList.length);
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