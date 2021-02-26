/******************************************************************************
 * Copyright (c) 26/2/2021 5:8     djml.uk E&OE.                              *
 ******************************************************************************/

// =================================================================== AnswersRecord
function AnswersRecord() {
    // recordedAnswersObj contains objects that are arrays:  [carduniqueID]-arrayOfAnswers
    this.internalAnswersObj = {};
    this.version = ls_answersRecordVersion;
}

AnswersRecord.prototype.cacheInternalAnswersObj = function () {
    localStorage.setItem(ls_answersObjectkey, JSON.stringify(this));
};

AnswersRecord.prototype.rehydrate = function (driedObject) {
    let self = this;
    let rehydratedObj = JSON.parse(driedObject);
    if (self.version === rehydratedObj.version) {
        self.internalAnswersObj = rehydratedObj.internalAnswersObj;
    } else {
        myAlert("This answers file cannot be loaded as it is the wrong version", myAlert_alert)
    }
};

AnswersRecord.prototype.getAnswerMatrixForCardOrMakeOne = function (uniqueCardID, numAnswersStr) {
    const self = this;
    if (self.internalAnswersObj.hasOwnProperty(uniqueCardID)) {
        return self.getAnswersMatrixForCardUniqueID(uniqueCardID);
    } else {
        let blankmatrix = Array(parseInt(numAnswersStr)).fill("e");
        self.recordAnswerMatrixForCardUniqueID(blankmatrix, uniqueCardID);
        return blankmatrix;
    }
};

AnswersRecord.prototype.getAnswersMatrixForCardUniqueID = function (carduniqueid) {
    const self = this;
    return self.internalAnswersObj[carduniqueid]
};

AnswersRecord.prototype.recordAnswerMatrixForCardUniqueID = function (answerMatrix, uniqueCardID) {
    const self = this;
    self.internalAnswersObj[uniqueCardID] = answerMatrix;
    self.cacheInternalAnswersObj();
};

AnswersRecord.prototype.recordAnswerForCardUniqueID = function (resultString, uniqueCardID, answerIndex) {
    const self = this;
    let updatedAnswerMatrix = self.getAnswersMatrixForCardUniqueID(uniqueCardID);
    updatedAnswerMatrix[answerIndex] = resultString;
    self.recordAnswerMatrixForCardUniqueID(updatedAnswerMatrix, uniqueCardID);
};

AnswersRecord.prototype.clearAnswersFor = function (btn) {
    let self = this;
    // here we shoud seek the subset of cards that match action, currently only ALL
    const carduniqueid = btn.value; // btn.value is cardUniqueID
    if (btn.id === clearActionAll) self.internalAnswersObj = {};
    else if (btn.id === clearActionCard) delete self.internalAnswersObj[carduniqueid];
    else {
        // cardUniqueID  is cardset_chapter_cardname
        const uniqueIDarray = btn.value.split(cardUniqueIDSplitter);
        let keySearchString = btn.id === clearActionCardset ? uniqueIDarray[0] : uniqueIDarray[0] + cardUniqueIDSplitter + uniqueIDarray[1];
        let objKeys = Object.getOwnPropertyNames(self.internalAnswersObj).filter(id => id.startsWith(keySearchString));
        objKeys.forEach(function (key) {
            delete self.internalAnswersObj[key];
        });
    }
    self.cacheInternalAnswersObj();
};


AnswersRecord.prototype.importThisObjectStr = function (importString) {
    let self = this;
    let importObject = JSON.parse(importString);
    Object.getOwnPropertyNames(importObject).forEach(function (uniqueCardID) {
        self.internalAnswersObj[uniqueCardID] = importObject[uniqueCardID];
    });
    self.cacheInternalAnswersObj();
};

// =================================================================== UPDATED FUNCTIONS
function getAnswersRecordObjectFromCache() {
    let blankAnsRecObject = new AnswersRecord();
    if (!localStorage.getItem(ls_answersObjectkey)) {
        localStorage.setItem(ls_answersObjectkey, JSON.stringify(blankAnsRecObject));
    } else {
        blankAnsRecObject.rehydrate(localStorage.getItem(ls_answersObjectkey));

    }
    return blankAnsRecObject;
}

function handleAnswerModalDismissed(btn, resultString, uniqueCardID, answerIndex) {
    if (resultString !== answerEqual) {
        document.getElementById("div-answerButtonsHanger").children[answerIndex].className = btn.className;
        window.allRecordedAnswersArchiveObj.recordAnswerForCardUniqueID(resultString, uniqueCardID, answerIndex);
    }
}


function handleAnswerButtonClicked(thisButton, label_answer, selectedCardObj, answerIndex) {
    if (label_answer === revealButtonKey) revealAnswers(selectedCardObj);
    else {
        stopPlayingLabels();
        document.getElementById('aModal-body').innerHTML = answerStringFromAnswerTabString(label_answer, window.setting_language);
        document.getElementById('aModal-btn-correct').onclick = function () {
            handleAnswerModalDismissed(this, answerCorrect, selectedCardObj.uniqueCardID, answerIndex)
        };
        document.getElementById('aModal-btn-equal').onclick = function () {
            handleAnswerModalDismissed(this, answerEqual, selectedCardObj.uniqueCardID, answerIndex)
        };
        document.getElementById('aModal-btn-wrong').onclick = function () {
            handleAnswerModalDismissed(this, answerWrong, selectedCardObj.uniqueCardID, answerIndex)
        };
        $("#modal-answers").modal("show");
    }
}

// =================================================================== HTML

function showClearAnswersModal(toolbar) {
//put the uniqe card ID onto the buttons
    const cardUniqueID = getSelectCardsSelectedCardObjectUniqueCardID();
    document.getElementById(clearActionCardset).value = cardUniqueID;
    document.getElementById(clearActionChapter).value = cardUniqueID;
    document.getElementById(clearActionAll).value = cardUniqueID;
    document.getElementById(clearActionCard).value = cardUniqueID;
    if (toolbar) {
        toggleActionmenuToolbar();
        setTimeout(function () {
            $('#modalClearAnswers').modal();
        }, 500);
    } else $('#modalClearAnswers').modal();
}

function dontClearFavouritesOrAnswersForCurrentCardset() {
    // dont know why but fails unless we get off this option
    ["select-chapters", "select-chapters-toolbox", "select-chapters-dropdown"].forEach(chapselect => document.getElementById(chapselect).selectedIndex = "0");
    populateSelectChapterOnCardsetChange();
}

function getButtonClassForAnswer(answerStr) {
    if (answerStr === answerCorrect) return "btn bt-sm btn-success";
    else if (answerStr === answerWrong) return "btn bt-sm btn-outline-danger";
    else return window.setting_modeDarkLight === "modeDark" ? "btn bt-sm btn-dark" : "btn bt-sm btn-light";
}

function clearAllAnswerButtons() {
    document.getElementById("div-answerButtonsHanger").innerHTML = "";
}

function revealAnswers(selectedCardObj) {
    const colrevealanswers = document.getElementById("col-revealAnswers");
    colrevealanswers.hidden = !colrevealanswers.hidden;
    if (colrevealanswers.hidden) {
        toggleNotesLegendFromPostit();
    }
    hideTargetIcon();
    adjustCardWidthHeight();
    updateRevealLegendButtonForCardObj(selectedCardObj);
}

function saveAllRecordedAswers() {
    let exportObj = window.allRecordedAnswersArchiveObj.internalAnswersObj;
    if (Object.getOwnPropertyNames(exportObj).length > 0) {
        doExportObject(exportObj, "All recorded answers" + answersSuffix);
    } else {
        // as soon as you view a card a set of (unanswered ≈ status) answers is added to answersObj, so this is never true
        myAlert("No answers have been recorded -  nothing to save", myAlert_info);
    }
}

function saveAnswers(toolbar) {
    if (toolbar) toggleActionmenuToolbar();
// here check for all/cardset/chapter/card but for now -- all
    saveAllRecordedAswers();
}

function clearAnswersFromModal(btn) {
    window.allRecordedAnswersArchiveObj.clearAnswersFor(btn);
    loadCardImage();
}

function updateRevealLegendButtonForCardObj(selectedCardObj) {
    const colHidden = document.getElementById("col-revealAnswers").hidden;
    const revealFunc = function () {
        handleAnswerButtonClicked(this, revealButtonKey, selectedCardObj, revealButtonKey)
    };

    function setButtonClass(revealBt) {
        if (colHidden) {
            revealBt.classList.remove("btn-primary");
            revealBt.classList.add("btn-outline-primary");
            revealBt.title = "Show legend, annotations or side bar and post-it notes";
        } else {
            revealBt.classList.remove("btn-outline-primary");
            revealBt.classList.add("btn-primary");
            revealBt.title = "Hide legend, side bar or post-it notes";
        }
    }

    // omit btn-revealAnswers-maximise that is hidden by its own click
    ["btn-revealAnswers", "btn-revealAnswers-toolbox", "btn-revealAnswers-dropdown"].forEach((revealBt) => {
        // set button class for existing legend hide state
        const b = document.getElementById(revealBt);
        setButtonClass(b);
        b.onclick = revealFunc;
        b.hidden = false;
    });
    const revanswmax = document.getElementById("btn-revealAnswers-maximise");
    revanswmax.onclick = revealFunc;
    revanswmax.title = colHidden ? "Show legend, annotations or side bar and post-it notes" : revanswmax.title = "Hide legend, annotations or side bar and post-it notes";

}

function answersArrayFromSelectedCardObj(selectedCardObj, filterNote) {
    const array = splitTextByCharacterSkippingBlanks(selectedCardObj.answersText, "\n");
    if (filterNote && array.length > 0) return array.filter(a => {
        return !a.startsWith('Note')
    });
    else return array;
}

function titleAndNoteForCardObj(selectedCardObj) {
    const answersArray = answersArrayFromSelectedCardObj(selectedCardObj, false);
    let noteArray = answersArray.filter(a => {
        return a.startsWith('Note')
    });
    const note = noteArray.length > 0 ? noteArray[0].split("\t")[1] : "";
    return [selectedCardObj.title, note];
}

function resetLegendAnswers() {
    addLegendArrayToDiv(getSelectCardsSelectedCardObject());
}

function createAnswerButtonsForCardObject(selectedCardObj) {
    let btndiv = document.getElementById("div-answerButtonsHanger");
    clearAllAnswerButtons();
    // split answerText block by LF, removing any blank lines
    let answersArray = answersArrayFromSelectedCardObj(selectedCardObj, true);
    if (answersArray.length > 0) {
        let answerMatrix = window.allRecordedAnswersArchiveObj.getAnswerMatrixForCardOrMakeOne(selectedCardObj.uniqueCardID, answersArray.length);
        // make the answer buttons with necessary colours - attach the inner div in the column div-answerButtonsHanger
        answersArray.forEach(function (answerLabel_Answer, answerIndex) {
            const answerLabel_AnswerArray = answerLabel_Answer.split(answerSplitter);
            let bt = document.createElement('button');
            bt.className = getButtonClassForAnswer(answerMatrix[answerIndex]);
            bt.innerText = answerLabel_AnswerArray[0];
            const revealFunction = function () {
                handleAnswerButtonClicked(this, answerLabel_Answer, selectedCardObj, answerIndex)
            };
            bt.onclick = revealFunction;
            btndiv.appendChild(bt);
            document.getElementById("btn-revealAnswers-maximise").onclick = revealFunction;
        });
    }
    addLegendArrayToDiv(selectedCardObj);
}


function creatLegendParasAndTextFromAnswersArray(ansArray, indexOfNextQlabel) {
    //const endParaPads = "<br><br>";
    // coiuld have in sequence avoid Q->A->Q click click click, BUT the labels are sometimes unpredictable like 7' or 2,3,4 etc.
    if (indexOfNextQlabel >= ansArray.length) {
        if (indexOfNextQlabel >= ansArray.length) blinkElementHashID("#div-revealAnswers"); //$("#div-revealAnswers").fadeOut(100).fadeIn(100);
        return mapAnswersArrayToParas(ansArray.slice(0, indexOfNextQlabel), true).join(""); //+endParaPads;
    } else {
        if (indexOfNextQlabel === 1) {
            let nextQArray = ansArray.slice(0, indexOfNextQlabel + 1)[0].split(answerSplitter);
            return "\n<p' class='answersParas'>" + nextQArray[0] + " ⟶ ?</p>";
        } else {
            /* this logic is tricky to me as slice includes start to the index BEFORE end:
            so  ... alreadyRevealedAnswers = mapAnswersArrayToParas(ansArray.slice(0, indexOfNextQlabel-1)
                uses indexOfNextQlabel-1 as END but that row is not included
            and ... nextQArray = ansArray.slice(indexOfNextQlabel, indexOfNextQlabel + 1) also uses indexOfNextQlabel as START and it is included
             */
            let alreadyRevealedAnswers = mapAnswersArrayToParas(ansArray.slice(0, indexOfNextQlabel - 1), true).join("");
            let nextQArray = ansArray.slice(indexOfNextQlabel - 1, indexOfNextQlabel)[0].split(answerSplitter);
            let nextQ = "\n<p class='answersParas'>" + nextQArray[0] + " ⟶ ?</p>";
            return nextQ + alreadyRevealedAnswers;
        }

    }
}

function createLegendInstructions(i_setting_legendLabelsAppear) {
    const insert = i_setting_legendLabelsAppear === legendAppearsRandom ?
        "<span style='color: darkred'>random sequence </span>" :
        "<span style='color: black'>numerical order </span>";
    const randomiseSuggestion = i_setting_legendLabelsAppear === legendAppearsRandom ? "" :
        "<p class='legendInstructions'>Having labels appear in random order can be selected in Settings… and avoids the problem of accidentally memorising that one anatomical feature follows another in the sequence.</p>";
    return "<br><br><p style = 'color: grey; text-align: center;'>Repeatedly click the " +
        "<i class='fas fa-crosshairs' style = 'color:black;background-color:#00f900; width: 3em;border: 5px solid #00f900; border-radius: 5px;'></i> button above to show legend labels in<br>" +
        insert +
        "</p>" +
        "<p class='legendInstructions'>The first click reveals a label identifier and its location on the figure is highlighted with a target.<br>" +
        "The next click reveals the anatomical feature associated with that label, and shows the next label identifier to recognise.<br>" +
        "<This repeats until the last anatomical feature in the figure is revealed<br>" +
        "This allows you to quickly test your knowledge of this figure.<br>Labels will appear top-downwards so that the already identified labels scroll off the bottom of the page.<br>" +
        "Click the <i class='far fa-times-circle' style = 'color:white;background-color:grey; width: 3em;border: 5px solid grey; border-radius: 5px;'></i> button to reset.</p>" + randomiseSuggestion;
}

function showTargetsForHotspotsArrayDelayAndIndex(hotspotsarray, delay, itemClickedIndex) {
    const coordsForIndexArray = hotspotsarray.filter(coord => {
        return coord.split("\t")[2] === String(itemClickedIndex);
    });
    showTargetsForCoordinatesArrayWithDelay(coordsForIndexArray, delay);
}

function clearTargets() {
    const targetsHanger = document.getElementById("div-targetsHanger");
    //remove any existing children
    Array.from(targetsHanger.children).forEach(target => {
        hideMultiTarget(target, Number(target.getAttribute("data-targetIconTimeoutID")));
    });
    updateShowAllLabelsButton(true);
}

function showTargetsForCoordinatesArrayWithDelay(coordsArray, delay) {
    const targetsHanger = document.getElementById("div-targetsHanger");
    //remove any existing children
    clearTargets();
    coordsArray.forEach(coords => {
        const coordsSplit = coords.split("\t");
        const corrXY = hotspotXYcorrectedToDivTargetsHangerXY(coordsSplit);
        //window.coordsWaitingToBeTargetted==>coordsArray is an array of 1 because it returns the filtered item from ..hotspots.split("\n")
        //the filtered item is a tab delim string of X-Y-radius-LabelIndex.
        const labelIndex = coordsSplit[3];
        if (!!labelIndex && labelIndex !== "undefined") {
            const answer = answerStringFromAnswerTabString(getSelectCardsSelectedCardObject().answersText.split("\n")[labelIndex], window.setting_language);
            if (!!answer) {
                setPopupLabel(answer, false, undefined, true);
            }
        }
        const target = document.createElement('img');
        target.src = "img/targetgreen.png";
        target.style.left = corrXY[0] + "px";
        target.style.top = corrXY[1] + "px";
        target.classList.add("icon-target");
        const targetIconTimeoutID = setTimeout(function () {
            hideMultiTarget(target, targetIconTimeoutID);
            setPopupLabel("", true);
        }, delay);
        target.setAttribute("data-targetIconTimeoutID", String(targetIconTimeoutID));
        target.onclick = function () {
            hideMultiTarget(target, targetIconTimeoutID);
            setPopupLabel("", true);
        };
        targetsHanger.appendChild(target);
        setTimeout(function () {
            target.scrollIntoView(false);
        }, 500);
    });
}

function handleCoordsWaitingToBeTargetted() {
    if (window.coordsWaitingToBeTargetted !== undefined) {
        //make a local persistent copy of window.coordsWaitingToBeTargetted to remain in the callback
        const currentcoordsWaitingToBeTargetted = window.coordsWaitingToBeTargetted;
        setTimeout(function () {
            showTargetsForCoordinatesArrayWithDelay(currentcoordsWaitingToBeTargetted, targetTimeoutDurationLong)
        }, 500);
        window.coordsWaitingToBeTargetted = undefined;
    }
}

function hideTargetIcon() {
    clearTargets();
}

function hideMultiTarget(tgt, targetIconTimeoutID) {
    document.getElementById("div-targetsHanger").removeChild(tgt);
    clearTimeout(targetIconTimeoutID);
}

function clearSearchLegend() {
    const answersHanger = document.getElementById("div-revealAnswers");
    const answersChildren = answersHanger.children;
    const answersChildrenNum = answersChildren.length;
    answersHanger.hidden = true;
    for (let i = 0; i < answersChildrenNum; i++) {
        answersChildren[i].hidden = false;
    }
    answersHanger.hidden = false;
    document.getElementById("input-searchlegend").value = "";
    stopPlayingLabels();
}

function searchLegend() {
    const searchStr = document.getElementById("input-searchlegend").value.toLowerCase();
    if (searchStr.length > -1) {
        const answersHanger = document.getElementById("div-revealAnswers");
        const answersChildren = answersHanger.children;
        const answersChildrenNum = answersChildren.length;
        answersHanger.hidden = true;
        for (let i = 0; i < answersChildrenNum; i++) {
            const para = answersChildren[i];
            para.hidden = para.innerText.toLowerCase().includes(searchStr) === false;
        }
        answersHanger.hidden = false;
    }
}

function updateDivRevealAnswersForClick(selectedCardObj) {
    const divrevealansw = document.getElementById("div-revealAnswers");
    if (window.setting_legendLabelsAppear === legendAppearsAll && !!selectedCardObj.hotspots) {
        divrevealansw.classList.add("answersParasHotspots");
    } else {
        divrevealansw.classList.remove("answersParasHotspots");
    }

    const divrevealanswChildren = divrevealansw.children;
    const divrevealanswChildrenNum = divrevealanswChildren.length;
    for (let i = 0; i < divrevealanswChildrenNum; i++) {
        const para = divrevealanswChildren[i];
        //legend paras click only if legendAppearsAll and hs available
        if (window.setting_legendLabelsAppear === legendAppearsAll /*&& !!selectedCardObj.hotspots*/) {
            para.onclick = function (evt) {
                handleLegendItemClicked(evt/*, selectedCardObj.hotspots.split("\n")*/);
            };
        } else {
            para.onclick = undefined;
        }
    }
}

function showLabelsInRandom() {
    return document.getElementById("button-playRandom").value === 'random';
}

function shuffleRandomIndexArray() {
    window.answersRandomIndexArray = arrayOfIndicesForLength(document.getElementById("div-revealAnswers").children.length);
    shuffleThisArray(window.answersRandomIndexArray);
}

function playLegendClicked(btn) {
    btn.value = btn.value === "playing" ? 'paused' : 'playing';
    if (btn.value === 'playing') {
        shuffleRandomIndexArray();
        continuePlayingLabels();
        //hide the legend simply
        document.getElementById("btn-revealAnswers").click();
    } else pausePlayingLabels();
    showIconForLabelPlayButtonState(btn);
}

function showIconForLabelPlayButtonState(btn) {
    const iconPlay = document.getElementById("icon-labelPlay");
    if (btn.value === 'playing') {
        iconPlay.classList.remove("fa-play");
        iconPlay.classList.add("fa-pause");
        btn.title = "Pause showing labels in sequence"
    } else {
        iconPlay.classList.remove("fa-pause");
        iconPlay.classList.add("fa-play");
        btn.title = "Reveal labels in sequence"
    }
}

function clearPlayTimeouts() {
    clearTimeout(window.labelPlayRevealTimeout);
    clearTimeout(window.labelPlayTimeout);
    clearTimeout(window.labelPlayTargetHideTimeout);
}

function continuePlayingLabels() {
    clearPlayTimeouts();
    setPopupLabel("", true);
    clearTargets();
    const labelsHanger = document.getElementById("div-revealAnswers");
    const labels = labelsHanger.children;
    window.labelPlayIndex++;
    if (window.labelPlayIndex >= labels.length) window.labelPlayIndex = 0;
    const labelIndex = showLabelsInRandom() ? window.answersRandomIndexArray[window.labelPlayIndex] : window.labelPlayIndex;
    //pause a moment before showing the next target
    window.labelPlayTargetHideTimeout = setTimeout(function () {
        labels[labelIndex].click();
        //clear the target quickly
        window.labelPlayTargetHideTimeout = setTimeout(function () {
            clearTargets();
        }, 1000);
        //show the popup after a delay
        window.labelPlayRevealTimeout = setTimeout(function () {
            speakLabel(labelIndex);
            setPopupLabel(labels[labelIndex].innerHTML, false);
            // hide the popup after the same delay
            window.labelPlayTimeout = setTimeout(function () {
                continuePlayingLabels();
            }, window.labelPlayDelay * 1000);
        }, window.labelPlayDelay * 1000);
    }, 500);
}

function speakLabel(labelIndex) {
    if (window.speakLabels === true) {
        const answer = answersArrayFromSelectedCardObj(getSelectCardsSelectedCardObject(), true)[labelIndex];
        let utterance;
        const answersplit = answer.split("\t");
        switch (window.setting_language) {
            case languageFirst:
                utterance = answersplit[0] + "; " + answersplit[1] + "; ";
                break;
            case languageSecond:
                //we may have only one language somehow so just avoid undefined
                if (answersplit.length > 2) utterance = answersplit[0] + "; " + answersplit[2] + "; "; else utterance = answer.replace(/\t/gi, "; ");
                break;
            default:
                utterance = answer.replace(/\t/gi, "; ");
        }
        const speech = new SpeechSynthesisUtterance(utterance);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
    }
}

function pausePlayingLabels() {
    window.speechSynthesis.cancel();
    clearPlayTimeouts();
    clearTargets();
    setPopupLabel("", true);
}

function stopPlayingLabels() {
    window.labelPlayIndex = -1;
    shuffleRandomIndexArray();
    //force a pause even if we are not yet playing
    const btn = document.getElementById("button-playLegend");
    btn.value = 'paused';
    showIconForLabelPlayButtonState(btn);
    pausePlayingLabels();
}

function playRandomClicked(btn) {
    btn.value = btn.value === "order" ? 'random' : 'order';
    showIconForLabelPlayRandomButtonState(btn);
    localStorage.setItem(ls_labelsPlayRandom, btn.value);
}

function showIconForLabelPlayRandomButtonState(btn) {
    if (btn.value === 'random') {
        btn.classList.remove("btn-outline-success");
        btn.classList.add("btn-success");
        btn.title = "Don't shuffle reveal order"
    } else {
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline-success");
        btn.title = "Shuffle reveal order"
    }
}

/* ******************** */

function toggleElementVisibility(element) {
    if (!!element) element.style.visibility = element.style.visibility === "visible" ? "hidden" : "visible";
}

function toggleLegendTextItemsVisibility(btn, action) {
    btn.blur();
    for (const legtext of document.getElementById("div-revealAnswers").getElementsByClassName("legend-text"))
        legtext.style.visibility = action;
}

function handleLegendItemClicked(evt) {
    if (evt.target.className.includes('subhead')) toggleElementVisibility(evt.target.parentNode.getElementsByClassName('legend-text')[0]);
}

function addLegendArrayToDiv(selectedCardObj) {
    let answersArray = answersArrayFromSelectedCardObj(selectedCardObj, true);
    const divLegend = document.getElementById("div-revealAnswers");
    divLegend.innerHTML = '<div class="container container-fluid stripedrows"' +
        // we must override container container-fluid padding and width
        ' style="padding:0; margin:0; width:100%; min-width:100%;">' +
        mapAnswersArrayToParas(answersArray) + '</div>';
    divLegend.scrollTop = 0;
    //must call updateDivRevealAnswersForClick LAST to ensure paras are labelled correctly
    updateDivRevealAnswersForClick(selectedCardObj);
}

function mapAnswersArrayToParas(answersArray) {
    //calc the length of the longest subhead
    let maxLen = 0;
    for (const ans of answersArray) maxLen = Math.max(maxLen, getStringCharacterLength(ans.split("\t")[0]));
    return answersArray.map(function (answer) {
        return answerStringFromAnswerTabString(answer, maxLen);
    }).join("");
}

function answerStringFromAnswerTabString(answerTabString) {
    if (!!answerTabString) {
        const answerArray = answerTabString.split(answerSplitter);
        return '<div class="row d-flex align-items-center"><div class="col-3 legend-subhead">' +
            answerArray[0] + '</div>' +
            '<div class="col legend-text" style="visibility: ' + (initiallyHideText ? 'hidden' : 'visible') + ';">' +
            answerArray[1] + '</div></div>';
    } else return "";
}
