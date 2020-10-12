// Tone Toggle
function toggleTone(el) {
    el.classList.toggle('tone-dark');
    el.classList.toggle('tone-light');
}

// Notify
const notificationEl = document.querySelector('#notification');
function notify(msg) {
    notificationEl.querySelector('p').innerHTML = msg;
    notificationEl.style.display = 'block';
    
    const tmln = gsap.timeline();
    tmln.to(notificationEl, {opacity: 1, duration: .1})
    .to(notificationEl, {opacity: 0, duration: .1 }, 2);
    notificationEl.style.display = 'none';
}