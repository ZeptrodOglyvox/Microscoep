const cards = new Cards();

$('.periods-container')
.append(cards.createPeriod('Start Period', false).append(cards.createInsertEvent()))
.append(cards.createInsertPeriod())
.append(cards.createPeriod('End Period', false).append(cards.createInsertEvent()));

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
