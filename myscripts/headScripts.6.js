/******************************************************************************
 * Copyright (c) 6/3/2021 4:43     djml.uk E&OE.                              *
 ******************************************************************************/

//---------- ******** IMMEDIATE GLOBALS *********** ------------------------//
// =================================================================== GLOBAL ANSWER RECORD
window.allRecordedAnswersArchiveObj = getAnswersRecordObjectFromCache();
// =================================================================== GLOBAL BOOKMARKS RECORD
window.allBookmarksArchiveObj = getBookmarksObjectFromCache();


//---------- ******** ON LOAD FUNCTIONS *********** ------------------------//
//event.key is less precise and so more useful
function handleKeyboardEvent(event) {
    //cll(event.key);
    if (event.metaKey && event.key === " ") showAllTargetsToggle();
    switch (event.key.toLowerCase()) {
        case "arrowleft":
        case "arrowright":
            if (window.modal_shown === undefined && checkNotTextEdit()) {
                if (event.shiftKey) handleChangeChapter(event.key.toLowerCase() === "arrowleft" ? prevValue : nextValue);
                else handleChangeCardIndex(event.key.toLowerCase() === "arrowleft" ? prevValue : nextValue);
                event.stopPropagation();
                event.preventDefault();
            }
            break;
        case "arrowdown":
        case "arrowup":
            if (window.modal_shown === undefined && checkNotTextEdit()) {
                if (event.shiftKey === true) handleChangeTopicIndexfromKey(event.key.toLowerCase() === "arrowup" ? prevValue : nextValue);
                else handleChangeBmkIndexfromKey(event.key.toLowerCase() === "arrowup" ? prevValue : nextValue);
                event.stopPropagation();
                event.preventDefault();
            }
            break;
        case "enter":
            if (window.modal_shown === "sheet-index") {
                blinkElementHashID("#btn-searchIndex");
                doSearchIndex();
            }
            break;
        case "esc":
        case "escape":
            if (document.getElementById("div-userGuide").hidden === false) toggleUserGuide('doNotScroll');
            else if (!!window.modal_shown && window.modal_shown.includes("modal")) $("#" + window.modal_shown).modal('hide');
            else if (!!window.modal_shown && window.modal_shown.includes("sheet")) hideSheet(window.modal_shown);
            break;
        case "pagedown":
        case "pageup":
            if (window.showingAllTargets) {
                event.stopPropagation();
                event.preventDefault();
                handlePageUpDown(event.key.toLowerCase() === "pagedown");
            }
            break;
        default:
        // code block
    }
}

// call these functions on DOM loaded
window.addEventListener('DOMContentLoaded', function () {
    /* first allocate the globals as they may be used */
    window.imageCard = document.getElementById("image-card");
    window.svgDoodles = document.getElementById("svg-doodles");
    initialise_db_Obj();


    setupFSbutton();
    applySettingsAtStartup();
    setupwindowCacheWorker();
    addSheetHolderEventListener();
    window.addEventListener('resize', handleWindowResize);
    addChangeListenerToSelectCardset();
    addChangeListenerToSelectChapter();
    addChangeListenerToSelectCards();
    populateSelectCardSets();

    // ********** MODAL SHOW HIDE ACTIONS *********** //
    $(document).on({
        "show.bs.modal": function () {
            window.modal_shown = this.id;
            stopPlayingLabels();
        },
        "hide.bs.modal": function () {
            window.modal_shown = undefined;
        }
    }, ".modal");
    document.addEventListener("keydown", ev => handleKeyboardEvent(ev), false);
});

// call these functions on page fully loaded
window.addEventListener('load', function () {
    // DEFERRED actions
    setTimeout(() => loadHelp(), 80);
    document.getElementById('div-image-card').addEventListener("click", ev => divimgcardClicked(ev));

    window.addEventListener("orientationchange", function () {
        // i don't know why I love you, but I do....
        setTimeout(() => handleWindowResize(), 100);
    });
    $('[data-toggle="popover"]').popover()



});

