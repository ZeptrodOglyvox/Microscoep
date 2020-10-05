toneEls = document.querySelectorAll('.tone');
toneEls.forEach((el) => {
    el.addEventListener('click', () => {
        el.classList.toggle('tone-dark');
        el.classList.toggle('tone-light');
    });
});
