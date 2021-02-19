/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/

// ============ Global Index
function handle_showGlobalIndexClicked(fromdropdown) {
    if(!!fromdropdown)$(fromdropdown).dropdown('hide');
    const div = document.getElementById("list-globalIndex");
    const divpopesko = document.getElementById("list-globalIndexPopesko");
    const select = document.getElementById("select-globalIndexChapters");
    if (div.innerHTML.length === 0) {
        div.innerHTML = window.globalIndexHTML;
        divpopesko.innerHTML = window.globalIndexPopeskoHTML;
        const opt = document.createElement("option");
        opt.value = "";
        opt.text = "Select cardset to jump to…";
        opt.disabled = true;
        select.appendChild(opt);
        Array.from(div.querySelectorAll("h4")).forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.getAttribute("data-cset");
            opt.text = e.innerText;
            select.appendChild(opt);
        })
    }
    select.selectedIndex = 0;
    showSheet("sheet-globalindex");
    //$('#modal-globalIndex').modal();
}

function showGlobalIndexLineForCurrentCard() {
    const uniqueID = getSelectCardsSelectedCardObjectUniqueCardID();
    const div = document.getElementById("list-globalIndex").hidden ? document.getElementById("list-globalIndexPopesko") : document.getElementById("list-globalIndex");
    const galleryChildren = div.children;
    const childrenArray = Array.from(galleryChildren);
    childrenArray.forEach(c => c.classList.remove("list-globalIndex-selected"));
    const btnIndex = childrenArray.findIndex(child => child.getAttribute("data-cuid") === uniqueID);
    if (btnIndex !== -1) {
        galleryChildren[btnIndex].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
        galleryChildren[btnIndex].classList.add("list-globalIndex-selected");
        window.globalIndexSelectedLine = galleryChildren[btnIndex];
    } else if(!!galleryChildren[0])galleryChildren[0].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
    // scrollIntoView(block: "center") ensures it is centre below the header
    //document.getElementById("modal-globalIndex-body").scrollTo(0,0);
}

function downloadGlobalIndex() {
    if (locationType() !== runningLocalFile) {
        if (window.Worker) {
            const globalindexWorker = newTextWorker();
            globalindexWorker.onmessage = function (e) {
                if (e.data.length > 0) {
                    window.globalIndexHTML = e.data;
                    const globalindexWorker2 = newTextWorker();
                    globalindexWorker2.onmessage = function (e) {
                        if (e.data.length > 0) {
                            window.globalIndexPopeskoHTML = e.data;
                            revealGlobalIndexButtons();
                        }
                    };
                    globalindexWorker2.postMessage('indices/popeskoindex.html');
                }
            };
            globalindexWorker.postMessage('indices/globalindex.html');
        } else {
            fetch('indices/globalindex.html')
                .then(response => response.text())
                .then(text => {
                    window.globalIndexHTML = text;
                    fetch('indices/popeskoindex.html')
                        .then(response => response.text())
                        .then(text => {
                            window.globalIndexPopeskoHTML = text;
                            revealGlobalIndexButtons();
                        });
                });
        }
    } else {
        loadLocalScript("globalindex", "indices/globalindex." + window.indicesversionStr + ".js");
    }
}

function handleGlobalIndexLineClicked(target) {
    const ucid = target.getAttribute("data-cuid");
    if (!!ucid) handleGalleryClick(ucid, undefined, "sheet-globalindex");
}

function revealGlobalIndexButtons() {
    elementsArrayForClassName("showGlobalIndex").forEach(b => {
        b.disabled = false;
        b.title = "Open Global Index…";
    });
}

function handleGlobalIndexSelectChange(select) {
    const cset = select.value;
    const list = document.getElementById("list-globalIndex");
    const divIndex = Array.from(list.children).findIndex(h => h.getAttribute("data-cset") === cset);
    if (divIndex !== -1) list.children[divIndex].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
    select.selectedIndex = 0;
}

function showOnlyPopeskoGlobalIndex(showPopesko) {
    document.getElementById("select-globalIndexChapters").style.visibility = showPopesko? "hidden" : "visible";
    document.getElementById("list-globalIndex").hidden = showPopesko;
    document.getElementById("list-globalIndexPopesko").hidden = !showPopesko;
    showGlobalIndexLineForCurrentCard();
}

function downloadPopeskoThumbs() {
    if (locationType() !== runningLocalFile) {
        if (window.Worker) {
            const globalindexWorker = newJSONobjWorker();
            globalindexWorker.onmessage = function (e) {
                window.popeskoThumbsObj=e.data;
                addPopeskoThumbsToGallery();
            };
            globalindexWorker.postMessage('indices/popeskoThumbs.'+window.indicesversionStr+'.json');
        } else {
            fetch('indices/popeskoThumbs.'+window.indicesversionStr+'.json')
                .then(response => response.json())
                .then(data => {
                    window.popeskoThumbsObj=data;
                    addPopeskoThumbsToGallery();
                });
        }
    } else {
        loadLocalScript("globalindex", 'indices/popeskoThumbs.'+window.indicesversionStr+'.js');
    }
}

function addPopeskoThumbsToGallery() {
    if(!!window.popeskoThumbsObj) {
        const selectcardsset = document.getElementById("select-cardsset-gallery");
        let topt = document.createElement("option");
        topt.value = "";
        topt.text = "Atlas of Topographic Anatomy of Domestic Animals (Popesko)";
        topt.disabled=true;
        selectcardsset.appendChild(topt);
        Object.keys(window.popeskoThumbsObj).forEach(function (chaptername) {
            let opt = document.createElement("option");
            opt.value = String(chaptername); //<== this will not be found in window.collectionobject.cardsetObj[id] indicating it is a popeskoThumbs chapter
            opt.text = "\u00A0- "+String(chaptername);
            selectcardsset.appendChild(opt);
        });

    }
}