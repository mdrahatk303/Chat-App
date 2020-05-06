const socket=io();
const chatMessages = document.querySelector('.chat-messages');
const text=document.querySelector('input')
const users=document.getElementById('users');

//for username and room name
var queryString = window.location.search;
console.log(queryString);
var urlParams = new URLSearchParams(queryString);
var username=urlParams.get('username');
var room=urlParams.get('room');

//sending room and username to server
socket.emit("joinroom",{username,room});

//for submitting the form->for messages
var form=addEventListener("submit",sendmessage);
function sendmessage(e)
{
    e.preventDefault();

    //sending  message to server
    socket.emit("tweet",text.value);
    text.value="";
}

//For room name
var roomname=document.getElementById('room-name');
roomname.innerHTML=`${room}`;

//New user joined
socket.on("newUser",function(obj)
{
   
    output(obj);
})
socket.on("message",function(obj)
{   

    console.log('Message from server->',obj.msg);
    output(obj);
    
}) 


socket.on("left",function(obj)
{
    
    output(obj);
})



function output(obj)
{
    var messageToDom=document.createElement('div');
    messageToDom.classList.add('message');
    messageToDom.innerHTML=`<p class="meta">${obj.user_} <span>9:12pm</span></p>
    <p class="text">
        ${obj.msg}
    </p>`;

    document.querySelector('.chat-messages').appendChild(messageToDom);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

 //Appending users
 socket.on("userList",(userList)=>{
     users.innerHTML="";
     for(user of userList)
     {

         if(user.room==room)
         {
            var li=document.createElement('li');
            li.innerHTML=user.username;
            users.appendChild(li);
         }
     }
 })