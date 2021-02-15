/******************************************************************************
 * Copyright (c) 15/2/2021 3:3     djml.uk E&OE.                              *
 ******************************************************************************/
const runningLocalFile = 0;

// =================================================================== WORKERS
function newTextWorker() {
    return new Worker("worker_getText.4.js");
}

function newJSONobjWorker() {
    return new Worker("worker_getJSONobj.4.js");
}

function newIndicesobjWorker() {
    return new Worker("worker_getIndicesobj.1.js");
}

//exceute below to setup window.cacheWorker
function setupwindowCacheWorker() {
    if (locationType() !== runningLocalFile) {
        window.cacheWorker = new Worker("worker_cacheImg.18.js");
        window.cacheWorker.onmessage = function () {
            window.preloadingArray.pop();//=window.preloadingArray.filter(el=>el!==e.data);
            const visib = window.preloadingArray.length < 1 ? "hidden" : "visible";
            document.getElementById("span-cacheClouds-h").innerText = window.preloadingArray.length < 2 ? "" : window.preloadingArray.length.toString();
            document.getElementById("div-cacheClouds-h").style.visibility = visib;
            //document.getElementById("span-cacheClouds-v").innerText = lenStr;
            //document.getElementById("div-cacheClouds-v").style.visibility = visib;
        };
    }
}

//any function that returns a Promise for a .then must be async
function preloadCardUIDarray(cardUIDarray, arrayName) {
    if (locationType() !== runningLocalFile && window.preloadImages && window.Worker && cardUIDarray.length > 0 && window.preloadedArray.indexOf(arrayName) === -1) {
        //cll(arrayName);
        window.preloadedArray.push(arrayName);
        const uid = arrayName + "_" + Date.now().toString();
        window.preloadingArray.push(uid);
        document.getElementById("span-cacheClouds-h").innerText = window.preloadingArray.length < 2 ? "" : window.preloadingArray.length.toString();
        document.getElementById("div-cacheClouds-h").style.visibility = "visible";
        // document.getElementById("span-cacheClouds-v").innerText = lenStr;
        // document.getElementById("div-cacheClouds-v").style.visibility = "visible";

        //setTimeout(function() {
        const imgSrcArray = [];
        cardUIDarray.forEach(cuid => {
            const cardObj = getCardObjFromUniqueCardIDwithSplitter(cuid, cardUniqueIDSplitter);
            if (!!cardObj) {
                imgSrcArray.push(cardObj.imagePath);
                //imgSrcArray.push(cardObj.imagePathRotated);
                imgSrcArray.push(cardObj.thumbsPath);
            }
        });
        window.cacheWorker.postMessage({srcs: imgSrcArray, uid: uid});
        //},250);
    }
}

// =================================================================== RUNNING LOCAL or REMOTE

/*
const runningLocalServer = 1;
const runningRemoteServer = 2;
*/
function locationType() {
// Returns the page location type
// 0 (falsey) = Local file, direct from disk (file://path/to/file.html)
// 1 (truthy) = Virtually remote file, from local server (http://localhost)
// 2 (truthy) = Remote file from remote server (http://example.com)

    if (window.location.protocol === 'file:') {
        return 0;
    }
    if (!window.location.host.replace(/localhost|127\.0\.0\.1/i, '')) {
        return 2;
    }
    return 1;
}

// =================================================================== UTILITY FUNCTIONS
function getStringCharacterLength (str) {
    // string .length is unreliable as it uses UTF16!
    // The string iterator that is used here iterates over characters,not mere code units
    return [...str].length;
}

function smartStringTrim(string, maxLength) {
    const maxL = maxLength === undefined || maxLength === null ? 20 : maxLength;
    if (!string) return string;
    if (maxL < 1) return string;
    if (string.length <= maxL) return string;
    if (maxL === 1) return String(string).substring(0, 1) + '...';

    var midpoint = Math.ceil(string.length / 2);
    var toremove = string.length - maxL;
    var lstrip = Math.ceil(toremove / 2);
    var rstrip = toremove - lstrip;
    return String(string).substring(0, midpoint - lstrip) + '...'
        + String(string).substring(midpoint + rstrip);
}

function splitTextByCharacterSkippingBlanks(textToSplit, splitChar) {
    let array = textToSplit.split(splitChar);
    return array.filter(line => line.length > 0);
}

function elementsArrayForClassNameFromElementID(elementID, classname) {
    return Array.from(document.getElementById(elementID).getElementsByClassName(classname));
}

function elementsArrayForClassNameFromElementObject(elementObj, classname) {
    return Array.from(elementObj.getElementsByClassName(classname));
}

function elementsArrayForClassName(classname) {
    return Array.from(document.getElementsByClassName(classname));
}

function elementsArrayForManyClassNames(classnamesArray) {
    let arry = [];
    classnamesArray.forEach(cn => {
        arry = arry.concat(Array.from(document.getElementsByClassName(cn)));
    });
    return arry;
}

function arrayWithoutDuplicates(array) {
    const newset = new Set(array);
    return [...newset];
    // if indexOf the item is the same as the running counter then we are seeing it first time so it filters thru.
    //return array.filter((item, index) => array.indexOf(item) === index);
}

function arrayOfIndicesForLength(length) {
    return Array.from(Array(length).keys());//0...N
}

function shuffleThisArray(array2shuffle) {
    for (let i = array2shuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array2shuffle[i], array2shuffle[j]] = [array2shuffle[j], array2shuffle[i]];
    }
}

function loadLocalScript(id, src) {
    let scr = document.createElement('script');
    scr.id = id;
    scr.src = src;
    document.body.appendChild(scr);
    document.body.removeChild(scr);
}

//---------- ******** Alerts *********** ------------------------//
function myAlert(msg, icon) {
    const modalalert = $('#modalAlert');
    modalalert.modal("hide");
    document.getElementById("modalAlert-body").innerHTML = msg;
    document.getElementById("span-alert-icon").innerHTML = icon === myAlert_alert ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-info-circle"></i>';
    document.getElementById("span-alert-icon").style.color = icon === myAlert_alert ? 'orangered' : 'black';
    modalalert.modal();
}
function showConfirmAlert(msg,confirmFunc){
    const modalalert = $('#modalConfirmAlert');
    modalalert.modal("hide");
    document.getElementById("modalConfirmAlert-body").innerHTML = msg;
    document.getElementById("modalConfirmAlert-confirmBtn").onclick=confirmFunc;
    modalalert.modal();
}
function show2OptionsAlert(msg,opt1confirmFunc,opt2confirmFunc,opt1Str,opt2Str){
    const modalalert = $('#modalOptionAlert');
    modalalert.modal("hide");
    //buttons go Cancel - Least damaging opt - Most damaging opt
    document.getElementById("modalOptionAlert-body").innerHTML = msg;
    document.getElementById("modalOptionAlert-opt1Btn").onclick=opt1confirmFunc;
    document.getElementById("modalOptionAlert-opt1Btn").innerText=opt1Str;
    document.getElementById("modalOptionAlert-opt2Btn").onclick=opt2confirmFunc;
    document.getElementById("modalOptionAlert-opt2Btn").innerText=opt2Str;
    modalalert.modal();
}
function blinkElementHashID(id) {
    $(id).fadeOut(70).fadeIn(70);
}
function floatFromStyleStr(sstr) {
    return Number.parseFloat(sstr);
}
//---------- ******** Debugging *********** ------------------------//
function cll() {
    console.log([...arguments].join(" "));
}
function cllts() {
    console.log([new Date().getTime()+Math.random(),...arguments].join(" "));
}
/*
function randomNumTag(msg){
    return Math.floor(Math.random()*1000)+" >>>  "+msg;
}
*/
