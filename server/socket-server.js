module.exports = function attachEventHandlers(io, rooms) {
    io.on('connection', (socket) => {
        let _roomId = null;
        let _username = null;

        socket.on('register', (username, roomId) => {
            if (!rooms[roomId]) {
                socket.emit('navigate', '/', 
                'The room you\'re trying to access no longer exists, probably because all the players left. You will be redirected.'
                );
                return;
            }

            // TODO delete this later
            _roomId = roomId; _username = username;

            socket.join(roomId);
            rooms[_roomId].onlinePlayers.push({socket: socket.id, username: username});

            if (!rooms[_roomId].saveFile.legacies.some(lg => lg.creator == username) &&
                rooms[_roomId].saveFile.legacies.length < rooms[_roomId].onlinePlayers.length
            )
                rooms[_roomId].saveFile.legacies.push({legacy: '', creator: username});

            socket.emit('setup', rooms[_roomId]);
            socket.to(_roomId).emit('playerConnect', {username: username});
            socket.to(_roomId).emit('render', rooms[_roomId]);
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
                    console.err(`Unkown created element type ${type}`);
            }
            socket.to(_roomId).emit('render', rooms[_roomId]);
        });
    

        socket.on('editElement', (field, value, indexarray) => {
            if (field == 'legacy' || field == 'creator') {
                rooms[_roomId].saveFile.legacies[indexarray[0]][field] = value
            } if(field == 'lens-name-icon') {
                rooms[_roomId]['lens-name'] = value;
            } else {
                const periods = rooms[_roomId].saveFile.periods;
                const [pi, ei, si] = indexarray;
                switch (indexarray.length) {
                    case 1: periods[pi][field] = value; break;
                    case 2: periods[pi].events[ei][field] = value; break;
                    case 3: periods[pi].events[ei].scenes[si][field] = value; break;
                    default:
                        console.err(`Unknown edited element type.`)
                }
            }

            socket.to(_roomId).emit('render', rooms[_roomId]);
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
            socket.to(_roomId).emit('render', rooms[_roomId]);
        });

        socket.on('palette', (field, value) => {
            rooms[_roomId].saveFile.palette[field] = value;
            socket.to(_roomId).emit('render', rooms[_roomId]);
        })

        socket.on('disconnect', () => {
            if (!rooms[_roomId]) {
                socket.emit('navigate', '/', 
                'The room you\'re trying to access no longer exists, probably because all the players left. You will be redirected.'
                );
                return;
            }

            try {
                socket.to(_roomId).emit('playerDisconnect', _username);
                rooms[_roomId].onlinePlayers = 
                    rooms[_roomId].onlinePlayers.filter((x) => { 
                        return x.username != _username 
                    });

                if (rooms[_roomId].onlinePlayers.length == 0) {
                    delete rooms[_roomId];
                } else {
                    socket.to(_roomId).emit('render', rooms[_roomId]);
                }
            } catch (error) {
                if (error instanceof TypeError)
                    console.error(
                        `TypeError: "${error.message.slice(0,50)}" thrown from disconnect handler for room ${_roomId}, socket ${socket.id}`
                    );
                else throw error
            }
        });
    });
}