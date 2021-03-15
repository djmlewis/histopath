/******************************************************************************
 * Copyright (c) 15/3/2021 2:55     djml.uk E&OE.                             *
 ******************************************************************************/

//---------- ******** SELECT EVENTS *********** ------------------------//
function toggleSelectCardsetsHidden(hideSelect) {
    document.getElementById("select-cardsset").hidden = hideSelect;
    document.getElementById("select-cardsset-toolbox").hidden = hideSelect;
}

function populateSelectCardSets() {
    function buildCardsetMenus() {
        //[document.getElementById("select-cardsset"), document.getElementById("select-cardsset-gallery"), document.getElementById("select-cardsset-toolbox")].forEach((selectcardsset) =>
        ["select-cardsset", "select-cardsset-gallery", "select-cardsset-toolbox","select-cardsset-dropdown"].forEach((selectcardsset) =>
            window.collectionobject.cardsetsNamesArray.forEach(function (cardsetname) {
                let opt = document.createElement("option");
                opt.value = String(cardsetname); //<== this is our unique ID link to window.collectionobject.cardsetObj[id]
                opt.text = window.collectionobject.cardsetsObj[cardsetname].longName;
                document.getElementById(selectcardsset).appendChild(opt);
            }));
    }

    buildCardsetMenus();
    // try to select the last used cardset - if window.collectionobject.cardsetsNamesArray contains it
    selectCardsetLastUsed();
    populateSelectChapterOnCardsetChange();
}

function selectCardsetLastUsed() {
    if (window.setting_lastCardLoadedArray !== undefined) {
        const indexOfLastCardset = window.collectionobject.cardsetsNamesArray.indexOf(window.setting_lastCardLoadedArray[0]);
        if (indexOfLastCardset !== -1) ["select-cardsset", "select-cardsset-gallery","select-cardsset-toolbox","select-cardsset-dropdown"].forEach((selectcardsset) =>
            document.getElementById(selectcardsset).selectedIndex = indexOfLastCardset);
    }
}

function alignSelectsToValue(selects,value) {
    selects.forEach((select) => document.getElementById(select).value = value);
}
function alignSelectsToSelIndex(selects,index) {
    selects.forEach((select) => document.getElementById(select).selectedIndex = index);
}

function handleSelectCardsetChanged(e) {
    // bring the selects into alignment. can't harm to reassign hte event target saves an if else
    // ["select-cardsset", "select-cardsset-gallery", "select-cardsset-toolbox","select-cardsset-dropdown"].forEach((selectcardsset) =>
    //     document.getElementById(selectcardsset).value = e.target.value);
    alignSelectsToValue(["select-cardsset", "select-cardsset-gallery", "select-cardsset-toolbox","select-cardsset-dropdown"],e.target.value);
    populateSelectChapterOnCardsetChange();
    setTimeout(()=>showRandomPopover(),0);
}

function showRandomPopover() {
    if(!localStorage.getItem(lsRandomButtonPopovered) && document.getElementById('select-cardsset').value.includes('gross')){
        $('[data-toggle="popover"]').popover('show');
        setTimeout(()=>hideRandomPopover(),2000);
    }
}
function hideRandomPopover() {
    $('[data-toggle="popover"]').popover('hide');
    localStorage.setItem(lsRandomButtonPopovered,"true");
}

function handleSelectChaptersChanged(e) {
    // bring the selects into alignment. can't harm to reassign hte event target saves an if else
    // ["select-chapters", "select-chapters-toolbox", "select-chapters-dropdown"].forEach((selectchaps) =>
    //     document.getElementById(selectchaps).value = e.target.value);
    alignSelectsToValue(["select-chapters", "select-chapters-toolbox", "select-chapters-dropdown"],e.target.value);
    populateSelectCardsOnChapterChange(null);
}

function handleSelectCardsChanged(e) {
    // bring the selects into alignment. can't harm to reassign hte event target saves an if else
    // document.getElementById("select-cards").value = e.target.value;
    // document.getElementById("select-cards-toolbox").value = e.target.value;
    alignSelectsToValue(["select-cards", "select-cards-toolbox","select-cards-dropdown"],e.target.value);
    btnFlipThisImageOriginal();
    hideLegendIfAppropriate();
    loadCardImage();
}


function populateSelectChapterOnCardsetChange() {
    function buildChaptersMenus() {
        ["select-chapters","select-chapters-toolbox","select-chapters-dropdown"].forEach((select) => {
            const selectchapters = document.getElementById(select);
            //clear the select-chapters
            selectchapters.length = 0;
            // lookup the chapters array in our cardset
            chaptersInCardset.forEach(function (chapterTitle) {
                let opt = document.createElement("option");
                opt.value = String(chapterTitle);
                opt.text = String(chapterTitle);
                selectchapters.appendChild(opt);
            });
        })
    }

    let selectcardssetValue = document.getElementById("select-cardsset").value;
    document.getElementById('btn-fullscreen').style.visibility = selectcardssetValue.includes('Quiz') ? 'visible' : 'hidden';
    const cardsset = window.collectionobject.cardsetsObj[selectcardssetValue];
    let chaptersInCardset = cardsset.chapterNamesArray;
    Array.from(document.getElementsByClassName("img-bilingual")).forEach(e => {
        e.hidden = cardsset.languages === lang_mono;
    });
    buildChaptersMenus();

    // try to select the last used chapter - if window.collectionobject.cardsetsNamesArray contains it
    if (window.setting_lastCardLoadedArray !== undefined) {
        const indexOfLastChapter = chaptersInCardset.indexOf(window.setting_lastCardLoadedArray[1]);
        if (indexOfLastChapter !== -1) ["select-chapters","select-chapters-toolbox","select-chapters-dropdown"].forEach((selectchapters) =>
            document.getElementById(selectchapters).selectedIndex = indexOfLastChapter);
    }
    // align gallery with cardsset
    setupGallery(cardsset.thumbs);

    // force a card select reboot
    populateSelectCardsOnChapterChange(null);
}

function cardUniqueIDcorrectedForSplitter(cardUniqueID) {
    return cardUniqueID.replace(/§/g, "\t");
}

function loadCardByUniqueID(cardUniqueID) {
    const correctedCardUniqueID = cardUniqueIDcorrectedForSplitter(cardUniqueID);
    window.setting_lastCardLoadedArray = correctedCardUniqueID.split(cardUniqueIDSplitter);
    selectCardsetLastUsed();
    populateSelectChapterOnCardsetChange();
}

function handleGalleryClick(cardUniqueID, hotspot, modalID) {
    if (!!hotspot && hotspot !== "undefined") {
        const cardObj = getCardObjFromUniqueCardIDwithSplitter(cardUniqueID, cardUniqueIDSplitter);
        if(!!cardObj) {
            window.coordsWaitingToBeTargetted =cardObj.hotspots.split("\n").filter(coord => {
                //hotspot array in this case includes radius as 0, so minus 1
                return coord.split("\t")[2] === String(parseInt(hotspot) - 1);
            });
            //window.coordsWaitingToBeTargetted is an array of 1 because it returns the filtered item from ..hotspots.split("\n")
            //the filtered item is a tab delim string of XYradius.
            //so we must amend the 0th item in this array
            window.coordsWaitingToBeTargetted.splice(0, 1, window.coordsWaitingToBeTargetted[0] + "\t" + String(parseInt(hotspot) - 1));
        }
    } else {
        window.coordsWaitingToBeTargetted = undefined;
    }
    loadCardByUniqueID(cardUniqueID);
    if (modalID !== undefined) {
        if (modalID.includes("modal")) $("#" + modalID).modal('hide');
        else if (modalID.includes("sheet")) hideSheet(modalID);
    }
}


function handleGalleryCardsetChanged(select) {
    // if we can find the selected option in the collectionobject use its thumbs, otherwise it is in window.popeskoThumbsObj
    if (!!window.collectionobject.cardsetsObj[select.value]) setupGallery(window.collectionobject.cardsetsObj[select.value].thumbs);
    else setupGallery(window.popeskoThumbsObj[select.value]);
    scrollGalleryCardsToTop();
    resetQGllyBookmarkingOff();
}

function handleCloseGallery() {
    const activeCardset = document.getElementById("select-cardsset");
    const galleryCardset = document.getElementById("select-cardsset-gallery");
    if (activeCardset.value !== galleryCardset.value) {
        galleryCardset.value = activeCardset.value;
        setupGallery(window.collectionobject.cardsetsObj[activeCardset.value].thumbs);
    }
}

function populateSelectCardsOnChapterChange(btnValue) {
    btnFlipThisImageOriginal();
    // auto-hide any revealed answers
    hideLegendIfAppropriate();
    resetRandomIndexArray();
    let selectChapterValue = document.getElementById("select-chapters").value;
    toggleSelectCardsetsHidden(false);

    const selectedCardsetValue = document.getElementById("select-cardsset").value;
    const hideCardTitles=window.collectionobject.cardsetsObj[selectedCardsetValue].hideCardTitles;
    let cardsInChapterNamesArray = window.collectionobject.cardsetsObj[selectedCardsetValue].chaptersObj[selectChapterValue].cardsNamesArray;
    let cardsInChapterObj = window.collectionobject.cardsetsObj[selectedCardsetValue].chaptersObj[selectChapterValue].cardsObj;
    let cuidArray = [];
    ["select-cards", "select-cards-toolbox","select-cards-dropdown"].forEach((select) => {
        const selectcards = document.getElementById(select);
        //clear existing options
        selectcards.length = 0;
        cardsInChapterNamesArray.forEach(function (cardName,index) {
            const cardObj = cardsInChapterObj[cardName];
            cuidArray.push(cardObj.uniqueCardID);
            createOptionForCardMenuWithCardObject(cardObj, selectcards,index,hideCardTitles);
        });
    });
    if (!!btnValue) {
        // we have autochanged Chapter so choose first or last card
        [document.getElementById("select-cards"),document.getElementById("select-cards-toolbox"),
            document.getElementById("select-cards-dropdown")].forEach((selectcard) =>
            selectcard.selectedIndex = btnValue === nextValue ? 0 : selectcard.length - 1);
    } else {
        // try to select the last used card - if cardsInChapterNamesArray contains it
        if (window.setting_lastCardLoadedArray !== undefined) {
            const indexOfLastCard = cardsInChapterNamesArray.indexOf(window.setting_lastCardLoadedArray[2]);
            if (indexOfLastCard !== -1) ["select-cards","select-cards-toolbox","select-cards-dropdown"].forEach((selectcard) =>
                document.getElementById(selectcard).selectedIndex = indexOfLastCard);
        }
    }
    loadCardImage();
    //call this from the onload function so we dont delay the image load
    window.cuidsAwaitingDownload = {cuids: cuidArray, name: selectedCardsetValue + selectChapterValue};
    //preloadCardUIDarray(cuidArray, selectedCardsetValue+selectChapterValue);
}

function getSelectCardsSelectedCardObject() {
    return JSON.parse(document.getElementById("select-cards").selectedOptions[0].getAttribute(attr_cardObject));
}
function getSelectCardsSelectedCardObjectHotspotsArray() {
    if(getSelectCardsSelectedCardObject().hotspots) return getSelectCardsSelectedCardObject().hotspots.split("\n");
    else return undefined;
}
function getSelectCardsSelectedCardObjectUniqueCardID() {
    return getSelectCardsSelectedCardObject().uniqueCardID;
}
