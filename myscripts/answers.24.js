/******************************************************************************
 * Copyright (c) 12/11/2021 6:26     djml.uk E&OE.                            *
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

function addLegendArrayToDiv(selectedCardObj) {
    let answersArray = answersArrayFromSelectedCardObj(selectedCardObj, true);
    const divLegend = document.getElementById("div-revealAnswers");

    // let imgSrc;
    // if(document.getElementById("select-cardsset").value.startsWith("Picture")) {
    //     //strip off the "p1" etc from the ImgName in Picture Quiz
    //     const imgname = selectedCardObj.name.split(" ").slice(0,2).join(" ");
    //     imgSrc = lifecyclesfolderpath + imgname + '.png' +lifecyclesVersion ;
    // } else imgSrc = lifecyclesfolderpath + selectedCardObj.name + '.png' +lifecyclesVersion ;

    divLegend.innerHTML = '<div class="container container-fluid stripedrows"' +
        // we must override container container-fluid padding and width
        ' style="padding:0; margin:0; width:100%; min-width:100%;">' +
        mapAnswersArrayToParas(answersArray) +
        '</div></div>'+

        '</div>';
    divLegend.scrollTop = 0;
    //must call updateDivRevealAnswersForClick LAST to ensure paras are labelled correctly
    updateDivRevealAnswersForClick(selectedCardObj);
}

function mapAnswersArrayToParas(answersArray) {
    //calc the length of the longest subhead
    let maxLen = 0;
    for (const ans of answersArray) maxLen = Math.max(maxLen, getStringCharacterLength(ans.split("\t")[0]));
    return answersArray.map(answer=>{
        return answerStringFromAnswerTabString(answer, maxLen);
    }).join("");
}

function answerStringFromAnswerTabString(answerTabString) {
    if (!!answerTabString) {
        const answerArray = answerTabString.split(answerSplitter);
        if(answerArray[0].includes('Diagnosis')) bold = 'font-weight: bold;'
        return '<div class="row'+
            ' d-flex align-items-center"><div class="col-2 legend-subhead">' +
            answerArray[0] + '</div>' +
            '<div class="col legend-text" style="' +
            (answerArray[0].includes('Diagnosis') ? 'font-weight: bold; color: #941651;' : '') +
            ' visibility: ' + (initiallyHideText ? 'hidden' : 'visible') + ';">' +
            answerArray[1].replaceAll('¶','<br>') + '</div></div>';
    } else return "";
}
