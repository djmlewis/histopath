/******************************************************************************
 * Copyright (c) 7/5/2021 3:19     djml.uk E&OE.                              *
 ******************************************************************************/

//---------- ******** IMMEDIATE GLOBALS *********** ------------------------//
// =================================================================== GLOBAL ANSWER RECORD
//---------- ******** ON LOAD FUNCTIONS *********** ------------------------//
//event.key is less precise and so more useful
function handleKeyboardEvent(event) {
    //cll(event.key);
    switch (event.key.toLowerCase()) {
        case "arrowleft":
        case "arrowright":
            if (window.modal_shown === undefined) {
                if (event.shiftKey) handleChangeChapter(event.key.toLowerCase() === "arrowleft" ? prevValue : nextValue);
                else handleChangeCardIndex(event.key.toLowerCase() === "arrowleft" ? prevValue : nextValue);
                event.stopPropagation();
                event.preventDefault();
            }
            break;
        case "esc":
        case "escape":
            if (!!window.modal_shown) {
                switch (window.modal_shown) {
                    case "sheet-zoom":
                        hideSheetZoom(true);
                        break;
                    case "sheet-groupings":
                    case "sheet-fullscreen":
                        hideSheet(window.modal_shown);
                        break;
                }
                event.stopPropagation();
                event.preventDefault();
            }
            break;
        default:
        // code block
    }
}

// call these functions on DOM loaded
window.addEventListener('DOMContentLoaded', function () {
    /* first allocate the globals as they may be used */
    sliderImageWidthMax = parseInt(document.getElementById('slider-image-Width').getAttribute('max'));
    initialise_db_Obj();
    applySettingsAtStartup();
    addSheetHolderEventListener();
    window.addEventListener('resize', handleWindowResize);
    document.getElementById("select-cardsset").addEventListener('change', handleSelectCardsetChanged);
    document.getElementById("select-chapters").addEventListener('change', handleSelectChaptersChanged);
    document.getElementById("select-cards").addEventListener('change', handleSelectCardsChanged);
    document.addEventListener("keydown", ev => handleKeyboardEvent(ev), false);
    populateSelectCardSets();

    // ********** MODAL SHOW HIDE ACTIONS *********** //
    $(document).on({
        "show.bs.modal": function () {
            window.modal_shown = this.id;
        },
        "hide.bs.modal": function () {
            window.modal_shown = undefined;
        }
    }, ".modal");
});

// call these functions on page fully loaded
window.addEventListener('load', function () {
    // DEFERRED actions
    document.getElementById('div-image-card').addEventListener("click", ev => divimgcardClicked(ev));
    document.getElementById('div-species-sidebar').innerHTML = document.getElementById('div-species').innerHTML;
    ['div-groupings', 'div-species'].forEach(id => document.getElementById(id).addEventListener("click", ev => divgroupingsClicked(ev, true)));
    document.getElementById('div-species-sidebar').addEventListener("click", ev => divgroupingsClicked(ev, false));
    window.addEventListener("orientationchange", function () {
        // i don't know why I love you, but I do....
        setTimeout(() => handleWindowResize(), 100);
    });
});

