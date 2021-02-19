/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/

/* ********** QUICK GALLERY ******** */
function adjustQGcardsSize(QGname) {
    const gybts = elementsArrayForClassNameFromElementID(QGname,"gybt");
    gybts.forEach(btn=>{
        if(window.cards_small) btn.classList.add("gybt-small");
        else btn.classList.remove("gybt-small");
    });

}
function alignCardsSizeSwitches() {
    elementsArrayForClassName("cbxCardSize").forEach(cbx=>{
        cbx.checked=window.cards_small;
    });
}
function handleCardsSmallChanged(galleryID) {
    window.cards_small=!window.cards_small;
    saveCardsSizeSetting();
    alignCardsSizeSwitches();
    adjustQGcardsSize(galleryID);
}
function showGalleryCards(fromdropdown) {
    if(!!fromdropdown)$(fromdropdown).dropdown('hide');
    if (document.getElementById("list-gallery").innerHTML.length < 100) setupGallery(window.collectionobject.cardsetsObj[document.getElementById("select-cardsset-gallery").value].thumbs);
    resetQGllyBookmarkingOff();
    //$('#modal-gallery').modal();
    adjustQGcardsSize("sheet-gallery");
    showSheet("sheet-gallery");
}
function showGelleryButtonForCurrentCard() {
    // each time we change cardset the gallery changes too
    const uniqueID = getSelectCardsSelectedCardObjectUniqueCardID();
    const galleryChildren = elementsArrayForClassNameFromElementID("list-gallery","gybt");
    const btnIndex = galleryChildren.findIndex(child => child.getAttribute("data-uniqueCardID") === uniqueID);
    // scrollIntoView(block: "center") ensures it is centre below the header
    if (btnIndex !== -1) galleryChildren[btnIndex].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
}

function setupGallery(thumbs) {
    if (thumbs.length > 0) {
        const listGallery = document.getElementById("list-gallery");
        listGallery.innerHTML = thumbs;
        applyDarkModeGallery();
        adjustQGcardsSize("sheet-gallery");
    } else {
        document.getElementById("list-gallery").innerHTML = "";
    }
}

function scrollGalleryCardsToTop() {
    // scrollIntoView(false) tries to scroll to the BOTTOM of the viewport so it drags it down below the header
    document.getElementById("list-gallery").children[0].scrollIntoView(false);//.scrollTop = 0;
}

/* ********** FAVOURITES ******** */
function handleQkGyManageBmksClicked() {
    flipQkGyManageBmksBtn();
    setupQuickGalleryBtnsBmkStatus();
}

function handleQuickGalleryClick(target, modalID) {
    if (window.quickGalleryShowingBmks) handleFavBtnClickedInQuickGallery(target);
    else handleGenericGalleryClick(target, modalID)
}

function handleFavBtnClickedInQuickGallery(target) {
    const carduid=target.getAttribute("data-uniqueCardID");
    window.allBookmarksArchiveObj.toggleBookmarkCardUniqueIDInSelectedList(carduid,cardUniqueIDSplitter);
    const isBM=window.allBookmarksArchiveObj.cardUniqueIDisBookmarkedInSelectedList(carduid);
    setQGalleryButtonFavBackgndColStatus(target,isBM);
    const favIcon=elementsArrayForClassNameFromElementObject(target, "gybmi").concat(elementsArrayForClassNameFromElementObject(target, "gybmin"))[0];
    setQGalleryFavIconStatus(favIcon,isBM);
}

function setupQuickGalleryBtnsBmkStatus() {
    const elements = elementsArrayForClassNameFromElementID("list-gallery", "gybmi").concat(elementsArrayForClassNameFromElementID("list-gallery", "gybmin"));
    if(window.quickGalleryShowingBmks) elements.forEach(e => {
        const btn=e.parentElement;
        const carduid=btn.getAttribute("data-uniqueCardID");
        const isBM=window.allBookmarksArchiveObj.cardUniqueIDisBookmarkedInSelectedList(carduid);
        setQGalleryFavIconStatus(e,isBM);
        setQGalleryButtonFavBackgndColStatus(btn,isBM);
        btn.classList.add("gybt-bmking");
        e.hidden = false;
    });
    else elements.forEach(e => {
        e.hidden = true;
        e.parentElement.classList.remove("gybt-bmking");
        setQGalleryButtonFavBackgndColStatus(e.parentElement,false);
    });
}
function setQGalleryButtonFavBackgndColStatus(btn,isBM) {
    if(isBM) btn.classList.add("gybt-bm");
    else btn.classList.remove("gybt-bm");
}
function setQGalleryFavIconStatus(icon,isBM) {
    icon.className=isBM ? "far fa-thumbs-down fa-fw gybmin" : "far fa-thumbs-up fa-fw gybmi";
}
function flipQkGyManageBmksBtn() {
    window.quickGalleryShowingBmks=!window.quickGalleryShowingBmks;
    setupBtnManageQkGllyBkms(window.quickGalleryShowingBmks);
}

function setupBtnManageQkGllyBkms(bookmarking){
    const btn = document.getElementById("btn-qkGyBmks");
    btn.className=bookmarking ? "btn btn-secondary" : "btn btn-warning";
    btn.title=bookmarking ? "Stop bookmarking cards" : "Start bookmarking cards…";
    if(bookmarking){
        document.getElementById("gy-bmlist").innerHTML="Amending <span class='gy-bmlist-name'>" +
            smartStringTrim(allBookmarksArchiveObj.selectedBookmarksListName()) + "</span> bookmarks list";
        document.getElementById("gy-div-bmlist").hidden=false;
    } else {
        document.getElementById("gy-bmlist").innerHTML="";
        document.getElementById("gy-div-bmlist").hidden=true;
    }
}
function resetQGllyBookmarkingOff() {
    window.quickGalleryShowingBmks=false;
    setupBtnManageQkGllyBkms(false);
    setupQuickGalleryBtnsBmkStatus();
}
