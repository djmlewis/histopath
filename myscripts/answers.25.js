/******************************************************************************
 * Copyright (c) 16/11/2021 4:12     djml.uk E&OE.                            *
 ******************************************************************************/
function answersArrayFromSelectedCardObj(selectedCardObj, filterNote) {
    const array = splitTextByCharacterSkippingBlanks(selectedCardObj.answersText, "\n");
    if (filterNote && array.length > 0) return array.filter(a => {
        return !a.startsWith('Note')
    });
    else return array;
}

/* ******** ADDED FOR PA  ************ */
function updateDivRevealAnswersForClick() {
    const divrevealansw = document.getElementById("div-revealAnswers");
    const divrevealanswChildren = divrevealansw.children;
    const divrevealanswChildrenNum = divrevealanswChildren.length;
    for (let i = 0; i < divrevealanswChildrenNum; i++) {
        divrevealanswChildren[i].onclick = function (evt) {
            handleLegendItemClicked(evt);
        };
    }
}
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

function addLegendArrayToDiv(selectedCardObj, divLegend, isRevealAnswers) {
    let answersArray = answersArrayFromSelectedCardObj(selectedCardObj, true);
    let answers = mapAnswersArrayToParas(answersArray, isRevealAnswers);
    // we must override container container-fluid padding and width
    let rowStripes = isRevealAnswers ? ' stripedrows" style="padding:0; margin:0; width:100%; min-width:100%;">' :
        ' stripedrowsFullScreen" style="padding:0; margin:0; width:100%; min-width:100%;">'
    divLegend.innerHTML = '<div class="container container-fluid' +
        rowStripes +
        answers +
        '</div></div>'+
        '</div>';
    divLegend.scrollTop = 0;
    //must call updateDivRevealAnswersForClick LAST to ensure paras are labelled correctly
    if(isRevealAnswers) updateDivRevealAnswersForClick(selectedCardObj);
}

function mapAnswersArrayToParas(answersArray, isRevealAnswers) {
    //calc the length of the longest subhead
    //let maxLen = 0;
    //for (const ans of answersArray) maxLen = Math.max(maxLen, getStringCharacterLength(ans.split("\t")[0]));
    return answersArray.map(answer=>{
        return answerStringFromAnswerTabString(answer, isRevealAnswers);
    }).join("");
}

function answerStringFromAnswerTabString(answerTabString, isRevealAnswers) {
    if (!!answerTabString) {
        let doInitiallyHideText = isRevealAnswers ? initiallyHideText : false;
        const answerArray = answerTabString.split(answerSplitter);
        return '<div class="row'+
            ' d-flex align-items-center"><div class="col-2 legend-subhead">' +
            answerArray[0] + '</div>' +
            '<div class="col legend-text" style="' +
            (answerArray[0].includes('Diagnosis') ? 'font-weight: bold; color: #941651;' : '') +
            ' visibility: ' + (doInitiallyHideText ? 'hidden' : 'visible') + ';">' +
            answerArray[1].replaceAll('¶','<br>') + '</div></div>';
    } else return "";
}
