const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

const removeUser = (user, usersArray) => {
    const userIndex = usersArray.indexOf(user);
    if (userIndex > -1) {
        usersArray.splice(userIndex, 1);
        return usersArray;
    }
}
var usersArray = [];
var isUsers = usersArray.length > 0 ? true : false;

io.on('connection', (socket) => {
    let client;

    if (isUsers) {
        io.emit('message', `Online users - ${usersArray.length}`);
        io.emit('message', `Users list - ${usersArray}`);
    }

    socket.on('createUser', (username, callback) => {
        client = username;
        usersArray.push(client);
        socket.emit('welcomeMessage', username);
        io.emit('sysMessage', `User ${username} has joined!`);
        io.emit('sysMessage', `Online users - ${usersArray.length}`);
        io.emit('sysMessage', `Users list - ${usersArray}`);
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        var dateObject = new Date();
        var time = dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();

        io.emit('message', `[${time}] [${client}] ${message}`);
        callback();
    })

    socket.on('disconnect', () => {
        removeUser(client, usersArray);
        if (client !== undefined) {
            io.emit('sysMessage', `${client} has left!`);
            io.emit('sysMessage', `Online users - ${usersArray.length}`);
            io.emit('sysMessage', `Users list - ${usersArray}`);
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})