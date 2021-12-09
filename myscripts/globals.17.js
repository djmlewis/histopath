/******************************************************************************
 * Copyright (c) 9/12/2021 7:50     djml.uk E&OE.                             *
 ******************************************************************************/
// =================================================================== COLLECTION OBJECT
window.collectionobject = new CardsetCollection();
// =================================================================== MODAL FUNCTIONS
window.modal_shown = undefined;
// =================================================================== SETTINGS
// =================================================================== CARD FUNCTIONS
//const lifecyclesfolderpath = 'cardsets/central/lifecycles/';
const nextValue = "1";
const prevValue = "-1";
const attr_cardUniqueID = "data-attr_cardUniqueID";
const attr_cardImagePath = "data-cardImagePath";
const attr_cardAnswersText = "data-cardAnswersText";
const attr_cardObject = "data-attr_cardObject";
let cardImgNamesArray = [];

// =================================================================== ANSWERS RECORD
const answerSplitter = "\t";

// =================================================================== SELECT EVENTS
let changeChapterAuto=false;
// =================================================================== SETTINGS

const ls_lastCardLoaded = "ls_lastCardLoaded";
let setting_lastCardLoadedArray = undefined;

//---------- ******** Random *********** ------------------------//
let randomCardIndices = [];

// ********************************* CHECKBOXES
// these are set at startup to defaults in setupHideTextCapsImagesCheckboxesAtStartup
let initiallyHideText = true;
let initiallyHideImages = false;
let initiallyHideCaptions = true;

const ls_initiallyHideText = "ls_initiallyHideText";
const ls_initiallyHideImages = "ls_initiallyHideImages";
const ls_initiallyHideCaptions = "ls_initiallyHideCaptions";

// const ls_checkbox_randomiseUntested = "checkbox-randomiseUntested";
// const ls_checkbox_randomiseIncorrect = "checkbox-randomiseIncorrect";
// const ls_checkbox_randomiseCorrect = "checkbox-randomiseCorrect";
// const ls_checkbox_randomiseStar = "checkbox-randomiseStar";

let organsRandomisedArray = [];
/* ********************************* */

let db_Obj;
let dbObj_answersObj;

let sliderImageWidthMax = 88;
let currentSliderIncrementForSidePanel = 0; // starts visible
const kSliderIncrementForSidePanelHidden = 12;
const kSliderIncrementForSidePanelVisible = 0;

// ********************************* ID arrays
let imageDivsIDs = ["div-image-card","div-image-card-fullscreen"];
let randomSlideCountsIDs = ["span-randomSlideCount","span-randomSlideCount-fullscreen"];
let randomiseCheckboxesIDs = ["checkbox-randomiseUntested","checkbox-randomiseIncorrect","checkbox-randomiseCorrect","checkbox-randomiseStar"];
let fullscreenIDs = ["","-fullscreen"];