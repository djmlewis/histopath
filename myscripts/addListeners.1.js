/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/

//---------- ******** ADD LISTENERS *********** ------------------------//

function addChangeListenerToSelectCardset() {
    ["select-cardsset", "select-cardsset-toolbox","select-cardsset-dropdown"].forEach((select) =>
        document.getElementById(select).addEventListener('change', handleSelectCardsetChanged));
}

function addChangeListenerToSelectChapter() {
    ["select-chapters", "select-chapters-toolbox","select-chapters-dropdown"].forEach((select) =>
        document.getElementById(select).addEventListener('change', handleSelectChaptersChanged));
}

function addChangeListenerToSelectCards() {
    // add onchange to select-cards
        ["select-cards", "select-cards-toolbox","select-cards-dropdown"].forEach((select) =>
            document.getElementById(select).addEventListener('change', handleSelectCardsChanged));
}


function addDblClickListenerToImageCard() {
    //either col-image or image-card can receive dblclick because we stopPropagation from image-card
    window.imageCard.addEventListener('dblclick',ev=>handleCardDblClick(ev));
    document.getElementById("col-image").addEventListener('dblclick',ev=>handleCardDblClick(ev));
    window.imageCard.addEventListener('load',handleCardImageLoad);

}

function addClickListenerToBookmarkGalleryButtons() {
    Array.from(elementsArrayForClassName("btnBMkGally")).forEach(e=>{
    e.addEventListener('click',showBookmarksGallery);
});
}