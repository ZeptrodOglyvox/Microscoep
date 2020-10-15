const socket = io();

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}



const username = readCookie('username');
const roomId = readCookie('roomId');

socket.on('connect', () => {
    socket.emit('register', username, roomId);
});

socket.on('setup', (data) =>{
    renderRoom(data);
    document.addEventListener('createElement', (evt) => {
        socket.emit('createElement', evt.detail.type, evt.detail.info, evt.detail.index); 
    });

    document.addEventListener('editElement', (evt) => {
        socket.emit('editElement', evt.detail.field, evt.detail.value, evt.detail.indexarray); 
    });

    document.addEventListener('deleteElement', (evt) => {
        socket.emit('deleteElement', evt.detail.index); 
    });

    $('#palette-menu textarea').on('input', function() {
        socket.emit('palette', this.id.substring(3), this.value);
    })
});

socket.on('playerConnect', (info) => {
    notify(`${info.username} has entered the room.`)
    // addPlayerHTML(info)
});

socket.on('render', (data) => {
    renderRoom(data);
});

socket.on('playerDisconnect', (username) => {
    // $(`.lens-name-icon[data-username="${username}"]`).remove();
    notify(`${username} has left the room.`);
});

socket.on('navigate', (url, message=' ') => {
    $('.app-container').html('');
    notify(message);
    const target = `http://${window.location.host}${url}`;
    setTimeout( () => {window.location = target}, 4000 );
})