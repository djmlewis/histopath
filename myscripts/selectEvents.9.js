/******************************************************************************
 * Copyright (c) 8/12/2021 9:18     djml.uk E&OE.                             *
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
// function alignSelectsToSelIndex(selects,index) {
//     selects.forEach((select) => document.getElementById(select).selectedIndex = index);
// }

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
    createOrgansDropdowns(selectChapterValue);
    loadCardImage();
}

function getSelectCardsSelectedCardObject() {
    return JSON.parse(document.getElementById("select-cards").selectedOptions[0].getAttribute(attr_cardObject));
}
function getSelectCardsSelectedCardObjectUniqueCardID() {
    return getSelectCardsSelectedCardObject().uniqueCardID;
}

function searchLegend() {
    const searchStr = document.getElementById("input-searchlegend").value.toLowerCase();
    if (searchStr.length > -1) {
        const answersHanger = document.getElementById("div-species-sidebar");
        if(answersHanger.hidden === true) toggleSidebar();// answersHanger.hidden = false;
        const answersChildren = answersHanger.children;
        const answersChildrenNum = answersChildren.length;
        //answersHanger.hidden = true;
        for (let i = 0; i < answersChildrenNum; i++) {
            const para = answersChildren[i];
            para.hidden = para.innerText.toLowerCase().includes(searchStr) === false;
        }
    }
}

function clearSearchLegend() {
    const answersHanger = document.getElementById("div-species-sidebar");
    const answersChildren = answersHanger.children;
    const answersChildrenNum = answersChildren.length;
    //answersHanger.hidden = true;
    for (let i = 0; i < answersChildrenNum; i++) {
        answersChildren[i].hidden = false;
    }
    //answersHanger.hidden = false;
    document.getElementById("input-searchlegend").value = "";
}

function createOrgansDropdowns(selectChapterValue) {
    const chapterPrefix = selectChapterValue.substr(0,4).toLowerCase();
    const organsInChapter = chapterDiagnosesObj[chapterPrefix];
    organsRandomisedArray = organsInChapter;
    fullscreenIDs.forEach(fsid => {
        const dropdownMenu = document.getElementById("dropdownMenuChapters"+fsid);
        dropdownMenu.innerHTML = "";
        organsInChapter.forEach(function (organName) {
            let opt = document.createElement("button");
            opt.classList.add("dropdown-item");
            opt.classList.add("active");
            opt.classList.add("btn-info");
            opt.type = 'button';
            const btnOrgan = String(organName);
            opt.setAttribute('data-organ', btnOrgan);
            opt.id = "btnOrgan-"+btnOrgan+fsid;
            opt.innerText = btnOrgan;
            opt.onclick = (ev)=>chapterButtonSelected(ev);
            dropdownMenu.appendChild(opt);
        });
    });
}


function chapterButtonSelected(ev) {
    let btn = ev.target;
    const btnOrgan = btn.getAttribute('data-organ');
    if(btn.classList.contains('active')) {
        btn.classList.remove('active');
        const altBtnID = btn.id.includes('fullscreen') ? btn.id.replace('-fullscreen','') : btn.id+'-fullscreen';
        document.getElementById(altBtnID).classList.remove('active');
        organsRandomisedArray = organsRandomisedArray.filter(e => e !== btnOrgan);
    } else {
        btn.classList.add('active');
        document.getElementById(btn.id.includes('fullscreen') ? btn.id.replace('-fullscreen','') : btn.id+'-fullscreen').classList.add('active');
        organsRandomisedArray.push(btnOrgan);
    }
    // if(organsRandomisedArray.length === 0) {
    //     randomCardIndices = [];
    //     clearImageForNoRandomCardsAvailable();
    // }
    resetAfterRandomiseCriteriaChanged();
    setupRandomDropdownForChaptersSelected();
    //displayNumRandomised(randomCardIndices.length > 0);
    //setupRandomiseButtonsForCardsAvailableCount();
}

function selectAllNoneChapters(select){
    fullscreenIDs.forEach(fsid => {
        const dropdownMenu = document.getElementById("dropdownMenuChapters"+fsid);
        const opts = Array.from(dropdownMenu.children);
        if (select === 'all') {
            opts.forEach(e => {
                organsRandomisedArray.push(e.getAttribute('data-organ'));
                e.classList.add('active');
            });
            randomiseBtnClicked();
        } else {
            organsRandomisedArray = [];
            opts.forEach(e => e.classList.remove('active'));
        }
    });
    resetAfterRandomiseCriteriaChanged();
    setupRandomDropdownForChaptersSelected();
}

function setupRandomDropdownForChaptersSelected() {
    fullscreenIDs.forEach(fsid => {
        const dropdownBtn = document.getElementById("btn-randomDropdown"+fsid);
        if(organsRandomisedArray.length > 0) {
            dropdownBtn.classList.remove('btn-outline-info');
            dropdownBtn.classList.add('btn-info');
        } else {
            dropdownBtn.classList.add('btn-outline-info');
            dropdownBtn.classList.remove('btn-info');
        }
    });
}
function setupRandomiseButtonsForCardsAvailableCount() {
    fullscreenIDs.forEach(fsid => {
        document.getElementById("btn-nextRandomCard"+fsid).disabled = randomCardIndices.length === 0;
        document.getElementById("btn-randomise"+fsid).disabled = randomCardIndices.length === 0;
    });
}