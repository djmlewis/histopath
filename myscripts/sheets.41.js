/******************************************************************************
 * Copyright (c) 10/5/2021 1:4     djml.uk E&OE.                              *
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
    // stopPlayingLabels();
    // if (sheetID === "sheet-index") {
    //     modalIndexShownHidden();
    //     handleIndexGalleryWillShow();
    // }
    switch (sheetID) {
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
        setTimeout(() => handleWindowResize(), 100);
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

function generaSpeciesClicked(e){
    ['div-groupings','div-species','div-taxogenera','div-taxospecies'].forEach(id=>document.getElementById(id).hidden=true);//toggleAttribute('hidden'));
    document.getElementById(e.target.id.replace('radio','div')).hidden=false;
}

function hideSheetZoom(hide){
    window.modal_shown =hide ? undefined : "sheet-zoom";
    document.getElementById("sheet-zoom").hidden=hide;
    document.getElementById("div-mainpage").hidden=!hide;
    if(hide) setTimeout(() => handleWindowResize(), 100);
}