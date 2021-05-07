/******************************************************************************
 * Copyright (c) 7/5/2021 3:19     djml.uk E&OE.                              *
 ******************************************************************************/

//================= STARTUP
function applySettingsAtStartup() {
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
function checkboxInitiallyHideClicked(cbx, what) {
    switch (what) {
        case 'text': {
            initiallyHideText = cbx.checked;
            break;
        }
        case 'images': {
            initiallyHideImages = cbx.checked;
            break;
        }
        case 'captions': {
            initiallyHideCaptions = cbx.checked;
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