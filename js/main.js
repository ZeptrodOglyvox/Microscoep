import {createPeriod, createInsertEvent, createInsertPeriod} from './components';
import EditableTextifier from './editableText';
import DragScroller from './dragscroller';
import setUpMenu from './menu';


$(window).on("load", function(){
    $('.periods-container')
    .append(createPeriod('Start Period').append(createInsertEvent()))
    .append(createInsertPeriod)
    .append(createPeriod('End Period').append(createInsertEvent()));
    const et = new EditableTextifier();
    const ds = new DragScroller(document.querySelector('.app-container'));
    setUpMenu();
});