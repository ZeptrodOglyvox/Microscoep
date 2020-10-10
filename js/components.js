import {toggleTone} from './utils';
// import { v4 as uuidv4 } from 'uuid';

function createPeriod(name, createDeleter=true) {
    const ret = $(
        `<div class="period">
            <div class="card period-card">
                <div class="name-outer">
                    <p class="name" data-editable data-maxchars="30">${name || "Unititled Period"}</p>
                </div>
                <div class="tone tone-light"></div>
            </div>
        </div>`);

        ret.find('.tone').on('click', function() {toggleTone(this);});

        if (createDeleter) createDeleterIn(ret);

        return ret;
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
            createInsertPeriod().insertAfter(this);
            createPeriod().append(createInsertEvent()).insertAfter(this);
        });
}

function createEvent() {
    const ret = $(
        `<div class="event">
            <div class="card event-card">
                <div class="description-outer">
                <p class="description" data-editable data-maxchars="50">Untitled Event</p>
                </div>
                <div class="tone tone-light"></div>
            </div>
        </div>`);

    ret.find('.tone').on('click', function() {toggleTone(this);});
    createDeleterIn(ret);

    return ret
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
        }).click(function () {             
            createInsertEvent().insertAfter(this);
            createEvent().append(createInsertScene()).insertAfter(this); 
        });
}

function createScene() {
    const ret = $(
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

    ret.find('.tone').on('click', function() {toggleTone(this);});
    createDeleterIn(ret);

    return ret
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
    }).click(function() { 
        createInsertScene().insertAfter(this);
        createScene().insertAfter(this);
    });
}

function createDeleterIn(element) {
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

export {createPeriod, createScene, createEvent, createInsertEvent, createInsertScene, createInsertPeriod};