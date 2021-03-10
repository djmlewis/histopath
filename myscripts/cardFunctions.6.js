/******************************************************************************
 * Copyright (c) 10/3/2021 2:13     djml.uk E&OE.                             *
 ******************************************************************************/

function createOptionForCardMenuWithCardObject(cardObj, selectcards,index,hideCardTitles) {
    let opt = document.createElement("option");
    opt.value = cardObj.uniqueCardID;
    opt.text = hideCardTitles ? "Image "+index : cardObj.title;
    opt.setAttribute(attr_cardUniqueID, cardObj.uniqueCardID);
    opt.setAttribute(attr_cardImagePath, cardObj.imagePath);
    opt.setAttribute(attr_cardAnswersText, cardObj.answersText);
    opt.setAttribute(attr_cardObject, JSON.stringify(cardObj));
    selectcards.appendChild(opt);

}

/*
function forceImgFlip() {
    return document.getElementById("btn-flipThisImage").getAttribute("data-value") === flip_rotate;
}
function adjustSliderImageWidthValue(col_revealAsnwers, col_image) {
    const sliderimageWidth = document.getElementById("slider-image-Width");
    const sliderimageWidthValue = sliderimageWidth.value;
    /!* adjust col_image width restricting to max 9 if col-revealansw is hidden AT THE MO I set to zero always as the toolbar is outside*!/
    const toolbarFudge = document.getElementById("col-toolbar").hidden ? 0 : 0;
    col_image.className = col_revealAsnwers.hidden ?
        "col-" + (Math.max(1, sliderimageWidthValue - toolbarFudge)) :
        "col-" + (Math.min(Math.max(1, sliderimageWidthValue - toolbarFudge), window.setting_fullscreen ? imageWidthMaxWithLegendFullscreen : imageWidthMaxWithLegend));
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
*/

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
    if (!!window.cuidsAwaitingDownload) {
        const cuids = window.cuidsAwaitingDownload.cuids;
        const name = window.cuidsAwaitingDownload.name;
        window.cuidsAwaitingDownload = null;
        setTimeout(function () {
            preloadCardUIDarray(cuids, name);
        }, 2000);
    }
}

function handleWindowResize() {
    hideTargetIcon();
    setupWindowForFullScreen();
    adjustCardWidthHeight();
}



function adjustCardWidthHeight() {    // called on window resize and card-image onload
    // called on window resize and card-image onload
    const barsHeights=
        document.getElementById("toolbar-row1").getBoundingClientRect().height +
        document.getElementById("toolbar-row2").getBoundingClientRect().height +
        document.getElementById("div-statusbar").getBoundingClientRect().height;
    const screenH=document.getElementById('div-mainpage').clientHeight;
    // DODGEROO -set the column heights to ensure scrolling is ok
    document.getElementById("row-image").style.height = (screenH-barsHeights) + "px";
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
    const colimage = document.getElementById("col-image");
    colimage.style.width = slider.value+'%';
    colimage.style.maxWidth = colimage.style.width;
    colimage.style.minWidth = colimage.style.width;
    adjustCardWidthHeight();
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

/* ***************************** */

function loadCardImage() {
    hideTargetIcon();
    window.showingAllTargetIndex = -1;
    const selectcard = document.getElementById("select-cards");
    enablePrevNextBtnForSelectCard(selectcard);
    let selectedcardName = selectcard.value;
    const divimagecard = document.getElementById("div-image-card");
    divimagecard.innerHTML = "";
    if (selectedcardName.length > 0) {
        const selectedCardObj = JSON.parse(selectcard.selectedOptions[0].getAttribute(attr_cardObject));
        recordLastCardLoaded(selectedCardObj.uniqueCardID);
        addImagesForCardObj(selectedCardObj,divimagecard);
        addLegendArrayToDiv(selectedCardObj);
        setStatusBtnsForCardUID(selectedCardObj.uniqueCardID);
    } else {
        cll("no image",selectcard.value);
        clearStatusBtns();
    }
    adjustCardWidthHeight();
    clearSearchLegend();
}
function toggleImagesVisibility(btn,action) {
    btn.blur();
    for(const img of document.getElementById("div-image-card").children) img.style.visibility = action;
}

function addImagesForCardObj(selectedCardObj,divimagecard){
    const numImages = selectedCardObj['imageNamesOrientsArray'].length;
    cardImgNamesArray = selectedCardObj['imageNamesOrientsArray'];
    for(const imageNameOrient of cardImgNamesArray) {
        //[0] is name "xxx yyy pX" [1] is orientation p or l
        const imageNameOrientArray=imageNameOrient.split("\t");
        const imgName = imageNameOrientArray[0];
        const dv=document.createElement('div');
        dv.className="divImgFrame";
        dv.style.width= numImages>1 ? "45%" : "95%";
        dv.setAttribute('data-imgname',imgName);
        if(!!imgCaptionsObj && imgCaptionsObj[imgName]) {
            const capt = document.createElement('div');
            capt.className = "imgCaption";
            capt.title="Click to show/hide caption";
            const spn = document.createElement('span');
            spn.className='spanImgCaption';
            spn.style.visibility=(initiallyHideCaptions ? 'hidden':'visible');
            spn.innerText=imgCaptionsObj[imgName];
            capt.appendChild(spn);
            dv.appendChild(capt);
        }
        divimagecard.appendChild(dv);
        const newImg = document.createElement('img');
        const imgsrc = selectedCardObj.imagePath+imgName+selectedCardObj.imageType;
        dv.appendChild(newImg);
        newImg.setAttribute('data-imgname',imgName);
        newImg.className = "paraImage";
        newImg.style.width= '100%';
        newImg.style.visibility=(initiallyHideImages ? 'hidden':'visible');
        newImg.src = imgsrc;
    }
}

function divimgcardClicked(ev) {
    if(ev.target.className==='paraImage') {
        const selectedCardObj = JSON.parse(document.getElementById("select-cards").selectedOptions[0].getAttribute(attr_cardObject));
        const indicsList=document.getElementById('carouselZoomImg-indicators');
        const carouselInner=document.getElementById('carouselZoomImg-inner');
        indicsList.innerHTML="";
        carouselInner.innerHTML="";
        for(const imageNameOrient of cardImgNamesArray) {
            //[0] is name "xxx yyy pX" [1] is orientation p or l
            const imgName = imageNameOrient.split("\t")[0];
            const li=document.createElement('li');
            li.setAttribute('data-target','#carouselZoomImg');
            li.setAttribute('data-slide-to','0');
            indicsList.appendChild(li);
            const dv=document.createElement('div');
            dv.className="carousel-item";
            if(!!imgCaptionsObj && imgCaptionsObj[imgName]) {
                const capt = document.createElement('div');
                capt.classList.add("imgCaption");
                capt.title="Click to show/hide caption";
                capt.addEventListener("click", ev => divimgcardClicked(ev));
                const spn = document.createElement('span');
                spn.className='spanImgCaption';
                spn.style.visibility=(initiallyHideCaptions ? 'hidden':'visible');
                spn.innerText=imgCaptionsObj[imgName];
                capt.appendChild(spn);
                dv.appendChild(capt);
            }
            carouselInner.appendChild(dv);
            const img=document.createElement('img');
            img.alt="";
            img.className='d-block w-100';
            img.src=selectedCardObj.imagePath+imgName+selectedCardObj.imageType;
            dv.appendChild(img);
        }
        const clickedImgID = ev.target.getAttribute('data-imgname');
        const clickedIndex = Math.max(0,cardImgNamesArray.findIndex(e=>e.startsWith(clickedImgID)));
        [indicsList,carouselInner].forEach(e=>e.children[clickedIndex].classList.add('active'));
        showSheet('sheet-zoom');
    }  else if(ev.target.className==='imgCaption') {
        ev.target.getElementsByClassName('spanImgCaption')[0].style.visibility =
            (ev.target.getElementsByClassName('spanImgCaption')[0].style.visibility==="visible" ? 'hidden' : 'visible');
        ev.preventDefault();
        ev.stopPropagation();
    }
}