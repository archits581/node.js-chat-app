const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const publicPath = path.join(__dirname, '/../public')
const port = process.env.PORT || 3000

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath))

io.on('connection', (socket)=>{
  console.log('A new user just connected');

  socket.emit('newMessage', {
     from: 'Admin',
     text: 'Welcome to the chat room',
     createdAt: new Date().getTime()
  })

  socket.broadcast.emit('newMessage', {
     from: 'Admin',
     text: 'A new user joined the chat room',
     createdAt: new Date().getTime()
  })

  socket.on('createMessage', (message)=>{
    console.log('Created message : ', message)
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  })

  socket.on('disconnect', ()=>{
    console.log('A user disconnected from the server');
  });
})



server.listen(port, ()=>{
  console.log('Server is up and running on port: '+ port)
})
