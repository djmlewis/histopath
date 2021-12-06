/******************************************************************************
 * Copyright (c) 6/12/2021 11:53     djml.uk E&OE.                            *
 ******************************************************************************/

//================= STARTUP
function applySettingsAtStartup() {
    setupShowHideCheckboxesAtStartup();
    applyRandomiseCheckboxesSettings();
    loadLastCardLoaded();
}


//================= CHECKBOXES
function applyRandomiseCheckboxesSettings() {
    randomiseCheckboxesIDs.forEach(cbxid=>{
        if (!localStorage.getItem(cbxid)) localStorage.setItem(cbxid, "true");
        fullscreenIDs.forEach(fsid=>{
            document.getElementById(cbxid+fsid).checked = localStorage.getItem(cbxid) === "true";
        });
    });
}

function updateRandomiseCheckboxesSettings() {
    // dont need to query fs cbxs as aligned with mainscreen
    randomiseCheckboxesIDs.forEach(cbxid=>{
        localStorage.setItem(cbxid, document.getElementById(cbxid).checked === true ? "true" : "false");
    });
}


//================= LAST CARD
function recordLastCardLoaded(cardUniqueID) {
    localStorage.setItem(ls_lastCardLoaded, cardUniqueID);
}

function loadLastCardLoaded() {
    const lastCard = localStorage.getItem(ls_lastCardLoaded);
    if (lastCard) {
        setting_lastCardLoadedArray = lastCard.split(cardUniqueIDSplitter);
    }
}

/* ************************** */
function setupShowHideCheckboxesAtStartup() {
    // defined and set to defaults in globals.js
    if (!localStorage.getItem(ls_initiallyHideText)) localStorage.setItem(ls_initiallyHideText, initiallyHideText ? "true" : "false");
    initiallyHideText = localStorage.getItem(ls_initiallyHideText)==="true";
    document.getElementById('checkbox-initiallyHideT').checked = initiallyHideText;

    if (!localStorage.getItem(ls_initiallyHideImages)) localStorage.setItem(ls_initiallyHideImages, initiallyHideImages ? "true" : "false");
    initiallyHideImages = localStorage.getItem(ls_initiallyHideImages)==="true";

    if (!localStorage.getItem(ls_initiallyHideCaptions)) localStorage.setItem(ls_initiallyHideCaptions, initiallyHideCaptions ? "true" : "false");
    initiallyHideCaptions = localStorage.getItem(ls_initiallyHideCaptions)==="true";
    document.getElementById('checkbox-initiallyHideCap').checked = initiallyHideCaptions;
    document.getElementById('checkbox-initiallyHideCap-fullscreen').checked = initiallyHideCaptions;


    alignCaptionCbxs();
}

function checkboxShowHideInitiallyHideClicked(cbx, what) {
    switch (what) {
        case 'text': {
            initiallyHideText = cbx.checked;
            localStorage.setItem(ls_initiallyHideText, initiallyHideText ? "true" : "false");
            break;
        }
        case 'images': {
            initiallyHideImages = cbx.checked;
            localStorage.setItem(ls_initiallyHideImages, initiallyHideImages ? "true" : "false");
            break;
        }
        case 'captions': {
            initiallyHideCaptions = cbx.checked;
            localStorage.setItem(ls_initiallyHideCaptions, initiallyHideCaptions ? "true" : "false");
            alignCaptionCbxs();
            break;
        }
    }
    loadCardImage();
}

function alignCaptionCbxs() {
    fullscreenIDs.forEach(suffix => {
        document.getElementById('checkbox-initiallyHideCap' + suffix).checked = initiallyHideCaptions;
    });
}