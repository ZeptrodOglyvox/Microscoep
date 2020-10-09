// Tone Toggle
export function toggleTone(el) {
    el.classList.toggle('tone-dark');
    el.classList.toggle('tone-light');
}

// const toneEls = document.querySelectorAll('.tone');
// toneEls.forEach((el) => {
//     el.addEventListener('click', () => {toggleTone(el)});
// });

// Notify 
const notificationEl = document.querySelector('#notification');
export function notify(msg) {
    notificationEl.querySelector('p').textContent = msg;

    const tl = gsap.timeline();
    tl.to(notificationEl, {opacity: 1, duration: .1})
        .to(notificationEl, {opacity: 0, duration: .1, delay: 2});
}