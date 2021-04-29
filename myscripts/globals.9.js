/******************************************************************************
 * Copyright (c) 29/4/2021 11:35     djml.uk E&OE.                            *
 ******************************************************************************/
window.globalIndexHTML = "Still downloading… Please try later";
window.globalIndexPopeskoHTML = "Still downloading… Please try later";
window.popeskoThumbsObj = undefined;
window.filteredArrayCarduidArray=[];
window.filteredArray=[];
window.labelSearchString="";
window.cuidsAwaitingDownload=null;
// =================================================================== COLLECTION OBJECT
window.collectionobject = new CardsetCollection();

// =================================================================== MODAL FUNCTIONS
window.modal_shown = undefined;
//window.modal_index_shown = false;

// =================================================================== GALLERY FUNCTIONS
window.cards_small = false;
const ls_cards_small = "false";

// =================================================================== SHEETS
//window.sheetShown = undefined;
window.repaintSink = 0;
// =================================================================== CARD FUNCTIONS
const lifecyclesfolderpath = 'cardsets/central/lifecycles/';
window.imageCard=null;
window.divImageCard=null;
const frontFace = "/fronts/";
const nextValue = "1";
const prevValue = "-1";
const revealButtonKey = "reveal";
const deleteBookmarkButtonValue = "deleteBookmarkButtonValue";
const addBookmarkButtonValue = "addBookmarkButtonValue";
let cardFaceShowing = frontFace;
const answersSuffix=".vaanswers";
const attr_cardUniqueID = "data-attr_cardUniqueID";
const attr_cardImagePath = "data-cardImagePath";
const attr_cardAnswersText = "data-cardAnswersText";
const attr_cardObject = "data-attr_cardObject";

// targetIconTimeoutID = -1;
const targetTimeoutDuration = 5000;
const targetTimeoutDurationLong = 8000;
window.coordsWaitingToBeTargetted = undefined;

let cardImgNamesArray = [];

// =================================================================== FAVOURITE FUNCTIONS
const ls_BookmarksObjectkey = "ls_BookmarksObjectkey-d";
const ls_BookmarksLastListKey = "ls_BookmarksLastListKey";
const bookmark_IDprefix = "BMK";
const bookmarksSuffix=".vabkmks";
const ls_history = "ls_history";
const cardsetTitleTruncLength = 38;
const ls_speakLabels = "ls_speakLabels";
const ls_labelsPlayDuration = "ls_labelsPlayDuration";
const ls_labelsPlayRandom = "ls_labelsPlayRandom";
window.historyMaxItems = 40;
window.speakLabels=false;
window.labelPlayIndex=-1;
window.labelPlayTimeout=undefined;
window.labelPlayRevealTimeout=undefined;
window.labelPlayTargetHideTimeout=undefined;
window.labelPlayDelay=2;
window.quickGalleryShowingBmks=false;
//  =================================================================== TOPICS
window.topicsObj=undefined;
window.topicsHTML="";

// =================================================================== ANSWERS RECORD
const ls_answersObjectkey = "vetanataanswersobject-v12";
const ls_answersRecordVersion = ls_answersObjectkey;
const answerEqual = "e";
const answerCorrect = "c";
const answerWrong = "w";
const clearActionAll = "clearActionAll";
const clearActionCardset = "clearActionCardset";
const clearActionChapter = "clearActionChapter";
const clearActionCard = "clearActionCard";
const answerSplitter = "\t";

// =================================================================== SELECT EVENTS
const ls_changeChapterAuto = "ls_changeChapterAuto";
window.changeChapterAuto=true;
// ===================================================================
window.helpImg="img/help/Slide1.jpeg";
// =================================================================== SETTINGS

const ls_lastCardLoaded = "ls_lastCardLoaded";
window.setting_lastCardLoadedArray = undefined;
window.showingAllTargets = false;
window.showingAllTargetIndex = 0;

const ls_toolbox = "ls_toolbox";
const toolboxH = "toolboxH";
const toolboxV = "toolboxV";
const ls_toolboxMenuHidden = "ls_toolboxMenuHidden";
window.setting_toolbox = toolboxH;
window.setting_fullscreen = false;

//const ls_rotated = "ls_rotated";
const rotated_true = "t";
const rotated_false = "f";
window.setting_cardIsRotated = rotated_false;

const forceOrientation_none = 'forceOrientation_none';
const forceOrientation_portrait = 'forceOrientation_portrait';
const forceOrientation_landscape = 'forceOrientation_landscape';
window.setting_ForceOrientation = forceOrientation_none;
const ls_orientation = "ls_orientation5";
const flip_original = "flip_original";
const flip_rotate = "flip_rotate";

const lsRandomButtonPopovered = "lsRandomButtonPopovered1";

const ls_avatars = "ls_avatars";
const avatars_true = "t";
const avatars_false = "f";
window.setting_avatarsShown = avatars_true;
window.avatarsTitlesObj ={
    A:"Hamster",
    B:"Bovine",
    C:"Feline",
    D:"Canine",
    E:"Erinaceinae",
    F:"Musteline",
    G:"Caprine",
    H:"Equine",
    I:"Gerbil",
    J:"Bufotenine",
    K:"Chinchilline",
    L:"Leporine",
    M:"Murine",
    N:"Serpentine",
    // O
    P:"Porcine",
    Q:"Piscine",
    R:"Ruminants",
    S:"Ovine",
    T:"Chelonian",
    U:"Cavine",
    V:"Carnivores",
    W:"Avian",
    // X
    Z:"Lacertilian",
};

const imageWidthMaxWithLegend = 9;
const imageWidthMaxWithLegendFullscreen = 8; // fudge for phones
const ls_imageFit = "ls_imageFit";
const imageFitPage = "imageFitPage";
const imageFitWidth = "imageFitWidth";
window.setting_imageFit = imageFitPage;
const ls_textSize = "ls_textSize";
const textSizeAuto = "textSizeAuto";
const textSizeFixedMedium = "textSizeFixedMedium";
const textSizeFixedLarge = "textSizeFixedLarge";
const ls_legendAutoHide = "ls_legendAutoHide";
const legendHideAuto = "legendHideAuto";
const legendHidePinned = "legendHidePinned";
window.setting_legendautohide = legendHideAuto;
const ls_testButtonsShowHide = "ls_testButtonsShowHide";
const testButtonsShow = "testButtonsShow";
const testButtonsHide = "testButtonsHide";
const ls_legendlabelsAppear = "ls_legendlabelsAppear";
const legendAppearsInOrder = "legendAppearsInOrder";
const legendAppearsRandom = "legendAppearsRandom";
const legendAppearsAll = "legendAppearsAll";
window.setting_legendLabelsAppear = legendAppearsAll;

const ls_language = "ls_language_3";
const languageFirst = "languageFirst";
const languageSecond = "languageSecond";
const languageBoth = "languageBoth";
window.setting_language = languageBoth;

const ls_hotspotLabelsAppear = "ls_hotspotLabelsAppear";
const hotspotOnClick = "hotspotOnClick";
const hotspotOnHover = "hotspotOnHover";
window.setting_hotspotLabelsAppear = hotspotOnHover;
const ls_bannerLocation = "ls_bannerLocation";
window.hoverOnCursor = false;
window.allLabelsLabelOnTopIndex = 0;

const ls_modeDarkLight = "ls_modeDarkLight";
const modeDark = "modeDark";
//const modeDarkHexColour = "#212121";
const modeLight = "modeLight";
window.setting_modeDarkLight = modeDark;

window.preloadImages = true;
window.preloadedArray=[];
window.preloadingArray=[];
const ls_preloadImages = "ls_preloadImages";
//---------- ******** Random *********** ------------------------//
window.randomCardIndices = [];
//---------- ******** Alerts *********** ------------------------//
const myAlert_alert = "A";
const myAlert_info = "I";

// =================================================================== NOTES & postits
// create an instance of a db object for us to store the data in
window.db_notes = undefined;
const dbNotes_name="db_postits_sbnotes";
const dbNotes_version=1;

const dbNotes_OS_name_notes = "OSnotes";
window.allowSaveNotes=false;
window.notesClean=true;
const notesCardIDattributeName = "data-notesCardID";
const notesKeyValueAttributeName = "data-notesKeyValue";
const dbNotes_uniquecardID="uniquecardID";
const dbNotes_notesText="notesText";
const dbNotes_notesKeyPath="key";
const sbnotesSuffix=".vasbnts";
const pinotesSuffix=".vapints";

const dbNotes_OS_name_postits = "OSpostits";
const dbNotes_postitsKeyPath="key";
const dbNotes_postitsArray="postitsarray";

window.postitsDoodlesRecordForSelectedCard=null;
window.selectedPostitID="";
window.postitsBeingEdited=false;
window.hidePostitsDoodles = false;
const postit_defaultTxtDataCol="black";
const postit_defaultTxtSize="s";
const postit_defaultBGDataCol="pink";
const figToHanger = "figToHanger";
const hangerToFig = "hangerToFig";
const postitHangerSafetyMargin=16;
const ls_postitsRotate = "ls_postitsRotate";
window.postitsRotate=true;

const doodlexmlns="http://www.w3.org/2000/svg";
window.selectedDoodleGroup=null;
const dbNotes_svgHTML="svgHTML";


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