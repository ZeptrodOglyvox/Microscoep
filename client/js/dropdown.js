class DropDown {
   constructor(elementList, button, dropdown, style = {}) {
        this.elementList = elementList.slice();
        this.button = button;
        this.dropdown = dropdown;

        this.button.addEventListener('click', () => {  
            const tmln = gsap.timeline();
            tmln.to(this.dropdown, { duration: 0.001, borderWidth: style.bw || "1px" })
                .to(this.dropdown, { duration: .12,  height: "auto" });
        });

        document.addEventListener('click', (evt) => {
            evt.stopPropagation();
            if (!elementList.includes(evt.target)) {
                gsap.to(this.dropdown, {duration: 0, height: "0", borderWidth: "0"})
            }
        });

        this.populateDD(this.elementList);
    }
    
    populateDD(list) {
        this.dropdown.innerHTML = '';
        list.forEach((u) => {
            this.dropdown.appendChild(this.createListElement(u));
        });
    }
    
    createListElement(content) {
        const li = document.createElement('li');
        li.appendChild(content);
        li.addEventListener('click', (evt) => {
            gsap.to(this.dropdown, {duration: 0, height: "0", borderWidth: "0"})
            this.button.innerHTML = evt.currentTarget.innerHTML;
            this.elementList = [
                content,
                ...this.elementList.filter((x) => x != content)  
            ]
            this.populateDD(this.elementList);
        }, true);
        return li;
    }
}