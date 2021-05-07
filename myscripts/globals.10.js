/******************************************************************************
 * Copyright (c) 7/5/2021 3:19     djml.uk E&OE.                              *
 ******************************************************************************/
// =================================================================== COLLECTION OBJECT
window.collectionobject = new CardsetCollection();
// =================================================================== MODAL FUNCTIONS
window.modal_shown = undefined;
// =================================================================== SHEETS
// =================================================================== CARD FUNCTIONS
const lifecyclesfolderpath = 'cardsets/central/lifecycles/';
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
let changeChapterAuto=true;
// =================================================================== SETTINGS

const ls_lastCardLoaded = "ls_lastCardLoaded";
let setting_lastCardLoadedArray = undefined;

//---------- ******** Random *********** ------------------------//
let randomCardIndices = [];

/* ********************************* */
let initiallyHideText = false;
let initiallyHideImages = false;
let initiallyHideCaptions = false;

let db_Obj;
let dbObj_answersObj;

let sliderImageWidthMax = 0;

let imageDivsIDs = ["div-image-card","div-image-card-fullscreen"];
let randomSlideCountsIDs = ["span-randomSlideCount","span-randomSlideCount-fullscreen"];
let fullscreenIDs = ["","-fullscreen"];