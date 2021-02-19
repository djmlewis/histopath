/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/

/* ********************* TOPICS ************************ */
function downloadTopics() {
    if (locationType() !== runningLocalFile) {
        //cll("non local");
        if (window.Worker) {
            const indicesWorker = new Worker("worker_topics.2.js");
            indicesWorker.onmessage = (e) => {
                window.topicsHTML = e.data.htm;
                window.topicsObj = e.data.obj;
                updateAfterTopicsDownloaded();
            };
            indicesWorker.postMessage(['topics/topics.' + window.topicsversionStr + '.html', 'topics/topics.' + window.topicsversionStr + '.json']);
            /*
                        indicesWorker.postMessage('topics/topics.'+window.topicsversionStr+'.json');
                        indicesWorker.postMessage('topics/topics.'+window.topicsversionStr+'.html');
            */
        } else {
            fetch('topics/topics.' + window.topicsversionStr + '.html')
                .then(response => response.text())
                .then(text => {
                    window.topicsHTML = text;
                    updateAfterTopicsDownloaded();
                });
            fetch('topics/topics.' + window.topicsversionStr + '.json')
                .then(response => response.json())
                .then(obj => {
                    window.topicsObj = obj;
                    updateAfterTopicsDownloaded();
                });
        }
    } else {
        //cll("file:///");
        loadLocalScript("topics", "topics/topics." + window.topicsversionStr + ".js");
    }

}

function updateAfterTopicsDownloaded() {
    if (!!window.topicsObj && window.topicsHTML.length > 0) {
        elementsArrayForManyClassNames(["btn-topics"]).forEach(b => {
            b.disabled = false;
            b.title = "View topics…";
        });
        // populate select now
        const topicsselect = document.getElementById("select-topics");
        Object.keys(window.topicsObj).forEach(k=>{
            topicsselect.appendChild(self.createSimpleOptionForSelectOrGalleryWithName(k,prettyfyTopicTitle(k)));
        });
        // first card gets loaded before we load topics, update
        updateTopicsButton(getSelectCardsSelectedCardObject());
    }
}

function populateTopicsGalleryWithTopic(topicname) {
    // now we can populate the gallery ONLY with selected list
    const topicsList = document.getElementById("list-topics");
    topicsList.innerHTML = "";
    window.topicsObj[topicname].forEach(cardUnID => {
        let bmBtn = createBookmarkGalleryForCardObj(getCardObjFromUniqueCardIDwithSplitter(cardUnID, cardUniqueIDSplitter),
            false, true, "", false, undefined, "sheet-topics", undefined);
        if(!!bmBtn) topicsList.appendChild(bmBtn);
    });
    adjustQGcardsSize("sheet-topics");
}

function openTopics(source) {
    const topicsselect = document.getElementById("select-topics");
    if (!!window.topicsObj) {
        populateTopicsGalleryWithTopic(topicsselect.value);
    } else {
        adjustQGcardsSize("sheet-topics");
    }
    if (source === 'dropdown') $("#dropdown-tools").dropdown('hide');
    if (source === 'modal') {
        hideSheet("sheet-bookmarks");
        window.callingTopicsFromModal = true;
        setTimeout(function () {
            showSheet("sheet-topics");
        }, 250);
    } else showSheet("sheet-topics");
}

function handleSelectTopicsChanged(select) {
    populateTopicsGalleryWithTopic(select.value);
    updateTopicsButton(getSelectCardsSelectedCardObject());
}

function addSelectedTopicToBookmarks() {
    window.allBookmarksArchiveObj.importTopicObject(document.getElementById("select-topics").value);
}
function updateTopicsButton(selectedcard) {
    if(selectedCardInSelectedTopic(selectedcard)===true) {
        elementsArrayForClassName("btn-topics").forEach(e=>e.classList.add("btn-topics-active"));
        const topicsArraylength=window.topicsObj[document.getElementById("select-topics").value].length;
        const cardTopicIndex=window.topicsObj[document.getElementById("select-topics").value].indexOf(selectedcard.uniqueCardID);
        elementsArrayForClassName("btn-topic-prevnext").forEach(e=>{
            if(e.id.includes("next")) e.disabled = cardTopicIndex===topicsArraylength-1;
            else e.disabled = cardTopicIndex===0;
        });
    } else {
        elementsArrayForClassName("btn-topics").forEach(e=>e.classList.remove("btn-topics-active"));
        elementsArrayForClassName("btn-topic-prevnext").forEach(e=>e.disabled=true);
    }
}
function selectedCardInSelectedTopic(selectedcard){
    // when first card loads the topicsObj will be undefined. we catch that later.
    return !!window.topicsObj ? window.topicsObj[document.getElementById("select-topics").value].indexOf(selectedcard.uniqueCardID) >=0 : false;
}
function handleChangeTopicIndexfromKey(key) {
    const selectedCardUniqueID = getSelectCardsSelectedCardObjectUniqueCardID();
    const topicCardsArray = window.topicsObj[document.getElementById("select-topics").value];
    const indexOfCardInTopic = topicCardsArray.indexOf(selectedCardUniqueID);
    if (indexOfCardInTopic>=0) {
        if(key===nextValue) {
            if (indexOfCardInTopic + 1 < topicCardsArray.length) {
                handleGalleryClick(topicCardsArray[indexOfCardInTopic + 1], undefined, undefined);
            } else blinkElementHashID("#image-card");
        } else {
            // prev
            if (indexOfCardInTopic > 0) {
                handleGalleryClick(topicCardsArray[indexOfCardInTopic - 1], undefined, undefined);
            } else blinkElementHashID("#image-card");
        }
    }
}

function prettyfyTopicTitle(title) {
    return title.replace("_v"," (v").replace("_",": ").replace(/_/g," ")+")";
}