import {createPeriod, createInsertEvent, createInsertPeriod} from './components';
import EditableTextifier from './editableText';
import DragScroller from './dragscroller';
import setUpMenu from './menu';
import DropDown from './dropdown';


$('.periods-container')
.append(createPeriod('Start Period').append(createInsertEvent()))
.append(createInsertPeriod)
.append(createPeriod('End Period').append(createInsertEvent()));
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