const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

const removeUser = (user, usersArray) => {
    const userIndex = usersArray.indexOf(user);
    if (userIndex > -1) {
        usersArray.splice(userIndex, 1);
        return usersArray;
    }
}

app.use(express.static(publicDirectoryPath))

var usersArray = [];
var isUsers = usersArray.length > 0 ? true : false;
io.on('connection', (socket) => {
    let count = socket.conn.server.clientsCount
    let client;
    if (isUsers) {
        io.emit('message', `Online users - ${count}`)
        io.emit('message', `Users list - ${usersArray}`)
    }

    socket.on('createUser', (username, callback) => {
        client = username;
        usersArray.push(client);
        socket.emit('welcomeMessage', username)
        io.emit('sysMessage', `User ${username} has joined!`)
        io.emit('sysMessage', `Online users - ${count}`)
        io.emit('sysMessage', `Users list - ${usersArray}`)
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', `[${client}] ${message}`);
        callback();
    })

    socket.on('disconnect', () => {
        realClient = client !== 'undefined' ? false : true;
        if (realClient) {
            io.emit('sysMessage', `${client} has left!`);
            io.emit('sysMessage', `Online users - ${--count}`)
            removeUser(client, usersArray);
            io.emit('sysMessage', `Users list - ${usersArray}`)
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})