/******************************************************************************
 * Copyright (c) 14/12/2021 10:7     djml.uk E&OE.                            *
 ******************************************************************************/

function createOptionForCardMenuWithCardObject(cardObj, selectcards, index, hideCardTitles) {
    let opt = document.createElement("option");
    opt.value = cardObj.uniqueCardID;
    opt.text = hideCardTitles ? "Image " + index : cardObj.title;
    opt.setAttribute(attr_cardUniqueID, cardObj.uniqueCardID);
    opt.setAttribute(attr_cardImagePath, cardObj.imagePath);
    opt.setAttribute(attr_cardAnswersText, cardObj.answersText);
    opt.setAttribute(attr_cardObject, JSON.stringify(cardObj));
    selectcards.appendChild(opt);
}

function handleWindowResize() {
    //setupWindowForFullScreen();
    adjustCardWidthHeight();
}

function adjustCardWidthHeight() {    // called on window resize and card-image onload
    // called on window resize and card-image onload
    const barsHeights =
        document.getElementById("toolbar-row1").getBoundingClientRect().height +
        document.getElementById("toolbar-row2").getBoundingClientRect().height
    const screenH = document.getElementById('div-mainpage').clientHeight;
    // DODGEROO -set the column heights to ensure scrolling is ok
    document.getElementById("row-image").style.height = (screenH - barsHeights) + "px";
}

function changeCardIndex(btn) {
    handleChangeCardIndex(btn.value)
}

function enablePrevNextBtnForSelectCard(selectcard) {
    const selChapt = document.getElementById("select-chapters");
    document.getElementById("btn_card-prev").disabled = changeChapterAuto === true ?
        selChapt.selectedIndex === 0 && selectcard.selectedIndex === 0 : selectcard.selectedIndex === 0;
    document.getElementById("btn_card-next").disabled = changeChapterAuto === true ?
        selChapt.selectedIndex === selChapt.options.length - 1 && selectcard.selectedIndex === selectcard.options.length - 1
        : selectcard.selectedIndex === selectcard.options.length - 1;
}

function handleChangeChapter(btnValue) {
    const selectChapter = document.getElementById("select-chapters");
    if (btnValue === nextValue) {
        if (selectChapter.selectedIndex + 1 < selectChapter.length) {
            selectChapter.selectedIndex += 1;
            populateSelectCardsOnChapterChange(btnValue);
        }
    } else {
        if (selectChapter.selectedIndex - 1 >= 0) {
            selectChapter.selectedIndex -= 1;
            populateSelectCardsOnChapterChange(btnValue);
        }
    }
}

function handleChangeCardIndex(btnValue) {
    let selcards = document.getElementById("select-cards");
    const curIndex = selcards.selectedIndex;
    if (btnValue === nextValue) {
        const newIndex = curIndex + 1;
        const numcards = selcards.options.length - 1;
        if (newIndex > numcards && changeChapterAuto === true) {
            handleChangeChapter(btnValue);
        } else document.getElementById("select-cards").selectedIndex = Math.min(numcards, newIndex);
    } else {
        const newIndex = curIndex - 1;
        if (newIndex < 0 && changeChapterAuto === true) {
            handleChangeChapter(btnValue);
        } else document.getElementById("select-cards").selectedIndex = Math.max(0, newIndex);
    }
    loadCardImage();
}

function handleSliderImageWidthChanged() {
    const slider = document.getElementById('slider-image-Width');
    // the slider can go to 88%, and we add 0 or 12% for the presence/absence of the side panel
    const colimage = document.getElementById("col-image");
    const divlegendouter = document.getElementById("div-legendouter");
    if (slider.value < sliderImageWidthMax) {
        divlegendouter.hidden = false;
        colimage.style.width = (parseInt(slider.value) + currentSliderIncrementForSidePanel) + '%';
        colimage.style.maxWidth = colimage.style.width;
        colimage.style.minWidth = colimage.style.width;
    } else {
        divlegendouter.hidden = true;
        const sliderMaxForSidePanel = (sliderImageWidthMax + currentSliderIncrementForSidePanel) + '%'
        colimage.style.width = sliderMaxForSidePanel;
        colimage.style.maxWidth = sliderMaxForSidePanel;
        colimage.style.minWidth = sliderMaxForSidePanel;
    }
    adjustCardWidthHeight();
}

function loadCardImage() {
    window.showingAllTargetIndex = -1;
    const selectcard = document.getElementById("select-cards");
    enablePrevNextBtnForSelectCard(selectcard);
    let selectedcardName = selectcard.value;
    imageDivsIDs.forEach(divimagecardID => {
        document.getElementById(divimagecardID).innerHTML = "";
    });
    if (selectedcardName.length > 0) {
        const selectedCardObj = JSON.parse(selectcard.selectedOptions[0].getAttribute(attr_cardObject));
        recordLastCardLoaded(selectedCardObj.uniqueCardID);
        addImagesForCardObj(selectedCardObj);
        addLegendArrayToDiv(selectedCardObj,document.getElementById("div-revealAnswers"),true);
        setStatusBtnsForCardUID(selectedCardObj.uniqueCardID);
        document.getElementById('div-labelClickLabels').hidden = false;
        document.getElementById('div-revealAnswers').classList.remove('divrevealAnswersNoBorder');
    } else {
        cll("no image", selectcard.value);
        document.getElementById('div-revealAnswers').innerHTML = "";
        document.getElementById('div-revealAnswers').classList.add('divrevealAnswersNoBorder');
        document.getElementById('div-labelClickLabels').hidden = true;
        clearStatusBtns();
    }
    adjustCardWidthHeight();
}

// function toggleImagesVisibility(btn, action) {
//     btn.blur();
//     imageDivsIDs.forEach(id => {
//         for (const img of document.getElementById(id).children) img.style.visibility = action
//     });
// }

function addImagesForCardObj(selectedCardObj) {
    resetTextFullScreen();
    cardImgNamesArray = selectedCardObj['imageNamesOrientsArray'];
    // const numImages = cardImgNamesArray.length;
    imageDivsIDs.forEach(divimagecardID => {
        for (const imageNameOrient of cardImgNamesArray) {
            //[0] is name "xxx yyy pX" [1] is orientation p or l
            const imageNameOrientArray = imageNameOrient.split("\t");
            const imgName = imageNameOrientArray[0];
            const dv = document.createElement('div');
            dv.className = "divImgFrame";
            dv.style.width = '100%';//numImages > 1 ? "45%" : "95%";
            dv.setAttribute('data-imgname', imgName);
            if (!!imgCaptionsObj && imgCaptionsObj[imgName]) {
                const capt = document.createElement('div');
                capt.className =  "imgCaption";
                capt.addEventListener("click", ev => divimgcardClicked(ev));
                capt.title = "Click to show/hide caption";
                const spn = document.createElement('span');
                spn.className = 'spanImgCaption';
                spn.hidden = initiallyHideCaptions;
                //spn.style.visibility = (initiallyHideCaptions ? 'hidden' : 'visible');
                spn.innerText = imgCaptionsObj[imgName];
                const spnClickme = document.createElement('span');
                spnClickme.className = 'spanImgCaptionClickme';
                spnClickme.hidden = !initiallyHideCaptions;
                //spnClickme.style.visibility = (!initiallyHideCaptions ? 'hidden' : 'visible');
                spnClickme.innerText = "Click to reveal title";
                capt.appendChild(spn);
                capt.appendChild(spnClickme);
                dv.appendChild(capt);
            }
            document.getElementById(divimagecardID).appendChild(dv);
            const newImg = document.createElement('img');
            const imgsrc = selectedCardObj.imagePath + imgName + selectedCardObj.imageType;
            if (!divimagecardID.includes("fullscreen")) {
                newImg.className = "paraImage";
            } else {
                const dvtext = document.createElement('div');
                dvtext.className = 'divFullscreenText'
                addLegendArrayToDiv(selectedCardObj,dvtext,false);
                dvtext.hidden = true;
                dv.appendChild(dvtext);
            }
            // put the image BELOW the text
            dv.appendChild(newImg);
            newImg.setAttribute('data-imgname', imgName);
            newImg.style.width = '100%';
            newImg.style.visibility = (initiallyHideImages ? 'hidden' : 'visible');
            newImg.src = imgsrc;
        }
    });
}

function divimgcardClicked(ev) {
    if (ev.target.className === 'paraImage') {
        const selectedCardObj = JSON.parse(document.getElementById("select-cards").selectedOptions[0].getAttribute(attr_cardObject));
        const indicsList = document.getElementById('carouselZoomImg-indicators');
        const carouselInner = document.getElementById('carouselZoomImg-inner');
        indicsList.innerHTML = "";
        carouselInner.innerHTML = "";
        cardImgNamesArray.forEach((imageNameOrient, indx) => {
            //[0] is name "xxx yyy pX" [1] is orientation p or l
            const imgName = imageNameOrient.split("\t")[0];
            const li = document.createElement('li');
            li.setAttribute('data-target', '#carouselZoomImg');
            li.setAttribute('data-slide-to', indx.toString());
            indicsList.appendChild(li);
            const dv = document.createElement('div');
            dv.className = "carousel-item";
            if (!!imgCaptionsObj && imgCaptionsObj[imgName]) {
                const capt = document.createElement('div');
                capt.classList.add("imgCaption");
                capt.title = "Click to show/hide caption";
                capt.addEventListener("click", ev => divimgcardClicked(ev));
                const spn = document.createElement('span');
                spn.className = 'spanImgCaption';
                spn.style.visibility = (initiallyHideCaptions ? 'hidden' : 'visible');
                spn.innerText = imgCaptionsObj[imgName];
                capt.appendChild(spn);
                dv.appendChild(capt);
            }
            carouselInner.appendChild(dv);
            const imgZoomClass = (imageNameOrient.split("\t")[1] === 'l') ? 'zoomImg' : 'zoomImgTall';
            const img = document.createElement('img');
            img.alt = "";
            img.classList.add(imgZoomClass);
            img.src = selectedCardObj.imagePath + imgName + selectedCardObj.imageType;
            dv.appendChild(img);
        });
        const clickedImgID = ev.target.getAttribute('data-imgname');
        const clickedIndex = Math.max(0, cardImgNamesArray.findIndex(e => e.startsWith(clickedImgID)));
        [indicsList, carouselInner].forEach(e => e.children[clickedIndex].classList.add('active'));
        hideSheetZoom(false);
    } else if (ev.target.className === 'imgCaption') {
        Array.from(ev.target.getElementsByClassName('spanImgCaption')).forEach(e=>e.toggleAttribute('hidden'));
        Array.from(ev.target.getElementsByClassName('spanImgCaptionClickme')).forEach(e=>e.toggleAttribute('hidden'));

        // ev.target.getElementsByClassName('spanImgCaption')[0].style.visibility =
        //     (ev.target.getElementsByClassName('spanImgCaption')[0].style.visibility === "visible" ? 'hidden' : 'visible');
        // ev.target.getElementsByClassName('spanImgCaptionClickme')[0].style.visibility =
        //     (ev.target.getElementsByClassName('spanImgCaptionClickme')[0].style.visibility === "visible" ? 'hidden' : 'visible');

        ev.preventDefault();
        ev.stopPropagation();
    }
}

function handleZoomOImgOrient(orient) {
    const carouselInner = document.getElementById('carouselZoomImg-inner');
    const image = carouselInner.getElementsByTagName('img')[0];
    if(orient === 'w') {
        image.classList.remove('zoomImgTall');
        image.classList.add('zoomImg');
    } else {
        image.classList.add('zoomImgTall');
        image.classList.remove('zoomImg');
    }
}

function loadCardWithUCID(ucid) {
    function findcardWithUICD() {
        for (const cardsetname of Object.keys(window.collectionobject.cardsetsObj)) {
            for (const chaptername of Object.keys(window.collectionobject.cardsetsObj[cardsetname].chaptersObj)) {
                for (const cardname of Object.keys(window.collectionobject.cardsetsObj[cardsetname].chaptersObj[chaptername].cardsObj)) {
                    if (cardname === ucid)
                        return window.collectionobject.cardsetsObj[cardsetname].chaptersObj[chaptername].cardsObj[cardname];
                }
            }
        }
        return null;
    }

    const cardObj = findcardWithUICD();
    if (!!cardObj) {
        loadCardByUniqueID(cardObj.uniqueCardID);
    }
}

function divgroupingsClicked(ev, hidesheet) {
    const ucid = ev.target.getAttribute('data-cardid');
    if (!!ucid) {
        loadCardWithUCID(ucid);
        if (hidesheet) hideSheet('sheet-groupings');
    }

}

function toggleSidebar() {
    const divsb = document.getElementById('div-species-sidebar');
    const sbbtn = document.getElementById('btn-sidebartoggle');
    divsb.hidden = !divsb.hidden;
    sbbtn.title = divsb.hidden ? "Show Diagnoses Index sidebar" : "Hide Diagnoses Index sidebar";
    if (divsb.hidden) {
        sbbtn.classList.remove('btn-outline-info');
        sbbtn.classList.add('btn-info');
        currentSliderIncrementForSidePanel = kSliderIncrementForSidePanelHidden;
    } else {
        sbbtn.classList.add('btn-outline-info');
        sbbtn.classList.remove('btn-info');
        currentSliderIncrementForSidePanel = kSliderIncrementForSidePanelVisible;
    }
    handleSliderImageWidthChanged();
}

function showTextFullScreen(btn) {
    elementsArrayForClassNameFromElementID("div-image-card-fullscreen",'divFullscreenText').forEach(el=>el.toggleAttribute('hidden'));
    if(btn.title.includes('Show')) {
        btn.title = 'Hide Text';
        btn.innerHTML = '<i class="fas fa-ellipsis-v fa-fw"></i>&nbsp;Hide&nbsp;Text';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-outline-secondary');
    } else {
        btn.title = 'Show Text';
        btn.innerHTML = '<i class="fas fa-list-ul fa-fw"></i>&nbsp;Show&nbsp;Text';
        btn.classList.add('btn-secondary');
        btn.classList.remove('btn-outline-secondary');
    }
}

function resetTextFullScreen() {
    elementsArrayForClassNameFromElementID("div-image-card-fullscreen",'divFullscreenText').forEach(el=>el.setAttribute('hidden','true'));

    elementsArrayForClassNameFromElementID("div-image-card-fullscreen",'spanImgCaption').forEach(el=>el.hidden = initiallyHideCaptions);
    elementsArrayForClassNameFromElementID("div-image-card-fullscreen",'spanImgCaptionClickme').forEach(el=>el.hidden = !initiallyHideCaptions);
    // elementsArrayForClassNameFromElementID("div-image-card-fullscreen",'spanImgCaption').forEach(el=>el.style.visibility = initiallyHideCaptions ? 'hidden' : 'visible');
    // elementsArrayForClassNameFromElementID("div-image-card-fullscreen",'spanImgCaptionClickme').forEach(el=>el.style.visibility = !initiallyHideCaptions ? 'hidden' : 'visible');

    const btn = document.getElementById('btn-showTextFullscreen');
    btn.title = 'Show Text';
    btn.innerHTML = '<i class="fas fa-list-ul fa-fw"></i>&nbsp;Show Text';
    btn.classList.add('btn-secondary');
    btn.classList.remove('btn-outline-secondary');
}