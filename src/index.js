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
    let user = socket.conn.id
    socket.emit('welcomeMessage', `Your unique ID is - ${user}`)
    socket.broadcast.emit('welcomeMessage', `UserID ${user} has joined!`)

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', `[${user}]: ${message}`);
        callback();
    })

    socket.on('disconnect', () => {
        io.emit('message', `User_${user} has left!`);
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})