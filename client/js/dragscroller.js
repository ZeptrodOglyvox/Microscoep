class DragScroller {
    constructor(elem) {
        this.elem = elem;
        this.pos = {top: 0, left: 0, x: 0, y: 0};
        document.addEventListener('contextmenu', (evt) => { evt.preventDefault(); })

        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);

        elem.addEventListener('mousedown', this.mouseDownHandler);
        elem.addEventListener('mouseleave', this.mouseUpHandler);
    }

    mouseDownHandler(evt) {
        if (evt.button == 2) {  
            this.pos = {
                top: this.elem.scrollTop,
                left: this.elem.scrollLeft,
                x: evt.clientX,
                y: evt.clientY
            };

            this.elem.addEventListener('mousemove', this.mouseMoveHandler);
            this.elem.addEventListener('mouseup', this.mouseUpHandler);
            this.elem.classList.add('dragged');
        }
    }

    mouseMoveHandler(evt) {
        const dx = this.pos.x - evt.clientX;
        const dy = this.pos.y - evt.clientY;

        const accel = 1.3;

        this.elem.scrollTop = this.pos.top + accel * dy;
        this.elem.scrollLeft = this.pos.left +accel * dx;
    }

    mouseUpHandler() {
        this.elem.classList.remove('dragged');
        this.elem.removeEventListener('mousemove', this.mouseMoveHandler);
        this.elem.removeEventListener('mouseup', this.mouseUpHandler);
    }
};