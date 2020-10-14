const cards = new Cards();

const et = new EditableTextifier();
const ds = new DragScroller(document.querySelector('.app-container'));
setUpMenu();

const usernames = ['Karen95', 'JoeyBroey', 'KoolDude69', 'Tumbledore'];
const iconNames = usernames.map((x) => {
    return $(`
        <span>
        <div class="icon-border">
        <i class="fas fa-eye"></i>
        </div>
        <span>${x}</span>
        </span>
    `)[0]
});
const lensDDEl = document.querySelector('.lens-indicator .dropdown');
const lensBtn = document.querySelector('.lens-indicator .lens-name-icon');
const lensDD = new DropDown(iconNames, lensBtn, lensDDEl);

document.querySelectorAll('.legacy-card').forEach((card) => {
    const pNames = usernames.map((x) => {
        return $(`<p>${x}</p>`)[0];
    });
    new DropDown(pNames, card.querySelector('.creator-name'), card.querySelector('.dropdown'));
});

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
    cards.renderSaveFile(data.saveFile);
    document.addEventListener('createElement', (evt) => {
        socket.emit('createElement', evt.detail.type, evt.detail.info, evt.detail.index); 
    });

    document.addEventListener('editElement', (evt) => {
        socket.emit('editElement', evt.detail.indexarray, evt.detail.field, evt.detail.value); 
    });

    document.addEventListener('deleteElement', (evt) => {
        socket.emit('deleteElement', evt.detail.index); 
    });
});

socket.on('message', notify);

socket.on('render', (saveFile) => {
    cards.renderSaveFile(saveFile);
});

const flash = window.sessionFlash;
if (flash) {
    console.log(flash);
}