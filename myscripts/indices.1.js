/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/
/* ******** CHANGE window.indicesversionStr  *********
        In INDEX
 ********************************************* */
window.indexObj = {};
window.indexObj.englishText = [];
window.indexObj.latinText = [];
window.indexObj.titlesText = [];
window.indexObj.cardIndexEnglish = [];
window.indexObj.cardIndexLatin = [];
window.indexObj.cardIndexTitles = [];
window.indexObj.englishParas = "Not downloaded yet";
window.indexObj.latinParas = "Not downloaded yet";
window.indexObj.titlesParas = "Not downloaded yet";
window.foundArrayE = [];
window.foundArrayL = [];
window.foundArrayT = [];

function resetFoundArrays() {
    window.foundArrayE = new Array(window.indexObj.englishText.length).fill(true);
    window.foundArrayL = new Array(window.indexObj.latinText.length).fill(true);
    window.foundArrayT = new Array(window.indexObj.titlesText.length).fill(true);
}

function updateAfterIndexDownloaded(data) {
    if (!!data) {
        /* setup the divs only when called first time */
        window.indexObj = data;
        resetFoundArrays();
        document.getElementById("div-searchAZbuttons").addEventListener("click", function (e) {
            if (e.target) {
                const {tagName} = e.target;
                if (tagName === "BUTTON") indexLetterClicked(e.target);
            }
        });
        elementsArrayForClassName("btn-showIndex").forEach((btn) => {
            btn.disabled = false;
            btn.title = "Search legend labels…"
        });
    }
}

// this is called from a script file
function updateAfterIndexLocallyLoaded(data,source) {
    // NEED TO IMPLEMENT LOCAL FILE
    if (!!data) {
        Object.assign(window.indexObj, data);
        // check if the other obj has loaded by looking for one of its properties and pass window.indexObj into updateAfterIndexDownloaded
        if(source==="indexObj" && !!window.indexObj.titlesText) updateAfterIndexDownloaded(window.indexObj);
        else if(source==="globalindexNoHeads" && !!window.indexObj.englishText) updateAfterIndexDownloaded(window.indexObj);
    }
}

function checkStatus(response) {
    if (response.status === 200) return response;
    else throw new Error("Not 200 response");
}

function downloadIndices() {
    ["div-indexhanger-latin", "div-indexhanger-english","div-indexhanger-titles"].forEach((hanger) => {
        document.getElementById(hanger).addEventListener('click', handleIndexItemClicked);
    });
    /* for local file version I have to hard code these into the html, otherwise load them async */
    /* remember to update     <script src="indices/searchAZbuttons.18.js" defer></script> in index  */
    if (locationType() !== runningLocalFile) {
        //cll("non local");
        if (window.Worker) {
            const indicesWorker = newIndicesobjWorker();
            indicesWorker.onmessage = (e) => updateAfterIndexDownloaded(e.data);
            indicesWorker.postMessage(window.indicesversionStr);
            const azbWorker = newTextWorker();
            azbWorker.onmessage = (e) => document.getElementById("div-searchAZbuttons").innerHTML = e.data;
            azbWorker.postMessage("indices/searchAZbuttons." + window.indicesversionStr + ".html");
        } else {
            // fetch("indices/indexObj." + window.indicesversionStr + ".json")
            //     .then(response => response.json())
            //     .then(data => updateAfterIndexDownloaded(data));

            let indexObj={};
            fetch("indices/indexObj." + window.indicesversionStr + ".json")
                .then(checkStatus)
                .then(response => response.json())
                .then(object => indexObj=object)
                .catch((e) => {
                    console.log(e+" indexObj");
                    postMessage(null);
                })
                .then(()=>{
                    fetch("indices/globalindexNoHeads." + window.indicesversionStr + ".json")
                        .then(checkStatus)
                        .then(response => response.json())
                        .then(object => {
                            updateAfterIndexDownloaded(Object.assign(object,indexObj));
                        })
                        .catch((e) => {
                            console.log(e+" globalindexNoHeads");
                            updateAfterIndexDownloaded(null);
                        })
                });

            fetch("indices/searchAZbuttons." + window.indicesversionStr + ".html")
                .then(response => response.text())
                .then(data => document.getElementById("div-searchAZbuttons").innerHTML = data);

        }
    } else {
        loadLocalScript("indexObj", "indices/indexObj." + window.indicesversionStr + ".js");
        loadLocalScript("globalindexNoHeads.", "indices/globalindexNoHeads." + window.indicesversionStr + ".js");
        loadLocalScript("searchAZbuttons", "indices/searchAZbuttons." + window.indicesversionStr + ".js");
    }
}

function handle_showIndexClicked(fromdropdown) {
    if (!!fromdropdown) $(fromdropdown).dropdown('hide');
    if (document.getElementById("div-indexhanger-english").innerHTML.length < 100) {
        // length 100 is arbitrary in case I add a placeholder string or it is opened before the full index down loaded - the indexes are much longer
        // we wait to setup the lists until we need to
        document.getElementById("div-indexhanger-english").innerHTML = window.indexObj.englishParas;
        document.getElementById("div-indexhanger-latin").innerHTML = window.indexObj.latinParas;
        document.getElementById("div-indexhanger-titles").innerHTML = window.indexObj.titlesParas;
    }
    const div = document.getElementById("div-searchAZbuttons");
    div.style.backgroundColor = window.setting_modeDarkLight === modeDark ? "#343a40" : "transparent";
    Array.from(div.children).forEach(btn => {
        if (window.setting_modeDarkLight === modeDark) btn.classList.add("btn-dark");
        else btn.classList.remove("btn-dark");
    });
    adjustQGcardsSize("sheet-index");
    showSheet("sheet-index");
}

function getIndexOfClickedPara(para, allowSpan) {
// The equivalent of parent.children.indexOf(child)
    //The call() method calls a [prototype] function BUT with a given this value [not using the prototype or root object as this] and arguments provided individually by the passed object
    // object1.function => result based on object 1
    //object1.function.call(object2) => calls object1's function but uses the data from object2 and substitutes object2 as "this" when object1's function executes and refers to "this"
    //parentNode.children is not an Array, its a NodeCollection so lacks indexOf
    //Array.prototype provides the IndexOf functionality, but uses this and the parentNode.children to act upon when looking for para in the children
    // const para = evt.target;
    // if para is a SPAN we must pass the SPANs parent.node (the P) to the call as the object and its parentNode as the target
    // hence para.parentNode.parentNode.children, para.parentNode
    if (allowSpan) {
        if (para.tagName === 'P') return Array.prototype.indexOf.call(para.parentNode.children, para);
        else if (para.tagName === 'SPAN') return Array.prototype.indexOf.call(para.parentNode.parentNode.children, para.parentNode);
        else return undefined;
    } else {
        return para.tagName === 'P' ? Array.prototype.indexOf.call(para.parentNode.children, para) : undefined;
    }
}

function doSearchIndex() {
    resetSearchModalToOriginalStates(true);
    const searchStr = document.getElementById("input-searchString").value.toLowerCase();
    if (searchStr.length > 0) {
        hideSearchSpinner(false, "spinner_search_btn");
        window.labelSearchString = searchStr;
        setTimeout(() => {
            const englishHanger = document.getElementById("div-indexhanger-english");
            const englishChildren = englishHanger.children;
            const englishChildrenNum = englishChildren.length;
            const latinHanger = document.getElementById("div-indexhanger-latin");
            const latinChildren = latinHanger.children;
            const latinChildrenNum = latinChildren.length;
            const titlesHanger = document.getElementById("div-indexhanger-titles");
            const titlesChildren = titlesHanger.children;
            const titlesChildrenNum = titlesChildren.length;

            englishHanger.hidden = true;
            latinHanger.hidden = true;
            titlesHanger.hidden = true;
            let found = 0;
            //const nw = window.performance.now();
            window.foundArrayE = window.indexObj.englishText.map(e => e.includes(searchStr));
            window.foundArrayL = window.indexObj.latinText.map(e => e.includes(searchStr));
            window.foundArrayT = window.indexObj.titlesText.map(e => e.includes(searchStr));
            for (let i = 0; i < englishChildrenNum; i++) {
                const fnd = window.foundArrayE[i];//para.innerText.includes(searchStr) === false;
                englishChildren[i].hidden = !fnd;
                found += fnd;
            }
            for (let i = 0; i < latinChildrenNum; i++) {
                const fnd = window.foundArrayL[i];//para.innerText.includes(searchStr) === false;
                latinChildren[i].hidden = !fnd;
                found += fnd;
            }
            for (let i = 0; i < titlesChildrenNum; i++) {
                const fnd = window.foundArrayT[i];//para.innerText.includes(searchStr) === false;
                titlesChildren[i].hidden = !fnd;
                found += fnd;
            }
            const fmt = new Intl.NumberFormat();
            document.getElementById("span-searchCount").innerHTML = fmt.format(found);
            englishHanger.classList.add("text-primary");
            latinHanger.classList.add("text-primary");
            titlesHanger.classList.add("text-primary");
            englishHanger.hidden = false;
            latinHanger.hidden = false;
            titlesHanger.hidden = false;
            document.getElementById("div-indexedCards-hanger").innerHTML = "";
            document.getElementById("div-searchAZbuttons").style.visibility = "hidden";
            showHideBookmarkAllSearchButton();
            hideSearchSpinner(true, "spinner_search_btn");
        }, 50);
    }
}

function clearSearchIndex() {
    function hideHangers(hide) {
        ["div-indexhanger-english","div-indexhanger-latin","div-indexhanger-titles"].forEach(h=>document.getElementById(h).hidden=hide);
    }
    resetFoundArrays();
    resetSearchModalToOriginalStates(true);
    hideSearchSpinner(false, "spinner_search_clear");
    document.getElementById("div-searchAZbuttons").style.visibility = "visible";
    document.getElementById("span-searchCount").innerText = "";
    const englishChildren = document.getElementById("div-indexhanger-english").children;
    const englishChildrenNum = englishChildren.length;
    const latinChildren = document.getElementById("div-indexhanger-latin").children;
    const latinChildrenNum = latinChildren.length;
    const titlesChildren = document.getElementById("div-indexhanger-titles").children;
    const titlesChildrenNum = titlesChildren.length;

    hideHangers(true);
    setTimeout(() => {
        for (let i = 0; i < englishChildrenNum; i++) {
            englishChildren[i].hidden = false;
        }
        for (let i = 0; i < latinChildrenNum; i++) {
            latinChildren[i].hidden = false;
        }
        for (let i = 0; i < titlesChildrenNum; i++) {
            titlesChildren[i].hidden = false;
        }
        hideHangers(false);
        ["div-indexhanger-english","div-indexhanger-latin","div-indexhanger-titles"].forEach(h=>document.getElementById(h).classList.remove("text-primary"));
        document.getElementById("input-searchString").value = "";
        document.getElementById("div-indexedCards-hanger").innerHTML = "";
        showHideBookmarkAllSearchButton();
        hideSearchSpinner(true, "spinner_search_clear")
    }, 50);
}

function handleIndexItemClicked(evt) {
    resetSearchModalToOriginalStates(true);
    const itemClickedIndex = getIndexOfClickedPara(evt.target, false);
    if (itemClickedIndex !== undefined) {
        const para = evt.target;
        switch (para.parentNode.id) {
            case "div-indexhanger-latin":
                window.filteredArray = window.indexObj.cardIndexLatin[itemClickedIndex];
                populateCardsHangerForSearchedCardIDs(languageFirst);
                break;
            case "div-indexhanger-english":
                window.filteredArray = window.indexObj.cardIndexEnglish[itemClickedIndex];
                populateCardsHangerForSearchedCardIDs(languageSecond);
                break;
            case "div-indexhanger-titles":
                window.filteredArray = window.indexObj.cardIndexTitles[itemClickedIndex];
                populateCardsHangerForSearchedCardIDs(undefined);
                break;
            default:window.filteredArray=[];
        }

        resetSearchModalToOriginalStates(true);
        showHideBookmarkAllSearchButton();
        setTimeout(function(){preloadCardUIDarray(window.filteredArrayCarduidArray, evt.target.innerText);},2000);
    }
}

function handleIndexGalleryClick(target) {
    if (!!target && target.tagName === "BUTTON") handleGalleryClick(cardUniqueIDcorrectedForSplitter(target.getAttribute("data-uniqueCardID")), target.getAttribute("data-hotspot"), "sheet-index");
}

function populateCardsHangerForSearchedCardIDs(language) {
    const indexedCardshanger = document.getElementById("div-indexedCards-hanger");
    indexedCardshanger.hidden = true;
    indexedCardshanger.innerHTML = "";
    window.filteredArrayCarduidArray = [];
    //cardsUniqueIDIndex is a 5-column § array with cards unique index as 5th item [4]
    window.filteredArray.sort((a, b) => a.split("§")[4] - b.split("§")[4]);
    window.filteredArray.forEach((cardsUniqueIDIndex) => {
        //cardsUniqueIDIndex is a 5-column § array with label index as 4th item [3]
        const cardObject = getCardObjFromUniqueCardIDwithSplitter(cardsUniqueIDIndex, "§");
        if(!!cardObject) {
            window.filteredArrayCarduidArray.push(cardObject.uniqueCardID);
            let answerString = "";
            let hotspot;
            if (!!language) {
                //cardsUniqueIDIndex is a 5-column § array with label index as 4th item [3].
                // A titles card will return undefined for split...[3], and NaN for parseInt(split...[3])
                const indexStr = cardsUniqueIDIndex.split("§")[3];
                const index = parseInt(indexStr, 10);
                if (isNaN(index)) {
                    // we have a titles card
                    answerString = "";
                    hotspot = undefined;
                } else {
                    // we have a labels card
                    answerString = answerStringFromAnswerTabString(cardObject.answersText.split("\n")[index], language);
                    hotspot = !!cardObject.hotspots === true ? index + 1 : undefined;
                }
            }
            const bmobj = createBookmarkGalleryForCardObj(cardObject, false, true, answerString, false, hotspot, "sheet-index", window.allBookmarksArchiveObj.selectedBookmarksListName(), undefined);
            if (!!bmobj) indexedCardshanger.appendChild(bmobj);
        }
    });
    adjustQGcardsSize("sheet-index");
    indexedCardshanger.hidden = false;
    showHideBookmarkAllSearchButton();
}

function createCardsForLabels() {
    // use a Set to de-duplicate
    let cardsUniqueIDIndexSet = new Set();
    // Add titles first - they will be kicked-out by more specific labels
    if(document.getElementById("cbx-titles-index").checked===true) {
        window.foundArrayT.forEach((e, i) => {
            if (!!e) window.indexObj.cardIndexTitles[i].forEach(cid => cardsUniqueIDIndexSet.add(cid));
        });
    }
    if(document.getElementById("cbx-labels-index").checked===true) {
        window.foundArrayE.forEach((e, i) => {
            if (!!e) window.indexObj.cardIndexEnglish[i].forEach(cid => cardsUniqueIDIndexSet.add(cid));
        });
        window.foundArrayL.forEach((e, i) => {
            if (!!e) window.indexObj.cardIndexLatin[i].forEach(cid => cardsUniqueIDIndexSet.add(cid));
        });
    }
    window.filteredArray = [...cardsUniqueIDIndexSet];

    if (window.filteredArray.length === 0) {
        resetSearchModalToOriginalStates(true);
    } else {
        if (window.filteredArray.length < 100) {
            populateCardsHangerForSearchedCardIDs(languageBoth);
            resetSearchModalToOriginalStates(true);
            setTimeout(function(){preloadCardUIDarray(window.filteredArrayCarduidArray, window.labelSearchString);},2000);
        } else {
            hideSearchSpinner(true, "spinner_search");
            document.getElementById("span-confirmProcceedSearchCards").innerHTML = alertIcon + " Found " +
                window.filteredArray.length.toLocaleString() + " rows!";
            document.getElementById("row-searchCardsproceed").hidden = false;
        }
    }
}

function makeCardsForAllShownLabels() {
    resetSearchModalToOriginalStates(false);
    const rowConfirm = document.getElementById("row-searchCardsproceed");
    rowConfirm.hidden = true;
    setTimeout(function () {
        createCardsForLabels();
    }, 20);
}

function confirmProccedSearchCardsMake(call) {
    const rowConfirm = document.getElementById("row-searchCardsproceed");
    rowConfirm.hidden = true;
    if (call === "proceed") {
        hideSearchSpinner(false, "spinner_search");
        setTimeout(function () {
            populateCardsHangerForSearchedCardIDs(languageBoth);
            resetSearchModalToOriginalStates(true);
            setTimeout(function(){preloadCardUIDarray(window.filteredArrayCarduidArray, window.labelSearchString);},2000);
        }, 20);
    } else resetSearchModalToOriginalStates(true);
}

function hideSearchSpinner(hide, id) {
    document.getElementById(id).hidden = hide;
    document.getElementById("icon-" + id).hidden = !hide;
}

function resetSearchModalToOriginalStates(hideSpinner) {
    document.getElementById("input-bmlistName-search").value = "";
    document.getElementById("btn-searchClear").disabled = !hideSpinner;
    document.getElementById("btn-searchIndex").disabled = !hideSpinner;
    hideSearchSpinner(hideSpinner, "spinner_search");
    if (hideSpinner) {
        ["div-indexhanger-english","div-indexhanger-latin","div-indexhanger-titles"].forEach(h=>document.getElementById(h).classList.remove("latinEngCol-disabled"));
    } else {
        ["div-indexhanger-english","div-indexhanger-latin","div-indexhanger-titles"].forEach(h=>document.getElementById(h).classList.add("latinEngCol-disabled"));
    }
    document.getElementById("btn-addAllSearchLabels").disabled = !hideSpinner;
    document.getElementById("row-searchCardsproceed").hidden = true;
}

function modalIndexShownHidden() {
    resetSearchModalToOriginalStates(true);
    //window.modal_index_shown = shown;
}

function showHideBookmarkAllSearchButton() {
    [document.getElementById("btn-searchBookmarkAll"), document.getElementById("input-bmlistName-search"),
        document.getElementById("select-bookmarksListsNames-search")].forEach(e => {
        e.disabled = document.getElementById("div-indexedCards-hanger").innerHTML.length === 0;
    });
}

function doBookmarkAllSearch() {
    const indexedCardshanger = document.getElementById("div-indexedCards-hanger");
    const kids = indexedCardshanger.children;
    const numkids = kids.length;
    for (let i = 0; i < numkids; i++) {
        window.allBookmarksArchiveObj.bookmarkCardUniqueIDWithSplitterInSelectedList(cardUniqueIDcorrectedForSplitter(kids[i].getAttribute("data-uniqueCardID")), cardUniqueIDSplitter);
    }
}

function bookmarkAllSearch() {
    const nameStr = document.getElementById("input-bmlistName-search").value;
    let msg = '';
    if (nameStr.length === 0) {
        window.allBookmarksArchiveObj.selectBMlistWithName(document.getElementById("select-bookmarksListsNames-search").value);
        doBookmarkAllSearch();
        //alert(msg + " The cards were bookmarked to list '" + window.allBookmarksArchiveObj.selectedBookmarksListName() + "'");
        myAlert(msg + " The cards were bookmarked to list '<span class='spanAlert'>" + window.allBookmarksArchiveObj.selectedBookmarksListName() + "</span>'", myAlert_info);
    } else {
        const nameStrOK = nameStr.replace(/\W/gi, "");
        if (nameStrOK !== nameStr) msg = msg + "The name '" + nameStr + "' was invalid and has been modified to '" + nameStrOK + "'";
        if (!!window.allBookmarksArchiveObj.bookmarksListsObject && !!window.allBookmarksArchiveObj.bookmarksListsObject[nameStrOK]) {
            // add to existing
            window.allBookmarksArchiveObj.selectBMlistWithName(nameStrOK);
            doBookmarkAllSearch();
            myAlert(msg + " The cards were bookmarked to existing list '<span class='spanAlert'>" + nameStrOK + "</span>'", myAlert_info);
        } else {
            // make a new string
            const madelist = window.allBookmarksArchiveObj.addedrenamedBMlistWithName(nameStrOK, 'add');
            if (madelist === true) {
                window.allBookmarksArchiveObj.selectBMlistWithName(nameStrOK);
                doBookmarkAllSearch();
                myAlert(msg + " The cards were bookmarked to new list '<span class='spanAlert'>" + nameStrOK + "</span>'", myAlert_info);
            }
        }
    }
    resetSearchModalToOriginalStates(true);
}

function indexLetterClicked(btn) {
    resetSearchModalToOriginalStates(true);
    const coordsLE = btn.value.split("§");
    if (coordsLE[0] !== "x") {
        document.getElementById("div-indexhanger-latin").children[parseInt(coordsLE[0])].scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'nearest'
        });
    } else blinkElementHashID("#div-indexhanger-latin");
    if (coordsLE[1] !== "x") {
        document.getElementById("div-indexhanger-english").children[parseInt(coordsLE[1])].scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'nearest'
        });
    } else blinkElementHashID("#div-indexhanger-english");
}

function handleIndexGalleryWillShow() {
    //document.getElementById("input-searchString").focus();
}

function handleSearchLabTitClicked() {
    ["row-titlesCol", "row-searchAZbuttons", "row-englishLatinCols"].forEach(e => document.getElementById(e).toggleAttribute("hidden"));
}

function handleCbxIndexLabelsTitlesClicked(e) {
    //createCardsForLabels();
}