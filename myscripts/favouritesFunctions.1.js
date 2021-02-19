/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/
const defaultBookmarkListName = "Default";

function defaultBMlistsObj() {
    let obj = {};
    obj[defaultBookmarkListName] = [];
    return obj;
}

const bookmarksGalleryOuterHangerID = "list-bookmarks-gallery";
const historyGalleryOuterHangerID = "list-history-gallery";
const selectBookmarksListClassName = "class-selectbookmarks-gallery";
const btnChooosBMlistNameDatAtrr = "data-cardobj";
const alertIcon = '<i class="fas fa-exclamation-triangle" style="color: orangered;"></i>&nbsp;';
const infoIcon = '<i class="fas fa-info-circle" style="color: dodgerblue;"></i>&nbsp;';
const alertInlineDuration = 4000;


function BookmarksRecord() {
    this.version = ls_BookmarksObjectkey;
    this.bookmarksListsObject = defaultBMlistsObj();
}
BookmarksRecord.prototype.alert = function (alertmsg, alertType) {
    const alertRow = document.getElementById("row-alert-bookmarks");
    let alertMsgUse = alertmsg;
    switch (alertType) {
        case 'a':
            alertMsgUse = alertIcon + alertmsg;
            break;
        case 'i':
            alertMsgUse = infoIcon + alertmsg;
            break;
    }
    alertRow.innerHTML = alertMsgUse;
    alertRow.hidden = false;
    setTimeout(function () {
        alertRow.hidden = true;
    }, alertInlineDuration);
};

BookmarksRecord.prototype.rehydrate = function (driedObject) {
    let self = this;
    let rehydratedObj = JSON.parse(driedObject);
    self.bookmarksListsObject = rehydratedObj.bookmarksListsObject;
};
BookmarksRecord.prototype.emptyBookmarksRecord = function (listname) {
    const self = this;
    const exportBMR = {version: self.version, bookmarksListsObject: {}};
    if (listname !== undefined) exportBMR.bookmarksListsObject[listname] = self.bookmarksListsObject[listname];
    return exportBMR
};
BookmarksRecord.prototype.clearAllBookmarks = function (clearAll) {
    let self = this;
    if (clearAll) {
        document.getElementById("list-bookmarks-gallery").innerHTML = "";
        self.bookmarksListsObject = defaultBMlistsObj();
    } else {
        const bllistname = document.getElementById("select-bookmarksListsNames-clear").value;
        if (self.bookmarksListNameIsValid(bllistname)) {
            if (bllistname === defaultBookmarkListName) self.bookmarksListsObject[bllistname] = [];
            else delete self.bookmarksListsObject[bllistname];
        }
    }
    self.cacheInternalBookmarksObj();
    self.setupBookmarksGallery();
};
BookmarksRecord.prototype.cacheInternalBookmarksObj = function () {
    let self = this;
    localStorage.setItem(ls_BookmarksObjectkey, JSON.stringify(self));
};
BookmarksRecord.prototype.hasBookmarks = function () {
    const self = this;
    let hasBM = false;
    Object.values(self.bookmarksListsObject).forEach(a => {
        hasBM = hasBM || a.length > 0;
    });
    return hasBM;
};

/*
BookmarksRecord.prototype.updateBookmarksListNamePrepend = function () {
    self = this;
    [document.getElementById("span-bmkListName"), document.getElementById("span-bmkListName-toolbox")].forEach(e => {
        e.innerText = smartStringTrim(self.selectedBookmarksListName());
    });
};
*/

BookmarksRecord.prototype.createSimpleOptionForSelectOrGalleryWithName = function (listname,displayText) {
    let opt = document.createElement("option");
    opt.value = listname;
    opt.text = displayText;
    return opt;
};
BookmarksRecord.prototype.setupBookmarksGallery = function () {
    self = this;
    //save current bmlist to try to restore
    const currentBMlist = !!self.selectedBookmarksListName() ? self.selectedBookmarksListName() : getSavedBMlistName();
    //clear the selects ...
    const selectsArray = elementsArrayForClassName(selectBookmarksListClassName);
    selectsArray.forEach(e => {
        e.innerHTML = "";
    });
    // ... then populate each with names of the available lists
    Object.keys(self.bookmarksListsObject).forEach(listName => {
        selectsArray.forEach(e => {
            e.appendChild(self.createSimpleOptionForSelectOrGalleryWithName(listName,listName));
        });
    });
    //try to restore the currentBMlist or use default
    const selectedBMlist = self.bookmarksListNameIsValid(currentBMlist) ? currentBMlist : defaultBookmarkListName;
    selectsArray.forEach(e => {
        e.value = selectedBMlist;
    });
    //self.updateBookmarksListNamePrepend();
    updateBookmarkButton(getSelectCardsSelectedCardObject());

    // now we can populate the gallery ONLY with selected list
    const bmOuterHanger = document.getElementById(bookmarksGalleryOuterHangerID);
    bmOuterHanger.innerHTML = "";
    const bmListToPopulateName=self.selectedBookmarksListName();
    const bookmarkslistobj=self.bookmarksListsObject[bmListToPopulateName];
    document.getElementById("div-nobookmarkswarning").hidden=bookmarkslistobj.length >= 1;
    bookmarkslistobj.forEach(cardUnID => {
        const bmBtn = createBookmarkGalleryForCardObj(getCardObjFromUniqueCardIDwithSplitter(cardUnID, cardUniqueIDSplitter),
            true, true, "", true, undefined, "sheet-bookmarks", currentBMlist);
        if(!!bmBtn) bmOuterHanger.appendChild(bmBtn);
    });
    adjustQGcardsSize("sheet-bookmarks");
    setTimeout(function(){preloadCardUIDarray(bookmarkslistobj, bmListToPopulateName);},2000);
    //setTimeout(function(){preloadCardUIDarray(bookmarkslistobj, bmListToPopulateName)},500);
};

BookmarksRecord.prototype.numberOfBookmarksLists = function () {
    const self = this;
    return Object.keys(self.bookmarksListsObject).length;
};
BookmarksRecord.prototype.selectedBookmarksListName = function () {
    return document.getElementById("select-bookmarksListsNames-gallery").value;
};
BookmarksRecord.prototype.selectBMlistWithName = function (bmlstName) {
    elementsArrayForClassName(selectBookmarksListClassName).forEach(e => {
        e.value = bmlstName;
    });
    handleBookmarksGallerySelectChanged();
};
BookmarksRecord.prototype.uniquifyBMlistName = function (listname) {
    let uniqName = listname;
    let indx = 0;
    while (!!self.bookmarksListsObject && !!self.bookmarksListsObject[uniqName]) {
        indx++;
        uniqName = listname + "_" + indx;
    }
    return uniqName;
};
BookmarksRecord.prototype.bookmarksListNameIsValid = function (nameStr) {
    const self = this;
    return !!nameStr && !!self.bookmarksListsObject[nameStr];
};
BookmarksRecord.prototype.numberOfBookmarksInList = function (bmList) {
    const self = this;
    const bmListArray = self.bookmarksListsObject[bmList];
    if (!!bmListArray) return bmListArray.length;
    return 0;
};
BookmarksRecord.prototype.positionOfBookmarkedCardInList = function (carduniqueid, bmList) {
    const self = this;
    const bmListArray = self.bookmarksListsObject[bmList];
    if (!!bmListArray) {
        const bmeindex = bmListArray.indexOf(carduniqueid);
        switch (bmeindex) {
            case -1:
                return undefined;
            case bmListArray.length - 1:
                return "last";
            case 0:
                return "first";
            default:
                return "middle";
        }
    }
    return undefined;
};

BookmarksRecord.prototype.cardUniqueIDisBookmarkedInList = function (uniqueCardID, list) {
    const self = this;
    const listArray = self.bookmarksListsObject[list];
    if (!!listArray) {
        return listArray.includes(uniqueCardID);
    }
    return false;
};
BookmarksRecord.prototype.cardUniqueIDisBookmarkedInSelectedList = function (uniqueCardID) {
    const self = this;
    return self.cardUniqueIDisBookmarkedInList(uniqueCardID,this.selectedBookmarksListName());
};
BookmarksRecord.prototype.bookmarkCardObjectToList = function (cardObject, bmList) {
    const self = this;
    const bmListArray = Array.from(self.bookmarksListsObject[bmList]);
    if (!!bmListArray && bmListArray.indexOf(cardObject.uniqueCardID) === -1) {
        bmListArray.push(cardObject.uniqueCardID);
        self.bookmarksListsObject[bmList] = bmListArray;
        self.setupBookmarksGallery();
    }
    self.cacheInternalBookmarksObj();
};
BookmarksRecord.prototype.bookmarkCardUniqueIDWithSplitterInSelectedList = function (carduniqueid, splitter) {
    const self = this;
    const cardObj = getCardObjFromUniqueCardIDwithSplitter(carduniqueid, splitter);
    if(!!cardObj) self.bookmarkCardObjectToList(cardObj, self.selectedBookmarksListName());
};
BookmarksRecord.prototype.toggleBookmarkCardUniqueIDInSelectedList = function (carduniqueid,splitter) {
    const self = this;
    if(self.cardUniqueIDisBookmarkedInSelectedList(carduniqueid)) self.deleteBookmarkForCardUniqueIDInSelectedList(carduniqueid);
    else self.bookmarkCardUniqueIDWithSplitterInSelectedList(carduniqueid,splitter);
};
BookmarksRecord.prototype.deleteBookmarkForCardUniqueID = function (carduniqueid, bmList) {
    const self = this;
    const bmListArray = self.bookmarksListsObject[bmList];
    if (!!bmListArray) {
        self.bookmarksListsObject[bmList] = bmListArray.filter(e => e !== carduniqueid);
        self.setupBookmarksGallery();
    }
    self.cacheInternalBookmarksObj();
};
BookmarksRecord.prototype.deleteBookmarkForCardUniqueIDInSelectedList = function (carduniqueid) {
    const self = this;
    self.deleteBookmarkForCardUniqueID(carduniqueid,this.selectedBookmarksListName());
};

BookmarksRecord.prototype.addedrenamedBMlistWithName = function (nameStr, call) {
    let self = this;
    const mergeSelectCol = document.getElementById("col-select-bookmarksListsNames-merge");
    const listname1 = document.getElementById("select-bookmarksListsNames-merge").value;
    const listname2 = document.getElementById("select-bookmarksListsNames-gallery").value;
    if (mergeSelectCol.hidden === false && listname1 === listname2) {
        window.allBookmarksArchiveObj.alert("You cannot merge <strong>" + listname1 + "</strong> with itself", 'a');
        return false;
    }
    if (nameStr.length === 0) {
        window.allBookmarksArchiveObj.alert('Please enter a valid name', 'a');
        return false;
    }
    if (self.bookmarksListNameIsValid(nameStr)) {
        window.allBookmarksArchiveObj.alert("The name '" + nameStr + "' is already in use", 'a');
        return false;
    }

    const nameStrOK = nameStr.replace(/\W/gi, "");
    if (nameStrOK.length === 0) {
        window.allBookmarksArchiveObj.alert("The name '" + nameStr + "' contains only invalid characters", 'a');
        return false;
    }
    if (self.bookmarksListNameIsValid(nameStrOK)) {
        window.allBookmarksArchiveObj.alert("The valid name '" + nameStrOK + "' is already in use", 'a');
        return false;
    }
    switch (call) {
        case 'merge':
            self.bookmarksListsObject[nameStrOK] =  arrayWithoutDuplicates([...self.bookmarksListsObject[listname1], ...self.bookmarksListsObject[listname2]]);
            self.cacheInternalBookmarksObj();
            break;
        case 'add':
            self.bookmarksListsObject[nameStrOK] = [];
            self.cacheInternalBookmarksObj();
            break;
        case 'rename':
            const currentListName = document.getElementById("select-bookmarksListsNames-gallery").value;
            if (currentListName === defaultBookmarkListName) {
                window.allBookmarksArchiveObj.alert("You cannot rename the " + nameStr + " list", 'a');
                return false;
            }
            const existingList = Array.from(self.bookmarksListsObject[currentListName]);
            self.bookmarksListsObject[nameStrOK] = existingList;
            delete self.bookmarksListsObject[currentListName];
            self.cacheInternalBookmarksObj();
            break;
    }
    self.setupBookmarksGallery();
    window.allBookmarksArchiveObj.selectBMlistWithName(nameStrOK);
    //self.updateBookmarksListNamePrepend();
    updateBookmarkButton(getSelectCardsSelectedCardObject());
    disableMergeButton();
    return true;
};
BookmarksRecord.prototype.duplicatedSelectedBMList = function () {
    let self = this;
    let newname = self.uniquifyBMlistName(self.selectedBookmarksListName());
    self.bookmarksListsObject[newname] = Array.from(self.bookmarksListsObject[self.selectedBookmarksListName()]);
    self.setupBookmarksGallery();
    window.allBookmarksArchiveObj.selectBMlistWithName(newname);
    //self.updateBookmarksListNamePrepend();
    updateBookmarkButton(getSelectCardsSelectedCardObject());
    disableMergeButton();
    return true;
};
BookmarksRecord.prototype.moveBookmarkForCardUniqueID = function (uniqueCardID, action) {
    const self = this;
    const bmList = self.selectedBookmarksListName();
    const bmListArray = Array.from(self.bookmarksListsObject[bmList]);
    if (!!bmListArray) {
        const bmIndex = bmListArray.indexOf(uniqueCardID);
        if (bmIndex > -1) {
            const newIndex = action === "up" ? Math.max(0, bmIndex - 1) : Math.min(bmListArray.length - 1, bmIndex + 1);
            if (newIndex !== bmIndex) {
                [bmListArray[bmIndex], bmListArray[newIndex]] = [bmListArray[newIndex], bmListArray[bmIndex]];
                self.bookmarksListsObject[bmList] = bmListArray;
                self.cacheInternalBookmarksObj();
            }
        }
    }
};
BookmarksRecord.prototype.dragBookmarkToCardUniqueID = function (uniqueCardID, action) {
    const self = this;
    if (window.draggedBMCardUniqueID !== uniqueCardID) {
        const bmList = self.selectedBookmarksListName();
        let bmListArray = Array.from(self.bookmarksListsObject[bmList]);
        if (!!bmListArray) {
            const bmIndexFrom = bmListArray.indexOf(window.draggedBMCardUniqueID);
            //copy existing b4 splice out the val
            const existingVal = bmListArray[bmIndexFrom];
            bmListArray.splice(bmIndexFrom, 1);
            // now recalculate index of our target card as the splice may have been above or below
            const bmIndexTo = bmListArray.indexOf(uniqueCardID);
            //above the target - use the target index and push it down, below target - use target+1 to push lower cards down
            const nI = action === "up" ? Math.max(0, bmIndexTo) : bmIndexTo + 1;
            bmListArray.splice(nI, 0, existingVal);
            self.bookmarksListsObject[bmList] = bmListArray;
            self.cacheInternalBookmarksObj();
        }
    }
};
BookmarksRecord.prototype.changeBookmarkIndex = function (carduniqueid, btnvalue) {
    const self = this;
    const bmListArray = self.bookmarksListsObject[self.selectedBookmarksListName()];
    if (!!bmListArray) {
        const bmeindex = bmListArray.indexOf(carduniqueid);
        if (bmeindex > -1) {
            if (btnvalue === nextValue) {
                // next
                if (bmeindex + 1 < bmListArray.length) handleGalleryClick(bmListArray[bmeindex + 1], undefined, undefined);
                else blinkElementHashID("image-card");
            } else {
                // prev
                if (bmeindex - 1 >= 0) handleGalleryClick(bmListArray[bmeindex - 1], undefined, undefined);
                else blinkElementHashID("image-card");
            }
        }
    }
};

BookmarksRecord.prototype.exportBookmarks = function (exportAll, listname) {
    const self = this;
    if (self.hasBookmarks() === false) myAlert("No Bookmarks to export", myAlert_info);
    else {
        if (exportAll) doExportObject(self, "All Bookmarks" + bookmarksSuffix);
        else doExportObject(self.emptyBookmarksRecord(listname), listname + bookmarksSuffix);
    }
};
BookmarksRecord.prototype.importBookmarksString = function (importString, importfilesname) {
    const self = this;
    let bookmarksRecord = JSON.parse(importString);
    if (bookmarksRecord.version === self.version) {
        // add the bookmarks and lists to our object IF the chapter etc is valid
        let errors=false;
        Object.entries(bookmarksRecord.bookmarksListsObject).forEach(listNameArray => {
            // check we have this actual card
            const validBMs = [...listNameArray[1]].filter(bmstr=>{return validUniqueCardIDwithSplitter(bmstr, "\t");});
            if(validBMs.length !== listNameArray[1].length) errors = true;
            if (self.bookmarksListNameIsValid(listNameArray[0])) {
                if(validBMs.length>0) {
                    // this list already exists so merge arrays
                    self.bookmarksListsObject[listNameArray[0]] = arrayWithoutDuplicates([...self.bookmarksListsObject[listNameArray[0]], ...validBMs]);
                }
            } else {
                // just add the new list
                if(validBMs.length>0) {
                    self.bookmarksListsObject[listNameArray[0]] = [...validBMs];
                }
            }
        });
        if(errors) myAlert("Some or all of the bookmarks from the file "+'<span class="spanAlert">' + importfilesname +
            '</span>'+" were invalid and were not imported",myAlert_alert);
        else myAlert('Bookmarks from the file "<span class="spanAlert">' + importfilesname +
            '</span>" were imported and merged with any existing bookmarks lists', myAlert_info);
        self.setupBookmarksGallery();
        self.cacheInternalBookmarksObj();
    } else myAlert('Bookmarks from the file "<span class="spanAlert">' + importfilesname +
        '</span>" could not be imported. It could be an empty file or the bookmarks were of the wrong version', myAlert_alert);
};
BookmarksRecord.prototype.importTopicObject = function (topicID) {
    //no need to preload as the BMKgallery is populated with the topic cards
    const self = this;
    const topicArray = window.topicsObj[topicID];
    if (!!topicArray) {
        // uniqueify if needed
        let uniqName = self.uniquifyBMlistName(topicID);
        self.bookmarksListsObject[uniqName] = Array.from(topicArray);
        self.setupBookmarksGallery();
        self.selectBMlistWithName(uniqName);
        self.cacheInternalBookmarksObj();
        if (window.callingTopicsFromModal === true) {
            window.callingTopicsFromModal = undefined;
            hideSheet("sheet-topics");
            setTimeout(function () {
                showSheet("sheet-bookmarks");
            }, 250);
        } else myAlert('Topic <span class="spanAlert">' + uniqName + '</span> has been added to bookmarks', myAlert_info);
    }
};

//---------------------------------------------  FUNCTIONS

function numberOfBookmarks() {
    return window.allBookmarksArchiveObj.numberOfBookmarksInList(window.allBookmarksArchiveObj.selectedBookmarksListName());
}

function bookmarkIDForCardUniqueID(uniqueCardID, bmList) {
    return bookmark_IDprefix + uniqueCardID + bmList;
}

function handleGenericGalleryClick(target, modalID) {
    if (!!target && target.tagName === "BUTTON") handleGalleryClick(target.getAttribute("data-uniqueCardID"), undefined,modalID);
}

function createBookmarkGalleryForCardObj(cardObj, addDel, bigIcon, additionalString, isBookmark, hotspot, modalID, bmListName) {
    if(!!cardObj) {
        let opt = document.createElement("button");
        //the presence of a button with a bookmarkID in the document children signifies this card is bookmarked,
        // which we dont want when its being made for search modal, so only add iD when bookmarking
        if (isBookmark) {
            opt.id = bookmarkIDForCardUniqueID(cardObj.uniqueCardID, bmListName);
            //set a version number
            opt.setAttribute("ls_BookmarksObjectkey", ls_BookmarksObjectkey);
        }
        opt.type = "button";
        opt.className = "gybt";
        opt.setAttribute("data-uniqueCardID", cardObj.uniqueCardID);
        opt.setAttribute("data-hotspot", hotspot);
        const bmpDIVclass = 'bmpDIV24ch';//isModalBMGallery ? 'bmpDIV24ch' : 'bmpDIV';
        const cardsSetString = cardObj.cardsetTitle.length > cardsetTitleTruncLength ? cardObj.cardsetTitle.substring(0, cardsetTitleTruncLength) + "…" : cardObj.cardsetTitle;
        opt.innerHTML =
            "<div class = '" + bmpDIVclass + "'>" + //bmpDIV stops pointer-events
            "<p class = 'bmpCD'>" + cardObj.title + "</p>" +
            (additionalString.length > 0 ? ("<p class = 'bmpAS'>" + additionalString + "</p>") : "<p class = 'bmpCH'>" + cardObj.chapterTitle + "</p>") +
            //"<p class = 'bmpCH'>" + cardObj.chapterTitle + "</p>" +
            "<p class = 'bmpCS'>" + cardsSetString + "</p>" +
            "</div>";
        const imgdiv = document.createElement("div");
        imgdiv.className = "icon-Gallery-imgdiv";//bigIcon === true ? "icon-Gallery-imgdiv" : "icon-Gallery-imgdiv-small";
        const thmb = document.createElement("img");
        thmb.alt = '';
        thmb.src = cardObj.thumbsPath;
        imgdiv.appendChild(thmb);
        //add hotspot icon if hs present
        if (cardUniqueIDhasHotspots(cardObj.uniqueCardID, cardUniqueIDSplitter)) {
            const hsicon = document.createElement('i');
            hsicon.className = "fas fa-question-circle icon-Gallery-hotspot";
            imgdiv.appendChild(hsicon);
        }
        opt.prepend(imgdiv);
        if (addDel) {
            const editBtnsDiv = document.createElement("div");
            editBtnsDiv.className = "d-flex flex-column ml-1";
            const editBtnsDiv2 = document.createElement("div");
            editBtnsDiv2.className = "d-flex flex-column mr-1";
            opt.prepend(editBtnsDiv2);
            opt.append(editBtnsDiv);

            function addIcon(className, action, div) {
                const icon = document.createElement('i');
                icon.hidden = true;
                icon.className = className;
                icon.setAttribute("data-uniqueCardID", cardObj.uniqueCardID);
                switch (action) {
                    case "del":
                        icon.onclick = function (e) {
                            handleBookmarkGalleryDeleteClick(e, cardObj.uniqueCardID);
                        };
                        icon.title = "Delete bookmark";
                        break;
                    case "drag":
                        icon.onclick = function (e) {
                            handleBookmarkGalleryDragClick(e, cardObj.uniqueCardID);
                        };
                        icon.title = "Jump bookmark: Click this button and then click the Left or Righ Arrow of another bookmark to place this bookmark before / after that one. Click this button again to cancel jump.";
                        break;
                    case "up":
                    case "down":
                        icon.onclick = function (e) {
                            handleBookmarkGalleryUpDownClick(e, cardObj.uniqueCardID, action);
                        };
                        icon.title = "Move bookmark " + action;
                        break;
                }
                div.appendChild(icon);
            }

            addIcon("fas fa-times-circle icon-bookmarksGallery-delete iconBookmarksGalleryEdit mb-1", "del", editBtnsDiv);
            addIcon("fas fa-stream icon-bookmarksGallery-drag iconBookmarksGalleryEdit mt-1", "drag", editBtnsDiv);
            addIcon("fas fa-caret-square-left icon-bookmarksGallery-up iconBookmarksGalleryEdit mb-1", "up", editBtnsDiv2);//fa-caret-square-up
            addIcon("fas fa-caret-square-right icon-bookmarksGallery-down iconBookmarksGalleryEdit mt-1", "down", editBtnsDiv2);
        }
        return opt;
    } else return null;
}

function bookmarkCardObjToSpecificList(btn) {
    $('#modal-bookmarks-listChoose').modal('hide');
    const listName = document.getElementById("select-bookmarksListsNames-choose").value;
    const cardobj = JSON.parse(btn.getAttribute(btnChooosBMlistNameDatAtrr));
    window.allBookmarksArchiveObj.bookmarkCardObjectToList(cardobj, listName);
    clearUpAfterBookmarkDeleteOrAdd();
    setTimeout(function () {
        myAlert("Bookmarked to list <span class=\"spanAlert\">" + listName + "</span>.", myAlert_info)
    }, 500);
}

function getBookmarksObjectFromCache() {
    let blankBMobject = new BookmarksRecord();
    if (!localStorage.getItem(ls_BookmarksObjectkey)) {
        localStorage.setItem(ls_BookmarksObjectkey, JSON.stringify(blankBMobject));
    } else {
        blankBMobject.rehydrate(localStorage.getItem(ls_BookmarksObjectkey));
    }
    return blankBMobject;
}

function bookmarkThisCardObject(evt, cardobj, addOrDeleteKeyValue) {
    if (addOrDeleteKeyValue === addBookmarkButtonValue) {
        if (evt.shiftKey) showModalBookmarksListChoose(cardobj);
        else window.allBookmarksArchiveObj.bookmarkCardObjectToList(cardobj, window.allBookmarksArchiveObj.selectedBookmarksListName());
    } else {
        window.allBookmarksArchiveObj.deleteBookmarkForCardUniqueID(cardobj.uniqueCardID, window.allBookmarksArchiveObj.selectedBookmarksListName());
    }
    clearUpAfterBookmarkDeleteOrAdd();
}

function showExportBookmarksModal(toolbar) {
    if (toolbar) {
        toggleActionmenuToolbar();
        setTimeout(function () {
            $('#modaExportFavourites').modal();
        }, 500);
    } else $('#modaExportFavourites').modal();
}

function doExportAllBookmarks(exportAll) {
    window.allBookmarksArchiveObj.exportBookmarks(exportAll, document.getElementById("select-bookmarksListsNames-export").value);
}

function clearAllBookmarks(clearAll) {
    window.allBookmarksArchiveObj.clearAllBookmarks(clearAll);
    clearUpAfterBookmarkDeleteOrAdd();
}

function clearUpAfterBookmarkDeleteOrAdd() {
    disableMergeButton();
    loadCardImage();
}

function updateBookmarkButton(selectedCardObj) {
    const isBookmarked = window.allBookmarksArchiveObj.cardUniqueIDisBookmarkedInList(selectedCardObj.uniqueCardID, window.allBookmarksArchiveObj.selectedBookmarksListName());
    const position = window.allBookmarksArchiveObj.positionOfBookmarkedCardInList(selectedCardObj.uniqueCardID, window.allBookmarksArchiveObj.selectedBookmarksListName());
    Array.from(document.getElementsByClassName("btnBkmk")).forEach((bookmarkBtn) => {
        if (isBookmarked === true) {
            bookmarkBtn.title = "Delete bookmark from list";
            // we NEED the type=button or it messes up the dropdown, so dont destroy inner html
            [...bookmarkBtn.children].forEach((el => {if(el.tagName==="I") {
                el.classList.remove("fa-thumbs-up");
                el.classList.add("fa-thumbs-down");
            }}));
            if (!bookmarkBtn.id.includes("max")) {
                bookmarkBtn.classList.remove("btn-warning");
                bookmarkBtn.classList.add("btn-outline-warning","unbkmk");
                bookmarkBtn.onclick = function (evt) {
                    bookmarkThisCardObject(evt, selectedCardObj, deleteBookmarkButtonValue);
                };
            }
        } else {
            bookmarkBtn.title = "Add bookmark to list";
            //bookmarkBtn.innerHTML = '<i class="far fa-thumbs-up fa-fw"></i>';
            [...bookmarkBtn.children].forEach((el => {if(el.tagName==="I") {
                el.classList.add("fa-thumbs-up");
                el.classList.remove("fa-thumbs-down");
            }}));
            if (!bookmarkBtn.id.includes("max")) {
                bookmarkBtn.classList.add("btn-warning");
                bookmarkBtn.classList.remove("btn-outline-warning","unbkmk");
                bookmarkBtn.onclick = function (evt) {
                    bookmarkThisCardObject(evt, selectedCardObj, addBookmarkButtonValue);
                };
            }
        }
    });
    Array.from(document.getElementsByClassName("btn-bmk-prevnext")).forEach((bookmarkBtn) => {
        bookmarkBtn.disabled = !isBookmarked || numberOfBookmarks() < 2;
        if (bookmarkBtn.id.includes("prev") && position === "first") bookmarkBtn.disabled = true;
        if (bookmarkBtn.id.includes("next") && position === "last") bookmarkBtn.disabled = true;
        bookmarkBtn.onclick = function () {
            window.allBookmarksArchiveObj.changeBookmarkIndex(selectedCardObj.uniqueCardID, bookmarkBtn.getAttribute("data-value"));
        }
    });
    Array.from(document.getElementsByClassName("btn-bmk-prevnext-max")).forEach((bookmarkBtn) => {
        bookmarkBtn.style.visibility = !isBookmarked || numberOfBookmarks() < 2 ? "hidden" : "visible";
        if (bookmarkBtn.id.includes("prev") && position === "first") bookmarkBtn.style.visibility = "hidden";
        if (bookmarkBtn.id.includes("next") && position === "last") bookmarkBtn.style.visibility = "hidden";
        bookmarkBtn.onclick = function () {
            handleBookmarkPrevNextMaxClicked(bookmarkBtn.getAttribute("data-value"));
        };
    });
}

function handleBookmarkPrevNextMaxClicked(btnval) {
    if (btnval === "-1") document.getElementById("btn-bmk-prev").click();
    else document.getElementById("btn-bmk-next").click();
}

function handleBookmarkMaxClicked() {
    document.getElementById("btn-bookmarkFixed").click();
}

function handleChangeBmkIndexfromKey(btnvalue) {
    const selectedCardUniqueID = getSelectCardsSelectedCardObjectUniqueCardID();
    if (window.allBookmarksArchiveObj.cardUniqueIDisBookmarkedInList(selectedCardUniqueID,
        window.allBookmarksArchiveObj.selectedBookmarksListName())) window.allBookmarksArchiveObj.changeBookmarkIndex(selectedCardUniqueID, btnvalue);
}

function showClearFavouritesModal() {
    toggleActionmenuToolbar();
    setTimeout(function () {
        $('#modalClearFavouritess').modal();
    }, 500);
}

function alignBookmarksSelects(select){
    // handleBookmarksGallerySelectChanged may not need to update the values as it may have set them already, so undefined will be passed to alignBookmarksSelects()
    if(!!select) elementsArrayForClassName(selectBookmarksListClassName).forEach(e => e.value = select.value);
}
function handleBookmarksGallerySelectChanged(select) {
    alignBookmarksSelects(select);
    window.allBookmarksArchiveObj.setupBookmarksGallery();
    updateBookmarkButton(getSelectCardsSelectedCardObject());
    document.getElementById("btn-bmklist-rename").disabled = window.allBookmarksArchiveObj.selectedBookmarksListName() === defaultBookmarkListName;
    setupHideAddBMlist('hide');
    saveSelectedBMlistName();
}

function saveSelectedBMlistName() {
    localStorage.setItem(ls_BookmarksLastListKey, window.allBookmarksArchiveObj.selectedBookmarksListName());
}

function getSavedBMlistName() {
    if (!localStorage.getItem(ls_BookmarksLastListKey)) {
        localStorage.setItem(ls_BookmarksLastListKey, defaultBookmarkListName);
    }
    return localStorage.getItem(ls_BookmarksLastListKey);
}

function bookmarkGalleryOpenNewModal(call) {
    //$('#modal-bookmarks-gallery').modal('hide');
    hideSheet("sheet-bookmarks");
    switch (call) {
        case 'clear':
            $('#modalClearFavouritess').modal('show');
            break;
        case 'download':
            $('#modaExportFavourites').modal('show');
            break;
        case 'upload':
            importFileWithSuffix('.vabkmks', false);
            break;
    }

}

function duplicateSelectedBMList() {
    window.allBookmarksArchiveObj.duplicatedSelectedBMList();
}

function setupHideAddBMlist(call) {
    document.getElementById("input-newBMlistName").value = "";
    document.getElementById("input-newBMlistName").focus();
    document.getElementById("col-select-bookmarksListsNames-merge").hidden = true;
    const doBtn = document.getElementById("btn-doaddrenameBMlistWithName");
    switch (call) {
        case 'add':
            doBtn.title = "Add new list with this name";
            doBtn.innerHTML = "<i class='fas fa-plus'></i>";
            doBtn.onclick = function () {
                doAddRenameBMlistWithCall('add');
            };
            break;
        case 'rename':
            doBtn.title = "Rename list with this name";
            doBtn.innerHTML = "<i class='fas fa-edit'></i>";
            doBtn.onclick = function () {
                doAddRenameBMlistWithCall('rename');
            };
            break;
        case 'merge':
            document.getElementById("col-select-bookmarksListsNames-merge").hidden = false;
            doBtn.title = "Merge lists with this name";
            doBtn.innerHTML = "<i class='fas fa-link'></i>";
            doBtn.onclick = function () {
                doAddRenameBMlistWithCall('merge');
            };
            break;
    }
    document.getElementById("row-addBMlistName").hidden = call === 'hide';
}

function doAddRenameBMlistWithCall(call) {
    window.allBookmarksArchiveObj.addedrenamedBMlistWithName(document.getElementById("input-newBMlistName").value, call);
    setupHideAddBMlist('hide');
}

function disableMergeButton() {
    document.getElementById("btn-bmklist-merge").disabled = window.allBookmarksArchiveObj.numberOfBookmarksLists() < 2;
}

function showBookmarksGallery() {
    // we dont have the evt as we used add listener so we dont know whether the dropdown triggered it
    $("#dropdown-tools").dropdown('hide');
    document.getElementById("btn-bmklist-rename").disabled = document.getElementById("select-bookmarksListsNames-gallery").value === defaultBookmarkListName;
    disableMergeButton();
    setupHideAddBMlist('hide');
    adjustQGcardsSize("sheet-bookmarks");
    //$('#modal-bookmarks-gallery').modal();
    showSheet("sheet-bookmarks");
}

function showModalBookmarksListChoose(cardobj) {
    document.getElementById("btn-bmklist-choose").setAttribute(btnChooosBMlistNameDatAtrr, JSON.stringify(cardobj));
    $('#modal-bookmarks-listChoose').modal();
}

function handleBookmarksGalleryWillShow() {
    hideBookmarksEditButton(true);
}

/* ********************* EDIT BOOKMARKS ************************ */

function cancelBookmarkDrag(cancel) {
    if (cancel) window.draggedBMCardUniqueID = undefined;
    displayDraggingStatus(cancel);
}

function displayDraggingStatus(notDragging) {
    [elementsArrayForClassName("icon-bookmarksGallery-up"), elementsArrayForClassName("icon-bookmarksGallery-down")].forEach(a => {
        a.forEach(e => {
            if (notDragging) e.classList.remove("iconBookmarksGalleryupdown-drag");
            else if (e.getAttribute("data-uniqueCardID") !== window.draggedBMCardUniqueID) e.classList.add("iconBookmarksGalleryupdown-drag");
        });
    });
    /*
        elementsArrayForClassName("icon-bookmarksGallery-down").forEach(e => {
            if (notDragging) e.classList.remove("iconBookmarksGalleryupdown-drag");
            else if (e.getAttribute("data-uniqueCardID") !== window.draggedBMCardUniqueID) e.classList.add("iconBookmarksGalleryupdown-drag");
        });
    */
    elementsArrayForClassName("icon-bookmarksGallery-drag").forEach(e => {
        e.classList.remove("iconBookmarksGallerydrag-dragged");
        e.classList.remove("iconBookmarksGallerydrag-notdragged");
        if (!notDragging) {
            if (e.getAttribute("data-uniqueCardID") === window.draggedBMCardUniqueID) e.classList.add("iconBookmarksGallerydrag-dragged");
            else e.classList.add("iconBookmarksGallerydrag-notdragged");
        }
    });
}

function editBookmarkList(btn) {
    hideBookmarksEditButton(btn.getAttribute("data-value") !== "s");
}

function hideBookmarksEditButton(hide) {
    cancelBookmarkDrag(true);
    const btn = document.getElementById("btn-bmklist-edit");
    btn.setAttribute("data-value", hide ? "s" : "h");
    btn.title = hide ? "Edit bookmarks in list" : "Stop editing bookmarks in list";
    elementsArrayForClassName("iconBookmarksGalleryEdit").forEach(e => {
        e.hidden = hide;
    });
}

function handleBookmarkGalleryDeleteClick(e, uniqueCardID) {
    e.stopPropagation();
    cancelBookmarkDrag(true);
    window.allBookmarksArchiveObj.deleteBookmarkForCardUniqueID(uniqueCardID, window.allBookmarksArchiveObj.selectedBookmarksListName());
    clearUpAfterBookmarkDeleteOrAdd();
    hideBookmarksEditButton(false);
}

function handleBookmarkGalleryDragClick(e, uniqueCardID) {
    e.stopPropagation();
    if (!!window.draggedBMCardUniqueID) cancelBookmarkDrag(true);
    else {
        window.draggedBMCardUniqueID = uniqueCardID;
        cancelBookmarkDrag(false);
    }
}

function handleBookmarkGalleryUpDownClick(e, uniqueCardID, action) {
    e.stopPropagation();
    if (!!window.draggedBMCardUniqueID) {
        window.allBookmarksArchiveObj.dragBookmarkToCardUniqueID(uniqueCardID, action);
        window.allBookmarksArchiveObj.setupBookmarksGallery();
        hideBookmarksEditButton(false);
        cancelBookmarkDrag(true);
    } else {
        window.allBookmarksArchiveObj.moveBookmarkForCardUniqueID(uniqueCardID, action);
        window.allBookmarksArchiveObj.setupBookmarksGallery();
        hideBookmarksEditButton(false);
        cancelBookmarkDrag(true);
    }
}

