/******************************************************************************
 * Copyright (c) 16/2/2021 2:3     djml.uk E&OE.                              *
 ******************************************************************************/
let draggingUnderway = false;
let doodleDragStartOffset = [0,0];
let doodleDragStartTranslation = [0, 0];
let doodleRotateStartTranslation = [0, 0];
let doodleResizeStartOffset = null;
window.svgResizeDelta = [0, 0];
//const transformIndexTranslate = 0;
//const transformIndexScale = 1;
//const transformIndexRotate = 0;
window.resizeDG = null;
window.resizeDO = null;
window.resizeTXR = null;
window.resizeDOtagName = undefined;
window.draggingDOtagName = undefined;
let doodleResizeRotateAngleTan = 0;
let resizeDOrxry = [0, 0];
let resizeDOcxcy = [0, 0];
let dragDOcxcy = [0, 0];
window.draggingDG = null;
window.draggingDO = null;
const hnsweRadius = (window.matchMedia("(any-pointer: coarse)").matches) ? 60 : 50;
const hnsweRadiusHalf = hnsweRadius / 2;
const hnsweRadiusQuarter = hnsweRadius / 4;
const hnsweRadiusReduced = hnsweRadius * 0.7;
const resizeMinWH = 40;
const resizeMinWHLine = 60;

let doodleInitialRotateAngle = undefined;
window.rotateDG = null;
window.rotateDO = null;
let rotcenter = 0;
const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;
let startAngleOfTwist = 0;
const emptySVGstr = "<defs></defs>";

const strokeWidthFactor = 4;
const strokeWidthFontSizeFactor = 4;
const deltaXfontSizeFactor = 10;
let textStartingFontSize = 0;
let textMinFontSize = 12;

// ================================================= Startup
function clearSVGdoodlesOnCardLoad() {
    // hide the palette if visib;e
    if (!document.getElementById("div-doodlepalette").hidden) inactivatePostitsAndDoodles();
    emptyDoodlesSVG();
    setDoodlesSVGNoPointerEvents(true);
}

function updateSVGdoodlesOnCardImageLoad() {
    //this get calls AFTER the new card image has actually loaded so we can use its dimensions
    //window.svgDoodles.setAttributeNS(null, 'viewBox', [0, 0, window.imageCard.naturalWidth, window.imageCard.naturalHeight].join(" "));
    // handleCardImageLoad actually loads the doodles SVG
}

function updateSVGdoodlesOnPostitsDoodlesRecordLoad() {
/*
    //called when postits has loaded the postitsrecord so we can use it
    if (!!window.postitsDoodlesRecordForSelectedCard && !!window.postitsDoodlesRecordForSelectedCard[dbNotes_svgHTML]) {
        window.svgDoodles.innerHTML = window.postitsDoodlesRecordForSelectedCard[dbNotes_svgHTML];
        restoreEventsToAllHandles();
    }
*/
}

function restoreEventsToAllHandles() {
    addDragEventsToAllDoodles();
    addResizeEventsToAllHandles();
    addRotateEventsToAllHandles();
    addDeleteEventsToAllHandles();
}

function adjustSVGdoodlesSize(cardimage) {
/*
    //do svgdoodles. Because, iunlike postitshanger, it rotates with the cardimage, it can just mimic the card image dimensions without trnsposition
    const svgdoodles = document.getElementById("svg-doodles");
    svgdoodles.style.width = cardimage.width + "px";
    svgdoodles.style.height = cardimage.height + "px";
    svgdoodles.style.left = cardimage.offsetLeft + "px";
    svgdoodles.style.transformOrigin = setting_cardIsRotatedIsTrue() ? "top left" : "50% 50%";
    svgdoodles.style.transform = setting_cardIsRotatedIsTrue() ? "translate(0," + cardimage.width + "px) rotate(-90deg)" : "none";
*/
}

// ================================================= db
function updateDoodleGroupToDB(doodleG) {
    setAllDoodlesActiveStatus(false);
    clearAllDoodlesSelectedStatus();
    window.postitsDoodlesRecordForSelectedCard[dbNotes_svgHTML] = window.svgDoodles.innerHTML;
    setAllDoodlesActiveStatus(true);
    selectThisDoodlesGroup(doodleG, false, false);
    addOrUpdatePostitDoodlesRecordForCardToDB();
}

function importMergeSVGwithRecord(record, suffix) {
    const suffix_ = "_" + suffix;
    const impsvg = document.createElementNS(doodlexmlns, 'svg');
    impsvg.innerHTML = record.svgHTML;
    const defs = impsvg.getElementsByTagNameNS(doodlexmlns, 'defs')[0];
    //add suffix to impsvg's defs, then add window.svgDoodles's defs to impsvg's defs
    if (!!defs) {
        for (const def of defs.children) {
            def.id += suffix_;
        }
        for (const existdef of window.svgDoodles.getElementsByTagNameNS(doodlexmlns, 'defs')[0].children) {
            const nMarker = document.createElementNS(doodlexmlns, 'marker');
            defs.appendChild(nMarker);
            nMarker.outerHTML = existdef.outerHTML;
        }
    }
    // add suffix to the marker ids in impsvg
    for (const element of impsvg.getElementsByTagNameNS(doodlexmlns, 'line')) {
        const mid = element.getAttributeNS(null, 'data-mid') + suffix_;
        element.setAttributeNS(null, 'data-mid', mid);
        element.setAttributeNS(null, 'marker-start', "url('#" + mid + "')");
    }
    // add window.svgDoodles elements (non-defs) to impsvg
    for (const element of window.svgDoodles.children) {
        if (element.tagName !== 'defs') {
            const nG = document.createElementNS(doodlexmlns, element.tagName);
            impsvg.appendChild(nG);
            nG.outerHTML = element.outerHTML;
        }
    }
    //copy the new innerHTML to the record
    record.svgHTML = impsvg.innerHTML;
}

// ================================================= Doodle hanger IBactions
function handleSVGdoodleClick(e) {
    //cllts(...e.target.classList);
    if (e.target === window.svgDoodles) {
        e.stopPropagation();
        e.preventDefault();
        if (!window.selectedDoodleGroup) addNewDoodleGroupToFigure(true, [e.offsetX, e.offsetY]);
        // we delay draggingUnderway=false in edndrag so this is still here for the click event Firefox allows through
        else if (!draggingUnderway) setNoDoodleIsNowSelected();
    }
}

// ================================================= svg-doodles
function emptyDoodlesSVG() {
    window.svgDoodles.innerHTML = emptySVGstr;
    if (!!window.postitsDoodlesRecordForSelectedCard) window.postitsDoodlesRecordForSelectedCard[dbNotes_svgHTML] = emptySVGstr;
}

function setNoDoodleIsNowSelected() {
    clearAllDoodlesSelectedStatus();
    setupDoodlePalette(null);
    window.svgDoodles.classList.add("svg-doodles-allowAdd");
}

function setAllDoodlesActiveStatus(active) {
    for (let doodles of window.svgDoodles.getElementsByClassName('doodle')) {
        if (active) doodles.classList.add('doodle-active');
        else doodles.classList.remove('doodle-active');
    }
}

function clearAllDoodlesSelectedStatus() {
    for (let handles of window.svgDoodles.getElementsByClassName('doodleHandlesGroup')) {
        handles.classList.add('doodleHandlesGroupHidden');
    }
    for (let doodles of window.svgDoodles.getElementsByClassName('doodle')) {
        doodles.classList.remove('doodle-selected');
    }
    window.selectedDoodleGroup = null;
    hideSelectedDoodlePaletteBtns(true);
}

function setDoodlesSVGNoPointerEvents(none) {
    if (none) {
        window.svgDoodles.classList.remove("svg-doodles-active");
        window.svgDoodles.classList.remove("svg-doodles-allowAdd");
        document.getElementById("div-postitsHanger").classList.remove("div-postitsHanger-doodlesActive");
    } else {
        window.svgDoodles.classList.add("svg-doodles-active");
        window.svgDoodles.classList.add("svg-doodles-allowAdd");
        document.getElementById("div-postitsHanger").classList.add("div-postitsHanger-doodlesActive");
    }
    clearAllDoodlesSelectedStatus();
    setAllDoodlesActiveStatus(!none);
}

function addNewDoodleGroupToFigure(add, coords) {
    let doodleG;
    if (add) {
        let shapeType = document.getElementById('btngp-doShape').getElementsByClassName('active')[0].getAttribute('data-shape');
        if (shapeType === 'text' && document.getElementById("textarea-doodle").value.length === 0) blinkElementHashID("#textarea-doodle");
        else {
            const radius = Math.min(window.imageCard.naturalWidth, window.imageCard.naturalHeight) / 10;
            shapeType = shapeType === 'line' ? markerTypeSelected() : shapeType;
            const valuesObj = {
                type: shapeType,
                radiusx: radius,
                radiusy: radius
            };
            addDOpaletteValuesToValuesObject(valuesObj);
            doodleG = newDoodleGroupWithValuesAndCoords(valuesObj, correctfigHangerXYNoRotation_float(coords, hangerToFig));
            window.svgDoodles.appendChild(doodleG);
            //addHandlesToDoodleShape must come after appendChild so the Doodle has a bbox
            const doodleShape = doodleG.getElementsByClassName('doodle')[0];
            addHandlesToDoodleShape(doodleShape);
            addTextRectToDoodleShape(doodleShape, valuesObj.fill, doodleG);
            updateDoodleGroupToDB(doodleG);
        }
    }
}

// ================================================= doodles
function newDoodleGroupWithValuesAndCoords(valuesObj, coords) {
    // doodle is now held inside a group to rotate
    const dsgroup = document.createElementNS(doodlexmlns, "g");
    dsgroup.classList.add('doodle-shape-group');
    let doodle = elementOfTypeWithCoords(valuesObj, coords);
    doodle.classList.add('doodle');
    doodle.classList.add('doodle-active');
    //record the type and stroke/fill attributes for palette setup as we must preserve hsla and how to apply them
    //do it here as it is only here we care about an element's attributes
    addValuesObjDataAtrributesToDoodle(doodle, valuesObj);
    addTransformMatrixToDoodleShapeGroup(dsgroup);
    addDragEventsToDoodle(doodle);
    dsgroup.appendChild(doodle);

    let widthHeight;
    switch (valuesObj.type) {
        case 'text':
        case 'ellipse':
        case 'rect':
            widthHeight = [valuesObj.radiusx, valuesObj.radiusy];
            break;
        case 'line':
        case 'lineArrow':
        case 'lineDot':
        case 'lineThumbtack':
            widthHeight = [valuesObj.radiusx / 2, valuesObj.radiusy / 2];
            break;
        default:
            widthHeight = [0, 0];
    }

    const group = document.createElementNS(doodlexmlns, "g");
    group.classList.add('doodle-group');
    addTransformMatrixToDoodleGroup(group);
    group.appendChild(dsgroup);
    return group;
}

function elementOfTypeWithCoords(valuesObj, coords) {
    //coords are integers without px
    //fix lineArrowDot for tagName
    let elementTagName;
    switch (valuesObj.type) {
        case 'lineArrow':
        case 'lineDot':
        case 'lineThumbtack':
            elementTagName = 'line';
            break;
        default:
            elementTagName = valuesObj.type;
    }

    const element = document.createElementNS(doodlexmlns, elementTagName);
    // these can be over-ridden
    if (!!valuesObj["strokewidth"]) element.setAttributeNS(null, "stroke-width", valuesObj["strokewidth"]);
    if (!!valuesObj["stroke"]) element.setAttributeNS(null, "stroke", valuesObj["stroke"]);
    switch (valuesObj.type) {
        case 'text':
            element.setAttributeNS(null, "x", coords[0]);
            element.setAttributeNS(null, "y", coords[1]);
            element.setAttributeNS(null, "stroke-width", "1");
            element.setAttributeNS(null, "fill", valuesObj["stroke"]);
            element.style.fontSize = (strokeWidthFontSizeFactor * valuesObj["strokewidth"]) + "px";
            addMultiLineTextFromString(element, coords[0], valuesObj["text"]);
            element.classList.add('svg-text');
            break;
        case 'ellipse':
            element.setAttributeNS(null, "rx", valuesObj["radiusx"]);
            element.setAttributeNS(null, "ry", valuesObj["radiusy"]);
            element.setAttributeNS(null, "cx", coords[0] + valuesObj["radiusx"]);
            element.setAttributeNS(null, "cy", coords[1] + valuesObj["radiusy"]);
            if (!!valuesObj["fill"]) element.setAttributeNS(null, "fill", valuesObj["fill"]);
            break;
        case 'rect':
            /* Handles on lines may get flipped into negative values so abs seems to work OK */
            element.setAttributeNS(null, "width", (Math.abs(valuesObj["radiusx"] * 2)).toString());
            element.setAttributeNS(null, "height", Math.abs((valuesObj["radiusy"] * 2)).toString());
            element.setAttributeNS(null, "x", coords[0]);
            element.setAttributeNS(null, "y", coords[1]);
            if (!!valuesObj["fill"]) element.setAttributeNS(null, "fill", valuesObj["fill"]);
            break;
        case 'line':
        case 'lineArrow':
        case 'lineDot':
        case 'lineThumbtack':
            element.setAttributeNS(null, "x1", coords[0]);
            element.setAttributeNS(null, "y1", coords[1]);
            element.setAttributeNS(null, "x2", coords[0] + valuesObj["radiusx"]);
            element.setAttributeNS(null, "y2", coords[1] + valuesObj["radiusy"]);
            element.setAttributeNS(null, "data-markerType", valuesObj.type);
            element.setAttributeNS(null, "stroke-linecap", "round");
            if (valuesObj.type !== 'line') addMarkerToElement(element, valuesObj);
            break;
    }
    return element;
}

function addValuesObjDataAtrributesToDoodle(doodle, valuesObj) {
    for (const attr of ["type", "fill", "stroke", "strokewidth", "text", "fillhue", "fillalpha", "strokehue", "strokealpha"]) {
        doodle.setAttributeNS(null, 'data-' + attr, (valuesObj[attr]));
    }
}

function addMultiLineTextFromString(element, x, string) {
    element.innerHTML = "";
    string.split(/\n|\r\n|\r/g).forEach((line, i) => {
            const ts = document.createElementNS(doodlexmlns, "tspan");
            ts.setAttributeNS(null, "x", x);
            ts.setAttributeNS(null, "dy", (i === 0 ? "0" : "1.2em"));
            ts.innerHTML = line.trim();
            ts.classList.add("doodle-textspan");
            element.appendChild(ts);
        }
    );
}

function selectThisDoodlesGroup(doodleG, isDoodle, updatepalette) {
    clearAllDoodlesSelectedStatus();
    if (!!doodleG) {
        //doodle is now inside a rotating group
        const dgroup = isDoodle ? doodleG.parentNode.parentNode : doodleG;
        for (let handles of dgroup.getElementsByClassName('doodleHandlesGroup')) {
            handles.classList.remove('doodleHandlesGroupHidden');
        }
        dgroup.getElementsByClassName('doodle')[0].classList.add("doodle-selected");
        window.selectedDoodleGroup = dgroup;
        hideSelectedDoodlePaletteBtns(false);
        if (updatepalette) setupDoodlePalette(doodleG);
        window.svgDoodles.classList.remove("svg-doodles-allowAdd");
    } else {
        window.selectedDoodleGroup = null;
        hideSelectedDoodlePaletteBtns(true);
        setupDoodlePalette(null);
        window.svgDoodles.classList.add("svg-doodles-allowAdd");
    }
}

function addHandlesToGroupWithCoords(group, radii, coords, type) {
    const corrCoords = type.startsWith('line') ? [coords[0], coords[1]] : coords;
    const handles = document.createElementNS(doodlexmlns, "g");
    handles.classList.add("doodleHandlesGroup");
    const doodleShapeGroup = group.getElementsByClassName('doodle-shape-group')[0];
    const tfmList = handles.transform.baseVal;
    const transform = window.svgDoodles.createSVGTransform();
    transform.setMatrix(doodleShapeGroup.transform.baseVal.getItem(0).matrix);
    tfmList.initialize(transform);
    const reverseRotation = -doodleShapeGroup.transform.baseVal.getItem(0).angle;

    const handleNESW = elementOfTypeWithCoords(
        {type: "ellipse", radiusx: hnsweRadiusHalf, radiusy: hnsweRadiusHalf},
        [corrCoords[0] + radii[0] * 2 - hnsweRadius * 1.2, corrCoords[1] + radii[1] * 2 + hnsweRadiusQuarter]);
    addResizeEventsToHandle(handleNESW);
    handleNESW.classList.add("handleNESW");
    handleNESW.classList.add("doodleHandle");
    handles.appendChild(handleNESW);
    const spriteExpand = document.createElementNS(doodlexmlns, "svg");
    spriteExpand.setAttributeNS(null,'viewBox',"0 0 448 512");//448 512
    spriteExpand.innerHTML='<path d="M448 344v112a23.94 23.94 0 0 1-24 24H312c-21.39 0-32.09-25.9-17-41l36.2-36.2L224 295.6 116.77 402.9 153 439c15.09 15.1 4.39 41-17 41H24a23.94 23.94 0 0 1-24-24V344c0-21.4 25.89-32.1 41-17l36.19 36.2L184.46 256 77.18 148.7 41 185c-15.1 15.1-41 4.4-41-17V56a23.94 23.94 0 0 1 24-24h112c21.39 0 32.09 25.9 17 41l-36.2 36.2L224 216.4l107.23-107.3L295 73c-15.09-15.1-4.39-41 17-41h112a23.94 23.94 0 0 1 24 24v112c0 21.4-25.89 32.1-41 17l-36.19-36.2L263.54 256l107.28 107.3L407 327.1c15.1-15.2 41-4.5 41 16.9z"></path>';
    spriteExpand.setAttributeNS(null,'width',hnsweRadiusReduced.toString());
    spriteExpand.setAttributeNS(null,'height',hnsweRadiusReduced.toString());
    spriteExpand.setAttributeNS(null,'x',(handleNESW.cx.baseVal.value - hnsweRadiusReduced / 2).toString());
    spriteExpand.setAttributeNS(null,'y',(handleNESW.cy.baseVal.value - hnsweRadiusReduced / 2).toString());
    spriteExpand.classList.add("handleNESW-sprite");
    spriteExpand.classList.add("doodleHandle");
    // we need a group to hold the SVG as SVG1.1 does not allow transforms on SVGs, so we roate the group
    const expandGp = document.createElementNS(doodlexmlns, "g");
    expandGp.appendChild(spriteExpand);
    const rotExp = window.svgDoodles.createSVGTransform();
    rotExp.setRotate(reverseRotation, handleNESW.cx.baseVal.value,handleNESW.cy.baseVal.value);
    expandGp.transform.baseVal.initialize(rotExp);
    handles.appendChild(expandGp);

    const handleDelete = elementOfTypeWithCoords({
            type: "ellipse",
            radiusx: hnsweRadiusHalf,
            radiusy: hnsweRadiusHalf
        },
        [corrCoords[0] + radii[0] * 2 - hnsweRadius * 2.4, corrCoords[1] + radii[1] * 2 + hnsweRadiusQuarter]);
    handleDelete.classList.add("handleDelete");
    handleDelete.onclick = handleDeleteDoodleClicked;
    handleDelete.classList.add("doodleHandle");
    handles.appendChild(handleDelete);
    const spriteDel = document.createElementNS(doodlexmlns, "svg");
    spriteDel.setAttributeNS(null,'viewBox',"0 0 640 512");
    spriteDel.innerHTML='<path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z"></path>';
    spriteDel.setAttributeNS(null,'width',hnsweRadiusReduced.toString());
    spriteDel.setAttributeNS(null,'height',hnsweRadiusReduced.toString());
    spriteDel.setAttributeNS(null,'x',(handleDelete.cx.baseVal.value - hnsweRadiusReduced / 2).toString());
    spriteDel.setAttributeNS(null,'y',(handleDelete.cy.baseVal.value - hnsweRadiusReduced / 2).toString());
    spriteDel.classList.add("handleDelete-sprite");
    spriteDel.classList.add("doodleHandle");
    // we need a group to hold the SVG as SVG1.1 does not allow transforms on SVGs, so we roate the group
    const delGp = document.createElementNS(doodlexmlns, "g");
    delGp.appendChild(spriteDel);
    const rotDel = window.svgDoodles.createSVGTransform();
    rotDel.setRotate(reverseRotation, handleDelete.cx.baseVal.value,handleDelete.cy.baseVal.value);
    delGp.transform.baseVal.initialize(rotDel);
    handles.appendChild(delGp);

    const handleRotate = elementOfTypeWithCoords({
        type: "ellipse",
        radiusx: hnsweRadius / 2,
        radiusy: hnsweRadius / 2
    }, [corrCoords[0] + radii[0] * 2, corrCoords[1] + radii[1] * 2 + hnsweRadiusQuarter]);
    handleRotate.classList.add("handleRotate");
    handleRotate.classList.add("doodleHandle");
    addRotateEventsToHandle(handleRotate);
    handles.appendChild(handleRotate);
    const spriteR = document.createElementNS(doodlexmlns, "svg");
    spriteR.setAttributeNS(null,'viewBox',"0 0 512 512");
    spriteR.innerHTML='<path d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path>';
    spriteR.setAttributeNS(null,'width',hnsweRadiusReduced.toString());
    spriteR.setAttributeNS(null,'height',hnsweRadiusReduced.toString());
    spriteR.setAttributeNS(null,'x',(handleRotate.cx.baseVal.value - hnsweRadiusReduced / 2).toString());
    spriteR.setAttributeNS(null,'y',(handleRotate.cy.baseVal.value - hnsweRadiusReduced / 2).toString());
    spriteR.classList.add("handleRotate-sprite");
    spriteR.classList.add("doodleHandle");
    // we need a group to hold the SVG as SVG1.1 does not allow transforms on SVGs, so we roate the group
    const rotGp = document.createElementNS(doodlexmlns, "g");
    rotGp.appendChild(spriteR);
    const rotRot = window.svgDoodles.createSVGTransform();
    rotRot.setRotate(reverseRotation, handleRotate.cx.baseVal.value,handleRotate.cy.baseVal.value);
    rotGp.transform.baseVal.initialize(rotRot);
    handles.appendChild(rotGp);

    group.appendChild(handles);
}

function addHandlesToDoodleShape(dShape) {
    const bboxGroup = dShape.getBBox();
    //doodle is now inside a rotating group - need its grandparent
    addHandlesToGroupWithCoords(dShape.parentNode.parentNode, [bboxGroup.width / 2, bboxGroup.height / 2], [bboxGroup.x, bboxGroup.y], dShape.tagName);
}

function removeHandlesFromGroup(group) {
    const handles = group.getElementsByClassName('doodleHandlesGroup')[0];
    if (!!handles) handles.parentNode.removeChild(handles);
}

function addTransformMatrixToDoodleShapeGroup(doodleSG) {
    const tfmList = doodleSG.transform.baseVal;
    const rotation = window.svgDoodles.createSVGTransform();
    rotation.setRotate(0, 0, 0);
    tfmList.initialize(rotation);
}

function addTransformMatrixToDoodleGroup(group) {
    const tfmList = group.transform.baseVal;
    const translation = window.svgDoodles.createSVGTransform();
    translation.setTranslate(0, 0);
    tfmList.initialize(translation);
}

function addTextRectToDoodleShape(dShape, fill, doodleG) {
    const existingrect = doodleG.getElementsByClassName('doodle-textRect')[0];
    if (!!existingrect) existingrect.parentNode.removeChild(existingrect);
    if (dShape.tagName === 'text') {
        const bbox = dShape.getBBox();
        const rectvaluesObj = {
            type: 'rect',
            radiusx: bbox.width / 2,
            radiusy: bbox.height / 2,
            fill: fill,
            stroke: "transparent",
            strokewidth: 0
        };
        const rect = elementOfTypeWithCoords(rectvaluesObj, [bbox.x, bbox.y]);
        rect.classList.add("doodle-textRect");
        const doodleShapeGroup = doodleG.getElementsByClassName('doodle-shape-group')[0];
        doodleShapeGroup.insertBefore(rect, dShape);
    }
}

// ================================================= Drag
function dragifySVG(dragon) {
    window.svgDoodles.onmousemove = dragon ? doodleDragMove : undefined;
    window.svgDoodles.onmouseup = dragon ? doodleDragEnd : undefined;
    window.svgDoodles.onmouseleave = dragon ? doodleDragEnd : undefined;
    /*
        window.svgDoodles.onmouseout = dragon ? doodleDragEnd : undefined;
        window.svgDoodles.ontouchmove = dragon ? doodleTouchMove : undefined;
        window.svgDoodles.ontouchend = dragon ? doodleTouchEnd : undefined;
        window.svgDoodles.ontouchcancel = dragon ? doodleTouchEnd : undefined;
    */
    if (dragon) window.svgDoodles.classList.add("doodle-dragging");
    else window.svgDoodles.classList.remove("doodle-dragging");
}

function addDragEventsToDoodle(doodle) {
    doodle.onmousedown = doodleDragStart;
    doodle.onmouseup = doodleDragEnd;
    //doodle.onmouseleave = doodleDragEnd;
    //doodle.onmouseout = doodleDragEnd;
    doodle.ontouchstart = doodleTouchStart;
    doodle.ontouchend = doodleTouchEnd;
    doodle.ontouchcancel = doodleTouchEnd;
}

function addDragEventsToAllDoodles() {
    //these are lost when we freeze dry the innerHTML
    for (let Doodle of window.svgDoodles.getElementsByClassName('doodle')) {
        addDragEventsToDoodle(Doodle);
    }
}

function doodleDragStart(e) {
    e.stopPropagation();
    e.cancelBubble = true;
    e.preventDefault();
    e.target.onmousemove = doodleDragMove;
    startDODragCoords([e.clientX, e.clientY], e);
}

function doodleTouchStart(e) {
    e.target.ontouchmove = doodleTouchMove;
    e.cancelBubble = true;
    e.stopPropagation();
    e.preventDefault();
    if (e.targetTouches.length === 1) {
        startDODragCoords([e.targetTouches[0].clientX, e.targetTouches[0].clientY], e);
        // touch ignores click so we have to generate it
        handleSVGdoodleClick(e);
    }
}

function startDODragCoords(coords, e) {
    //doodle is now inside a rotating group - need its grandparent
    //if e.target is doodle you need its grandparent if its doodle-textspan - greatgrandparent
    draggingUnderway = true;
    window.draggingDG = e.target.classList[0] === "doodle-textspan" ? e.target.parentNode.parentNode.parentNode : e.target.parentNode.parentNode;
    window.draggingDO = window.draggingDG.getElementsByClassName('doodle')[0];
    dragifySVG(true);
    setAllDoodlesActiveStatus(false);
    removeHandlesFromGroup(window.draggingDG);
    window.svgDoodles.appendChild(window.draggingDG);
    doodleDragStartOffset = correctfigHangerXYNoRotation_float(coords, hangerToFig);
    const tflm = window.draggingDG.transform.baseVal.getItem(0).matrix;
    doodleDragStartTranslation = [tflm.e, tflm.f];
    window.draggingDOtagName = window.draggingDO.tagName;
    switch (window.draggingDOtagName) {
        case 'ellipse':
            dragDOcxcy = [window.draggingDO.cx.baseVal.value, window.draggingDO.cy.baseVal.value];
            break;
        case 'line':
            dragDOcxcy = [window.draggingDO.x1.baseVal.value, window.draggingDO.y1.baseVal.value];
            break;
        case 'rect':
            dragDOcxcy = [window.draggingDO.x.baseVal.value, window.draggingDO.y.baseVal.value];
            break;
        default:
    }
}

function doodleDragMove(e) {
    e.stopPropagation();
    e.cancelBubble = true;
    e.preventDefault();
    moveTheseDOCoords(e.clientX, e.clientY, e.target);
}

function doodleTouchMove(e) {
    e.stopPropagation();
    e.cancelBubble = true;
    e.preventDefault();
    // If there's exactly one finger inside this element
    if (e.targetTouches.length === 1) moveTheseDOCoords(e.targetTouches[0].clientX, e.targetTouches[0].clientY, e.target);
}

function moveTheseDOCoords(x, y) {
    if (draggingUnderway && !!window.draggingDG) {
        const corrCoords = correctfigHangerXYNoRotation_float([x, y], hangerToFig);
        let deltaX = ((corrCoords[0] - doodleDragStartOffset[0]));// + doodleDragStartTranslation[0]; * deltaMultiplyAdjustRatio
        let deltaY = ((corrCoords[1] - doodleDragStartOffset[1]));// + doodleDragStartTranslation[1]; * deltaMultiplyAdjustRatio
        window.draggingDG.transform.baseVal.getItem(0).setTranslate(deltaX + doodleDragStartTranslation[0], deltaY + doodleDragStartTranslation[1]);
    }
}

function doodleDragEnd(e) {
    e.stopPropagation();
    e.cancelBubble = true;
    e.preventDefault();
    if (draggingUnderway) {
        endDODragCoords(e);
    }
}

function doodleTouchEnd(e) {
    e.stopPropagation();
    e.cancelBubble = true;
    e.preventDefault();
    if (draggingUnderway) {
        endDODragCoords(e);
    }
}

function endDODragCoords(e) {
    if (draggingUnderway && !!window.draggingDG) {
        window.draggingDG.onmousemove = undefined;
        dragifySVG(false);
        doodleDragStartOffset = [0,0];
        //mousedown intercepts onclick so we have to do the select process which expects handles
        addHandlesToDoodleShape(window.draggingDO);
        //do updateDoodleGroupToDB last so handles are saved. We need handles on startDrag
        updateDoodleGroupToDB(window.draggingDG);
        selectThisDoodlesGroup(window.draggingDG, false, true);
        window.draggingDG = null;
        //delay draggingUnderway = false to the next cycle so the onclick event Firefox allows through is ignored
        setTimeout(function() {draggingUnderway = false;}, 0);
    }
}

// ================================================= Stretch
function resizifySVG(resizon) {
    window.svgDoodles.onmousemove = resizon ? doodleResizeMove : undefined;
    window.svgDoodles.onmouseup = resizon ? doodleResizeEnd : undefined;
    window.svgDoodles.onmouseleave = resizon ? doodleResizeEnd : undefined;
    window.svgDoodles.ontouchmove = resizon ? doodleTouchMove : undefined;
    window.svgDoodles.ontouchend = resizon ? doodleTouchEnd : undefined;
    window.svgDoodles.ontouchcancel = resizon ? doodleTouchEnd : undefined;
    if (resizon) window.svgDoodles.classList.add("handleNESW-cursor");
    else window.svgDoodles.classList.remove("handleNESW-cursor");
}

function addResizeEventsToAllHandles() {
    //these are lost when we freeze dry the innerHTML
    for (let handle of window.svgDoodles.getElementsByClassName('handleNESW')) {
        addResizeEventsToHandle(handle);
    }
}

function addResizeEventsToHandle(handle) {
    handle.onmousedown = doodleResizeStart;
    handle.onmouseup = doodleResizeEnd;
    handle.ontouchstart = doodleTouchResizeStart;
    handle.ontouchend = doodleTouchResizeEnd;
    handle.ontouchcancel = doodleTouchResizeEnd;
}

function doodleResizeStart(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.onmousemove = doodleResizeMove;
    startDOResizeCoords([e.clientX, e.clientY], e);
}

function doodleTouchResizeStart(e) {
    e.target.ontouchmove = doodleTouchResizeMove;
    e.stopPropagation();
    e.preventDefault();
    if (e.targetTouches.length === 1) {
        startDOResizeCoords([e.targetTouches[0].clientX, e.targetTouches[0].clientY], e);
    }
}

function startDOResizeCoords(coords, e) {
    //e.target is handle you need its grantparent
    window.resizeDG = e.target.parentNode.parentNode;
    resizifySVG(true);
    setAllDoodlesActiveStatus(false);
    removeHandlesFromGroup(window.resizeDG);
    window.svgDoodles.appendChild(window.resizeDG);
    doodleResizeStartOffset = correctfigHangerXYNoRotation_float(coords);
    window.resizeDO = window.resizeDG.getElementsByClassName('doodle')[0];
    window.resizeDOtagName = window.resizeDO.tagName;
    window.resizeTXR = null;
    switch (window.resizeDOtagName) {
        case 'text':
            textStartingFontSize = parseFloat(window.resizeDO.style.fontSize);
            window.resizeTXR = window.resizeDG.getElementsByClassName('doodle-textRect')[0];
            break;
        case 'ellipse':
            resizeDOrxry = [window.resizeDO.rx.baseVal.value, window.resizeDO.ry.baseVal.value];
            resizeDOcxcy = [window.resizeDO.cx.baseVal.value, window.resizeDO.cy.baseVal.value];
            break;
        case 'line':
            resizeDOrxry = [window.resizeDO.x2.baseVal.value, window.resizeDO.y2.baseVal.value];
            resizeDOcxcy = [window.resizeDO.x1.baseVal.value, window.resizeDO.y1.baseVal.value];
            break;
        case 'rect':
            resizeDOrxry = [window.resizeDO.width.baseVal.value, window.resizeDO.height.baseVal.value];
            resizeDOcxcy = [window.resizeDO.x.baseVal.value, window.resizeDO.y.baseVal.value];
            break;
        default:
    }
    doodleResizeStartOffset = correctfigHangerXYNoRotation_float(coords);
    const dsg = window.resizeDO.parentNode;
    doodleResizeRotateAngleTan = Math.tan(dsg.transform.baseVal.getItem(0).angle * D2R);
    //bring it to the front
    window.svgDoodles.appendChild(window.resizeDG);
    window.svgResizeDelta = [0, 0];
    //deltaMultiplyAdjustRatio = 1;//(imageCard.naturalWidth / imageCard.width) * deltaMultiplyFactor;
}

function doodleResizeMove(e) {
    e.stopPropagation();
    e.preventDefault();
    resizeTheseDOCoords(e.clientX, e.clientY, e.target);
}

function doodleTouchResizeMove(e) {
    e.stopPropagation();
    e.preventDefault();
    // If there's exactly one finger inside this element
    if (e.targetTouches.length === 1) resizeTheseDOCoords(e.targetTouches[0].clientX, e.targetTouches[0].clientY, e.target);
}

function resizeTheseDOCoords(x, y) {
    if (!!doodleResizeStartOffset) {
        const corrCoords = correctfigHangerXYNoRotation_float([x, y]);
        let deltaX = (corrCoords[0] - doodleResizeStartOffset[0]);// * deltaMultiplyAdjustRatio;
        let deltaY = (corrCoords[1] - doodleResizeStartOffset[1]);// * deltaMultiplyAdjustRatio;
        //converts xy to rotated xy
        const deltaXcorrection = (deltaY * doodleResizeRotateAngleTan);
        const deltaYcorrection = (deltaX * doodleResizeRotateAngleTan);
        deltaX += deltaXcorrection;
        deltaY -= deltaYcorrection;
        switch (window.resizeDOtagName) {
            case 'text':
                if (textStartingFontSize - deltaX / deltaXfontSizeFactor > textMinFontSize) {
                    window.resizeDO.style.fontSize = textStartingFontSize + deltaX / deltaXfontSizeFactor + "px";
                    if (!!window.resizeTXR) {
                        const bbox = window.resizeDO.getBBox();
                        window.resizeTXR.width.baseVal.value = bbox.width;
                        window.resizeTXR.height.baseVal.value = bbox.height;
                        window.resizeTXR.x.baseVal.value = bbox.x;
                        window.resizeTXR.y.baseVal.value = bbox.y;
                    }
                }
                break;
            case 'ellipse':
                if ((resizeDOrxry[0] + deltaX / 2) > resizeMinWH && (resizeDOrxry[1] + deltaY / 2) > resizeMinWH) {
                    window.resizeDO.rx.baseVal.value = resizeDOrxry[0] + deltaX / 2;
                    window.resizeDO.ry.baseVal.value = resizeDOrxry[1] + deltaY / 2;
                }
                break;
            case 'rect':
                if ((resizeDOrxry[0] + deltaX) > resizeMinWH && (resizeDOrxry[1] + deltaY) > resizeMinWH) {
                    window.resizeDO.width.baseVal.value = resizeDOrxry[0] + deltaX;
                    window.resizeDO.height.baseVal.value = resizeDOrxry[1] + deltaY;
                    window.resizeDO.x.baseVal.value = resizeDOcxcy[0] - deltaX / 2;
                    window.resizeDO.y.baseVal.value = resizeDOcxcy[1] - deltaY / 2;
                }
                break;
            case 'line':
                const equalDelta = Math.max(deltaX, deltaY);
                if ((resizeDOrxry[0] + equalDelta - window.resizeDO.x1.baseVal.value) > resizeMinWHLine && (resizeDOrxry[1] + equalDelta - window.resizeDO.y1.baseVal.value) > resizeMinWHLine) {
                    window.resizeDO.x2.baseVal.value = resizeDOrxry[0] + equalDelta;
                    window.resizeDO.y2.baseVal.value = resizeDOrxry[1] + equalDelta;
                }
                break;
            default:
        }
    }
}

function doodleResizeEnd(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!!doodleResizeStartOffset) {
        e.target.onmousemove = undefined;
        endDOResizeCoords(e.target);
    }
}

function doodleTouchResizeEnd(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!!doodleResizeStartOffset) {
        e.target.ontouchmove = undefined;
        endDOResizeCoords(e.target);
    }
}

function endDOResizeCoords() {
    addHandlesToDoodleShape(window.resizeDO);
    window.resizeTXR = null;
    doodleResizeStartOffset = null;
    resizifySVG(false);
    window.resizeTXR = null;
    updateDoodleGroupToDB(window.resizeDG);
}

// ================================================= Rotate
function rotatifySVG(rotaton) {
    window.svgDoodles.onmousemove = rotaton ? doodleRotateMove : undefined;
    window.svgDoodles.onmouseup = rotaton ? doodleRotateEnd : undefined;
    window.svgDoodles.onmouseleave = rotaton ? doodleRotateEnd : undefined;
    window.svgDoodles.ontouchmove = rotaton ? doodleTouchMove : undefined;
    window.svgDoodles.ontouchend = rotaton ? doodleTouchEnd : undefined;
    window.svgDoodles.ontouchcancel = rotaton ? doodleTouchEnd : undefined;
    if (rotaton) for (let e of [window.svgDoodles]) {
        e.classList.add("handleRotate-cursor")
    }
    else for (let e of [window.svgDoodles]) {
        e.classList.remove("handleRotate-cursor")
    }
}

function addRotateEventsToAllHandles() {
    //these are lost when we freeze dry the innerHTML
    for (let handle of window.svgDoodles.getElementsByClassName('handleRotate')) {
        addRotateEventsToHandle(handle);
    }
}

function addRotateEventsToHandle(handle) {
    handle.onmousedown = doodleRotateStart;
    handle.onmouseup = doodleRotateEnd;
    handle.ontouchstart = doodleTouchRotateStart;
    handle.ontouchend = doodleTouchRotateEnd;
    handle.ontouchcancel = doodleTouchRotateEnd;
}

function doodleRotateStart(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.onmousemove = doodleRotateMove;
    //rotate seems happier with offsetXY instead of clientXY
    startDORotateCoords([e.offsetX, e.offsetY], e);
}

function doodleTouchRotateStart(e) {
    e.target.ontouchmove = doodleTouchRotateMove;
    e.stopPropagation();
    e.preventDefault();
    if (e.targetTouches.length === 1) {
        // touch does not have offsetXY so use clientXY
        startDORotateCoords([e.targetTouches[0].clientX, e.targetTouches[0].clientY], e);
    }
}

function startDORotateCoords(coords, e) {
    //e.target is handle  you need its grantparent
    window.rotateDG = e.target.parentNode.parentNode;
    window.rotateDO = window.rotateDG.getElementsByClassName('doodle')[0];
    setAllDoodlesActiveStatus(false);
    removeHandlesFromGroup(window.rotateDG);
    rotatifySVG(true);// needs window.rotateDO
    const corrCoords = correctfigHangerXYNoRotation_float(coords, hangerToFig);
    switch (window.rotateDO.tagName) {
        case 'text':
            rotcenter = {
                x: parseFloat(window.rotateDO.getAttributeNS(null, "x")),//bbox.x,//
                y: parseFloat(window.rotateDO.getAttributeNS(null, "y"))//bbox.y//
            };
            break;
        case 'ellipse':
            rotcenter = {x: window.rotateDO.cx.baseVal.value, y: window.rotateDO.cy.baseVal.value};
            break;
        case 'line':
            /* all lines +- markers are tagname line */
            rotcenter = {x: window.rotateDO.x1.baseVal.value, y: window.rotateDO.y1.baseVal.value};
            break;
        case 'rect':
            rotcenter = {
                x: window.rotateDO.x.baseVal.value + window.rotateDO.width.baseVal.value / 2,
                y: window.rotateDO.y.baseVal.value + window.rotateDO.height.baseVal.value / 2
            };
            break;
    }

    const tflm = window.rotateDG.transform.baseVal.getItem(0).matrix;
    doodleRotateStartTranslation = [tflm.e, tflm.f];
    startAngleOfTwist = R2D * Math.atan2(corrCoords[1] - rotcenter.y - doodleRotateStartTranslation[1], corrCoords[0] - rotcenter.x - doodleRotateStartTranslation[0]);
    const dsg = window.rotateDO.parentNode;
    doodleInitialRotateAngle = dsg.transform.baseVal.getItem(0).angle;
}

function doodleRotateMove(e) {
    e.stopPropagation();
    e.preventDefault();
    rotateTheseDOCoords(e.offsetX, e.offsetY);
}

function doodleTouchRotateMove(e) {
    e.stopPropagation();
    e.preventDefault();
    // touch does not have offsetXY so use clientXY
    if (e.targetTouches.length === 1) rotateTheseDOCoords(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
}

function rotateTheseDOCoords(x, y) {
    if (doodleInitialRotateAngle !== undefined) {
        const corrCoords = correctfigHangerXYNoRotation_float([x, y], hangerToFig);
        let rotation = (R2D * Math.atan2(corrCoords[1] - rotcenter.y - doodleRotateStartTranslation[1],
            corrCoords[0] - rotcenter.x - doodleRotateStartTranslation[0])) - startAngleOfTwist + doodleInitialRotateAngle;
        if (rotation > 360) rotation -= 360;
        else if (rotation < 0) rotation += 360;
        const dsg = window.rotateDO.parentNode;
        dsg.transform.baseVal.getItem(0).setRotate(rotation, rotcenter.x, rotcenter.y);
    }
}

function doodleRotateEnd(e) {
    e.stopPropagation();
    e.preventDefault();
    if (doodleInitialRotateAngle !== undefined) {
        e.target.onmousemove = undefined;
        endDORotateCoords(e.target);
    }
}

function doodleTouchRotateEnd(e) {
    e.stopPropagation();
    e.preventDefault();
    if (doodleInitialRotateAngle !== undefined) {
        e.target.ontouchmove = undefined;
        endDORotateCoords(e.target);
    }
}

function endDORotateCoords() {
    setAllDoodlesActiveStatus(true);
    rotatifySVG(false);
    addHandlesToDoodleShape(window.rotateDO);
    doodleInitialRotateAngle = undefined;
    updateDoodleGroupToDB(window.rotateDG);
}

// ================================================= Delete SendBack
function handleDeleteDoodleClicked() {
    if (!!window.selectedDoodleGroup) {
        deleteAnyDefsForSelectedDG(window.selectedDoodleGroup);
        window.svgDoodles.removeChild(window.selectedDoodleGroup);
        updateDoodleGroupToDB(null);
    }
}

function deleteAnyDefsForSelectedDG(dGroup) {
    const doodle = dGroup.getElementsByClassName('doodle')[0];
    if (doodle.tagName === 'line') {
        const mid = doodle.getAttributeNS(null, 'data-mid');
        if (!!mid) {
            const markerDef = window.svgDoodles.getElementById(mid);
            if (!!markerDef) {
                const defs = window.svgDoodles.getElementsByTagName('defs')[0];
                if (!!defs) defs.removeChild(markerDef);
            }
        }
    }
}

function addDeleteEventsToAllHandles() {
    //these are lost when we freeze dry the innerHTML
    for (let handle of window.svgDoodles.getElementsByClassName('handleDelete')) {
        handle.onclick = handleDeleteDoodleClicked;
    }
}

function sendSelectedDOback() {
    if (!!window.selectedDoodleGroup) {
        window.svgDoodles.prepend(window.selectedDoodleGroup);
        updateDoodleGroupToDB(null);
    }
}

// ================================================= palette
function doFillStrokeHueChanged(range, div, style) {
    //alphaslider needs a hue with alpha = 1 to create its background gradient
    const newhueforalphaslider = "hsla(" + range.value + ",100%,50%,1)";
    const alphaRangeID = div.includes("Stroke") ? 'range-doAlphaStroke' : 'range-doAlphaFill';
    const alphaRange = document.getElementById(alphaRangeID);
    alphaRange.style.backgroundImage = "linear-gradient(to right, white," + newhueforalphaslider + ")";
    const newhuewithalpha = "hsla(" + range.value + ",100%,50%," + alphaRange.value + ")";
    const divObj = document.getElementById(div);
    divObj.setAttribute('data-colour', newhuewithalpha);
    divObj.setAttribute('data-colourMode', 'colour');
    document.getElementById(div).style[style] = newhuewithalpha;
    alignTextColours();
}

function doStrokeFillAlphaChanged(range, div, style) {
    const colourRangeID = div.includes("Stroke") ? 'range-doColourStroke' : 'range-doColourFill';
    const colourRange = document.getElementById(colourRangeID);
    const divObj = document.getElementById(div);
    divObj.setAttribute('data-colour', "hsla(" + colourRange.value + ",100%,50%," + range.value + ")");
    switch (divObj.getAttribute('data-colourMode')) {
        case 'colour':
            divObj.setAttribute('data-colour', "hsla(" + colourRange.value + ",100%,50%," + range.value + ")");
            break;
        case 'black':
            divObj.setAttribute('data-colour', "hsla(0,100%,0%," + range.value + ")");
            break;
        case 'white':
            divObj.setAttribute('data-colour', "hsla(0,0%,100%," + range.value + ")");
            break;
        case 'grey':
            divObj.setAttribute('data-colour', "hsla(0,0%,53%," + range.value + ")");
    }
    document.getElementById(div).style[style] = divObj.getAttribute('data-colour');
    alignTextColours();
}

function doBlackWhiteClicked(div, style, colour) {
    const alphaRangeID = style.includes("border") ? 'range-doAlphaStroke' : 'range-doAlphaFill';
    const alphaRange = document.getElementById(alphaRangeID);
    alphaRange.style.backgroundImage = "linear-gradient(to right, white," + colour + ")";
    const divObj = document.getElementById(div);
    switch (colour) {
        case 'black':
            divObj.setAttribute('data-colour', "hsla(0,100%,0%," + alphaRange.value + ")");
            divObj.setAttribute('data-colourMode', 'black');
            divObj.style[style] = "hsla(0,100%,0%," + alphaRange.value + ")";
            break;
        case 'white':
            divObj.setAttribute('data-colour', "hsla(0,0%,100%," + alphaRange.value + ")");
            divObj.setAttribute('data-colourMode', 'white');
            divObj.style[style] = "hsla(0,100%,100%," + alphaRange.value + ")";
            break;
        default:
            divObj.setAttribute('data-colour', "hsla(0,0%,53%," + alphaRange.value + ")");
            divObj.setAttribute('data-colourMode', 'grey');
            divObj.style[style] = "hsla(0,0%,53%," + alphaRange.value + ")";
    }
    //just reflect the fill onto textarea whatever changed
    alignTextColours();
}

function alignTextColours() {
    //just reflect the fill onto textarea whatever changed
    const dcs = document.getElementById('div-doColourStroke');
    document.getElementById('div-doTextColour').style.color = dcs.style.borderColor;
    const ta = document.getElementById("textarea-doodle");
    ta.style.backgroundColor = document.getElementById('div-doColourFill').style.backgroundColor;
    ta.style.color = dcs.style.borderColor;
}

function doStrokeWidthChanged(range) {
    document.getElementById('div-doStrokeWidth').style.borderWidth = range.value / strokeWidthFactor + "px";
    document.getElementById('div-doTextSize').style.fontSize = 10 + range.value / strokeWidthFontSizeFactor + "px";
    document.getElementById('textarea-doodle').style.fontSize = range.value * strokeWidthFontSizeFactor * (window.imageCard.width / window.imageCard.naturalWidth) + "px";
}

function addDOpaletteValuesToValuesObject(valuesObj) {
    //data-*** must be all LOWERCASE. Also avoid -. just stick one word lowercase
    valuesObj.fill = document.getElementById('div-doColourFill').getAttribute('data-colour');
    valuesObj.stroke = document.getElementById('div-doColourStroke').getAttribute('data-colour');
    valuesObj.strokewidth = document.getElementById('range-doStrokeWidth').value;
    valuesObj.text = valuesObj.type === 'text' ? document.getElementById('textarea-doodle').value : "";
    //preserve the settings of the colour sliders for ease of restore
    valuesObj.fillhue = document.getElementById('range-doColourFill').value;
    valuesObj.fillalpha = document.getElementById('range-doAlphaFill').value;
    valuesObj.strokehue = document.getElementById('range-doColourStroke').value;
    valuesObj.strokealpha = document.getElementById('range-doAlphaStroke').value
}

function hideFillPanelForDataShape(dataShape, lookupDS) {
    //if we setup from a doodle we have the exact DS, if we just click the 'line' btn we have to lookup the dropdown
    const correctDS = lookupDS ? markerTypeSelected() : dataShape;
    //show everything then remove
    document.getElementById('div-panelDoColourFill').classList.remove('hideInFlexCol');
    document.getElementById('div-divDoColourStroke').classList.remove('hideInFlexCol');
    document.getElementById('div-doColourStroke').classList.remove('hideInFlexCol');
    document.getElementById('div-doTextColour').classList.remove('hideInFlexCol');
    document.getElementById('div-doStrokeWidth').classList.remove('hideInFlexCol');
    document.getElementById('div-doTextSize').classList.remove('hideInFlexCol');
    document.getElementById('div-textarea-doodle').classList.remove('hideInFlexCol');
    switch (correctDS) {
        case 'text':
            document.getElementById('div-doColourStroke').classList.add('hideInFlexCol');
            document.getElementById('div-doStrokeWidth').classList.add('hideInFlexCol');
            document.getElementById('range-doColourStroke').title = "Change text colour";
            document.getElementById('range-doAlphaStroke').title = "Change text transparency";
            document.getElementById('range-doStrokeWidth').title = "Change text size";
            break;
        case 'ellipse':
        case 'rect':
        case 'lineDot':
        case 'lineThumbtack':
            document.getElementById('div-doTextColour').classList.add('hideInFlexCol');
            document.getElementById('div-doTextSize').classList.add('hideInFlexCol');
            document.getElementById('div-textarea-doodle').classList.add('hideInFlexCol');
            document.getElementById('range-doColourStroke').title = "Change line colour";
            document.getElementById('range-doAlphaStroke').title = "Change line transparency";
            document.getElementById('range-doStrokeWidth').title = "Change line thickness";
            break;
        case 'line':
        case 'lineArrow':
            document.getElementById('div-panelDoColourFill').classList.add('hideInFlexCol');
            document.getElementById('div-doTextColour').classList.add('hideInFlexCol');
            document.getElementById('div-doTextSize').classList.add('hideInFlexCol');
            document.getElementById('div-textarea-doodle').classList.add('hideInFlexCol');
            document.getElementById('range-doColourStroke').title = "Change line colour";
            document.getElementById('range-doAlphaStroke').title = "Change line transparency";
            document.getElementById('range-doStrokeWidth').title = "Change line thickness";
            break;
        default:
    }
}

function setupDoodlePalette(fromDoodleG) {
    if (!!fromDoodleG) {
        const doodle = fromDoodleG.getElementsByClassName('doodle')[0];
        hideFillPanelForDataShape(doodle.dataset.type);
        makeThisDOshapeBtnActive('btn-DS' + doodle.tagName);
        makeThisMarkerActive('btn-Marker' + doodle.dataset.type);

        document.getElementById('div-doColourFill').setAttributeNS(null, 'data-colour', doodle.dataset.fill);//doodle.getAttributeNS(null, "data-fill"));
        document.getElementById('div-doColourFill').style.backgroundColor = doodle.dataset.fill;// doodle.getAttributeNS(null, "data-fill");
        document.getElementById('range-doColourFill').value = doodle.dataset.fillhue;//doodle.getAttributeNS(null, "data-fillHue");
        document.getElementById('range-doAlphaFill').value = doodle.dataset.fillalpha;//doodle.getAttributeNS(null, "data-fillAlpha");
        document.getElementById('range-doAlphaFill').style.backgroundImage = 'linear-gradient(to right, white,' + doodle.dataset.fill + ')';
        //doodle.getAttributeNS(null, "data-fill")

        document.getElementById('div-doColourStroke').setAttributeNS(null, 'data-colour', doodle.dataset.stroke);//doodle.getAttributeNS(null, "data-stroke"));
        document.getElementById('div-doColourStroke').style.borderColor = doodle.dataset.stroke;//doodle.getAttributeNS(null, "data-stroke");
        document.getElementById('div-doTextColour').style.color = doodle.dataset.stroke;//doodle.getAttributeNS(null, "data-stroke");
        document.getElementById('range-doColourStroke').value = doodle.dataset.strokehue;//doodle.getAttributeNS(null, "data-strokeHue");
        document.getElementById('range-doAlphaStroke').value = doodle.dataset.strokealpha;//doodle.getAttributeNS(null, "data-strokeAlpha");
        document.getElementById('range-doAlphaStroke').style.backgroundImage = 'linear-gradient(to right, white,' + doodle.dataset.stroke + ')';//doodle.getAttributeNS(null, "data-stroke")

        document.getElementById('div-doStrokeWidth').style.borderWidth = parseFloat(doodle.dataset.strokewidth) / strokeWidthFactor + "px";
        document.getElementById('div-doTextSize').style.fontSize = 10 + parseFloat(doodle.dataset.strokewidth) / strokeWidthFontSizeFactor + "px";
        document.getElementById('range-doStrokeWidth').value = doodle.dataset.strokewidth;//doodle.getAttributeNS(null, "data-strokeWidth");

        document.getElementById('textarea-doodle').value = doodle.tagName === 'text' ? doodle.dataset.text : "";
        document.getElementById('textarea-doodle').style.color = doodle.dataset.stroke;//doodle.getAttributeNS(null, "data-stroke");
        document.getElementById('textarea-doodle').style.backgroundColor = doodle.dataset.fill;//doodle.getAttributeNS(null, "data-fill");
        document.getElementById('textarea-doodle').style.fontSize = parseFloat(doodle.dataset.strokewidth) * strokeWidthFontSizeFactor * (window.imageCard.width / window.imageCard.naturalWidth) + "px";

    } else {
        hideFillPanelForDataShape('text');
        makeThisDOshapeBtnActive('btn-DStext');

        document.getElementById('div-doColourFill').setAttributeNS(null, 'data-colour', 'hsla(0,100%,50%,0)');
        document.getElementById('div-doColourFill').style.backgroundColor = "hsla(0,100%,50%,0)";
        document.getElementById('range-doColourFill').value = 0;
        document.getElementById('range-doAlphaFill').value = 0;
        document.getElementById('range-doAlphaFill').style.backgroundImage = 'linear-gradient(to right, white, hsla(0, 100%, 50%, 1))';

        document.getElementById('div-doColourStroke').setAttributeNS(null, 'data-colour', "hsla(0,100%,50%,1)");
        document.getElementById('div-doColourStroke').style.borderColor = "hsla(0,100%,50%,1)";
        document.getElementById('div-doTextColour').style.color = "hsla(0,100%,50%,1)";
        document.getElementById('range-doColourStroke').value = 0;
        document.getElementById('range-doAlphaStroke').value = "1.0";
        document.getElementById('range-doAlphaStroke').style.backgroundImage = 'linear-gradient(to right, white, hsla(0, 100%, 50%, 1))';

        document.getElementById('div-doStrokeWidth').style.borderWidth = "2px";
        document.getElementById('div-doTextSize').style.fontSize = "12px";
        document.getElementById('range-doStrokeWidth').value = 8;

        document.getElementById('textarea-doodle').value = "";
        document.getElementById('textarea-doodle').style.color = "hsla(0,100%,50%,1)";
        document.getElementById('textarea-doodle').style.backgroundColor = "hsla(0,100%,50%,0)";
        document.getElementById('textarea-doodle').style.fontSize = 32 * (window.imageCard.width / window.imageCard.naturalWidth) + "px";
    }
}

function applyPaletteToDoodle() {
    if (!!window.selectedDoodleGroup) {
        const doodle = window.selectedDoodleGroup.getElementsByClassName('doodle')[0];
        const valuesObj = {type: doodle.dataset.type};
        addDOpaletteValuesToValuesObject(valuesObj);
        addValuesObjDataAtrributesToDoodle(doodle, valuesObj);
        switch (doodle.dataset.type) {
            case 'text':
                doodle.setAttributeNS(null, "fill", valuesObj.stroke);
                doodle.setAttributeNS(null, "stroke", valuesObj.stroke);
                addMultiLineTextFromString(doodle, doodle.getAttributeNS(null, "x"), valuesObj.text);
                doodle.style.fontSize = (strokeWidthFontSizeFactor * valuesObj.strokewidth) + "px";
                removeHandlesFromGroup(window.selectedDoodleGroup);
                addTextRectToDoodleShape(doodle, valuesObj.fill, window.selectedDoodleGroup);
                addHandlesToDoodleShape(doodle);
                break;
            case 'ellipse':
            case 'rect':
            case 'line':
                doodle.setAttributeNS(null, "fill", valuesObj.fill);
                doodle.setAttributeNS(null, "stroke", valuesObj.stroke);
                doodle.setAttributeNS(null, "stroke-width", valuesObj.strokewidth);
                break;
            case 'lineDot':
            case 'lineThumbtack':
            case 'lineArrow':
                doodle.setAttributeNS(null, "fill", valuesObj.stroke);
                doodle.setAttributeNS(null, "stroke", valuesObj.stroke);
                doodle.setAttributeNS(null, "stroke-width", valuesObj.strokewidth);
                deleteAnyDefsForSelectedDG(window.selectedDoodleGroup);
                addMarkerToElement(doodle, valuesObj);
                break;
        }
        updateDoodleGroupToDB(window.selectedDoodleGroup);
    }
}

function hideSelectedDoodlePaletteBtns(hide) {
    document.getElementById('btngp-backdel').hidden = hide;
    /*
        document.getElementById('btn-sendDOback').hidden = hide;
        document.getElementById('btn-delSelDoodle').hidden = hide;
    */
    document.getElementById('btns-updateDO').hidden = hide;
    document.getElementById('btngp-doShape').hidden = !hide;
}

// ================================================= Shapes and Markers
function addMarkerToElement(element, valuesObj) {
    const mID = (new Date().getTime()).toString();
    const nMarker = document.createElementNS(doodlexmlns, 'marker');
    nMarker.setAttributeNS(null, "id", mID);
    nMarker.setAttributeNS(null, "orient", "auto-start-reverse");
    nMarker.setAttributeNS(null, "stroke", valuesObj["stroke"]);
    nMarker.setAttributeNS(null, "markerUnits", "userSpaceOnUse");
    const strokeWidthF = parseFloat(valuesObj["strokewidth"]);
    const radius = strokeWidthF * 5;
    switch (valuesObj.type) {
        case 'lineArrow':
            nMarker.innerHTML = '<g transform="rotate(90,118.82,118.82)"><path d="M7.954,226.53c-2.23,4.623-2.295,8.072-0.609,9.915c3.911,4.275,15.926-3.905,23.323-9.051 l58.416-40.662c7.397-5.145,20.402-11.835,29.414-11.993c0.897-0.016,1.8-0.011,2.703,0.011c9.007,0.218,21.958,7.016,29.3,12.238 l56.403,40.151c7.343,5.221,19.303,13.473,23.301,9.219c1.74-1.849,1.751-5.33-0.381-9.997L129.648,7.047 c-4.264-9.333-11.335-9.404-15.79-0.163L7.954,226.53z"></path></g>';
            nMarker.setAttributeNS(null, "fill", valuesObj["stroke"]);
            nMarker.setAttributeNS(null, "viewBox", [-0, -0, 237.64, 237.64].join(" "));
            //refXY are trasposed 90deg by the rotate
            nMarker.setAttributeNS(null, "refX", (237.64 - strokeWidthF * 3).toString());
            nMarker.setAttributeNS(null, "refY", (118.82 + strokeWidthF / 8).toString());
            nMarker.setAttributeNS(null, "markerWidth", (237.64 * strokeWidthF / 40).toString());
            nMarker.setAttributeNS(null, "markerHeight", (237.64 * strokeWidthF / 40).toString());
            nMarker.setAttributeNS(null, "stroke-width", "1");
            break;
        case 'lineDot':
            nMarker.setAttributeNS(null, "stroke-width", valuesObj["strokewidth"]);
            nMarker.setAttributeNS(null, "fill", valuesObj["fill"]);
            nMarker.innerHTML = '<circle cx="' + radius + '" cy="' + radius + '" r="' + radius + '"></circle>';
            nMarker.setAttributeNS(null, "viewBox", [-strokeWidthF, -strokeWidthF, ((radius * 2) + strokeWidthF * 2), ((radius * 2) + strokeWidthF * 2)].join(" "));
            nMarker.setAttributeNS(null, "refX", (0).toString());
            nMarker.setAttributeNS(null, "refY", (radius).toString());
            nMarker.setAttributeNS(null, "markerWidth", (radius * 2).toString());
            nMarker.setAttributeNS(null, "markerHeight", (radius * 2).toString());
            element.setAttributeNS(null, "data-fill", valuesObj["fill"]);
            break;
        case 'lineThumbtack':
            nMarker.innerHTML = '<g transform="rotate(135,192,256)"><path d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"></path></g>';
            nMarker.setAttributeNS(null, "stroke", 'black');
            nMarker.setAttributeNS(null, "stroke-width", "10");
            nMarker.setAttributeNS(null, "fill", valuesObj["fill"]);
            nMarker.setAttributeNS(null, "viewBox", "-8,-8,512,512"); //-8 seems ok, -5 clips
            nMarker.setAttributeNS(null, "refX", '5');
            nMarker.setAttributeNS(null, "refY", '80');
            nMarker.setAttributeNS(null, "markerWidth", (384 * strokeWidthF / 60).toString());
            nMarker.setAttributeNS(null, "markerHeight", (512 * strokeWidthF / 60).toString());
            element.setAttributeNS(null, "data-fill", valuesObj["fill"]);
            break;
    }
    const defs = window.svgDoodles.getElementsByTagNameNS(doodlexmlns, 'defs')[0];
    defs.appendChild(nMarker);
    element.setAttributeNS(null, "marker-start", "url('#" + mID + "')");
    element.setAttributeNS(null, "data-mid", mID);
}

function markerTypeSelected() {
    return document.getElementById("dropdown-menu-marker").getElementsByClassName('active')[0].getAttribute('data-shape');
}

function makeThisDOshapeBtnActive(btnID) {
    for (let item of document.getElementById("btngp-doShape").children) {
        item.classList.remove("active");
    }
    //cllts(btnID);
    document.getElementById(btnID).classList.add("active");
}

function dropdownMarkerClicked(btn) {
    for (let item of btn.parentNode.children) {
        item.classList.remove("active");
    }
    btn.classList.add("active");
    makeThisMarkerActive(btn.id);
    makeThisDOshapeBtnActive('btn-DSline');
    hideFillPanelForDataShape(btn.getAttribute('data-shape'));
}

function makeThisMarkerActive(id) {
    //cllts('makeThisMarkerActive',id);
    if (id.startsWith('btn-Markerline')) {
        for (let item of document.getElementById('dropdown-menu-marker').children) {
            item.classList.remove("active");
        }
        document.getElementById(id).classList.add("active");
    }
}

// ================================================= Utilities
/*
function addDelta(val, delta) {
    return (parseInt(val, 10) + parseInt(delta, 10));
}
*/

/*
switch (window.resizeDOtagName) {
    case 'ellipse':

        break;
    case 'rect':

        break;
    default:
}
*/
