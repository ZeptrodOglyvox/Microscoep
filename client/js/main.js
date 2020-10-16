const cards = new Cards();

const et = new EditableTextifier();
const ds = new DragScroller(document.querySelector('.app-container'));
setUpMenu();

function createDropdowns(usernames) {
    const iconNames = usernames.map((x) => {
        return $(`
            <span>
            <div class="icon-border">
            <i class="fas fa-eye"></i>
            </div>
            ${x}
            </span>
        `)[0]
    });
    const lensDDEl = document.querySelector('.lens-indicator .dropdown');
    const lensBtn = document.querySelector('.lens-indicator .lens-name-icon');
    new DropDown(iconNames, lensBtn, lensDDEl);
    
    document.querySelectorAll('.legacy-card').forEach((card) => {
        let pNames = usernames.map((x) => {
            return $(`<p>${x}</p>`)[0];
        });

        for (let i = 0; i < pNames.length; i++) {
            pNames.push(pNames.shift())
            new DropDown(pNames, card.querySelector('.creator'), card.querySelector('.dropdown'));
        }
    });
}

function addPlayerHTML(info) {
    $('#players-menu').append ( 
        $(`<span class="lens-name-icon" data-username="${info.username}">
        <div class="icon-border">
        <i class="fas fa-eye" aria-hidden="true"></i>
        </div><span>${info.username}</span>
        </span>`)
    )
}

function renderRoom(data) {
    $('.lens-name-icon').html(
        `
        <span>
        <div class="icon-border">
        <i class="fas fa-eye" aria-hidden="true"></i>
        </div>
        ${data['lens-name'] || data.onlinePlayers[0].username}
        </span>
        `
    ); 

    $('#players-menu').html('<h3>Online Now</h3>');
    data.onlinePlayers.forEach(addPlayerHTML);

    const save = data.saveFile
    $('#ta-yes').val(save.palette.yes);
    $('#ta-no').val(save.palette.no);
    
    $('.legacy-container').html('');
    save.legacies.forEach((lg) => {
        $(`<div class="legacy-card">
                <p class="legacy" data-editable data-optional>${lg.legacy}</p>
                <div class="name-container">
                    <p class="creator">${lg.creator}</p>
                    <ul class="dropdown"></ul>
                </div>
            </div>`).appendTo( '.legacy-container' );
    })

    createDropdowns(data.onlinePlayers.map((x) => { return x.username }));

    const periodsContainer = $('.periods-container');
    periodsContainer.html('');

    save.periods.forEach((p, i, arr) => {
        const periodEl = cards.createPeriod(p);
        periodEl.append(cards.createInsertEvent());

        p.events.forEach((e) => {
            const eventEl = cards.createEvent(e);
            eventEl.append(cards.createInsertScene());

            e.scenes.forEach((s) => {
                eventEl.append(cards.createScene(s));
                eventEl.append(cards.createInsertScene());
            });

            periodEl.append(eventEl);
            periodEl.append(cards.createInsertEvent());
        });
        
        periodsContainer.append(periodEl);
        if (i != arr.length - 1) { periodsContainer.append(cards.createInsertPeriod()); }
    });
}

$('#save').on('click', async function() {
    let res = await fetch(`${window.location}/save_file`);
    if (res.ok) {
        download(JSON.stringify(await res.json()), 'savefile.json', 'application/json')
    } 
    else {

        notify('Downloading the save file failed.');
    }
});

$('#room-code-dismissable').on('mousedown', function(evt) {
    if (evt.button == 2) {
        let roomCode = $(this).find('strong').text();
        
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = roomCode;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        
        notify('Room code copied to clipboard.');
    }
});