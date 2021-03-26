/******************************************************************************
 * Copyright (c) 26/3/2021 2:37     djml.uk E&OE.                             *
 ******************************************************************************/

function showSheet(sheetID) {
    const sheetholder = document.getElementById("div-sheetholder");
    sheetholder.innerHTML = "";
    const sheet = document.getElementById(sheetID);
    sheetholder.appendChild(sheet);
    //document.getElementById("div-mainpage").hidden = true;
    sheetholder.hidden = false;

    //clean up when modals show/hide
    window.modal_shown = sheetID;
    //window.sheetShown = sheetID;
    stopPlayingLabels();
    if (sheetID === "sheet-index") {
        modalIndexShownHidden();
        handleIndexGalleryWillShow();
    }
    switch (sheetID) {
        case "sheet-gallery":
            showGelleryButtonForCurrentCard();
            break;
        case "sheet-globalindex":
            showGlobalIndexLineForCurrentCard();
            break;
        case "sheet-bookmarks":
            handleBookmarksGalleryWillShow();
            break;
    }
}

function hideSheet(sheetID) {
    if (sheetID !== undefined) {
        const sheetholder = document.getElementById("div-sheetholder");
        const sheetsdiv = document.getElementById("div-sheets");
        const sheet = document.getElementById(sheetID);
        sheetholder.hidden = true;
        sheetsdiv.appendChild(sheetholder.removeChild(sheet));

        //clean up when modals show/hide
        window.modal_shown = undefined;
        //window.sheetShown = undefined;
        switch (sheetID) {
            case "sheet-gallery":
                handleCloseGallery();
                break;
            case "sheet-globalindex":
                if (!!window.globalIndexSelectedLine) {
                    window.globalIndexSelectedLine.classList.remove("list-globalIndex-selected");
                    window.globalIndexSelectedLine = undefined;
                }
                break;
            case "sheet-index":
                modalIndexShownHidden();
                break;
        }
    }
}

function addSheetHolderEventListener() {
    document.getElementById("div-sheetholder").addEventListener("click", function (e) {
        //objectdestructuring silently accesses the id field if it exists without syntax error
        // this is very short syntax for {id: idVariable} skipping need for property name id and another variable by giving the variable the same name
        const {id} = e.target;
        if (id === "div-sheetholder") hideSheet(window.modal_shown);
    });
}

function generaSpeciesClicked(){
    ['div-groupings','div-species'].forEach(id=>document.getElementById(id).toggleAttribute('hidden'));
}

function hideSheetZoom(hide){
    cll(hide);
    document.getElementById("sheet-zoom").hidden=hide;
    document.getElementById("div-mainpage").hidden=!hide;
}