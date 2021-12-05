/******************************************************************************
 * Copyright (c) 5/12/2021 6:18     djml.uk E&OE.                             *
 ******************************************************************************/
// =================================================================== UTILITY FUNCTIONS
/*
function getStringCharacterLength (str) {
    // string .length is unreliable as it uses UTF16!
    // The string iterator that is used here iterates over characters,not mere code units
    return [...str].length;
}
*/
function splitTextByCharacterSkippingBlanks(textToSplit, splitChar) {
    let array = textToSplit.split(splitChar);
    return array.filter(line => line.length > 0);
}

function elementsArrayForClassNameFromElementID(elementID, classname) {
    return Array.from(document.getElementById(elementID).getElementsByClassName(classname));
}

function arrayOfIndicesForLength(length) {
    return Array.from(Array(length).keys());//0...N
}

function shuffleThisArray(array2shuffle) {
    for (let i = array2shuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array2shuffle[i], array2shuffle[j]] = [array2shuffle[j], array2shuffle[i]];
    }
}

//---------- ******** Debugging *********** ------------------------//
function cll() {
    console.log([...arguments].join(" "));
}
// function cllts() {
//     console.log([new Date().getTime()+Math.random(),...arguments].join(" "));
// }

//---------- ******** RANDOM *********** ------------------------//

function displayNumRandomised() {
    randomSlideCountsIDs.forEach(id => {
        document.getElementById(id).innerHTML = '<i class="fas fa-images"></i>&nbsp;' + randomCardIndices.length
    });
}

function showNextRandomCard() {
    const indexToShow = randomCardIndices.pop();
    selectThisCardIndex(indexToShow);
}

function btnRandomClicked() {
    if (randomCardIndices.length === 0) setupShuffledCardIndicesArray();
    displayNumRandomised();
    showNextRandomCard();
}

function setupShuffledCardIndicesArray() {
    const statusesIncluded = [];
    for (const cbx of document.getElementById('inputgp-statuscbxs').getElementsByTagName('input')) {
        if (cbx.checked) statusesIncluded.push(cbx.getAttribute('data-status'));
    }
    const includeUntested = statusesIncluded.includes('untested');
    const childer = document.getElementById('select-cards').options;
    randomCardIndices = arrayOfIndicesForLength(childer.length).filter(i => {
        const cuid = childer[i].value;
        //test statusesIncluded.includes separately to allow !!dbObj_answersObj[cuid] to fail and fall thru to else if (includeUntested)
        if (!!dbObj_answersObj[cuid] && statusesIncluded.includes(dbObj_answersObj[cuid])) return true;
        return !dbObj_answersObj[cuid] && includeUntested;
    });
    shuffleThisArray(randomCardIndices);
    displayNumRandomised();
}

function selectThisCardIndex(index) {
    document.getElementById("select-cards").selectedIndex = index;
    loadCardImage();
}

function randomiseBtnClicked() {
    setupShuffledCardIndicesArray();
    showNextRandomCard();
}

function randomiseCBXclicked(cbx) {
    // harmonise with cbx sibling
    let id = cbx.id;
    if(id.includes('fullscreen')) {
        document.getElementById(id.replace('-fullscreen','')).checked = cbx.checked;
    } else {
        document.getElementById(id+'-fullscreen').checked = cbx.checked;
    }
    setupShuffledCardIndicesArray();
    showNextRandomCard();
}

function resetRandomIndexArray() {
    randomCardIndices = [];
    displayNumRandomised();
}

function btnStatusClicked(what) {
    const cardUID=getSelectCardsSelectedCardObjectUniqueCardID();
    if (what === 'untested') delete dbObj_answersObj[cardUID];
    else dbObj_answersObj[cardUID] = what;
    setStatusBtnsForCardUID(cardUID);
    setTimeout(() => updateAnswersObjToDB(), 500);
}

function clearStatusBtns() {
    fullscreenIDs.forEach(suffix => {
        for (const btn of document.getElementById('btngp-status' + suffix).getElementsByTagName('button'))
            if (!btn.className.includes('outline')) btn.className = btn.className.replace('btn-', 'btn-outline-');
    });
}

function setStatusBtnSelected(btnid) {
    const btn = document.getElementById(btnid);
    btn.className = btn.className.replace('btn-outline-', 'btn-');
}

function setStatusBtnsForCardUID(cardUID) {
    clearStatusBtns();
    fullscreenIDs.forEach(suffix => {
        if (dbObj_answersObj && dbObj_answersObj[getSelectCardsSelectedCardObjectUniqueCardID()])
            setStatusBtnSelected('btnstatus-' + dbObj_answersObj[cardUID] + suffix);
        else setStatusBtnSelected('btnstatus-untested'+suffix);
    });
}

function btnClearStatusClicked(what) {
    const keytofind = what === "cardset" ? document.getElementById("select-cardsset").value :
        document.getElementById("select-cardsset").value + "\t" + document.getElementById("select-chapters").value;
    for (const key of Object.keys(dbObj_answersObj)) if (key.startsWith(keytofind)) delete dbObj_answersObj[key];
    setStatusBtnsForCardUID(getSelectCardsSelectedCardObjectUniqueCardID());
    setTimeout(() => updateAnswersObjToDB(), 500);
}

function showHideCardSelect() {
    document.getElementById("select-cards").style.visibility = document.getElementById("select-cards").style.visibility === 'hidden' ?
        'visible' : 'hidden';
}

//---------- ******** User Guide *********** ------------------------//
function toggleUserGuide() {
    window.open("userGuide.html", "Histology Pathology Picture Quiz User Guide");
}
