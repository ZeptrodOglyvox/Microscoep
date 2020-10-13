// Tone Toggle
function toggleTone(el) {
    el.classList.toggle('tone-dark');
    el.classList.toggle('tone-light');
}

// Notify
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