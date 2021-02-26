/******************************************************************************
 * Copyright (c) 26/2/2021 5:8     djml.uk E&OE.                              *
 ******************************************************************************/
function displayNumRandomised() {
    document.getElementById('span-randomSlideCount').innerHTML = '<i class="fas fa-images"></i>&nbsp;' + window.randomCardIndices.length;
}

function showNextRandomCard() {
    const indexToShow = window.randomCardIndices.pop();
    selectThisCardIndex(indexToShow);
}

function btnRandomClicked() {
    if (window.randomCardIndices.length === 0) setupShuffledCardIndicesArray();
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
    window.randomCardIndices = arrayOfIndicesForLength(childer.length).filter(i => {
        const cuid = childer[i].value;
        //test statusesIncluded.includes separately to allow !!dbObj_answersObj[cuid] to fail and fall thru to else if (includeUntested)
        if (!!dbObj_answersObj[cuid] && statusesIncluded.includes(dbObj_answersObj[cuid])) return true;
        return !dbObj_answersObj[cuid] && includeUntested;
    });
    shuffleThisArray(window.randomCardIndices);
    displayNumRandomised();
}

function selectThisCardIndex(index) {
    //btnFlipThisImageOriginal();
    //hideLegendIfAppropriate();
    alignSelectsToSelIndex(["select-cards", "select-cards-toolbox", "select-cards-dropdown"], index);
    cardFaceShowing = frontFace;
    loadCardImage();
}

function randomiseBtnClicked() {
    setupShuffledCardIndicesArray();
    showNextRandomCard();
}

function randomiseCBXclicked() {
    setupShuffledCardIndicesArray();
    showNextRandomCard();
}

function resetRandomIndexArray() {
    window.randomCardIndices = [];
    displayNumRandomised();
}

function btnStatusClicked(btn, what) {
    clearStatusBtns();
    btn.className = btn.className.replace('btn-outline-', 'btn-');
    if (what === 'untested') delete dbObj_answersObj[getSelectCardsSelectedCardObjectUniqueCardID()];
    else dbObj_answersObj[getSelectCardsSelectedCardObjectUniqueCardID()] = what;
    setTimeout(() => updateAnswersObjToDB(), 500);
}

function clearStatusBtns() {
    for (const btn of document.getElementById('btngp-status').getElementsByTagName('button'))
        if (!btn.className.includes('outline')) btn.className = btn.className.replace('btn-', 'btn-outline-');
}

function setStatusBtnSelected(btnid) {
    const btn = document.getElementById(btnid);
    btn.className = btn.className.replace('btn-outline-', 'btn-');
}

function setStatusBtnsForCardUID(cardUID) {
    clearStatusBtns();
    if (dbObj_answersObj && dbObj_answersObj[getSelectCardsSelectedCardObjectUniqueCardID()])
        setStatusBtnSelected('btnstatus-' + dbObj_answersObj[cardUID]);
    else setStatusBtnSelected('btnstatus-untested');
}

function btnClearStatusClicked(what) {
    const keytofind = what === "cardset" ? document.getElementById("select-cardsset").value :
        document.getElementById("select-cardsset").value + "\t" + document.getElementById("select-chapters").value;
    for (const key of Object.keys(dbObj_answersObj)) if (key.startsWith(keytofind)) delete dbObj_answersObj[key];
    setStatusBtnsForCardUID(getSelectCardsSelectedCardObjectUniqueCardID());
    setTimeout(() => updateAnswersObjToDB(), 500);
}

function showHideCardSelect() {
    document.getElementById("select-cards").style.visibility= document.getElementById("select-cards").style.visibility==='hidden' ?
        'visible' : 'hidden';
}