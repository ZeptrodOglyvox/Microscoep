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
    function contained(arr, obj) {
        return arr.every(e => (e in obj));
    } 

    function isValidScene(obj) {
        return contained(['question', 'stage', 'answer', 'tone'], obj);
    }

    function isValidEvent(obj) {
        return contained(['name', 'tone', 'scenes'], obj) && obj.scenes.every(isValidScene);
    }

    function isValidPeriod(obj) {
        return contained(['name', 'tone', 'events', 'bookend', 'events'], obj) && obj.events.every(isValidEvent);

    }

    function isValidLegacy(obj) {
        return contained(['legacy', 'creator'], obj);
    }

    function isValidpalette(obj) {
        return contained(['yes', 'no'], obj);
    }

    return contained(['legacies', 'palette', 'periods'], saveFile) && 
        saveFile.legacies.every(isValidLegacy) && 
        isValidpalette(saveFile.palette) &&
        saveFile.periods.every(isValidPeriod);
 }