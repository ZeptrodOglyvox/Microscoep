function createPeriod(name) {
    return $(
        `<div class="period">
            <div class="card period-card">
                <div class="name-outer">
                    <p class="name" data-editable data-maxchars="30">${name || "Unititled Period"}</p>
                </div>
                <div class="tone tone-light" onclick=toggleTone(this)></div>
            </div>
        </div>`);
}

function createInsertPeriod() {
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
        }).click(function () { //TODO clean this up, you could just pass createPeriodAfter
            createPeriodAfter(this); 
        });
}

function createEvent() {
    return $(
        `<div class="event">
            <div class="card event-card">
                <div class="description-outer">
                <p class="description" data-editable data-maxchars="50">Untitled Event</p>
                </div>
                <div class="tone tone-light" onclick="toggleTone(this)"></div>
            </div>
        </div>`);
}

function createInsertEvent() {
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
        ).mouseover(function(){
            const adder = $(this);
            const tmln = gsap.timeline();
            tmln.to(adder, {duration: .1, opacity: 1})
                .to(adder.find('.left-line'), {duration: .2, attr: {x1: "0"}}, "<")
                .to(adder.find('.right-line'), {duration: .2, attr: {x2: "100%"}}, "<");
        }).mouseleave(function() {
            const adder = $(this);
            const tmln = gsap.timeline();
            tmln.to(adder, {duration: .1, opacity: 0})
                .to(adder.find('.left-line'), {duration: 0, attr: {x1: "100%"}})
                .to(adder.find('.right-line'), {duration:0, attr: {x2: "0"}}, "<");
        }).click(function () { createEventAfter(this); });;
}

function createScene() {
    return $(
        ` <div class="card scene-card">
        <div class="text-outer">
            <p data-editable data-maxchars="60">Question</p>
        </div>
        <hr>
        <div class="text-outer">
            <p data-editable data-maxchars="60">Setup</p>
        </div>
        <hr>
        <div class="text-outer">
            <p data-editable data-optional data-maxchars="60">Answer</p>
        </div>
        <div class="tone tone-dark"></div>
        </div>`);
}

function createInsertScene() {
    return $(
        `<div class="insertScene">
        <p>+</p>
        </div>`
    ).mouseover(function(){
        gsap.to(this, {duration: .1, opacity: 1});
    }).mouseleave(function(){
        gsap.to(this, {duration: .1, opacity: 0});
    }).click(function() { createSceneAfter(this); });
}