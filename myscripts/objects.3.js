/******************************************************************************
 * Copyright (c) 7/5/2021 3:19     djml.uk E&OE.                              *
 ******************************************************************************/

// GLOBALS
const frontsDir = "/fronts/";
const thumbsDir = "/thumbs/";
const thumbsFileType = ".png";
const topFolderName = "cardsets/";
const rotatedTxt = "/rotated.txt";
const rotatedDir = "/rotated/";
const backsText = "/backstext/";
const backsText_3 = "/backstext_3/";
const polarsdir = "/upgradePolars/" //"/polars/";
const hasmaps = "hasmaps";
const setup_cardsetName = 0;
const setup_imagesDirectory = 1;
const setup_imageType = 2;
const setup_cardsetTitle = 3;
const setup_hotspots = 4;
const setup_languages = 5;
const setup_thumbs = 6;
const setup_avatar = 7;
const lang_mono = "mono";
// const lang_bi = "bi";
const cardUniqueIDSplitter = "\t";
const avatars_none = "~";
const avatars_file = "§";
const orientTxt = "/orientations.txt";
const orientation_portrait = 'p';
const orientation_landscape = 'l';

// ---------------------------------------- CARD
function Card(name, title,cardsetname, imagesdirectory, imagetype,cardsettitle, chaptertitle,languages,avatars) {
    this.name = name; // short name 1-1 acts as ID and pairs with .jpg for image src
    this.title = title; // displayed in select-cards
    this.cardsetName = cardsetname;
    this.cardsetTitle = cardsettitle;
    this.imagesDirectory = imagesdirectory;
    this.chapterTitle = chaptertitle;
    this.uniqueCardID = cardsetname+cardUniqueIDSplitter+chaptertitle+cardUniqueIDSplitter+name;
    this.imageType = imagetype;
    this.imagePath = topFolderName + imagesdirectory + frontsDir;
    this.thumbsPath = topFolderName + imagesdirectory + thumbsDir + name + thumbsFileType;
    this.answersText = "";
    this.hotspots = undefined;
    this.languages = languages;
    this.orient=orientation_portrait;
    this.imagePathRotated = topFolderName + imagesdirectory + rotatedDir + name + imagetype;
    this.avatars=avatars;
    this.imageNamesOrientsArray=[];
}
// ---------------------------------------- CHAPTER
function Chapter(title) {
    this.title = title;//links in collection. Value of select-chapter menu option. Shown as text
    this.cardsObj = {}; // [cards short name 1-1]
    this.cardsNamesArray = [];// cards short name acts as ID, used to structure select-cards
    this.numberOfCards =0;
}
Chapter.prototype.addCard = function (card) {
    this.cardsObj[card.name] = card;
    this.numberOfCards = this.cardsNamesArray.push(card.name); // populate select-cards in order
};

// ---------------------------------------- CARDSET
function Cardset(shortname, imagesdirectory, imagetype, longname,language,avatar,version) {
    this.shortName = shortname;//links in collection. Value of select-cardssets menu option
    this.longName = longname; // displayed in select-cardssets
    this.imagesDirectory = imagesdirectory; // may be shared with another cardset
    this.imageType = imagetype; // .png
    this.chaptersObj = {}; // chapters [title]] acts as ID
    this.chapterNamesArray = [];// chapters title acts as ID used to structure select-chapters
    this.numberOfChapters = 0;
    this.languages = language;
    this.thumbs = "<h6 class='text-muted text-center mt-2'>Still downloading … please wait.</h6>";
    this.avatar=avatar;
    this.version=version;
    this.hideCardTitles=false;
}

Cardset.prototype.addChapter = function (chapter) {
    this.chaptersObj[chapter.title] = chapter; //fetch by title as ID
    this.numberOfChapters = this.chapterNamesArray.push(chapter.title); // populate select-chapters in order
};

// ---------------------------------------- CARDSET COLLECTION
function CardsetCollection() {
    this.cardsetsObj = {};
    this.cardsetsNamesArray = [];
    this.numberOfCardsets = 0;
}

CardsetCollection.prototype.addCardset = function (cardset) {
    const self=this;
    self.cardsetsObj[cardset.shortName] = cardset; //fetch by shortName as ID
    self.numberOfCardsets = this.cardsetsNamesArray.push(cardset.shortName); // populate select-cardssets in order
};