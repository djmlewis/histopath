/******************************************************************************
 * Copyright (c) 14/2/2021 4:22     djml.uk E&OE.                             *
 ******************************************************************************/

/******************************************************************************
 * Copyright (c) 30/1/2020 11:23     djml.uk E&OE.                            *
 ******************************************************************************/
function hotspotsCoordsArrayFromCardObj(cardObj) {
    const coordsArray = cardObj.hotspots.split("\n");
    // remove the first row which is diameter
    coordsArray.shift();
    return coordsArray;
}

function handlePageUpDown(pagedown) {
    const hs = getSelectCardsSelectedCardObjectHotspotsArray();
    const answersArray = getSelectCardsSelectedCardObject().answersText.split("\n");
    window.showingAllTargetIndex = pagedown === true ? window.showingAllTargetIndex + 1 : window.showingAllTargetIndex - 1;
    window.showingAllTargetIndex = Math.max(0, window.showingAllTargetIndex);
    window.showingAllTargetIndex = Math.min(answersArray.length - 1, window.showingAllTargetIndex);
    showTargetsForHotspotsArrayDelayAndIndex(hs, targetTimeoutDurationLong, window.showingAllTargetIndex);
    const answer = answerStringFromAnswerTabString(answersArray[window.showingAllTargetIndex], window.setting_language);
    setPopupLabel(answer, false);
}

function showAllTargetsToggle() {
    const showalltargetsbtn = document.getElementById("btn-showAllTargets");
    showalltargetsbtn.toggleAttribute("hidden");
    window.showingAllTargets = showalltargetsbtn.hidden === false;
    clearTargets();
    setPopupLabel("", true);
}

function showAllTargets() {
    const coordsArray = hotspotsCoordsArrayFromCardObj(getSelectCardsSelectedCardObject());
    const targetsHanger = document.getElementById("div-targetsHanger");
    clearTargets();
    coordsArray.forEach(coords => {
        const coordsSplit = coords.split("\t");
        const corrXY = hotspotXYcorrectedToDivTargetsHangerXY(coordsSplit);
        const target = document.createElement('img');
        target.src = "img/targetcircle.png";
        target.style.left = corrXY[0] + "px";
        target.style.top = corrXY[1] + "px";
        target.classList.add("icon-target");
        targetsHanger.appendChild(target);
    });
}

function showAllLabels(btn) {
    btn.blur();
    const targetsHanger = document.getElementById("div-targetsHanger");
    if(targetsHanger.querySelector("div")){
        clearTargets();
    }
    else {
        const card = getSelectCardsSelectedCardObject();
        const labels = answersArrayFromSelectedCardObj(card, true);
        const coordsArray = hotspotsCoordsArrayFromCardObj(card);
        window.allLabelsLabelOnTopIndex=coordsArray.length;
        clearTargets();
        // must come after clearTargets as that sets icon to eye
        updateShowAllLabelsButton(false);
        coordsArray.forEach((coords, i) => {
            const coordsSplit = coords.split("\t");
            const corrXY = hotspotXYcorrectedToDivTargetsHangerXY(coordsSplit);
            const label = document.createElement('div');
            label.style.zIndex = (i + 1).toString();
            if (!!labels[coordsSplit[2]]) label.innerHTML = answerStringFromAnswerTabString(labels[coordsSplit[2]], window.setting_language, "none");
            label.style.left = corrXY[0] + "px";
            label.style.top = corrXY[1] + "px";
            label.classList.add("allLabelslabel");
            label.classList.add("rounded");
            label.onclick = () => allLabelsLabelClicked(label);
            targetsHanger.appendChild(label);
        });
    }
}
function updateShowAllLabelsButton(show) {
    ["button-showLabelsAll-icon","button-showLabelsAll-icon-maximise","button-showLabelsAll-icon-dropdown", "button-showLabelsAll-icon-toolbox"].forEach(e => {
        const el=document.getElementById(e);
        if(show){
            el.classList.remove("fa-eye-slash");
            el.classList.add("fa-eye");
        } else {
            el.classList.remove("fa-eye");
            el.classList.add("fa-eye-slash");
        }
        el.parentElement.title= (show ? "Show" : "Hide") + " all labels on figure";
    });
}
function allLabelsLabelClicked(label) {
    window.allLabelsLabelOnTopIndex += 1;
    label.style.zIndex = (window.allLabelsLabelOnTopIndex).toString();
}

function cardUniqueIDhasHotspots(cardUniqueID) {
    const cardObj = getCardObjFromUniqueCardIDwithSplitter(cardUniqueID, cardUniqueIDSplitter);
    return !!cardObj && !!cardObj.hotspots;
}

function clickIsInHotspot(e, selectedCardObj, showLabel) {
    let hotspots = selectedCardObj.hotspots;
    if (!!hotspots) {
        let hsArray = hotspots.split("\n");
        let radius = hsArray[0].split("\t")[0];
        return hsArray.splice(1, hsArray.length).some(function (hscoord, index) {
            return clickInsideHotspotCoordsArray(e, hscoord, radius, index, showLabel, selectedCardObj);
        })
    }
    return false;
}
/* HOTSPOTS */
function hotspotXYcorrectedToDivTargetsHangerXY(coords) {
    const cardimage = window.imageCard;
    let xCorr = (coords[0] * (cardimage.width / cardimage.naturalWidth)) + cardimage.offsetLeft;
    let yCorr = (coords[1] * (cardimage.height / cardimage.naturalHeight)) + cardimage.offsetTop;
    /* crushed */
    if (setting_cardIsRotatedIsTrue()) {
        // As we are using the DIV to place targets we must take account of transforms as the DIV is operating on untransformed screen coords
        // -90deg rotation (x,y)--->(y,-x).
        // Plus the translation which is +img.width as the image flips up with its width above the X axis so we slide it down by its width
        // remember the transform is visual only - width become visual height but the element width is still its width property
        xCorr = (coords[1] * (cardimage.width / cardimage.naturalWidth)) + cardimage.offsetLeft;
        yCorr = (-coords[0] * (cardimage.height / cardimage.naturalHeight)) + cardimage.offsetTop +cardimage.width;
    } else { }
    return [xCorr, yCorr];
}

function clickInsideHotspotCoordsArray(e, hscoord, radius, index, showLabel, selectedCardObj) {
    const cardimage = e.target;
    /* offsetX and Y take account of transformations! There is no need to do any correction other than the usual size scale for screen size */
    let xCorr = (e.offsetX / (cardimage.width / cardimage.naturalWidth));
    let yCorr = (e.offsetY / (cardimage.height / cardimage.naturalHeight));

    let hsXYArray = hscoord.split("\t");
    let insideCircle = Math.hypot(Math.abs(parseInt(hsXYArray[0]) - xCorr), Math.abs(parseInt(hsXYArray[1]) - yCorr)) < radius;
    if (insideCircle) {
        const answer = answerStringFromAnswerTabString(selectedCardObj.answersText.split("\n")[hsXYArray[2]], window.setting_language);
        if (showLabel === "click") {
            document.getElementById("body-modal-popuplegend").innerHTML = answer;
            setPopupLabel("", true);
            $('#modal-popuplegend').modal();
        } else if (showLabel === hotspotOnHover) {
            setPopupLabel(answer, false, e);
        }
    }
    return insideCircle;
}

function setPopupLabel(text, hide, e, forceTC) {
    document.getElementById("span-hoverLegendlabel").innerHTML = text;
    const popupDiv = document.getElementById("div-hoverLegendlabel");
    popupDiv.hidden = hide;
    if(!hide && window.hoverOnCursor && forceTC) {
        // we are targeting from Search with no cursor position - move the banner to top left
        popupDiv.style.left = (window.innerWidth /2)-(popupDiv.getBoundingClientRect().width/2)+"px";
        popupDiv.style.top = "4px";
    }
    if (hide === false && !!e && window.hoverOnCursor) {
        if (e.pageX < window.innerWidth / 2) popupDiv.style.left = (e.pageX + 10) + "px";
        else popupDiv.style.left = (e.pageX - popupDiv.clientWidth - 10) + "px";
        popupDiv.style.top = (e.pageY - popupDiv.clientHeight / 2) + "px";
    }
}