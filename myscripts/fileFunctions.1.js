/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/

//----------------------------------------------------------- ******** FILE INPUT
function browserCanFileRead() {
    // Check for the various File API support.
    return (window.File && window.FileReader && window.FileList) //  && window.Blob
}

function handleFileSelectForImport(evt) {
    const fileinput = evt.target;
    let files = fileinput.files;
    let reader = new FileReader();
    let msg = "";
    let icon = "I";
    reader.onload = function () {
        const importfilesname = files[0].name;
        if (importfilesname.includes(fileinput.name)) {
            const fileContents = reader.result;
            switch (fileinput.name) {
                case bookmarksSuffix:
                    window.allBookmarksArchiveObj.importBookmarksString(fileContents, importfilesname);
                    break;
                case answersSuffix:
                    window.allRecordedAnswersArchiveObj.importThisObjectStr(fileContents);
                    // force a reload card image in case those buttons change
                    msg = 'Answers from the file <span class="spanAlert">' + importfilesname + '</span> have been merged with existing ones';
                    myAlert(msg, icon);
                    break;
                case sbnotesSuffix:
                    importSideNotesAfterConfirm(fileContents);
                    break;
                case pinotesSuffix:
                    importPostitsAfterConfirm(fileContents);
                    break;
            }
/*
            if (fileinput.name === bookmarksSuffix) {
                window.allBookmarksArchiveObj.importBookmarksString(fileContents, importfilesname);
            } else if (fileinput.name === answersSuffix) {
                window.allRecordedAnswersArchiveObj.importThisObjectStr(fileContents);
                // force a reload card image in case those buttons change
                msg = 'Answers from the file <span class="spanAlert">' + importfilesname + '</span> have been merged with existing ones';
                myAlert(msg, icon);
            }
*/
        } else {
            msg = 'Data from <span class="spanAlert">' + importfilesname + '</span> could not be imported as they are not of the correct type. Make sure the file suffix is ' + "'" + fileinput.name + "' ";
            icon = myAlert_alert;
            myAlert(msg, icon);
        }
        loadCardImage();
    };
    reader.onloadend = function () {
        document.body.removeChild(fileinput);
    };
    reader.onerror = function () {
        myAlert("There was an error and <span class='spanAlert'>" + files[0].name + "</span> could not be imported", myAlert_alert);
    };
    reader.readAsText(files[0]);
}

function importFileWithSuffix(acceptedSuffix, toolbar) {
    if (toolbar) toggleActionmenuToolbar();
    if (browserCanFileRead()) {
        let filebtn = document.createElement("input");
        filebtn.type = "file";
        filebtn.id = "file-importfavs;";
        filebtn.name = acceptedSuffix;
        filebtn.accept = acceptedSuffix;
        filebtn.addEventListener('change', handleFileSelectForImport, false);
        filebtn.style.display = 'none';
        document.body.appendChild(filebtn);
        filebtn.click();
    } else {
        myAlert("This browser lacks the ability to load files. Try a different, more modern browser", myAlert_alert);
    }
}

//----------------------------------------------------------- ******** FILE DOWNLOAD
function doExportObject(exportObject, filename) {
    const downloadUrl = URL.createObjectURL(new Blob([JSON.stringify(exportObject)], {type: "text/plain;charset=utf-8"}));
    const element = document.createElement('a');
    element.setAttribute('href', downloadUrl);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    setTimeout(function () {
        document.body.removeChild(element);
        URL.revokeObjectURL(downloadUrl);
    }, 250);
}


//----------------------------------------------------------- ******** OBJECT UPLOAD
/*
function handleObjectLoadData(evt){
    const obj = evt.target;
    cll(obj.contentDocument.body.innerHTML);
    //document.body.removeChild(obj);

}

function loadObject(path){
    let obj = document.createElement("object");
    obj.data=path;
    obj.type="text/plain";
    obj.addEventListener('load', handleObjectLoadData, false);
    //obj.height = "0px;";
    //obj.width = "0px;";
    document.body.appendChild(obj);

}

function getFileASyncho(filename) {
    let request = new XMLHttpRequest();
    request.open('GET', filename, false);  // `false` makes the request synchronous
    request.send(null);
    if (request.status === 200) {
        return request.responseText;
    } else {
        console.log("Unable to fetch: " + filename);
        return undefined;
    }
}
*/
