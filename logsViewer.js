const fs = require('fs');
const bf = require('buffer')
const buffer = new bf.Buffer.alloc(bf.constants.MAX_STRING_LENGTH)
const ev = require('events')

let myEmitter = new ev.EventEmitter();
let logs = []

const getLogs = () => {
    return logs;
}

const readUpdates = (curr, prev, logfile) => {
    fs.open(logfile, (err, fd) => {
        if (err) {
            console.log(err);
        }
        else {
            let data = [], rawData = "";
            fs.read(fd, buffer, 0, buffer.length, prev.size, (err, bytes) => {
                if (err) {
                    console.log(err);
                }
                if (bytes > 0) {
                    console.log(bytes)
                    rawData = buffer.slice(0, bytes).toString()
                    data = rawData.split("\n")
                    if (data.length >= 10) {
                        logs = []
                        data.slice(-10).forEach(val => {
                            logs.push(val)
                        })
                    }
                    else {
                        data.forEach(val => {
                            if (logs.length === 10) {
                                logs.shift();
                            }
                            logs.push(val);
                        })
                    }
                    console.log(data)
                    myEmitter.emit('process-updated-logs', data);
                }

            })
        }
    })
}

const readLogs = (logfile) => {
    fs.open(logfile, (err, fd) => {
        if (err) {
            console.log(err);
        }
        else {
            let data = [], rawData = "";
            let start = 0;
            fs.read(fd, buffer, 0, buffer.length, start, (err, bytes) => {
                if (err) {
                    console.log(err);
                }
                if (bytes > 0) {
                    start = start + buffer.length
                    rawData = buffer.slice(0, bytes).toString()
                    data = rawData.split("\n").slice(-10);
                    data.forEach(val => logs.push(val))
                }
                fs.close(fd, function (err) {
                    if (err) {
                        console.log(err);
                    }

                })
                fs.watchFile(logfile, { "interval": 1000 }, (curr, prev) => {
                    readUpdates(curr, prev, logfile);
                })
            })
        }
    })
}

module.exports = { getLogs, readLogs, myEmitter }
