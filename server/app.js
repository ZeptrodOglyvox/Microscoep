const express = require('express');
const sass = require('node-sass');
const fs = require('fs');
const path = require('path');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

function errorHandler(err) {
    if (err) console.error(err);
}

sass.render({file: path.join(__dirname, '..', 'client', 'sass', 'style.scss')}, (err, result) => {
    if (!err) {
        fs.writeFile(path.join(__dirname, '..', 'client', 'css', 'style.css'), result.css, errorHandler);
    } else {
        errorHandler(err);
    }
})

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(express.static(path.join(__dirname, '..', 'node_modules')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('socket connected');
})

http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
