const socket = io('http://localhost:8000');

// getting DOM elements into JS variables
const form = document.getElementById('send-form');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// audio to play for notifications
let audio = new Audio('notif.mp3');

// func to append messages to container
const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

// ask new user for name and tell the server
const newUname = prompt('Enter name to join');
socket.emit('new-user-joined', newUname);

// when a user joins, take its name from server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'left')
})

// when server sends a message, receive it in container
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// when a user leaves the chat, append the info to the container
socket.on('leave', name =>{
    append(`${name} left the chat`, 'left')
})

// when form gets submitted, send message to the server
form.addEventListener('submit', (e) =>{
    e.preventDefault();         // prevents page from reloading, on submission of form
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

