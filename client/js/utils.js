function getIndexArray(elem) {
    // Because both periods and insert widgets are direct children of the container, 
    // the actual period indices are calculated like this
    if (elem.hasClass('period'))
        return [Math.floor(elem.index() / 2)];
    else if (elem.hasClass('event'))
        return [
            Math.floor(elem.parent().index() / 2),
            Math.floor((elem.index() - 1) / 2)
        ]
    else if (elem.hasClass('scene-card'))
        return [
            Math.floor(elem.parent().parent().index() / 2),
            Math.floor((elem.parent().index() - 1 )/ 2),
            Math.floor((elem.index() - 1)/ 2)
        ]
    else 
        return [elem.index()]
}

function toggleTone(el) {
    el.classList.toggle('tone-dark');
    el.classList.toggle('tone-light');

    const owner = $(el).parent().hasClass('scene-card') ?  $(el).parent() : $(el).parent().parent();
    document.dispatchEvent(new CustomEvent('editElement', {detail:{
        indexarray: getIndexArray(owner), 
        field: 'tone', 
        value: el.classList.contains('tone-light') ? 'light' : 'dark'
    }}));
}

function notify(msg) {
    const notificationEl = document.querySelector('#notification');
    notificationEl.querySelector('p').innerHTML = msg;
    notificationEl.style.display = 'block';
    
    const tmln = gsap.timeline();
    tmln.to(notificationEl, {opacity: 1, duration: .1})
    .to(notificationEl, {opacity: 0, duration: .1, onComplete: () => {
        notificationEl.style.display = 'none';
    }}, 3.5);
}
