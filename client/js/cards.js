class Cards {

    constructor () {}

    createPeriod(info) {
        const ret = $(
            `<div class="period" id="${info.id}">
                <div class="card period-card">
                    <div class="name-outer">
                        <p class="name" data-editable data-maxchars="30">${info.name}</p>
                    </div>
                    <div class="tone tone-${info.tone}"></div>
                </div>
            </div>`);
    
            ret.find('.tone').on('click', function() {toggleTone(this);});
    
            if (info.bookend == 0) this.createDeleterIn(ret);    
            return ret;
    }

    createInsertPeriod() {
        return $(
            `<div class="insertPeriod"">
                <svg height="100%" width="100%">
                    <line class="top-line" x1="50%" y1="100%" x2="50%" y2="100%" style="stroke:#000;stroke-width:1" />
                </svg>
                <p>+</p>
                <svg height="100%" width="100%">
                    <line class="bottom-line" x1="50%" y1=0 x2="50%" y2="0" style="stroke:#000;stroke-width:1" />
                </svg>
            </div>
            `).mouseover(function(){
                const adder = $(this);
                const tmln = gsap.timeline();
                tmln.to(adder, {duration: .1, opacity: 1})
                    .to(adder.find('.top-line'), {duration: .2, attr: {y1: "0"}}, "<")
                    .to(adder.find('.bottom-line'), {duration: .2, attr: {y2: "100%"}}, "<");
            }).mouseleave(function() {
                const adder = $(this);
                const tmln = gsap.timeline();
                tmln.to(adder, {duration: .1, opacity: 0})
                    .to(adder.find('.top-line'), {duration: 0, attr: {y1: "100%"}})
                    .to(adder.find('.bottom-line'), {duration:0, attr: {y2: "0"}}, "<");
            }).on('click', (evt) => { // TODO clean this up, you could just pass createPeriodAfter
                const info = {name: "Untitled Period", tone: "light", bookend: 0, events: [], id: uuidv4()}

                this.createInsertPeriod().insertAfter(evt.currentTarget);
                const newPeriod = this.createPeriod(info).append(this.createInsertEvent()).insertAfter(evt.currentTarget);

                document.dispatchEvent(new CustomEvent('createElement', {detail: 
                    { type: 'Period', info: info, index: getIndexArray(newPeriod)} 
                }));
            });
    }

    createEvent(event) {
        const ret = $(
            `<div class="event" id=${event.id}>
                <div class="card event-card">
                    <div class="name-outer">
                    <p class="name" data-editable data-maxchars="50">${event.name}</p>
                    </div>
                    <div class="tone tone-${event.tone}"></div>
                </div>
            </div>`);

        ret.find('.tone').on('click', function() {toggleTone(this);});
        this.createDeleterIn(ret);

        return ret
    }

    createInsertEvent() {
        return $(
            `<div class="insertEvent">
                    <svg height="100%" width="45%">
                        <line class="left-line" x1="100%" y1="50%" x2="100%" y2="50%" style="stroke:#000;stroke-width:1" />
                    </svg>
                    <p>+</p>
                    <svg height="100%" width="45%">
                        <line class="right-line" x1="0" y1="50%" x2="0" y2="50%" style="stroke:#000;stroke-width:1" />
                    </svg>
                </div>
            </div>`
            ).on('mouseover', function(){
                const adder = $(this);
                const tmln = gsap.timeline();
                tmln.to(adder, {duration: .1, opacity: 1})
                    .to(adder.find('.left-line'), {duration: .2, attr: {x1: "0"}}, "<")
                    .to(adder.find('.right-line'), {duration: .2, attr: {x2: "100%"}}, "<");
            }).mouseleave(function() { // TODO fix deprecated methods
                const adder = $(this);
                const tmln = gsap.timeline();
                tmln.to(adder, {duration: .1, opacity: 0})
                    .to(adder.find('.left-line'), {duration: 0, attr: {x1: "100%"}})
                    .to(adder.find('.right-line'), {duration: 0, attr: {x2: "0"}}, "<");
            }).click((evt) => {   
                const info = { name: "Untitled Event", tone: "light", id: uuidv4() }          
                this.createInsertEvent().insertAfter(evt.currentTarget);
                const newEvent = this.createEvent(info).append(this.createInsertScene()).insertAfter(evt.currentTarget); 

                document.dispatchEvent(new CustomEvent('createElement', {detail: 
                    { type: 'Event', info: info, index: getIndexArray(newEvent) }
                }));
            });
    }

    createScene(info) {
        const ret = $(
            `<div class="card scene-card" id=${info.id}>
            <div class="text-outer">
                <p class="question" data-editable data-maxchars="60">${info.question}</p>
            </div>
            <hr>
            <div class="text-outer">
                <p class="stage" data-editable data-maxchars="60">${info.stage}</p>
            </div>
            <hr>
            <div class="text-outer">
                <p class="answer" data-editable data-optional data-maxchars="60">${info.answer}</p>
            </div>
            <div class="tone tone-${info.tone}"></div>
            </div>`);

        ret.find('.tone').on('click', function() {toggleTone(this);});
        this.createDeleterIn(ret);

        return ret
    }

    createInsertScene() {
        return $(
            `<div class="insertScene">
            <p>+</p>
            </div>`
        ).mouseover(function(){
            gsap.to(this, {duration: .1, opacity: 1});
        }).mouseleave(function(){
            gsap.to(this, {duration: .1, opacity: 0});
        }).click((evt) => { 
            const info = { question: "Question", stage: "Stage", answer: "Answer", tone: "light", id: uuidv4() };   

            this.createInsertScene().insertAfter(evt.currentTarget);
            const newScene = this.createScene(info).insertAfter(evt.currentTarget);

            document.dispatchEvent(new CustomEvent('createElement', {detail: 
                { type: 'Scene', info: info, index: getIndexArray(newScene) }
            }));
        });
    }

    createDeleterIn(element) {
        const deleter = $(
            `<svg height="10px" width="10px" class="delete" stroke="black" stroke-width="1.1px";>
                <line x1="0" y1="0" x2="100%" y2="100%"/>
                <line x1="100%" y1="0" x2="0" y2="100%"/>
            </svg>`
        );

        deleter.on('click', function() { 
            document.dispatchEvent(new CustomEvent('deleteElement', {detail: 
                { index: getIndexArray(element) }
            }));
            element.next().remove();
            element.remove(); 
        } );

        const card = element.hasClass('card') ? element : element.find('.card');
        card.prepend(deleter);
        
        card.on('mouseover', function() { 
            gsap.to(deleter, { duration: .1, opacity: 1 });
        });

        card.on('mouseleave', function() { 
            gsap.to(deleter, { duration: .1, opacity: 0 });
        });

        
    }
}