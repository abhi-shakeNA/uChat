// node server to handle socket io connections, on 8000 port
const io = require('socket.io')(8000, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket =>{
    // when any new user joins, tell other users connected to the server
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // when someone sends a message, broadcast it to others
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // when someone leaves the chat, tell others
    socket.on('disconnect', message =>{
        let delname = users[socket.id];
        socket.broadcast.emit('leave', delname);
        delete users[socket.id];
    });
})