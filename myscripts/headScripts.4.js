/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
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

function revealPage() {
    document.getElementById("div-placeholder").hidden = true;
    document.getElementById("div-mainpage").hidden = false;
}

// call these functions on DOM loaded
window.addEventListener('DOMContentLoaded', function () {
    /* first allocate the globals as they may be used */
    window.imageCard = document.getElementById("image-card");
    window.svgDoodles = document.getElementById("svg-doodles");

    setupFSbutton();
    applySettingsAtStartup();
    setupwindowCacheWorker();
    addSheetHolderEventListener();
    window.addEventListener('resize', handleWindowResize);
    addChangeListenerToSelectCardset();
    addChangeListenerToSelectChapter();
    addChangeListenerToSelectCards();
    //addDblClickListenerToImageCard();
    //addClickListenerToBookmarkGalleryButtons();
    //revealPage();
    populateSelectCardSets();
    //window.allBookmarksArchiveObj.setupBookmarksGallery();
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
    //document.getElementById("list-gallery").onclick = ev => handleQuickGalleryClick(ev.target, "sheet-gallery");
    //document.getElementById("div-indexedCards-hanger").onclick = ev => handleIndexGalleryClick(ev.target);
    //document.getElementById("list-globalIndex").onclick = ev => handleGlobalIndexLineClicked(ev.target);
    //document.getElementById("list-globalIndexPopesko").onclick = ev => handleGlobalIndexLineClicked(ev.target);
    //document.getElementById("div-postitsHanger").onclick = ev => handlePostitsHangerClicked(ev);
    //document.getElementById("svg-doodles").onclick = ev => handleSVGdoodleClick(ev);
    /* **** BOOKMARKS *** */
    //document.getElementById("list-bookmarks-gallery").onclick = ev => handleGenericGalleryClick(ev.target, "sheet-bookmarks");
    /* **** HISTORY *** */
    //document.getElementById(historyGalleryOuterHangerID).onclick = ev => handleGenericGalleryClick(ev.target, "sheet-history");
    /* **** TOPICS *** */
    //document.getElementById("list-topics").onclick = ev => handleGenericGalleryClick(ev.target, "sheet-topics");
    // ********** KEYSTROKE ACTIONS *********** //
    document.addEventListener("keydown", ev => handleKeyboardEvent(ev), false);
});

// call these functions on page fully loaded
window.addEventListener('load', function () {
    // DEFERRED actions
    setTimeout(() => loadHelp(), 80);
    //setTimeout(() => addThumbsToCardsSets(), 85);
    //setTimeout(() => downloadGlobalIndex(), 90);
    //setTimeout(() => downloadPopeskoThumbs(), 95);
    //setTimeout(() => downloadIndices(), 100);
    //setTimeout(() => downloadTopics(), 105);
    setTimeout(() => setupPersistentStorage(), 115);

    window.addEventListener("orientationchange", function () {
        // i don't know why I love you, but I do....
        setTimeout(() => handleWindowResize(), 100);
    });
    //initialise_dbNotes();
    $('[data-toggle="popover"]').popover()

});

function setupPersistentStorage() {
    if (navigator.storage && navigator.storage.persist)
        navigator.storage.persist().then(function (persistent) {
            if (persistent) {
                //console.log("Storage will not be cleared except by explicit user action");
                document.getElementById('icon-persistent').classList.remove('invisible');
            } //else console.log("Storage may be cleared by the UA under storage pressure.");
        });
    //else console.log("navigator.storage.persist absent. Storage may be cleared by the UA under storage pressure.");
}