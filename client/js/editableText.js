class EditableTextifier {
    constructor() {
        this.activeInput = null;
        this.editedText = null;
        document.addEventListener('click', (evt) => {
            // If we're in editing mode, save unless the click was inside the textarea
            // If we're not editing, check if there's something to be edited and spawn textarea
            if (this.activeInput) { 
                if (evt.target != this.activeInput) { this.saveEditedText(); }
            } else { 
                if (evt.target.hasAttribute('data-editable')) {
                    this.editedText = evt.target;
                } else {
                    // When the text is very small or blank, it's hard to click
                    // so you can also click on the container element
                    const children = [...evt.target.children];
                    children.forEach((el) => {
                        this.editedText = el.hasAttribute('data-editable') ? el : null;
                    });
                }
        
                if (this.editedText) {
                    this.spawnTextareaFor(this.editedText);
                } 
            }
        });
    }
    
    saveEditedText() {
        if (!this.activeInput || !this.editedText) {
            throw ReferenceError(`When attempting to save edit, ended up with activeInput: ${this.activeInput} and editedText: ${this.editedText}`)
        } else {
            if (this.activeInput.value.length > 0 || this.editedText.hasAttribute('data-optional')) {
                this.editedText.textContent = this.activeInput.value;
            } else {
                notify('This label can\'t be blank.'); 
            }
        }
        this.activeInput.remove();
        this.editedText.style.display = 'inline-block';
        this.activeInput = null;
        this.editedText = null;
    }
    
    createTextareaFrom(elem) {
        const ret = document.createElement('textarea');
        ret.setAttribute('spellcheck', 'false');
        ret.setAttribute('maxlength', parseInt(elem.getAttribute('data-maxchars')));
        
        const style = getComputedStyle(elem);
        ret.style.fontSize = style.fontSize;
        ret.style.lineHeight = style.lineHeight;
        ret.style.fontWeight = style.fontWeight;
        ret.value = elem.textContent;

        autosize(ret);
        ret.addEventListener('keydown', (evt) => {
            if (evt.key == 'Enter') { this.saveEditedText(); }
        });
    
        return ret;
    }
    
    spawnTextareaFor(elem) {
        this.editedText = elem;

        this.activeInput = this.createTextareaFrom(this.editedText);                
        this.editedText.parentElement.insertBefore(this.activeInput, this.editedText);
        this.editedText.setAttribute('style', 'display: none;');
        this.activeInput.focus();
    }    
}