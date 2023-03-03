const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    let count = socket.conn.server.clientsCount
    let client;

    socket.on('createUser', (username, callback) => {
        socket.emit('welcomeMessage', username)
        socket.broadcast.emit('message', `User ${username} has joined!`)
        socket.broadcast.emit('message', `Online users - ${count}`)
        client = username;
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', `[${client}] ${message}`);
        callback();
    })

    socket.on('disconnect', () => {
        io.emit('message', `${client} has left!`);
        io.emit('message', `Online users - ${--count}`)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})