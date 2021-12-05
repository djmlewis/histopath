/******************************************************************************
 * Copyright (c) 5/12/2021 4:41     djml.uk E&OE.                             *
 ******************************************************************************/

//================= STARTUP
function applySettingsAtStartup() {
    setupHideTextCapsImagesCheckboxesAtStartup();
    loadLastCardLoaded();
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
function setupHideTextCapsImagesCheckboxesAtStartup() {
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


    alignCBXsCaption();
}

function checkboxInitiallyHideClicked(cbx, what) {
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
            alignCBXsCaption();
            break;
        }
    }
    loadCardImage();
}

function alignCBXsCaption() {
    fullscreenIDs.forEach(suffix => {
        document.getElementById('checkbox-initiallyHideCap' + suffix).checked = initiallyHideCaptions;
    });
}