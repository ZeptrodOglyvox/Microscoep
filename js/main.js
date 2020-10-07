// Tone Toggle
function toggleTone(el) {
    el.classList.toggle('tone-dark');
    el.classList.toggle('tone-light');
}
const toneEls = document.querySelectorAll('.tone');
toneEls.forEach((el) => {
    el.addEventListener('click', () => {toggleTone(el)});
});

// Notify 
const notificationEl = document.querySelector('#notification');
function notify(msg) {
    notificationEl.querySelector('p').textContent = msg;

    const tl = gsap.timeline();
    tl.to(notificationEl, {opacity: 1, duration: .1})
        .to(notificationEl, {opacity: 0, duration: .1, delay: 1});
}

// Toggle input on editable text
function auto_grow(elem) {
    elem.style.height = '5px';
    elem.style.height = elem.scrollHeight + "px";
}

function saveEditedText(activeInput, editedText) {
    if (!activeInput || !editedText) {
        throw ReferenceError(`When attempting to save edit, ended up with activeInput: ${activeInput} and editedText: ${editedText}`)
    } else {
        if (activeInput.value.length > 0 || editedText.hasAttribute('data-optional')) {
            editedText.textContent = activeInput.value;
        } else {
            notify('This can\'t be blank.');
        }
        activeInput.remove();

        editedText.style.display = 'inline-block';
    }
}

function createTextareaFrom(elem) {
    const style = getComputedStyle(elem);

    const ret = document.createElement('textarea');
    ret.setAttribute('spellcheck', 'false');
    ret.setAttribute('oninput', 'auto_grow(this)');
    ret.setAttribute('maxlength', '40');
    ret.style.fontSize = style.fontSize;
    ret.style.lineHeight = style.lineHeight;
    ret.style.fontWeight = style.fontWeight;
    ret.value = elem.textContent;

    return ret;
}

let activeInput = null;
let editedText = null;
document.addEventListener('click', (evt) => {
    // If we're in editing mode, save unless the click was inside the textarea
    // If we're not editing, check if there's something to be edited and spawn textarea

    if (activeInput) { 
        if (evt.target != activeInput){
            saveEditedText(activeInput, editedText);
            activeInput = null;
            editedText = null;
        }

    } else { 
        if (evt.target.hasAttribute('data-editable')) {
            editedText = evt.target;
        } else {
            const children = [...evt.target.children];
            children.forEach((el) => {
                editedText = el.hasAttribute('data-editable') ? el : null;
            });
        }

        if (editedText) {
            activeInput = createTextareaFrom(editedText);
             activeInput.addEventListener('keydown', (evt) => {
            if (evt.key == 'Enter') {
                saveEditedText(activeInput, editedText);
                activeInput = null;
                editedText = null;
            }
        });
        
        editedText.parentElement.insertBefore(activeInput, editedText);
        editedText.setAttribute('style', 'display: none;');
        
        activeInput.style.height = activeInput.scrollHeight + "px"
        activeInput.focus();
        } 
    }
});


// Add period 
function createPeriodBefore(el) {
    // TODO: Learn jQuery, this is stupid.
    el.insertAdjacentHTML('beforebegin', `
    <div class="addPeriod" onclick="createPeriodBefore(this)">+</div>
    <div class="period">
        <div class="card period-card">
            <div class="name-outer">
                <p class="name" data-editable>Untitled Period</p>
            </div>
            <div class="tone tone-light" onclick="toggleTone(this)"></div>
        </div>
    </div>
    `)
}
