/******************************************************************************
 * Copyright (c) 14/2/2021 4:22     djml.uk E&OE.                             *
 ******************************************************************************/

/* ********************* HISTORY ************************ */
function addCardIDtoHistory(cardUniqueID) {
    const history = JSON.parse(localStorage.getItem(ls_history));
    const indxAlready = history.indexOf(cardUniqueID);
    if (indxAlready !== -1) history.splice(indxAlready, 1);
    const size = history.unshift(cardUniqueID);
    history.length = Math.min(size, window.historyMaxItems);
    localStorage.setItem(ls_history, JSON.stringify(history));
}

function openHistory(fromdropdown) {
    if(!!fromdropdown)$(fromdropdown).dropdown('hide');
    setupHistoryGallery();
    showSheet("sheet-history");
}

function setupHistoryGallery() {
    const history = JSON.parse(localStorage.getItem(ls_history));
    if (!!history) {
        const histOuterHanger = document.getElementById(historyGalleryOuterHangerID);
        histOuterHanger.innerHTML = "";
        history.forEach((cardUnID,indx) => {
            /* cardObj, addDel, bigIcon, additionalString, isBookmark, hotspot, modalID, bmListName */
            let bmBtn = createBookmarkGalleryForCardObj(getCardObjFromUniqueCardIDwithSplitter(cardUnID, cardUniqueIDSplitter),
                false, true, "", false, undefined, "sheet-history", undefined);
            if(!!bmBtn) {
                bmBtn.tabIndex = indx + 1;//+1 or first is skipped
                histOuterHanger.appendChild(bmBtn);
            }
        });
    }
    adjustQGcardsSize("sheet-history");
}

