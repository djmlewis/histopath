/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/

//================= STARTUP
function applySettingsAtStartup() {
    //if (!localStorage.getItem(ls_history)) localStorage.setItem(ls_history, JSON.stringify([]));
    //loadLastCardLoaded();
//     loadLastCardLoaded() must be first
/*    setupToolboxAtStartup();
    setupModeDarkLightAtStartup();
    setupImageFitAtStartup();
    setupTextSizeAtStartup();
    setupTestButtonsShowHideAtStartup();
    setupHideLegendAtStartup();
    setupLegendLabelsAppearAtStartup();
    setupHotspotLabelsAppearAtStartup();
    setupLanguageAtStartup();
    setupAvatarsShownAtStartup();
    setupOrientationAtStartup();
    //setupHelpAtStartup();
    setupLabelsPlayAtStartup();
    setupChangeChapterAutoAtStartup();
    setupCardsSizeAtStartup();
    setupCheckboxPreloadImagesAtStartup();*/
}

//================= MODAL
function showSettingsModal(toolbar) {
    if(toolbar==='dropdown') $('#dropdown-tools').dropdown('hide');
    if (toolbar==='toolbar') {
        toggleActionmenuToolbar();
        setTimeout(function () {
            showSheet("sheet-settings");
        }, 500);
    } else showSheet("sheet-settings");
}

function handleSettings_Clicked(btn) {
    /* use btn.id */
    if (btn.id.startsWith("image")) handleSettings_imageSizeClicked(btn.id);
    if (btn.id.startsWith("text")) handleSettings_textSizeClicked(btn.id);
    if (btn.id.startsWith("legendHide")) handleSettings_legendHideAutoClicked(btn.id);
    if (btn.id.startsWith("legendAppears")) handleSettings_legendLabelsAppearClicked(btn.id);
    if (btn.id.startsWith("hotspot")) handleSettings_hotspotLabelsAppearClicked(btn.id);
    if (btn.id.startsWith("lang")) handleSettings_languageClicked(btn.id);
    if (btn.id.startsWith("expand")) switchToolboxesVH();
    if (btn.id.startsWith("force")) handleSettings_OrientationClicked(btn.id);
    /* use btn name*/
    /* use btn object */
}

//================= LAST CARD
function recordLastCardLoaded(cardUniqueID) {
    localStorage.setItem(ls_lastCardLoaded, cardUniqueID);
    addCardIDtoHistory(cardUniqueID);
}

function loadLastCardLoaded() {
    const lastCard = localStorage.getItem(ls_lastCardLoaded);
    if (lastCard) {
        window.setting_lastCardLoadedArray = lastCard.split(cardUniqueIDSplitter);
    }
}
/*
function lastCardLoadedUniqueID() {
    const lastCard = localStorage.getItem(ls_lastCardLoaded);
    if (lastCard) {
        return lastCard;
    } else return "";
}
*/


//================= CARDS SIZE
function setupCardsSizeAtStartup() {
    if (!localStorage.getItem(ls_cards_small)) localStorage.setItem(ls_cards_small, "false");
    window.cards_small = localStorage.getItem(ls_cards_small)==="true";
    alignCardsSizeSwitches();
}

function saveCardsSizeSetting() {
    localStorage.setItem(ls_cards_small, window.cards_small ? "true" : "false");
}
//================= TOOLBOX
function setupToolboxAtStartup() {
    /* image sizing */
    if (!localStorage.getItem(ls_toolbox)) localStorage.setItem(ls_toolbox, toolboxH);
    if (!localStorage.getItem(ls_toolboxMenuHidden)) localStorage.setItem(ls_toolboxMenuHidden, true.toString());
    const menuToolbarVisible = localStorage.getItem(ls_toolboxMenuHidden)===false.toString();
    window.setting_toolbox = localStorage.getItem(ls_toolbox);
    if (window.setting_toolbox === toolboxV) {
        /* switchToolboxesVH will toggle window.setting_toolbox, so we must toggle first */
        window.setting_toolbox = toolboxH;
        switchToolboxesVH();
        if(menuToolbarVisible) hideVHToolbars('v');
    } else if(menuToolbarVisible) hideVHToolbars('h');
}

function switchToolboxesVH() {
    /* toggle and store */
    window.setting_toolbox = window.setting_toolbox === toolboxH ? toolboxV : toolboxH;
    localStorage.setItem(ls_toolbox, window.setting_toolbox);

    [document.getElementById("div-toolbox-h"), document.getElementById("col-toolbar")].forEach((e) => e.toggleAttribute("hidden"));
    /* need to setupImageFitButtonsForImageFit explicitly for unknown reason otherwis ethey get lost*/
    setupImageFitButtonsForImageFit();
    hideTargetIcon();
    //fitty.fitAll();
    loadCardImage();
    adjustCardWidthHeight();
}

//================= IMAGEFIT
function setupImageFitButtonsForImageFit() {
    const btnimgfitmaximise = document.getElementById("btn-imgfit-maximise");
    const imgfitbtnsP=["imageFitPage-toolbox","imageFitPage-dropdown",imageFitPage];
    const imgfitbtnsW=["imageFitWidth-toolbox","imageFitWidth-dropdown",imageFitWidth];
    if (window.setting_imageFit === imageFitPage) {
        imgfitbtnsP.forEach((btn) => document.getElementById(btn).classList.add("active"));
        imgfitbtnsW.forEach((btn) => document.getElementById(btn).classList.remove("active"));
        btnimgfitmaximise.classList.remove("fa-arrows-alt");
        btnimgfitmaximise.classList.add("fa-arrows-alt-h");
        btnimgfitmaximise.title = "Fit image to full width";
    } else {
        imgfitbtnsP.forEach((btn) => document.getElementById(btn).classList.remove("active"));
        imgfitbtnsW.forEach((btn) => document.getElementById(btn).classList.add("active"));
        btnimgfitmaximise.classList.add("fa-arrows-alt");
        btnimgfitmaximise.classList.remove("fa-arrows-alt-h");
        btnimgfitmaximise.title = "Constrain image to available height and width";
    }
    adjustCardWidthHeight();
}

function setupImageFitAtStartup() {
    /* image sizing */
    if (!localStorage.getItem(ls_imageFit)) localStorage.setItem(ls_imageFit, imageFitPage);
    window.setting_imageFit = localStorage.getItem(ls_imageFit);
    setupImageFitButtonsForImageFit();
    adjustCardWidthHeight();
}

function assignSetting_cardIsRotated(predicateTrue) {
    //needed to correct XY coords
    window.setting_cardIsRotated = predicateTrue ? rotated_true : rotated_false;
}

function setting_cardIsRotatedIsTrue() {
    //needed to correct XY coords
    return window.setting_cardIsRotated === rotated_true;
}

function handleSettings_imageSizeClicked(btnid) {
    window.setting_imageFit = btnid.split("-")[0];//btnid.replace("-toolbox", "");
    localStorage.setItem(ls_imageFit, window.setting_imageFit);
    setupImageFitButtonsForImageFit();
    hideTargetIcon();
    adjustCardWidthHeight();
}

function imageFitMaximiseClicked() {
    if (window.setting_imageFit === imageFitPage) document.getElementById("imageFitWidth").click();
    else document.getElementById("imageFitPage").click();
}

//================= AVATARS
function handleCheckboxAvatarsChanged(eletype) {
    const cbx = document.getElementById("checkbox-avatars");
    if (eletype === "img") cbx.checked = !cbx.checked;
    window.setting_avatarsShown = cbx.checked;
    localStorage.setItem(ls_avatars, retrieveSetting_AvatarsShownString(window.setting_avatarsShown));
    elementsArrayForClassName("div-avatars").forEach(e => {
        e.hidden = !window.setting_avatarsShown;
    });
    setSettingsBoxStatus(window.setting_avatarsShown,"settingsBox-avatars");
}

function setupAvatarsShownAtStartup() {
    if (!localStorage.getItem(ls_avatars)) localStorage.setItem(ls_avatars, avatars_true);
    window.setting_avatarsShown = localStorage.getItem(ls_avatars) === avatars_true;
    elementsArrayForClassName("div-avatars").forEach(e => {
        e.hidden = !window.setting_avatarsShown;
    });
    document.getElementById("checkbox-avatars").checked = window.setting_avatarsShown;
    setSettingsBoxStatus(window.setting_avatarsShown,"settingsBox-avatars");
}

function retrieveSetting_AvatarsShownString(predicateTrue) {
    return predicateTrue ? avatars_true : avatars_false;
}

//================= LABELS PLAY
function setupLabelsPlayAtStartup() {
    if (!localStorage.getItem(ls_speakLabels)) localStorage.setItem(ls_speakLabels, "false");
    window.speakLabels = localStorage.getItem(ls_speakLabels) === 'true';
    document.getElementById("checkbox-speakLabels").checked = window.speakLabels;

    if (!localStorage.getItem(ls_labelsPlayDuration)) localStorage.setItem(ls_labelsPlayDuration, "2");
    document.getElementById("input-labelShowdelay").value = localStorage.getItem(ls_labelsPlayDuration);
    window.labelPlayDelay = labelsShowDelayInt();
    if (!localStorage.getItem(ls_labelsPlayRandom)) localStorage.setItem(ls_labelsPlayRandom, "order");
    const btn = document.getElementById("button-playRandom");
    btn.value = localStorage.getItem(ls_labelsPlayRandom);
    showIconForLabelPlayRandomButtonState(btn);
    setSettingsBoxStatus(window.speakLabels,"settingsBox-speak");
}

function handleLabelsdelayChanged(input) {
    localStorage.setItem(ls_labelsPlayDuration, input.value);
    window.labelPlayDelay = labelsShowDelayInt();
}

function labelsShowDelayInt() {
    return parseInt(document.getElementById("input-labelShowdelay").value);
}

function handleCheckboxSSpeakCheckboxChanged(cbx) {
    window.speakLabels = cbx.checked;
    localStorage.setItem(ls_speakLabels, cbx.checked);
    setSettingsBoxStatus(window.speakLabels,"settingsBox-speak");
}

//================= LEGEND HIDE
function setupHideLegendAtStartup() {
    if (!localStorage.getItem(ls_legendAutoHide)) localStorage.setItem(ls_legendAutoHide, legendHideAuto);
    window.setting_legendautohide = localStorage.getItem(ls_legendAutoHide);
    if (window.setting_legendautohide === legendHideAuto) {
        document.getElementById(legendHideAuto).classList.add("active");
        document.getElementById(legendHidePinned).classList.remove("active");
    } else {
        document.getElementById(legendHideAuto).classList.remove("active");
        document.getElementById(legendHidePinned).classList.add("active");
    }
}

function handleSettings_legendHideAutoClicked(btnid) {
    localStorage.setItem(ls_legendAutoHide, btnid);
    window.setting_legendautohide = btnid;
}

//================= TEXT SIZE
function setupTextSizeAtStartup() {
    if (!localStorage.getItem(ls_textSize)) localStorage.setItem(ls_textSize, textSizeAuto);
    let setting_textSize = localStorage.getItem(ls_textSize);
    document.getElementById(textSizeFixedMedium).classList.remove("active");
    document.getElementById(textSizeFixedLarge).classList.remove("active");
    document.getElementById(textSizeAuto).classList.remove("active");
    document.getElementById(setting_textSize).classList.add("active");
    applyTextSizeSetting(setting_textSize);
}

function handleSettings_textSizeClicked(btnid) {
    localStorage.setItem(ls_textSize, btnid);
    applyTextSizeSetting(btnid);
}

function applyTextSizeSetting(setting) {
    switch (setting) {
        case textSizeAuto:
            document.getElementById("div-revealAnswers").style.fontSize = "2vmin";
            break;
        case textSizeFixedLarge:
            document.getElementById("div-revealAnswers").style.fontSize = "large";
            break;
        case textSizeFixedMedium:
            document.getElementById("div-revealAnswers").style.fontSize = "medium";
            break;
    }
}

//================= LEGEND LABELS APPEAR
function setupLegendLabelsAppearAtStartup() {
    if (!localStorage.getItem(ls_legendlabelsAppear)) localStorage.setItem(ls_legendlabelsAppear, legendAppearsAll);
    window.setting_legendLabelsAppear = localStorage.getItem(ls_legendlabelsAppear);
    document.getElementById(legendAppearsInOrder).classList.remove("active");
    document.getElementById(legendAppearsRandom).classList.remove("active");
    document.getElementById(legendAppearsAll).classList.remove("active");
    document.getElementById(window.setting_legendLabelsAppear).classList.add("active");
}

function handleSettings_legendLabelsAppearClicked(btnid) {
    localStorage.setItem(ls_legendlabelsAppear, btnid);
    window.setting_legendLabelsAppear = btnid;
    addLegendArrayToDiv(getSelectCardsSelectedCardObject());
}

//================= Orientation
function setupOrientationAtStartup() {
    if (!localStorage.getItem(ls_orientation)) localStorage.setItem(ls_orientation, forceOrientation_none);
    window.setting_ForceOrientation = localStorage.getItem(ls_orientation);
    document.getElementById(forceOrientation_none).classList.remove("active");
    document.getElementById(forceOrientation_portrait).classList.remove("active");
    document.getElementById(forceOrientation_none).classList.remove("active");
    document.getElementById(window.setting_ForceOrientation).classList.add("active");
}

function handleSettings_OrientationClicked(btnid) {
    localStorage.setItem(ls_orientation, btnid);
    window.setting_ForceOrientation = btnid;
    btnFlipThisImageOriginal();
    loadCardImage();
}

//================= MODE DARKLIGHT
/* in darkMode.js */

//================= BILINGUAL
function setupLanguageAtStartup() {
    if (!localStorage.getItem(ls_language)) localStorage.setItem(ls_language, languageBoth);
    window.setting_language = localStorage.getItem(ls_language);
    document.getElementById(languageFirst).classList.remove("active");
    document.getElementById(languageSecond).classList.remove("active");
    document.getElementById(languageBoth).classList.remove("active");
    document.getElementById(window.setting_language).classList.add("active");
}

function handleSettings_languageClicked(btnid) {
    localStorage.setItem(ls_language, btnid);
    window.setting_language = btnid;
    applyLanguageSetting();
}

function applyLanguageSetting() {
    addLegendArrayToDiv(getSelectCardsSelectedCardObject());
}

//================= HOTSPOT LABELS APPEAR
function handleCanHoverChange(query) {
    document.getElementById("btns-hotspotsOnHover").hidden=!query.matches;
    //document.getElementById("message-hotspotsOnHover").hidden=query.matches;
}
function setupHotspotLabelsAppearAtStartup() {
    window.canHover = window.matchMedia("(hover: hover)");
    try {window.canHover.addEventListener('change', (e) => {handleCanHoverChange(e)});}// not Safari
    catch /* Safari*/ (e1) {try {window.canHover.addListener((e) => {handleCanHoverChange(e)});} catch (e2) {cll(e2);}}
    // run handleCanHoverChange once, the listeners will alert if it changes
    handleCanHoverChange(window.canHover);
    if (window.canHover.matches === false) localStorage.setItem(ls_hotspotLabelsAppear, hotspotOnClick);

    if (!localStorage.getItem(ls_hotspotLabelsAppear)) localStorage.setItem(ls_hotspotLabelsAppear, hotspotOnHover);
    window.setting_hotspotLabelsAppear = localStorage.getItem(ls_hotspotLabelsAppear);
    document.getElementById(hotspotOnClick).classList.remove("active");
    document.getElementById(hotspotOnHover).classList.remove("active");
    document.getElementById(window.setting_hotspotLabelsAppear).classList.add("active");

    // come after ls_hotspotLabelsAppear as depends on window.setting_hotspotLabelsAppear value
    if (!localStorage.getItem(ls_bannerLocation)) localStorage.setItem(ls_bannerLocation, "banner-top");
    const bannerLoc = localStorage.getItem(ls_bannerLocation);
    document.getElementById(bannerLoc).classList.add("active");
    window.hoverOnCursor = bannerLoc.includes('cursor');
    document.getElementById("div-hoverLegendlabel").classList.add(bannerLoc);
    document.getElementById("div-hovercursor").hidden=window.setting_hotspotLabelsAppear !== hotspotOnHover;
}

function handleSettings_hotspotLabelsAppearClicked(btnid) {
    localStorage.setItem(ls_hotspotLabelsAppear, btnid);
    window.setting_hotspotLabelsAppear = btnid;
    document.getElementById("div-hovercursor").hidden=window.setting_hotspotLabelsAppear !== hotspotOnHover;
}

function handleHoverOnCursorChanged(btnsid) {
    window.hoverOnCursor = btnsid.includes('cursor');
    localStorage.setItem(ls_bannerLocation, btnsid);
    const popupDiv = document.getElementById("div-hoverLegendlabel");
    popupDiv.classList.remove("banner-top");
    popupDiv.classList.remove("banner-bottom");
    popupDiv.classList.remove("banner-centre");
    popupDiv.classList.remove("banner-cursor");
    popupDiv.style.left="";
    popupDiv.style.top="";
    popupDiv.style.bottom="";

    popupDiv.classList.add(btnsid);

}
//================= CHAPTER AUTOCHANGE
function setupChangeChapterAutoAtStartup() {
    if (!localStorage.getItem(ls_changeChapterAuto)) localStorage.setItem(ls_changeChapterAuto, "true");
    const cbx = document.getElementById("checkbox-chapterChange");
    //TODO Hack chapterchange auto
    cbx.checked = true; /*localStorage.getItem(ls_changeChapterAuto) === "true";*/
    window.changeChapterAuto=true; /*localStorage.getItem(ls_changeChapterAuto) === "true";*/

    setSettingsBoxStatus(cbx.checked,"settingsBox-acrossChapters");
}

function handleCheckboxChapterChangeAutoChanged(eletype) {
    const cbx = document.getElementById("checkbox-chapterChange");
    if (eletype === "img") cbx.checked = !cbx.checked;
    window.changeChapterAuto=cbx.checked;
    localStorage.setItem(ls_changeChapterAuto, cbx.checked ? "true" : "false");
    enablePrevNextBtnForSelectCard(document.getElementById("select-cards"));
    setSettingsBoxStatus(cbx.checked,"settingsBox-acrossChapters");
}

//================= TEST BUTTONS
function setupTestButtonsShowHideAtStartup() {
    if (!localStorage.getItem(ls_testButtonsShowHide)) localStorage.setItem(ls_testButtonsShowHide, testButtonsHide);
    let setting_testButtonShowHide = localStorage.getItem(ls_testButtonsShowHide);
    document.getElementById("checkbox-testButtons").checked = setting_testButtonShowHide === testButtonsShow;
    applyTestButtonsShowHideSetting(setting_testButtonShowHide);
    setSettingsBoxStatus(setting_testButtonShowHide === testButtonsShow,"settingsBox-selfTest");
}

function handleCheckboxSelfTestButtonsChanged(eletype) {
    const cbx = document.getElementById("checkbox-testButtons");
    if (eletype === "img") cbx.checked = !cbx.checked;
    handleSettings_TestButtonsShowHideClicked(cbx.checked ? testButtonsShow : testButtonsHide);
    setSettingsBoxStatus(cbx.checked,"settingsBox-selfTest");
}

function handleSettings_TestButtonsShowHideClicked(btnid) {
    localStorage.setItem(ls_testButtonsShowHide, btnid);
    applyTestButtonsShowHideSetting(btnid);
}

function applyTestButtonsShowHideSetting(setting) {
    document.getElementById("div-answerButtonsHanger").hidden = setting !== testButtonsShow;
    hideTargetIcon();
    adjustCardWidthHeight();
}

//================= PRELOAD IMAGES
function handleCheckboxPreloadImagesChanged(eletype) {
    const cbx = document.getElementById("checkbox-preloadImages");
    if (eletype === "img") cbx.checked = !cbx.checked;
    window.preloadImages=cbx.checked;
    localStorage.setItem(ls_preloadImages, cbx.checked ? "true" : "false");
    setPreloadBoxStatus();
}
function setupCheckboxPreloadImagesAtStartup() {
    if (!localStorage.getItem(ls_preloadImages)) localStorage.setItem(ls_preloadImages, window.preloadImages);
    window.preloadImages = localStorage.getItem(ls_preloadImages) === "true";
    document.getElementById("checkbox-preloadImages").checked = window.preloadImages;
    setPreloadBoxStatus();
}
function  setPreloadBoxStatus(){
    if(window.preloadImages) document.getElementById("settingsSwitchGroup-preload").classList.add("settingsSwitchGroup-preload-selected");
    else  document.getElementById("settingsSwitchGroup-preload").classList.remove("settingsSwitchGroup-preload-selected");
}

function  setSettingsBoxStatus(status,boxName){
    if(status) document.getElementById(boxName).classList.add("settingsSwitchGroup-selected");
    else  document.getElementById(boxName).classList.remove("settingsSwitchGroup-selected");
}


/* ************************** */
function checkboxInitiallyHideClicked(cbx,what) {
    if(what === 'text') initiallyHideText = cbx.checked;
    else initiallyHideImages = cbx.checked;
    loadCardImage();
}