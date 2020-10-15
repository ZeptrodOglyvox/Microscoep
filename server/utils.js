function makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 module.exports = {
     makeid: makeid, 
     validateSaveFile: validateSaveFile
 }

 function validateSaveFile(saveFile) {
    function isValidScene(scene) {
        return scene.question && scene.stage && scene.answer && scene.tone;
    }

    function isValidEvent(event) {
        return event.name && event.tone && event.scenes && 
            event.scenes.every(isValidScene);
    }

    function isValidPeriod(period) {
        return period.name && period.tone && period.events && period.bookend &&
            period.events.every(isValidEvent);
    }

    function isValidLegacy(legacy) {
        return legacy.legacy && legacy.creator;
    }

    function isValidpalette(pallette) {
        return pallette.yes && pallette.no;
    }

    return saveFile.legacies && saveFile.pallette && saveFile.periods && 
        saveFile.legacies.every(isValidLegacy) && 
        isValidpalette(saveFile.pallette) &&
        saveFile.periods.every(isValidPeriod);
 }