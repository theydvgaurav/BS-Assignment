const express = require('express');
const app = express();
const logs = require('./logsViewer')
const ev = require('events')

logs.readLogs('logs.txt');

app.get('/log', async (req, res) => {
    res.sendFile(__dirname + '/index.html', function (err) {
        if (err) console.log(err)
        else console.log("Sent index.html")
    })
})


const server = app.listen(5000, () => { 'Listening on port 5000' })

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
})


io.on("connection", socket => {
    console.log("connection established" + socket.id)
    logs.myEmitter.on("process-updated-logs", function process(data) {
        socket.emit("updated-logs", data);
    })
    let data = logs.getLogs();
    socket.emit("init", data);
})


