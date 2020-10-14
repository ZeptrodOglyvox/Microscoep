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
    let _roomId = null;

    socket.on('register', (username, roomId) => {
        if (rooms[roomId]) { // TODO delete this later
            socket.join(roomId);
            _roomId = roomId;
            rooms[_roomId].onlineUsers.push({socket: socket.id, username: username});
            socket.emit('setup', rooms[_roomId]);
            socket.to(_roomId).send(`${username} has joined the room.`)
        }
    });

    socket.on('createElement', (type, info, [pi, ei, si]) => {
        const periods = rooms[_roomId].saveFile.periods;
        switch (type) {
            case 'Period':
                info.events = []; 
                periods.splice(pi, 0, info); break;

            case 'Event': 
                info.scenes = []; 
                periods[pi].events.splice(ei, 0, info); break;

            case 'Scene': 
                periods[pi].events[ei].scenes.splice(si, 0, info); break;

            default:
                console.err(`Unkown created element type ${type}`)
        }
        socket.to(_roomId).emit('render', rooms[_roomId].saveFile);
    });

    socket.on('editElement', (indexarray, field, value) => {
        const periods = rooms[_roomId].saveFile.periods;
        const [pi, ei, si] = indexarray;
        switch (indexarray.length) {
            case 1: periods[pi][field] = value; break;
            case 2: periods[pi].events[ei][field] = value; break;
            case 3: periods[pi].events[ei].scenes[si][field] = value; break;
            default:
                console.err(`Unkown edited element type.`)
        }
        socket.to(_roomId).emit('render', rooms[_roomId].saveFile);
    });

    socket.on('deleteElement', (indexarray) => {
        const periods = rooms[_roomId].saveFile.periods;
        const [pi, ei, si] = indexarray;
        switch (indexarray.length) {
            case 1: periods.splice(pi, 1); break;
            case 2: periods[pi].events.splice(ei, 1); break;
            case 3: periods[pi].events[ei].scenes.splice(si, 1); break;
            default:
                console.err(`Unkown deleted element type.`)
        }
        socket.to(_roomId).emit('render', rooms[_roomId].saveFile);
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
    const username = req.cookies.username;
    const roomId = req.params.roomId;
    if (!username) {
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
