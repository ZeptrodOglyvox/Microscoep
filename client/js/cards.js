class Cards {

    constructor () {}

    createPeriod(period = {}) {
        const name = period.name || "Untitled Period";
        const tone = period.tone == 1 ? "light" : "dark";
        const bookend = period.bookend || 0;

        const ret = $(
            `<div class="period">
                <div class="card period-card">
                    <div class="name-outer">
                        <p class="name" data-editable data-maxchars="30">${name}</p>
                    </div>
                    <div class="tone tone-${tone}"></div>
                </div>
            </div>`);
    
            ret.find('.tone').on('click', function() {toggleTone(this);});
    
            if (bookend == 0) this.createDeleterIn(ret);    
            return ret;
    }

    createInsertPeriod() {
        return $(
            `<div class="insertPeriod">
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
            }).on('click', (evt) => { //TODO clean this up, you could just pass createPeriodAfter
                this.createInsertPeriod().insertAfter(evt.currentTarget);
                this.createPeriod().append(this.createInsertEvent()).insertAfter(evt.currentTarget);
            });
    }

    createEvent(event = {}) {
        const name = event.name || "Untitled Event";
        const tone = event.tone == 1 ? "light" : "dark";

        const ret = $(
            `<div class="event">
                <div class="card event-card">
                    <div class="name-outer">
                    <p class="name" data-editable data-maxchars="50">${name}</p>
                    </div>
                    <div class="tone tone-${tone}"></div>
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
                this.createInsertEvent().insertAfter(evt.currentTarget);
                this.createEvent().append(this.createInsertScene()).insertAfter(evt.currentTarget); 
            });
    }

    createScene(scene = {}) {
        const question = scene.question || "Question";
        const stage = scene.stage || "Stage";
        const answer = scene.answer || "Answer"; 
        const tone = scene.tone == 1 ? "light" : "dark";

        const ret = $(
            `<div class="card scene-card">
            <div class="text-outer">
                <p data-editable data-maxchars="60">${question}</p>
            </div>
            <hr>
            <div class="text-outer">
                <p data-editable data-maxchars="60">${stage}</p>
            </div>
            <hr>
            <div class="text-outer">
                <p data-editable data-optional data-maxchars="60">${answer}</p>
            </div>
            <div class="tone tone-dark"></div>
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
            this.createInsertScene().insertAfter(evt.currentTarget);
            this.createScene().insertAfter(evt.currentTarget);
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

    renderSaveFile(save) {
        // $('.legacy-container').innerHTML = '';
        const periodsContainer = $('.periods-container').first();
        periodsContainer.innerHTML = '';

        save.periods.forEach((p, i, arr) => {
            const periodEl = this.createPeriod(p);
            periodEl.append(this.createInsertEvent());

            p.events.forEach((e) => {
                const eventEl = this.createEvent(e);
                eventEl.append(this.createInsertScene());

                e.scenes.forEach((s) => {
                    eventEl.append(this.createScene(s));
                    eventEl.append(this.createInsertScene());
                });

                periodEl.append(eventEl);
                periodEl.append(this.createInsertEvent());
            });
            
            periodsContainer.append(periodEl);
            if (i != arr.length - 1) { periodsContainer.append(this.createInsertPeriod()); }
        });
    }
}