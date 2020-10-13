const utils = require('./utils');
// ######## Express Stuff #########
const express = require('express');
const sass = require('node-sass');
const fs = require('fs');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const port = 3000;

const bp = require('body-parser');

function errorHandler(err) {
    if (err) console.error(err);
}

function renderSass(fileName) {
    sass.render({file: path.join(__dirname, '..', 'client', 'sass', `${fileName}.scss`)}, (err, result) => {
        if (!err) {
            fs.writeFile(path.join(__dirname, '..', 'client', 'css',  `${fileName}.css`), result.css, errorHandler);
        } else {
            errorHandler(err);
        }
    });
}

['style', 'index'].forEach(renderSass);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'client', 'templates'))
app.use('/', express.static(path.join(__dirname, '..', 'client'), {index: false}));
app.use(bp.urlencoded({extended: true}));
app.use(bp.json());
app.use(cookieParser('secret'));
app.use(session());
app.use(flash());

// ######## Socket Stuff #########
const io = require('socket.io')(http);
let rooms = {};

io.on('connection', (socket) => {
    socket.on('register', (username, roomId) => {
        if (rooms[roomId]) { // TODO delete this later
            socket.join(roomId);
            rooms[roomId].onlineUsers.push({socket: socket.id, username: username});
            socket.emit('setup', rooms[roomId]);
        }
    });
});

// ######### Routing #########
app.get('/', function(req, res) {
    res.render('index', {user: req.cookies['user'], notification: req.flash('notification')});
});

app.post('/room', function(req, res) {
    const form = req.body;
    let roomId = null;
    if (form.new) {
        do roomId = utils.makeid(6); while (roomId in rooms);
        rooms[roomId] = { onlineUsers: [], saveFile: require('./starter-pack') };
        console.log(JSON.stringify(rooms));
    } else if (form.load) {
        roomId = utils.makeid(6);
        // rooms[roomId] = form.saveFile;
    } else {
        roomId = form.roomId.toUpperCase();
    }

    res.cookie('username', form.username);
    res.cookie('roomId', roomId);

    res.redirect(`/room/${roomId}`);
});

app.get('/room/:roomId', function(req, res) {
    const user = req.cookies.user;
    const roomId = req.params.roomId;
    if (!user) {
        req.flash('notification', 'Whoa there stranger! Please choose a username before joining the room.');
        res.redirect('/');
    } else if(!rooms[roomId]) {
        req.flash('notification','Whopsie! The room you are trying to join doesn\'t exist.');
        res.redirect('/');
    } else {
        res.render('app');
    }
});

http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
