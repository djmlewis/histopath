/******************************************************************************
 * Copyright (c) 7/5/2021 3:19     djml.uk E&OE.                              *
 ******************************************************************************/

//---------- ******** SELECT EVENTS *********** ------------------------//
function populateSelectCardSets() {
    const selcs=document.getElementById("select-cardsset");
    window.collectionobject.cardsetsNamesArray.forEach(function (cardsetname) {
        let opt = document.createElement("option");
        opt.value = String(cardsetname); //<== this is our unique ID link to window.collectionobject.cardsetObj[id]
        opt.text = window.collectionobject.cardsetsObj[cardsetname].longName;
        selcs.appendChild(opt);
    });
    // try to select the last used cardset - if window.collectionobject.cardsetsNamesArray contains it
    selectCardsetLastUsed();
    populateSelectChapterOnCardsetChange();
}

function selectCardsetLastUsed() {
    if (setting_lastCardLoadedArray !== undefined) {
        const indexOfLastCardset = window.collectionobject.cardsetsNamesArray.indexOf(setting_lastCardLoadedArray[0]);
        if (indexOfLastCardset !== -1) document.getElementById("select-cardsset").selectedIndex = indexOfLastCardset;
    }
}
function alignSelectsToSelIndex(selects,index) {
    selects.forEach((select) => document.getElementById(select).selectedIndex = index);
}

function handleSelectCardsetChanged() {
    populateSelectChapterOnCardsetChange();
}

function handleSelectChaptersChanged() {
    populateSelectCardsOnChapterChange(null);
}

function handleSelectCardsChanged() {
    loadCardImage();
}


function populateSelectChapterOnCardsetChange() {
    function buildChaptersMenus() {
            const selectchapters = document.getElementById("select-chapters");
            //clear the select-chapters
            selectchapters.length = 0;
            // lookup the chapters array in our cardset
            chaptersInCardset.forEach(function (chapterTitle) {
                let opt = document.createElement("option");
                opt.value = String(chapterTitle);
                opt.text = String(chapterTitle);
                selectchapters.appendChild(opt);
            });
    }

    let selectcardssetValue = document.getElementById("select-cardsset").value;
    document.getElementById('btn-fullscreen').style.visibility = selectcardssetValue.includes('Quiz') ? 'visible' : 'hidden';
    const cardsset = window.collectionobject.cardsetsObj[selectcardssetValue];
    let chaptersInCardset = cardsset.chapterNamesArray;
    buildChaptersMenus();

    // try to select the last used chapter - if window.collectionobject.cardsetsNamesArray contains it
    if (setting_lastCardLoadedArray !== undefined) {
        const indexOfLastChapter = chaptersInCardset.indexOf(setting_lastCardLoadedArray[1]);
        if (indexOfLastChapter !== -1) document.getElementById("select-chapters").selectedIndex = indexOfLastChapter;
    }
    // force a card select reboot
    populateSelectCardsOnChapterChange(null);
}

function cardUniqueIDcorrectedForSplitter(cardUniqueID) {
    return cardUniqueID.replace(/§/g, "\t");
}

function loadCardByUniqueID(cardUniqueID) {
    const correctedCardUniqueID = cardUniqueIDcorrectedForSplitter(cardUniqueID);
    setting_lastCardLoadedArray = correctedCardUniqueID.split(cardUniqueIDSplitter);
    selectCardsetLastUsed();
    populateSelectChapterOnCardsetChange();
}

function populateSelectCardsOnChapterChange(btnValue) {
    resetRandomIndexArray();
    let selectChapterValue = document.getElementById("select-chapters").value;
    const selectedCardsetValue = document.getElementById("select-cardsset").value;
    const hideCardTitles=window.collectionobject.cardsetsObj[selectedCardsetValue].hideCardTitles;
    let cardsInChapterNamesArray = window.collectionobject.cardsetsObj[selectedCardsetValue].chaptersObj[selectChapterValue].cardsNamesArray;
    let cardsInChapterObj = window.collectionobject.cardsetsObj[selectedCardsetValue].chaptersObj[selectChapterValue].cardsObj;
        const selectcards = document.getElementById("select-cards");
        //clear existing options
        selectcards.length = 0;
        cardsInChapterNamesArray.forEach(function (cardName,index) {
            const cardObj = cardsInChapterObj[cardName];
            createOptionForCardMenuWithCardObject(cardObj, selectcards,index+1,hideCardTitles);
        });
    //});
    if (!!btnValue) {
        // we have autochanged Chapter so choose first or last card
        const selectcard = document.getElementById("select-cards");
        selectcard.selectedIndex = btnValue === nextValue ? 0 : selectcard.length - 1;
    } else {
        // try to select the last used card - if cardsInChapterNamesArray contains it
        if (setting_lastCardLoadedArray !== undefined) {
            const indexOfLastCard = cardsInChapterNamesArray.indexOf(setting_lastCardLoadedArray[2]);
            if (indexOfLastCard !== -1) document.getElementById("select-cards").selectedIndex = indexOfLastCard;
        }
    }
    loadCardImage();
}

function getSelectCardsSelectedCardObject() {
    return JSON.parse(document.getElementById("select-cards").selectedOptions[0].getAttribute(attr_cardObject));
}
function getSelectCardsSelectedCardObjectUniqueCardID() {
    return getSelectCardsSelectedCardObject().uniqueCardID;
}
