/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/

function setupModeDarkLightAtStartup() {
    if (!localStorage.getItem(ls_modeDarkLight)) localStorage.setItem(ls_modeDarkLight, modeLight);
    window.setting_modeDarkLight = localStorage.getItem(ls_modeDarkLight);
    document.getElementById("checkbox-darkmode").checked = window.setting_modeDarkLight === modeDark;
    applyModeDarkLightSetting();
    setSettingsBoxStatus(window.setting_modeDarkLight === modeDark,"settingsBox-dark");
}

function handleCheckboxDarkModeChanged(eletype) {
    const cbx = document.getElementById("checkbox-darkmode");
    if(eletype==="img") cbx.checked = ! cbx.checked;
    handleSettings_ModeDarkLightClicked(cbx.checked ? modeDark :  modeLight);
    setSettingsBoxStatus(cbx.checked,"settingsBox-dark");
}

function handleSettings_ModeDarkLightClicked(btnid) {
    localStorage.setItem(ls_modeDarkLight, btnid);
    window.setting_modeDarkLight = btnid;
    applyModeDarkLightSetting();
    /* only do createAnswerButtonsForCardObject here as we dont have a card at startup */
    createAnswerButtonsForCardObject(getSelectCardsSelectedCardObject());
}

function applyModeDarkLightToElement(element) {
    if (window.setting_modeDarkLight === modeDark) {
        element.classList.remove(modeLight);
        element.classList.add(modeDark);
    } else {
        element.classList.remove(modeDark);
        element.classList.add(modeLight);
    }
}

function applyModeDarkToElement(element) {
    if (window.setting_modeDarkLight === modeDark) {
        element.classList.add(modeDark);
    } else {
        element.classList.remove(modeDark);
    }
}
function applyBtnDarkToElement(element) {
    if (window.setting_modeDarkLight === modeDark) {
        element.classList.remove("btn-outline-dark");
        element.classList.add("btn-dark");
    } else {
        element.classList.remove("btn-dark");
        element.classList.add("btn-outline-dark");
    }
}
function applyDarkLightToSpecificElements() {
    if (window.setting_modeDarkLight === modeDark) {
        document.getElementById("div-hoverLegendlabel").classList.add("div-hoverLegendlabelDark");
        document.getElementById("col-slider-image-Width").classList.add("rounded-pill");
        document.getElementById("col-slider-image-Width").classList.add("sliderWidthDark");
        document.getElementById("modal-hotspotslabel-header").classList.add("modal-hotspotslabel-header-dark");
    } else {
        document.getElementById("div-hoverLegendlabel").classList.remove("div-hoverLegendlabelDark");
        document.getElementById("col-slider-image-Width").classList.remove("sliderWidthDark");
        document.getElementById("col-slider-image-Width").classList.remove("rounded-pill");
        document.getElementById("modal-hotspotslabel-header").classList.remove("modal-hotspotslabel-header-dark");
    }
}

function applyDarkModeActionMenus() {
    function doModeApply(dropdown) {
        applyModeDarkToElement(dropdown);
        for (let i = 0; i < dropdown.children.length; i++) {
            if(dropdown.children[i].type === 'button') applyModeDarkToElement(dropdown.children[i]);
        }
    }
    elementsArrayForClassName("div-dropdownmenuMain-toolbar").forEach(e=>doModeApply(e));
}

function applyModeDarkLightSetting() {
    const rowimage = document.getElementById("row-image");
    if (window.setting_modeDarkLight === modeDark){
        document.getElementById("input-searchString").classList.add("modeDark");
        document.body.classList.remove("bodyModeLight");
        document.body.classList.add('modeDark');
        rowimage.classList.remove("rowImageLight");
        rowimage.classList.add("rowImageDark");
        document.getElementById("col-image").style.borderLeftWidth = "0px";
        document.getElementById("list-globalIndex").classList.add("list-globalIndex-modeDark");
        document.getElementById("col-toolbar").classList.add("col-toolbar-darkMode");
    } else {
        document.getElementById("input-searchString").classList.remove("modeDark");
        document.body.classList.remove('modeDark');
        document.body.classList.add("bodyModeLight");
        rowimage.classList.remove("rowImageDark");
        rowimage.classList.add("rowImageLight");
        document.getElementById("col-image").style.borderLeftWidth = "1px";
        document.getElementById("list-globalIndex").classList.remove("list-globalIndex-modeDark");
        document.getElementById("col-toolbar").classList.remove("col-toolbar-darkMode");
    }

    document.getElementById("image-darkMode").src= window.setting_modeDarkLight === modeDark ? "img/light.png" : "img/dark.png";

    elementsArrayForClassName("sheets-body").forEach(e=> {
        if (window.setting_modeDarkLight === modeDark) e.classList.add("modeDarkBackground");
        else e.classList.remove("modeDarkBackground");
    });
    [
        "div-indexedCards-hanger","div-cardTitle","h-cardNote","div-toolbox-h","div-answerButtonsHanger",
        "div-mainpage","div-toolbox-v",
        "modalClearAnswers-content","modaExportFavourites-content","sheet-index-upper",
        "modalClearFavouritess-content","body-modal-popuplegend","modal-answers-content","textarea-notes","textarea-postit"
    ].forEach((e) =>
        applyModeDarkLightToElement(document.getElementById(e)));
    [
        "sheet-settings-body","sheet-bookmarks-body", "sheet-topics-body","sheet-globalindex-body","sheet-history-body"
    ].forEach((e) => applyModeDarkToElement(document.getElementById(e)));

    const dropdowntools = document.getElementById("dropdown-tools");
    if (window.setting_modeDarkLight === modeDark) {
        dropdowntools.classList.remove("btn-light");
        dropdowntools.classList.add("btn-dark");
    } else {
        dropdowntools.classList.remove("btn-dark");
        dropdowntools.classList.add("btn-light");
    }

    ["button-dropdownMain","button-dropdownMain-toolbar","btton-settings-v","btton-settings-h","btn-help","btn-help-toolbox","btn-help-dropdown"].forEach((e) =>
        applyBtnDarkToElement(document.getElementById(e)));
    applyDarkModeActionMenus();
    applyDarkLightToSpecificElements();
    applyDarkModeGallery();
    applyDarkModeScrollers();
    forceRefreshCollImage();
}

function forceRefreshCollImage() {
    //this is weird and a bit brutal but only way to redraw the scrollbars
    [document.getElementById("col-toolbar"), document.getElementById("col-image"), document.getElementById("div-revealAnswers")
    ].forEach((siteHeader)=> {
        siteHeader.style.display = 'none';
        siteHeader.offsetHeight; // no need to store this anywhere, the reference is enough
        siteHeader.style.display = 'block';
    });
}

function applyDarkModeScrollers() {
    ["col-image","div-revealAnswers","div-indexhanger-latin","div-indexhanger-english","div-toolbox-v"].forEach((div)=>{
        if(window.setting_modeDarkLight === modeDark) document.getElementById(div).classList.add("scrollerDark");
        else document.getElementById(div).classList.remove("scrollerDark");
    });
}

function applyDarkModeGallery() {
    const listGallery = document.getElementById("list-gallery");
    for (let i = 0; i < listGallery.children.length; i++) {
        const child = listGallery.children[i];
        if(child.type === 'button') {
            if (window.setting_modeDarkLight === modeDark) {
                child.style.color = "white";
            } else {
                child.style.color = "black";
            }
        }
    }
}

