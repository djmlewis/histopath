/******************************************************************************
 * Copyright (c) 14/2/2021 4:22     djml.uk E&OE.                             *
 ******************************************************************************/
let postitDragStartOffset = null;
let applyPIflip=true;
let draggedPIrect;
let postitDragBoundingRect = [0, 0];
let postitDragStartTopLeft = [0, 0];

// ================================================= palette icons
const pi_ColBG_ofIcon = {
    black: "black",
    red: "red",
    orange: "#ff9300",
    white: "black",
    pink: "rgba(255,137,216,1)",
    yellow: "#ffcc66",
    green: "#00cc33",
    blue: "#0096ff",
    transparent: "black"
};
const pi_ColBG_display = {
    black: "rgba(66,66,66,0.9)",
    red: "rgba(255,38,0,0.9)",
    orange: "rgba(255,147,0,0.9)",
    white: "rgba(255,255,255,0.9)",
    pink: "rgba(255,137,216,0.9)",
    yellow: "rgba(254,252,120,0.9)",
    green: "rgba(114,250,120,0.9)",
    blue: "rgba(117,213,255,0.9)",
    transparent: "transparent"
};
const pi_ColBG_iconClass = {
    black: "fas fa-sticky-note fa-fw",
    red: "fas fa-sticky-note fa-fw",
    orange: "fas fa-sticky-note fa-fw",
    white: "far fa-sticky-note fa-fw",
    pink: "fas fa-sticky-note fa-fw",
    yellow: "fas fa-sticky-note fa-fw",
    green: "fas fa-sticky-note fa-fw",
    blue: "fas fa-sticky-note fa-fw",
    transparent: "fas fa-sticky-note fa-fw"
};

const pi_ColCorner_display = {
    black: "#5e5e5e",
    red: "rgba(62,9,0,1)",
    orange: "rgba(255,71,0,1)",
    white: "#5e5e5e",
    pink: "rgba(127,0,85,1)",
    yellow: "#8b2f00",
    green: "rgba(0,52,2,1)",
    blue: "rgba(1,24,146,1)",
    transparent: "black"
};

const pi_ColTXT_ofIcon = {
    black: "black",
    red: "red",
    orange: "orange",
    white: "white",
    pink: "pink",
    yellow: "yellow",
    green: "#008f51",
    blue: "#0432ff",
    transparent: "transparent"
};
const pi_ColTXT_display = {
    black: "black",
    red: "red",
    orange: "orange",
    white: "white",
    pink: "pink",
    yellow: "yellow",
    green: "#008f51",
    blue: "#0432ff",
    transparent: "transparent"
};
const pi_ColTXT_iconClass = {
    black: "fas fa-font fa-fw",
    red: "fas fa-font fa-fw",
    orange: "fas fa-font fa-fw",
    white: "far fa-sticky-note fa-fw",
    pink: "fas fa-font fa-fw",
    yellow: "fas fa-font fa-fw",
    green: "fas fa-font fa-fw",
    blue: "fas fa-font fa-fw",
    transparent: "fas fa-font fa-fw"
};

const pi_TXTsize = {s:"1rem",m:"1.5rem",l:"2rem"};
const pi_TXTwidth = {s:"8rem",m:"12rem",l:"16rem"};

function iconColourForDataColour(textOrBG, dataColour) {
    if (textOrBG === "text") return pi_ColTXT_ofIcon[dataColour];
    else return pi_ColBG_ofIcon[dataColour];
}

function iconClassForDataColour(textOrBG, dataColour) {
    if (textOrBG === "text") return pi_ColTXT_iconClass[dataColour];
    else return pi_ColBG_iconClass[dataColour];
}

function displayColourForDataColour(textOrBG, dataColour) {
    if (textOrBG === "text") return pi_ColTXT_display[dataColour];
    else return pi_ColBG_display[dataColour];
}

// ================================================= Startup
function unlockPostitsCapability() {
    //the OS is done in note.js
    // do rotate first to be ready for drawing
    if (!localStorage.getItem(ls_postitsRotate)) localStorage.setItem(ls_postitsRotate, "true");
    window.postitsRotate = localStorage.getItem(ls_postitsRotate) === "true";
    document.getElementById("checkbox-postitsrotate").checked = window.postitsRotate;

    setupPIPaletteButtonsOnStartup();
    document.getElementById("btn-showPostitsPalette").hidden = false;
    document.getElementById("btn-showPostits").hidden = false;
    document.getElementById("btn-showPostits-click").hidden = false;
    //have to re-call these as there may have been a delay between the first card image load and this being unlocked
    updatePostitsRecordForCardObjOnLoad(getSelectCardsSelectedCardObject());
    updateSVGdoodlesOnCardImageLoad();
}

function setupPIPaletteButton(btn, btype, dataColour) {
    //override the dataCol on the button if supplied. We use this to setup the dropdown buttons
    if (!!dataColour) btn.setAttribute("data-colour", dataColour);
    const icon = btn.getElementsByTagName("i")[0];
    const displayCol = btn.getAttribute("data-colour");
    icon.style.color = iconColourForDataColour(btype, displayCol);
    icon.className = iconClassForDataColour(btype, displayCol);
}

function defaultPIdropdowns() {
    // we set the initial dropdown data colour using a default
    setupPIPaletteButton(document.getElementById("btn-postit-txtc"), "text", postit_defaultTxtDataCol);
    setupPIPaletteButton(document.getElementById("btn-postit-bgc"), "bgc", postit_defaultBGDataCol);
    document.getElementById("btn-postit-txtsz").setAttribute("data-txtsz",postit_defaultTxtSize);
}

function updatePostitsRecordForCardObjOnLoad(selectedCardObj) {
    // hide the palette if visib;e
    if (!document.getElementById("div-postits").hidden) togglePostitsPaletteAndSBnote(true);
    resetNoPostitSelected();
    resetToEmptyPostitsPaletteDefaultStyles(true);
    emptyPostitsHanger();
    setPostitsNoPointerEvents(true);
    //here we load the postitrecord if it exists or make a blank one to use
    if (!!selectedCardObj) retrievePostitsRecordForCardID(selectedCardObj.uniqueCardID);
    else {
        window.postitsDoodlesRecordForSelectedCard = null;
    }
}

// ================================================= db calls
function retrievePostitsRecordForCardID(uniquecardid) {
    if (!!window.db_notes) {
        const transaction = window.db_notes.transaction([dbNotes_OS_name_postits]);//readonly
        //transaction.oncomplete = function (ev) { cll("retrievePostitsRecordForCardID transaction.oncomplete -- " + ev.type); };
        transaction.onerror = function (ev) {
            cll("retrievePostitsRecordForCardID transaction.onerror -- " + ev.target["errorCode"]);
        };
        const objectStore = transaction.objectStore(dbNotes_OS_name_postits);
        const UCIDindex = objectStore.index(dbNotes_uniquecardID);
        const getRequest = UCIDindex.get(uniquecardid);
        getRequest.onsuccess = function (event) {
            const existingpostitsRecord = event.target["result"];
            window.postitsDoodlesRecordForSelectedCard = !!existingpostitsRecord ? existingpostitsRecord : newEmptyPostitsOSRecordForUCID(uniquecardid);
            //repair the window.postitsDoodlesRecordForSelectedCard[dbNotes_svgHTML]
            if(!window.postitsDoodlesRecordForSelectedCard[dbNotes_svgHTML]) window.postitsDoodlesRecordForSelectedCard[dbNotes_svgHTML] = "";
            populatePostitsHangerFromRecordAsActive();
            updateSVGdoodlesOnPostitsDoodlesRecordLoad();
        };
        getRequest.onerror = function (ev) {
            cll("retrievePostitsRecordForCardID getRequest.onerror -- " + ev.target["errorCode"]);
            window.postitsDoodlesRecordForSelectedCard = newEmptyPostitsOSRecordForUCID(uniquecardid);
            populatePostitsHangerFromRecordAsActive();
            updateSVGdoodlesOnPostitsDoodlesRecordLoad();
        };
    } else {
        window.postitsDoodlesRecordForSelectedCard = null;
    }
}

function addOrUpdatePostitDoodlesRecordForCardToDB() {
    if (!!window.db_notes) {
        const uniquecardid = window.postitsDoodlesRecordForSelectedCard.uniquecardID;
        const transaction = window.db_notes.transaction([dbNotes_OS_name_postits], 'readwrite');//readwrite
        //transaction.oncomplete = function (ev) { };
        transaction.onerror = function (ev) {
            cll("addPostitsRecordForCardToDB transaction.onerror -- " + ev.target["errorCode"]);
        };
        const objectStore = transaction.objectStore(dbNotes_OS_name_postits);
        const UCIDindex = objectStore.index(dbNotes_uniquecardID);
        const getRequest = UCIDindex.get(uniquecardid);
        getRequest.onsuccess = function (event) {
            const existingpostitsRecord = event.target["result"];
            if (!!existingpostitsRecord) {
                // replace the postits array in existingpostitsRecord
                existingpostitsRecord[dbNotes_postitsArray] = window.postitsDoodlesRecordForSelectedCard[dbNotes_postitsArray];
                existingpostitsRecord[dbNotes_svgHTML] = window.postitsDoodlesRecordForSelectedCard[dbNotes_svgHTML];
                // Put this updated existingNote back into the database. The record has property 'key' to match back
                const putRequest = objectStore.put(existingpostitsRecord);
                putRequest.onerror = function (ev) {
                    cll(uniquecardid + " addPostitsRecordForCardToDB-- putRequest.onerror -- " + ev.type);
                };
            } else {
                // Add window.postitsDoodlesRecordForSelectedCard into the database. The 'key' is autogenerated
                const addRequest = objectStore.add(window.postitsDoodlesRecordForSelectedCard);
                addRequest.onerror = function (ev) {
                    cll(uniquecardid + " addPostitsRecordForCardToDB-- addRequest.onerror -- " + ev.type);
                };
            }
        };
        getRequest.onerror = function (ev) {
            cll(uniquecardid + " addPostitsRecordForCardToDB-- getRequest.onerror -- " + ev.type)
        };
    }
}

// ================================================= postit obj ele, and record
function newEmptyPostitsOSRecordForUCID(cardID) {
    // 'key' added by autoincrement
    return {uniquecardID: cardID, postitsarray: [], svgHTML: ""};
}

function newEmptyPostitObj() {
    return {
        id: new Date().getTime().toString(),
        top: '0px',
        left: '0px',
        txtc: postit_defaultTxtDataCol,
        txtsz:"s",
        bgc: postit_defaultBGDataCol,
        text: ""
    };
}

function newPostitObjWithValues(valuesObj) {
    const newPostit = newEmptyPostitObj();
    newPostit.bgc = valuesObj.bgc;
    newPostit.txtc = valuesObj.txtc;
    newPostit.txtsz = valuesObj.txtsz;
    newPostit.text = valuesObj.text;
    return newPostit;
}

function newPostitElementWithObj(postitobj) {
    const el = document.createElement('div');
    el.className = "postit-note d-flex align-items-center";
    if (window.postitsRotate && setting_cardIsRotatedIsTrue()) el.classList.add("postit-note-rotated");//!window.postitsBeingEdited &&
    el.setAttribute("data-id", postitobj.id);
    el.setAttribute("data-bgc", postitobj.bgc);
    el.setAttribute("data-txtc", postitobj.txtc);
    el.setAttribute("data-txtsz", postitobj.txtsz);
    el.style.position = "absolute";
    const coords = correctfigHangerXYWithRotation_px([postitobj.left, postitobj.top], figToHanger,true);//xy
    el.style.top = coords[1];//postitobj.top;
    el.style.left = coords[0];//postitobj.left;
    el.style.color = displayColourForDataColour('text', postitobj.txtc);
    el.style.backgroundColor = displayColourForDataColour('bgc', postitobj.bgc);

    const corner = document.createElement('div');
    corner.className = "postit-corner";
    corner.style.borderColor = pi_ColCorner_display[postitobj.bgc];
    corner.style.color = pi_ColCorner_display[postitobj.bgc];
    corner.innerHTML='<i class="fas fa-anchor postit-anchor"></i>';
    corner.hidden = true;
    el.appendChild(corner);

    const txtxdiv = document.createElement('div');
    txtxdiv.className = "postit-note-text flex-grow-1";
    txtxdiv.innerHTML = postitobj.text;
    txtxdiv.style.fontSize=pi_TXTsize[postitobj.txtsz];
    txtxdiv.style.width=pi_TXTwidth[postitobj.txtsz];
    txtxdiv.style.maxWidth=pi_TXTwidth[postitobj.txtsz];
    el.appendChild(txtxdiv);

    el.onclick = postitClicked;
    el.onmousedown = postitDragStart;
    el.onmouseup = postitDragEnd;
    el.onmouseleave = postitDragEnd;
    el.onmouseout = postitDragEnd;
    el.ontouchstart = postitTouchStart;
    el.ontouchend = postitTouchEnd;
    el.ontouchcancel = postitTouchEnd;
    return el;
}

// ================================================= postits hanger
function emptyPostitsHanger() {
    const postits = document.getElementById("div-postitsHanger").getElementsByClassName("postit-note");
    while (postits.length > 0) postits[0].parentNode.removeChild(postits[0]);
}

function setPostitsNoPointerEvents(none) {
    showHidePostitsHangerAccordingToSetting(none);
    window.postitsBeingEdited = !none;
    const hanger = document.getElementById("div-postitsHanger");
    if (none) {
        hanger.classList.remove("div-postitsHanger-active");
        hanger.classList.add("div-postitsHanger-inactive");
    } else {
        hanger.classList.remove("div-postitsHanger-inactive");
        hanger.classList.add("div-postitsHanger-active");
    }
    // add the active state to postits
    populatePostitsHangerFromRecordAsActive();
    updatePostitsActiveState();
}

function updatePostitsActiveState() {
    // determines whether they have pointer events etc
    for (const postitEle of document.getElementById("div-postitsHanger").getElementsByClassName("postit-note")) {
        if (window.postitsBeingEdited) {
            postitEle.classList.add("postit-note-active");
        } else {
            postitEle.classList.remove("postit-note-active");
            postitEle.getElementsByClassName("postit-corner")[0].hidden = true;
        }
    }
}

function adjustDivPostitsSize(cardimage) {
    const divpostitsHanger = document.getElementById("div-postitsHanger");
    divpostitsHanger.style.width = (setting_cardIsRotatedIsTrue() ? cardimage.height : cardimage.width) + "px";
    divpostitsHanger.style.height = (setting_cardIsRotatedIsTrue() ? cardimage.width : cardimage.height) + "px";
    divpostitsHanger.style.left = cardimage.offsetLeft + "px";
    populatePostitsHangerFromRecordAsActive();
}

function populatePostitsHangerFromRecordAsActive() {
    const divpostitsHanger = document.getElementById("div-postitsHanger");
    emptyPostitsHanger();
    if (!!window.postitsDoodlesRecordForSelectedCard) {
        for (const postitObj of window.postitsDoodlesRecordForSelectedCard.postitsarray) {
            const newpostitele = newPostitElementWithObj(postitObj);
            divpostitsHanger.appendChild(newpostitele);
        }
    }
    updatePostitsActiveState();
}

function toggleNotesLegendFromPostit() {
    inactivatePostitsAndDoodles();
    toggleNotesLegend('legend');
    setPostitsNoPointerEvents(true);
    resetToEmptyPostitsPaletteDefaultStyles(true);
}

function showHidePostitsHangerAccordingToSetting(notEditing) {
    const hide = window.hidePostitsDoodles && notEditing;
    const display = hide ? "none" : "unset";
    document.getElementById("div-postitsHanger").hidden = hide;
    document.getElementById("svg-doodles").setAttributeNS(null, 'display', display);
}

function togglePostitsDisplay(source,btn) {
    window.hidePostitsDoodles = !window.hidePostitsDoodles;
    if(source==='img') document.getElementById("checkbox-hidepostits").checked=window.hidePostitsDoodles;
    btn.blur();
}

function handlePostitsHangerClicked(e) {
    e.stopPropagation();
    e.preventDefault();
    if (window.selectedPostitID === "") addNewPostitToFigure(true, [e.offsetX, e.offsetY]);
    // postitTouchStart handles a click as onclick does not register
}

// ================================================= palette
function togglePostitsPaletteAndSBnote(hidepostits) {
    const divpostit = document.getElementById("div-postits");
    const divsbnotes = document.getElementById("div-sidebarnotes");
    divpostit.hidden = hidepostits;
    divsbnotes.hidden = !hidepostits;
    setPostitsNoPointerEvents(hidepostits);
    if(hidepostits) {
        inactivatePostitsAndDoodles();//must come first as sets up postits to edit and must be undone
        resetToEmptyPostitsPaletteDefaultStyles(true);
    }
    //document.getElementById((hidepostits ? "textarea-notes" : "textarea-postit")).focus();
}

function showUpdatePostitButton(show) {
    //document.getElementById("btn-addNewPostitToFigure").hidden = !show;
    document.getElementById("btn-updateSelectedPostit").hidden = !show;
    document.getElementById("btn-addpostit").hidden = show;
    //document.getElementById("div-postitsHanger-message").hidden = show;
    if (show) document.getElementById("div-postitsHanger").classList.add("div-postitshanger-editingPostit");
    else document.getElementById("div-postitsHanger").classList.remove("div-postitshanger-editingPostit");
}

function deselectAllPostits() {
    for (const postitEle of document.getElementById("div-postitsHanger").getElementsByClassName("postit-note")) {
        postitEle.getElementsByClassName("postit-corner")[0].hidden = true;
    }
}

function resetNoPostitSelected() {
    deselectAllPostits();
    window.selectedPostitID = "";
    showUpdatePostitButton(false);
}

function resetToEmptyPostitsPaletteDefaultStyles(defaultDropdowns) {
    const ta = document.getElementById("textarea-postit");
    ta.value = "";
    if (defaultDropdowns) {
        ta.style.color = postit_defaultTxtDataCol;
        ta.style.backgroundColor = postit_defaultBGDataCol;
        ta.style.fontSize = postit_defaultTxtSize;
        defaultPIdropdowns();
    }
    window.selectedPostitID = "";
    resetNoPostitSelected();
    //ta.focus();
}

function setupPaletteForSelectedPostit(ele) {
    deselectAllPostits();
    window.selectedPostitID = ele.getAttribute("data-id");
    ele.getElementsByClassName("postit-corner")[0].hidden = false;
    setPIPaletteValues(
        {
            bgc: ele.getAttribute("data-bgc"),
            txtsz: ele.getAttribute("data-txtsz"),
            txtc: ele.getAttribute("data-txtc"),
            text: ele.getElementsByClassName("postit-note-text")[0].innerText
        }
    );
}

function setupPIPaletteButtonsOnStartup() {
    defaultPIdropdowns();
    // we use the data colour from the button html
    for (const btn of document.getElementById("dropdown-piBGC").children) setupPIPaletteButton(btn, "bgc");
    for (const btn of document.getElementById("dropdown-piTXTC").children) setupPIPaletteButton(btn, "text");
}

function setPIPaletteTextColour(dataCol) {
    //const dataCol=btn.getAttribute("data-colour");
    document.getElementById("textarea-postit").style.color = displayColourForDataColour('text', dataCol);
    setupPIPaletteButton(document.getElementById("btn-postit-txtc"), "text", dataCol);
}

function setPIPaletteBGColour(dataCol) {
    //const dataCol=btn.getAttribute("data-colour");
    document.getElementById("textarea-postit").style.backgroundColor = displayColourForDataColour('bgc', dataCol);
    setupPIPaletteButton(document.getElementById("btn-postit-bgc"), "bgc", dataCol);
}

function setPIPaletteTextSize(datasize) {
    document.getElementById("textarea-postit").style.fontSize = pi_TXTsize[datasize];
    document.getElementById("btn-postit-txtsz").setAttribute("data-txtsz",datasize);
}

function getPIPaletteValues() {
    return {
        bgc: document.getElementById("btn-postit-bgc").getAttribute("data-colour"),
        txtc: document.getElementById("btn-postit-txtc").getAttribute("data-colour"),
        txtsz: document.getElementById("btn-postit-txtsz").getAttribute("data-txtsz"),
        text: document.getElementById("textarea-postit").value
    };
}

function setPIPaletteValues(valuesObj) {
    setPIPaletteBGColour(valuesObj.bgc);
    setPIPaletteTextColour(valuesObj.txtc);
    setPIPaletteTextSize(valuesObj.txtsz);
    const ta = document.getElementById("textarea-postit");
    ta.value = valuesObj.text;
}

// ================================================= postits
function addNewPostitBtnTapped() {
    addNewPostitToFigure(true, [document.getElementById("div-postitsHanger").getBoundingClientRect().width / 2, document.getElementById("col-image").scrollTop + 100]);
}

function addNewPostitToFigure(add, coords) {
    if (document.getElementById("textarea-postit").value.length > 0) {
        if (add && coords) {
            const newPI = newPostitObjWithValues(getPIPaletteValues());
            const corCoords = correctfigHangerXYWithRotation_px(coords, hangerToFig,true);
            newPI.left = corCoords[0];
            newPI.top = corCoords[1];
            window.postitsDoodlesRecordForSelectedCard.postitsarray.push(newPI);
        } else {
            const selPostitObjInRecord = window.postitsDoodlesRecordForSelectedCard.postitsarray.find(pi => pi.id === window.selectedPostitID);
            if (selPostitObjInRecord) {
                const newVals = getPIPaletteValues();
                selPostitObjInRecord.bgc = newVals.bgc;
                selPostitObjInRecord.txtc = newVals.txtc;
                selPostitObjInRecord.txtsz = newVals.txtsz;
                selPostitObjInRecord.text = newVals.text;
            }
        }
        addOrUpdatePostitDoodlesRecordForCardToDB();
        populatePostitsHangerFromRecordAsActive();
        resetToEmptyPostitsPaletteDefaultStyles(!add);
    } else blinkElementHashID("#textarea-postit");
}

function clearAllPostitsDoodlesForCardAfterConfirm() {
    showConfirmAlert("Are you certain you want to delete all post-its and annotations on this card?<br>" +
        "If you tap <b class='font-weight-bold text-danger'>Proceed</b> this cannot be undone.", () => {
        clearAllPostitsDoodlesForCardProceed()
    });
}

function clearAllPostitsDoodlesForCardProceed() {
    emptyPostitsHanger();
    window.postitsDoodlesRecordForSelectedCard.postitsarray = [];
    emptyDoodlesSVG();
    setNoDoodleIsNowSelected();
    addOrUpdatePostitDoodlesRecordForCardToDB();
}

function deleteSelectedPostit() {
    const selPostitObjInRecord = window.postitsDoodlesRecordForSelectedCard.postitsarray.find(pi => pi.id === window.selectedPostitID);
    if (selPostitObjInRecord) {
        window.postitsDoodlesRecordForSelectedCard.postitsarray.splice(window.postitsDoodlesRecordForSelectedCard.postitsarray.indexOf(selPostitObjInRecord), 1);
        addOrUpdatePostitDoodlesRecordForCardToDB();
        populatePostitsHangerFromRecordAsActive();
        resetToEmptyPostitsPaletteDefaultStyles(true);
    }
}

function updatePostitLocation(id, top, left) {
    const draggedPostitIndx = window.postitsDoodlesRecordForSelectedCard.postitsarray.findIndex(r => r.id === id);
    if (draggedPostitIndx >= 0) {
        window.postitsDoodlesRecordForSelectedCard.postitsarray[draggedPostitIndx].top = top;
        window.postitsDoodlesRecordForSelectedCard.postitsarray[draggedPostitIndx].left = left;
        addOrUpdatePostitDoodlesRecordForCardToDB();
    }
}

// ================================================= DRAGGING postits
function postitDragStart(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.onmousemove = postitDragMove;
    startThesePICoords(e.clientX,e.clientY,e.target);
 }
function postitTouchStart(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.ontouchmove = postitTouchMove;
    if (e.targetTouches.length === 1) {
        startThesePICoords(e.targetTouches[0].clientX,e.targetTouches[0].clientY,e.target);
        // touch ignores click so we have to generate it
        handlepostitClicked(e.target);
    }
}
function postitDragMove(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!!postitDragStartOffset) moveThesePICoords(e.clientX,e.clientY,e.target);
}
function postitTouchMove(e) {
    e.stopPropagation();
    e.preventDefault();
    // If there's exactly one finger inside this element
    if (!!postitDragStartOffset && e.targetTouches.length === 1) moveThesePICoords(e.targetTouches[0].clientX,e.targetTouches[0].clientY,e.target);
}
function postitDragEnd(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!!postitDragStartOffset) {
        e.target.onmousemove = undefined;
        if (postitDragStartTopLeft[0] !== e.target.style.top || postitDragStartTopLeft[1] !== e.target.style.left) {
            const coords = correctfigHangerXYWithRotation_px([e.target.style.left, e.target.style.top], hangerToFig,true);//xy
            updatePostitLocation(e.target.getAttribute("data-id"), coords[1], coords[0]);
        }
        postitDragStartOffset = null;
    }
}
function postitTouchEnd(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!!postitDragStartOffset) {
        e.target.ontouchmove = undefined;
        if (postitDragStartTopLeft[0] !== e.target.style.top || postitDragStartTopLeft[1] !== e.target.style.left) {
            const coords = correctfigHangerXYWithRotation_px([e.target.style.left, e.target.style.top], hangerToFig,true);//xy
            updatePostitLocation(e.target.getAttribute("data-id"), coords[1], coords[0]);
        }
        postitDragStartOffset = null;
    }
}
function moveThesePICoords(x,y,pi) {
    const newLeft = x + postitDragStartOffset[0];
    const newTop = y + postitDragStartOffset[1];
    const safeTop= applyPIflip ? draggedPIrect.height+postitHangerSafetyMargin : postitHangerSafetyMargin;
    pi.style.left = Math.min(Math.max(postitHangerSafetyMargin, newLeft), postitDragBoundingRect[0]) + 'px';
    pi.style.top = Math.min(Math.max(safeTop, newTop), postitDragBoundingRect[1]) + 'px';
}
function startThesePICoords(x,y,pi) {
    postitDragStartOffset = [
        pi.offsetLeft - x,
        pi.offsetTop - y
    ];
    postitDragStartTopLeft = [pi.style.top, pi.style.left];
    draggedPIrect=pi.getBoundingClientRect();
    applyPIflip=(window.postitsRotate && setting_cardIsRotatedIsTrue());
    const safeTop= applyPIflip ? draggedPIrect.height : 0;
    postitDragBoundingRect = [pi.parentElement.getBoundingClientRect().width - draggedPIrect.width-postitHangerSafetyMargin,
        pi.parentElement.getBoundingClientRect().height - draggedPIrect.height-postitHangerSafetyMargin+safeTop];
}

function postitClicked(e) {
    e.stopPropagation();
    e.preventDefault();
    handlepostitClicked(e.target)
}
function handlepostitClicked(target) {
    setupPaletteForSelectedPostit(target);
    showUpdatePostitButton(true);
}

// ================================================= XY coords
function correctfigHangerXYWithRotation_px(coords, direction, applyRotation) {
    // outputs string with "px" suffix
    //postits applyRotation as they do not rotate, doodleSVG does not applyRotation as it rotates for us
    let xCorr;
    let yCorr;
    let xOrig = Number.parseInt(coords[0], 10);
    let yOrig = Number.parseInt(coords[1], 10);
    let cardRatio = (window.imageCard.width / window.imageCard.naturalWidth);
    if (direction === figToHanger) {
        if (applyRotation && setting_cardIsRotatedIsTrue()) {
            /* This is to the card image hotspot calculation as we do NOT transform the hanger div - we just adust the width-height of the div to match
            the actual dimensions of the rotated/unrotated card image. With hotspots the system reports xyOrig as though the image was not rotaed, it swaps the values as needed
             In this case a 90deg rotation means that Xcorr is Yorig, but Ycorr cannot just be Xorig as Xorig measured from the left and now it measures UP
              from the baseline, which would be OK in usual geometry but in html Y is measured DOWN from the top. So we have to subtract Xorig from
              the card NATURALWIDTH (width is now height as card is rotated). This gives us the measurement down from the div top.
              We use NATURALwidth because we converted hanger coords and saved the XY coords in actual image xy coords when we drag ended,
              so we can refer back to the actual image dimensions.
              THE ORDER IN WHICH THE cardimage.naturalWidth subtraction is done is crucial! The stored value is in image coordinates, but we use "xyOrig"
              to refer to the coordinates coming into the function. In figToHanger xyOrig are in image coords and so  we can subtract berore the correction with cardRatio
              as both xyOrig and cardimage.naturalWidth are from the same coordinate system. In contrast with hangerToFig xyOrig are in hanger coords and must be
              adjusted by the cardRatio BEFORE subtracting from cardimage.naturalWidth. Hence
              figToHanger: (cardimage.naturalWidth - xOrig) * cardRatio
              hangerToFig: cardimage.naturalWidth - (yOrig / cardRatio)
              It is a few pixels out due to integer maths and rounding probably.*/
            xCorr = (yOrig * cardRatio);
            yCorr = ((window.imageCard.naturalWidth - xOrig) * cardRatio);
        } else {
            xCorr = (xOrig * cardRatio);
            yCorr = (yOrig * cardRatio);
        }
    } else { /* hangerToFig */
        if (applyRotation && setting_cardIsRotatedIsTrue()) {
            xCorr = (window.imageCard.naturalWidth - (yOrig / cardRatio));
            yCorr = (xOrig / cardRatio);
        } else {
            xCorr = (xOrig / cardRatio);
            yCorr = (yOrig / cardRatio);
        }
    }
    return [Math.round(xCorr) + "px", Math.round(yCorr) + "px"];
}
/*
function correctfigHangerXYNoRotation_integer(coords, direction) {
    let xCorr;
    let yCorr;
    let xOrig = Number.parseInt(coords[0], 10);
    let yOrig = Number.parseInt(coords[1], 10);
    let cardRatio = (window.imageCard.width / window.imageCard.naturalWidth);
    if (direction === figToHanger) {
        xCorr = (xOrig * cardRatio);
        yCorr = (yOrig * cardRatio);

    } else { /!* hangerToFig *!/
        xCorr = (xOrig / cardRatio);
        yCorr = (yOrig / cardRatio);
    }
    return [Math.round(xCorr), Math.round(yCorr)];
}
*/
function correctfigHangerXYNoRotation_float(coords, direction) {
    let xCorr;
    let yCorr;
    let xOrig = Number.parseFloat(coords[0]);
    let yOrig = Number.parseFloat(coords[1]);
    let cardRatio = (window.imageCard.width / window.imageCard.naturalWidth);
    if (direction === figToHanger) {
        xCorr = (xOrig * cardRatio);
        yCorr = (yOrig * cardRatio);

    } else { /* hangerToFig */
        xCorr = (xOrig / cardRatio);
        yCorr = (yOrig / cardRatio);
    }
    return [xCorr, yCorr];
}

// ================================================= Share
function showClearPostitsModal(toolbar) {
    //showAllRecords();
    if (toolbar) {
        toggleActionmenuToolbar();
        setTimeout(function () {
            $('#modalClearPostits').modal();
        }, 500);
    } else $('#modalClearPostits').modal();
}

function clearPostits() {
    if (!!window.db_notes) {
        const transaction = window.db_notes.transaction([dbNotes_OS_name_postits], "readwrite");// check and put
        // report on the success of the transaction completing, when everything is done
        //transaction.oncomplete = function (ev) { cll("clearNotes transaction.oncomplete -- " + ev.type); };
        transaction.onerror = function (ev) {
            cll("clearPostits transaction.onerror -- " + ev.target["errorCode"]);
        };
        const objectStore = transaction.objectStore(dbNotes_OS_name_postits);
        // Make a request to clear all the data out of the object store
        var objectStoreRequest = objectStore.clear();
        objectStoreRequest.onsuccess = function () {
            updatePostitsRecordForCardObjOnLoad(getSelectCardsSelectedCardObject());
            emptyDoodlesSVG();
        };
        objectStoreRequest.onerror = function (ev) {
            cll("clearNotes objectStoreRequest.onerror -- " + ev.target["errorCode"]);
        };
    }
}

function importPostitsAfterConfirm(importString) {
    if (!!window.db_notes) {
        show2OptionsAlert("Are you certain you want to import these post-its and annotations?<br> Where a figure does not already have post-its or annotations the imported ones will be added. " +
            "If a figure already has post-its or annotations they will be <b class='font-weight-bold text-danger'>replaced</b> by the imported post-its or annotations " +
            "if you tap <b class='font-weight-bold text-danger'>Replace</b> or <b class='font-weight-bold text-warning'>merged</b> (with possible duplicated post-its / annotations sitting directly on top of existing ones) " +
            "if you tap <b class='font-weight-bold text-warning'>Merge</b>.<br>" +
            "This cannot be undone.",
            () => {
                importPostitsProceed(importString, true)
            },
            () => {
                importPostitsProceed(importString, false)
            },
            "Merge",
            "Replace");
    }
}

function importPostitsProceed(importString, merge) {
    if (!!window.db_notes) {
        JSON.parse(importString).forEach(record => {
            const transaction = window.db_notes.transaction([dbNotes_OS_name_postits], "readwrite");// check and put
            transaction.oncomplete = function () {
                updatePostitsRecordForCardObjOnLoad(getSelectCardsSelectedCardObject())
            };
            transaction.onerror = function (ev) {
                cll("importPostitsProceed transaction.onerror -- " + ev.target["errorCode"]);
            };
            const objectStore = transaction.objectStore(dbNotes_OS_name_postits);
            const UCIDindex = objectStore.index(dbNotes_uniquecardID);
            const getRequest = UCIDindex.get(record[dbNotes_uniquecardID]);
            getRequest.onsuccess = function (event) {
                const existingNote = event.target["result"];
                if (!!existingNote) {
                    if (merge) {
                        //uniquify the ids of the imported array
                        const suffix = new Date().getTime().toString();
                        record.postitsarray = record.postitsarray.map(e => {
                            e.id += suffix;
                            return e;
                        });
                        record.postitsarray = [...record.postitsarray, ...existingNote.postitsarray];
                        // handle SVG merge
                        importMergeSVGwithRecord(record,suffix);
                    }
                    // add the key to the imported postit and put that back into the db
                    record[dbNotes_notesKeyPath] = existingNote[dbNotes_notesKeyPath];
                    var requestUpdate = objectStore.put(record);
                    requestUpdate.onerror = function (ev) {
                        cll(record[dbNotes_uniquecardID] + " -- importPostitsProceed.onerror PUT -- " + ev.type);
                    };
                } else {
                    // Make a request to add our noteToAdd object to the object store
                    const objectStoreRequest = objectStore.add(record);
                    objectStoreRequest.onerror = function (ev) {
                        cll(record[dbNotes_uniquecardID] + " -- importPostitsProceed.onerror -- ADD " + ev.target["errorCode"]);
                    };
                }
            };
            getRequest.onerror = function (ev) {
                cll("importPostitsProceed getRequest.onerror -- " + ev.target["errorCode"]);
            };
        });
    }
}

function exportPostits() {
    if (!!window.db_notes) {
        const transaction = window.db_notes.transaction(dbNotes_OS_name_postits);
        const objectStore = transaction.objectStore(dbNotes_OS_name_postits);
        objectStore.getAll().onsuccess = function (event) {
            const piArray = event.target["result"];
            if (piArray.length > 0) {
                doExportObject(piArray.map(pit => {
                    const {key, ...rest} = pit;//remove key property!
                    return rest; // its an obj with the rest of the keys and their values!
                }), "All post-it notes" + pinotesSuffix);
            } else {
                myAlert("There are no post-it notes to export.", myAlert_alert);
            }
        };
        transaction.onerror = function (ev) {
            cll("exportPostits transaction.onerror -- " + ev.target["errorCode"]);
        };
    }
}

// ================================================= postitsRotate
function handlePostitsRotateSwitchClick(eletype, chkbx) {
    const cbx = !!chkbx ? chkbx : document.getElementById("checkbox-postitsrotate");
    cbx.blur();
    if (eletype === "img") cbx.checked = !cbx.checked;
    localStorage.setItem(ls_postitsRotate, cbx.checked.toString());
    window.postitsRotate = cbx.checked;
    populatePostitsHangerFromRecordAsActive();
}
// ================================================= Doodle
function togglePIpanelDoodle(source,btn) {
    if(source==="pi") {
        document.getElementById("div-pipalette").classList.remove("hideInFlexCol");
        document.getElementById("div-doodlepalette").classList.add("hideInFlexCol");
        document.getElementById("btn-pifromdo").classList.add("btn-postits-active");
        document.getElementById("btn-showdoodle").classList.remove("btn-postits-active");
    } else {
        document.getElementById("div-pipalette").classList.add("hideInFlexCol");
        document.getElementById("div-doodlepalette").classList.remove("hideInFlexCol");
        document.getElementById("btn-pifromdo").classList.remove("btn-postits-active");
        document.getElementById("btn-showdoodle").classList.add("btn-postits-active");
    }
    setDoodlesSVGNoPointerEvents(source==="pi");
    window.postitsBeingEdited=source==="pi";
    updatePostitsActiveState();
    if(!!btn) btn.blur();
}
function inactivatePostitsAndDoodles() {
    togglePIpanelDoodle('pi');
    //override the settings togglePIpanelDoodle introduced
    setDoodlesSVGNoPointerEvents(true);
    setPostitsNoPointerEvents(true);
    resetToEmptyPostitsPaletteDefaultStyles(true);
    window.postitsBeingEdited=false;
    updatePostitsActiveState();
}