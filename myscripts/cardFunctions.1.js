/******************************************************************************
 * Copyright (c) 15/2/2021 3:3     djml.uk E&OE.                              *
 ******************************************************************************/

function createOptionForCardMenuWithCardObject(cardObj, selectcards) {
    let opt = document.createElement("option");
    opt.value = cardObj.uniqueCardID;
    opt.text = cardObj.title;
    opt.setAttribute(attr_cardUniqueID, cardObj.uniqueCardID);
    opt.setAttribute(attr_cardImagePath, cardObj.imagePath);
    opt.setAttribute(attr_cardAnswersText, cardObj.answersText);
    opt.setAttribute(attr_cardObject, JSON.stringify(cardObj));
    selectcards.appendChild(opt);

}

function forceImgFlip() {
    return document.getElementById("btn-flipThisImage").getAttribute("data-value") === flip_rotate;
}

function btnFlipThisImageOriginal() {
    setFlipBtnsToValue(flip_original);
}

function setFlipBtnsToValue(newVal) {
    ["btn-flipThisImage-maximise", "btn-flipThisImage", "btn-flipThisImage-toolbox", "btn-flipThisImage-dropdown"].forEach(id =>
        document.getElementById(id).setAttribute("data-value", newVal));
}

function handleBtnFlipThisImageClicked(btn) {
    setFlipBtnsToValue(btn.getAttribute("data-value") === flip_original ? flip_rotate : flip_original);
    loadCardImage();
    //we no longer reload the card src so we must adjustCardWidthHeight manually
    adjustCardWidthHeight();
}

function handleCardImageLoad() {
    adjustCardWidthHeight();
    handleCoordsWaitingToBeTargetted();
    if (!!window.cuidsAwaitingDownload) {
        const cuids = window.cuidsAwaitingDownload.cuids;
        const name = window.cuidsAwaitingDownload.name;
        window.cuidsAwaitingDownload = null;
        setTimeout(function () {
            preloadCardUIDarray(cuids, name);
        }, 2000);
    }
    updateSVGdoodlesOnCardImageLoad();
}

function handleWindowResize() {
    hideTargetIcon();
    setupWindowForFullScreen();
    adjustCardWidthHeight();
}

/*
function loadCardImage() {
    hideTargetIcon();
    let selectcard = document.getElementById("select-cards");
    enablePrevNextBtnForSelectCard(selectcard);
    let selectedcardName = selectcard.value;
    let cardimage = window.imageCard; // getImageCardInIframe();
    if (selectedcardName.length > 0) {
        const selectedCardObj = JSON.parse(selectcard.selectedOptions[0].getAttribute(attr_cardObject));
        recordLastCardLoaded(selectedCardObj.uniqueCardID);
        setupRotateThisImageBtnForCard(selectedCardObj);
        // when loading favourites we may be viewing cards not in the currently selected cardset
        const forceFlip = document.getElementById("btn-flipThisImage").value === flip_rotate;
        if (window.setting_ForceOrientation === forceOrientation_none) {
            // use imagePath unles force flip
            cardimage.src = forceFlip ? selectedCardObj.imagePathRotated : selectedCardObj.imagePath;
            assignSetting_cardIsRotated(forceFlip);
        } else if ((window.setting_ForceOrientation === forceOrientation_portrait && selectedCardObj.orient === orientation_portrait) ||
            (window.setting_ForceOrientation === forceOrientation_landscape && selectedCardObj.orient === orientation_landscape)) {
            // original and forced match so use imagePath unles force flip
            cardimage.src = forceFlip ? selectedCardObj.imagePathRotated : selectedCardObj.imagePath;
            assignSetting_cardIsRotated(forceFlip);
        } else {
            // original and forced do not match so use imagePathRotated unles force flip
            cardimage.src = forceFlip ? selectedCardObj.imagePath : selectedCardObj.imagePathRotated;
            assignSetting_cardIsRotated(!forceFlip);
        }

        setPopupLabel("", true);

        // hotspots //
        document.getElementById("prepend-playLabels").hidden=!!!selectedCardObj.hotspots;
        //card hotspot handlers
        Array.from(document.getElementsByClassName("icon-hotspotsIcon-available")).forEach((icon) => {
            icon.hidden = !!selectedCardObj.hotspots === false;
        });
        if (!!selectedCardObj.hotspots) {
            cardimage.onclick = function (e) {
                handleCardClick(e, selectedCardObj);
            };
            cardimage.onmousemove = function (e) {
                handleCardMouseMove(e, selectedCardObj);
            };
        } else {
            cardimage.onclick = undefined;
            cardimage.onmousemove = undefined;
        }
        createAnswerButtonsForCardObject(selectedCardObj);
        // update the reveal all button
        updateRevealLegendButtonForCardObj(selectedCardObj);
        // update the bookmark button
        updateBookmarkButton(selectedCardObj);
        updateTopicsButton(selectedCardObj);

        // update the additional title even if we dont see it
        const titleAndNoteArray = titleAndNoteForCardObj(selectedCardObj);
        document.getElementById("h-cardTitle").innerHTML = titleAndNoteArray[0];
        document.getElementById("h-cardNote").innerHTML = titleAndNoteArray[1];
        document.getElementById("h-cardNote").hidden= titleAndNoteArray[1].length===0;

        setupAvatars(selectedCardObj.avatars);
    } else {
        // update the additional title even if we dont see it
        document.getElementById("h-cardTitle").innerHTML = "";

        cardimage.src = "";
        clearAllAnswerButtons();
        setupAvatars(undefined);
    }
    clearSearchLegend();
}
*/

/*
function adjustCardWidthHeight() {

    // called on window resize and card-image onload
    const cardimage = window.imageCard;
    const col_revealAsnwers = document.getElementById("col-revealAnswers");
    const col_image = document.getElementById("col-image");
    const pad = 0; // pad should match col-image margin-left
    const pad_v = 24;

    // adjust col_image width //
    adjustSliderImageWidthValue(col_revealAsnwers, col_image);

    //ww and wh not affected by rtn
    let ww = col_image.getBoundingClientRect().width - pad;
    const wh = window.innerHeight - col_image.getBoundingClientRect().top - pad_v;

    //style="transform: rotate(-90deg); transform-origin:  center;"

    //inh and inw unaffected by rotation
    const inh = cardimage.naturalHeight;
    const inw = cardimage.naturalWidth;

    const hwRatio = inh / inw;

    const widthUsingWheight = wh / hwRatio;
    const heightUsingWwidth = ww * hwRatio;

    // DODGEROO -set the column heights to ensure scrolling is ok
    col_revealAsnwers.style.height = wh + "px";
    col_image.style.height = wh + "px";
    col_image.style.overflowY = "auto";
    col_image.style.overflowX = "hidden";
    //this is weird and a bit brutal but only way to redraw the scrollbars and stop darkMode disappearing
    if (window.setting_modeDarkLight === modeDark) col_image.classList.add("scrollerDark");
    else col_image.classList.remove("scrollerDark");

    if (window.setting_imageFit === imageFitPage) {
        if (widthUsingWheight <= ww) {
            // use height as width fits
            cardimage.setAttribute("height", wh + "px");
            cardimage.setAttribute("width", widthUsingWheight + "px");
            cardimage.style.position = "absolute";
            cardimage.style.left = ((ww - widthUsingWheight) / 2).toString() + "px";
        } else {
            // use width as height fits
            cardimage.setAttribute("height", heightUsingWwidth + "px");
            cardimage.setAttribute("width", ww + "px");
            cardimage.style.position = "absolute";
            cardimage.style.left = "0px";
        }
        col_image.style.overflowY = "hidden";
    } else {
        // use width plus a pad for scroll bar when height overflowsand allow height to overflow
        cardimage.setAttribute("height", "");
        cardimage.setAttribute("width", (ww - 20) + "px");//-20 as scrollbar will appear for height>wh!!
        cardimage.style.position = "absolute";
        cardimage.style.left = "0px";
        col_image.style.overflowY = "auto";
    }
}
*/

function adjustSliderImageWidthValue(col_revealAsnwers, col_image) {
    const sliderimageWidth = document.getElementById("slider-image-Width");
    const sliderimageWidthValue = sliderimageWidth.value;
    /* adjust col_image width restricting to max 9 if col-revealansw is hidden AT THE MO I set to zero always as the toolbar is outside*/
    const toolbarFudge = document.getElementById("col-toolbar").hidden ? 0 : 0;
    col_image.className = col_revealAsnwers.hidden ?
        "col-" + (Math.max(1, sliderimageWidthValue - toolbarFudge)) :
        "col-" + (Math.min(Math.max(1, sliderimageWidthValue - toolbarFudge), window.setting_fullscreen ? imageWidthMaxWithLegendFullscreen : imageWidthMaxWithLegend));
}

function loadCardImage() {
    hideTargetIcon();
    window.showingAllTargetIndex = -1;
    let selectcard = document.getElementById("select-cards");
    enablePrevNextBtnForSelectCard(selectcard);
    let selectedcardName = selectcard.value;
    let cardimage = window.imageCard; // getImageCardInIframe();
    const existingSrc = cardimage.src;
    cardimage.style.transform = "none";
    cardimage.style.transformOrigin = "50% 50%";

    if (selectedcardName.length > 0) {
        const selectedCardObj = JSON.parse(selectcard.selectedOptions[0].getAttribute(attr_cardObject));
        // could adjustwindowwidthsize auto if(lastCardLoadedUniqueID()===selectedCardObj.uniqueCardID);
        recordLastCardLoaded(selectedCardObj.uniqueCardID);
        // when loading favourites we may be viewing cards not in the currently selected cardset
        if (window.setting_ForceOrientation === forceOrientation_none) {
            // use imagePath unles force flip
            cardimage.src = selectedCardObj.imagePath;//forceFlip ? selectedCardObj.imagePathRotated : selectedCardObj.imagePath;
            assignSetting_cardIsRotated(forceImgFlip());
        } else if ((window.setting_ForceOrientation === forceOrientation_portrait && selectedCardObj.orient === orientation_portrait) ||
            (window.setting_ForceOrientation === forceOrientation_landscape && selectedCardObj.orient === orientation_landscape)) {
            // original and forced match so use imagePath unles force flip
            cardimage.src = selectedCardObj.imagePath;//forceFlip ? selectedCardObj.imagePathRotated : selectedCardObj.imagePath;
            assignSetting_cardIsRotated(forceImgFlip());
        } else {
            // original and forced do not match so use imagePathRotated unles force flip
            cardimage.src = selectedCardObj.imagePath;//forceFlip ? selectedCardObj.imagePath : selectedCardObj.imagePathRotated;
            assignSetting_cardIsRotated(!forceImgFlip());
        }

        setPopupLabel("", true);

        // hotspots //
        document.getElementById("prepend-playLabels").hidden = !!!selectedCardObj.hotspots;
        //card hotspot handlers
        Array.from(document.getElementsByClassName("icon-hotspotsIcon-available")).forEach((icon) => {
            icon.hidden = !!selectedCardObj.hotspots === false;
        });
        if (!!selectedCardObj.hotspots) {
            cardimage.onclick = function (e) {
                handleCardClick(e, selectedCardObj);
            };
            cardimage.onmousemove = function (e) {
                handleCardMouseMove(e, selectedCardObj);
            };
        } else {
            cardimage.onclick = undefined;
            cardimage.onmousemove = undefined;
        }
        // createAnswerButtonsForCardObject() also calls addLegendArrayToDiv(selectedCardObj)
        createAnswerButtonsForCardObject(selectedCardObj);
        // update the reveal all button
        updateRevealLegendButtonForCardObj(selectedCardObj);
        // update the bookmark button
        updateBookmarkButton(selectedCardObj);
        updateTopicsButton(selectedCardObj);

        // update the additional title even if we dont see it
        const titleAndNoteArray = titleAndNoteForCardObj(selectedCardObj);
        document.getElementById("div-cardTitle").innerHTML = titleAndNoteArray[0];
        document.getElementById("h-cardNote").innerHTML = titleAndNoteArray[1];
        document.getElementById("h-cardNote").hidden = titleAndNoteArray[1].length === 0;

        setupAvatars(selectedCardObj.avatars);
        updateNotesForCardObj(selectedCardObj);
        updatePostitsRecordForCardObjOnLoad(selectedCardObj);
        // if we reload the same image, the onload function handleCardImageLoad()is not called so we have to manually call updateSVGdoodlesOnCardImageLoad
        if (existingSrc === cardimage.src) updateSVGdoodlesOnCardImageLoad();
        else clearSVGdoodlesOnCardLoad();
    } else {
        cll("no image",selectcard.value);
        // update the additional title even if we dont see it
        document.getElementById("div-cardTitle").innerHTML = "";
        cardimage.src = "";
        clearAllAnswerButtons();
        setupAvatars(undefined);
        resetSideBarForCardUniqueID(undefined);
        clearSVGdoodlesOnCardLoad();
        updatePostitsRecordForCardObjOnLoad(undefined);
        adjustCardWidthHeight();
    }
    clearSearchLegend();
}

function adjustCardWidthHeight() {    // called on window resize and card-image onload
    // called on window resize and card-image onload
    const cardimage = window.imageCard;
    const div_cardimage = document.getElementById("div-image-card");
    const col_revealAsnwers = document.getElementById("col-revealAnswers");
    const col_image = document.getElementById("col-image");
    const pad = 0; // pad should match col-image margin-left
    const pad_v = 24;

    cardimage.style.transform = "none";
    cardimage.style.transformOrigin = "50% 50%";
    // cardimage.style.webkitTransform = "none";
    // cardimage.style.webkitTransformOrigin = "50% 50%";

    // adjust col_image width //
    adjustSliderImageWidthValue(col_revealAsnwers, col_image);

    //ww and wh not affected by rtn
    let ww = col_image.getBoundingClientRect().width - pad;
    const wh = window.innerHeight - col_image.getBoundingClientRect().top - pad_v;


    //inh and inw unaffected by rotation
    const inh = cardimage.naturalHeight;
    const inw = cardimage.naturalWidth;

    const hwRatio = inh / inw;

    const widthUsingWheight = wh / hwRatio;
    const whhwR = wh * hwRatio;

    // DODGEROO -set the column heights to ensure scrolling is ok
    col_revealAsnwers.style.height = wh + "px";
    col_image.style.height = wh + "px";
    col_image.style.overflowY = "auto";
    col_image.style.overflowX = "hidden";
    //this is weird and a bit brutal but only way to redraw the scrollbars and stop darkMode disappearing
    if (window.setting_modeDarkLight === modeDark) col_image.classList.add("scrollerDark");
    else col_image.classList.remove("scrollerDark");

    if (window.setting_imageFit === imageFitPage) {
        if (setting_cardIsRotatedIsTrue()) {
            if (whhwR <= ww) {
                cardimage.height = whhwR;
                cardimage.width = wh;
                cardimage.style.position = "absolute";
                cardimage.style.left = ((ww - whhwR) / 2).toString() + "px";
            } else {
                const wwhwR = ww / hwRatio;
                cardimage.height = ww;
                cardimage.width = wwhwR;
                cardimage.style.position = "absolute";
                cardimage.style.left = "0px";
            }
            cardimage.style.transformOrigin = setting_cardIsRotatedIsTrue() ? "top left" : "50% 50%";
            cardimage.style.transform = setting_cardIsRotatedIsTrue() ? "translate(0," + cardimage.width + "px) rotate(-90deg)" : "none";
            // cardimage.style.webkitTransform=setting_cardIsRotatedIsTrue() ? "translate(0," + cardimage.width + "px) rotate(-90deg)" : "none";
            // cardimage.style.webkitTransformOrigin = setting_cardIsRotatedIsTrue() ? "top left" : "50% 50%";
        } else {
            if (widthUsingWheight <= ww) {
                // set height to wh as width fits
                cardimage.height = wh;
                cardimage.width = widthUsingWheight;
                cardimage.style.position = "absolute";
                cardimage.style.left = ((ww - widthUsingWheight) / 2).toString() + "px";
            } else {
                // set width to ww as height fits
                cardimage.height = ww * hwRatio;
                cardimage.width = ww;
                cardimage.style.position = "absolute";
                cardimage.style.left = "0px";
            }
        }
        col_image.style.overflowY = "hidden";
        div_cardimage.style.height = "";
    } else {
        cardimage.style.position = "absolute";
        cardimage.style.left = "0px";
        // use width plus a pad for scroll bar when height overflowsand allow height to overflow
        // set img element properties not attribs to enforce dimesions between states and avoid confusions
        // calculate exact sizes using hwRatio
        cardimage.height = setting_cardIsRotatedIsTrue() ? (ww - 20) : (ww - 20) * hwRatio;//-20 as scrollbar will appear for height>wh!!
        cardimage.width = setting_cardIsRotatedIsTrue() ? (ww - 20) / hwRatio : (ww - 20);
        cardimage.style.transformOrigin = setting_cardIsRotatedIsTrue() ? "top left" : "50% 50%";
        cardimage.style.transform = setting_cardIsRotatedIsTrue() ? "translate(0," + cardimage.width + "px) rotate(-90deg)" : "none";
        // cardimage.style.webkitTransform=setting_cardIsRotatedIsTrue() ? "translate(0," + cardimage.width + "px) rotate(-90deg)" : "none";
        // cardimage.style.webkitTransformOrigin = setting_cardIsRotatedIsTrue() ? "top left" : "50% 50%";
        div_cardimage.style.height = setting_cardIsRotatedIsTrue() ? cardimage.width + "px" : "";
        col_image.style.overflowY = "auto";
    }
    adjustDivPostitsSize(cardimage);
    adjustSVGdoodlesSize(cardimage);
}

function hideLegendIfAppropriate() {
    //if (window.setting_legendautohide === legendHideAuto) document.getElementById("col-revealAnswers").hidden = true;
}

function changeCardIndex(btn) {
    handleChangeCardIndex(btn.value)
}

function enablePrevNextBtnForSelectCard(selectcard) {
    const selChapt = document.getElementById("select-chapters");
    ["btn_card-prev", "btn_card-prev-toolbox", "btn_card-prev-dropdown"].forEach(b => {
        document.getElementById(b).disabled = window.changeChapterAuto === true ? selChapt.selectedIndex === 0 && selectcard.selectedIndex === 0 : selectcard.selectedIndex === 0;
    });
    ["btn_card-next", "btn_card-next-toolbox", "btn_card-next-dropdown"].forEach(b => {
        document.getElementById(b).disabled = window.changeChapterAuto === true ? selChapt.selectedIndex === selChapt.options.length - 1 && selectcard.selectedIndex === selectcard.options.length - 1
            : selectcard.selectedIndex === selectcard.options.length - 1;
    });
    document.getElementById("btn-prev-maximise").style.visibility = window.changeChapterAuto === true ? selChapt.selectedIndex === 0 && selectcard.selectedIndex === 0 ? 'hidden' : 'visible'
        : selectcard.selectedIndex === 0 ? 'hidden' : 'visible';
    document.getElementById("btn-next-maximise").style.visibility = window.changeChapterAuto === true ? selChapt.selectedIndex === selChapt.options.length - 1 && selectcard.selectedIndex === selectcard.options.length - 1 ? 'hidden' : 'visible'
        : selectcard.selectedIndex === selectcard.options.length - 1 ? 'hidden' : 'visible';
}

function handleChangeChapter(btnValue) {
    const selectChapter = document.getElementById("select-chapters");
    if (btnValue === nextValue) {
        if (selectChapter.selectedIndex + 1 < selectChapter.length) {
            selectChapter.selectedIndex += 1;
            alignSelectChapters();
            populateSelectCardsOnChapterChange(btnValue);
        } else blinkElementHashID("#image-card");
    } else {
        if (selectChapter.selectedIndex - 1 >= 0) {
            selectChapter.selectedIndex -= 1;
            alignSelectChapters();
            populateSelectCardsOnChapterChange(btnValue);
        } else blinkElementHashID("#image-card");
    }
}

function alignSelectChapters() {
    document.getElementById("select-chapters-toolbox").selectedIndex = document.getElementById("select-chapters").selectedIndex;
    document.getElementById("select-chapters-dropdown").selectedIndex = document.getElementById("select-chapters").selectedIndex;
}

function handleChangeCardIndex(btnValue) {
    btnFlipThisImageOriginal();
    hideLegendIfAppropriate();
    let selcards = document.getElementById("select-cards");
    // let selcardstoolbox = document.getElementById("select-cards-toolbox");
    const curIndex = selcards.selectedIndex;
    if (btnValue === nextValue) {
        const newIndex = curIndex + 1;
        const numcards = selcards.options.length - 1;
        if (newIndex > numcards && window.changeChapterAuto === true) {
            handleChangeChapter(btnValue);
        } else {
            if (newIndex > numcards) blinkElementHashID("#image-card");
            alignSelectsToSelIndex(["select-cards", "select-cards-toolbox", "select-cards-dropdown"], Math.min(numcards, newIndex));
            // selcards.selectedIndex = Math.min(numcards, newIndex);
            // selcardstoolbox.selectedIndex = Math.min(numcards, newIndex);
        }
    } else {
        const newIndex = curIndex - 1;
        if (newIndex < 0 && window.changeChapterAuto === true) {
            handleChangeChapter(btnValue);
        } else {
            if (newIndex < 0) blinkElementHashID("#image-card");
            alignSelectsToSelIndex(["select-cards", "select-cards-toolbox", "select-cards-dropdown"], Math.max(0, newIndex));
            // selcards.selectedIndex = Math.max(0, newIndex);
            // selcardstoolbox.selectedIndex = Math.max(0, newIndex);
        }
    }
    cardFaceShowing = frontFace;
    loadCardImage();
}

function handleCardMouseMove(e, selectedcardoject) {
    const revealHotspot = window.setting_hotspotLabelsAppear === hotspotOnHover ? hotspotOnHover : hotspotOnClick;
    if (clickIsInHotspot(e, selectedcardoject, revealHotspot)) document.body.style.cursor = "help";
    else {
        document.body.style.cursor = "auto";
        setPopupLabel("", true);
    }
}

function handleCardClick(e, selectedcardoject) {
    //let imcard = window.imageCard; // getImageCardInIframe();
    //cll("X "+e.offsetX+"  Y "+e.offsetY);
    if (clickIsInHotspot(e, selectedcardoject, "click")) {
        e.stopPropagation();
    }
}

function handleCardDblClick(ev) {
    if (!!ev) {
        ev.stopPropagation();
        ev.preventDefault();
        //dblclick the col-image and it selects the image with a blue box, so deselect
        document.getSelection().removeAllRanges();
    }
    //its possible to double-tap when the toolbar is hidden which messes-up the toggle state
    //so if one of the toolbar show buttons is visible, click it first to reset the situation and then proceed
    if (document.getElementById("btn-showToolbox-h").hidden === false) document.getElementById("btn-showToolbox-h").click();
    if (document.getElementById("btn-showToolbox-v").hidden === false) document.getElementById("btn-showToolbox-v").click();

    document.getElementById("div-maximiseIcons").toggleAttribute("hidden");
    // toolboxV H means we show the col as we toggle out of fullscreen
    if (window.setting_fullscreen === true) {
        document.getElementById("col-toolbar").hidden = window.setting_toolbox === toolboxH;
        document.getElementById("div-toolbox-h").hidden = window.setting_toolbox === toolboxV;
    }
    // we are entering full screen so we hide it
    else {
        document.getElementById("col-toolbar").hidden = true;
        document.getElementById("div-toolbox-h").hidden = true;
        // force hide the legend so it can reappear with wider column if needed
        document.getElementById("col-revealAnswers").hidden = true;
    }
    loadCardImage();
    //     adjustCardWidthHeight(); comes after loadcardimage as no change in src now
    adjustCardWidthHeight();
    // toggle
    window.setting_fullscreen = !window.setting_fullscreen;
}

function handleSliderImageWidthChanged(slider) {
    // bring the sliders into alignment. can't harm to reassign hte event target saves an if else
    document.getElementById("slider-image-Width").value = slider.value;
    document.getElementById("slider-image-Width-toolbox").value = slider.value;
    document.getElementById("slider-image-Width-dropdown").value = slider.value;
    hideTargetIcon();
    adjustCardWidthHeight();
}


function setupAvatars(avatarsStr) {
    //dont show/hide as this is done by the checkbox
    elementsArrayForClassName("div-avatars-img").forEach(e => {
        e.innerHTML = "";
        if (avatarsStr !== undefined) {
            for (let i = 0; i < avatarsStr.length; i++) {
                const avatar = document.createElement('img');
                avatar.src = "img/avatars/" + avatarsStr.charAt(i) + ".png";
                avatar.alt = "";
                avatar.title = !!window.avatarsTitlesObj[avatarsStr.charAt(i)] ? window.avatarsTitlesObj[avatarsStr.charAt(i)] : "";
                e.appendChild(avatar);
            }
        }
    });
}

function hideVHToolbars(s) {
    $("#dropdown-tools").dropdown('hide');
    document.getElementById("col-dropdown-tools").toggleAttribute("hidden");
    document.getElementById(s === "v" ? "col-toolbar" : "div-toolbox-h").toggleAttribute("hidden");
    document.getElementById("btn-showToolbox-" + s).toggleAttribute("hidden");
    handleWindowResize();
    localStorage.setItem(ls_toolboxMenuHidden, document.getElementById("col-dropdown-tools").hidden.toString());
}

// =================================== Thumbs
function addThumbsToCardsSets() {
    Object.keys(window.collectionobject.cardsetsObj).forEach(k => {
        const cardset = window.collectionobject.cardsetsObj[k];
        if (!!cardset.version) {
            if (locationType() !== runningLocalFile) {
                if (window.Worker) {
                    const getTextWorker = newTextWorker();
                    getTextWorker.onmessage = (e) => {
                        if (e.data.length > 0) window.collectionobject.cardsetsObj[k].thumbs = e.data
                    };
                    getTextWorker.postMessage('collections/' + cardset.shortName + "_thumbs." + cardset.version + ".html");
                } else {
                    fetch('collections/' + cardset.shortName + "_thumbs." + cardset.version + ".html")
                        .then(response => response.text())
                        .then(text => window.collectionobject.cardsetsObj[k].thumbs = text);
                }
            } else {
                loadLocalScript(k + "_thumbs",
                    "collections/" + cardset.shortName + "_thumbs." + cardset.version + ".js");
            }
        }
    })
}

function validUniqueCardIDwithSplitter(uniqueCardID, splitter) {
    const idArray = uniqueCardID.split(splitter);
    return !!window.collectionobject.cardsetsObj[idArray[0]] &&
        !!window.collectionobject.cardsetsObj[idArray[0]].chaptersObj[idArray[1]] &&
        !!window.collectionobject.cardsetsObj[idArray[0]].chaptersObj[idArray[1]].cardsObj[idArray[2]];
}

function getCardObjFromUniqueCardIDwithSplitter(uniqueCardID, splitter) {
    if(validUniqueCardIDwithSplitter(uniqueCardID, splitter)) {
        //cardsUniqueIDIndex is a 3 or 5-column § array cardset-chapt-title; possiblt with label index as 4th [3], and cards unique index as 5th item [4]
        const idArray = uniqueCardID.split(splitter);
        return window.collectionobject.cardsetsObj[idArray[0]].chaptersObj[idArray[1]].cardsObj[idArray[2]];
    } else return null;
}

function toggleNoteVisibility(note) {
    note.toggleAttribute('hidden');
}

function setupFSbutton() {
    const rfs = document.body.requestFullscreen || document.body.webkitRequestFullscreen || document.body.mozRequestFullscreen || document.body.msRequestFullscreen;
    for(const btn of document.getElementsByClassName('hideBrowserBtn')) {btn.hidden = !rfs}
}

function toggleBrowserVisible(btn) {
    btn.blur();
    const inFS = !!document.fullscreenElement || !!document.webkitFullscreenElement;
    if(inFS) {
        const xfs = document.exitFullscreen || document.webkitExitFullscreen;
        if(!!xfs) xfs.call(document);
    } else {
        const rfs = document.body.requestFullscreen || document.body.webkitRequestFullscreen || document.body.mozRequestFullscreen || document.body.msRequestFullscreen;
        if(!!rfs) rfs.call(document.body);
    }
}

function setupWindowForFullScreen() {
    // only iPads need the padding for status bar. Safari only respond to webkitFullscreenElement. unfortunatly cant stop it adding on Safari Mac
    if(!document.fullscreenElement && !!document.webkitFullscreenElement) {
        document.getElementById('div-mainpage').classList.add('fullScreenMode');
    } else {
        document.getElementById('div-mainpage').classList.remove('fullScreenMode');
    }
}

function toggleCardTitle() {
    ["div-cardTitle-placeholder","div-cardTitle"].forEach(e=>{document.getElementById(e).toggleAttribute("hidden")});

}