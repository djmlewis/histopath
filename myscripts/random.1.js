/******************************************************************************
 * Copyright (c) 14/2/2021 4:22     djml.uk E&OE.                             *
 ******************************************************************************/

function btnRandomClicked() {
    if(window.randomCardIndices.length===0) setupShuffledCardIndicesArray();
    const indexToShow = window.randomCardIndices.pop();
    selectThisCardIndex(indexToShow);
}

function setupShuffledCardIndicesArray() {
    window.randomCardIndices = arrayOfIndicesForLength(document.getElementById("select-cards").children.length);
    shuffleThisArray(window.randomCardIndices);
}

function selectThisCardIndex(index) {
    btnFlipThisImageOriginal();
    hideLegendIfAppropriate();
    alignSelectsToSelIndex(["select-cards", "select-cards-toolbox", "select-cards-dropdown"], index);
    cardFaceShowing = frontFace;
    loadCardImage();
}