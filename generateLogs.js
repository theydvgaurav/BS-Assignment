const fs = require('fs')

for (var i = 0; i < 50; i++) {
    fs.appendFile('logs.txt', i.toString() + '\n', (err) => {
        console.log(err)
    })
}