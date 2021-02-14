/******************************************************************************
 * Copyright (c) 14/2/2021 4:22     djml.uk E&OE.                             *
 ******************************************************************************/
function toggleActionmenuToolbar(fromdropdown) {
    if(!!fromdropdown)$(fromdropdown).dropdown('hide');
    $("#modalActionMenu").modal('toggle');
}


function toggleUserGuide(anchorName) {
    if (locationType() !== runningLocalFile) {
        ["div-mainpage","div-userGuide"].forEach(e=>document.getElementById(e).toggleAttribute("hidden"));
        const anchor = document.querySelector("a[name='"+anchorName+"']");
        if(!!anchor) anchor.scrollIntoView();
        //because a screen rotation or resize when the image is obscured results in a blank image - force a redraw anyway:
        if(document.getElementById("div-mainpage").hidden === false) adjustCardWidthHeight();
    }
    else openLocalHelp(anchorName);
}

function loadHelp(){
    if (locationType() !== runningLocalFile) {
        fetch("userGuide.html")
            .then(checkStatus)
            .then(response => response.text())
            .then(text => {
                document.getElementById("div-userGuide-content").innerHTML = text.match(new RegExp("div>([\\s\\S]*)©"))[1]
            })
            .catch((e) => {
                console.log(e);
            });
    }
}

function openLocalHelp() {
    window.open("userGuide.html", "Vetanat User Guide");
}