class DropDown {
   constructor(elementList, button, dropdownEl, style = {}) {
        this.elementList = elementList.slice();
        this.button = button;
        this.dropdownEl = dropdownEl;

        this.button.addEventListener('click', () => {  
            const tmln = gsap.timeline();
            tmln.to(this.dropdownEl, { duration: 0.001, borderWidth: style.bw || "1px" })
                .to(this.dropdownEl, { duration: .12,  height: "auto" });
        });

        document.addEventListener('click', (evt) => {
            evt.stopPropagation();
            if (!elementList.includes(evt.target)) {
                gsap.to(this.dropdownEl, {duration: 0, height: "0", borderWidth: "0"})
            }
        });

        this.populateDD(this.elementList);
    }
    
    populateDD(list) {
        this.dropdownEl.innerHTML = '';
        list.forEach((u) => {
            this.dropdownEl.appendChild(this.createListElement(u));
        });
    }
    
    createListElement(content) {
        const li = document.createElement('li');
        li.appendChild(content);
        li.addEventListener('click', (evt) => {
            gsap.to(this.dropdownEl, {duration: 0, height: "0", borderWidth: "0"})
            this.button.innerHTML = evt.currentTarget.innerHTML;
            this.elementList = [
                content,
                ...this.elementList.filter((x) => x != content)  
            ]
            this.populateDD(this.elementList);

            document.dispatchEvent(new CustomEvent('editElement', {detail: {
                field: this.button.classList[0], 
                value: $(content).text().trim(),
                indexarray: getIndexArray($(this.button).parent().parent())
            }}));

        }, true);
        return li;
    }
}