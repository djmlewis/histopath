/******************************************************************************
 * Copyright (c) 9/4/2021 7:25     djml.uk E&OE.                              *
 ******************************************************************************/
function toggleActionmenuToolbar(fromdropdown) {
    if(!!fromdropdown)$(fromdropdown).dropdown('hide');
    $("#modalActionMenu").modal('toggle');
}


function toggleUserGuide(anchorName) {
    window.open("userGuide.html", "Parasites Atlas User Guide");
}

function loadHelp(){
/*
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
*/
}

/*
function openLocalHelp() {
    window.open("userGuide.html", "Parasites Atlas User Guide");
}*/
