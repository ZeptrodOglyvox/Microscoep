// Tone Toggle
export function toggleTone(el) {
    el.classList.toggle('tone-dark');
    el.classList.toggle('tone-light');
}

// Notify
const notificationEl = document.querySelector('#notification');
export function notify(msg) {
    notificationEl.querySelector('p').textContent = msg;

    const tmln = gsap.timeline();
    tmln.to(notificationEl, {opacity: 1, duration: .1})
        .to(notificationEl, {opacity: 0, duration: .1 }, 2);
}